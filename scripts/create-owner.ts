import {connectDB} from '../src/lib/db';
import {User} from '../src/server/models';
import {hash} from 'bcryptjs';
import {z} from 'zod';
import mongoose from 'mongoose';
async function main(){try{const data=z.object({username:z.string().regex(/^[a-zA-Z0-9_]{3,30}$/),name:z.string().min(3),email:z.email(),password:z.string().min(12).max(72)}).parse({username:process.env.OWNER_USERNAME,name:process.env.OWNER_NAME,email:process.env.OWNER_EMAIL,password:process.env.OWNER_PASSWORD});await connectDB();if(await User.exists({$or:[{username:data.username},{email:data.email}]}))throw new Error('Account already exists; refusing to elevate it');await User.create({...data,password:await hash(data.password,12),role:'Owner'});console.log('Owner created; password is not logged.');}finally{await mongoose.disconnect();}}
main().catch(error=>{console.error(error);process.exitCode=1;});
