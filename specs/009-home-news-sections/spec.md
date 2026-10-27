# Feature Specification: Noticias destacadas y noticias generales en Home
**Scope**: frontend-only | **Repository**: todosat-frontend
**Feature Branch**: main (sin crear ni cambiar rama); ID 009-home-news-sections
**Created**: 2026-10-26
**Status**: SPECIFY / CLARIFY PASS; implementación no autorizada en esta fase.
**Input**: contrato aprobado del propietario: selección editorial hasta cuatro y noticias generales hasta siete, sin duplicados ni cambios editoriales.

## User Scenarios & Testing
### User Story 1 — Selección editorial y actualidad (Priority: P1)
El visitante distingue las noticias elegidas editorialmente del resto de actualidad, sin que desmarcar destacado oculte las noticias generales.
**Why this priority**: resuelve la desaparición de noticias ordinarias de Home.
**Independent Test**: comparar las dos selecciones con noticias ficticias publicadas, activas, fechas e identidades conocidas.
**Acceptance Scenarios**:
1. Cero destacadas: ninguna tarjeta ni espacio de relleno de destacadas; Noticias conserva hasta siete elegibles y la tarjeta de archivo.
2. Una destacada: una tarjeta en Destacadas y hasta siete documentos diferentes en Noticias.
3. Cuatro destacadas: cuatro tarjetas; ninguna reaparece en Noticias.
4. Más de cuatro destacadas: aparecen las cuatro más recientes; las restantes pueden aparecer en Noticias según fecha, junto a las no destacadas.
5. Menos de siete noticias restantes: se muestran solo las disponibles, sin contenido inventado. Sin ninguna noticia: únicamente el acceso al archivo en Noticias.
6. Repeticiones del mismo documento y fechas iguales: sin tarjetas duplicadas y orden idéntico aunque varíe el orden de entrada.

### User Story 2 — Continuidad de la Home (Priority: P1)
El visitante mantiene los mismos accesos y diseño fuera de las dos secciones de noticias.
**Why this priority**: evitar regresiones y preservar las recomendaciones editoriales mixtas independientes.
**Independent Test**: comparar orden, tarjeta de archivo y bloques no afectados frente a la base.
**Acceptance Scenarios**:
1. Orden: Operadores → Recomendados por TodoSatcom → Noticias destacadas → Noticias → Hardware → Manuales. Hero, búsqueda y resto de la Home conservan posición relativa, estilos y comportamiento.
2. La tarjeta existente «Ver todos los artículos» aparece exactamente una vez, después de las noticias generales, con el mismo diseño, texto, navegación y destino.
3. «Recomendados por TodoSatcom» conserva su ubicación actual, presentación, consulta, orden y comportamiento condicional; su colección, registros y relaciones permanecen intactos.

### Edge Cases
Sin destacadas se omite su sección y su separador propio, sin hueco artificial. Noticias conserva título y tarjeta de archivo aun vacía. Publicados inactivos y borradores no son elegibles. Fechas iguales se desempatan por identidad estable. Datos sin fecha válida se sitúan al final; se conserva la fecha de publicación alternativa existente cuando falta la editorial. No se inventan documentos para completar límites. Errores de obtención mantienen el tratamiento existente.

## Requirements
### Functional Requirements
- **FR-001**: una única sección «Noticias destacadas», hasta cuatro noticias publicadas activas con destacado=true, más recientes primero; sin tarjeta de archivo ni relleno.
- **FR-002**: inmediatamente después, «Noticias», hasta siete noticias publicadas activas más recientes, independientemente de destacado; excluir solo las mostradas en Destacadas, antes de aplicar el límite.
- **FR-003**: identidad documental única dentro y entre selecciones; empates de fecha resueltos siempre por identidad ascendente estable, no por orden de recepción.
- **FR-004**: conservar y mostrar una sola tarjeta existente «Ver todos los artículos», al final de Noticias; sin cambios de diseño, enlace ni comportamiento.
- **FR-005**: preservar íntegramente Recomendados como bloque independiente de recomendaciones mixtas en su ubicación actual, incluidos colección, registros, relaciones y contenido editorial.
- **FR-006**: mantener diseño de noticias existente y resto de bloques intactos, con el orden de US2; no modificar estilos globales ni tarjetas de noticias.
- **FR-007**: conservar destacado=false para nuevas noticias y todos los registros actuales; ninguna operación sobre datos o esquemas.
- **FR-008**: alcance limitado a Home; archivo, búsqueda, fichas y features cerradas conservan comportamiento. Feature 008 local se preserva íntegra.

### Key Entities
Noticia: identidad, fecha editorial, fecha de publicación alternativa, estado publicado, activo y destacado. Selecciones de Home: vistas de los mismos documentos, no nuevos registros. Destacados: colección independiente de recomendaciones mixtas (noticias, operadores, hardware y manuales), cuya presentación Home se conserva sin cambios.

## Success Criteria
### Measurable Outcomes
- **SC-001**: todos los escenarios de US1 cumplen límites 4/7, sin duplicados ni rellenos.
- **SC-002**: una única tarjeta de archivo, exclusivamente en Noticias; bloque Recomendados idéntico al actual en contenido recibido, presentación y ubicación relativa.
- **SC-003**: selección y orden reproducibles para la misma información, incluso con entrada reordenada.
- **SC-004**: cero cambios de contenido editorial, esquemas, otros bloques y funcionalidades ajenas.

## Assumptions
Se conserva elegibilidad activo=true y criterio de fecha editorial existente; no se amplía la visibilidad de noticias inactivas. Las fuentes habituales proporcionan identidad estable. Ausencia de destacadas no requiere una sección vacía. Son decisiones menores de continuidad explícitas, no nuevas decisiones atribuidas al propietario.
Esta feature sustituye para Home FR-001 de 006; conserva FR-002 de 006 sin reescribir ni reabrir sus artefactos históricos. Backend y contratos de API permanecen compatibles. No publicar ni implementar en esta fase.

## Clarifications
### Session 2026-10-26
Corrección vinculante del propietario: se revoca retirar Recomendados; su sección mixta y sus dependencias quedan íntegramente preservadas. La equivalencia anterior entre Recomendados y Noticias destacadas queda descartada. La deduplicación se aplica exclusivamente entre las dos listas de noticias, no contra Recomendados. Contrato del propietario integrado: cuatro destacadas, siete generales independientes del booleano, exclusión únicamente de las mostradas, tarjeta original única y conservación de colección Destacados. No se formularon preguntas nuevas: no quedan ambigüedades críticas. Cobertura clara: alcance, datos, UX, calidad, dependencias, casos límite, restricciones y terminología. Desglose de tareas y QA ejecutada corresponden a fases posteriores.
