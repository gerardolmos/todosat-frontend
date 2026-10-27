# Tasks: Ajustes visuales de operadores

**Implementation repository**: todosat-frontend; todos los paths pertenecen a este repositorio.
**Input**: spec.md, plan.md, research.md, data-model.md, contracts/presentation.md y quickstart.md de Feature 010.
**Estado**: IMPLEMENT autorizado y aplicado localmente. 10/10 verificadas. T008 aprobada manualmente por el propietario el 2026-10-27; T010 cerrada documentalmente. Sin commit ni publicación.

## Phase 1: Setup

- [x] T001 Registrar HEAD, estado Git y hashes previos de archivos ajenos, Features 008/009 y SVG original en `specs/010-operator-visual-adjustments/baseline.json`; comprobar la lista permitida de PLAN (FR-002, FR-009).

## Phase 2: Foundational

- [x] T002 Preparar harness aislado `tests/operator-visual-adjustments/render.mjs` y `fixtures.mjs`, con componentes/CSS reales, imágenes sintéticas locales, bandas presentes/vacías/null, dimensiones ausentes y texto largo; bloquear tráfico no local y excluir .env; conservar muestra base de geometría anterior (FR-003–008).

## Phase 3: US1 — Pictograma (P1)

**Objetivo**: icono original coherente con los otros cinco campos.
**Prueba independiente**: render real de ficha con y sin bandas; valor escapado, icono único y 48 × 48.

- [x] T003 [US1] Añadir casos de render en `tests/operator-visual-adjustments/presentation.test.mjs` para recurso original, presencia/omisión, resto de campos y restricción «El valor se presenta como texto escapado; no se interpreta como HTML.»; acreditar el fallo inicial del icono ausente sin exigir fallos en comportamientos ya correctos (FR-001–003, SC-001, SC-005).
- [x] T004 [US1] Importar `src/assets/images/pictostecnicosLight/frequencia.svg` y asignarlo a Bandas en `src/pages/operadores/[slug]/index.astro`; mantener renderer 48 × 48, interpolación, filtro y SVG intactos; ejecutar los casos US1 y anotar resultado en `specs/010-operator-visual-adjustments/qa.md` (FR-001–003).

## Phase 4: US2 — Logotipo ampliado (P1)

**Objetivo**: proporción y transparencia, máximos 330 × 110, origen adicional +35/+35.
**Prueba independiente**: tres proporciones, ancho restringido, cambios de selección, sin logo y texto largo, con geometría real.

- [x] T005 [US2] Añadir casos de contrato/markup y expectativas geométricas en `tests/operator-visual-adjustments/presentation.test.mjs`: panorámico/cuadrado/vertical, restricciones simultáneas, margen único, ancho descontado, ausencia de logo/dimensiones y conservación del selector y minitarjetas; acreditar discrepancias iniciales relevantes (FR-004–008, SC-002–004).
- [x] T006 [US2] Ajustar exclusivamente tamaño/espacio del logo en `src/components/HomeOperatorsSection.astro` conforme a `contracts/presentation.md`: contain, left top, máximos 330 × 110, margen adicional 35/35, ancho disponible descontado; conservar atributos/selección, padding y demás contenido. Restricción: «No se modifican imágenes ni referencias editoriales.» (FR-004–008).
- [x] T007 [US2] Ejecutar casos US2 de `tests/operator-visual-adjustments/presentation.test.mjs` y generar muestra local con `render.mjs`; verificar cambio consecutivo con/sin logo, dimensiones ausentes, conservación del marcado ajeno y texto largo; registrar evidencia y límites en `specs/010-operator-visual-adjustments/qa.md` (FR-004–008).

## Phase 5: Polish & cross-cutting QA

- [x] T008 Verificar geometría real y accesibilidad preservada de ambas superficies a 320/768/1280/1440 según `specs/010-operator-visual-adjustments/quickstart.md`: 48 × 48, proporciones/alpha, +35/+35 frente a base, ausencia de overflow/solapamiento, minitarjetas, descripción/botón completos y selección por teclado sin cambiar foco/alt. Sin Chrome automatizado; si falta herramienta, revisión manual agrupada en localhost y estado PENDIENTE hasta evidencia, documentada en `specs/010-operator-visual-adjustments/qa.md` (SC-001–005).
- [x] T009 Comparar hashes con `specs/010-operator-visual-adjustments/baseline.json`, incluyendo SVG y todos los archivos 008/009; revisar diff permitido y `git diff --check`; registrar preservación y detener ante cambios ajenos en `specs/010-operator-visual-adjustments/qa.md` (FR-002, FR-007–009).
- [x] T010 Cerrar evidencia en `specs/010-operator-visual-adjustments/qa.md` con revisión/diff exactos, resultados, limitaciones y estado local; actualizar `specs/010-operator-visual-adjustments/tasks.md` solo con tareas acreditadas. No CONVERGE, commits ni publicación implícitos (FR-009, SC-004).

## Dependencies & Execution Order

T001 → T002 → T003 → T004; T002 → T005 → T006 → T007; ambas historias → T008 → T009 → T010.
Las historias son funcionalmente independientes. Por compartir el archivo de pruebas, realizar T003 y T005 secuencialmente. T004 y T006 podrían ejecutarse en paralelo solo una vez preparados ambos grupos de pruebas; para este cambio pequeño se recomienda secuencia simple.

## Parallel Examples

US1: tras T003, editar la ruta mientras se prepara US2 (T005) en el archivo de pruebas distinto; no escribir simultáneamente qa.md.
US2: tras T005, T006 puede coexistir con edición de la ruta US1; verificaciones y documentación finales secuenciales. No se necesitan agentes paralelos ni tareas [P] adicionales.

## Implementation Strategy

Primero icono (MVP US1), validar; después logo US2, validar; QA geométrica conjunta y preservación final. No instalar dependencias ni hacer build general. Usar solo el render mínimo aislado previsto. Las comprobaciones numéricas/markup no acreditan visualmente el CSS por sí mismas. No marcar T008 ni cierre completo si falta evidencia real.
