import { fetchAllAPI, fetchAPI } from "./api";

import type {
    CategoriaProductoTienda,
    ProductoTienda,
    StrapiCollectionResponse,
} from "../types/store";

const PRODUCTO_TIENDA_POPULATE = [
    "populate[imagen_principal]=true",
    "populate[galeria]=true",
    "populate[caracteristicas]=true",
    "populate[categoria_producto_tienda][populate][imagen]=true",
    "populate[hardware][populate][imagen_principal]=true",
    "populate[compatible_con][populate][imagen_principal]=true",
    "populate[accesorios_compatibles][populate][imagen_principal]=true",
].join("&");

const CATEGORIA_TIENDA_POPULATE =
    "populate[imagen]=true";

function sortByOrderThenName<T extends {
    orden: number;
    nombre: string;
}>(a: T, b: T) {
    if (a.orden !== b.orden) {
        return a.orden - b.orden;
    }

    return a.nombre.localeCompare(b.nombre, "es");
}

function filterActiveProducts(
    products: ProductoTienda[],
) {
    return products
        .filter((product) => product.activo)
        .sort(sortByOrderThenName);
}

export async function getCategoriasTienda():
Promise<CategoriaProductoTienda[]> {
    const response = await fetchAllAPI(
        `/api/categorias-productos-tienda?${CATEGORIA_TIENDA_POPULATE}`,
    );

    return (
        response.data as CategoriaProductoTienda[]
    )
        .filter((category) => category.activa)
        .sort(sortByOrderThenName);
}

export async function getProductosTienda():
Promise<ProductoTienda[]> {
    const response = await fetchAllAPI(
        `/api/productos-tienda?${PRODUCTO_TIENDA_POPULATE}`,
    );

    return filterActiveProducts(
        response.data as ProductoTienda[],
    );
}

export async function getProductosDestacadosTienda():
Promise<ProductoTienda[]> {
    const products = await getProductosTienda();

    return products.filter(
        (product) => product.destacado,
    );
}

export async function getProductosTiendaPorCategoria(
    categorySlug: string,
): Promise<ProductoTienda[]> {
    const normalizedSlug = categorySlug.trim();

    if (!normalizedSlug) {
        return [];
    }

    const response = await fetchAllAPI(
        `/api/productos-tienda?filters[categoria_producto_tienda][slug][$eq]=${encodeURIComponent(
            normalizedSlug,
        )}&${PRODUCTO_TIENDA_POPULATE}`,
    );

    return filterActiveProducts(
        response.data as ProductoTienda[],
    );
}

export async function getProductoTiendaPorSlug(
    slug: string,
): Promise<ProductoTienda | null> {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
        return null;
    }

    const response =
        await fetchAPI(
            `/api/productos-tienda?filters[slug][$eq]=${encodeURIComponent(
                normalizedSlug,
            )}&${PRODUCTO_TIENDA_POPULATE}`,
        ) as StrapiCollectionResponse<ProductoTienda>;

    const product = response.data?.[0];

    if (!product || !product.activo) {
        return null;
    }

    return product;
}
