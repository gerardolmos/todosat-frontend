const STRAPI_URL = 'http://localhost:1337';

export async function fetchAPI(path: string) {
    const res = await fetch(`${STRAPI_URL}${path}`);

    if (!res.ok) {
        throw new Error(`Error al conectar con Strapi: ${res.status}`);
    }

    return res.json();
}

export { STRAPI_URL };