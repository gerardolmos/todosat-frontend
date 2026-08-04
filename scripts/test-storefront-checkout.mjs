import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
    reconcileCartWithValidation,
} from "../src/lib/cart-checkout-review.js";

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

const localItem = {
    documentId: "producto-1",
    slug: "antena-demo",
    nombre: "Antena demo",
    sku: "ANT-001",
    precioCentimos: 10000,
    moneda: "EUR",
    imagenUrl: "/demo.jpg",
    requiereEnvio: true,
    cantidad: 2,
};

function validatedLine(
    overrides = {},
) {
    return {
        documentId:
            localItem.documentId,
        sku: localItem.sku,
        nombre: localItem.nombre,
        cantidad:
            localItem.cantidad,
        precioUnitarioCentimos:
            localItem.precioCentimos,
        subtotalCentimos:
            localItem.precioCentimos *
            localItem.cantidad,
        moneda: "EUR",
        requiereEnvio:
            localItem.requiereEnvio,
        ...overrides,
    };
}

function validatedCart(
    lineOverrides = {},
) {
    const line =
        validatedLine(
            lineOverrides,
        );

    return {
        lineas: [line],
        cantidadTotal:
            line.cantidad,
        subtotalProductosCentimos:
            line.subtotalCentimos,
        moneda: "EUR",
        requiereEnvio:
            line.requiereEnvio,
        pagosRealesBloqueados:
            true,
    };
}

test(
    "la revisión final no cambia un carrito que coincide",
    () => {
        const result =
            reconcileCartWithValidation(
                [localItem],
                validatedCart(),
            );

        assert.equal(
            result.changed,
            false,
        );

        assert.deepEqual(
            result.changes,
            [],
        );

        assert.equal(
            result.items[0]
                .precioCentimos,
            10000,
        );
    },
);

test(
    "la revisión final actualiza precio y envío sin perder datos visuales",
    () => {
        const result =
            reconcileCartWithValidation(
                [localItem],
                validatedCart({
                    nombre:
                        "Antena actualizada",
                    sku: "ANT-002",
                    precioUnitarioCentimos:
                        12500,
                    subtotalCentimos:
                        25000,
                    requiereEnvio:
                        false,
                }),
            );

        assert.equal(
            result.changed,
            true,
        );

        assert.deepEqual(
            result.changes[0]
                .fields,
            [
                "nombre",
                "sku",
                "precio",
                "envío",
            ],
        );

        assert.equal(
            result.items[0].slug,
            localItem.slug,
        );

        assert.equal(
            result.items[0]
                .imagenUrl,
            localItem.imagenUrl,
        );

        assert.equal(
            result.items[0]
                .cantidad,
            2,
        );

        assert.equal(
            result.items[0]
                .precioCentimos,
            12500,
        );
    },
);

test(
    "el carrito muestra solo información útil para comprar",
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
                "data-cart-shipping-title",
                "data-cart-shipping-message",
                "data-cart-privacy",
                "data-cart-subtotal-note",
                "data-cart-checkout-status",
            ]
        ) {
            assert.match(
                page,
                new RegExp(selector),
            );
        }

        assert.doesNotMatch(
            page,
            /data-cart-validation-panel/,
        );

        assert.doesNotMatch(
            page,
            /data-cart-validation-retry/,
        );

        assert.doesNotMatch(
            page,
            /<(?:input|select|textarea)\b/i,
        );
    },
);

test(
    "los textos visibles del carrito no exponen lenguaje interno",
    () => {
        const page =
            read(
                "src/pages/tienda/carrito.astro",
            );

        for (
            const forbidden
            of [
                /en el servidor/i,
                /Strapi/i,
                /fase de desarrollo/i,
                /validación del servidor/i,
                /pagos reales bloqueados/i,
            ]
        ) {
            assert.doesNotMatch(
                page,
                forbidden,
            );
        }

        assert.match(
            page,
            /El importe final se confirmará al continuar al pago/,
        );

        assert.match(
            page,
            /Compra online próximamente/,
        );

        assert.match(
            page,
            /no se realizan cargos ni se generan pedidos/,
        );

        assert.match(
            page,
            /data-checkout-demo-dialog/,
        );
    },
);

test(
    "cambiar cantidades no consulta Strapi ni programa validaciones",
    () => {
        const controller =
            read(
                "src/scripts/cart-page.ts",
            );

        assert.doesNotMatch(
            controller,
            /validateCartWithServer/,
        );

        assert.doesNotMatch(
            controller,
            /cart-validation/,
        );

        assert.doesNotMatch(
            controller,
            /validationDebounceTimer|CART_VALIDATION_DEBOUNCE_MS/,
        );

        assert.doesNotMatch(
            controller,
            /window\.setTimeout/,
        );

        assert.match(
            controller,
            /setCartItemQuantity/,
        );

        assert.match(
            controller,
            /getCartSubtotal/,
        );
    },
);

