"use strict";

const assert =
  require("node:assert/strict");

const fs =
  require("node:fs");

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

const script =
  read(
    "src/scripts/checkout-return.ts",
  );

const page =
  read(
    "src/pages/tienda/compra/confirmacion.astro",
  );

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

assert.match(
  library,
  /body:\s*JSON\.stringify\(\{\s*sessionId/,
);

assert.doesNotMatch(
  library,
  /email|tel[eé]fono|direcci[oó]n|numeroPedido|totalCentimos/i,
);

assert.doesNotMatch(
  library,
  /getStripeClient|checkout\.sessions|from\s+["']stripe["']/,
);

assert.match(
  script,
  /MAX_STATUS_ATTEMPTS\s*=\s*8/,
);

assert.match(
  script,
  /getCheckoutPublicStatus/,
);

assert.match(
  script,
  /history\.replaceState/,
);

assert.match(
  script,
  /searchParams\.delete\(\s*"session_id"/,
);

assert.doesNotMatch(
  script,
  /localStorage|sessionStorage/,
);

assert.doesNotMatch(
  script,
  /clearCart/,
);

assert.match(
  script,
  /case\s+"confirmado"/,
);

assert.match(
  script,
  /Pago confirmado/,
);

assert.match(
  page,
  /robots="noindex, nofollow"/,
);

assert.match(
  page,
  /data-checkout-return-notice-title/,
);

assert.match(
  page,
  /No se ha confirmado ningún cobro/,
);

console.log(
  "OK: cliente público de estado probado.",
);

console.log(
  "OK: no consulta directamente la pasarela.",
);

console.log(
  "OK: no persiste la referencia ni vacía el carrito.",
);
