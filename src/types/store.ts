export type TipoProductoTienda =
    | "Producto principal"
    | "Accesorio";

export type MonedaTienda = "EUR";

export type EstadoVentaTienda =
    | "Disponible"
    | "Bajo consulta"
    | "Agotado"
    | "Próximamente"
    | "Descatalogado";

export interface StrapiDocumentIdentity {
    id: number;
    documentId: string;
}

export interface StrapiEntityBase
    extends StrapiDocumentIdentity {
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

export interface StrapiMediaFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    sizeInBytes?: number;
    url: string;
}

export interface StrapiMedia extends StrapiEntityBase {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: Record<string, StrapiMediaFormat> | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: unknown;
}

export interface StrapiBlock {
    type: string;
    children?: unknown[];
    [key: string]: unknown;
}

export interface CaracteristicaProductoTienda {
    id: number;
    etiqueta: string;
    valor: string;
}

export interface CategoriaProductoTiendaResumen
    extends StrapiDocumentIdentity {
    nombre: string;
    slug: string;
}

export interface CategoriaProductoTienda
    extends StrapiEntityBase {
    nombre: string;
    slug: string;
    descripcion: string | null;
    activa: boolean;
    orden: number;
    imagen: StrapiMedia | null;
}

export interface CategoriaTiendaConConteo {
    categoria: CategoriaProductoTienda;
    totalProductos: number;
}

export interface HardwareTiendaResumen
    extends StrapiDocumentIdentity {
    nombre: string;
    slug: string;
    descripcion_corta: string;
    activo: boolean;
    tipo_hardware?: string | null;
    imagen_principal?: StrapiMedia | null;
}

interface ProductoTiendaCamposComerciales {
    nombre: string;
    slug: string;
    sku: string;
    tipo_producto: TipoProductoTienda;
    precio_centimos: number | null;
    moneda: MonedaTienda;
    estado_venta: EstadoVentaTienda;
    activo: boolean;
    destacado: boolean;
    orden: number;
    requiere_envio: boolean;
    descripcion_corta: string;
}

export interface ProductoTiendaResumen
    extends StrapiDocumentIdentity,
        ProductoTiendaCamposComerciales {
    imagen_principal: StrapiMedia | null;
    categoria_producto_tienda:
        CategoriaProductoTiendaResumen;
}

export interface ProductoTiendaRelacionado
    extends StrapiDocumentIdentity,
        ProductoTiendaCamposComerciales {
    imagen_principal: StrapiMedia | null;
}

export interface ProductoTienda
    extends StrapiEntityBase,
        ProductoTiendaCamposComerciales {
    descripcion_completa: StrapiBlock[] | null;
    imagen_principal: StrapiMedia | null;
    galeria: StrapiMedia[] | null;
    caracteristicas: CaracteristicaProductoTienda[];
    incluye: StrapiBlock[] | null;
    observaciones_envio: string | null;
    categoria_producto_tienda:
        CategoriaProductoTienda;
    hardware: HardwareTiendaResumen | null;
    compatible_con: ProductoTiendaRelacionado[];
    accesorios_compatibles:
        ProductoTiendaRelacionado[];
}

export interface StrapiPagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export interface StrapiCollectionResponse<T> {
    data: T[];
    meta?: {
        pagination?: StrapiPagination;
    };
}

export interface PaginaTienda<T> {
    items: T[];
    pagination: StrapiPagination;
}
