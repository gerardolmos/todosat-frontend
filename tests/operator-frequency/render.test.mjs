import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
export async function verifyFrequencyPages(dist){
 const filled=await readFile(join(dist,'operadores/con-bandas/index.html'),'utf8');
 assert(filled.includes('Bandas de frecuencia'));assert(filled.includes('Ku / Ka &lt;script&gt;'));assert(!filled.includes('Ku / Ka <script>'));
 for(const label of ['Cobertura','Satélites','Velocidad','Latencia','Tipo de órbita'])assert(filled.includes(label));
 for(const slug of ['sin-bandas','bandas-vacias','bandas-null'])assert(!(await readFile(join(dist,'operadores',slug,'index.html'),'utf8')).includes('Bandas de frecuencia'));
}
