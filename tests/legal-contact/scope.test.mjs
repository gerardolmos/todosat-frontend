import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync,readdirSync} from 'node:fs';import {execFileSync} from 'node:child_process';
const dist=process.env.LEGAL_QA_DIST,baseline=process.env.LEGAL_QA_BASELINE;
const routes=['aviso-legal','privacidad','cookies','contacto'];
const docs=JSON.parse(readFileSync(process.env.LEGAL_QA_SOURCE+'/documents.json','utf8'));
const scripts=h=>[...h.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(x=>x[0]);
for(const r of routes)test('scope, navigation and scripts unchanged: '+r,()=>{
 const h=readFileSync(`${dist}/${r}/index.html`,'utf8'),b=readFileSync(`${baseline}/${r}/index.html`,'utf8');
 assert.deepEqual(scripts(h),scripts(b));assert.ok(h.includes('noindex, follow'));assert.ok(!/<form\b/i.test(h));
 for(const part of ['header','footer'])assert.equal(h.match(new RegExp(`<${part}\\b[\\s\\S]*?</${part}>`))?.[0],b.match(new RegExp(`<${part}\\b[\\s\\S]*?</${part}>`))?.[0]);
 assert.ok(!/localStorage|sessionStorage|document\.cookie|googletagmanager|googlesyndication|fundingchoicesmessages/.test(h));
});
test('banner retained only in original source, no DOCX in repository',()=>{
 assert.equal(Object.keys(docs).length,5);const banner=docs['Banner Cookies.docx'];assert.ok(banner.blocks.some(b=>b.runs.map(x=>x.text).join('').includes('[Aceptar] [Rechazar] [Configurar]')));
 function scan(p){for(const e of readdirSync(p,{withFileTypes:true})){const f=p+'/'+e.name;if(e.isDirectory())scan(f);else if(e.name.endsWith('.html')){const h=readFileSync(f,'utf8');assert.ok(!h.includes('[Aceptar] [Rechazar] [Configurar]'));assert.ok(!h.includes('Esta página web usa cookies'));}}}scan(dist);
 const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'});assert.ok(!files.split('\n').some(f=>f.endsWith('.docx')));
});
test('legal routes remain excluded from sitemap',()=>{const s=readFileSync(dist+'/sitemap-0.xml','utf8');for(const r of routes)assert.ok(!s.includes('/'+r+'/'));});
