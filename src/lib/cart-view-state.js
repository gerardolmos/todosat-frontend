export const CART_VALIDATION_PHASES =
    Object.freeze({
        IDLE: "idle",
        SCHEDULED: "scheduled",
        VALIDATING: "validating",
        VERIFIED: "verified",
        ERROR: "error",
        DISABLED: "disabled",
    });

const VALIDATION_TONES =
    Object.freeze({
        neutral: {
            border:
                "border-slate-200",
            background:
                "bg-white",
            iconBackground:
                "bg-slate-100",
            iconText:
                "text-slate-700",
            eyebrow:
                "text-slate-500",
        },

        information: {
            border:
                "border-sky-200",
            background:
                "bg-sky-50",
            iconBackground:
                "bg-sky-100",
            iconText:
                "text-sky-800",
            eyebrow:
                "text-sky-800",
        },

        pending: {
            border:
                "border-amber-200",
            background:
                "bg-amber-50",
            iconBackground:
                "bg-amber-100",
            iconText:
                "text-amber-900",
            eyebrow:
                "text-amber-900",
        },

        success: {
            border:
                "border-emerald-200",
            background:
                "bg-emerald-50",
            iconBackground:
                "bg-emerald-100",
            iconText:
                "text-emerald-900",
            eyebrow:
                "text-emerald-900",
        },

        error: {
            border:
                "border-red-200",
            background:
                "bg-red-50",
            iconBackground:
                "bg-red-100",
            iconText:
                "text-red-900",
            eyebrow:
                "text-red-900",
        },
    });

export function deriveCartViewState({
    itemCount,
    validationEnabled,
    phase,
    hasValidatedCart,
    errorMessage = "",
}) {
    if (
        !Number.isSafeInteger(itemCount) ||
        itemCount < 0
    ) {
        throw new TypeError(
            "itemCount debe ser un entero no negativo.",
        );
    }

    if (itemCount === 0) {
        return {
            state: "empty",
            tone: "neutral",
            icon: "🛒",
            eyebrow: "Estado del carrito",
            title: "Todavía no hay productos",
            message:
                "Añade productos para poder revisar precios, disponibilidad y envío.",
            subtotalLabel:
                "Subtotal estimado",
            subtotalNote:
                "El carrito está vacío.",
            busy: false,
            verified: false,
        };
    }

    if (!validationEnabled || phase === "disabled") {
        return {
            state: "estimated",
            tone: "information",
            icon: "i",
            eyebrow: "Importe estimado",
            title:
                "La comprobación del servidor todavía no está activa",
            message:
                "Puedes revisar el carrito, pero el precio y la disponibilidad no se considerarán confirmados hasta activar la validación.",
            subtotalLabel:
                "Subtotal estimado",
            subtotalNote:
                "Calculado con la información guardada en este navegador.",
            busy: false,
            verified: false,
        };
    }

    if (phase === "validating") {
        return {
            state: "validating",
            tone: "pending",
            icon: "…",
            eyebrow: "Comprobación en curso",
            title:
                "Comprobando precios y disponibilidad",
            message:
                "TodoSatcom está reconstruyendo el carrito en el servidor. Puedes seguir viendo los productos mientras termina.",
            subtotalLabel:
                "Subtotal estimado",
            subtotalNote:
                "El importe se actualizará cuando el servidor termine la comprobación.",
            busy: true,
            verified: false,
        };
    }

    if (
        phase === "verified" &&
        hasValidatedCart
    ) {
        return {
            state: "verified",
            tone: "success",
            icon: "✓",
            eyebrow: "Comprobación completada",
            title: "Carrito verificado",
            message:
                "Los nombres, precios, cantidades y la necesidad de envío coinciden con los datos actuales del servidor.",
            subtotalLabel:
                "Subtotal verificado",
            subtotalNote:
                "Confirmado por el servidor para esta combinación de productos y cantidades.",
            busy: false,
            verified: true,
        };
    }

    if (phase === "error") {
        return {
            state: "error",
            tone: "error",
            icon: "!",
            eyebrow:
                "Comprobación no completada",
            title:
                "No se ha podido verificar el carrito",
            message:
                errorMessage ||
                "Los productos se conservan, pero no es posible confirmar ahora sus precios y disponibilidad.",
            subtotalLabel:
                "Subtotal estimado",
            subtotalNote:
                "No continúes al pago hasta que el servidor pueda comprobar el carrito.",
            busy: false,
            verified: false,
        };
    }

    return {
        state: "estimated",
        tone: "information",
        icon: "i",
        eyebrow: "Pendiente de comprobación",
        title:
            phase === "scheduled"
                ? "Comprobaremos el carrito en unos instantes"
                : "El subtotal todavía es estimado",
        message:
            "Cualquier cambio de cantidad invalida la comprobación anterior. El servidor volverá a verificar el carrito antes del pago.",
        subtotalLabel:
            "Subtotal estimado",
        subtotalNote:
            "Calculado con la información guardada en este navegador.",
        busy: false,
        verified: false,
    };
}

export function getValidationToneClasses(
    tone,
) {
    const selected =
        VALIDATION_TONES[tone];

    if (!selected) {
        throw new TypeError(
            "Tono de validación no reconocido.",
        );
    }

    return selected;
}

export function getShippingPresentation({
    items,
    validatedCart = null,
    verified = false,
}) {
    if (!Array.isArray(items)) {
        throw new TypeError(
            "items debe ser un array.",
        );
    }

    const requiresShipping =
        verified &&
        validatedCart &&
        typeof validatedCart
            .requiereEnvio === "boolean"
            ? validatedCart
                  .requiereEnvio
            : items.some(
                  (item) =>
                      item &&
                      item
                          .requiereEnvio ===
                          true,
              );

    if (requiresShipping) {
        return {
            requiresShipping: true,
            title: verified
                ? "Este pedido requiere envío"
                : "Tu selección incluye productos con envío",
            message: verified
                ? "Stripe solicitará destinatario, dirección y teléfono cuando el checkout se active. Las tarifas y condiciones definitivas siguen pendientes de activación."
                : "Según la información guardada, al menos un producto necesita envío. El servidor lo confirmará antes del pago.",
            status: verified
                ? "verified"
                : "estimated",
        };
    }

    return {
        requiresShipping: false,
        title: verified
            ? "Este pedido no requiere dirección de envío"
            : "No se ha detectado envío en tu selección",
        message: verified
            ? "Stripe no necesitará datos logísticos para este carrito. Cuando el checkout se active, seguirá solicitando el correo necesario para el pago y las comunicaciones operativas."
            : "El servidor confirmará si el pedido puede completarse sin dirección de envío.",
        status: verified
            ? "verified"
            : "estimated",
    };
}
