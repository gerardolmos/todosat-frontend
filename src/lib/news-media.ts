/** Presentation only. No default network transport or credentials. */
type Identity = { hash: string; provider: string; url: string };
type Options = {
    lookup?: (identity: Identity, signal: AbortSignal) => Promise<any>;
    diagnose?: (message: string) => void;
    timeoutMs?: number;
};
export async function resolveNewsImages(blocks: any[], options: Options = {}) {
    const output = new Map<number, any>();
    const cache = new Map<string, Promise<any>>();
    const entries = (Array.isArray(blocks) ? blocks : []).map((block, index) => ({block,index})).filter(({block}) => block?.type === 'image');
    let cursor = 0;
    async function lookup(image: any) {
        const identity = {hash:image.hash, provider:image.provider, url:image.url};
        if (!options.lookup || !Object.values(identity).every(v=>typeof v==='string' && v.length>0)) return null;
        const key=JSON.stringify(identity);
        if (!cache.has(key)) cache.set(key,(async()=>{
            const controller=new AbortController();
            let timer: ReturnType<typeof setTimeout> | undefined;
            try {
                const result=await Promise.race([
                    options.lookup!(identity,controller.signal),
                    new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('timeout'));},options.timeoutMs??10000);}),
                ]);
                const pagination=result?.meta?.pagination;
                const media=result?.data?.[0];
                if (!Array.isArray(result?.data) || result.data.length!==1 || pagination?.limit!==2 || pagination?.total!==1 || !media || !Object.entries(identity).every(([k,v])=>media[k]===v) || !(typeof media.caption==='string' || media.caption===null)) return null;
                return {caption:media.caption??'',source:'library'};
            } catch { return null; } finally { clearTimeout(timer); }
        })());
        return cache.get(key);
    }
    async function worker() {
        while(cursor<entries.length){
            const {block,index}=entries[cursor++];
            const image=block.image??{};
            const resolved=await lookup(image);
            if (typeof image.url !== 'string' || !/^(https?:\/\/|\/(?!\/))/.test(image.url) || /[\u0000-\u0020\\]/.test(image.url)) options.diagnose?.(`[editorial-image] block=${index} invalid-url image-omitted`);
            if (!resolved) options.diagnose?.(`[editorial-caption] block=${index} source=historical current-library-caption=unverified`);
            output.set(index,{url:image.url,alt:typeof image.alternativeText==='string'?image.alternativeText:'',width:image.width,height:image.height,caption:typeof image.caption==='string'?image.caption:'',source:'historical',...resolved});
        }
    }
    await Promise.all(Array.from({length:Math.min(4,entries.length)},worker));
    return output;
}
