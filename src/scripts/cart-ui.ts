import {
    addCartItem,
    CART_CHANGE_EVENT,
    getCartCount,
    readCart,
    type CartItem,
} from "../lib/cart";

interface AddButton
    extends HTMLButtonElement {
    dataset: DOMStringMap & {
        cartAdd?: string;
        documentId?: string;
        slug?: string;
        nombre?: string;
        sku?: string;
        precioCentimos?: string;
        moneda?: string;
        imagenUrl?: string;
        requiereEnvio?: string;
    };
}

function updateCartBadges() {
    const count = getCartCount();

    document
        .querySelectorAll<HTMLElement>(
            "[data-cart-count]",
        )
        .forEach((badge) => {
            badge.textContent =
                String(count);

            badge.hidden =
                count === 0;

            badge.setAttribute(
                "aria-label",
                `${count} ${
                    count === 1
                        ? "producto"
                        : "productos"
                } en el carrito`,
            );
        });
}

function showCartMessage(
    message: string,
    isError = false,
) {
    const region =
        document.querySelector<HTMLElement>(
            "[data-cart-message]",
        );

    if (!region) {
        return;
    }

    region.textContent = message;

    region.dataset.state =
        isError
            ? "error"
            : "success";

    window.setTimeout(() => {
        if (
            region.textContent ===
            message
        ) {
            region.textContent = "";
            delete region.dataset.state;
        }
    }, 4000);
}

function getButtonItem(
    button: AddButton,
): Omit<CartItem, "cantidad"> | null {
    const precioCentimos = Number(
        button.dataset
            .precioCentimos,
    );

    if (
        !button.dataset.documentId ||
        !button.dataset.slug ||
        !button.dataset.nombre ||
        !button.dataset.sku ||
        button.dataset.moneda !==
            "EUR" ||
        !Number.isSafeInteger(
            precioCentimos,
        ) ||
        precioCentimos <= 0
    ) {
        return null;
    }

    return {
        documentId:
            button.dataset.documentId,
        slug:
            button.dataset.slug,
        nombre:
            button.dataset.nombre,
        sku:
            button.dataset.sku,
        precioCentimos,
        moneda: "EUR",
        imagenUrl:
            button.dataset.imagenUrl ||
            null,
        requiereEnvio:
            button.dataset
                .requiereEnvio ===
            "true",
    };
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
            target.closest<AddButton>(
                "[data-cart-add]",
            );

        if (!button) {
            return;
        }

        const item =
            getButtonItem(button);

        if (!item) {
            showCartMessage(
                "No se ha podido añadir el producto.",
                true,
            );
            return;
        }

        try {
            addCartItem(item, 1);

            showCartMessage(
                `${item.nombre} se ha añadido al carrito.`,
            );

            button.dataset
                .originalLabel ??=
                button.textContent?.trim() ||
                "Añadir al carrito";

            button.textContent =
                "Añadido";

            window.setTimeout(() => {
                button.textContent =
                    button.dataset
                        .originalLabel ||
                    "Añadir al carrito";
            }, 1400);
        } catch (error) {
            showCartMessage(
                error instanceof Error
                    ? error.message
                    : "No se ha podido añadir el producto.",
                true,
            );
        }
    },
);

window.addEventListener(
    CART_CHANGE_EVENT,
    updateCartBadges,
);

window.addEventListener(
    "storage",
    (event) => {
        if (
            event.key ===
            "todosatcom:cart:v1"
        ) {
            updateCartBadges();
        }
    },
);

readCart();
updateCartBadges();
