# Tasks: Presentación editorial

**Implementation repository**: todosat-frontend. Todas las rutas son relativas a este repositorio.
**Input**: `specs/001-editorial-presentation/{spec.md,plan.md,research.md,data-model.md,contracts/presentation-and-media.md,quickstart.md}`.
**Estado**: IMPLEMENT y QA local completados, 26/26; CONVERGE no ejecutado; estado acreditado en qa.md. IMPLEMENT local autorizado el 2026-10-23, tras ANALYZE PASS.
**QA evidence**: registrar resultados reales, SHA exacto y diff sin commit en `specs/001-editorial-presentation/qa.md`. No confundir fixtures con datos productivos ni comprobación automática con revisión visual.

## Phase 1: Setup

- [X] T001 Registrar base Git, alcance frontend-only, Constitution y restricciones en `specs/001-editorial-presentation/qa.md`; verificar ausencia de cambios ajenos antes de implementar (FR-013, SC-006).
- [X] T002 Crear `scripts/test-editorial-presentation.mjs` con modos --unit, --build y --preview; copia temporal sin .env*, credenciales ni datos reales, dependencias instaladas reutilizadas, API/imágenes ficticias locales y bloqueo verificable de salida externa; no ejecutar build en el checkout real (FR-013, SC-006).
- [X] T003 Crear fixtures ficticios en `tests/editorial-presentation/fixtures/` para noticias, medios, operadores, footer y consumidores compartidos; cubrir imágenes horizontales/verticales/cuadradas, ausencia, captions largos y caracteres especiales (FR-001–FR-013, SC-001–SC-006).

## Phase 2: Foundational

- [X] T004 Registrar en `specs/001-editorial-presentation/qa.md` evidencia de gates G1/G2: permiso upload existente e identidad hash/provider/url suficiente. No acceder a producción bajo este encargo; si no hay evidencia autorizada, dejar recuperación real inactiva y continuar con fallback histórico diagnosticado. No añadir permisos, backend ni coincidencias por nombre (FR-007, FR-013).
- [X] T005 Capturar y comprobar comportamiento previo de párrafos/listas/títulos y consumidores manuales, operadores, hardware y tienda en `tests/editorial-presentation/render.test.mjs`; fixtures y salida existente sin activar tienda ni corregir otros bloques (FR-012, FR-013).

**Checkpoint**: T001–T003 y aislamiento son obligatorios para toda ejecución. T004 determina el modo sin recuperación real de US1; no bloquea US2/US3 independientes. T005 precede cualquier modificación del renderizador.

## Phase 3: US1 — Noticias con imágenes completas y captions vigentes (P1, MVP)

**Independent test**: noticia ficticia con principal y varias imágenes de cuerpo, caption de biblioteca distinto de la instantánea; HTML final, diagnósticos con fallback histórico y verificación visual local.

### Tests first

- [X] T006 [P] [US1] Escribir pruebas de contrato en `tests/editorial-presentation/media.test.mjs`: respuesta paginada upload, igualdad hash/provider/url, límite 2, cero/múltiples candidatos, URL relativa, identidad incompleta, URL distinta, 401/403, timeout, red, metadatos incompletos; demostrar fallo previo al resolvedor (FR-007, FR-013).
- [X] T007 [US1] Ampliar `tests/editorial-presentation/media.test.mjs` con caption añadido/cambiado/vaciado tras insertar, caché por identidad, máximo 4 consultas simultáneas, sin retry, ausencia de transporte real y operaciones de escritura y ausencia de secretos en errores; demostrar fallo previo (FR-007, FR-008, SC-006).
- [X] T008 [P] [US1] Añadir pruebas en `tests/editorial-presentation/render.test.mjs` de imágenes opt-in en orden, caption literal, alt preservado, protocolos peligrosos rechazados, caption blanco sin pie, repetición sin duplicar pies y límites del cambio a image; demostrar fallo previo (FR-005, FR-006, FR-008, FR-009, FR-013).

### Implementation

