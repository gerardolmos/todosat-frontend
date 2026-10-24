import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {readFileSync} from 'node:fs';
const dist=process.env.LEGAL_QA_DIST;
const docs=JSON.parse(readFileSync(process.env.LEGAL_QA_SOURCE+'/documents.json','utf8'));
const mapping=[['Aviso Legal','aviso-legal'],['Política de Privacidad','privacidad'],['Política de Cookies','cookies'],['Contacto','contacto']];
for(const [title,route] of mapping)test('literal blocks, lists, bold, breaks and email: '+route,()=>{
 const name=Object.keys(docs).find(n=>n.normalize('NFC')===title+'.docx');assert.ok(name);
 const r=spawnSync('python3',['tests/legal-contact/extract-documents.py','--verify',name,dist+'/'+route+'/index.html'],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);
});
