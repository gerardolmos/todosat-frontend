import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const lab=(await readFile('/private/tmp/todosat-editorial-latest.txt','utf8')).trim();
const html=await readFile(lab+'/dist/index.html','utf8');
test('selector excludes description but panel keeps editorial text',()=>{const buttons=[...html.matchAll(/<button[^>]*data-operator-button[\s\S]*?<\/button>/g)].map(x=>x[0]);assert.ok(buttons.length);assert.ok(buttons.every(x=>!x.includes('Descripción preservada')));assert.ok(html.includes('Panel preservado'));assert.ok(buttons.filter(x=>x.includes('<img')).every(x=>x.includes('max-h-[55px]')&&x.includes('140px')));});
