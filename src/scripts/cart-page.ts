import {
    CART_CHANGE_EVENT,
    clearCart,
    getCartCount,
    getCartSubtotal,
    readCart,
    removeCartItem,
    setCartItemQuantity,
    type CartItem,
} from "../lib/cart";
import {
    CartValidationError,
    isCartValidationEnabled,
    validateCartWithServer,
    type ValidatedCart,
} from "../lib/cart-validation";
import {
    CART_VALIDATION_PHASES,
    deriveCartViewState,
    getShippingPresentation,
    getValidationToneClasses,
} from "../lib/cart-view-state.js";

const cartItemsRegion =
    document.querySelector<HTMLElement>(
        "[data-cart-items]",
    );

const cartEmptyRegion =
    document.querySelector<HTMLElement>(
        "[data-cart-empty]",
    );

const cartSummary =
    document.querySelector<HTMLElement>(
        "[data-cart-summary]",
    );

const cartSubtotal =
    document.querySelector<HTMLElement>(
        "[data-cart-subtotal]",
    );

const cartUnits =
    document.querySelector<HTMLElement>(
        "[data-cart-units]",
    );

const cartError =
    document.querySelector<HTMLElement>(
        "[data-cart-error]",
    );

const cartErrorMessage =
    document.querySelector<HTMLElement>(
        "[data-cart-error-message]",
    );

const cartSubtotalLabel =
    document.querySelector<HTMLElement>(
        "[data-cart-subtotal-label]",
    );

const clearButton =
    document.querySelector<HTMLButtonElement>(
        "[data-cart-clear]",
    );

const cartShell =
    document.querySelector<HTMLElement>(
        "[data-cart-shell]",
    );

const validationPanel =
    document.querySelector<HTMLElement>(
        "[data-cart-validation-panel]",
    );

const validationIcon =
    document.querySelector<HTMLElement>(
        "[data-cart-validation-icon]",
    );

const validationEyebrow =
    document.querySelector<HTMLElement>(
        "[data-cart-validation-eyebrow]",
    );

const validationTitle =
    document.querySelector<HTMLElement>(
        "[data-cart-validation-title]",
    );

const validationMessage =
    document.querySelector<HTMLElement>(
        "[data-cart-validation-message]",
    );

const validationRetryButton =
    document.querySelector<HTMLButtonElement>(
        "[data-cart-validation-retry]",
    );

const subtotalNote =
    document.querySelector<HTMLElement>(
        "[data-cart-subtotal-note]",
    );

const shippingPanel =
    document.querySelector<HTMLElement>(
        "[data-cart-shipping]",
    );

const shippingTitle =
    document.querySelector<HTMLElement>(
        "[data-cart-shipping-title]",
    );

const shippingMessage =
    document.querySelector<HTMLElement>(
        "[data-cart-shipping-message]",
    );

const clearDialog =
    document.querySelector<HTMLDialogElement>(
        "[data-cart-clear-dialog]",
    );

const currencyFormatter =
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    });

let validatedCart:
    ValidatedCart | null = null;

let validatedCartSignature = "";

let validationPhase =
    isCartValidationEnabled()
        ? CART_VALIDATION_PHASES.IDLE
        : CART_VALIDATION_PHASES.DISABLED;

let validationErrorMessage = "";

let validationRequestSequence = 0;

let validationController:
    AbortController | null = null;

let validationDebounceTimer:
    number | null = null;

const CART_VALIDATION_DEBOUNCE_MS =
    800;

let refreshScheduled = false;

function formatPrice(
    valueCentimos: number,
) {
    return currencyFormatter.format(
        valueCentimos / 100,
    );
}

function clearError() {
    if (
        !cartError ||
        !cartErrorMessage
    ) {
        return;
    }

    cartError.hidden = true;
    cartErrorMessage.textContent = "";
}

function showError(message: string) {
    if (
        !cartError ||
        !cartErrorMessage
    ) {
        return;
    }

    cartErrorMessage.textContent =
        message;

    cartError.hidden = false;

    requestAnimationFrame(() => {
        cartError.focus();
    });
}

function getSafeImageUrl(
    value: string | null,
): string | null {
    if (!value) {
        return null;
    }

    try {
        const url = new URL(
            value,
            window.location.origin,
        );

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {
            return null;
        }

        return url.toString();
    } catch {
        return null;
    }
}

