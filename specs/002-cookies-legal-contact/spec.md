# Feature Specification: Cookies, legales y contacto

**Scope**: frontend-only
**Repository**: todosat-frontend
**Feature Branch**: main; sin rama nueva
**Created**: 2026-10-23
**Status**: SPECIFY y CLARIFY completados para alcance provisional; datos legales y activación de lanzamiento pendientes. IMPLEMENT local en curso; rediseño visual autorizado, aprobación estética pendiente.
**Input**: Feature 002 autorizada por Gerard. Cinco documentos de Carlos aprobados literalmente por el propietario. Analytics previsto para el lanzamiento, sin implementación actual; AdSense y su CMP diferidos a una etapa mucho posterior.

Gobernanza: Constitution 2.0.0; copia controlada SHA-256 496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7. Procedencia docs/sdd/governance-reference.json. Base frontend 6122e407b64e34864bda222aa9946a70fb296ce9. Feature 001 intacta.

## User Scenarios & Testing

### User Story 1 - Conservar los textos aprobados (Priority: P1)
Como propietario quiero integrar localmente los documentos aprobados sin reescritura jurídica ni alteración editorial no autorizada.
**Why this priority**: Preserva la información y la autoridad editorial de los originales.
**Independent Test**: Comparar texto, títulos, apartados y orden de la presentación local con los cinco documentos identificados; revisar por separado el diagnóstico.
**Acceptance Scenarios**:
1. **Given** los documentos aprobados, **When** se prepara su presentación local, **Then** su contenido y estructura se conservan literalmente, incluidas las referencias a servicios futuros.
2. **Given** titular desconocido, **When** se desarrolla localmente, **Then** se registran por separado los datos pendientes sin inventarlos ni bloquear el desarrollo; la publicación definitiva sigue pendiente.
3. **Given** referencias originales a servicios ausentes, **When** se revisa el diagnóstico de la feature, **Then** este identifica la discrepancia y su carácter futuro sin modificar los textos aprobados ni afirmar actividad real.

4. **Given** las cuatro rutas locales, **When** se revisan a 320/768/1440 y zoom 200 %, **Then** muestran cabecera oscura, contenido centrado sobre fondo claro, títulos/listas diferenciados y enlaces con foco, sin recortes ni grandes vacíos artificiales. La aprobación de lectura anterior no equivale a aprobación estética.

### User Story 2 - Contactar con el portal (Priority: P2)
Como lector quiero consultar el canal aprobado para sugerencias, correcciones y colaboraciones.
**Why this priority**: Proporciona contacto sin ampliar la recogida de datos.
**Independent Test**: Verificar texto y enlace de correo sin enviar mensajes.
**Acceptance Scenarios**:
1. **Given** documento Contacto aprobado, **When** accedo a Contacto, **Then** veo sus finalidades y el correo hola@todosatcom.com, sin formulario nuevo ni promesa de plazo de respuesta.
2. **Given** buzón no acreditado operativo, **When** se prepara publicación definitiva, **Then** su disponibilidad queda pendiente de confirmación del propietario; no se envía correo de prueba sin autorización.

### User Story 3 - Mantener los servicios futuros fuera del alcance actual (Priority: P3)
Como propietario quiero preparar los contenidos sin incorporar analítica, publicidad ni consentimiento ficticio.
**Why this priority**: Evita activar servicios por el mero hecho de aparecer en los documentos.
**Independent Test**: Revisar que la integración local de textos no incorpora servicios ni controles de consentimiento operativos.
**Acceptance Scenarios**:
1. **Given** Analytics previsto para el dominio definitivo, **When** se trabaja en esta feature, **Then** no se implementa ni activa Analytics.
2. **Given** AdSense previsto mucho más adelante, **When** se prepara la feature, **Then** no se instala AdSense ni se configura su CMP; sus referencias originales se conservan y se diagnostican como futuras.
3. **Given** el documento Banner aprobado, **When** no existen servicios que justifiquen su consentimiento, **Then** se conserva como fuente literal pendiente de uso futuro, sin desplegar banner operativo, botones ficticios ni almacenamiento de preferencias.

