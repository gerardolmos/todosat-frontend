// Isolated local QA. Never loads the checkout's .env files.
import {mkdtemp,cp,symlink,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const mode=process.argv[2]??'--unit';
const year=process.argv.find(a=>/^--year=202[67]$/.test(a))?.split('=')[1]??'2026';
if(mode==='--unit'){
 const r=spawnSync(process.execPath,['--test',...['media','render'].map(n=>join(root,`tests/editorial-presentation/${n}.test.mjs`))],{stdio:'inherit',env:{PATH:process.env.PATH}});process.exit(r.status??1);
}
if(!['--build','--preview'].includes(mode))throw Error('Unknown mode');
const lab=await mkdtemp(join(tmpdir(),'todosat-editorial-'));
for(const name of ['src','public','package.json','astro.config.mjs','tsconfig.json'])await cp(join(root,name),join(lab,name),{recursive:true,filter:s=>!s.split('/').some(x=>x.startsWith('.env'))});
await symlink(join(root,'node_modules'),join(lab,'node_modules'));
const profile='(version 1)(allow default)(deny network*)(allow network-bind (local ip "localhost:*"))(allow network-inbound (local ip "localhost:*"))(allow network-outbound (remote ip "localhost:*"))(deny file-read* (regex #"/\\.env[^/]*$"))';
await writeFile(join(lab,'isolation.sb'),profile);
// Probe an unroutable test address: EPERM must come from the OS sandbox.
const probe=spawnSync('/usr/bin/sandbox-exec',['-f',join(lab,'isolation.sb'),process.execPath,'-e',`require('net').connect(9,'192.0.2.1').on('error',e=>{console.error(e.code);process.exit(['EPERM','EACCES'].includes(e.code)?0:2)});setTimeout(()=>process.exit(3),500);`],{encoding:'utf8',env:{PATH:process.env.PATH}});
if(probe.status!==0){console.error('ISOLATION_UNAVAILABLE: no build executed. '+probe.stderr.trim());process.exit(1);}
// The fixture worker starts a loopback API and builds inside this sandbox.
const result=spawnSync('/usr/bin/sandbox-exec',['-f',join(lab,'isolation.sb'),process.execPath,join(root,'tests/editorial-presentation/fixtures/build-worker.mjs'),lab,mode,year],{stdio:'inherit',env:{PATH:process.env.PATH,HOME:lab,ASTRO_TELEMETRY_DISABLED:'1',PUBLIC_STORE_ENABLED:'false'}});
process.exit(result.status??1);
