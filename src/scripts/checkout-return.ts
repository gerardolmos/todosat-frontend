import {
    CheckoutStatusError,
    getCheckoutPublicStatus,
    isCheckoutStatusEnabled,
    isValidCheckoutSessionId,
    type CheckoutPublicStatus,
} from "../lib/checkout-status";

const returnTitle =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-title]",
    );

const returnMessage =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-message]",
    );

const noticeTitle =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-notice-title]",
    );

const noticeMessage =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-notice-message]",
    );

const MAX_STATUS_ATTEMPTS = 8;
const STATUS_RETRY_DELAY_MS = 2000;

let activeController:
    AbortController | null = null;

function setContent({
    title,
    message,
    notice,
    detail,
}: {
    title: string;
    message: string;
    notice: string;
    detail: string;
}) {
    if (returnTitle) {
        returnTitle.textContent =
            title;
    }

    if (returnMessage) {
        returnMessage.textContent =
            message;
    }

    if (noticeTitle) {
        noticeTitle.textContent =
            notice;
    }

    if (noticeMessage) {
        noticeMessage.textContent =
            detail;
    }
}

function removeSessionIdFromAddress():
    string | null {
    try {
        const url =
            new URL(window.location.href);

        const sessionId =
            url.searchParams.get(
                "session_id",
            );

        if (
            url.searchParams.has(
                "session_id",
            )
        ) {
            url.searchParams.delete(
                "session_id",
            );

            const cleanAddress =
                `${url.pathname}` +
                `${url.search}` +
                `${url.hash}`;

            window.history.replaceState(
                window.history.state,
                "",
                cleanAddress,
            );
        }

        return sessionId;
    } catch {
        return null;
    }
}

function waitBeforeRetry():
    Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(
            resolve,
            STATUS_RETRY_DELAY_MS,
        );
    });
}

function shouldRetry(
    status: CheckoutPublicStatus,
): boolean {
    return (
        status.estadoPago ===
            "pendiente" ||
        status.estadoPago ===
            "no_disponible"
    );
}

function renderStatus(
    status: CheckoutPublicStatus,
) {
    switch (status.estadoPago) {
        case "confirmado":
            setContent({
                title:
                    "Pago confirmado",

                message:
                    "El servidor ha confirmado de forma segura que el pago fue recibido.",

                notice:
                    "Confirmación recibida",

                detail:
                    "El pedido ya puede continuar con su procesamiento interno.",
            });
            return;

        case "fallido":
            setContent({
                title:
                    "El pago no se ha completado",

                message:
                    "El servidor ha registrado que el intento de pago no llegó a completarse.",

                notice:
                    "No existe un cobro confirmado",

                detail:
                    "Revisa el carrito antes de iniciar un nuevo intento.",
            });
            return;

        case "cancelado":
            setContent({
                title:
                    "Proceso de pago cancelado",

                message:
                    "El pedido no tiene un pago confirmado y el proceso ha quedado cancelado.",

                notice:
                    "No existe un cobro confirmado",

                detail:
                    "Puedes regresar al carrito para revisar los productos.",
            });
            return;

        case "reembolsado":
            setContent({
                title:
                    "Pago reembolsado",

                message:
                    "El servidor indica que el importe pagado fue reembolsado.",

                notice:
                    "Estado actualizado",

                detail:
                    "La devolución consta en el estado interno del pedido.",
            });
            return;

        case "reembolso_parcial":
            setContent({
                title:
                    "Reembolso parcial registrado",

                message:
                    "El servidor indica que el pedido tiene un reembolso parcial.",

                notice:
                    "Estado actualizado",

                detail:
                    "La devolución parcial consta en el estado interno del pedido.",
            });
            return;

        case "pendiente":
        case "no_disponible":
        default:
            setContent({
                title:
                    "Confirmación pendiente",

                message:
                    "Todavía no hemos recibido una confirmación segura del resultado del pago.",

                notice:
                    "No repitas el pago por esta pantalla",

                detail:
                    "La página continuará comprobando durante unos segundos si el servidor recibe la confirmación.",
            });
    }
}

function renderUnavailable(
    message: string,
) {
    setContent({
        title:
            "No se ha podido comprobar el estado",

        message,

        notice:
            "No se ha confirmado ningún cobro",

        detail:
            "Un problema al consultar el estado no demuestra que el pago haya fallado ni que se haya completado.",
    });
}

async function monitorStatus(
    sessionId: string,
) {
    activeController?.abort();

    activeController =
        new AbortController();

    for (
        let attempt = 1;
        attempt <= MAX_STATUS_ATTEMPTS;
        attempt += 1
    ) {
        try {
            const status =
                await getCheckoutPublicStatus(
                    sessionId,
                    activeController.signal,
                );

            renderStatus(status);

            if (
                !shouldRetry(status) ||
                attempt ===
                    MAX_STATUS_ATTEMPTS
            ) {
                return;
            }
        } catch (error) {
            if (
                error instanceof
                    DOMException &&
                error.name ===
                    "AbortError"
            ) {
                return;
            }

            if (
                attempt ===
                MAX_STATUS_ATTEMPTS
            ) {
                renderUnavailable(
                    error instanceof
                        CheckoutStatusError
                        ? error.message
                        : "No se ha podido consultar el estado del proceso de pago.",
                );

                return;
            }
        }

        await waitBeforeRetry();
    }
}

function initializeReturnPage() {
    const sessionId =
        removeSessionIdFromAddress();

    if (
        !isValidCheckoutSessionId(
            sessionId,
        )
    ) {
        setContent({
            title:
                "No se ha recibido una referencia válida",

            message:
                "No podemos asociar esta visita a una sesión de pago.",

            notice:
                "No se ha confirmado ningún cobro",

            detail:
                "La ausencia de una referencia válida impide consultar el estado del proceso.",
        });

        return;
    }

    if (
        !isCheckoutStatusEnabled()
    ) {
        setContent({
            title:
                "Estamos esperando una confirmación segura",

            message:
                "Has regresado desde la pasarela de pago, pero la consulta pública del estado todavía está desactivada.",

            notice:
                "No se ha confirmado ningún cobro desde esta página",

            detail:
                "El pedido solo podrá considerarse pagado después de que el servidor valide la notificación segura correspondiente.",
        });

        return;
    }

    setContent({
        title:
            "Comprobando el estado del pago",

        message:
            "Estamos consultando el estado guardado de forma segura en el servidor.",

        notice:
            "Comprobación en curso",

        detail:
            "La página no consulta directamente la pasarela de pago.",
    });

    void monitorStatus(sessionId);
}

window.addEventListener(
    "pagehide",
    () => {
        activeController?.abort();
    },
);

initializeReturnPage();
