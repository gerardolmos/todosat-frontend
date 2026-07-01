import { fetchAllAPI } from './api';

function sortByName(a: any, b: any) {
    return (a.nombre || "").localeCompare(b.nombre || "", "es");
}

function sortByTitle(a: any, b: any) {
    const titleA = a.titulo || a.nombre || "";
    const titleB = b.titulo || b.nombre || "";

    return titleA.localeCompare(titleB, "es");
}

function sortByDateDesc(a: any, b: any) {
    const dateA = new Date(a.fecha_publicacion || a.publishedAt || 0).getTime();
    const dateB = new Date(b.fecha_publicacion || b.publishedAt || 0).getTime();

    return dateB - dateA;
}

function sortByYearDescThenTitle(a: any, b: any) {
    const yearA = Number(a.ano_publicacion || 0);
    const yearB = Number(b.ano_publicacion || 0);

    if (yearA !== yearB) {
        return yearB - yearA;
    }

    return sortByTitle(a, b);
}

export async function getMarcas() {
    const data = await fetchAllAPI('/api/marcas?populate=*');

    return data.data
        .filter((marca: any) => marca.activa)
        .sort(sortByName);
}

export async function getMarcasHome() {
    const data = await fetchAllAPI("/api/marcas?populate=*");

    return data.data
        .filter((marca: any) => marca.activa)
        .sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre, "es"),
        );
}

export async function getArticulos() {
    const data = await fetchAllAPI(
        "/api/articulos?populate[imagen_principal]=true&populate[categoria_tematica]=true&populate[marcas][populate][imagen_portada]=true&populate[marcas][populate][logo]=true&populate[modelos][populate][imagen_principal]=true&populate[manuals][populate][imagen_portada]=true"
    );

    return data.data
        .filter((articulo: any) => articulo.activo)
        .sort(sortByDateDesc);
}

export async function getCategorias() {
    const data = await fetchAllAPI('/api/categoria-tematicas?populate=*');

    return data.data
        .filter((categoria: any) => categoria.activa)
        .sort(sortByName);
}

export async function getModelos() {
    const data = await fetchAllAPI('/api/modelos?populate=*');

    return data.data
        .filter((modelo: any) => modelo.activo)
        .sort(sortByName);
}

export async function getManuales() {
    const data = await fetchAllAPI(
        "/api/manuals?populate[imagen_portada]=true&populate[archivo_pdf]=true&populate[marcas][populate][imagen_portada]=true&populate[marcas][populate][logo]=true&populate[modelos][populate][imagen_principal]=true&populate[articulos][populate][imagen_principal]=true"
    );

    return data.data
        .filter((manual: any) => manual.activo)
        .sort(sortByYearDescThenTitle);
}

export async function getDestacados() {
    const data = await fetchAllAPI('/api/destacados?populate=*');

    return data.data
        .filter((destacado: any) => destacado.activa)
        .sort((a: any, b: any) => a.orden - b.orden);
}