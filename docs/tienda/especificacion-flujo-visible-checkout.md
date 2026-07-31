# Especificación del flujo visible previo al checkout

**Fecha:** 31 de julio de 2026

**Estado:** especificación aprobada para implementación.

**Frontend de referencia:** `894636876d00378bd25d7a7522b1112225de4519`

**Backend de referencia:** `385b456f037d41d34a14f06891c77c9269bec264`

**Estado general del proyecto:** PREPARADO PARA CONTINUAR EL DESARROLLO — NO APTO PARA PRODUCCIÓN.

## 1. Objetivo

Construir un recorrido previo al pago que permita al comprador:

1. comprender qué productos ha seleccionado;
2. modificar cantidades o eliminar productos;
3. distinguir importes estimados de importes verificados por el servidor;
4. saber si el pedido requiere envío;
5. entender qué datos solicitará Stripe y por qué;
6. conocer qué ocurrirá antes, durante y después del pago;
7. identificar claramente estados de validación, bloqueo, error y confirmación;
8. continuar hacia Stripe únicamente cuando todos los controles técnicos y de activación lo permitan.

La experiencia debe resultar clara en móvil y escritorio sin debilitar los límites de seguridad, privacidad y activación definidos en el Punto de Control 0.

## 2. Decisión de privacidad

TodoSatcom **no incorporará un formulario propio de comprador o dirección**.

El contrato aprobado de datos del cliente establece que:

- el frontend solo enviará `documentId`, cantidad y la clave técnica de idempotencia;
- nombre, correo, teléfono y dirección no se almacenarán en `localStorage` ni `sessionStorage`;
- Stripe Checkout alojado será la superficie prevista para recoger los datos necesarios;
- el webhook firmado será la única vía autorizada para copiar datos confirmados al backend;
- los pedidos que requieran envío solicitarán dirección y teléfono en Stripe cuando la función se active;
- los pedidos sin envío no forzarán datos logísticos.

La frase anterior de continuidad “datos del comprador bajo simulación” se interpreta desde este momento como **información visual sobre los datos que recogerá Stripe**, nunca como campos propios en TodoSatcom.

## 3. Alcance de implementación

### Incluido

- mejora estructural y visual de `/tienda/carrito`;
- estado visible de validación del carrito;
- aviso cuando el servidor haya confirmado precios y disponibilidad;
- aviso cuando el carrito cambie y la validación anterior quede invalidada;
- explicación diferenciada para pedidos con y sin envío;
- explicación de la recogida de datos en Stripe;
- representación visual del recorrido Carrito → Stripe → Confirmación;
- estados del botón principal;
- mensajes persistentes y accionables;
- mejora de `/tienda/compra/confirmacion`;
- accesibilidad de foco, anuncios, controles y estados;
- pruebas automatizadas del comportamiento del frontend;
- documentación de la dependencia de Strapi durante el build estático.

### Excluido

- formularios de datos personales;
- aceptación definitiva de condiciones de venta;
- cálculo real de impuestos;
- cálculo real de portes;
- habilitación de Stripe;
- claves o credenciales reales;
- conexión real con SeaConnect;
- vaciado automático del carrito por el mero retorno desde Stripe;
- exposición pública de número de pedido, importe, correo o dirección;
- cambios en el contrato de seguridad del backend.

## 4. Estado actual verificado

El diagnóstico confirmó:

- carrito persistente en `localStorage`;
- máximo de 20 líneas, 20 unidades por línea y 50 unidades totales;
- datos visuales del carrito tratados como no confiables;
- validación opcional contra Strapi mediante `documentId` y cantidad;
- creación de checkout protegida por clave de idempotencia en `sessionStorage`;
- redirección limitada a `https://checkout.stripe.com`;
- página de retorno que elimina `session_id` de la URL;
- consulta pública mínima de estado;
- ausencia de datos personales en el cliente de checkout;
- feature flags desactivadas por defecto;
- checkout real desactivado;
- build estático dependiente de Strapi para generar las rutas de contenido.

El build del diagnóstico falló únicamente porque no había un Strapi disponible en `127.0.0.1:1337`; la compilación de Astro y Vite se completó antes de la fase de generación de rutas.

## 5. Arquitectura del recorrido

