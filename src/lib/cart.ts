export const CART_STORAGE_KEY =
    "todosatcom:cart:v1";

export const CART_CHANGE_EVENT =
    "todosatcom:cart-change";

export const MAX_CART_LINES = 20;
export const MAX_QUANTITY_PER_LINE = 20;
export const MAX_TOTAL_QUANTITY = 50;

export interface CartItem {
    documentId: string;
    slug: string;
    nombre: string;
    sku: string;
    precioCentimos: number;
    moneda: "EUR";
    imagenUrl: string | null;
    requiereEnvio: boolean;
    cantidad: number;
}

interface StoredCart {
    version: 1;
    items: CartItem[];
}

export class CartError extends Error {
    readonly code: string;

    constructor(
        code: string,
        message: string,
    ) {
        super(message);
        this.name = "CartError";
        this.code = code;
    }
}

function isBrowser() {
    return typeof window !== "undefined";
}

function normalizeText(
    value: unknown,
    maxLength: number,
): string {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim().slice(0, maxLength);
}

function normalizeItem(
    value: unknown,
): CartItem | null {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return null;
    }

    const candidate =
        value as Partial<CartItem>;

    const documentId = normalizeText(
        candidate.documentId,
        255,
    );

    const slug = normalizeText(
        candidate.slug,
        255,
    );

    const nombre = normalizeText(
        candidate.nombre,
        300,
    );

    const sku = normalizeText(
        candidate.sku,
        150,
    );

    const precioCentimos = Number(
        candidate.precioCentimos,
    );

    const cantidad = Number(
        candidate.cantidad,
    );

    if (
        !documentId ||
        !slug ||
        !nombre ||
        !sku ||
        candidate.moneda !== "EUR" ||
        !Number.isSafeInteger(
            precioCentimos,
        ) ||
        precioCentimos <= 0 ||
        !Number.isSafeInteger(cantidad) ||
        cantidad < 1 ||
        cantidad >
            MAX_QUANTITY_PER_LINE
    ) {
        return null;
    }

    const imagenUrl =
        typeof candidate.imagenUrl ===
            "string" &&
        candidate.imagenUrl.trim()
            ? candidate.imagenUrl
                  .trim()
                  .slice(0, 2000)
            : null;

    return {
        documentId,
        slug,
        nombre,
        sku,
        precioCentimos,
        moneda: "EUR",
        imagenUrl,
        requiereEnvio:
            candidate.requiereEnvio ===
            true,
        cantidad,
    };
}

function normalizeCart(
    value: unknown,
): StoredCart {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return {
            version: 1,
            items: [],
        };
    }

    const candidate =
        value as Partial<StoredCart>;

    if (
        candidate.version !== 1 ||
        !Array.isArray(candidate.items)
    ) {
        return {
            version: 1,
            items: [],
        };
    }

    const uniqueItems =
        new Map<string, CartItem>();

    for (const rawItem of candidate.items) {
        const item =
            normalizeItem(rawItem);

        if (!item) {
            continue;
        }

        if (
            uniqueItems.size >=
                MAX_CART_LINES &&
            !uniqueItems.has(
                item.documentId,
            )
        ) {
            break;
        }

        uniqueItems.set(
            item.documentId,
            item,
        );
    }

    const items: CartItem[] = [];
    let totalQuantity = 0;

    for (
        const item of
        uniqueItems.values()
    ) {
        if (
            totalQuantity +
                item.cantidad >
            MAX_TOTAL_QUANTITY
        ) {
            break;
        }

        items.push(item);
        totalQuantity += item.cantidad;
    }

    return {
        version: 1,
        items,
    };
}

export function readCart(): CartItem[] {
    if (!isBrowser()) {
        return [];
    }

    try {
        const stored =
            window.localStorage.getItem(
                CART_STORAGE_KEY,
            );

        if (!stored) {
            return [];
        }

        return normalizeCart(
            JSON.parse(stored),
        ).items;
    } catch {
        return [];
    }
}

function dispatchCartChange(
    items: CartItem[],
) {
    if (!isBrowser()) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(
            CART_CHANGE_EVENT,
            {
                detail: {
                    items,
                    count:
                        getCartCount(items),
                },
            },
        ),
    );
}

