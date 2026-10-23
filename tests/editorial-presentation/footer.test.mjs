import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const lab=(await readFile('/private/tmp/todosat-editorial-latest.txt','utf8')).trim();
const year=(await readFile(lab+'/qa-year.txt','utf8')).trim();
const html=await readFile(lab+'/dist/index.html','utf8');
test('approved footer text and dynamic build year',()=>{assert.match(html,/ecosistema de comunicación satelital\./);assert.match(html,new RegExp('Todos los derechos reservados © '+year+' TodoSatcom\\.'));for(const link of ['aviso-legal','privacidad','cookies','contacto'])assert.ok(html.includes('href="/'+link+'"'));});