function createButton({
    label,
    action,
    documentId,
    className,
    disabled = false,
}: {
    label: string;
    action: string;
    documentId: string;
    className: string;
    disabled?: boolean;
}) {
    const button =
        document.createElement(
            "button",
        );

    button.type = "button";
    button.textContent = label;
    button.dataset.cartAction =
        action;
    button.dataset.documentId =
        documentId;
    button.className =
        `${className} min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 motion-reduce:transition-none`;
    button.disabled = disabled;

    return button;
}

function createCartItem(
    item: CartItem,
) {
    const article =
        document.createElement(
            "article",
        );

    article.className =
        "grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[140px_minmax(0,1fr)] sm:p-6";

    const imageLink =
        document.createElement("a");

    imageLink.href =
        `/tienda/producto/${encodeURIComponent(
            item.slug,
        )}`;

    imageLink.className =
        "flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:h-36";

    const safeImageUrl =
        getSafeImageUrl(
            item.imagenUrl,
        );

    if (safeImageUrl) {
        const image =
            document.createElement(
                "img",
            );

        image.src = safeImageUrl;
        image.alt = item.nombre;
        image.loading = "lazy";
        image.className =
            "h-full w-full object-contain";

        imageLink.append(image);
    } else {
        const fallback =
            document.createElement(
                "span",
            );

        fallback.textContent =
            "Sin imagen";

        fallback.className =
            "text-sm font-semibold text-slate-400";

        imageLink.append(fallback);
    }

    const content =
        document.createElement(
            "div",
        );

    content.className =
        "flex min-w-0 flex-col";

    const headingRow =
        document.createElement(
            "div",
        );

    headingRow.className =
        "flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4";

    const titleContainer =
        document.createElement(
            "div",
        );

    const title =
        document.createElement("h2");

    title.className =
        "text-xl font-bold leading-tight text-slate-950";

    const titleLink =
        document.createElement("a");

    titleLink.href =
        `/tienda/producto/${encodeURIComponent(
            item.slug,
        )}`;

    titleLink.textContent =
        item.nombre;

    titleLink.className =
        "rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 transition hover:text-orange-700 motion-reduce:transition-none";

    title.append(titleLink);

    const sku =
        document.createElement("p");

    sku.textContent =
        `SKU: ${item.sku}`;

    sku.className =
        "mt-2 text-xs font-semibold text-slate-500";

    titleContainer.append(
        title,
        sku,
    );

    const removeButton =
        createButton({
            label: "Eliminar",
            action: "remove",
            documentId:
                item.documentId,
            className:
                "shrink-0 text-sm font-bold text-slate-500 transition hover:text-red-700",
        });

    headingRow.append(
        titleContainer,
        removeButton,
    );

    const price =
        document.createElement("p");

    price.textContent =
        formatPrice(
            item.precioCentimos,
        );

    price.className =
        "mt-4 text-lg font-black text-slate-950";

    const controlsRow =
        document.createElement(
            "div",
        );

    controlsRow.className =
        "mt-auto grid gap-5 pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end";

    const quantityContainer =
        document.createElement(
            "div",
        );

    const quantityLabel =
        document.createElement(
            "p",
        );

    quantityLabel.textContent =
        "Cantidad";

    quantityLabel.className =
        "mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500";

    const quantityControls =
        document.createElement(
            "div",
        );

    quantityControls.className =
        "inline-flex items-center overflow-hidden rounded-full border border-slate-300 bg-white";

    const decreaseButton =
        createButton({
            label: "−",
            action: "decrease",
            documentId:
                item.documentId,
            className:
                "h-10 w-11 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40",
            disabled:
                item.cantidad <= 1,
        });

    decreaseButton.setAttribute(
        "aria-label",
        `Reducir cantidad de ${item.nombre}`,
    );

    const quantityValue =
        document.createElement(
            "span",
        );

    quantityValue.textContent =
        String(item.cantidad);

    quantityValue.className =
        "min-w-10 text-center text-sm font-black text-slate-950";

    quantityValue.setAttribute(
        "aria-label",
        `Cantidad: ${item.cantidad}`,
    );

    const increaseButton =
        createButton({
            label: "+",
            action: "increase",
            documentId:
                item.documentId,
            className:
                "h-10 w-11 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40",
            disabled:
                item.cantidad >= 20,
        });

    increaseButton.setAttribute(
        "aria-label",
        `Aumentar cantidad de ${item.nombre}`,
    );

    quantityControls.append(
        decreaseButton,
        quantityValue,
        increaseButton,
    );

    quantityContainer.append(
        quantityLabel,
        quantityControls,
    );

    const lineTotal =
        document.createElement(
            "div",
        );

    lineTotal.className =
        "text-left sm:text-right";

    const lineTotalLabel =
        document.createElement(
            "p",
        );

    lineTotalLabel.textContent =
        "Subtotal";

    lineTotalLabel.className =
        "text-xs font-bold uppercase tracking-[0.14em] text-slate-500";

    const lineTotalValue =
        document.createElement(
            "p",
        );

    lineTotalValue.textContent =
        formatPrice(
            item.precioCentimos *
                item.cantidad,
        );

    lineTotalValue.className =
        "mt-1 text-xl font-black text-slate-950";

    lineTotal.append(
        lineTotalLabel,
        lineTotalValue,
    );

    controlsRow.append(
        quantityContainer,
        lineTotal,
    );

    if (item.requiereEnvio) {
        const shipping =
            document.createElement(
                "p",
            );

        shipping.textContent =
            "Producto físico con envío.";

        shipping.className =
            "mt-5 text-sm text-slate-500";

        content.append(
            headingRow,
            price,
            controlsRow,
            shipping,
        );
    } else {
        content.append(
            headingRow,
            price,
            controlsRow,
        );
    }

    article.append(
        imageLink,
        content,
    );

    return article;
}

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

