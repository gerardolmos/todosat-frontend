const STRAPI_URL = 'http://localhost:1337';

export function getMediaUrl(media: any) {
    if (!media?.url) {
        return null;
    }

    if (media.url.startsWith('http')) {
        return media.url;
    }

    return `${STRAPI_URL}${media.url}`;
}