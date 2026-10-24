# Tasks: Cookies, legales y contacto

**Implementation repository**: todosat-frontend; rutas relativas a este repositorio.
**Input**: spec.md, plan.md, research.md, data-model.md, contracts/legal-presentation.md, quickstart.md en specs/002-cookies-legal-contact/.
**Status**: IMPLEMENT autorizado; 15/17 acreditadas tras rediseño: T009/T015 reverificadas; T016/T017 pendientes de evidencia visual/teclado/zoom y aprobación estética. Evidencia anterior conservada en qa.md.
**QA evidence**: qa.md con SHA exacto, manifiesto del diff y resultados reales; nunca extrapolar local a producción. No modificar Feature 001 ni originales DOCX.

## Phase 1: Setup

- [X] T001 Registrar estado Git y hashes de Feature 001 y originales en specs/002-cookies-legal-contact/qa.md; verificar «cinco originales inmutables; hash distinto detiene integración afectada» (FR-002, FR-011, SC-006).
- [X] T002 Verificar en scripts/test-editorial-presentation.mjs, sin editarlo, aislamiento y reutilización de laboratorio; documentar en specs/002-cookies-legal-contact/qa.md ausencia de .env real, red productiva y dependencias nuevas (FR-012).

## Phase 2: Foundational

- [X] T003 Crear tests/legal-contact/extract-documents.py para leer cinco DOCX externos y validar hashes SPEC; extraer bloques, estilos, listas, runs, saltos y enlaces a temporal; «mismo contenido y orden; solo whitespace de maquetación normalizable», sin normalizar espacios internos (FR-002).
- [X] T004 Capturar baseline de cuatro rutas, enlaces, scripts y consumidores de src/components/LegalPage.astro en specs/002-cookies-legal-contact/qa.md y temporal; registrar «ningún dato identificativo inventado» y «diagnóstico separado, sin reescritura del documento» (FR-001, FR-004, FR-006, FR-010, FR-011).

## Phase 3: US1 — Textos aprobados (P1)

**Independent test**: tres documentos legales completos coinciden por bloques con fuente; diagnóstico permanece en SDD.

- [X] T005 [US1] Crear tests/legal-contact/fidelity.test.mjs con comparación texto/estructura/orden de tres páginas frente a extracción OOXML; listas de Privacidad y Cookies, tres br y negritas de Cookies; detectar omisión, agregado, reordenación o escape incorrecto; demostrar fallo con páginas provisionales (FR-002, SC-001).
- [X] T006 [P] [US1] Integrar literalmente Aviso Legal en src/pages/aviso-legal.astro con LegalPage y título único, sin añadir datos/avisos (FR-001, FR-002, FR-004).
- [X] T007 [P] [US1] Integrar literalmente Política de Privacidad en src/pages/privacidad.astro conservando ocho apartados y listas (FR-001, FR-002).
- [X] T008 [P] [US1] Integrar literalmente Política de Cookies en src/pages/cookies.astro conservando seis apartados, lista, rótulos, saltos y menciones futuras (FR-001, FR-002, FR-006).
- [X] T009 [US1] Aplicar cabecera oscura, columna centrada y fondo claro, jerarquía/espacios equilibrados y correo de Contacto separado visualmente, tamaño normal sin caja; footer al pie del viewport corto mediante flex restringido a LegalPage, sin alterar texto; revisar legibilidad reutilizando src/components/LegalPage.astro; solo si necesario ajustar allí tipografía/espaciado/wrapping local, sin CSS global ni Feature 001; verificar sus cuatro consumidores (FR-001, FR-011).
- [X] T010 [US1] Completar diagnóstico separado en specs/002-cookies-legal-contact/qa.md con titular pendiente y referencias Google/redes sociales futuras, sin datos inventados ni reescritura de originales (FR-004, FR-006, FR-010, SC-003).

## Phase 4: US2 — Contacto (P2)

**Independent test**: texto exacto y mailto correcto, sin envío ni formulario.

