/** Input is the published news feed; the archive and recommendations stay independent. */
export function selectFeaturedNews(news: any[]) {
    const seen = new Set<string>();
    const date = (item: any) => {
        const time = Date.parse(item.fecha_publicacion || item.publishedAt || "");
        return Number.isFinite(time) ? time : 0;
    };
    return news
        .filter((item) => item.activo === true && item.destacado === true)
        .slice()
        .sort((a, b) => date(b) - date(a))
        .filter((item) => {
            const key = String(item.documentId ?? item.id ?? item.slug);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .slice(0, 7);
}

/** Published feed only; mixed recommendations are deliberately not an input. */
export function selectHomeNews(news: any[]) {
    const identity = (item: any): string | null => {
        if (String(item.documentId ?? '').trim()) return `document:${item.documentId}`;
        if (item.id != null) return `id:${item.id}`;
        if (String(item.slug ?? '').trim()) return `slug:${item.slug}`;
        return null;
    };
    const date = (item: any) => {
        const value = Date.parse(item.fecha_publicacion || item.publishedAt || '');
        return Number.isFinite(value) ? value : -Infinity;
    };
    const ordinal = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
    let missing = 0;
    const ordered = news.filter(item => item.activo === true)
        .map(item => ({item, key: identity(item), date: date(item)}))
        .filter(entry => { if (entry.key === null) { missing++; return false; } return true; })
        .sort((a, b) => (a.date === b.date ? 0 : a.date > b.date ? -1 : 1)
            || ordinal(a.key!, b.key!)
            || ordinal(String(a.item.slug ?? ''), String(b.item.slug ?? ''))
            || ordinal(String(a.item.id ?? ''), String(b.item.id ?? '')));
    if (missing) console.warn(`[home-news] ${missing} noticias omitidas por falta de identidad estable.`);
    const seen = new Set<string>();
    const unique = ordered.filter(entry => {
        if (seen.has(entry.key!)) return false;
        seen.add(entry.key!);
        return true;
    });
    const selected = unique.filter(entry => entry.item.destacado === true).slice(0, 4);
    const featuredKeys = new Set(selected.map(entry => entry.key));
    return {
        featured: selected.map(entry => entry.item),
        recent: unique.filter(entry => !featuredKeys.has(entry.key)).slice(0, 7).map(entry => entry.item),
    };
}