- [X] T009 [US1] Implementar `src/lib/news-media.ts` conforme al contrato: transporte server-side inyectable, contrato paginado /api/upload/files/page, identidad exacta y respuesta única; fallback histórico diagnosticado sin mutación de noticia; solo después de T004, T006 y T007 (FR-007, FR-008, FR-013).
- [X] T010 [US1] Completar caché en memoria, límite de concurrencia y timeout en `src/lib/news-media.ts`; probar respuestas rechazadas y caption vacío vigente, sin persistencia ni consultas del navegador (FR-007, FR-013).
- [X] T011 [P] [US1] Crear `src/components/NewsImage.astro` para imagen principal con figure, img proporcional y figcaption literal de 14 px; ancho 100 %, máximo 550 px, object-fit cover centrado, conservar alt y omitir pie vacío (FR-004, FR-006, FR-008, FR-009).
- [X] T012 [US1] Añadir modo explícito de imágenes resueltas a `src/lib/renderBlocks.ts` conservando salida por defecto y otros bloques; escape contextual de texto/atributos, URL segura, proporción y asociación semántica (FR-005, FR-006, FR-008, FR-009, FR-013).
- [X] T013 [US1] Integrar figura principal y resolución de imágenes de cuerpo en `src/pages/noticias/[slug]/index.astro`, conservando caption del populate y getImage, filtros/orden existentes; no añadir consultas a listados ni cambiar `src/lib/content.ts` (FR-004–FR-009, FR-012, FR-013).
- [X] T014 [US1] Añadir y ejecutar `tests/editorial-presentation/integration.test.mjs` con build aislado: captions actuales de principal/cuerpo, texto literal, orden, sin imagen principal, errores conservan caption histórico y permiten completar build, credenciales ausentes del HTML; verificar pruebas T006–T008 y regresiones T005 (FR-004–FR-009, FR-012, FR-013, SC-006).
- [X] T015 [US1] Comprobar en navegador local 320/768/1440 px, retratos/paisajes/cuadrados, pies largos, contraste calculado >=4.5:1, 14 px y zoom 200 %; registrar evidencia real en `specs/001-editorial-presentation/qa.md`, pendiente si no hay navegador (SC-001, SC-003, SC-005).

## Phase 4: US2 — Tarjetas de operadores (P2)

**Independent test**: Home ficticia con logos extremos, nombre largo, ausencia de logo y selección con teclado.

- [X] T016 [US2] Crear `tests/editorial-presentation/home.test.mjs` sobre HTML generado para ausencia de descripción solo en selector, preservación de panel/descripciones restantes, orden, órbita, nombre y selección; demostrar fallo previo (FR-001, FR-002, FR-003, FR-012).
- [X] T017 [US2] Ajustar solo tarjetas selectoras en `src/components/HomeOperatorsSection.astro`: retirar descripción, redistribuir espacio y logos contenidos máximo 140 × 55 px, sin cambiar panel ampliado ni fichas (FR-001, FR-002, FR-003).
- [X] T018 [US2] Ejecutar `tests/editorial-presentation/home.test.mjs` y revisar límites reales, proporción, ausencia de solapamientos/desbordamiento a 320/768/1440 px, teclado y foco visible; documentar evidencia en `specs/001-editorial-presentation/qa.md` (FR-011, SC-002, SC-005).

## Phase 5: US3 — Footer (P3)

**Independent test**: salida de footer con reloj de construcción ficticio 2026 y 2027 y enlaces sin cambios.

- [X] T019 [US3] Crear `tests/editorial-presentation/footer.test.mjs` con textos exactos, enlaces conservados y fecha de construcción controlada para 2026/2027; demostrar fallo previo (FR-010, SC-004).
- [X] T020 [US3] Sustituir textos de `src/components/Footer.astro` por los aprobados manteniendo año dinámico y navegación (FR-010).
- [X] T021 [US3] Ejecutar `tests/editorial-presentation/footer.test.mjs` y comprobar footer compartido sin overflow en build local; registrar evidencia en `specs/001-editorial-presentation/qa.md` (FR-010, FR-011, SC-004).

