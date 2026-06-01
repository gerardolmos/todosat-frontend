import { fetchAPI } from './api';

export async function getMarcas() {
    const data = await fetchAPI('/api/marcas?populate=*');

    return data.data.filter((marca: any) => marca.activa);
}

export async function getArticulos() {
    const data = await fetchAPI('/api/articulos?populate=*');

    return data.data.filter((articulo: any) => articulo.activo);
}

export async function getCategorias() {
    const data = await fetchAPI('/api/categoria-tematicas?populate=*');

    return data.data.filter((categoria: any) => categoria.activa);
}

export async function getModelos() {
    const data = await fetchAPI('/api/modelos?populate=*');

    return data.data.filter((modelo: any) => modelo.activo);
}

export async function getManuales() {
    const data = await fetchAPI(
        "/api/manuals?populate[imagen_portada]=true&populate[archivo_pdf]=true&populate[marcas][populate][imagen_portada]=true&populate[marcas][populate][logo]=true&populate[modelos][populate][imagen_principal]=true&populate[articulos][populate][imagen_principal]=true"
    );

    return data.data.filter((manual: any) => manual.activo);
}

export async function getDestacados() {
    const data = await fetchAPI('/api/destacados?populate=*');

    return data.data
        .filter((destacado: any) => destacado.activa)
        .sort((a: any, b: any) => a.orden - b.orden);
}

export async function getMarcasDestacadas() {
    const marcas = await getMarcas();

    return marcas.filter((marca: any) => marca.destacada);
}