### Paso 1 — Carrito

Ruta: `/tienda/carrito`

Responsabilidad:

- mostrar los productos conservados localmente;
- permitir cantidades, eliminación y vaciado;
- mostrar subtotal estimado mientras no exista validación;
- iniciar y representar la validación contra el backend;
- mostrar subtotal verificado cuando la respuesta sea coherente;
- informar de envío, datos y pago;
- habilitar el acceso a Stripe solo cuando la configuración lo permita.

### Paso 2 — Stripe Checkout

Superficie externa alojada por Stripe.

Responsabilidad prevista:

- recoger correo;
- recoger dirección y teléfono únicamente cuando el pedido requiera envío;
- mostrar el importe creado por el backend;
- procesar el pago;
- regresar a la URL de confirmación.

TodoSatcom no reproducirá esta interfaz ni procesará tarjetas.

### Paso 3 — Confirmación

Ruta: `/tienda/compra/confirmacion`

Responsabilidad:

- no inferir el pago desde la navegación;
- limpiar inmediatamente `session_id` de la dirección;
- consultar únicamente el estado mínimo guardado por el backend;
- distinguir confirmación, pendiente, fallo, cancelación y reembolso;
- explicar qué puede hacer el usuario en cada estado;
- no exponer datos personales ni detalles comerciales sensibles.

## 6. Estados del carrito

La interfaz debe tratar el carrito como una máquina de estados explícita.

### `vacio`

- muestra una llamada clara para volver a la tienda;
- oculta resumen y controles de pago;
- no realiza validaciones.

### `estimado`

- muestra contenido procedente de `localStorage`;
- etiqueta el subtotal como “Subtotal estimado”;
- advierte que precio y disponibilidad todavía no están confirmados;
- nunca presenta ese importe como definitivo.

### `validando`

- conserva los controles visibles;
- indica “Comprobando precios y disponibilidad…”;
- evita iniciar checkout durante la comprobación;
- no sustituye el contenido por un cargador de pantalla completa;
- una nueva modificación cancela o invalida la comprobación anterior.

### `verificado`

- muestra “Carrito verificado”;
- cambia la etiqueta a “Subtotal verificado”;
- utiliza nombre, SKU, precio y condición de envío devueltos por el servidor;
- conserva una marca temporal solo en memoria de la página;
- cualquier cambio de cantidad devuelve inmediatamente al estado `estimado`.

### `error_recuperable`

Ejemplos:

- red temporalmente inaccesible;
- límite de frecuencia;
- respuesta inválida.

Comportamiento:

- mantiene el carrito editable;
- muestra un mensaje persistente;
- ofrece “Volver a comprobar”;
- no habilita checkout;
- no borra automáticamente el mensaje antes de que el usuario pueda actuar.

### `producto_no_comprable`

Ejemplos:

- producto agotado;
- producto despublicado;
- configuración o precio inválidos.

Comportamiento:

- identifica que el carrito necesita revisión sin revelar detalles internos;
- mantiene acceso al producto cuando su ruta siga disponible;
- ofrece eliminar el elemento o volver al catálogo;
- no habilita checkout.

### `checkout_bloqueado`

Cuando las banderas siguen desactivadas:

- el botón permanece deshabilitado;
- el texto principal será “Pago todavía no disponible”;
- se explica que el catálogo y el carrito pueden revisarse, pero no se aceptan pedidos;
- no se simula una compra completada.

### `preparando_checkout`

- botón bloqueado;
- texto “Preparando pago seguro…”;
- validación final obligatoria;
- creación idempotente de la sesión;
- redirección solo después de validar la URL permitida.

## 7. Diseño de `/tienda/carrito`

### Encabezado

Mantendrá:

- migas de pan;
- título “Carrito”;
- explicación de la verificación en servidor.

Añadirá un indicador compacto de tres pasos:

1. Carrito;
2. Pago seguro;
3. Confirmación.

Solo “Carrito” estará activo en esta página. El indicador es informativo, no un conjunto de enlaces falsamente disponibles.

### Columna de productos

Cada producto conservará:

- imagen;
- nombre enlazado;
- SKU;
- precio unitario;
- cantidad;
- subtotal de línea;
- indicación de envío;
- acción de eliminar.

