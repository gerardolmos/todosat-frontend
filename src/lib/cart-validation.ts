import { STRAPI_URL } from "./api";
import type { CartItem } from "./cart";

export interface ValidatedCartLine {
    documentId: string;
    sku: string;
    nombre: string;
    cantidad: number;
    precioUnitarioCentimos: number;
    subtotalCentimos: number;
    moneda: "EUR";
    requiereEnvio: boolean;
}

export interface ValidatedCart {
    lineas: ValidatedCartLine[];
    cantidadTotal: number;
    subtotalProductosCentimos: number;
    moneda: "EUR";
    requiereEnvio: boolean;
    pagosRealesBloqueados: true;
}

export class CartValidationError extends Error {
    readonly code: string;
    readonly status: number;

    constructor(
        code: string,
        message: string,
        status: number,
    ) {
        super(message);
        this.name = "CartValidationError";
        this.code = code;
        this.status = status;
    }
}

const VALIDATION_ENABLED =
    import.meta.env
        .PUBLIC_CART_VALIDATION_ENABLED ===
    "true";

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function getErrorMessage(
    code: string,
): string {
    const messages: Record<string, string> = {
        CART_VALIDATION_DISABLED:
            "No podemos comprobar el carrito en este momento.",

        CONTENT_TYPE_INVALID:
            "No hemos podido comprobar el carrito.",

        RATE_LIMIT_EXCEEDED:
            "Has realizado varios intentos seguidos. Inténtalo de nuevo dentro de unos minutos.",

        CHECKOUT_ITEMS_INVALID:
            "El carrito está vacío o contiene datos no válidos.",

        CHECKOUT_ITEM_INVALID:
            "Uno de los productos del carrito no es válido.",

        CHECKOUT_TOO_MANY_LINES:
            "El carrito contiene demasiados productos distintos.",

        CHECKOUT_TOO_MANY_UNITS:
            "El carrito supera el número máximo de unidades permitido.",

        CHECKOUT_QUANTITY_INVALID:
            "La cantidad de uno de los productos supera el máximo permitido.",

        PRODUCT_NOT_PURCHASABLE:
            "Algún producto ya no está disponible. Revisa el carrito antes de continuar.",

        PRODUCT_PRICE_INVALID:
            "No se ha podido confirmar el precio de uno de los productos.",

        PRODUCT_CONFIGURATION_INVALID:
            "Uno de los productos necesita una revisión antes de poder comprarse.",

        ORDER_AMOUNT_INVALID:
            "No se ha podido calcular correctamente el importe del carrito.",
    };

    return (
        messages[code] ??
        "No hemos podido confirmar el precio y la disponibilidad."
    );
}

function parseLine(
    value: unknown,
): ValidatedCartLine {
    if (!isRecord(value)) {
        throw new Error(
            "Línea de carrito inválida.",
        );
    }

    const {
        documentId,
        sku,
        nombre,
        cantidad,
        precioUnitarioCentimos,
        subtotalCentimos,
        moneda,
        requiereEnvio,
    } = value;

    if (
        typeof documentId !== "string" ||
        !documentId ||
        typeof sku !== "string" ||
        !sku ||
        typeof nombre !== "string" ||
        !nombre ||
        !Number.isSafeInteger(cantidad) ||
        Number(cantidad) < 1 ||
        !Number.isSafeInteger(
            precioUnitarioCentimos,
        ) ||
        Number(
            precioUnitarioCentimos,
        ) <= 0 ||
        !Number.isSafeInteger(
            subtotalCentimos,
        ) ||
        Number(subtotalCentimos) <= 0 ||
        moneda !== "EUR" ||
        typeof requiereEnvio !==
            "boolean"
    ) {
        throw new Error(
            "Línea de carrito incompleta.",
        );
    }

    if (
        Number(subtotalCentimos) !==
        Number(precioUnitarioCentimos) *
            Number(cantidad)
    ) {
        throw new Error(
            "Subtotal de línea incoherente.",
        );
    }

    return {
        documentId,
        sku,
        nombre,
        cantidad: Number(cantidad),
        precioUnitarioCentimos: Number(
            precioUnitarioCentimos,
        ),
        subtotalCentimos: Number(
            subtotalCentimos,
        ),
        moneda: "EUR",
        requiereEnvio,
    };
}

