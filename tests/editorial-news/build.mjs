// Full build in a disposable checkout: no .env, no real tokens, no network, no server.
import {mkdtemp,cp,symlink,writeFile,readFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
import {verifyFrequencyPages} from '../operator-frequency/render.test.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));const lab=await mkdtemp(join(tmpdir(),'tsc-editorial-controls-'));
try {
 for(const name of ['src','public','scripts','package.json','astro.config.mjs','tsconfig.json'])await cp(join(root,name),join(lab,name),{recursive:true,filter:p=>!p.split('/').some(x=>x.startsWith('.env'))});
 await symlink(join(root,'node_modules'),join(lab,'node_modules'));
 const cats=[{id:1,documentId:'cat1',nombre:'Regulación',slug:'regulacion',activa:true},{id:2,documentId:'cat2',nombre:'Defensa',slug:'defensa',activa:true}];
 const op={id:1,documentId:'op1',nombre:'Con bandas',slug:'con-bandas',activa:true,descripcion_corta:'Fixture operador',descripcion_home:'Panel fixture',cobertura:'Global',satelites:'100',velocidad:'100 Mbps',latencia:'40 ms',tipo_orbita:'LEO',bandas_frecuencia:'Ku / Ka <script>'};
 const operators=[op,...[['sin-bandas',undefined],['bandas-vacias','  '],['bandas-null',null]].map(([slug,bands],i)=>({...op,id:i+2,documentId:'op'+(i+2),nombre:slug,slug,bandas_frecuencia:bands}))];
 const news=Array.from({length:12},(_,i)=>({id:i+1,documentId:'n'+i,titulo:`Noticia fixture ${i}`,slug:'noticia-'+i,activo:true,destacado:i!==0,fecha_publicacion:`2026-10-${String(25-i).padStart(2,'0')}`,categoria_noticia:cats[i<10?0:1],contenido:[{type:'paragraph',children:[{type:'text',text:'Texto ficticio.'}]}],operadores:[op],hardwares:[],manuales:[]}));
 const data={'/api/noticias':news,'/api/categoria-noticias':cats,'/api/operadores':operators,'/api/hardwares':[{id:1,nombre:'Hardware fixture',slug:'hardware-fixture',activo:true,tipo_hardware:'Movilidad',descripcion_corta:'Fixture',operador:op}],'/api/manuales':[], '/api/destacados':[{id:1,titulo:'Recomendación independiente',descripcion:'Fixture recomendado',activa:true,orden:1,noticia:news[0]}]};
 await writeFile(join(lab,'fixtures.json'),JSON.stringify(data));
 await writeFile(join(lab,'isolation.mjs'),`import net from 'node:net';import http from 'node:http';import https from 'node:https';import tls from 'node:tls';import {syncBuiltinESMExports} from 'node:module';import {readFileSync} from 'node:fs';
const deny=()=>{throw Error('NETWORK_FORBIDDEN');};net.Socket.prototype.connect=deny;net.connect=deny;net.createConnection=deny;tls.connect=deny;http.request=deny;http.get=deny;https.request=deny;https.get=deny;syncBuiltinESMExports();
const fixtures=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));
globalThis.fetch=async(input)=>{const url=new URL(typeof input==='string'?input:input.url||String(input));if(url.origin!=='http://127.0.0.1:9'||!(url.pathname in fixtures))throw Error('UNEXPECTED_FETCH');if(url.pathname==='/api/noticias'&&url.searchParams.get('status')!=='published')throw Error('PUBLISHED_REQUIRED');return new Response(JSON.stringify({data:fixtures[url.pathname],meta:{pagination:{pageCount:1}}}),{headers:{'Content-Type':'application/json'}});};
`);
 const env={PATH:process.env.PATH,HOME:lab,TMPDIR:lab,NODE_ENV:'production',ASTRO_TELEMETRY_DISABLED:'1',PUBLIC_STRAPI_URL:'http://127.0.0.1:9',STRAPI_API_TOKEN:'fictional',PUBLIC_STORE_ENABLED:'false',NODE_OPTIONS:`--import=${join(lab,'isolation.mjs')}`};
 const probe=spawnSync(process.execPath,['-e',`try {require('net').connect(9,'127.0.0.1');process.exit(2)} catch(e){if(e.message!=='NETWORK_FORBIDDEN')process.exit(3)}`],{cwd:lab,env,encoding:'utf8'});assert.equal(probe.status,0,'Network guard unavailable');
 for(const args of [[join(lab,'node_modules/astro/bin/astro.mjs'),'build'],[join(lab,'scripts/postbuild.mjs')]]){
 const r=spawnSync(process.execPath,args,{cwd:lab,env,encoding:'utf8',maxBuffer:8*1024*1024});
 if(r.status!==0){console.error(r.stdout,r.stderr);throw Error('Build failed');}
 console.log(r.stdout.split('\n').filter(x=>/pages? built|Complete|Tienda/.test(x)).join('\n'));
 }
 const dist=join(lab,'dist');const home=await readFile(join(dist,'index.html'),'utf8');
 const section=home.split('Noticias destacadas')[1].split('Ver todos los artículos')[0];
 assert(!section.includes('Noticia fixture 0'));for(let i=1;i<=7;i++)assert(section.includes('Noticia fixture '+i));assert(!section.includes('Noticia fixture 8'));
 assert(home.includes('Recomendación independiente'));assert(home.includes('noticia-0'));
 for(const path of ['noticias/regulacion','noticias/defensa','noticias/regulacion/2','noticias/noticia-0'])assert((await readFile(join(dist,path,'index.html'),'utf8')).length>0);
 const redirects=await readFile(join(dist,'_redirects'),'utf8');assert(redirects.includes('/noticias/gaming/2 /noticias/regulacion/2/ 301'));assert(!redirects.includes('/hardware'));
 await verifyFrequencyPages(dist);
 console.log('PASS: Home selection, independent recommendations, category routes/redirects, optional escaped bands and existing technical fields.');
} finally {await rm(lab,{recursive:true,force:true});}
