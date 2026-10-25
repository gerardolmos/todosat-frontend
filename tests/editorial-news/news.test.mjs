import {test} from 'node:test';import assert from 'node:assert/strict';
import {selectFeaturedNews} from '../../src/lib/news-home.ts';
const n=(id,date,extra={})=>({documentId:id,slug:id,activo:true,destacado:true,fecha_publicacion:date,...extra});
test('only explicit featured active news, ordered, without input mutation',()=>{
 const data=[n('old','2025-01-01'),n('ordinary','2026-01-01',{destacado:false}),n('new','2026-01-02'),n('inactive','2026-01-03',{activo:false}),n('missing','2026-01-04',{destacado:undefined})];
 const copy=structuredClone(data);assert.deepEqual(selectFeaturedNews(data).map(x=>x.slug),['new','old']);assert.deepEqual(data,copy);
});
test('deduplicates documents and caps at seven',()=>{const data=Array.from({length:10},(_,i)=>n('n'+i,'2026-01-01'));assert.equal(selectFeaturedNews([...data,data[0]]).length,7);assert.equal(new Set(selectFeaturedNews([...data,data[0]]).map(x=>x.documentId)).size,7)});
test('empty selection never falls back to ordinary news',()=>assert.deepEqual(selectFeaturedNews([n('no','2026-01-01',{destacado:false})]),[]));