Mejoras:

- controles de cantidad con nombre accesible y estado de foco visible;
- región de estado por producto cuando una acción falle;
- texto de precio adaptado a estimado o verificado;
- eliminación sin depender únicamente del color;
- distribución de móvil que evite comprimir título, controles y subtotal.

### Resumen

Orden visual:

1. número de productos y unidades;
2. subtotal;
3. estado de verificación;
4. envío e impuestos;
5. información sobre los datos en Stripe;
6. acción principal;
7. acción secundaria para seguir comprando;
8. vaciado del carrito como acción destructiva separada.

El botón “Vaciar carrito” no competirá visualmente con la acción principal. Antes de vaciar se exigirá una confirmación explícita accesible.

### Bloque de envío

Si algún producto requiere envío:

- mostrar “Este pedido requiere envío”;
- explicar que Stripe solicitará destinatario, dirección y teléfono cuando el checkout se active;
- no mostrar tarifas o plazos inventados;
- indicar que portes, zonas y condiciones definitivas están pendientes de activación.

Si ningún producto requiere envío:

- mostrar “Este pedido no requiere dirección de envío”;
- explicar que Stripe seguirá solicitando el correo necesario para el pago y comunicaciones operativas cuando se active.

### Bloque de privacidad

Texto funcional:

- TodoSatcom no pide datos de tarjeta;
- los datos de pago se introducen en Stripe;
- el frontend no guardará nombre, correo, teléfono ni dirección;
- los enlaces legales definitivos se incorporarán antes de activar ventas.

No se mostrará un checkbox de aceptación mientras las condiciones no sean definitivas.

## 8. Diseño de `/tienda/compra/confirmacion`

La tarjeta actual evolucionará a un componente de estado con:

- icono no dependiente únicamente del color;
- etiqueta de fase;
- título;
- explicación;
- panel de seguridad;
- acción primaria contextual;
- acción secundaria;
- ayuda operativa.

### Estados

#### Comprobando

- indicador de actividad con texto;
- informa de que se consulta TodoSatcom, no Stripe directamente;
- no permite iniciar otro pago.

#### Pendiente

- explica que la confirmación puede tardar;
- muestra que no debe repetirse el pago;
- ofrece volver a comprobar manualmente cuando finalicen los reintentos automáticos;
- ofrece volver a la tienda sin afirmar fracaso.

#### Confirmado

- afirma el pago únicamente cuando `pagoConfirmado=true`;
- indica que el pedido puede continuar internamente;
- no muestra importe, datos o número de pedido;
- no vacía el carrito automáticamente en esta fase;
- ofrece volver a la tienda.

#### Fallido o cancelado

- afirma que no existe cobro confirmado;
- permite revisar el carrito;
- evita mensajes ambiguos que sugieran repetir inmediatamente.

#### Reembolsado o reembolso parcial

- presenta el estado guardado;
- dirige al canal de ayuda cuando este se encuentre operativo;
- no muestra datos del pedido.

#### Consulta no disponible

- explica que la falta de respuesta no demuestra éxito ni fracaso;
- ofrece reintento manual cuando la función esté habilitada;
- conserva el principio de no duplicar el pago.

## 9. Accesibilidad

Criterios obligatorios:

- un único `h1` por página;
- regiones `aria-live` separadas para cambios informativos y errores;
- errores persistentes hasta una acción del usuario o una operación exitosa;
- foco visible en botones, enlaces y controles de cantidad;
- foco dirigido al mensaje principal después de un error de checkout;
- botones con texto comprensible fuera de contexto;
- confirmación de vaciado mediante diálogo accesible o patrón equivalente;
- estados que no dependan únicamente del color;
- respeto de `prefers-reduced-motion`;
- objetivos táctiles de al menos 44 × 44 px;
- orden de tabulación coherente;
- `aria-busy` durante validación y preparación;
- mensajes asociados mediante `aria-describedby`;
- contenido útil con zoom al 200 % y anchuras pequeñas.

## 10. Responsive

### Móvil

- una sola columna;
- resumen después de los productos;
- controles de cantidad y subtotal sin solaparse;
- acción principal a anchura completa;
- márgenes compatibles con la barra de navegación y zonas seguras;
- mensajes sin posición flotante que tape controles esenciales.

