import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const base=p=>execFileSync('git',['show','eb18708aaa4f50d27bec7d3f4adced5388a7471b:'+p],{encoding:'utf8'});
const component='src/components/HomeArticlesSection.astro',index='src/pages/index.astro';
const cta=s=>s.match(/<a\s+href="\/noticias"[\s\S]*?<\/a>/g);
test('single original CTA unchanged, configurable title and visibility',()=>{const s=read(component);assert.deepEqual(cta(s),cta(base(component)));assert.equal(cta(s).length,1);assert.match(s,/showArchiveCard &&/);assert.match(s,/\{title\}/)});
test('Home diff restricted to selector and two news instances',()=>{
 assert.match(read(index), /selectHomeNews\(todosNoticias\)/);
 let s=read(index).replace('selectHomeNews','selectFeaturedNews').replace('const { featured, recent } = selectHomeNews(todosNoticias);','const noticias = selectFeaturedNews(todosNoticias);');
 s=s.replace(/\{featured.length > 0 && \([\s\S]*?\)\}\s*<HomeArticlesSection articulos=\{recent\} title="Noticias" showArchiveCard=\{true\} \/>/,'<HomeArticlesSection articulos={noticias} />');
 assert.equal(s,base(index));
});
test('legacy selector unchanged',()=>assert(read('src/lib/news-home.ts').startsWith(base('src/lib/news-home.ts'))));
for(const p of ['src/lib/content.ts','src/components/HomeFeaturedSection.astro','src/components/FeaturedCard.astro','src/components/ArticleCard.astro','src/components/HomeOperatorsSection.astro','src/components/HomeModelsSection.astro','src/components/HomeManualsSection.astro'])test('unchanged '+p,()=>assert.equal(read(p),base(p)));
