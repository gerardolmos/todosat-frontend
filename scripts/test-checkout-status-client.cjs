"use strict";

const assert =
  require("node:assert/strict");

const fs =
  require("node:fs");

const test =
  require("node:test");

function read(path) {
  return fs.readFileSync(
    path,
    "utf8",
  );
}

const envExample =
  read(".env.example");

const library =
  read(
    "src/lib/checkout-status.ts",
  );

const controller =
  read(
    "src/scripts/checkout-return.ts",
  );

const page =
  read(
    "src/pages/tienda/compra/confirmacion.astro",
  );

const viewSource =
  read(
    "src/lib/checkout-return-view.js",
  );

const viewModule =
  import(
    "../src/lib/checkout-return-view.js"
  );

test(
  "la consulta pública conserva sus límites de privacidad",
  () => {
    assert.match(
      envExample,
      /^PUBLIC_CHECKOUT_STATUS_ENABLED=false$/m,
    );

    assert.match(
      library,
      /\/api\/tienda\/checkout\/estado/,
    );

    assert.match(
      library,
      /credentials:\s*"omit"/,
    );

    assert.match(
      library,
      /cache:\s*"no-store"/,
    );

    assert.match(
      library,
      /referrerPolicy:\s*"no-referrer"/,
    );

    assert.doesNotMatch(
      library,
      /email|tel[eé]fono|direcci[oó]n|numeroPedido|totalCentimos/i,
    );
  },
);

test(
  "la confirmación presenta los tres pasos de compra",
  () => {
    assert.match(
      page,
      /CheckoutSteps activeStep=\{3\}/,
    );

    assert.match(
      page,
      /Confirmación de compra/,
    );
  },
);

test(
  "la página ofrece estados y acciones accesibles",
  () => {
    assert.match(
      page,
      /data-checkout-return-retry/,
    );

    assert.match(
      page,
      /aria-busy="true"/,
    );

    assert.match(
      page,
      /aria-live="polite"/,
    );

    assert.match(
      page,
      /tabindex="-1"/,
    );

    assert.match(
      page,
      /min-h-11/,
    );
  },
);

test(
  "los mensajes visibles evitan lenguaje técnico interno",
  () => {
    const visibleCopy =
      `${page}\n${viewSource}`;

    assert.doesNotMatch(
      visibleCopy,
      /notificaci[oó]n segura|consulta p[uú]blica|estado interno del pedido|sesión de pago|servidor ha confirmado/i,
    );
  },
);

test(
  "el estado confirmado no invita a repetir el pago",
  async () => {
    const {
      CHECKOUT_RETURN_STATES,
      getCheckoutReturnView,
    } = await viewModule;

    const view =
      getCheckoutReturnView(
        CHECKOUT_RETURN_STATES.CONFIRMED,
      );

    assert.equal(
      view.title,
      "Pago confirmado",
    );

    assert.equal(
      view.showRetry,
      false,
    );

    assert.equal(
      view.showSecondary,
      false,
    );

    assert.match(
      view.noticeMessage,
      /No necesitas realizar ningún otro pago/,
    );
  },
);

test(
  "fallido y cancelado conservan una salida al carrito",
  async () => {
    const {
      CHECKOUT_RETURN_STATES,
      getCheckoutReturnView,
    } = await viewModule;

    for (const state of [
      CHECKOUT_RETURN_STATES.FAILED,
      CHECKOUT_RETURN_STATES.CANCELLED,
    ]) {
      const view =
        getCheckoutReturnView(
          state,
        );

      assert.equal(
        view.primaryHref,
        "/tienda/carrito",
      );

      assert.equal(
        view.showRetry,
        false,
      );
    }
  },
);

test(
  "pendiente y no disponible permiten reintento controlado",
  async () => {
    const {
      CHECKOUT_RETURN_STATES,
      getCheckoutReturnView,
    } = await viewModule;

    const pending =
      getCheckoutReturnView(
        CHECKOUT_RETURN_STATES.PENDING,
        {
          canRetry: true,
        },
      );

    const unavailable =
      getCheckoutReturnView(
        CHECKOUT_RETURN_STATES.UNAVAILABLE,
      );

    assert.equal(
      pending.showRetry,
      true,
    );

    assert.equal(
      unavailable.showRetry,
      true,
    );

    assert.match(
      controller,
      /data-checkout-return-retry/,
    );

    assert.match(
      controller,
      /monitorStatus\(\s*currentSessionId/s,
    );
  },
);

test(
  "la referencia se elimina y nunca se persiste ni vacía el carrito",
  () => {
    assert.match(
      controller,
      /history\.replaceState/,
    );

    assert.match(
      controller,
      /searchParams\.delete\(\s*"session_id"/,
    );

    assert.doesNotMatch(
      controller,
      /localStorage|sessionStorage|clearCart/,
    );

    assert.match(
      controller,
      /MAX_STATUS_ATTEMPTS\s*=\s*8/,
    );
  },
);
