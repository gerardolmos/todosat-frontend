export const CHECKOUT_RETURN_STATES =
    Object.freeze({
        CHECKING: "checking",
        PENDING: "pending",
        CONFIRMED: "confirmed",
        FAILED: "failed",
        CANCELLED: "cancelled",
        REFUNDED: "refunded",
        PARTIAL_REFUND:
            "partial-refund",
        UNAVAILABLE: "unavailable",
        INVALID: "invalid",
        DISABLED: "disabled",
    });

const BASE_ACTIONS = {
    primaryLabel:
        "Volver a la tienda",
    primaryHref: "/tienda",
    secondaryLabel:
        "Revisar el carrito",
    secondaryHref:
        "/tienda/carrito",
    showSecondary: true,
};

export function getCheckoutReturnView(
    state,
    {
        canRetry = false,
    } = {},
) {
    switch (state) {
        case CHECKOUT_RETURN_STATES.CHECKING:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "…",
                eyebrow:
                    "Comprobando pago",
                title:
                    "Estamos comprobando tu pago",
                message:
                    "Puede tardar unos segundos. No cierres esta página ni vuelvas a realizar el pago.",
                noticeTitle:
                    "Comprobación en curso",
                noticeMessage:
                    "Actualizaremos esta pantalla en cuanto tengamos el resultado.",
                busy: true,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.PENDING:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "…",
                eyebrow:
                    "Confirmación pendiente",
                title:
                    "Tu pago sigue pendiente",
                message:
                    "Todavía no tenemos el resultado definitivo. No realices otro pago mientras lo comprobamos.",
                noticeTitle:
                    canRetry
                        ? "Puedes volver a comprobarlo"
                        : "Seguimos comprobándolo",
                noticeMessage:
                    canRetry
                        ? "Usa el botón de comprobación antes de intentar pagar de nuevo."
                        : "Esta pantalla se actualizará automáticamente.",
                busy: !canRetry,
                showRetry: canRetry,
            };

        case CHECKOUT_RETURN_STATES.CONFIRMED:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "✓",
                eyebrow:
                    "Compra completada",
                title:
                    "Pago confirmado",
                message:
                    "Tu pedido se ha registrado correctamente.",
                noticeTitle:
                    "Pedido recibido",
                noticeMessage:
                    "No necesitas realizar ningún otro pago.",
                primaryLabel:
                    "Volver a la tienda",
                showSecondary: false,
                busy: false,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.FAILED:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "!",
                eyebrow:
                    "Pago no completado",
                title:
                    "El pago no se ha completado",
                message:
                    "Puedes volver al carrito y revisar el pedido antes de intentarlo de nuevo.",
                noticeTitle:
                    "No se ha realizado el pago",
                noticeMessage:
                    "Tus productos siguen disponibles en el carrito.",
                primaryLabel:
                    "Volver al carrito",
                primaryHref:
                    "/tienda/carrito",
                secondaryLabel:
                    "Seguir comprando",
                secondaryHref:
                    "/tienda",
                busy: false,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.CANCELLED:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "×",
                eyebrow:
                    "Pago cancelado",
                title:
                    "Has cancelado el pago",
                message:
                    "No se ha realizado ningún cobro y tu carrito sigue disponible.",
                noticeTitle:
                    "Puedes continuar cuando quieras",
                noticeMessage:
                    "Revisa el carrito antes de iniciar un nuevo pago.",
                primaryLabel:
                    "Volver al carrito",
                primaryHref:
                    "/tienda/carrito",
                secondaryLabel:
                    "Volver a la tienda",
                secondaryHref:
                    "/tienda",
                busy: false,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.REFUNDED:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "↩",
                eyebrow:
                    "Reembolso registrado",
                title:
                    "Pago reembolsado",
                message:
                    "El reembolso del pago ha quedado registrado.",
                noticeTitle:
                    "Estado actualizado",
                noticeMessage:
                    "No necesitas realizar ninguna acción desde esta página.",
                showSecondary: false,
                busy: false,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.PARTIAL_REFUND:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "↩",
                eyebrow:
                    "Reembolso actualizado",
                title:
                    "Reembolso parcial registrado",
                message:
                    "Una parte del importe pagado ha sido reembolsada.",
                noticeTitle:
                    "Estado actualizado",
                noticeMessage:
                    "No necesitas realizar ninguna acción desde esta página.",
                showSecondary: false,
                busy: false,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.UNAVAILABLE:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "!",
                eyebrow:
                    "Comprobación interrumpida",
                title:
                    "No hemos podido comprobar el pago",
                message:
                    "Esto no significa que el pago haya fallado. No realices otro pago todavía.",
                noticeTitle:
                    "Vuelve a comprobarlo",
                noticeMessage:
                    "Comprueba el estado antes de intentar pagar de nuevo.",
                busy: false,
                showRetry: true,
            };

        case CHECKOUT_RETURN_STATES.DISABLED:
            return {
                ...BASE_ACTIONS,
                state,
                icon: "i",
                eyebrow:
                    "Tienda en preparación",
                title:
                    "El pago online todavía no está disponible",
                message:
                    "Puedes consultar productos y preparar tu carrito, pero aún no se aceptan pagos.",
                noticeTitle:
                    "No se ha realizado ningún cobro",
                noticeMessage:
                    "Vuelve a la tienda para continuar revisando el catálogo.",
                busy: false,
                showRetry: false,
            };

        case CHECKOUT_RETURN_STATES.INVALID:
        default:
            return {
                ...BASE_ACTIONS,
                state:
                    CHECKOUT_RETURN_STATES.INVALID,
                icon: "i",
                eyebrow:
                    "Estado no disponible",
                title:
                    "No podemos mostrar el estado del pago",
                message:
                    "Esta página solo puede consultarse después de completar el proceso de pago.",
                noticeTitle:
                    "No hay ningún pago asociado",
                noticeMessage:
                    "Vuelve a la tienda o revisa los productos de tu carrito.",
                busy: false,
                showRetry: false,
            };
    }
}
