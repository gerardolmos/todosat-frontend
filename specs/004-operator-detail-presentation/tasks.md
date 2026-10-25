# Tasks: Ficha individual de operador
**Implementation repository**: todosat-frontend
**Input**: spec, plan, research, data-model y contracts/presentation.md.
**QA evidence**: qa.md con revisión exacta y diff; fixtures aislados, sin producción.

## Phase 1: Setup
- [x] T001 Preparar copia temporal del harness según specs/004-operator-detail-presentation/quickstart.md, preservando cambios de Feature 003.
## Phase 2: Foundational
- [x] T002 Confirmar trazabilidad de campos en src/lib/content.ts y src/pages/operadores/[slug]/index.astro frente a fixture; registrar diagnóstico en specs/004-operator-detail-presentation/qa.md.
## Phase 3: US1 — Portada proporcional (P1)
**Independent Test**: imágenes vertical/horizontal a 320/1440; imagen ausente.
- [x] T003 [US1] Ajustar únicamente marco y clase de portada en src/pages/operadores/[slug]/index.astro conforme FR-001/FR-002.
- [x] T004 [US1] Construir fixtures aisladas y comprobar cover centrado y ausencia de overflow según quickstart.md; registrar resultados en specs/004-operator-detail-presentation/qa.md.
## Phase 4: US2 — Información técnica (P1)
**Independent Test**: solo órbita, cinco apartados y descripción sin valor.
- [x] T005 [US2] Verificar HTML compilado de casos técnicos; corregir src/pages/operadores/[slug]/index.astro solo ante regresión demostrada y documentar en specs/004-operator-detail-presentation/qa.md.
## Phase 5: Cierre local
- [x] T006 Revisar diff limitado y preservar Features 001–003; completar specs/004-operator-detail-presentation/qa.md y tasks.md sin CONVERGE.

## Dependencies & Execution Order
T001 → T002 → T003 → T004 → T005 → T006. US2 depende de build de fixtures, no de nuevas funcionalidades US1.
## Parallel Example
No paralelismo necesario: una ruta compartida y seis tareas pequeñas.
## Implementation Strategy
Un incremento pequeño, dos historias comprobadas con un build aislado y revisión de la portada. Sin auditorías generales, suites ajenas ni despliegue.