function getDisplayItems(
    items: CartItem[],
    activeValidation:
        ValidatedCart | null,
): CartItem[] {
    if (!activeValidation) {
        return items;
    }

    const validatedLines =
        new Map(
            activeValidation.lineas.map(
                (line) => [
                    line.documentId,
                    line,
                ],
            ),
        );

    return items.map((item) => {
        const validatedLine =
            validatedLines.get(
                item.documentId,
            );

        if (!validatedLine) {
            return item;
        }

        return {
            ...item,

            nombre:
                validatedLine.nombre,

            sku:
                validatedLine.sku,

            precioCentimos:
                validatedLine
                    .precioUnitarioCentimos,

            requiereEnvio:
                validatedLine
                    .requiereEnvio,
        };
    });
}


function renderCartPresentation(
    items: CartItem[],
    activeValidation:
        ValidatedCart | null,
) {
    const viewState =
        deriveCartViewState({
            itemCount: items.length,

            validationEnabled:
                isCartValidationEnabled(),

            phase:
                validationPhase,

            hasValidatedCart:
                activeValidation !==
                null,

            errorMessage:
                validationErrorMessage,
        });

    if (cartSubtotalLabel) {
        cartSubtotalLabel.textContent =
            viewState
                .subtotalLabel;
    }

    if (subtotalNote) {
        subtotalNote.textContent =
            viewState
                .subtotalNote;
    }

    if (cartShell) {
        cartShell.setAttribute(
            "aria-busy",
            String(
                viewState.busy,
            ),
        );
    }

    if (
        validationPanel &&
        validationIcon &&
        validationEyebrow &&
        validationTitle &&
        validationMessage
    ) {
        validationPanel.hidden =
            items.length === 0;

        validationPanel.dataset.state =
            viewState.state;

        validationIcon.textContent =
            viewState.icon;

        validationEyebrow.textContent =
            viewState.eyebrow;

        validationTitle.textContent =
            viewState.title;

        validationMessage.textContent =
            viewState.message;

        validationPanel.setAttribute(
            "role",
            viewState.state === "error"
                ? "alert"
                : "status",
        );

        validationPanel.setAttribute(
            "aria-live",
            viewState.state === "error"
                ? "assertive"
                : "polite",
        );

        if (validationRetryButton) {
            validationRetryButton.hidden =
                viewState.state !== "error";
        }

        const tone =
            getValidationToneClasses(
                viewState.tone,
            );

        const removableClasses = [
            "border-slate-200",
            "border-sky-200",
            "border-amber-200",
            "border-emerald-200",
            "border-red-200",
            "bg-white",
            "bg-sky-50",
            "bg-amber-50",
            "bg-emerald-50",
            "bg-red-50",
        ];

        validationPanel.classList.remove(
            ...removableClasses,
        );

        validationPanel.classList.add(
            tone.border,
            tone.background,
        );

        validationIcon.className =
            [
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black",
                tone.iconBackground,
                tone.iconText,
            ].join(" ");

        validationEyebrow.className =
            [
                "text-xs font-black uppercase tracking-[0.14em]",
                tone.eyebrow,
            ].join(" ");
    }

    const shipping =
        getShippingPresentation({
            items,
            validatedCart:
                activeValidation,

            verified:
                viewState.verified,
        });

    if (
        shippingPanel &&
        shippingTitle &&
        shippingMessage
    ) {
        shippingPanel.dataset.status =
            shipping.status;

        shippingTitle.textContent =
            shipping.title;

        shippingMessage.textContent =
            shipping.message;
    }
}

