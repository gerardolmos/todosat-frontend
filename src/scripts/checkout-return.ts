import {
    CheckoutStatusError,
    getCheckoutPublicStatus,
    isCheckoutStatusEnabled,
    isValidCheckoutSessionId,
    type CheckoutPublicStatus,
} from "../lib/checkout-status";

import {
    CHECKOUT_RETURN_STATES,
    getCheckoutReturnView,
} from "../lib/checkout-return-view.js";

const returnRoot =
    document.querySelector<HTMLElement>(
        "[data-checkout-return]",
    );

const returnIcon =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-icon]",
    );

const returnEyebrow =
    document.querySelector<HTMLElement>(
        "[data-checkout-return-eyebrow]",
    );

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

const retryControl =
    document.querySelector<HTMLButtonElement>(
        "[data-checkout-return-retry]",
    );

const primaryAction =
    document.querySelector<HTMLAnchorElement>(
        "[data-checkout-return-primary]",
    );

const secondaryAction =
    document.querySelector<HTMLAnchorElement>(
        "[data-checkout-return-secondary]",
    );

const MAX_STATUS_ATTEMPTS = 8;
const STATUS_RETRY_DELAY_MS = 2000;

let activeController:
    AbortController | null = null;

let currentSessionId:
    string | null = null;

function renderView(
    state: string,
    options: {
        canRetry?: boolean;
        focusTitle?: boolean;
    } = {},
) {
    const view =
        getCheckoutReturnView(
            state,
            {
                canRetry:
                    options.canRetry,
            },
        );

    if (returnRoot) {
        returnRoot.dataset.checkoutState =
            view.state;

        returnRoot.setAttribute(
            "aria-busy",
            String(view.busy),
        );
    }

    if (returnIcon) {
        returnIcon.textContent =
            view.icon;
    }

    if (returnEyebrow) {
        returnEyebrow.textContent =
            view.eyebrow;
    }

    if (returnTitle) {
        returnTitle.textContent =
            view.title;
    }

    if (returnMessage) {
        returnMessage.textContent =
            view.message;
    }

    if (noticeTitle) {
        noticeTitle.textContent =
            view.noticeTitle;
    }

    if (noticeMessage) {
        noticeMessage.textContent =
            view.noticeMessage;
    }

    if (retryControl) {
        retryControl.hidden =
            !view.showRetry;

        retryControl.disabled =
            view.busy;
    }

    if (primaryAction) {
        primaryAction.textContent =
            view.primaryLabel;

        primaryAction.href =
            view.primaryHref;
    }

    if (secondaryAction) {
        secondaryAction.textContent =
            view.secondaryLabel;

        secondaryAction.href =
            view.secondaryHref;

        secondaryAction.hidden =
            !view.showSecondary;
    }

    if (
        options.focusTitle &&
        returnTitle
    ) {
        returnTitle.focus({
            preventScroll: false,
        });
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
    canRetry = false,
) {
    switch (status.estadoPago) {
        case "confirmado":
            renderView(
                CHECKOUT_RETURN_STATES.CONFIRMED,
            );
            return;

        case "fallido":
            renderView(
                CHECKOUT_RETURN_STATES.FAILED,
            );
            return;

        case "cancelado":
            renderView(
                CHECKOUT_RETURN_STATES.CANCELLED,
            );
            return;

        case "reembolsado":
            renderView(
                CHECKOUT_RETURN_STATES.REFUNDED,
            );
            return;

        case "reembolso_parcial":
            renderView(
                CHECKOUT_RETURN_STATES.PARTIAL_REFUND,
            );
            return;

        case "pendiente":
        case "no_disponible":
        default:
            renderView(
                CHECKOUT_RETURN_STATES.PENDING,
                {
                    canRetry,
                },
            );
    }
}

async function monitorStatus(
    sessionId: string,
    {
        focusTitle = false,
    } = {},
) {
    activeController?.abort();

    activeController =
        new AbortController();

    renderView(
        CHECKOUT_RETURN_STATES.CHECKING,
        {
            focusTitle,
        },
    );

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

            const lastAttempt =
                attempt ===
                MAX_STATUS_ATTEMPTS;

            renderStatus(
                status,
                lastAttempt &&
                    shouldRetry(status),
            );

            if (
                !shouldRetry(status) ||
                lastAttempt
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
                void error;

                renderView(
                    CHECKOUT_RETURN_STATES.UNAVAILABLE,
                    {
                        focusTitle: true,
                    },
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
        renderView(
            CHECKOUT_RETURN_STATES.INVALID,
        );

        return;
    }

    currentSessionId =
        sessionId;

    if (
        !isCheckoutStatusEnabled()
    ) {
        renderView(
            CHECKOUT_RETURN_STATES.DISABLED,
        );

        return;
    }

    void monitorStatus(sessionId);
}

retryControl?.addEventListener(
    "click",
    () => {
        if (!currentSessionId) {
            return;
        }

        void monitorStatus(
            currentSessionId,
            {
                focusTitle: true,
            },
        );
    },
);

window.addEventListener(
    "pagehide",
    () => {
        activeController?.abort();
    },
);

initializeReturnPage();
