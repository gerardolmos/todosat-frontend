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

const page = read(
  "src/pages/tienda/compra/confirmacion.astro",
);

const returnScript = read(
  "src/scripts/checkout-return.ts",
);

const cartScript = read(
  "src/scripts/cart-checkout.ts",
);

assert.match(
  page,
  /robots="noindex, nofollow"/,
);

assert.match(
  page,
  /No se ha confirmado ningún cobro/,
);

assert.doesNotMatch(
  page,
  /Pago confirmado|Compra completada/i,
);

assert.match(
  returnScript,
  /history\.replaceState/,
);

assert.match(
  returnScript,
  /searchParams\.delete\(\s*"session_id"/,
);

assert.match(
  read(
    "src/lib/checkout-status.ts",
  ),
  /cs_\(\?:test\|live\)_/,
);

assert.doesNotMatch(
  returnScript,
  /fetch\s*\(/,
);

assert.doesNotMatch(
  returnScript,
  /clearCart/,
);

assert.match(
  cartScript,
  /params\.get\(\s*"checkout"\s*\)/,
);

assert.match(
  cartScript,
  /"cancelado"/,
);

assert.match(
  cartScript,
  /Tu carrito se conserva/,
);

console.log(
  "OK: retorno de pago seguro probado.",
);

console.log(
  "OK: el retorno no confirma el cobro.",
);

console.log(
  "OK: no consulta Stripe ni vacía el carrito.",
);