### Edge Cases
- Una afirmación en presente sobre Google o redes sociales dentro de los originales no constituye evidencia de uso actual; anotarla en diagnóstico separado, no corregirla unilateralmente.
- La conversión de formato debe preservar contenido, títulos, apartados y orden; no permite resúmenes ni reescritura jurídica.
- Un enlace externo o imagen remota no se clasifica automáticamente como cookie; registrar por separado conexión y almacenamiento.
- Rutas dormidas accesibles directamente pueden ejecutar almacenamiento: no afirmar ausencia global por ocultar la tienda.
- Datos del titular incompletos bloquean la publicación definitiva, no el desarrollo local.

## Requirements

### Functional Requirements
- **FR-001**: Mantener las rutas aviso legal, privacidad, cookies y contacto y sus enlaces existentes; textos legibles y navegación por teclado, móvil y ampliación 200 %. Presentación uniforme con cabecera oscura de identidad TodoSatcom, título destacado, fondo claro y columna centrada de lectura; jerarquía de apartados/listas, espacios equilibrados sin grandes vacíos, enlaces reconocibles y foco visible. En páginas cortas el footer debe alcanzar el borde inferior de la ventana; en largas seguirá al contenido, en flujo normal sin posición fija/absoluta, solapamientos ni overflow.
- **FR-002**: Respetar literalmente contenido y estructura de los cinco documentos aprobados de Carlos. No realizar reescritura jurídica ni cambios editoriales no autorizados; conservar originales y referencias a servicios futuros.
- **FR-003**: No implementar ni activar Google Analytics en esta feature. Su incorporación prevista para el lanzamiento del dominio definitivo requiere una actuación posterior autorizada.
- **FR-004**: Registrar por separado los datos identificativos pendientes del titular; no insertarlos como datos inventados ni alterar los textos originales. Su ausencia no bloquea desarrollo local, pero impide considerar publicables los documentos definitivos hasta completarlos y obtener aprobación.
- **FR-005**: Contacto utilizará el correo aprobado y las finalidades del documento. No añadir formulario, captación comercial, suscripción ni envío automático. El correo debe quedar separado visualmente del texto precedente, con el mismo tamaño que el texto principal, enlace azul discreto y subrayado, sin caja decorativa, sin cambiar palabras, orden ni negritas. Confirmar operatividad del buzón antes del lanzamiento.
- **FR-006**: Mantener un diagnóstico separado del texto legal con usos reales, condicionales y futuros. Identificar que las afirmaciones originales sobre Analytics, AdSense o funciones sociales no acreditan actividad actual; no corregirlas unilateralmente ni inventar cookies o duraciones.
- **FR-007**: AdSense se difiere a una etapa mucho posterior al lanzamiento. No instalarlo ni configurar su CMP en esta feature. La restricción futura de CMP certificada por Google e integrada con IAB TCF se conserva como antecedente para una decisión posterior, no como trabajo actual.
- **FR-008**: Conservar literalmente el documento Banner y sus opciones Aceptar/Rechazar/Configurar como fuente aprobada para uso futuro. No implementarlas como controles ficticios ni diseñar ahora una CMP propia.
- **FR-009**: No incorporar gestión, persistencia ni simulación de consentimiento para servicios ausentes. La futura gestión de aceptación, rechazo, preferencias y retirada queda fuera de esta entrega y requerirá especificación/autorización posterior.
- **FR-010**: La inclusión literal de referencias a Google en los documentos no autoriza cargas, scripts, configuraciones, conexiones ni seguimiento. El diagnóstico debe separar preparación de textos, lanzamiento con Analytics futuro y etapa posterior de AdSense.
- **FR-011**: Preservar Feature 001, tienda dormida, flujo editorial y arquitectura actual. No modificar backend, medios, contenidos ni permisos; el inventario de tienda no autoriza activarla ni corregirla en esta feature.
- **FR-012**: Validación futura local con fixtures y sin tráfico productivo. No considerar probada configuración de hosting, cookies de respuesta o servicios externos a partir del código solamente.

### Key Entities
- Documento base: nombre, revisión identificada, apartados aprobados y datos pendientes; originales inalterados.
- Servicio/tecnología: finalidad, conexión, almacenamiento, estado observado/condicional/futuro y evidencia.
- Estado editorial legal: provisional o definitivo autorizado, separado del estado Draft/Published de Strapi.
- Pendiente de publicación: dato del titular o validación requerida, registrado fuera del texto original; sin valores inventados.