export function saveCart(
    items: CartItem[],
): CartItem[] {
    if (!isBrowser()) {
        return [];
    }

    const normalized =
        normalizeCart({
            version: 1,
            items,
        });

    window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(normalized),
    );

    dispatchCartChange(
        normalized.items,
    );

    return normalized.items;
}

export function addCartItem(
    item: Omit<
        CartItem,
        "cantidad"
    >,
    quantity = 1,
): CartItem[] {
    const normalizedItem =
        normalizeItem({
            ...item,
            cantidad: quantity,
        });

    if (!normalizedItem) {
        throw new CartError(
            "CART_ITEM_INVALID",
            "El producto no es válido.",
        );
    }

    const items = readCart();

    const existing = items.find(
        (cartItem) =>
            cartItem.documentId ===
            normalizedItem.documentId,
    );

    if (existing) {
        const newQuantity =
            existing.cantidad +
            normalizedItem.cantidad;

        if (
            newQuantity >
            MAX_QUANTITY_PER_LINE
        ) {
            throw new CartError(
                "CART_LINE_LIMIT",
                `El máximo por producto es ${MAX_QUANTITY_PER_LINE}.`,
            );
        }

        existing.cantidad =
            newQuantity;

        /*
         * Actualizamos datos visuales por
         * si el catálogo ha cambiado.
         * El precio definitivo siempre lo
         * recalculará Strapi.
         */
        existing.nombre =
            normalizedItem.nombre;
        existing.slug =
            normalizedItem.slug;
        existing.sku =
            normalizedItem.sku;
        existing.precioCentimos =
            normalizedItem.precioCentimos;
        existing.imagenUrl =
            normalizedItem.imagenUrl;
        existing.requiereEnvio =
            normalizedItem.requiereEnvio;
    } else {
        if (
            items.length >=
            MAX_CART_LINES
        ) {
            throw new CartError(
                "CART_LINES_LIMIT",
                `El carrito admite un máximo de ${MAX_CART_LINES} productos distintos.`,
            );
        }

        items.push(normalizedItem);
    }

    if (
        getCartCount(items) >
        MAX_TOTAL_QUANTITY
    ) {
        throw new CartError(
            "CART_TOTAL_LIMIT",
            `El carrito admite un máximo de ${MAX_TOTAL_QUANTITY} unidades.`,
        );
    }

    return saveCart(items);
}

export function setCartItemQuantity(
    documentId: string,
    quantity: number,
): CartItem[] {
    if (
        !Number.isSafeInteger(quantity)
    ) {
        throw new CartError(
            "CART_QUANTITY_INVALID",
            "La cantidad no es válida.",
        );
    }

    if (quantity <= 0) {
        return removeCartItem(
            documentId,
        );
    }

    if (
        quantity >
        MAX_QUANTITY_PER_LINE
    ) {
        throw new CartError(
            "CART_LINE_LIMIT",
            `El máximo por producto es ${MAX_QUANTITY_PER_LINE}.`,
        );
    }

    const items = readCart();

    const item = items.find(
        (cartItem) =>
            cartItem.documentId ===
            documentId,
    );

    if (!item) {
        return items;
    }

    item.cantidad = quantity;

    if (
        getCartCount(items) >
        MAX_TOTAL_QUANTITY
    ) {
        throw new CartError(
            "CART_TOTAL_LIMIT",
            `El carrito admite un máximo de ${MAX_TOTAL_QUANTITY} unidades.`,
        );
    }

    return saveCart(items);
}

export function removeCartItem(
    documentId: string,
): CartItem[] {
    return saveCart(
        readCart().filter(
            (item) =>
                item.documentId !==
                documentId,
        ),
    );
}

export function clearCart(): CartItem[] {
    return saveCart([]);
}

export function getCartCount(
    items = readCart(),
): number {
    return items.reduce(
        (total, item) =>
            total + item.cantidad,
        0,
    );
}

export function getCartSubtotal(
    items = readCart(),
): number {
    return items.reduce(
        (total, item) =>
            total +
            item.precioCentimos *
                item.cantidad,
        0,
    );
}