### Escritorio

- productos y resumen en dos columnas;
- resumen sticky solo cuando no provoque recortes verticales;
- ancho legible para textos de privacidad y envío;
- jerarquía visual consistente con el catálogo actual.

## 11. Estilo visual

Se conserva el lenguaje existente:

- tipografía Inter;
- fondo `slate-50`;
- superficies blancas;
- texto principal `slate-950`;
- naranja para acciones comerciales;
- bordes suaves;
- esquinas redondeadas;
- sombras discretas.

Estados:

- verde para verificado o confirmado;
- ámbar para pendiente o advertencia;
- rojo para error o bloqueo;
- azul o slate para información neutral.

Cada estado incluirá texto e iconografía, no solo color.

## 12. Contratos técnicos que no pueden romperse

- el backend reconstruye el carrito;
- el frontend nunca envía precios;
- `credentials` permanece en `omit`;
- las respuestas se validan estrictamente;
- la URL de redirección se limita a `checkout.stripe.com`;
- el retorno no confirma el pago;
- `session_id` se elimina de la URL;
- no se persiste `session_id`;
- la consulta pública no expone número de pedido, total o datos personales;
- la clave de idempotencia depende de la firma del carrito;
- una modificación del carrito invalida cualquier validación anterior;
- las feature flags continúan desactivadas por defecto;
- el carrito no se vacía automáticamente por regresar desde Stripe.

## 13. Pruebas

Se añadirá una suite de frontend invocable desde `package.json`.

Debe verificar:

1. ausencia de campos personales en carrito y cliente de checkout;
2. estados del botón principal;
3. transición estimado → validando → verificado;
4. invalidación de validación al modificar cantidades;
5. error persistente y reintento;
6. explicación distinta para pedidos con y sin envío;
7. confirmación antes de vaciar;
8. redirección únicamente a Stripe;
9. conservación de idempotencia;
10. eliminación de `session_id`;
11. estados de confirmación;
12. ausencia de vaciado automático;
13. presencia de regiones y atributos de accesibilidad;
14. feature flags desactivadas en `.env.example`;
15. build o prueba de render con una fuente de datos controlada.

## 14. Dependencia de Strapi durante el build

Astro genera rutas estáticas consultando Strapi. Por ello:

- un build completo requiere un Strapi accesible o una fuente de datos controlada;
- un `ECONNREFUSED` durante generación de rutas no se clasificará como fallo de TypeScript o Vite;
- la implementación añadirá una estrategia reproducible de QA que no dependa de recordar manualmente arrancar Strapi;
- esa estrategia no introducirá datos de producción ni ocultará errores reales.

## 15. Secuencia de implementación

### Bloque 1 — Modelo visual y pruebas

- crear utilidades de estado del carrito;
- añadir suite de frontend;
- incorporar indicador de pasos;
- añadir estado visible de validación;
- añadir bloques de envío y privacidad.

### Bloque 2 — Interacciones del carrito

- errores persistentes;
- reintento manual;
- confirmación de vaciado;
- mejoras de foco y `aria-busy`;
- ajustes responsive.

### Bloque 3 — Confirmación

- estados visuales completos;
- reintento manual controlado;
- acciones contextuales;
- accesibilidad y reducción de movimiento.

### Bloque 4 — QA y cierre

- build con fuente de datos controlada;
- suite completa;
- revisión responsive;
- revisión de textos;
- documentación y continuidad.

Cada bloque se implementará en copia temporal, con pruebas, commit local y publicación controlada.

## 16. Criterios de aceptación de la etapa

La etapa se considerará completa cuando:

- el recorrido sea comprensible sin conocimientos técnicos;
- no exista formulario propio de datos personales;
- el usuario distinga importes estimados y verificados;
- ningún checkout pueda iniciarse sin validación;
- los estados de bloqueo y error sean claros y accionables;
- la información de envío se adapte al contenido real del carrito;
- el retorno no pueda confundirse con confirmación de pago;
- móvil y escritorio mantengan jerarquía y controles utilizables;
- la suite automatizada cubra los contratos centrales;
- las banderas reales permanezcan desactivadas;
- el frontend y el backend sigan no aptos para producción hasta completar los pendientes de activación.
