// Full build in a disposable checkout: no .env, no real tokens, no network, no server.
import {mkdtemp,cp,symlink,writeFile,readFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../../',import.meta.url));const lab=await mkdtemp(join(tmpdir(),'tsc-home-news-'));
try {
 for(const name of ['src','public','scripts','package.json','astro.config.mjs','tsconfig.json'])await cp(join(root,name),join(lab,name),{recursive:true,filter:p=>!p.split('/').some(x=>x.startsWith('.env'))});
 await symlink(join(root,'node_modules'),join(lab,'node_modules'));
 const cats=[{id:1,documentId:'cat1',nombre:'Regulación',slug:'regulacion',activa:true},{id:2,documentId:'cat2',nombre:'Defensa',slug:'defensa',activa:true}];
 const op={id:1,documentId:'op1',nombre:'Con bandas',slug:'con-bandas',activa:true,descripcion_corta:'Fixture operador',descripcion_home:'Panel fixture',cobertura:'Global',satelites:'100',velocidad:'100 Mbps',latencia:'40 ms',tipo_orbita:'LEO',bandas_frecuencia:'Ku / Ka <script>'};
 const operators=[op,...[['sin-bandas',undefined],['bandas-vacias','  '],['bandas-null',null]].map(([slug,bands],i)=>({...op,id:i+2,documentId:'op'+(i+2),nombre:slug,slug,bandas_frecuencia:bands}))];
 const news=Array.from({length:12},(_,i)=>({id:i+1,documentId:'n'+i,titulo:`Noticia fixture ${i}`,slug:'noticia-'+i,activo:true,destacado:i!==0,fecha_publicacion:`2026-10-${String(25-i).padStart(2,'0')}`,categoria_noticia:cats[i<10?0:1],contenido:[{type:'paragraph',children:[{type:'text',text:'Texto ficticio.'}]}],operadores:[op],hardwares:[],manuales:[]}));
 const manual={id:1,titulo:'Manual fixture',slug:'manual-fixture',activo:true,descripcion:'Ficticio',contenido:[]};
 const data={'/api/noticias':news,'/api/categoria-noticias':cats,'/api/operadores':operators,'/api/hardwares':[{id:1,nombre:'Hardware fixture',slug:'hardware-fixture',activo:true,tipo_hardware:'Movilidad',descripcion_corta:'Fixture',operador:op}],'/api/manuales':[manual], '/api/destacados':[{noticia:news[0]},{operador:op},{hardware:{slug:'hardware-fixture'}},{manual}].map((relation,i)=>({id:i+1,titulo:'Recomendación '+i,descripcion:'Fixture recomendado',activa:true,orden:i+1,...relation}))};
 const cases=[['qa009-zero',0,12],['qa009-one',1,3],['qa009-four',4,12],['qa009-many',6,12],['qa009-empty',0,0],['qa009-only',1,1]];
 const index=await readFile(join(lab,'src/pages/index.astro'),'utf8');
 for(const [name,featured,total] of cases){
  const page=index.replace('const todosNoticias = await getNoticias();',`const todosNoticias = (await getNoticias()).slice(0, ${total}).map((n, i) => ({...n, destacado: i < ${featured}}));`);
  await writeFile(join(lab,'src/pages',name+'.astro'),page);
 }
 await writeFile(join(lab,'fixtures.json'),JSON.stringify(data));
 await writeFile(join(lab,'isolation.mjs'),`import net from 'node:net';import http from 'node:http';import https from 'node:https';import tls from 'node:tls';import {syncBuiltinESMExports} from 'node:module';import {readFileSync} from 'node:fs';
const deny=()=>{throw Error('NETWORK_FORBIDDEN');};net.Socket.prototype.connect=deny;net.connect=deny;net.createConnection=deny;tls.connect=deny;http.request=deny;http.get=deny;https.request=deny;https.get=deny;syncBuiltinESMExports();
const fixtures=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));
globalThis.fetch=async(input)=>{const url=new URL(typeof input==='string'?input:input.url||String(input));if(url.origin!=='http://127.0.0.1:9'||!(url.pathname in fixtures))throw Error('UNEXPECTED_FETCH');if(url.pathname==='/api/noticias'&&url.searchParams.get('status')!=='published')throw Error('PUBLISHED_REQUIRED');return new Response(JSON.stringify({data:fixtures[url.pathname],meta:{pagination:{pageCount:1}}}),{headers:{'Content-Type':'application/json'}});};
`);
 const env={PATH:process.env.PATH,HOME:lab,TMPDIR:lab,NODE_ENV:'production',PUBLIC_CONSENT_ENABLED:'true',PUBLIC_CMP_DOMAIN_GROUP_ID:'00000000-0000-4000-8000-000000000008',PUBLIC_CONSENT_ORIGIN:'https://example.test',ASTRO_TELEMETRY_DISABLED:'1',PUBLIC_STRAPI_URL:'http://127.0.0.1:9',STRAPI_API_TOKEN:'fictional',PUBLIC_STORE_ENABLED:'false',NODE_OPTIONS:`--import=${join(lab,'isolation.mjs')}`};
 const probe=spawnSync(process.execPath,['-e',`try {require('net').connect(9,'127.0.0.1');process.exit(2)} catch(e){if(e.message!=='NETWORK_FORBIDDEN')process.exit(3)}`],{cwd:lab,env,encoding:'utf8'});assert.equal(probe.status,0,'Network guard unavailable');
 for(const args of [[join(lab,'node_modules/astro/bin/astro.mjs'),'build'],[join(lab,'scripts/postbuild.mjs')]]){
 const r=spawnSync(process.execPath,args,{cwd:lab,env,encoding:'utf8',maxBuffer:8*1024*1024});
 if(r.status!==0){console.error(r.stdout,r.stderr);throw Error('Build failed');}
 console.log(r.stdout.split('\n').filter(x=>/pages? built|Complete|Tienda/.test(x)).join('\n'));
 }
 const dist=join(lab,'dist');
 const sections=html=>[...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(m=>m[0]);
 const block=(html,title)=>sections(html).find(s=>new RegExp('<h2[^>]*>\\s*'+title+'\\s*</h2>').test(s));
 const links=s=>[...s.matchAll(/href="(\/noticias\/noticia-\d+)"/g)].map(m=>m[1]);
 const home=await readFile(join(dist,'index.html'),'utf8');
 const recommendation=block(home,'Recomendados por TodoSatcom');assert(recommendation);
 for(const route of ['/noticias/noticia-0','/operadores/con-bandas','/hardware/hardware-fixture','/manuales/manual-fixture'])assert(recommendation.includes(route));
 for(const [name,featured,total] of cases){
  const html=await readFile(join(dist,name,'index.html'),'utf8');
  const f=block(html,'Noticias destacadas'),g=block(html,'Noticias');assert(g);
  assert.equal(!!f,featured>0);assert.equal((html.match(/Ver todos los artículos/g)||[]).length,1);
  assert(g.includes('Ver todos los artículos'));assert(!f||!f.includes('Ver todos los artículos'));
  const count=Math.min(4,featured);assert.equal(f?links(f).length:0,count);assert.equal(links(g).length,Math.min(7,total-count));
  const all=[...(f?links(f):[]),...links(g)];assert.equal(new Set(all).size,all.length);
  assert.deepEqual(f?links(f):[],Array.from({length:count},(_,i)=>'/noticias/noticia-'+i));
  assert.deepEqual(links(g),Array.from({length:Math.min(7,total-count)},(_,i)=>'/noticias/noticia-'+(i+count)));
  assert.equal(block(html,'Recomendados por TodoSatcom'),recommendation);
  assert(html.indexOf(recommendation)<html.indexOf(g));if(f)assert(html.indexOf(recommendation)<html.indexOf(f)&&html.indexOf(f)<html.indexOf(g));
  console.log('PASS HTML '+name+': '+count+' featured, '+links(g).length+' recent, original CTA once');
 }
 assert((await readFile(join(dist,'noticias/noticia-0/index.html'),'utf8')).length>0);
 assert(home.includes('noticia-0')); // still in search/archive and mixed recommendations
 if(process.argv.includes('--preview')){
  const preview=await mkdtemp(join(tmpdir(),'tsc-home-news-preview-'));await cp(dist,preview,{recursive:true});console.log('PREVIEW='+preview);
 }
 console.log('PASS isolated full build and six Home scenarios; no production connections.');
} finally {await rm(lab,{recursive:true,force:true});}
