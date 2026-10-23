# Feature Specification: Presentación editorial

**Scope**: frontend-only
**Repository**: todosat-frontend
**Feature Branch**: No creada; trabajo documental en `main`.
**Feature ID**: `001-editorial-presentation`
**Created**: 2026-10-22
**Status**: Especificada; CLARIFY completado sin preguntas funcionales imprescindibles. IMPLEMENT local parcial; revisión visual aprobada incorporada.
**Input**: Encargo aprobado de Gerard: tarjetas de operadores de Home, imagen principal de Noticias, footer y captions de imágenes principales y del cuerpo. SPECIFY y CLARIFY completados; encargo posterior de PLAN, TASKS y ANALYZE con captions vigentes de biblioteca, incluidos cambios posteriores a la inserción.

Gobernanza: Constitution 2.0.0 local, idéntica a la autoridad backend; SHA-256 `496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7`. Procedencia: `docs/sdd/governance-reference.json`. Base frontend `d45667333d84bd3cb8dead950753baaab07152a4`, backend consultado en lectura `6a626c9728bedacd35748cf1102ffd1df3fd0b0d`. No hay cambio de contrato, permisos ni esquema backend.

## User Scenarios & Testing

### User Story 1 - Leer noticias con imágenes proporcionadas y sus pies (Priority: P1)

Como lector quiero ver las imagen principal adaptada y las imágenes del cuerpo completas y conocer sus pies editoriales sin que se altere la noticia.

**Why this priority**: Recupera información editorial existente y evita deformaciones y preserva los pies editoriales.
**Independent Test**: Noticias de prueba locales con imágenes horizontales, verticales y cuadradas, captions presentes, vacíos y con caracteres especiales; no utilizar producción.
**Acceptance Scenarios**:
1. **Given** una imagen principal válida, **When** se lee a 320, 768 o 1440 px de ancho de ventana, **Then** la fotografía ocupa todo el ancho disponible, con altura máxima de 550 px y recorte proporcional centrado si es necesario, sin deformación; su caption queda completo debajo.
2. **Given** imágenes insertadas entre párrafos, **When** se presenta la noticia, **Then** aparecen en su orden original con sus captions disponibles, sin alterar los párrafos.
3. **Given** un caption con etiquetas, comillas o signos, **When** se muestra, **Then** se lee como texto literal sin ejecutar ni interpretar HTML.
4. **Given** un caption vacío o ausente, **When** se muestra la imagen, **Then** no se añade pie inventado ni hueco reservado para un pie vacío.
5. **Given** un caption de biblioteca cambiado tras insertar la imagen, **When** una consulta segura permite verificarlo, **Then** se usa el valor vigente, incluido vacío explícito; sin verificación se conserva el caption del bloque con diagnóstico histórico.
6. **Given** metadatos adicionales inaccesibles, **When** se construye la página, **Then** se conserva el caption incorporado cuando exista, se diagnostica la limitación sin secretos y la construcción continúa sin modificar el origen.

### User Story 2 - Explorar tarjetas de operadores equilibradas (Priority: P2)

Como visitante quiero reconocer los operadores por su logo, nombre y tipo de órbita, sin la descripción breve en sus tarjetas de Home.

**Why this priority**: Reduce densidad y mejora la lectura de la selección existente.
**Independent Test**: Tarjetas locales con logos anchos, altos, cuadrados, nombres largos y ausencia de logo, incluyendo selección por teclado.
**Acceptance Scenarios**:
1. **Given** una tarjeta de Home, **When** se muestra, **Then** no incluye la descripción breve; conserva nombre, órbita y selección del operador.
2. **Given** un logo de cualquier proporción, **When** se ajusta a la tarjeta, **Then** no supera 140 px de ancho ni 55 px de alto, no rebasa el espacio disponible y se ve completo sin deformación.
3. **Given** un operador sin logo, **When** se presenta, **Then** su nombre sigue identificándolo y la selección sigue siendo utilizable.
4. **Given** los restantes usos de las descripciones y el panel del operador seleccionado, **When** se aplica esta mejora, **Then** conservan su contenido y comportamiento actuales.

### User Story 3 - Leer un footer actualizado (Priority: P3)

Como visitante quiero una descripción del portal y un aviso de derechos coherentes en todas las páginas.

