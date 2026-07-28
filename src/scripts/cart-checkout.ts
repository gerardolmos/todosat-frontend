import {
    CART_CHANGE_EVENT,
    readCart,
    type CartItem,
} from "../lib/cart";

import {
    CartValidationError,
    isCartValidationEnabled,
    validateCartWithServer,
} from "../lib/cart-validation";

import {
    CheckoutError,
    createCheckoutSession,
    isCheckoutEnabled,
} from "../lib/checkout";

const checkoutButton =
    document.querySelector<HTMLButtonElement>(
        "[data-cart-checkout]",
    );

const checkoutStatus =
    document.querySelector<HTMLElement>(
        "[data-cart-checkout-status]",
    );

const IDEMPOTENCY_STORAGE_KEY =
    "todosatcom:checkout-idempotency:v1";

let checkoutInProgress = false;

function consumeCheckoutCancellation():
    boolean {
    try {
        const url =
            new URL(window.location.href);

        const params =
            url.searchParams;

        if (
            params.get("checkout") !==
            "cancelado"
        ) {
            return false;
        }

        params.delete("checkout");

        const cleanAddress =
            `${url.pathname}` +
            `${url.search}` +
            `${url.hash}`;

        window.history.replaceState(
            window.history.state,
            "",
            cleanAddress,
        );

        return true;
    } catch {
        return false;
    }
}

const checkoutWasCancelled =
    consumeCheckoutCancellation();

function getCartSignature(
    items: CartItem[],
): string {
    return items
        .map(
            (item) =>
                `${item.documentId}:${item.cantidad}`,
        )
        .sort()
        .join("|");
}

function createIdempotencyKey(): string {
    const randomPart =
        typeof crypto.randomUUID ===
        "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2)}`;

    return `checkout:${randomPart}`;
}

function getIdempotencyKey(
    items: CartItem[],
): string {
    const signature =
        getCartSignature(items);

    try {
        const stored =
            window.sessionStorage.getItem(
                IDEMPOTENCY_STORAGE_KEY,
            );

        if (stored) {
            const parsed =
                JSON.parse(stored) as {
                    signature?: unknown;
                    key?: unknown;
                };

            if (
                parsed.signature ===
                    signature &&
                typeof parsed.key ===
                    "string" &&
                parsed.key
            ) {
                return parsed.key;
            }
        }

        const key =
            createIdempotencyKey();

        window.sessionStorage.setItem(
            IDEMPOTENCY_STORAGE_KEY,
            JSON.stringify({
                signature,
                key,
            }),
        );

        return key;
    } catch {
        return createIdempotencyKey();
    }
}

function setStatus(
    message: string,
    isError = false,
) {
    if (!checkoutStatus) {
        return;
    }

    checkoutStatus.textContent =
        message;

    checkoutStatus.classList.toggle(
        "text-red-700",
        isError,
    );

    checkoutStatus.classList.toggle(
        "font-bold",
        isError,
    );
}

function updateCheckoutControl() {
    if (!checkoutButton) {
        return;
    }

    const items = readCart();

    if (checkoutInProgress) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
            "Preparando pago seguro…";

        setStatus(
            "Estamos comprobando nuevamente precios y disponibilidad.",
        );

        return;
    }

    if (!isCheckoutEnabled()) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
            "Pago todavía no disponible";

        setStatus(
            "El checkout permanece desactivado durante esta fase de desarrollo.",
        );

        return;
    }

    if (!isCartValidationEnabled()) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
            "Validación no disponible";

        setStatus(
            "El carrito debe poder validarse antes de continuar.",
            true,
        );

        return;
    }

    if (items.length === 0) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
            "Carrito vacío";

        setStatus(
            "Añade al menos un producto para continuar.",
        );

        return;
    }

    checkoutButton.disabled = false;
    checkoutButton.textContent =
        "Continuar al pago seguro";

    setStatus(
        "Antes de abrir Stripe, el carrito se comprobará nuevamente en Strapi.",
    );
}

async function startCheckout() {
    if (
        checkoutInProgress ||
        !isCheckoutEnabled() ||
        !isCartValidationEnabled()
    ) {
        updateCheckoutControl();
        return;
    }

    const items = readCart();

    if (items.length === 0) {
        updateCheckoutControl();
        return;
    }

    checkoutInProgress = true;
    updateCheckoutControl();

    const controller =
        new AbortController();

    try {
        await validateCartWithServer(
            items,
            controller.signal,
        );

        const checkout =
            await createCheckoutSession(
                items,
                getIdempotencyKey(items),
                controller.signal,
            );

        setStatus(
            `Pedido ${checkout.numeroPedido} preparado. Abriendo Stripe…`,
        );

        window.location.assign(
            checkout.checkoutUrl,
        );
    } catch (error) {
        checkoutInProgress = false;
        updateCheckoutControl();

        const message =
            error instanceof
                CartValidationError ||
            error instanceof CheckoutError
                ? error.message
                : "No se ha podido preparar el pago seguro.";

        setStatus(
            message,
            true,
        );
    }
}

document.addEventListener(
    "click",
    (event) => {
        const target =
            event.target;

        if (
            !(target instanceof Element)
        ) {
            return;
        }

        const button =
            target.closest<HTMLButtonElement>(
                "[data-cart-checkout]",
            );

        if (
            !button ||
            button !== checkoutButton
        ) {
            return;
        }

        void startCheckout();
    },
);

window.addEventListener(
    CART_CHANGE_EVENT,
    updateCheckoutControl,
);

window.addEventListener(
    "storage",
    (event) => {
        if (
            event.key ===
            "todosatcom:cart:v1"
        ) {
            updateCheckoutControl();
        }
    },
);

updateCheckoutControl();

if (checkoutWasCancelled) {
    setStatus(
        "Has vuelto sin completar el pago. Tu carrito se conserva.",
    );
}