function renderCart() {
    if (
        !cartItemsRegion ||
        !cartEmptyRegion ||
        !cartSummary ||
        !cartSubtotal ||
        !cartUnits
    ) {
        return;
    }

    const items = readCart();

    const signature =
        getCartSignature(items);

    const activeValidation =
        validatedCart &&
        validatedCartSignature ===
            signature
            ? validatedCart
            : null;

    const displayItems =
        getDisplayItems(
            items,
            activeValidation,
        );

    const isEmpty =
        items.length === 0;

    cartItemsRegion.replaceChildren(
        ...displayItems.map(
            createCartItem,
        ),
    );

    cartItemsRegion.hidden =
        isEmpty;

    cartEmptyRegion.hidden =
        !isEmpty;

    cartSummary.hidden =
        isEmpty;

    const units =
        activeValidation
            ? activeValidation
                  .cantidadTotal
            : getCartCount(items);

    cartUnits.textContent =
        `${units} ${
            units === 1
                ? "unidad"
                : "unidades"
        }`;

    const subtotal =
        activeValidation
            ? activeValidation
                  .subtotalProductosCentimos
            : getCartSubtotal(items);

    cartSubtotal.textContent =
        formatPrice(subtotal);

    renderCartPresentation(
        items,
        activeValidation,
    );

    if (clearButton) {
        clearButton.disabled =
            isEmpty;
    }
}

async function validateCurrentCart(
    items: CartItem[],
) {
    const requestSequence =
        ++validationRequestSequence;

    validationController?.abort();
    validationController = null;

    if (items.length === 0) {
        validationPhase =
            CART_VALIDATION_PHASES.IDLE;

        validationErrorMessage = "";
        clearError();
        renderCart();
        return;
    }

    if (!isCartValidationEnabled()) {
        validationPhase =
            CART_VALIDATION_PHASES.DISABLED;

        validationErrorMessage = "";
        renderCart();
        return;
    }

    validationPhase =
        CART_VALIDATION_PHASES.VALIDATING;

    validationErrorMessage = "";
    renderCart();

    const requestedSignature =
        getCartSignature(items);

    const controller =
        new AbortController();

    validationController =
        controller;


    try {
        const result =
            await validateCartWithServer(
                items,
                controller.signal,
            );

        if (
            requestSequence !==
                validationRequestSequence ||
            getCartSignature(
                readCart(),
            ) !== requestedSignature
        ) {
            return;
        }

        validatedCart =
            result;

        validatedCartSignature =
            requestedSignature;

        validationPhase =
            CART_VALIDATION_PHASES.VERIFIED;

        validationErrorMessage = "";
        renderCart();

    } catch (error) {
        if (
            error instanceof DOMException &&
            error.name === "AbortError"
        ) {
            return;
        }

        if (
            requestSequence !==
            validationRequestSequence
        ) {
            return;
        }

        validatedCart = null;
        validatedCartSignature = "";

        renderCart();

        const message =
            error instanceof
            CartValidationError
                ? error.message
                : "No se ha podido comprobar el carrito.";

        validationPhase =
            CART_VALIDATION_PHASES.ERROR;

        validationErrorMessage =
            message;

        renderCart();

        requestAnimationFrame(() => {
            validationPanel?.focus();
        });
    } finally {
        if (
            requestSequence ===
            validationRequestSequence
        ) {
            validationController =
                null;
        }
    }
}

