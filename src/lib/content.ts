import { fetchAPI } from './api';

export async function getMarcas() {
    const data = await fetchAPI('/api/marcas');

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