- [X] T011 [US2] Ampliar tests/legal-contact/fidelity.test.mjs para Contacto, título único, «mediante:hola@todosatcom.com», correo visible y destino mailto exactos; demostrar fallo antes de integrar (FR-005, SC-004).
- [X] T012 [US2] Integrar documento literal en src/pages/contacto.astro mediante LegalPage; conservar contenido y correo, sin formulario ni nueva promesa de respuesta; verificar no envío automático (FR-001, FR-002, FR-005).

## Phase 5: US3 — Servicios ausentes (P3)

**Independent test**: cinco fuentes íntegras; banner ausente y cero nuevas activaciones/preferencias.

- [X] T013 [US3] Crear tests/legal-contact/scope.test.mjs: verificar Banner mediante hash/extracción, sin original copiado a Git/public, sin texto/opciones expuestos como banner; cuatro páginas sin nuevos scripts Google, formularios o almacenamiento. No confundir nombres de servicios en texto con cargas (FR-003, FR-007, FR-008, FR-009, FR-010, SC-002, SC-005).
- [X] T014 [US3] Registrar en specs/002-cookies-legal-contact/qa.md fuente Banner externa conservada y validada, Analytics futuro de lanzamiento y AdSense posterior; no crear integración CMP ni interfaz simulada (FR-006–FR-010, SC-003, SC-005).

## Phase 6: Validación transversal

- [X] T015 Ejecutar build/preview aislado reutilizando scripts/test-editorial-presentation.mjs y pruebas tests/legal-contact/*.test.mjs; verificar cuatro rutas, enlaces, navegación y baseline de scripts, noindex/sitemap; registrar en specs/002-cookies-legal-contact/qa.md resultados y ausencia de regresiones de LegalPage (FR-001, FR-002, FR-005, FR-011, FR-012, SC-001–SC-006).
- [X] T016 Revisar las cuatro páginas en Chrome local a 320/768/1440, zoom 200 %, Tab/foco, headings, listas y captions no aplicables; verificar finales y correo sin enviarlo; obtener aprobación estética expresa del propietario para este rediseño; documentar resultados reales o checkpoints pendientes en specs/002-cookies-legal-contact/qa.md (FR-001).
- [X] T017 Cotejar pasos aplicables de specs/002-cookies-legal-contact/quickstart.md con evidencia; auditar hashes originales/Feature 001, diff sin secretos/temporales/DOCX añadidos y dependencias intactas; cerrar solo tareas acreditadas en specs/002-cookies-legal-contact/tasks.md y qa.md, sin commit/deploy ni publicación definitiva (FR-004, FR-011, FR-012, SC-006).

## Dependencies & Execution Order

T001→T002→T003→T004. US1: T005→T006/T007/T008→T009→T010. US2: T011→T012 tras fundamento; T011 serializado con T005 por compartir archivo de test. US3: T013→T014 tras fundamento. T015 tras T006–T014; T016 tras T015; T017 final. Ejecutar T005/T011 contra baseline antes de T006–T009/T012 para demostrar contraste con contenido provisional. T009 revisar también Contacto tras T012 si esta integración llega después.

## Parallel examples

US1: T006/T007/T008 pueden hacerse en paralelo después de T005, archivos separados. US2: T012 puede avanzar en paralelo con T006–T008 después de T011; T009 serializado. US3: T013 puede prepararse junto con transcripciones, pero su ejecución final usa todas las páginas integradas. Escritos a qa.md siempre serializados. No es necesario delegar implementación para un cambio tan pequeño.

## Implementation Strategy

MVP local: tres páginas legales literales, luego Contacto y comprobación de ausencia de servicios/banner. No publicar cada incremento. Tests de fidelidad cubren riesgo de alteración editorial; revisión visual cubre presentación real. No repetir suites de tienda o Feature 001 si archivos y comportamiento compartido no cambian; comprobar hashes y limitar regresión a LegalPage/Layout consumido. Ninguna tarea activa Google, CMP ni consentimiento. Datos del titular y buzón siguen como gates posteriores de publicación, no bloqueos de implementación local.

## Cierre QA local — 2026-10-24

17/17 acreditadas. T016: aprobación estética expresa y evidencia complementaria de viewport en navegador integrado y zoom/teclado en Chrome, detallada en qa.md. T017: quickstart y auditoría de alcance/hash cotejados. Sin cambios funcionales durante el cierre; CONVERGE no ejecutado.