function parseValidatedCart(
    value: unknown,
    requestedItems: CartItem[],
): ValidatedCart {
    if (
        !isRecord(value) ||
        value.carritoValidado !== true ||
        value.moneda !== "EUR" ||
        value.pagosRealesBloqueados !==
            true ||
        !Array.isArray(value.lineas)
    ) {
        throw new Error(
            "Respuesta de validación inválida.",
        );
    }

    const lines =
        value.lineas.map(parseLine);

    const requestedQuantities =
        new Map(
            requestedItems.map((item) => [
                item.documentId,
                item.cantidad,
            ]),
        );

    if (
        lines.length !==
        requestedQuantities.size
    ) {
        throw new Error(
            "El servidor no ha devuelto todos los productos.",
        );
    }

    const returnedIds =
        new Set<string>();

    for (const line of lines) {
        if (
            returnedIds.has(
                line.documentId,
            ) ||
            requestedQuantities.get(
                line.documentId,
            ) !== line.cantidad
        ) {
            throw new Error(
                "La respuesta no coincide con el carrito solicitado.",
            );
        }

        returnedIds.add(
            line.documentId,
        );
    }

    const calculatedQuantity =
        lines.reduce(
            (total, line) =>
                total + line.cantidad,
            0,
        );

    const calculatedSubtotal =
        lines.reduce(
            (total, line) =>
                total +
                line.subtotalCentimos,
            0,
        );

    if (
        !Number.isSafeInteger(
            value.cantidadTotal,
        ) ||
        !Number.isSafeInteger(
            value
                .subtotalProductosCentimos,
        ) ||
        Number(value.cantidadTotal) !==
            calculatedQuantity ||
        Number(
            value
                .subtotalProductosCentimos,
        ) !== calculatedSubtotal ||
        typeof value.requiereEnvio !==
            "boolean"
    ) {
        throw new Error(
            "Los totales validados no son coherentes.",
        );
    }

    return {
        lineas: lines,
        cantidadTotal:
            calculatedQuantity,
        subtotalProductosCentimos:
            calculatedSubtotal,
        moneda: "EUR",
        requiereEnvio:
            value.requiereEnvio,
        pagosRealesBloqueados: true,
    };
}

export function
isCartValidationEnabled(): boolean {
    return VALIDATION_ENABLED;
}

export async function
validateCartWithServer(
    items: CartItem[],
    signal?: AbortSignal,
): Promise<ValidatedCart> {
    if (!VALIDATION_ENABLED) {
        throw new CartValidationError(
            "CART_VALIDATION_DISABLED",
            getErrorMessage(
                "CART_VALIDATION_DISABLED",
            ),
            503,
        );
    }

    const endpoint =
        `${STRAPI_URL.replace(
            /\/+$/,
            "",
        )}/api/tienda/carrito/validar`;

    let response: Response;

    try {
        response = await fetch(
            endpoint,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                    Accept:
                        "application/json",
                },

                credentials: "omit",
                cache: "no-store",
                signal,

                body: JSON.stringify({
                    items:
                        items.map(
                            (item) => ({
                                documentId:
                                    item.documentId,
                                cantidad:
                                    item.cantidad,
                            }),
                        ),
                }),
            },
        );
    } catch (error) {
        if (
            error instanceof DOMException &&
            error.name === "AbortError"
        ) {
            throw error;
        }

        throw new CartValidationError(
            "CART_VALIDATION_NETWORK_ERROR",
            "No hemos podido comprobar el carrito. Revisa tu conexión e inténtalo de nuevo.",
            0,
        );
    }

    let payload: unknown = null;

    try {
        payload =
            await response.json();
    } catch {
        throw new CartValidationError(
            "CART_VALIDATION_RESPONSE_INVALID",
            "No hemos podido comprobar el carrito.",
            response.status,
        );
    }

    if (!response.ok) {
        const code =
            isRecord(payload) &&
            typeof payload.codigo ===
                "string"
                ? payload.codigo
                : "CART_VALIDATION_ERROR";

        throw new CartValidationError(
            code,
            getErrorMessage(code),
            response.status,
        );
    }

    try {
        return parseValidatedCart(
            payload,
            items,
        );
    } catch {
        throw new CartValidationError(
            "CART_VALIDATION_RESPONSE_INVALID",
            "No hemos podido confirmar el carrito. Inténtalo de nuevo.",
            response.status,
        );
    }
}
