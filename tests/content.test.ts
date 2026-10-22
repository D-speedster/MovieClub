import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, escapeRegex, safeJsonLd, parsePage, contentInput, posterUrl } from '../src/lib/content';
import { canManageUser } from '../src/lib/permissions';
test('search treats metacharacters as literal text',()=>{
 for(const query of ['[','(a+)+$','movie.*','a\\b','a?b','x{2}']) {
  const expression=new RegExp(escapeRegex(query),'i');
  assert(expression.test(query));
  assert(!expression.test('totally different'));
 }
});
test('JSON-LD safely roundtrips script-closing content',()=>{
 const data={name:'</script><script>alert(1)</script>',title:'فیلم'};
 const encoded=safeJsonLd(data);
 assert(!encoded.includes('<'));
 assert.deepEqual(JSON.parse(encoded),data);
});
test('slug supports Persian, has a fallback, and normalizes whitespace',()=>{
 assert.equal(slugify('  سلام دنیا!  '),'سلام-دنیا');
 assert.equal(slugify('A -- B'),'a-b');
 assert.equal(slugify('!!!'),'content');
});
test('pagination rejects noninteger, negative and excessive input',()=>{
 assert.equal(parsePage('NaN'),1);assert.equal(parsePage('-1'),1);assert.equal(parsePage('1.1'),1);assert.equal(parsePage('999999'),10000);
});
test('client payload cannot bypass server type and rating restrictions',()=>{
 const valid={title:'Test film',type:'movie',poster:'poster.jpg',genres:[],imdb:{rating:0}};
 assert(contentInput.safeParse(valid).success);
 assert(!contentInput.safeParse({...valid,type:'anime'}).success);
 assert(!contentInput.safeParse({...valid,imdb:{rating:99}}).success);
});
test('owner and self-management are protected for every role',()=>{
 for(const role of ['User','Admin','Owner'] as const){
  assert.equal(canManageUser({id:'a',role},{id:'b',role:'Owner'},'User'),false);
  assert.equal(canManageUser({id:'a',role},{id:'a',role:'User'}),false);
 }
 assert.equal(canManageUser({id:'a',role:'Admin'},{id:'b',role:'User'},'Owner'),false);
 assert.equal(canManageUser({id:'a',role:'Owner'},{id:'b',role:'User'},'Admin'),true);
});
test('poster filenames are encoded without changing existing absolute URLs',()=>{
 assert.equal(posterUrl('a b.jpg'),'/uploads/a%20b.jpg');
 assert.equal(posterUrl('https://images.example/a.jpg'),'https://images.example/a.jpg');
});
