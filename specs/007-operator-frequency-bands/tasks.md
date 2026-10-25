# Tasks: 007-operator-frequency-bands
**Repository**: todosat-frontend. Solo local; otras operaciones no autorizadas.
## Phase 1: Setup
- [x] T001 Leer SPEC global, contrato y plan de specs/007-operator-frequency-bands/; verificar gobernanza.
## Phase 2: Historias locales
- [x] T002 [US1] Mostrar fila opcional escapada sin tocar otras técnicas en src/pages/operadores/[slug]/index.astro.
- [x] T003 [US1] Verificar presencia/ausencia y otras técnicas en tests/operator-frequency/render.test.mjs y build aislado compartido.
## Phase 3: QA y CONVERGE
- [x] T004 Registrar evidencias, pareja SHA/diff y revisión CONVERGE en specs/007-operator-frequency-bands/qa.md.
## Dependencias / estrategia
Setup → pruebas → código → QA → CONVERGE. Pruebas de historias independientes; sin [P] por archivos compartidos. No repetir suites cerradas ajenas. No datos ni deploy. Pictogramas se integrarán únicamente cuando se proporcionen; dependencia externa documentada, sin inventar assets. MVP local verificable, preparación productiva separada.
