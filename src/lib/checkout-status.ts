import { STRAPI_URL } from "./api";

export type CheckoutPublicState =
    | "pendiente"
    | "confirmado"
    | "fallido"
    | "cancelado"
    | "reembolsado"
    | "reembolso_parcial"
    | "no_disponible";

export interface CheckoutPublicStatus {
    estadoDisponible: boolean;
    estadoPago: CheckoutPublicState;
    pagoConfirmado: boolean;
}

export class CheckoutStatusError
    extends Error {
    readonly code: string;
    readonly status: number;

    constructor(
        code: string,
        message: string,
        status: number,
    ) {
        super(message);

        this.name =
            "CheckoutStatusError";

        this.code = code;
        this.status = status;
    }
}

const STATUS_ENABLED =
    import.meta.env
        .PUBLIC_CHECKOUT_STATUS_ENABLED ===
    "true";

const PUBLIC_STATES =
    new Set<CheckoutPublicState>([
        "pendiente",
        "confirmado",
        "fallido",
        "cancelado",
        "reembolsado",
        "reembolso_parcial",
        "no_disponible",
    ]);

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

export function
isCheckoutStatusEnabled(): boolean {
    return STATUS_ENABLED;
}

export function
isValidCheckoutSessionId(
    value: unknown,
): value is string {
    return (
        typeof value === "string" &&
        value.length >= 20 &&
        value.length <= 255 &&
        /^cs_(?:test|live)_[A-Za-z0-9_]+$/.test(
            value,
        )
    );
}

function isConsistentStatus(
    state: CheckoutPublicState,
    confirmed: boolean,
): boolean {
    const confirmedStates =
        new Set<CheckoutPublicState>([
            "confirmado",
            "reembolsado",
            "reembolso_parcial",
        ]);

    return (
        confirmed ===
        confirmedStates.has(state)
    );
}

function parseStatus(
    value: unknown,
): CheckoutPublicStatus {
    if (!isRecord(value)) {
        throw new Error(
            "Respuesta de estado inválida.",
        );
    }

    const {
        estadoDisponible,
        estadoPago,
        pagoConfirmado,
    } = value;

    if (
        typeof estadoDisponible !==
            "boolean" ||
        typeof estadoPago !== "string" ||
        !PUBLIC_STATES.has(
            estadoPago as
                CheckoutPublicState,
        ) ||
        typeof pagoConfirmado !==
            "boolean"
    ) {
        throw new Error(
            "Respuesta de estado incompleta.",
        );
    }

    const state =
        estadoPago as
            CheckoutPublicState;

    if (
        !isConsistentStatus(
            state,
            pagoConfirmado,
        )
    ) {
        throw new Error(
            "Respuesta de estado incoherente.",
        );
    }

    if (
        estadoDisponible === false &&
        state !== "no_disponible"
    ) {
        throw new Error(
            "Disponibilidad de estado incoherente.",
        );
    }

    return {
        estadoDisponible,
        estadoPago: state,
        pagoConfirmado,
    };
}

function getErrorMessage(
    code: string,
): string {
    const messages: Record<string, string> = {
        CHECKOUT_STATUS_DISABLED:
            "La consulta del estado todavía no está disponible.",

        CONTENT_TYPE_INVALID:
            "La solicitud no tiene un formato válido.",

        RATE_LIMIT_EXCEEDED:
            "Se han realizado demasiadas comprobaciones. Inténtalo de nuevo más tarde.",

        CHECKOUT_SESSION_INVALID:
            "La referencia del proceso de pago no es válida.",
    };

    return (
        messages[code] ??
        "No se ha podido consultar el estado del proceso de pago."
    );
}

export async function
getCheckoutPublicStatus(
    sessionId: string,
    signal?: AbortSignal,
): Promise<CheckoutPublicStatus> {
    if (!STATUS_ENABLED) {
        throw new CheckoutStatusError(
            "CHECKOUT_STATUS_DISABLED",
            getErrorMessage(
                "CHECKOUT_STATUS_DISABLED",
            ),
            503,
        );
    }

    if (
        !isValidCheckoutSessionId(
            sessionId,
        )
    ) {
        throw new CheckoutStatusError(
            "CHECKOUT_SESSION_INVALID",
            getErrorMessage(
                "CHECKOUT_SESSION_INVALID",
            ),
            400,
        );
    }

    const endpoint =
        `${STRAPI_URL.replace(
            /\/+$/,
            "",
        )}/api/tienda/checkout/estado`;

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

                referrerPolicy:
                    "no-referrer",

                signal,

                body: JSON.stringify({
                    sessionId,
                }),
            },
        );
    } catch (error) {
        if (
            error instanceof
                DOMException &&
            error.name === "AbortError"
        ) {
            throw error;
        }

        throw new CheckoutStatusError(
            "CHECKOUT_STATUS_NETWORK_ERROR",
            "No se ha podido conectar con el servidor para consultar el estado.",
            0,
        );
    }

    let payload: unknown;

    try {
        payload =
            await response.json();
    } catch {
        throw new CheckoutStatusError(
            "CHECKOUT_STATUS_RESPONSE_INVALID",
            "El servidor ha devuelto una respuesta no válida.",
            response.status,
        );
    }

    if (!response.ok) {
        const code =
            isRecord(payload) &&
            typeof payload.codigo ===
                "string"
                ? payload.codigo
                : "CHECKOUT_STATUS_ERROR";

        throw new CheckoutStatusError(
            code,
            getErrorMessage(code),
            response.status,
        );
    }

    try {
        return parseStatus(payload);
    } catch {
        throw new CheckoutStatusError(
            "CHECKOUT_STATUS_RESPONSE_INVALID",
            "El servidor ha devuelto un estado incoherente.",
            response.status,
        );
    }
}
