const returnTitle =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-title]",
    );

const returnMessage =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-message]",
    );

function isValidSessionId(
    value: string | null,
): value is string {
    return (
        typeof value === "string" &&
        value.length >= 12 &&
        value.length <= 255 &&
        /^cs_(?:test|live)_[A-Za-z0-9_]+$/.test(
            value,
        )
    );
}

function removeSessionIdFromAddress() {
    try {
        const url =
            new URL(window.location.href);

        if (
            !url.searchParams.has(
                "session_id",
            )
        ) {
            return;
        }

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
    } catch {
        /*
         * La limpieza de la barra de dirección
         * es defensiva. Su fallo no debe romper
         * el contenido informativo de la página.
         */
    }
}

function renderReturnState() {
    const params =
        new URLSearchParams(
            window.location.search,
        );

    const sessionId =
        params.get("session_id");

    removeSessionIdFromAddress();

    if (
        !returnTitle ||
        !returnMessage
    ) {
        return;
    }

    if (!isValidSessionId(sessionId)) {
        returnTitle.textContent =
            "No se ha recibido una referencia válida";

        returnMessage.textContent =
            "No podemos asociar esta visita a una sesión de pago. No se ha confirmado ningún cobro.";

        return;
    }

    returnTitle.textContent =
        "Estamos esperando una confirmación segura";

    returnMessage.textContent =
        "Has regresado desde la pasarela de pago, pero esta vuelta no confirma el cobro. El pedido solo podrá marcarse como pagado cuando el servidor valide la notificación segura correspondiente.";
}

renderReturnState();
