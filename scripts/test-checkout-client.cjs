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

const page =
  read(
    "src/pages/tienda/carrito.astro",
  );

const checkout =
  read("src/lib/checkout.ts");

const script =
  read(
    "src/scripts/cart-checkout.ts",
  );

assert.match(
  envExample,
  /^PUBLIC_CHECKOUT_ENABLED=false$/m,
);

assert.match(
  page,
  /data-cart-checkout/,
);

assert.match(
  page,
  /data-cart-checkout-status/,
);

assert.match(
  page,
  /import "\.\.\/\.\.\/scripts\/cart-checkout"/,
);

assert.match(
  checkout,
  /"Idempotency-Key"/,
);

assert.match(
  checkout,
  /credentials: "omit"/,
);

assert.match(
  checkout,
  /documentId:\s*item\.documentId/,
);

assert.match(
  checkout,
  /cantidad:\s*item\.cantidad/,
);

assert.match(
  checkout,
  /checkout\.stripe\.com/,
);

assert.doesNotMatch(
  checkout,
  /email|tel[eé]fono|direcci[oó]n/i,
);

assert.doesNotMatch(
  script,
  /email|tel[eé]fono|direcci[oó]n/i,
);

const startPosition =
  script.indexOf(
    "async function startCheckout",
  );

const validationPosition =
  script.indexOf(
    "await validateCartWithServer",
    startPosition,
  );

const checkoutPosition =
  script.indexOf(
    "await createCheckoutSession",
    startPosition,
  );

assert.ok(
  startPosition !== -1,
);

assert.ok(
  validationPosition !== -1,
);

assert.ok(
  checkoutPosition !== -1,
);

assert.ok(
  validationPosition <
    checkoutPosition,
);

console.log(
  "OK: cliente de checkout probado.",
);

console.log(
  "OK: solo envía productos y cantidades.",
);

console.log(
  "OK: no contiene datos personales.",
);
