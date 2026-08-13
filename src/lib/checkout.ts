import { STRAPI_URL } from "./strapi-url";
import type { CartItem } from "./cart";

export interface CreatedCheckout {
    numeroPedido: string;
    checkoutUrl: string;
    totalCentimos: number;
    moneda: "EUR";
    caducaEn: string;
    reutilizado: boolean;
}

export class CheckoutError extends Error {
    readonly code: string;
    readonly status: number;

    constructor(
        code: string,
        message: string,
        status: number,
    ) {
        super(message);
        this.name = "CheckoutError";
        this.code = code;
        this.status = status;
    }
}

const CHECKOUT_ENABLED =
    import.meta.env.PUBLIC_CHECKOUT_ENABLED ===
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
        CHECKOUT_DISABLED:
            "La compra online todavía no está disponible.",

        CONTENT_TYPE_INVALID:
            "No hemos podido preparar el pago.",

        RATE_LIMIT_EXCEEDED:
            "Se han realizado demasiados intentos. Inténtalo de nuevo dentro de unos minutos.",

        IDEMPOTENCY_KEY_REQUIRED:
            "No hemos podido preparar este intento de pago. Vuelve a intentarlo.",

        IDEMPOTENCY_KEY_INVALID:
            "No hemos podido preparar este intento de pago. Vuelve a intentarlo.",

        IDEMPOTENCY_CONFLICT:
            "El carrito ha cambiado. Revísalo antes de continuar.",

        CHECKOUT_ITEMS_INVALID:
            "El carrito está vacío o contiene datos no válidos.",

        CHECKOUT_ITEM_INVALID:
            "Uno de los productos del carrito no es válido.",

        PRODUCT_NOT_PURCHASABLE:
            "Algún producto ya no está disponible.",

        CHECKOUT_INTERNAL_ERROR:
            "No hemos podido preparar el pago.",
    };

    return (
        messages[code] ??
        "No hemos podido preparar el pago."
    );
}

function normalizeCheckoutUrl(
    value: unknown,
): string {
    if (typeof value !== "string") {
        throw new Error(
            "URL de checkout ausente.",
        );
    }

    const url = new URL(value);

    if (
        url.protocol !== "https:" ||
        url.hostname !==
            "checkout.stripe.com"
    ) {
        throw new Error(
            "URL de checkout no permitida.",
        );
    }

    return url.toString();
}

function parseCheckout(
    value: unknown,
): CreatedCheckout {
    if (
        !isRecord(value) ||
        value.checkoutCreado !== true ||
        typeof value.numeroPedido !==
            "string" ||
        !value.numeroPedido ||
        !Number.isSafeInteger(
            value.totalCentimos,
        ) ||
        Number(value.totalCentimos) <= 0 ||
        value.moneda !== "EUR" ||
        typeof value.caducaEn !==
            "string" ||
        !value.caducaEn ||
        typeof value.reutilizado !==
            "boolean"
    ) {
        throw new Error(
            "Respuesta de checkout inválida.",
        );
    }

    return {
        numeroPedido:
            value.numeroPedido,

        checkoutUrl:
            normalizeCheckoutUrl(
                value.checkoutUrl,
            ),

        totalCentimos:
            Number(value.totalCentimos),

        moneda: "EUR",

        caducaEn:
            value.caducaEn,

        reutilizado:
            value.reutilizado,
    };
}

export function
isCheckoutEnabled(): boolean {
    return CHECKOUT_ENABLED;
}

export async function
createCheckoutSession(
    items: CartItem[],
    idempotencyKey: string,
    signal?: AbortSignal,
): Promise<CreatedCheckout> {
    if (!CHECKOUT_ENABLED) {
        throw new CheckoutError(
            "CHECKOUT_DISABLED",
            getErrorMessage(
                "CHECKOUT_DISABLED",
            ),
            503,
        );
    }

    const endpoint =
        `${STRAPI_URL.replace(
            /\/+$/,
            "",
        )}/api/tienda/checkout`;

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

                    "Idempotency-Key":
                        idempotencyKey,
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

        throw new CheckoutError(
            "CHECKOUT_NETWORK_ERROR",
            "No hemos podido conectar con el servicio de pago.",
            0,
        );
    }

    let payload: unknown = null;

    try {
        payload =
            await response.json();
    } catch {
        throw new CheckoutError(
            "CHECKOUT_RESPONSE_INVALID",
            "No hemos podido preparar el pago.",
            response.status,
        );
    }

    if (!response.ok) {
        const code =
            isRecord(payload) &&
            typeof payload.codigo ===
                "string"
                ? payload.codigo
                : "CHECKOUT_INTERNAL_ERROR";

        throw new CheckoutError(
            code,
            getErrorMessage(code),
            response.status,
        );
    }

    try {
        return parseCheckout(payload);
    } catch {
        throw new CheckoutError(
            "CHECKOUT_RESPONSE_INVALID",
            "No hemos podido preparar el pago.",
            response.status,
        );
    }
}
