import http from 'node:http';
import {writeFile,readFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
const [lab,mode,year]=process.argv.slice(2);
const require=createRequire(new URL('../../../package.json',import.meta.url));
const sharp=require('sharp');
const png=await sharp({create:{width:600,height:300,channels:3,background:'#aaccee'}}).png().toBuffer();
const tall=await sharp({create:{width:200,height:600,channels:3,background:'#bbaaee'}}).png().toBuffer();
const square=await sharp({create:{width:400,height:400,channels:3,background:'#eeccaa'}}).png().toBuffer();
const server=http.createServer((req,res)=>{
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 const path=new URL(req.url,'http://127.0.0.1').pathname;
 if(['/fixture.png','/tall.png','/square.png'].includes(path)){res.setHeader('Content-Type','image/png');res.end(path==='/tall.png'?tall:path==='/square.png'?square:png);return;}
 const media={url:`http://127.0.0.1:${server.address().port}/fixture.png`,width:600,height:300,alternativeText:'Imagen ficticia',caption:'Caption principal <literal>',hash:'fixture',provider:'local'};
 const operator={id:1,nombre:'Operador ficticio',slug:'operador-ficticio',activa:true,tipo_orbita:'LEO',descripcion_corta:'Descripción preservada',descripcion_home:'Panel preservado',logo:media,imagen_portada:media};
 const news={id:1,titulo:'Noticia ficticia',slug:'noticia-ficticia',activo:true,fecha_publicacion:'2026-10-23',imagen_principal:media,contenido:[{type:'paragraph',children:[{text:'Antes'}]},{type:'image',image:{...media,caption:'Caption histórico <script>literal</script>'}},{type:'paragraph',children:[{text:'Después'}]}],operadores:[],hardwares:[],manuales:[]};
 const variants=[news,...[['vertical',200,600,'tall'],['cuadrada',400,400,'square']].map(([slug,width,height,file])=>({...news,slug,titulo:slug,imagen_principal:{...media,url:media.url.replace('fixture',file),width,height},contenido:[{type:'image',image:{...media,url:media.url.replace('fixture',file),width,height,caption:'Pie largo '+('palabra'.repeat(40))}}]})),{...news,slug:'sin-imagen',imagen_principal:null,contenido:[]}];
 const operators=[operator,{...operator,id:2,nombre:'Operador vertical con nombre extenso',slug:'vertical',logo:{...media,url:media.url.replace('fixture','tall'),width:200,height:600}},{...operator,id:3,nombre:'Operador cuadrado',slug:'cuadrado',logo:{...media,url:media.url.replace('fixture','square'),width:400,height:400}},{...operator,id:4,nombre:'Sin logo',slug:'sin-logo',logo:null}];
 const data=path==='/api/noticias'?variants:path==='/api/operadores'?operators:[];
 res.setHeader('Content-Type','application/json');res.end(JSON.stringify({data,meta:{pagination:{pageCount:1}}}));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const env={...process.env,PUBLIC_STRAPI_URL:`http://127.0.0.1:${server.address().port}`,STRAPI_API_TOKEN:'fixture-token-not-secret'};
// Add only loopback image permission in temporary config, never the checkout.
const config=join(lab,'astro.config.mjs');await writeFile(config,(await readFile(config,'utf8')).replace('remotePatterns: [','remotePatterns: [{protocol:"http",hostname:"127.0.0.1"},'));
await writeFile(join(lab,'clock.mjs'),`const OriginalDate=Date;globalThis.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:['${year}-10-23T12:00:00Z']));}static now(){return new OriginalDate('${year}-10-23T12:00:00Z').getTime();}};`);
const child=spawn(process.execPath,['--import',join(lab,'clock.mjs'),join(lab,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:lab,env,stdio:'inherit'});
const status=await new Promise(r=>child.on('exit',r));
if(mode!=='--preview') server.close();
if(status!==0)process.exit(status??1);
await writeFile(join(lab,'qa-year.txt'),year);
console.log(`EDITORIAL_LAB=${lab}`);
await writeFile('/private/tmp/todosat-editorial-latest.txt',lab);
if(mode==='--preview'){
 const preview=spawn(process.execPath,[join(lab,'node_modules/astro/bin/astro.mjs'),'preview','--host','127.0.0.1','--port','14378'],{cwd:lab,env,stdio:'inherit'});
 await new Promise(r=>preview.on('exit',r));
}