## Phase 6: Validación transversal y cierre local

- [X] T022 Ejecutar regresión conjunta con `scripts/test-editorial-presentation.mjs --unit` y `--build`: todos los consumidores de renderBlocks, filtros, publicación/activo, orden, enlaces y contenido ajeno permanecen iguales; tienda solo mediante fixtures sin activación (FR-012, FR-013).
- [X] T023 Revisar seguridad de los nuevos markup y metadatos en `tests/editorial-presentation/integration.test.mjs`: caption/alt con HTML y comillas, URL maliciosa, consultas server-side GET, ningún secreto en HTML/logs ni salida externa del laboratorio; no ampliar sanitización de bloques ajenos (FR-007, FR-008, FR-013, SC-006).
- [X] T024 Completar revisión adaptable/accesible conjunta mediante `scripts/test-editorial-presentation.mjs --preview`; registrar en `specs/001-editorial-presentation/qa.md` navegador, dimensiones, teclado, zoom y contraste medido; reutilizar evidencias T015/T018 vigentes sin repetirlas injustificadamente (FR-009, FR-011, SC-001, SC-002, SC-003, SC-005).
- [X] T025 Verificar todos los pasos aplicables de `specs/001-editorial-presentation/quickstart.md` contra el laboratorio y documentar resultados/limitaciones en `specs/001-editorial-presentation/qa.md`; no validar producción por extrapolación.
- [X] T026 Auditar diff, alcance, dependencias sin altas, backend intacto y correspondencia requisito→prueba; actualizar solo tareas realmente verificadas en `specs/001-editorial-presentation/tasks.md` y cierre en `specs/001-editorial-presentation/qa.md`, con SHA/diff exactos, gates pendientes y ausencia de commits/deploys (FR-001–FR-013, SC-001–SC-006).

## Dependencies & Execution Order

T001 → T002 → T003. T004 y T005 tras setup. US1: T006 → T007; T008 tras T005; T009 tras T004/T006/T007; T010 tras T009; T011 independiente tras setup; T012 tras T005/T008; T013 tras T010/T011/T012; T014 → T015. US2: T016 → T017 → T018. US3: T019 → T020 → T021. T022 → T023 → T024 → T025 → T026 tras historias completas. Ningún gate pendiente se marca PASS.

## Parallel examples

Después de setup: T006 (media.test.mjs) y T008 (render.test.mjs, tras T005) no comparten archivos. T011 (NewsImage.astro) puede prepararse mientras se ejecuta T009 (news-media.ts), respetando el gate de este último. US2 y US3 pueden progresar independientemente de US1; escrituras a qa.md se serializan. No paralelizar tareas que editan el mismo archivo.

## Implementation strategy

MVP: US1 verificada con caption principal recibido y caption histórico diagnosticado en bloques cuando no hay recuperación acreditada. G1/G2 sin evidencia deshabilitan solo recuperación adicional. Después US2 y US3 y verificación transversal. No commits, pushes, despliegues, producción ni cambios backend implícitos. IMPLEMENT local autorizado por Gerard el 2026-10-23; no CONVERGE.

T021: PASS por revisión humana explícita de Gerard; footer conservado sin cambios en esta revisión. T011/T017 se revalidan con los nuevos límites aprobados.

Recuperación 2026-10-23: 21/26 completas. T015/T018/T024/T025/T026 permanecen pendientes con alcance concreto en qa.md; revisión 1440 y evidencia humana incorporadas, 320/768 actuales no acreditadas por fallo de control de Chrome. Sin cambios funcionales adicionales.

Cierre QA local: T015/T018/T024 acreditadas por revisión humana comunicada por Gerard y medición efectiva en Chrome; T025 revisada con limitaciones explícitas del quickstart; T026 auditoría y manifiesto intactos. Resultado 26/26, sin CONVERGE. Véase cierre final en qa.md.
