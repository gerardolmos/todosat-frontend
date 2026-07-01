import { fetchAllAPI } from "./api";

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

export async function getOperadores() {
    const data = await fetchAllAPI("/api/operadores?populate=*");

    return data.data
        .filter((operador: any) => operador.activa)
        .sort(sortByName);
}

export async function getOperadoresHome() {
    const data = await fetchAllAPI("/api/operadores?populate=*");

    return data.data
        .filter((operador: any) => operador.activa)
        .sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre, "es"),
        );
}

export async function getNoticias() {
    const data = await fetchAllAPI(
        "/api/noticias?populate[imagen_principal]=true&populate[categoria_noticia]=true&populate[operadores][populate][imagen_portada]=true&populate[operadores][populate][logo]=true&populate[hardwares][populate][imagen_principal]=true&populate[manuales][populate][imagen_portada]=true"
    );

    return data.data
        .filter((noticia: any) => noticia.activo)
        .sort(sortByDateDesc);
}

export async function getCategoriasNoticia() {
    const data = await fetchAllAPI("/api/categoria-noticias?populate=*");

    return data.data
        .filter((categoria: any) => categoria.activa)
        .sort(sortByName);
}

export async function getHardwares() {
    const data = await fetchAllAPI("/api/hardwares?populate=*");

    return data.data
        .filter((hardware: any) => hardware.activo)
        .sort(sortByName);
}

export async function getManuales() {
    const data = await fetchAllAPI(
        "/api/manuales?populate[imagen_portada]=true&populate[archivo_pdf]=true&populate[operadores][populate][imagen_portada]=true&populate[operadores][populate][logo]=true&populate[hardwares][populate][imagen_principal]=true&populate[noticias][populate][imagen_principal]=true"
    );

    return data.data
        .filter((manual: any) => manual.activo)
        .sort(sortByYearDescThenTitle);
}

export async function getDestacados() {
    const data = await fetchAllAPI("/api/destacados?populate=*");

    return data.data
        .filter((destacado: any) => destacado.activa)
        .sort((a: any, b: any) => a.orden - b.orden);
}