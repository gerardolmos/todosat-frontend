import test from 'node:test';
import assert from 'node:assert/strict';
import {selectHomeNews} from '../../src/lib/news-home.ts';
const item=(id,extra={})=>({documentId:id,id,slug:id,activo:true,destacado:false,fecha_publicacion:'2026-10-26',...extra});
for(const featured of [0,1,4,6])for(const general of [0,1,6,7,9])test(`${featured} featured / ${general} ordinary`,()=>{
 const input=[...Array.from({length:featured},(_,i)=>item('a'+i,{destacado:true})),...Array.from({length:general},(_,i)=>item('b'+i))];
 const before=structuredClone(input),out=selectHomeNews(input);
 assert.equal(out.featured.length,Math.min(4,featured));assert.equal(out.recent.length,Math.min(7,general+Math.max(0,featured-4)));
 assert.deepEqual(out.featured.map(x=>x.documentId),input.slice(0,Math.min(4,featured)).map(x=>x.documentId));
 assert.deepEqual(out.recent.map(x=>x.documentId),input.slice(Math.min(4,featured),Math.min(4,featured)+7).map(x=>x.documentId));
 assert.deepEqual(input,before);assert.deepEqual(selectHomeNews([...input].reverse()),out);
});
test('dedup before limits; inactive excluded; only strict featured true',()=>{
 const a=item('a',{destacado:true}),b=item('b',{destacado:'true'});const out=selectHomeNews([a,a,b,item('c',{activo:false})]);
 assert.deepEqual(out.featured,[a]);assert.deepEqual(out.recent,[b]);
});
test('date precedence, fallback, invalid dates and ordinal ties',()=>{
 const input=[item('z',{fecha_publicacion:'bad'}),item('b'),item('a'),item('d',{fecha_publicacion:null,publishedAt:'2026-10-27'}),item('c',{publishedAt:'2026-10-30'})];
 assert.deepEqual(selectHomeNews(input).recent.map(x=>x.documentId),['d','a','b','c','z']);
 assert.deepEqual(selectHomeNews(input.reverse()).recent.map(x=>x.documentId),['d','a','b','c','z']);
});
test('identity fallbacks and non-sensitive missing identity diagnostic',()=>{
 const warnings=[];const old=console.warn;console.warn=x=>warnings.push(x);
 try {const out=selectHomeNews([item('a'),item('a'),item('',{id:0,slug:'zero'}),item('',{id:null,slug:'s'}),item('',{id:null,slug:'',titulo:'PRIVATE'})]);assert.equal(out.recent.length,3);assert.equal(warnings.length,1);assert(!warnings.join().includes('PRIVATE'));}finally{console.warn=old}
});
test('duplicate identity/date chooses slug then id independently of input order',()=>{
 const a=item('same',{slug:'a',id:2}),b=item('same',{slug:'a',id:1}),c=item('same',{slug:'z',id:0});
 assert.deepEqual(selectHomeNews([a,b,c]).recent,[b]);assert.deepEqual(selectHomeNews([c,b,a]).recent,[b]);
});
