import {test} from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {writeNewsCategoryRedirects} from '../../scripts/news-category-redirects.mjs';
async function lab(t,paths){const root=await mkdtemp(join(tmpdir(),'tsc-redirect-'));t.after(()=>rm(root,{recursive:true,force:true}));for(const path of paths){await mkdir(join(root,path),{recursive:true});await writeFile(join(root,path,'index.html'),`<main data-news-category="${path.split('/')[1]}">fixture</main>`);}return root;}
test('new category routes redirect exact old URLs and page/order, not hardware or articles',async t=>{
 const root=await lab(t,['noticias/regulacion','noticias/regulacion/2','noticias/regulacion/orden/antiguos','noticias/defensa','hardware/tipo/movilidad']);
 const lines=await writeNewsCategoryRedirects(root);assert.equal(lines.length,8);assert(lines.includes('/noticias/gaming/2 /noticias/regulacion/2/ 301'));assert(!lines.some(x=>x.includes('/hardware/')));assert(!lines.some(x=>x.includes('*')));
 await writeNewsCategoryRedirects(root);assert.equal((await readFile(join(root,'_redirects'),'utf8')).trim().split('\n').length,8);
});
test('old routes and missing new destinations never redirected',async t=>{const root=await lab(t,['noticias/gaming','noticias/regulacion']);assert.deepEqual(await writeNewsCategoryRedirects(root),[])});
test('existing redirect rules remain authoritative',async t=>{const root=await lab(t,['noticias/defensa']);await writeFile(join(root,'_redirects'),'/noticias/movilidad /custom 302\n');await writeNewsCategoryRedirects(root);assert.match(await readFile(join(root,'_redirects'),'utf8'),/^\/noticias\/movilidad \/custom 302/)});

test('a news article matching new slug is not a category',async t=>{const root=await lab(t,['noticias/defensa']);await writeFile(join(root,'noticias/defensa/index.html'),'<main>Article</main>');assert.deepEqual(await writeNewsCategoryRedirects(root),[])});
