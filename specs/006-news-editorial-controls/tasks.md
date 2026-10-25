# Tasks: 006-news-editorial-controls
**Repository**: todosat-frontend. Solo local; otras operaciones no autorizadas.
## Phase 1: Setup
- [x] T001 Leer SPEC global, contrato y plan de specs/006-news-editorial-controls/; verificar gobernanza.
## Phase 2: Historias locales
- [x] T002 [US1] Probar selección estricta, orden, límites y duplicados en tests/editorial-news/news.test.mjs.
- [x] T003 [US1] Conectar selector en src/lib/news-home.ts y src/pages/index.astro; consulta published en src/lib/content.ts y título HomeArticlesSection.astro.
- [x] T004 [US3] Preparar redirects condicionados y pruebas en scripts/news-category-redirects.mjs, scripts/postbuild.mjs y tests/editorial-news/redirects.test.mjs.
- [x] T005 [US1] Build aislado e inspección noticias/recomendados/rutas en tests/editorial-news/build.mjs.
## Phase 3: QA y CONVERGE
- [x] T006 Registrar evidencias, pareja SHA/diff y revisión CONVERGE en specs/006-news-editorial-controls/qa.md.
## Dependencias / estrategia
Setup → pruebas → código → QA → CONVERGE. Pruebas de historias independientes; sin [P] por archivos compartidos. No repetir suites cerradas ajenas. No datos ni deploy. Pictogramas se integrarán únicamente cuando se proporcionen; dependencia externa documentada, sin inventar assets. MVP local verificable, preparación productiva separada.