## Success Criteria

### Measurable Outcomes
- **SC-001**: Las cuatro páginas conservan el contenido y estructura de sus documentos aprobados, sin datos identificativos inventados ni declaración de publicación definitiva autorizada. Las cuatro rutas deben ser legibles a 320/768/1440 px y zoom 200 %, sin desbordamiento horizontal; el cierre visual requiere aprobación estética expresa del propietario.
- **SC-002**: Cero implementaciones o activaciones de Analytics, AdSense y CMP en esta feature.
- **SC-003**: El diagnóstico identifica el 100 % de las referencias originales a servicios futuros sin alterar unilateralmente los textos legales.
- **SC-004**: Contacto permite identificar el único canal aprobado sin transmitir datos automáticamente ni incorporar formulario nuevo.
- **SC-005**: Cero banners o controles de consentimiento ficticio y cero almacenamiento nuevo de preferencias para servicios ausentes; documento Banner conservado literalmente como fuente futura.
- **SC-006**: Cero cambios en datos, backend y Feature 001; ninguna publicación definitiva sin satisfacer los pendientes legales y de lanzamiento.

## Assumptions

Ahora: delimitar la integración local literal de las cuatro páginas y conservar el documento Banner como fuente futura, tras las etapas SDD que se autoricen. No introducir avisos dentro de los originales para corregir sus afirmaciones: el diagnóstico es documental y separado. La aprobación literal no acredita exactitud tecnológica actual ni autoriza publicación definitiva.

Analytics se prevé para el lanzamiento del dominio definitivo, pero no se implementa ahora. AdSense llegará mucho más adelante: no se instala ni configura su CMP. No se requiere desarrollar ni probar un sistema de consentimiento en esta feature.

### Datos del titular pendientes, separados de los originales

El propietario deberá determinar y aportar identidad o razón social, domicilio, identificación fiscal y, cuando correspondan a su naturaleza/actividad, datos registrales o profesionales y datos de contacto del responsable. No se presupone qué campos condicionales aplican ni se inventan valores. La validación de datos y documentos definitivos se realizará antes de publicar; no bloquea el trabajo local. También queda pendiente confirmar operatividad del buzón aprobado.

### Inventario de código actual y límites

- No aparecen integraciones GA, AdSense, Tag Manager, CMP, escrituras document.cookie ni píxeles de seguimiento en src/public inspeccionados. Layout contiene interacción de menú/scroll y datos estructurados; schema.org/canonical no son cargas de seguimiento.
- Fuentes Inter locales: src/styles/global.css. Medios según URL editorial: src/lib/media.ts y src/lib/renderBlocks.ts; imágenes del cuerpo pueden cargarse remotamente. Conexión a proveedor no equivale a cookie acreditada. Strapi se consulta en construcción; no se ha leído .env ni producción.
- localStorage `todosatcom:cart:v1`: src/lib/cart.ts. sessionStorage `todosatcom:checkout-idempotency:v1`: src/scripts/cart-checkout.ts. Son usos funcionales comerciales, no analítica. Layout condiciona UI global a PUBLIC_STORE_ENABLED, pero /tienda/carrito incluye scripts propios: no se garantiza inactividad de todas las rutas por el flag. Configuración efectiva desplegada desconocida.
- Formulario Netlify Forms en src/pages/tienda/consultar-disponibilidad.astro; flag controla consulta de productos, no demuestra desactivación del formulario. Fuera del alcance de modificación; inventariar para futura revisión legal efectiva. Checkout/validación comerciales existentes condicionales, sin comprobar ni activar destinos reales.
- Las cuatro páginas src/pages/{aviso-legal,privacidad,cookies,contacto}.astro solo contienen textos provisionales. LegalPage usa noindex, follow; sitemap las excluye. Noindex no sustituye información legal ni control de publicación.
- No se auditaron respuestas HTTP productivas, inyección de hosting, cookies del proveedor ni paneles externos. No es inventario productivo certificado.

### Documentos aprobados y diagnóstico separado

