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

const clearButton =
    document.querySelector<HTMLButtonElement>(
        "[data-cart-clear]",
    );

const currencyFormatter =
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    });

function formatPrice(
    valueCentimos: number,
) {
    return currencyFormatter.format(
        valueCentimos / 100,
    );
}

function showError(message: string) {
    if (!cartError) {
        return;
    }

    cartError.textContent = message;

    window.setTimeout(() => {
        if (
            cartError.textContent ===
            message
        ) {
            cartError.textContent = "";
        }
    }, 5000);
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
    button.className = className;
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
        "grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[140px_1fr]";

    const imageLink =
        document.createElement("a");

    imageLink.href =
        `/tienda/producto/${encodeURIComponent(
            item.slug,
        )}`;

    imageLink.className =
        "flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4";

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
        "flex items-start justify-between gap-4";

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
        "transition hover:text-orange-700";

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
        "mt-auto flex flex-wrap items-end justify-between gap-5 pt-6";

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
        "text-right";

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
    const isEmpty =
        items.length === 0;

    cartItemsRegion.replaceChildren(
        ...items.map(
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
        getCartCount(items);

    cartUnits.textContent =
        `${units} ${
            units === 1
                ? "unidad"
                : "unidades"
        }`;

    cartSubtotal.textContent =
        formatPrice(
            getCartSubtotal(items),
        );

    if (clearButton) {
        clearButton.disabled =
            isEmpty;
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
                renderCart();
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
            } catch (error) {
                showError(
                    error instanceof Error
                        ? error.message
                        : "No se ha podido actualizar el carrito.",
                );
            }

            renderCart();
            return;
        }

        const clearControl =
            target.closest<HTMLButtonElement>(
                "[data-cart-clear]",
            );

        if (clearControl) {
            clearCart();
            renderCart();
        }
    },
);

window.addEventListener(
    CART_CHANGE_EVENT,
    renderCart,
);

window.addEventListener(
    "storage",
    (event) => {
        if (
            event.key ===
            "todosatcom:cart:v1"
        ) {
            renderCart();
        }
    },
);

renderCart();
