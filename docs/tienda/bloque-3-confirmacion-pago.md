# Bloque 3 — Confirmación del pago

**Fecha:** 2 de agosto de 2026

**Estado:** implementado y pendiente de publicación.

## Objetivo

Mejorar la página `/tienda/compra/confirmacion` para que el comprador entienda
el resultado del pago sin recibir explicaciones técnicas sobre la arquitectura
interna.

## Cambios visibles

- indicador de progreso con la fase Confirmación activa;
- estados diferenciados mediante texto, icono y color;
- mensajes comerciales y comprensibles;
- estado confirmado sin invitación a repetir el pago;
- salida clara al carrito cuando el pago falla o se cancela;
- reintento manual cuando no puede confirmarse el resultado;
- controles táctiles y foco de teclado;
- diseño responsive;
- reducción de movimiento respetada.

## Estados cubiertos

- comprobando;
- pendiente;
- confirmado;
- fallido;
- cancelado;
- reembolsado;
- reembolso parcial;
- consulta no disponible;
- referencia no válida;
- pago todavía desactivado.

## Contratos conservados

- la página de retorno no confirma por sí sola el pago;
- `session_id` se elimina de la URL;
- la referencia no se almacena;
- el carrito no se vacía automáticamente;
- no se muestran datos personales, importe ni número de pedido;
- la consulta pública continúa desactivada por defecto;
- no se activa Stripe ni se modifican funciones reales.

## Pruebas

La suite `test:tienda` pasa de 12 a 20 pruebas e incorpora controles sobre:

- privacidad de la consulta;
- estados y acciones;
- lenguaje visible no técnico;
- reintento manual;
- accesibilidad;
- conservación de la referencia únicamente en memoria;
- límite de reintentos;
- ausencia de vaciado automático del carrito.

## Pendiente

La limpieza UX del carrito continúa pendiente para la fase final. En particular,
deberán simplificarse los mensajes técnicos o de seguridad que no aporten valor
directo al comprador.
