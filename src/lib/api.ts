import { getSecret } from "astro:env/server";
import { STRAPI_URL } from "./strapi-url";

export async function fetchAPI(path: string) {
    const token = getSecret("STRAPI_API_TOKEN");

    const res = await fetch(`${STRAPI_URL}${path}`, {
        headers: token
            ? {
                  Authorization: `Bearer ${token}`,
              }
            : undefined,
    });

    if (!res.ok) {
        throw new Error(`Error al conectar con Strapi: ${res.status}`);
    }

    return res.json();
}

export async function fetchAllAPI(path: string) {
    const pageSize = 100;
    let page = 1;
    let allData: any[] = [];
    let pageCount = 1;

    do {
        const separator = path.includes("?") ? "&" : "?";
        const paginatedPath = `${path}${separator}pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

        const data = await fetchAPI(paginatedPath);

        allData = [...allData, ...(data.data || [])];

        pageCount = data.meta?.pagination?.pageCount || 1;
        page += 1;
    } while (page <= pageCount);

    return {
        data: allData,
    };
}
