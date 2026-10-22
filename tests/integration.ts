import {MongoMemoryReplSet} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {hash} from 'bcryptjs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
async function main(){
const origin='http://127.0.0.1:3107';
const db=await MongoMemoryReplSet.create({replSet:{count:1,ip:'127.0.0.1'},instanceOpts:[{args:['--nounixsocket']}]});
let server:ReturnType<typeof spawn>|undefined;
let output='';
try{
 const uri=db.getUri('movieclub_integration');
 await mongoose.connect(uri);
 const database=mongoose.connection.db!;
 await database.collection('ratebuckets').createIndex({key:1},{unique:true});
 await database.collection('sessions').createIndex({tokenHash:1},{unique:true});
 await database.collection('contents').createIndex({slug:1},{unique:true});
 const userId=new mongoose.Types.ObjectId(), ownerId=new mongoose.Types.ObjectId(), contentId=new mongoose.Types.ObjectId();
 const password='Test-only-password-2026';
 await database.collection('users').insertMany([
  {_id:userId,name:'مدیر آزمایشی',username:'admin_test',email:'admin@example.test',password:await hash(password,10),role:'Admin'},
  {_id:ownerId,name:'مالک آزمایشی',username:'owner_test',email:'owner@example.test',password:await hash(password,10),role:'Owner'},
 ]);
 await database.collection('contents').insertOne({_id:contentId,title:'فیلم تست رندر سرور',slug:'server-render-test',type:'movie',year:2026,poster:'1780293224671-poster.jpg',description:'خلاصه قابل مشاهده در HTML اولیه',genres:['Drama'],actors:[],directors:['Test Director'],writers:[],languages:['فارسی'],countries:[],gallery:[],imdb:{rating:8,votes:1},createdAt:new Date(),updatedAt:new Date()});
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3107'],{env:{...process.env,MONGO_URI:uri,SITE_URL:origin},stdio:['ignore','pipe','pipe']});
 server.stdout?.on('data',d=>{output+=d});server.stderr?.on('data',d=>{output+=d});
 await new Promise<void>((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Server startup timeout '+output)),20000);const timer=setInterval(()=>{if(output.includes('Ready in')){clearInterval(timer);clearTimeout(timeout);resolve();}},50);server!.once('exit',()=>{clearInterval(timer);clearTimeout(timeout);reject(new Error(output));});});
 const request=(url:string,method='GET',body?:unknown,cookie?:string)=>fetch(origin+url,{method,headers:{...(method!=='GET'?{'Origin':origin,'Content-Type':'application/json'}:{}),...(cookie?{'Cookie':cookie}:{})},body:body===undefined?undefined:JSON.stringify(body),redirect:'manual'});
 const movie=await request('/movie/server-render-test');assert.equal(movie.status,200);const html=await movie.text();assert(html.includes('<h1'));assert(html.includes('فیلم تست رندر سرور'));assert(html.includes('خلاصه قابل مشاهده در HTML اولیه'));assert(html.includes('application/ld+json'));assert(html.includes('rel="canonical"'));console.log('PASS: initial movie HTML includes title, summary, canonical and JSON-LD');
 const home=await (await request('/')).text();assert(home.includes('فیلم تست رندر سرور'));console.log('PASS: home renders database contents on server');
 const redirect=await request('/Movies');assert.equal(redirect.status,308);assert(redirect.headers.get('location')?.includes('/movies'));console.log('PASS: old catalog URL redirects permanently');
 assert.equal((await request('/api/content','POST',{})).status,401);console.log('PASS: unauthenticated content writes rejected');
 const csrf=await fetch(origin+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin_test',password})});assert.equal(csrf.status,403);console.log('PASS: mutation without trusted origin rejected');
 const login=await request('/api/auth/login','POST',{username:'admin_test',password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];assert(login.headers.get('set-cookie')!.includes('HttpOnly'));console.log('PASS: existing bcrypt password logs in with HttpOnly session');
 const role=await request(`/api/users/${ownerId}`,'PUT',{role:'User'},cookie);assert.equal(role.status,403);const del=await request(`/api/users/${ownerId}`,'DELETE',undefined,cookie);assert.equal(del.status,403);console.log('PASS: Admin cannot demote or delete Owner');
 const create=await request('/api/content','POST',{title:'محتوای جدید آزمایشی',type:'movie',poster:'poster.jpg',genres:[],imdb:{rating:0}},cookie);assert.equal(create.status,201);const created=await create.json();assert(created.slug);console.log('PASS: authenticated content creation persists zero rating and slug');
 assert.equal((await request('/api/auth/register','POST',{username:'bad_test',name:'کاربر تست',email:'bad@example.test',password:'1'})).status,400);console.log('PASS: weak password rejected on server');
 const comment=await request('/api/comments','POST',{contentId:String(contentId),text:'دیدگاه تست'},cookie);assert.equal(comment.status,201);assert.equal((await database.collection('comments').findOne({contentId}))?.status,'pending');console.log('PASS: comments enter moderation');
 const contact=await request('/api/contact','POST',{name:'کاربر آزمایشی',email:'test@example.test',message:'پیام تماس برای تست یکپارچه'});assert.equal(contact.status,201);assert.equal(await database.collection('contactmessages').countDocuments(),1);console.log('PASS: contact success follows database persistence');
 const sitemap=await (await request('/sitemap.xml')).text();assert(sitemap.includes('/movie/server-render-test'));console.log('PASS: sitemap contains canonical content URL');
 const deleted=await request(`/api/content/${contentId}`,'DELETE',undefined,cookie);assert.equal(deleted.status,200);assert.equal(await database.collection('comments').countDocuments({contentId}),0);console.log('PASS: content deletion removes dependencies in transaction');
 const logout=await request('/api/auth/logout','POST',undefined,cookie);assert.equal(logout.status,200);assert.equal((await request('/api/auth/me','GET',undefined,cookie)).status,401);console.log('PASS: logout revokes server-side session');
 console.log('14 integration scenarios passed using a disposable MongoDB replica set.');
}catch(e){console.error(output);throw e;}finally{server?.kill('SIGTERM');await mongoose.disconnect();await db.stop();}

}
main().catch(error=>{console.error(error);process.exitCode=1;});
