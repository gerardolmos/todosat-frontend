import {access, readFile, appendFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
const exists = async path => {try {await access(path);return true;} catch {return false;}};
/** Only generated category pages: no wildcard can swallow a news article or Hardware URL. */
export async function writeNewsCategoryRedirects(dist) {
    const file=join(dist,'_redirects');
    const previous=await readFile(file,'utf8').catch(error=>{if(error.code==='ENOENT')return '';throw error;});
    const lines=[];
    for(const [oldSlug,newSlug] of [['gaming','regulacion'],['movilidad','defensa']]) {
        // Do not replace an old category/article still present during the editorial transition.
        if(await exists(join(dist,'noticias',oldSlug,'index.html'))) continue;
        const target=join(dist,'noticias',newSlug);
        if(!await exists(join(target,'index.html'))) continue;
        if(!(await readFile(join(target,'index.html'),'utf8')).includes(`data-news-category="${newSlug}"`)) continue;
        async function walk(dir,suffix='') {
            for(const entry of await readdir(dir,{withFileTypes:true})) {
                if(entry.isDirectory()) await walk(join(dir,entry.name),`${suffix}/${entry.name}`);
                if(entry.name!=='index.html'||!entry.isFile())continue;
                if(suffix && !/^\/(?:\d+|orden\/antiguos(?:\/\d+)?)$/.test(suffix))continue;
                if(await exists(join(dist,'noticias',oldSlug,suffix,'index.html')))continue;
                const source=`/noticias/${oldSlug}${suffix}`;
                for(const from of [source,source+'/']) {
                    // Respect any explicitly configured existing rule.
                    if(previous.split('\n').some(line=>line.trim().split(/\s+/)[0]===from))continue;
                    lines.push(`${from} /noticias/${newSlug}${suffix}/ 301`);
                }
            }
        }
        await walk(target);
    }
    if(lines.length)await appendFile(file,(previous&&!previous.endsWith('\n')?'\n':'')+lines.join('\n')+'\n');
    return lines;
}
