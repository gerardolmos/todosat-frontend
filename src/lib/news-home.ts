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
