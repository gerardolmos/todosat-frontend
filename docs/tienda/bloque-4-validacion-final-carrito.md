# Bloque 4 — Validación final del carrito

**Fecha:** 3 de agosto de 2026

**Estado:** implementado y pendiente de publicación.

## Objetivo

Evitar llamadas a Strapi mientras el comprador modifica cantidades y reservar
la comprobación obligatoria para la acción final de continuar al pago.

## Comportamiento visible

- los botones `+`, `−`, eliminar y vaciar trabajan localmente;
- el subtotal se presenta siempre como estimado mientras se revisa el carrito;
- no aparece un panel técnico de validación;
- el lenguaje visible evita referencias a Strapi, servidores, flags o fases de
  desarrollo;
- al pulsar **Continuar al pago** se comprueban precio, disponibilidad y envío;
- si algún dato ha cambiado, el carrito se actualiza y el pago no se abre;
- después de revisar el nuevo importe, el comprador debe pulsar
  **Confirmar cambios y continuar**;
- si todo coincide, se crea la sesión de pago y se abre Stripe.

## Contrato de seguridad

- el frontend sigue enviando únicamente `documentId` y cantidad;
- el backend continúa reconstruyendo el carrito con datos actuales;
- los precios del navegador no se consideran autoritativos;
- la creación del checkout vuelve a reconstruir el carrito;
- la idempotencia y la restricción de URL a Stripe permanecen intactas;
- no se añaden ni persisten datos personales.

## Cambios de UX

Se retiran del carrito mensajes sobre:

- el servidor;
- Strapi;
- validaciones internas;
- pagos reales bloqueados;
- fases de desarrollo.

Se sustituyen por mensajes orientados a la tarea del comprador:

- subtotal estimado;
- confirmación al continuar al pago;
- compra online próximamente mientras la función permanezca desactivada;
- revisión obligatoria cuando cambien precio o envío.

## Pruebas

La suite de tienda contiene 24 pruebas:

- 16 del catálogo, carrito y checkout;
- 8 de la página de confirmación.

Cubren la ausencia de validaciones por cambio de cantidad, la comprobación en
el clic final, la reconciliación del carrito, el segundo clic consciente, la
privacidad, la idempotencia, la URL de Stripe y la accesibilidad básica.
