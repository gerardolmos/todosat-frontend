import {mkdtemp,cp,symlink,writeFile,readFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
import sharp from 'sharp';import {operators,shapes} from './fixtures.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const lab=await mkdtemp(join(tmpdir(),'todosat-010-'));
try {
 for(const name of ['src','public','package.json','tsconfig.json'])await cp(join(root,name),join(lab,name),{recursive:true,filter:p=>!p.split('/').some(x=>x.startsWith('.env'))});
 const detail=await readFile(join(root,'src/pages/operadores/[slug]/index.astro'));
 await rm(join(lab,'src/pages'),{recursive:true});await mkdir(join(lab,'src/pages/operadores/[slug]'),{recursive:true});await writeFile(join(lab,'src/pages/operadores/[slug]/index.astro'),detail);
 await symlink(join(root,'node_modules'),join(lab,'node_modules'));
 await writeFile(join(lab,'astro.config.mjs'),`import {defineConfig} from 'astro/config';import tailwind from '@tailwindcss/vite';export default defineConfig({site:'http://127.0.0.1:14390',image:{domains:['fixtures.example.test']},vite:{plugins:[tailwind()]}});`);
 const baseline=JSON.parse(await readFile(join(root,'specs/010-operator-visual-adjustments/baseline.json'),'utf8'));const prior=spawnSync('git',['show',baseline.head+':src/components/HomeOperatorsSection.astro'],{cwd:root});assert.equal(prior.status,0);const before=prior.stdout;await writeFile(join(lab,'src/components/HomeOperatorsBefore.astro'),before);
 const nav=`<nav style="padding:16px;background:white;color:black"><a href="/">Actual</a> · <a href="/antes/">Anterior</a> · <a href="/operadores/fixture-0/">Bandas y texto escapado</a> · <a href="/operadores/fixture-1/">Sin bandas</a></nav>`;
 for(const [route,component] of [['index','HomeOperatorsSection'],['antes','HomeOperatorsBefore']])await writeFile(join(lab,`src/pages/${route}.astro`),`---\nimport Layout from '../layouts/Layout.astro';import Panel from '../components/${component}.astro';const marcas=${JSON.stringify(operators)};\n---\n<Layout title="QA local 010" robots="noindex,nofollow">${nav}<Panel marcas={marcas}/></Layout>`);
 const imageMap={};
 for(const [i,[width,height]] of shapes.entries()){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="none"/><rect x="2" y="2" width="${width-4}" height="${height-4}" rx="20" fill="#2299dd" fill-opacity="0.65" stroke="white" stroke-width="4"/><text x="10" y="60" font-size="36" fill="white">QA ${width}×${height}</text></svg>`;
  imageMap[`/logo-${i}.png`]=(await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
 }
 const data={'/api/operadores':operators,'/api/noticias':[],'/api/hardwares':[],'/api/manuales':[],'/api/categoria-noticias':[]};
 await writeFile(join(lab,'fixtures.json'),JSON.stringify({data,imageMap}));
 await writeFile(join(lab,'isolation.mjs'),`import net from 'node:net';import http from 'node:http';import https from 'node:https';import tls from 'node:tls';import {syncBuiltinESMExports} from 'node:module';import {readFileSync} from 'node:fs';const deny=()=>{throw Error('NETWORK_FORBIDDEN')};net.Socket.prototype.connect=deny;net.connect=deny;net.createConnection=deny;tls.connect=deny;http.request=deny;http.get=deny;https.request=deny;https.get=deny;syncBuiltinESMExports();const {data,imageMap}=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url)));globalThis.fetch=async input=>{const u=new URL(typeof input==='string'?input:input.url||String(input));if(!['http://127.0.0.1:9','https://fixtures.example.test'].includes(u.origin))throw Error('UNEXPECTED_ORIGIN');if(imageMap[u.pathname]){const response=new Response(Buffer.from(imageMap[u.pathname],'base64'),{headers:{'Content-Type':'image/png'}});Object.defineProperty(response,'url',{value:u.href});return response;}if(!(u.pathname in data))throw Error('UNEXPECTED_PATH');return new Response(JSON.stringify({data:data[u.pathname],meta:{pagination:{pageCount:1}}}),{headers:{'Content-Type':'application/json'}})};`);
 const env={PATH:process.env.PATH,HOME:lab,TMPDIR:lab,NODE_ENV:'production',ASTRO_TELEMETRY_DISABLED:'1',PUBLIC_STRAPI_URL:'http://127.0.0.1:9',STRAPI_API_TOKEN:'fictional',PUBLIC_STORE_ENABLED:'false',PUBLIC_CONSENT_ENABLED:'false',PUBLIC_SITE_INDEXING:'false',NODE_OPTIONS:`--import=${join(lab,'isolation.mjs')}`};
 const probe=spawnSync(process.execPath,['-e',`try {require('net').connect(9,'127.0.0.1');process.exit(2)} catch(e){if(e.message!=='NETWORK_FORBIDDEN')process.exit(3)}`],{cwd:lab,env});assert.equal(probe.status,0);
 const r=spawnSync(process.execPath,[join(lab,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:lab,env,encoding:'utf8',maxBuffer:8e6});if(r.status!==0){console.error(r.stdout,r.stderr);throw Error('ISOLATED_RENDER_FAILED');}
 console.log(r.stdout.split('\n').filter(l=>/pages? built|Complete/.test(l)).join('\n'));
 const dist=join(lab,'dist');
 // Ensure the preview cannot contact the intercepted media origin.
 for(const [url,b64] of Object.entries(imageMap))await writeFile(join(dist,url.slice(1)),Buffer.from(b64,'base64'));
 async function sanitize(dir){for(const e of await (await import('node:fs/promises')).readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await sanitize(p);else if(e.name.endsWith('.html'))await writeFile(p,(await readFile(p,'utf8')).replaceAll('https://fixtures.example.test/logo-','/logo-').replace('<head>','<head><meta http-equiv="Content-Security-Policy" content="default-src \'self\' data:; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; connect-src \'none\'; img-src \'self\' data:; font-src \'self\' data:">'));}}
 await sanitize(dist);
 await writeFile('/tmp/todosat-010-lab-path',lab);
 console.log('PREVIEW='+dist);
} catch(e){await rm(lab,{recursive:true,force:true});throw e;}
