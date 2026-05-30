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
    const data = await fetchAPI('/api/manuals?populate=*');

    return data.data.filter((manual: any) => manual.activo);
}

export async function getDestacados() {
    const data = await fetchAPI('/api/destacados?populate=*');

    return data.data
        .filter((destacado: any) => destacado.activa)
        .sort((a: any, b: any) => a.orden - b.orden);
}