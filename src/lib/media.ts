// const STRAPI_URL = 'http://localhost:1337';

// export function getMediaUrl(media: any) {
//     if (!media?.url) {
//         return null;
//     }

//     if (media.url.startsWith('http')) {
//         return media.url;
//     }

//     return `${STRAPI_URL}${media.url}`;
// }


export function getMediaUrl(media: any) {
    if (!media?.url) {
        return null;
    }

    if (media.url.includes("/uploads/")) {
        return media.url.substring(media.url.indexOf("/uploads/"));
    }

    return media.url;
}