function refreshCart() {
    validatedCart = null;
    validatedCartSignature = "";

    /*
     * Un cambio en cantidades invalida
     * cualquier comprobación anterior.
     */
    validationController?.abort();
    validationController = null;
    validationRequestSequence += 1;

    if (
        validationDebounceTimer !==
        null
    ) {
        window.clearTimeout(
            validationDebounceTimer,
        );

        validationDebounceTimer =
            null;
    }

    const items = readCart();

    validationErrorMessage = "";

    validationPhase =
        items.length === 0
            ? CART_VALIDATION_PHASES.IDLE
            : isCartValidationEnabled()
              ? CART_VALIDATION_PHASES.SCHEDULED
              : CART_VALIDATION_PHASES.DISABLED;

    renderCart();

    if (
        items.length === 0 ||
        !isCartValidationEnabled()
    ) {
        return;
    }

    /*
     * Evita enviar una petición por cada
     * pulsación en los botones + y −.
     */
    validationDebounceTimer =
        window.setTimeout(
            () => {
                validationDebounceTimer =
                    null;

                void validateCurrentCart(
                    readCart(),
                );
            },

            CART_VALIDATION_DEBOUNCE_MS,
        );
}

function scheduleCartRefresh() {
    if (refreshScheduled) {
        return;
    }

    refreshScheduled = true;

    queueMicrotask(() => {
        refreshScheduled = false;
        refreshCart();
    });
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

        const actionButton =
            target.closest<HTMLButtonElement>(
                "[data-cart-action]",
            );

        if (actionButton) {
            const documentId =
                actionButton.dataset
                    .documentId;

            const action =
                actionButton.dataset
                    .cartAction;

            if (
                !documentId ||
                !action
            ) {
                return;
            }

            const item = readCart().find(
                (cartItem) =>
                    cartItem.documentId ===
                    documentId,
            );

            if (!item) {
                scheduleCartRefresh();
                return;
            }

            try {
                if (
                    action ===
                    "increase"
                ) {
                    setCartItemQuantity(
                        documentId,
                        item.cantidad + 1,
                    );
                }

                if (
                    action ===
                    "decrease"
                ) {
                    setCartItemQuantity(
                        documentId,
                        item.cantidad - 1,
                    );
                }

                if (
                    action ===
                    "remove"
                ) {
                    removeCartItem(
                        documentId,
                    );
                }

                clearError();
            } catch (error) {
                showError(
                    error instanceof Error
                        ? error.message
                        : "No se ha podido actualizar el carrito.",
                );
            }

            scheduleCartRefresh();
            return;
        }

        const clearControl =
            target.closest<HTMLButtonElement>(
                "[data-cart-clear]",
            );

        if (clearControl) {
            if (
                clearDialog &&
                typeof clearDialog.showModal ===
                    "function"
            ) {
                clearDialog.showModal();
                return;
            }

            if (
                window.confirm(
                    "¿Vaciar todo el carrito?",
                )
            ) {
                clearCart();
                clearError();
                scheduleCartRefresh();
            }

            return;
        }

        const retryControl =
            target.closest<HTMLButtonElement>(
                "[data-cart-validation-retry]",
            );

        if (retryControl) {
            void validateCurrentCart(
                readCart(),
            );
            return;
        }

        const dismissControl =
            target.closest<HTMLButtonElement>(
                "[data-cart-error-dismiss]",
            );

        if (dismissControl) {
            clearError();
            return;
        }

        const cancelClearControl =
            target.closest<HTMLButtonElement>(
                "[data-cart-clear-cancel]",
            );

        if (cancelClearControl) {
            clearDialog?.close("cancel");
            clearButton?.focus();
            return;
        }

        const confirmClearControl =
            target.closest<HTMLButtonElement>(
                "[data-cart-clear-confirm]",
            );

        if (confirmClearControl) {
            clearCart();
            clearError();
            clearDialog?.close(
                "confirm",
            );
            scheduleCartRefresh();
        }
    },
);

clearDialog?.addEventListener(
    "cancel",
    () => {
        clearButton?.focus();
    },
);

clearDialog?.addEventListener(
    "close",
    () => {
        if (
            clearDialog.returnValue !==
            "confirm"
        ) {
            clearButton?.focus();
        }
    },
);

window.addEventListener(
    CART_CHANGE_EVENT,
    scheduleCartRefresh,
);

window.addEventListener(
    "storage",
    (event) => {
        if (
            event.key ===
            "todosatcom:cart:v1"
        ) {
            scheduleCartRefresh();
        }
    },
);

scheduleCartRefresh();
