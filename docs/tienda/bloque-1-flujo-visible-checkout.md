# Bloque 1 — Estados visibles del carrito

**Fecha:** 31 de julio de 2026

**Estado:** implementado y verificado.

## Objetivo

Convertir el carrito existente en una interfaz que explique claramente:

- en qué punto del proceso se encuentra el usuario;
- si los importes son estimados o verificados;
- cuándo se está consultando el servidor;
- si el pedido requiere envío;
- dónde se introducirán los datos personales y de pago.

## Cambios

- componente reutilizable de progreso:
  `Carrito → Pago seguro → Confirmación`;
- modelo puro de estados del carrito;
- panel visible para estado estimado, validando, verificado, error y validación desactivada;
- subtotal acompañado de una explicación sobre su origen;
- información de envío adaptada a la selección local o a la validación del servidor;
- bloque de privacidad que explica que los datos y el pago se introducirán en Stripe;
- estructura responsive conservando el diseño actual;
- `aria-live` y `aria-busy` para anunciar cambios de estado;
- suite automatizada del frontend.

## Privacidad

No se han añadido formularios de nombre, correo, teléfono o dirección.

El frontend continúa enviando al backend únicamente:

- `documentId`;
- cantidad;
- clave técnica de idempotencia al preparar el checkout.

## Activación

Las funciones reales siguen desactivadas por defecto:

- validación pública;
- checkout;
- consulta pública del estado.

El nuevo diseño muestra honestamente ese bloqueo y no simula una compra disponible.

## QA

La suite verifica:

- máquina de estados;
- presentación de envío;
- tonos visuales;
- indicador de pasos;
- selectores de la interfaz;
- ausencia de campos personales;
- contrato mínimo del checkout;
- banderas desactivadas.

La puerta de compilación acepta dos resultados:

1. build completo superado cuando existe una fuente Strapi controlada;
2. compilación de Astro y Vite superada seguida del `ECONNREFUSED` esperado durante la generación estática, cuando Strapi está deliberadamente ausente.

La estrategia autónoma de datos de build se completará en el bloque final de QA, tal como establece la especificación.
