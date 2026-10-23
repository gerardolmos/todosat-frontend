import test from 'node:test';
import assert from 'node:assert/strict';
import {renderBlocks} from '../../src/lib/renderBlocks.ts';
import {renderBlocks as before} from './fixtures/renderBlocks-before.ts';
const blocks=[{type:'heading',level:2,children:[{text:'Título',bold:true}]},{type:'paragraph',children:[{text:'Texto',italic:true}]},{type:'list',format:'ordered',children:[{children:[{text:'Uno'}]}]},{type:'image',image:{url:'/fixture.png',caption:'pie'}}];
test('shared consumers preserve default output',()=>assert.equal(renderBlocks(blocks),before(blocks)));
test('news image opt-in escapes caption and alt and keeps order',()=>{
 const map=new Map([[3,{url:'/fixture.png',caption:'<script>"&',alt:'" onload="bad',source:'historical'}]]);
 const html=renderBlocks(blocks,{images:map});
 assert.match(html,/<figure/);assert.match(html,/&lt;script&gt;&quot;&amp;/);assert.ok(!html.includes('<script>'));assert.ok(html.indexOf('<figure')>html.indexOf('</ol>'));
});
test('unsafe URL omitted, empty caption has no figcaption',()=>{
 assert.equal(renderBlocks([{type:'image'}],{images:new Map([[0,{url:'javascript:bad',caption:'x'}]])}), '');
 assert.ok(!renderBlocks([{type:'image'}],{images:new Map([[0,{url:'/x.png',caption:'   '}]])}).includes('figcaption'));
});
test('all supported text formats and heading levels retain baseline',()=>{const input=[...Array.from({length:6},(_,i)=>({type:'heading',level:i+1,children:[{text:'Título'}]})),{type:'paragraph',children:[{text:'Texto',bold:true,italic:true,underline:true,strikethrough:true}]},{type:'list',format:'unordered',children:[{children:[{text:'Elemento'}]}]},{type:'unsupported'},...blocks];assert.equal(renderBlocks(input),before(input));assert.equal(renderBlocks(null),before(null));});
