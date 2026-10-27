# Tasks: Noticias destacadas y noticias generales
**Implementation repository**: todosat-frontend (frontend-only). Paths relativos al repo.
**Input**: spec.md, plan.md, data-model.md, research.md, contracts/home-news.md, quickstart.md.
**Estado**: 14/14 completadas; QA local y T012 aprobados por el propietario el 2026-10-27. Sin commits ni publicación.
**QA evidence**: en qa.md registrar SHA exacto y huellas del diff validado, aislamiento, resultados y límites reales; preservar 008 sin incluir su trabajo en esta feature.

## Phase 1: Setup
- [x] T001 Registrar base Git, inventario del diff y hashes de preservación de Feature 008 y bloques ajenos en specs/009-home-news-sections/qa.md; guardar referencia del markup original de CTA y del bloque Recomendados para comparaciones locales, sin leer .env ni datos reales (FR-005–FR-008, SC-004).

## Phase 2: Foundational
- [x] T002 Preparar tests/home-news-sections/build.mjs reutilizando el patrón de harness existente sin editarlo: copia temporal sin .env, dependencias ya instaladas, fixtures ficticios, salida de red denegada y limpieza de temporales; conservar todos los archivos de 006/008 y no instalar dependencias (FR-007, FR-008, SC-004).

## Phase 3: US1 — Selección editorial y actualidad (P1)
**Goal**: resultados 4/7 independientes del orden de entrada y sin duplicados.
**Independent Test**: selector puro con entradas ficticias; no necesita render ni backend.
- [x] T003 [US1] Escribir y comprobar RED antes del selector en tests/home-news-sections/news.test.mjs: 0/1/4/>4 destacadas, generales 0/1/6/7/>7, quinta destacada elegible, exclusión solo de las mostradas, inactivos, sin mutación de entrada; entrada contractual exclusivamente publicada (FR-001–FR-003, SC-001).
- [x] T004 [US1] Ampliar tests/home-news-sections/news.test.mjs antes de implementar con duplicados, permutaciones y empates: «documentId no vacío; fallback id no nulo; fallback slug no vacío»; «Documento sin identidad utilizable no produce tarjeta» con diagnóstico no sensible; «fecha_publicacion si presente, en otro caso publishedAt; inválida => valor inferior a cualquier fecha válida»; «Orden descendente por fecha, ascendente ordinal por clave canónica»; misma identidad/fecha desempata por slug y luego id ordinal; duplicados idénticos equivalentes (FR-003, SC-003).
- [x] T005 [US1] Añadir selectHomeNews en src/lib/news-home.ts conforme a data-model.md: filtrar «activo===true», ordenar y deduplicar antes de límites; featured primeras cuatro «destacado===true», recent primeras siete excluyendo solo identidades de featured; no mutar entrada ni cruzar colección Destacados; conservar export histórico selectFeaturedNews sin cambios (FR-001–FR-003, FR-008).
- [x] T006 [US1] Ejecutar únicamente tests/home-news-sections/news.test.mjs y registrar resultados en specs/009-home-news-sections/qa.md, incluidos límites y empates permutados; corregir solo selector nuevo ante defectos (SC-001, SC-003).

## Phase 4: US2 — Continuidad de la Home (P1)
**Goal**: dos secciones de noticias conservando CTA original y todos los demás bloques.
**Independent Test**: fixtures de presentación con recomendaciones mixtas y noticias; comparar orden, markup original y bloques ajenos.
- [x] T007 [US2] Escribir tests/home-news-sections/markup.test.mjs y comprobar RED del contrato nuevo antes de modificar componentes: título/CTA parametrizables, CTA original literal y href=/noticias único; getDestacados y HomeFeaturedSection con import/consulta/posición/condición/separador originales; ninguna edición de ArticleCard, Layout, Footer ni otros bloques (FR-004–FR-008, SC-002, SC-004).
- [x] T008 [US2] Parametrizar exclusivamente title y showArchiveCard en src/components/HomeArticlesSection.astro con defaults compatibles; envolver la CTA existente sin copiarla ni alterar texto, clases, enlace o comportamiento; conservar ArticleCard y diseño actual (FR-004, FR-006).
- [x] T009 [US2] Conectar selectHomeNews y las dos instancias en src/pages/index.astro: Operadores → Recomendados → Noticias destacadas → Noticias → Hardware → Manuales; featured condicional y sin CTA, recent siempre con CTA; no tocar hero/búsqueda, getDestacados/HomeFeaturedSection ni su separador; solo separadores propios de noticias (FR-001, FR-002, FR-004–FR-006).
- [x] T010 [US2] Completar aserciones HTML en tests/home-news-sections/build.mjs para fixtures 0/1/4/>4 destacadas y generales escasas/vacías: límites y orden final, una CTA en recent después de noticias, sin hueco/separador de featured vacía; Recomendados conserva noticias/operadores/hardware/manuales, enlaces y orden, incluso si recomienda una noticia también mostrada en noticias; ausencia de borradores por consulta published existente y preservación de archivo/búsqueda (FR-001–FR-008, SC-001, SC-002, SC-004).
- [x] T011 [US2] Ejecutar tests/home-news-sections/markup.test.mjs y build.mjs aislado; registrar en specs/009-home-news-sections/qa.md resultados del HTML y comparación acotada de bloques/CTA frente a referencia T001, sin QA general de features cerradas (SC-002, SC-004).

## Phase 5: Polish & Cross-Cutting
- [x] T012 Revisar localmente presentación final de las dos secciones con fixtures de tests/home-news-sections/build.mjs a 320/768/1440 px: CTA única, orden, tarjetas escasas sin placeholders y ausencia de solapamientos; registrar evidencia real o limitación en specs/009-home-news-sections/qa.md. Si precisa servidor, solo loopback; no navegador ni build contra producción (FR-004, FR-006, SC-002).
- [x] T013 Comparar diff final y hashes T001 de archivos ajenos/008, comprobar ausencia de cambios de backend/datos/dependencias y ejecutar git diff --check; documentar en specs/009-home-news-sections/qa.md sin modificar los archivos protegidos ni repetir suites de 006/008 (FR-005–FR-008, SC-004).
- [x] T014 Actualizar specs/009-home-news-sections/tasks.md y qa.md solo con tareas realmente acreditadas, identificar revisión/diff y pendientes; detenerse tras QA local, sin CONVERGE, commit, push ni deploy (FR-008, SC-001–SC-004).

## Dependencies & Execution Order
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014.
US1 tiene validación independiente del render; US2 integra US1 y valida presentación con fixtures. No marcar US2 terminada antes de la integración. No instalar herramientas si una comprobación visual no está disponible: registrar pendiente, no inventar PASS.

## Parallel examples
US1: T003/T004 comparten archivo; secuenciales. US2: T008 y T009 podrían editar archivos distintos pero se mantiene orden porque index consume la interfaz de T008. Ninguna tarea marcada [P]; no compensa paralelizar este alcance pequeño.

## Implementation Strategy
MVP técnico: selector US1 acreditado antes de la integración. Entrega local completa requiere US2 y revisión final. Tests RED/GREEN dirigidos, un harness aislado con matriz necesaria y revisión visual limitada a la corrección. No repetir suites históricas ni cambiar sus expectativas: 009 valida el nuevo comportamiento Home, 006 permanece como evidencia histórica. Autorización propuesta: ejecutar T001–T014 exclusivamente en frontend y sus tres archivos de producto previstos, pruebas nuevas y SDD 009, con datos ficticios; sin autorización productiva implícita.
