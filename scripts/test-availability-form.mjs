import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const action = fs.readFileSync(
    new URL("../src/components/store/ProductCommercialAction.astro", import.meta.url),
    "utf8",
);

const availability = fs.readFileSync(
    new URL("../src/pages/tienda/consultar-disponibilidad.astro", import.meta.url),
    "utf8",
);

const confirmation = fs.readFileSync(
    new URL("../src/pages/tienda/consulta-enviada.astro", import.meta.url),
    "utf8",
);

const search = fs.readFileSync(
    new URL("../src/pages/buscar.astro", import.meta.url),
    "utf8",
);

test("consultar disponibilidad sale de la ficha con un slug de producto", () => {
    assert.match(
        action,
        /\/tienda\/consultar-disponibilidad\/\?producto=/,
    );
    assert.doesNotMatch(action, /motivo=disponibilidad/);
});

test("el formulario usa Netlify Forms y honeypot sin llamadas públicas a Strapi", () => {
    assert.match(availability, /name="consulta-disponibilidad"/);
    assert.match(availability, /data-netlify="true"/);
    assert.match(availability, /netlify-honeypot="bot-field"/);
    assert.match(
        availability,
        /name="form-name"\s+value="consulta-disponibilidad"/s,
    );
    assert.match(
        availability,
        /action="\/tienda\/consulta-enviada\/"/,
    );
    assert.doesNotMatch(availability, /localhost:1337|\/api\/hardwares|fetch\s*\(/);
});

test("el formulario queda ligado a un producto estático válido", () => {
    assert.match(availability, /id="availability-products"/);
    assert.match(availability, /products\.find/);
    assert.match(availability, /name="producto_slug"/);
    assert.match(availability, /name="producto"/);
    assert.match(availability, /name="sku"/);
});

test("la página de confirmación existe y no es indexable", () => {
    assert.match(confirmation, /Consulta recibida/);
    assert.match(confirmation, /robots="noindex, follow"/);
});

test("la búsqueda distingue coincidencias directas de relaciones editoriales", () => {
    assert.match(search, /relaciones:/);
    assert.match(search, /obtenerMotivoCoincidencia/);
    assert.match(search, /Operador:/);
    assert.match(search, /Hardware:/);
    assert.match(search, /Coincidencia en el contenido/);
});
