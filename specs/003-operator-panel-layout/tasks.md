# Tasks: Distribución del panel ampliado
**Implementation repository**: todosat-frontend
**Input**: spec.md, plan.md, research.md, data-model.md y contracts/panel.md de esta feature.
**Tests**: validación proporcional del render real y build aislado; no suites ajenas ni pruebas que solo repitan clases CSS.

## Phase 1: Setup
- [x] T001 Verificar alcance limpio, Constitution y aislamiento existente; registrar base en specs/003-operator-panel-layout/qa.md.

## Phase 2: Foundational
- [x] T002 Confirmar contrato de selectores y límites existentes de src/components/HomeOperatorsSection.astro conforme a contracts/panel.md.

## Phase 3: US1 — Leer el operador seleccionado (P1)
**Goal**: logo superior y texto compacto inferior, íntegro.
**Independent Test**: quickstart.md con textos cortos/largos y selección de operador.
- [x] T003 [US1] Ajustar exclusivamente área anterior al divisor en src/components/HomeOperatorsSection.astro para FR-001–FR-005.
- [x] T004 [US1] Ejecutar build aislado mediante scripts/test-editorial-presentation.mjs sin modificarlo; registrar resultado en specs/003-operator-panel-layout/qa.md.
- [x] T005 [US1] Comprobar distribución, texto extenso, selección y anchos 320/768/1280/1440 mediante quickstart.md; registrar evidencia y límites en specs/003-operator-panel-layout/qa.md.

## Phase 4: Cierre de QA local
- [x] T006 Revisar diff acotado y registrar revisión exacta, resultados, límites y estado en specs/003-operator-panel-layout/qa.md y tasks.md; dejar revisión estética al propietario.

## Dependencies & Execution Order
T001 → T002 → T003 → T004 → T005 → T006. Una sola historia; sin tareas paralelas por compartir componente y evidencia.
## Parallel Example: US1
No aplica: validación depende de la salida compilada; no se requiere equipo paralelo.
## Implementation Strategy
Un incremento mínimo, validación local, pausa para revisión humana. Sin commit, despliegue ni CONVERGE.

## Ajuste final autorizado: US2
- [x] T007 [US2] Retirar solo párrafo descripcion_home en src/pages/operadores/[slug]/index.astro, conservando descripcion_corta y los cambios de Feature 004.
- [x] T008 [US2] Comprobar HTML compilado de ficha y Home, integridad de bloques protegidos y registrar resultados en specs/003-operator-panel-layout/qa.md.

Dependencias del ajuste: T006 → T007 → T008. No repetir QA visual de US1.
