import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
    CART_VALIDATION_PHASES,
    deriveCartViewState,
    getShippingPresentation,
    getValidationToneClasses,
} from "../src/lib/cart-view-state.js";

const root =
    path.resolve(
        import.meta.dirname,
        "..",
    );

function read(relative) {
    return fs.readFileSync(
        path.join(root, relative),
        "utf8",
    );
}

test(
    "el modelo distingue los estados del carrito",
    () => {
        const empty =
            deriveCartViewState({
                itemCount: 0,
                validationEnabled:
                    false,
                phase:
                    CART_VALIDATION_PHASES
                        .IDLE,
                hasValidatedCart:
                    false,
            });

        assert.equal(
            empty.state,
            "empty",
        );

        const disabled =
            deriveCartViewState({
                itemCount: 1,
                validationEnabled:
                    false,
                phase:
                    CART_VALIDATION_PHASES
                        .DISABLED,
                hasValidatedCart:
                    false,
            });

        assert.equal(
            disabled.state,
            "estimated",
        );

        const validating =
            deriveCartViewState({
                itemCount: 1,
                validationEnabled:
                    true,
                phase:
                    CART_VALIDATION_PHASES
                        .VALIDATING,
                hasValidatedCart:
                    false,
            });

        assert.equal(
            validating.busy,
            true,
        );

        const verified =
            deriveCartViewState({
                itemCount: 1,
                validationEnabled:
                    true,
                phase:
                    CART_VALIDATION_PHASES
                        .VERIFIED,
                hasValidatedCart:
                    true,
            });

        assert.equal(
            verified.state,
            "verified",
        );

        assert.equal(
            verified.subtotalLabel,
            "Subtotal verificado",
        );

        const failed =
            deriveCartViewState({
                itemCount: 1,
                validationEnabled:
                    true,
                phase:
                    CART_VALIDATION_PHASES
                        .ERROR,
                hasValidatedCart:
                    false,
                errorMessage:
                    "Error controlado",
            });

        assert.equal(
            failed.message,
            "Error controlado",
        );
    },
);

test(
    "la información de envío cambia con la validación",
    () => {
        const estimated =
            getShippingPresentation({
                items: [
                    {
                        requiereEnvio:
                            true,
                    },
                ],
            });

        assert.equal(
            estimated.requiresShipping,
            true,
        );

        assert.equal(
            estimated.status,
            "estimated",
        );

        const verified =
            getShippingPresentation({
                items: [],
                validatedCart: {
                    requiereEnvio:
                        false,
                },
                verified: true,
            });

        assert.equal(
            verified.requiresShipping,
            false,
        );

        assert.equal(
            verified.status,
            "verified",
        );

        assert.match(
            verified.title,
            /no requiere/i,
        );
    },
);

test(
    "todos los tonos visuales están definidos",
    () => {
        for (
            const tone
            of [
                "neutral",
                "information",
                "pending",
                "success",
                "error",
            ]
        ) {
            const classes =
                getValidationToneClasses(
                    tone,
                );

            assert.match(
                classes.border,
                /^border-/,
            );

            assert.match(
                classes.background,
                /^bg-/,
            );
        }
    },
);

test(
    "la página incluye pasos, validación, envío y privacidad",
    () => {
        const page =
            read(
                "src/pages/tienda/carrito.astro",
            );

        assert.match(
            page,
            /CheckoutSteps/,
        );

        for (
            const selector
            of [
                "data-cart-validation-panel",
                "data-cart-validation-title",
                "data-cart-validation-message",
                "data-cart-shipping-title",
                "data-cart-shipping-message",
                "data-cart-privacy",
                "data-cart-subtotal-note",
            ]
        ) {
            assert.match(
                page,
                new RegExp(selector),
            );
        }

        assert.doesNotMatch(
            page,
            /<(?:input|select|textarea)\b/i,
        );

        assert.match(
            page,
            /Stripe/,
        );
    },
);

test(
    "el indicador de pasos es informativo y accesible",
    () => {
        const component =
            read(
                "src/components/store/CheckoutSteps.astro",
            );

        assert.match(
            component,
            /aria-label="Progreso de compra"/,
        );

        assert.match(
            component,
            /aria-current=/,
        );

        assert.match(
            component,
            /Carrito/,
        );

        assert.match(
            component,
            /Pago seguro/,
        );

        assert.match(
            component,
            /Confirmación/,
        );

        assert.doesNotMatch(
            component,
            /<a\b/,
        );
    },
);