**Why this priority**: Es una corrección textual acotada e independiente.
**Independent Test**: Footer con fecha de construcción controlada en 2026 y 2027.
**Acceptance Scenarios**:
1. **Given** el año 2026, **When** se construye el sitio, **Then** aparece «Operadores, hardware, manuales y actualidad sobre el ecosistema de comunicación satelital.» y «Todos los derechos reservados © 2026 TodoSatcom.».
2. **Given** una construcción en 2027, **When** se muestra el footer resultante, **Then** el aviso usa 2027 sin editar manualmente el texto; los enlaces existentes se conservan.

### Edge Cases

- Captions largos y palabras extensas deben envolver sin desbordamiento horizontal; no truncar el contenido del pie.
- Espacios blancos únicamente se consideran ausencia de caption. No sustituirlo por nombre de archivo, título o texto alternativo.
- Cada aparición de una imagen mantiene un solo pie asociado, aunque el mismo medio aparezca varias veces.
- Los archivos originales no se modifican. Solo la imagen principal admite recorte visual centrado; imágenes del cuerpo y logos se conservan completos.
- Noticias sin imagen principal mantienen su contenido sin introducir imagen ni pie ficticios.
- Imágenes de bloque con URL inválida se omiten con diagnóstico, sin sustituirlas por otro medio ni impedir la construcción del resto de la noticia.
- No se amplía esta feature a formatos de bloques distintos de imagen que el renderizador actual no soporte.

## Requirements

### Functional Requirements

- **FR-001**: Eliminar la descripción breve exclusivamente de las tarjetas selectoras de operadores en Home, preservando el campo de origen y sus restantes usos.
- **FR-002**: Redistribuir el espacio sin solapamientos ni huecos reservados al texto retirado, conservando nombre, órbita, orden, selección y comportamiento adaptable.
- **FR-003**: Limitar los logos de esas tarjetas a 140 × 55 px y al espacio disponible, conservando proporción, imagen completa e identificación alternativa cuando no haya logo. No aplicar estos límites al logo del panel ampliado ni a las fichas de operadores.
- **FR-004**: Presentar la imagen principal de Noticias al 100 % del ancho disponible y con altura máxima de 550 px. Permitir recorte visual proporcional centrado cuando sea necesario, nunca deformación. Mantener el caption completo debajo y fuera del área recortada. No aplicar esta limitación al cuerpo ni modificar el archivo original.
- **FR-005**: Representar las imágenes del cuerpo de Noticias en su posición editorial, completas y proporcionales, sin modificar el texto ni los medios originales.
- **FR-006**: Mostrar el caption disponible de la imagen principal y de cada imagen del cuerpo inmediatamente debajo de su imagen, con asociación semántica inequívoca.
- **FR-007**: Usar el caption actual del medio principal recibido. Para imágenes del cuerpo, recuperar el caption vigente solo mediante consulta acotada, autorizada y con identidad inequívoca. Si no puede verificarse, conservar el caption editorial incorporado al bloque, cuando exista, y diagnosticar expresamente esa procedencia histórica en build y QA. No afirmar actualización sin evidencia, asociar por nombres o coincidencias aproximadas, modificar el origen ni bloquear toda la construcción exclusivamente por esta limitación.
- **FR-008**: No modificar, duplicar en el origen ni persistir una copia editorial nueva de los captions. El texto renderizado en la página estática es presentación, no un nuevo registro editorial. No usar HTML del caption ni crear pies para valores vacíos.
- **FR-009**: Mostrar pies de 14 px, gris suave con contraste mínimo 4.5:1 respecto al fondo, sin truncamiento y legibles al ampliar al 200 %. Conservar los textos alternativos disponibles; caption y texto alternativo tienen funciones diferentes.
- **FR-010**: Sustituir la descripción del footer por el texto literal aprobado y su aviso por «Todos los derechos reservados © {año} TodoSatcom.», calculando el año al construir el sitio, sin cambiar enlaces ni navegación.
- **FR-011**: Mantener navegación por teclado y foco visible en las tarjetas, sin crear nuevos controles para imágenes o pies y sin desbordamiento horizontal a partir de 320 px.
- **FR-012**: Conservar los filtros actuales de publicación, activo, orden y selección de contenido. No cambiar categorías, noticias destacadas, valores predeterminados, bandas de frecuencia, cookies ni páginas legales.
- **FR-013**: Mantener arquitectura estática y flujo editorial; no escribir en Strapi, PostgreSQL o Cloudinary ni modificar esquemas, permisos o biblioteca multimedia. Los cambios en utilidades compartidas no deben alterar la presentación ajena a esta feature.

### Key Entities

