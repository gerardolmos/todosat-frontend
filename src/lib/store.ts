import { fetchAllAPI, fetchAPI } from "./api";

import type {
    CategoriaProductoTienda,
    CategoriaTiendaConConteo,
    PaginaTienda,
    ProductoTienda,
    ProductoTiendaResumen,
    StrapiCollectionResponse,
    StrapiPagination,
} from "../types/store";

export const PRODUCTOS_TIENDA_POR_PAGINA = 24;

const PRODUCTO_RESUMEN_FIELDS = [
    "fields[0]=nombre",
    "fields[1]=slug",
    "fields[2]=sku",
    "fields[3]=tipo_producto",
    "fields[4]=precio_centimos",
    "fields[5]=moneda",
    "fields[6]=estado_venta",
    "fields[7]=activo",
    "fields[8]=destacado",
    "fields[9]=orden",
    "fields[10]=requiere_envio",
    "fields[11]=descripcion_corta",
].join("&");

const PRODUCTO_RESUMEN_POPULATE = [
    "populate[imagen_principal]=true",
    "populate[categoria_producto_tienda][fields][0]=nombre",
    "populate[categoria_producto_tienda][fields][1]=slug",
].join("&");

const PRODUCTO_DETALLE_POPULATE = [
    "populate[imagen_principal]=true",
    "populate[galeria]=true",
    "populate[caracteristicas]=true",
    "populate[categoria_producto_tienda][populate][imagen]=true",
    "populate[hardware][populate][imagen_principal]=true",
    "populate[compatible_con][populate][imagen_principal]=true",
    "populate[accesorios_compatibles][populate][imagen_principal]=true",
].join("&");

const FILTROS_CATALOGO = [
    "filters[activo][$eq]=true",
    `filters[estado_venta][$ne]=${encodeURIComponent(
        "Descatalogado",
    )}`,
].join("&");

const ORDEN_CATALOGO = [
    "sort[0]=orden:asc",
    "sort[1]=nombre:asc",
].join("&");

function normalizePositiveInteger(
    value: number,
    fallback: number,
) {
    if (!Number.isInteger(value) || value < 1) {
        return fallback;
    }

    return value;
}

function getPagination(
    response:
        StrapiCollectionResponse<unknown>,
    requestedPage: number,
    pageSize: number,
): StrapiPagination {
    const pagination =
        response.meta?.pagination;

    if (pagination) {
        return pagination;
    }

    const total = response.data.length;

    return {
        page: requestedPage,
        pageSize,
        pageCount:
            total === 0
                ? 0
                : Math.ceil(total / pageSize),
        total,
    };
}

export async function getCategoriasTienda():
Promise<CategoriaProductoTienda[]> {
    const response = await fetchAllAPI(
        [
            "/api/categorias-productos-tienda",
            "?filters[activa][$eq]=true",
            "&sort[0]=orden:asc",
            "&sort[1]=nombre:asc",
            "&populate[imagen]=true",
        ].join(""),
    );

    return response.data as CategoriaProductoTienda[];
}

export async function getCategoriasTiendaConConteo():
Promise<CategoriaTiendaConConteo[]> {
    const categorias = await getCategoriasTienda();

    const categoriasConConteo = await Promise.all(
        categorias.map(async (categoria) => {
            const catalogo =
                await getProductosTiendaPorCategoriaPage(
                    categoria.slug,
                    1,
                    1,
                );

            return {
                categoria,
                totalProductos:
                    catalogo.pagination.total,
            };
        }),
    );

    return categoriasConConteo.filter(
        ({ totalProductos }) =>
            totalProductos > 0,
    );
}

export async function getCategoriaTiendaPorSlug(
    slug: string,
): Promise<CategoriaProductoTienda | null> {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
        return null;
    }

    const response =
        await fetchAPI(
            [
                "/api/categorias-productos-tienda",
                `?filters[slug][$eq]=${encodeURIComponent(
                    normalizedSlug,
                )}`,
                "&filters[activa][$eq]=true",
                "&populate[imagen]=true",
                "&pagination[pageSize]=1",
            ].join(""),
        ) as StrapiCollectionResponse<CategoriaProductoTienda>;

    return response.data?.[0] ?? null;
}