test(
    "el controlador utiliza el modelo explícito de estados",
    () => {
        const controller =
            read(
                "src/scripts/cart-page.ts",
            );

        assert.match(
            controller,
            /deriveCartViewState/,
        );

        assert.match(
            controller,
            /getShippingPresentation/,
        );

        assert.match(
            controller,
            /validationPhase/,
        );

        assert.match(
            controller,
            /aria-busy/,
        );
    },
);

test(
    "el frontend no envía ni persiste datos personales",
    () => {
        const checkout =
            read(
                "src/lib/checkout.ts",
            );

        const cartPage =
            read(
                "src/scripts/cart-page.ts",
            );

        const combined =
            `${checkout}\n${cartPage}`;

        assert.doesNotMatch(
            combined,
            /\b(?:nombreCliente|customerEmail|telefonoCliente|direccionEnvio)\b/,
        );

        assert.match(
            checkout,
            /credentials:\s*"omit"/,
        );

        assert.match(
            checkout,
            /documentId/,
        );

        assert.match(
            checkout,
            /cantidad/,
        );
    },
);

test(
    "las funciones reales permanecen desactivadas por defecto",
    () => {
        const environment =
            read(".env.example");

        for (
            const line
            of [
                "PUBLIC_CART_VALIDATION_ENABLED=false",
                "PUBLIC_CHECKOUT_ENABLED=false",
                "PUBLIC_CHECKOUT_STATUS_ENABLED=false",
            ]
        ) {
            assert.match(
                environment,
                new RegExp(
                    `^${line}$`,
                    "m",
                ),
            );
        }
    },
);

test(
    "los errores del carrito son persistentes y descartables",
    () => {
        const controller =
            read(
                "src/scripts/cart-page.ts",
            );

        const showErrorBlock =
            controller.slice(
                controller.indexOf(
                    "function showError",
                ),
                controller.indexOf(
                    "function getSafeImageUrl",
                ),
            );

        assert.doesNotMatch(
            showErrorBlock,
            /setTimeout/,
        );

        assert.match(
            controller,
            /function clearError/,
        );

        const page =
            read(
                "src/pages/tienda/carrito.astro",
            );

        assert.match(
            page,
            /data-cart-error-message/,
        );

        assert.match(
            page,
            /data-cart-error-dismiss/,
        );

        assert.match(
            page,
            /tabindex="-1"/,
        );
    },
);

test(
    "el error de validación permite reintento manual",
    () => {
        const page =
            read(
                "src/pages/tienda/carrito.astro",
            );

        const controller =
            read(
                "src/scripts/cart-page.ts",
            );

        assert.match(
            page,
            /data-cart-validation-retry/,
        );

        assert.match(
            controller,
            /viewState\.state !== "error"/,
        );

        assert.match(
            controller,
            /validateCurrentCart\(\s*readCart\(\)/s,
        );

        assert.match(
            controller,
            /validationPanel\?\.focus/,
        );
    },
);

test(
    "vaciar el carrito requiere confirmación accesible",
    () => {
        const page =
            read(
                "src/pages/tienda/carrito.astro",
            );

        const controller =
            read(
                "src/scripts/cart-page.ts",
            );

        assert.match(
            page,
            /<dialog[\s\S]*data-cart-clear-dialog/,
        );

        assert.match(
            page,
            /aria-labelledby="cart-clear-title"/,
        );

        assert.match(
            page,
            /data-cart-clear-confirm/,
        );

        assert.match(
            page,
            /data-cart-clear-cancel/,
        );

        assert.match(
            controller,
            /showModal/,
        );

        assert.match(
            controller,
            /window\.confirm/,
        );

        assert.doesNotMatch(
            controller,
            /if \(clearControl\) \{\s*clearCart\(\)/,
        );
    },
);

test(
    "los controles principales cumplen foco y tamaño táctil",
    () => {
        const page =
            read(
                "src/pages/tienda/carrito.astro",
            );

        const controller =
            read(
                "src/scripts/cart-page.ts",
            );

        assert.match(
            page,
            /focus-visible:outline/,
        );

        assert.match(
            page,
            /motion-reduce:transition-none/,
        );

        assert.match(
            page,
            /min-h-11/,
        );

        assert.match(
            controller,
            /min-h-11 focus-visible:outline/,
        );

        assert.match(
            controller,
            /sm:grid-cols-\[minmax\(0,1fr\)_auto\]/,
        );

        assert.match(
            page,
            /xl:sticky/,
        );
    },
);