test(
    "la comprobación se ejecuta únicamente al ordenar el pago",
    () => {
        const controller =
            read(
                "src/scripts/cart-checkout.ts",
            );

        const start =
            controller.indexOf(
                "async function startCheckout",
            );

        const validation =
            controller.indexOf(
                "validateCartWithServer",
                start,
            );

        const creation =
            controller.indexOf(
                "createCheckoutSession",
                start,
            );

        assert.ok(start >= 0);
        assert.ok(validation > start);
        assert.ok(creation > validation);

        assert.equal(
            controller.indexOf(
                "validateCartWithServer",
                validation + 1,
            ),
            -1,
        );
    },
);

test(
    "si cambia el carrito se actualiza y exige un segundo clic",
    () => {
        const controller =
            read(
                "src/scripts/cart-checkout.ts",
            );

        assert.match(
            controller,
            /reconcileCartWithValidation/,
        );

        assert.match(
            controller,
            /if \(reconciliation\.changed\)/,
        );

        assert.match(
            controller,
            /saveCart\(\s*reconciliation\.items/s,
        );

        assert.match(
            controller,
            /Confirmar cambios y continuar/,
        );

        assert.match(
            controller,
            /Revisa el nuevo importe y vuelve a continuar/i,
        );

        const changedBlock =
            controller.slice(
                controller.indexOf(
                    "if (reconciliation.changed)",
                ),
                controller.indexOf(
                    "reviewRequiredSignature = \"\";",
                ),
            );

        assert.doesNotMatch(
            changedBlock,
            /createCheckoutSession/,
        );
    },
);

test(
    "el clic final conserva la validación autoritativa del backend",
    () => {
        const checkout =
            read(
                "src/lib/checkout.ts",
            );

        const validation =
            read(
                "src/lib/cart-validation.ts",
            );

        assert.match(
            validation,
            /\/api\/tienda\/carrito\/validar/,
        );

        assert.match(
            checkout,
            /\/api\/tienda\/checkout/,
        );

        assert.match(
            checkout,
            /documentId/,
        );

        assert.match(
            checkout,
            /cantidad/,
        );

        assert.doesNotMatch(
            checkout,
            /precioCentimos\s*:/,
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

        const controllers =
            [
                read(
                    "src/scripts/cart-page.ts",
                ),
                read(
                    "src/scripts/cart-checkout.ts",
                ),
            ].join("\n");

        assert.doesNotMatch(
            `${checkout}\n${controllers}`,
            /\b(?:nombreCliente|customerEmail|telefonoCliente|direccionEnvio)\b/,
        );

        assert.match(
            checkout,
            /credentials:\s*"omit"/,
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
            controller,
            /showModal/,
        );

        assert.match(
            controller,
            /window\.confirm/,
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
            page,
            /data-cart-checkout-status[\s\S]*tabindex="-1"/,
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
    "los estados del botón de pago utilizan lenguaje comprensible",
    () => {
        const controller =
            read(
                "src/scripts/cart-checkout.ts",
            );

        for (
            const expected
            of [
                "Revisar pedido",
                "Continuar al pago",
                "Comprobando el pedido…",
                "Confirmar cambios y continuar",
                "Abriendo el pago…",
            ]
        ) {
            assert.match(
                controller,
                new RegExp(expected),
            );
        }

        assert.match(
            controller,
            /data-checkout-demo-dialog/,
        );

        assert.match(
            controller,
            /showModal\(\)/,
        );

        assert.ok(
            controller.indexOf(
                "Confirmar cambios y continuar",
            ) <
                controller.indexOf(
                    'if (!isCheckoutEnabled())',
                    controller.indexOf(
                        "function updateCheckoutControl",
                    ),
                ),
            "La revisión de cambios debe tener prioridad sobre la salida demo.",
        );

        assert.doesNotMatch(
            controller,
            /Strapi|fase de desarrollo|notificación segura|consulta pública/i,
        );
    },
);

test(
    "la URL de pago y la idempotencia continúan protegidas",
    () => {
        const checkout =
            read(
                "src/lib/checkout.ts",
            );

        const controller =
            read(
                "src/scripts/cart-checkout.ts",
            );

        assert.match(
            checkout,
            /url\.hostname !==\s*"checkout\.stripe\.com"/,
        );

        assert.match(
            checkout,
            /"Idempotency-Key"/,
        );

        assert.match(
            controller,
            /sessionStorage/,
        );

        assert.match(
            controller,
            /getCartSignature/,
        );
    },
);