- **Operador existente**: nombre, tipo de órbita, logo y descripciones ya disponibles; solo cambia la tarjeta de Home.
- **Noticia existente**: imagen principal y secuencia de bloques; identidad, estados, relaciones y contenido permanecen intactos.
- **Medio y metadatos del bloque**: URL, dimensiones, texto alternativo y caption cuando estén disponibles. El bloque conserva metadatos incorporados al editarlo, no una relación viva garantizada con la biblioteca.
- **Footer**: dos textos de presentación y año de construcción; no crea datos de negocio.

## Success Criteria

### Measurable Outcomes

- **SC-001**: En todos los casos de aceptación a 320, 768 y 1440 px, la imagen principal ocupa todo el ancho disponible y no supera 550 px de alto, con recorte centrado si procede y sin deformación. Caption completo fuera del recorte; imágenes del cuerpo completas y sin desbordamiento.
- **SC-002**: El 100 % de los logos evaluados respeta ambos máximos y la proporción original. Ninguna tarjeta de Home muestra descripción breve; los otros usos conservan su contenido.
- **SC-003**: Cada imagen válida muestra exactamente el caption de la fuente efectivamente utilizada, como texto literal y con contraste >=4.5:1. QA distingue caption vigente comprobado de caption histórico conservado; no aparecen pies inventados ni un fallo global por la imposibilidad de actualizar metadatos.
- **SC-004**: Todas las páginas que usan el footer comparten los dos textos aprobados; las comprobaciones de fecha 2026 y 2027 producen el año correspondiente sin modificación manual.
- **SC-005**: La selección de operadores sigue operativa con teclado y foco visible; a ampliación del 200 % los pies permanecen legibles y completos.
- **SC-006**: Cero escrituras sobre datos, captions o medios de origen y cero cambios de esquemas, permisos o estados editoriales; el alcance verificado queda limitado a presentación frontend.

## Assumptions

- Decisiones menores adoptadas por delegación: ancho máximo de logo 140 px, altura 55 px; pie 14 px con tono definido por contraste, no por un gris fijo inadecuado al fondo.
- Revisión humana aprobada: la principal puede recortarse visualmente de forma centrada para cubrir el ancho con máximo 550 px; no se recorta el caption ni el cuerpo.
- Los bloques guardados pueden conservar un caption antiguo. La aprobación de Gerard del 2026-10-23 permite conservarlo explícitamente cuando no pueda verificarse el vigente. Un vacío vigente comprobado prevalece sobre el histórico.
- Inspección local: `src/components/HomeOperatorsSection.astro` usa descripción breve y límites 180 × 80 px; `src/pages/noticias/[slug]/index.astro` usa una caja fija de 280/520 px con imagen contenida; `src/lib/renderBlocks.ts` omite bloques image; `src/lib/content.ts` ya solicita el medio principal; `src/components/Footer.astro` ya calcula el año.
- En Strapi instalado, `@strapi/content-manager/.../BlocksInput/Blocks/Image.js`, `IMAGE_SCHEMA_FIELDS` y `handleSelectAssets` incorporan caption, URL, dimensiones, formatos y otros metadatos; esa selección no incluye id/documentId. Esto demuestra capacidad del formato, no presencia en todos los contenidos reales. No se han consultado datos productivos.
- La recuperación adicional es opcional y solo se habilita con evidencia de consulta acotada y autorizada. Si falta esa evidencia, se conserva el caption incorporado; no se amplían permisos ni backend.
- Validación futura exclusivamente local con datos ficticios y dependencias aisladas. Esta especificación no acredita pruebas de implementación ni autoriza builds contra producción, commits, pushes o despliegues. Se mantiene el bloqueo productivo por el incidente de Railway.

## Clarifications

### Session 2026-10-22

No critical ambiguities detected worth formal clarification. Cero preguntas formuladas: el usuario ya incluye imágenes del cuerpo, año dinámico y conservación de datos; las decisiones menores están documentadas en Assumptions.

Cobertura: alcance, entidades, interacción, accesibilidad, casos límite, restricciones, terminología y criterios de finalización claros. Dependencias y fallos están delimitados. Escala y observabilidad sin requisitos nuevos de infraestructura. Actualización aprobada el 2026-10-23: FR-007 y SC-003 permiten fallback histórico diagnosticado sin bloquear publicación. Sustituye la exigencia anterior de actualización obligatoria.

### Revisión humana aprobada
Logos Home 140 × 55 px; principal ancho completo, máximo 550 px y recorte centrado permitido. Footer PASS, sin modificaciones.
