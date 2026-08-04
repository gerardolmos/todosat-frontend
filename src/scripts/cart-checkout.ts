import {
    CART_CHANGE_EVENT,
    readCart,
    saveCart,
    type CartItem,
} from "../lib/cart";

import {
    CartValidationError,
    isCartValidationEnabled,
    validateCartWithServer,
} from "../lib/cart-validation";

import {
    reconcileCartWithValidation,
} from "../lib/cart-checkout-review.js";

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

const checkoutDemoDialog =
    document.querySelector<HTMLDialogElement>(
        "[data-checkout-demo-dialog]",
    );

const checkoutDemoCloseButtons =
    document.querySelectorAll<HTMLButtonElement>(
        "[data-checkout-demo-close]",
    );

const IDEMPOTENCY_STORAGE_KEY =
    "todosatcom:checkout-idempotency:v1";

let checkoutInProgress = false;
let reviewRequiredSignature = "";
let reviewMessage = "";

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

type StatusTone =
    | "neutral"
    | "warning"
    | "error";

function setStatus(
    message: string,
    tone: StatusTone = "neutral",
) {
    if (!checkoutStatus) {
        return;
    }

    checkoutStatus.textContent =
        message;

    checkoutStatus.dataset.tone =
        tone;

    checkoutStatus.classList.remove(
        "text-slate-600",
        "text-amber-800",
        "text-red-700",
        "font-bold",
    );

    if (tone === "warning") {
        checkoutStatus.classList.add(
            "text-amber-800",
            "font-bold",
        );
        return;
    }

    if (tone === "error") {
        checkoutStatus.classList.add(
            "text-red-700",
            "font-bold",
        );
        return;
    }

    checkoutStatus.classList.add(
        "text-slate-600",
    );
}

function focusCheckoutStatus() {
    requestAnimationFrame(() => {
        checkoutStatus?.focus();
    });
}

function clearReviewWhenCartChanges() {
    if (!reviewRequiredSignature) {
        return;
    }

    const signature =
        getCartSignature(
            readCart(),
        );

    if (
        signature !==
        reviewRequiredSignature
    ) {
        reviewRequiredSignature = "";
        reviewMessage = "";
    }
}

function updateCheckoutControl() {
    if (!checkoutButton) {
        return;
    }

    const items = readCart();
    const signature =
        getCartSignature(items);

    if (checkoutInProgress) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
            "Comprobando el pedido…";

        setStatus(
            "Estamos confirmando el precio y la disponibilidad.",
        );

        return;
    }

    if (!isCartValidationEnabled()) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
            "Compra online no disponible";

        setStatus(
            "No podemos completar la compra en este momento.",
            "error",
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

    if (
        reviewRequiredSignature ===
        signature
    ) {
        checkoutButton.textContent =
            "Confirmar cambios y continuar";

        setStatus(
            reviewMessage ||
                "Revisa el carrito actualizado y vuelve a continuar.",
            "warning",
        );

        return;
    }

    if (!isCheckoutEnabled()) {
        checkoutButton.textContent =
            "Revisar pedido";

        setStatus(
            "Confirmaremos el precio y la disponibilidad antes de mostrar el siguiente paso.",
        );

        return;
    }

    checkoutButton.textContent =
        "Continuar al pago";

    setStatus(
        "Confirmaremos el precio y la disponibilidad antes de abrir el pago.",
    );
}

async function startCheckout() {
    if (
        checkoutInProgress ||
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

    const requestedSignature =
        getCartSignature(items);

    checkoutInProgress = true;
    updateCheckoutControl();

    const controller =
        new AbortController();

    try {
        const validatedCart =
            await validateCartWithServer(
                items,
                controller.signal,
            );

        if (
            getCartSignature(
                readCart(),
            ) !== requestedSignature
        ) {
            throw new CheckoutError(
                "CART_CHANGED_DURING_CHECKOUT",
                "El carrito ha cambiado. Revísalo y vuelve a continuar.",
                409,
            );
        }

        const reconciliation =
            reconcileCartWithValidation(
                items,
                validatedCart,
            );

        if (reconciliation.changed) {
            reviewRequiredSignature =
                requestedSignature;

            reviewMessage =
                "Hemos actualizado el carrito. Revisa el nuevo importe y vuelve a continuar.";

            saveCart(
                reconciliation.items,
            );

            checkoutInProgress = false;
            updateCheckoutControl();
            focusCheckoutStatus();
            return;
        }

        reviewRequiredSignature = "";
        reviewMessage = "";

        if (!isCheckoutEnabled()) {
            checkoutInProgress = false;
            updateCheckoutControl();

            if (checkoutDemoDialog) {
                checkoutDemoDialog.showModal();
            }

            return;
        }

        const checkout =
            await createCheckoutSession(
                items,
                getIdempotencyKey(items),
                controller.signal,
            );

        setStatus(
            "Abriendo el pago…",
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
                : "No hemos podido preparar el pago.";

        setStatus(
            message,
            "error",
        );

        focusCheckoutStatus();
    }
}

checkoutDemoCloseButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                checkoutDemoDialog?.close();
            },
        );
    },
);

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
    () => {
        clearReviewWhenCartChanges();
        updateCheckoutControl();
    },
);

window.addEventListener(
    "storage",
    (event) => {
        if (
            event.key ===
            "todosatcom:cart:v1"
        ) {
            clearReviewWhenCartChanges();
            updateCheckoutControl();
        }
    },
);

updateCheckoutControl();

if (checkoutWasCancelled) {
    setStatus(
        "Has vuelto sin completar el pago. Tu carrito se conserva.",
        "warning",
    );
}