export async function getProductosTiendaPage(
    page = 1,
    pageSize = PRODUCTOS_TIENDA_POR_PAGINA,
): Promise<PaginaTienda<ProductoTiendaResumen>> {
    const normalizedPage =
        normalizePositiveInteger(page, 1);
    const normalizedPageSize =
        normalizePositiveInteger(
            pageSize,
            PRODUCTOS_TIENDA_POR_PAGINA,
        );

    const response =
        await fetchAPI(
            [
                "/api/productos-tienda?",
                FILTROS_CATALOGO,
                "&",
                ORDEN_CATALOGO,
                "&",
                PRODUCTO_RESUMEN_FIELDS,
                "&",
                PRODUCTO_RESUMEN_POPULATE,
                `&pagination[page]=${normalizedPage}`,
                `&pagination[pageSize]=${normalizedPageSize}`,
                "&pagination[withCount]=true",
            ].join(""),
        ) as StrapiCollectionResponse<ProductoTiendaResumen>;

    return {
        items: response.data,
        pagination: getPagination(
            response,
            normalizedPage,
            normalizedPageSize,
        ),
    };
}

export async function getProductosTiendaPorCategoriaPage(
    categorySlug: string,
    page = 1,
    pageSize = PRODUCTOS_TIENDA_POR_PAGINA,
): Promise<PaginaTienda<ProductoTiendaResumen>> {
    const normalizedSlug = categorySlug.trim();

    if (!normalizedSlug) {
        return {
            items: [],
            pagination: {
                page: 1,
                pageSize,
                pageCount: 0,
                total: 0,
            },
        };
    }

    const normalizedPage =
        normalizePositiveInteger(page, 1);
    const normalizedPageSize =
        normalizePositiveInteger(
            pageSize,
            PRODUCTOS_TIENDA_POR_PAGINA,
        );

    const response =
        await fetchAPI(
            [
                "/api/productos-tienda?",
                FILTROS_CATALOGO,
                `&filters[categoria_producto_tienda][slug][$eq]=${encodeURIComponent(
                    normalizedSlug,
                )}`,
                "&",
                ORDEN_CATALOGO,
                "&",
                PRODUCTO_RESUMEN_FIELDS,
                "&",
                PRODUCTO_RESUMEN_POPULATE,
                `&pagination[page]=${normalizedPage}`,
                `&pagination[pageSize]=${normalizedPageSize}`,
                "&pagination[withCount]=true",
            ].join(""),
        ) as StrapiCollectionResponse<ProductoTiendaResumen>;

    return {
        items: response.data,
        pagination: getPagination(
            response,
            normalizedPage,
            normalizedPageSize,
        ),
    };
}

export async function getProductosDestacadosTienda(
    limit = 6,
): Promise<ProductoTiendaResumen[]> {
    const normalizedLimit =
        normalizePositiveInteger(limit, 6);

    const response =
        await fetchAPI(
            [
                "/api/productos-tienda?",
                FILTROS_CATALOGO,
                "&filters[destacado][$eq]=true",
                "&",
                ORDEN_CATALOGO,
                "&",
                PRODUCTO_RESUMEN_FIELDS,
                "&",
                PRODUCTO_RESUMEN_POPULATE,
                "&pagination[page]=1",
                `&pagination[pageSize]=${normalizedLimit}`,
            ].join(""),
        ) as StrapiCollectionResponse<ProductoTiendaResumen>;

    return response.data;
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
            [
                "/api/productos-tienda",
                `?filters[slug][$eq]=${encodeURIComponent(
                    normalizedSlug,
                )}`,
                "&filters[activo][$eq]=true",
                "&",
                PRODUCTO_DETALLE_POPULATE,
                "&pagination[pageSize]=1",
            ].join(""),
        ) as StrapiCollectionResponse<ProductoTienda>;

    return response.data?.[0] ?? null;
}

export async function getSlugsProductosTienda():
Promise<string[]> {
    const response = await fetchAllAPI(
        [
            "/api/productos-tienda",
            "?filters[activo][$eq]=true",
            "&fields[0]=slug",
            "&sort[0]=slug:asc",
        ].join(""),
    );

    return response.data
        .map((product: { slug?: string }) =>
            product.slug?.trim(),
        )
        .filter(
            (slug: string | undefined):
                slug is string => Boolean(slug),
        );
}
