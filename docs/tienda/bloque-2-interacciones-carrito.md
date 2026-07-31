# Bloque 2 — Interacciones del carrito

**Fecha:** 31 de julio de 2026

**Estado:** implementado y verificado.

## Objetivo

Completar las interacciones del carrito sin ampliar el alcance del checkout ni introducir datos personales.

## Cambios

- los errores de operaciones del carrito permanecen visibles;
- el usuario puede cerrar esos avisos de forma explícita;
- un error de validación ofrece “Volver a comprobar”;
- el foco se dirige al estado fallido para que el mensaje no pase desapercibido;
- vaciar todo el carrito exige confirmación;
- el diálogo distingue claramente conservar y eliminar;
- existe un fallback con confirmación nativa cuando `<dialog>` no está disponible;
- los objetivos táctiles principales alcanzan 44 px;
- se refuerzan los estilos `focus-visible`;
- las transiciones respetan reducción de movimiento;
- la tarjeta de producto y el resumen se adaptan mejor a móvil y escritorio;
- el resumen sticky se limita a pantallas amplias.

## Límites conservados

- no se añaden formularios personales;
- no se activa validación, checkout ni consulta pública;
- no se modifica el backend;
- no se vacía el carrito por volver desde Stripe;
- los importes locales continúan etiquetados como estimados hasta ser verificados.

## Pruebas

La suite comprueba ahora:

- persistencia y descarte explícito de errores;
- reintento manual;
- confirmación accesible de vaciado;
- fallback del diálogo;
- foco y tamaños táctiles;
- responsive;
- todos los contratos del bloque 1.