Origen: /Users/gerardolmos/CURRO/WEB/TodoSat/documentos-legales/. Los cinco originales se conservan íntegros.
- Aviso Legal: integrar literalmente sus seis apartados. Datos del titular pendientes en el registro separado anterior.
- Privacidad: integrar literalmente sus ocho apartados. Sus referencias a medición, analítica y publicidad son previsiones; no acreditan servicios activos.
- Cookies: integrar literalmente sus seis apartados, incluidas las menciones a Analytics y AdSense. Diagnóstico: Analytics es futuro de lanzamiento y AdSense futuro mucho más lejano; ninguno se implementa aquí.
- Banner: conservar literalmente texto y opciones aprobados como fuente futura, sin banner operativo ahora. Diagnóstico: anuncios, redes sociales y compartición descritos no están acreditados como activos.
- Contacto: conservar literalmente texto y estructura, correo y finalidades. No añadir formulario ni promesas de respuesta.

### Referencias oficiales consultadas

- Google CMP y Privacidad y mensajes: https://support.google.com/adsense/answer/13554116?hl=en
- Mensajes europeos, TCF y consentimiento: https://support.google.com/adsense/answer/10961068?hl=en
- AEPD: https://www.aepd.es/guias/guia-cookies.pdf

Estas referencias quedan como antecedentes para el futuro; no implican selección, instalación ni configuración de CMP ahora. No se declara cumplimiento normativo global por conservar textos aprobados.

## Clarifications

### Session 2026-10-23
- Q: ¿Dónde están los cinco documentos aprobados? → A: /Users/gerardolmos/CURRO/WEB/TodoSat/documentos-legales/ (Gerard). Leídos los cinco.

### Session 2026-10-24
- El propietario confirma contenido y estructura literales de los cinco documentos, sin reescritura jurídica ni cambios editoriales no autorizados.
- Datos identificativos pendientes por separado: condicionan publicación definitiva, no desarrollo local.
- Analytics futuro de lanzamiento, sin implementación actual. AdSense mucho más adelante, sin instalación ni configuración CMP. Sus referencias permanecen intactas; diagnóstico separado explica el estado futuro.
- Ningún sistema de consentimiento ficticio. Esta decisión sustituye los anteriores escenarios de simulación de preferencias y las propuestas de adaptar los textos.
- Revalidación SPECIFY/CLARIFY: alcance, actores, datos, interacción, privacidad, dependencias, fallos y criterios claros. Sin nuevas preguntas imprescindibles. Pendientes de lanzamiento explícitos, sin bloquear especificación local. Checklist 16/16 conservado; no PLAN ni IMPLEMENT.

Documento base `Aviso Legal.docx` SHA-256: `ca34053957646fad87cf9f71534458dc14d3075ec412efd5a13794ff23b0fcd6`.

Documento base `Banner Cookies.docx` SHA-256: `ab325f6e51b98c7ed27bffa0e34c9fc2317f5b5410b9171aaf508fa74bfbc685`.

Documento base `Contacto.docx` SHA-256: `2e2b1e260f04dee255e7e6343cf0c358098eef8ecf9ba396d1bb61b15051600a`.

Documento base `Política de Cookies.docx` SHA-256: `856a6635fc5842c5974459d35aba52d4680cd95c83e69140e9fe152f80feffa2`.

Documento base `Política de Privacidad.docx` SHA-256: `5f3c7029b8cb4760d327fee08757f03c29ddff365375b99a5dc4cea16e5039dd`.

### Decisión visual posterior — 2026-10-24
El propietario aprueba la dirección de rediseño descrita en FR-001/FR-005, pero NO aprueba la estética anterior. Permite reorganizar exclusivamente presentación y espacios; todos los textos, títulos, apartados, listas, negritas y orden permanecen literales. Sin encabezados ni eslóganes nuevos. T016/T017 requieren evidencia y nueva aprobación estética. SPECIFY/CLARIFY revalidados: sin ambigüedades imprescindibles; checklist 16/16.

### Corrección visual autorizada — footer y correo
La estética anterior queda rechazada por espacio blanco bajo footer y correo sobredimensionado. Ajustar únicamente esos dos defectos, conservando palabras/negritas y restantes decisiones. Criterio: Contacto corto ocupa al menos el viewport completo incluyendo header/main/footer; páginas largas conservan flujo normal. Correo sin caja, tamaño de párrafo, foco visible.
