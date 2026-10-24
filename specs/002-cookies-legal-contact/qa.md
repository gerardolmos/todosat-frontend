# QA — 002-cookies-legal-contact

Fecha 2026-10-24. Estado: **QA local PASS, 17/17 tareas acreditadas**. Sin CONVERGE.
Frontend base 6122e407b64e34864bda222aa9946a70fb296ce9. Constitution 2.0.0 sin cambios. No commits, pushes, deploys, acceso a producción ni dependencias instaladas.

## Cierre final de QA — 2026-10-24

El propietario aprueba expresamente el diseño final, incluidos footer y correo de Contacto. Esta es aprobación estética general; no se le atribuyen pruebas específicas de tamaños, zoom, teclado o fidelidad. Este cierre sustituye los estados pendientes históricos que se conservan más abajo.

Se aplica la validación final de la skill local speckit-implement. Checklist SPECIFY 16/16; sin hooks before/after_implement configurados. ANALYZE PASS anterior sigue vigente: no han cambiado requisitos, diseño ni código en este cierre.

### Evidencia recuperada y comprobaciones pendientes completadas

- Conservadas las pruebas acreditadas: suite 10/10 PASS y, tras la corrección CSS final, fidelidad 4/4 PASS. No se repiten suites, extracción DOCX ni pruebas ajenas. Las ocho huellas del manifiesto funcional/pruebas de Feature 002 siguen coincidiendo.
- La pestaña integrada conservaba Contacto ya cargado, pero el servidor y el directorio temporal anterior habían desaparecido. Se reconstruyó exclusivamente el artefacto necesario para continuar QA con el harness existente: `node scripts/test-editorial-presentation.mjs --build`, exit 0, 32 páginas. Nuevo laboratorio `todosat-editorial-72LpGy` bajo TMPDIR. Se conserva el bloqueo de red externa y lectura de .env del harness; servidor estático bajo su isolation.sb, env limpio, solo 127.0.0.1:14379. Esta reconstrucción no repite las suites acreditadas ni cambia fuentes.
- **Adaptable**: se recupera la matriz DOM previa de las doce combinaciones 320/768/1440 sin overflow y las capturas completas ya inspeccionadas a 320 y de Aviso/Contacto a 1440. Se completa ahora la inspección visual de las cuatro páginas a 768 y de Privacidad/Cookies a 1440, incluidos finales, listas, encabezados y correo. Capturas completas del navegador integrado sin recortes ni solapamientos observados. La pestaña nueva empezó a 1280: esas primeras capturas no se cuentan como 768; se fijó el viewport y se confirmó innerWidth=768 antes de las capturas válidas. Para escritorio se confirmó innerWidth=1440.
- **Zoom y teclado**: Chrome real, nueva pestaña exclusiva del laboratorio; menú confirma «Zoom: 200 %». En Contacto se inspeccionan cuerpo completo, correo y transición al footer. Tab/Shift+Tab alcanza el correo con contorno azul visible y permite salir a enlaces del footer. En Aviso se observan inicio y final 5–6, correo final enfocado y salida al footer. En Cookies se acredita específicamente el último párrafo/correo completo, foco y salida al footer. En Privacidad se observan inicio/lista y tramo 5–7, segundo correo enfocado y salida al footer. No se activan mailto ni se envía correo. La revisión al 200 % es una comprobación representativa de reflujo y foco, complementada por capturas completas a los tamaños previstos; no se presenta como auditoría exhaustiva WCAG de cada combinación de zoom/tamaño/párrafo. Zoom restaurado al terminar.
- El navegador integrado también acredita Tab desde logo/menú al correo de Contacto y salida a Operadores del footer; foco visible en captura. Privacidad: Tab alcanza segundo correo y sale al footer. Estas evidencias sustituyen el timeout de teclado registrado en sesiones anteriores.
- **Footer**: se conserva la medición ya acreditada de Contacto corto (1440×1600, footer.bottom=1600) y las tres páginas largas con footer estático después del main. Las nuevas capturas de páginas largas confirman continuidad sin superposición. Comprobación puntual de Privacidad a 1440: footer.bottom absoluto=3072.15625, body/doc scrollHeight=3072, position=static; diferencia subpíxel, sin espacio bajo el footer. No se modificó el layout compartido: el selector body:has(> .legal-page) solo aplica a sus cuatro consumidores.

### Auditoría y cierre de tareas

T016 **PASS**: aprobación estética expresa y comprobaciones proporcionales anteriores completadas mediante Chrome y navegador integrado, con alcance real descrito. T017 **PASS**: pasos del quickstart cotejados con evidencias conservadas y nuevas; originales respaldados por hashes/fidelidad ya acreditados, 15/15 huellas Feature 001 y 8/8 de Feature 002 coincidentes. Constitution conserva SHA-256 `496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7`.

Git: main, HEAD `6122e407b64e34864bda222aa9946a70fb296ce9`; cinco archivos funcionales modificados y doce nuevos de SDD/pruebas de Feature 002. Ningún staged, DOCX, captura, log, credencial ni temporal incorporado. Layout/Header/Footer, tienda, panel de operadores, dependencias y Feature 001 sin cambios. git diff --check PASS. En este cierre se editan únicamente qa.md y tasks.md.

**Resultado: QA local PASS, 17/17. Se cumplen condiciones para solicitar CONVERGE; no se ejecuta.** No quedan checkpoints locales bloqueantes. Se mantienen los pendientes de publicación definitiva del diagnóstico separado (titular, buzón y servicios reales); este cierre no acredita cumplimiento jurídico ni actividad productiva. Sin producción, Strapi, instalaciones, commits, pushes ni despliegues.

Vista previa restaurada: http://127.0.0.1:14379/contacto/; servidor local mantenido activo. Las capturas de esta revisión constan en la conversación; no se incorporan archivos temporales al repositorio.

## Corrección vigente — footer y correo (2026-10-24)

La revisión estética previa fue rechazada por estos dos defectos. SPEC FR-001/FR-005, PLAN, contrato y T009 ajustados únicamente para corregirlos. ANALYZE de solo lectura previo a código: PASS, sin contradicciones constitucionales, mismos 12 FR/6 SC cubiertos por 17 tareas. Las descripciones de caja azul, tamaño aumentado y eliminación de altura mínima en secciones posteriores son históricas y quedan sustituidas por esta corrección.

Inspección de Layout: body ya contiene Header, slot y Footer como hermanos. Sin modificar ese archivo ni Header/Footer, LegalPage restringe `body:has(> .legal-page)` a flex columna con min-height 100vh/100svh y main flexible. Footer estático en flujo normal, sin fixed/absolute/sticky. Solo coinciden las cuatro rutas legales. Correo de Contacto conserva strong, palabras, mailto, separación y foco; eliminados padding/borde/fondo decorativos y tamaño aumentado, heredando 16px del párrafo.

Evidencias del navegador integrado sobre build final `todosat-editorial-4YjknT`:
- Contacto a 1440×1600: body=1600, footer.bottom=1600, footer.top=main.bottom=1237.5, position=static, overflow=false. Captura completa inspeccionada; no espacio blanco bajo footer.
- Aviso Legal, Privacidad y Cookies: footer.top >= main.bottom, position=static y overflow=false en las tres rutas largas. Sin superposición ni footer adelantado.
- Contacto a 320×800: overflow=false, correo=16px y footer después del contenido. Captura móvil inspeccionada.
- Correo: fontSize=16px igual al párrafo; contenedor transparente y border=0px. Regla de foco visible anterior intacta; no se afirma nuevo recorrido de teclado completo.

Pruebas selectivas: build aislado del harness existente, 32 páginas PASS exit 0; `node --test tests/legal-contact/fidelity.test.mjs` con LEGAL_QA_SOURCE y LEGAL_QA_DIST del laboratorio: **4/4 PASS**, hashes originales incluidos. No repetir suite completa de servicios ni Feature 001 por cambio exclusivo de CSS; hashes Feature 001 verificados y Layout/Header/Footer/dependencias sin modificaciones. `git diff --check` PASS.

Vista previa actualizada en **http://127.0.0.1:14379/contacto/** (misma URL, nuevo build), servidor loopback con sandbox sin red externa ni lectura .env. Captura /private/tmp/todosat-contacto-corregido.png fuera de Git. Servidor anterior de esta URL reemplazado por el nuevo; 14378 sigue siendo antiguo.

Estado: **15/17**, T016/T017 abiertas para aprobación humana y QA restante ya identificado. No CONVERGE. En esta corrección solo cambia funcionalmente LegalPage.astro, además de los artefactos SDD indicados; no textos, Feature 001, tienda, producción, backend, dependencias, commits, pushes ni deploys.

## Estado vigente tras rediseño visual — 2026-10-24

La aprobación previa del propietario corresponde a lectura/función, **no a estética**. La presentación anterior NO fue aprobada estéticamente. Dirección nueva autorizada en SPEC; aprobación del resultado nuevo pendiente. Las observaciones de navegador de sesiones anteriores se conservan como históricas, no acreditan el rediseño.

### SDD y ANALYZE

SPEC FR-001/FR-005, SC-001 y escenario visual actualizados; PLAN y contrato ajustados sin cambiar arquitectura ni datos; T009/T015 reabiertas y posteriormente reverificadas, sin añadir tareas a las 17. ANALYZE de solo lectura ejecutado antes de implementar: **PASS**. Cobertura de 12 FR y 6 SC: 100 %. Cero contradicciones constitucionales, requisitos sin tarea, tareas sin requisito o hallazgos críticos. Mapeo: FR-001→T004/T006–T009/T012/T015/T016; FR-002→T003/T005–T008/T011/T012/T015; FR-003/007/008/009→T013/T014; FR-004/006/010→T004/T010/T014/T017; FR-005→T011/T012/T015/T016; FR-011/012→T001/T002/T009/T015/T017. SC-001→T005/T011/T015/T016; SC-002/005→T013; SC-003→T010/T014; SC-004→T011/T012; SC-006→T001/T017. Sin hooks configurados. SPECIFY/CLARIFY: 16/16, sin preguntas imprescindibles nuevas.

### Implementación

Solo LegalPage.astro y el atributo contact de contacto.astro cambian en esta iteración funcional. Cabecera slate oscura con borde sky, título adaptable, fondo slate claro y tarjeta blanca en columna máxima 48rem; jerarquía y separadores de apartados, espaciado adaptable, enlaces subrayados y foco de 3px. Eliminada altura mínima artificial de pantalla. Correo de Contacto separado mediante display:block en su strong original, con fondo suave y mayor tamaño. Texto DOM, orden, párrafo y negrita permanecen idénticos. No se añade contenido, iconos, scripts ni dependencias.

### Pruebas de esta revisión

- Harness existente sin cambios `node scripts/test-editorial-presentation.mjs --build`: build aislado 32 páginas PASS, exit 0. Se repitió una vez tras observar a 320 que la última letra del correo de Cookies quedaba sola: enlaces inline-block con max-width:100% evitan ese corte cuando el correo cabe completo. No se cambió texto. Build final `todosat-editorial-M4QAhW`.
- Suite `LEGAL_QA_SOURCE=/private/tmp/todosat-legal-qa LEGAL_QA_DIST=<lab-final>/dist LEGAL_QA_BASELINE=<lab-base>/dist node --test tests/legal-contact/*.test.mjs`: **10/10 PASS, exit 0**, también tras el último ajuste. Fidelidad completa de cuatro DOCX, hashes de cinco originales, listas, negritas, br y mailto; navegación/Header/Footer/scripts sin cambios, ausencia de nuevas activaciones/banner/almacenamiento, sitemap conservado.
- Feature 001: sus 15 hashes conservados y verificados. `git diff --check`: PASS. Sin cambios en dependencias ni archivos fuera del alcance. No se ejecutan suites editoriales o de tienda ajenas.
- Chrome no permitió mantener control por intervención del usuario; no se insistió. El navegador integrado de Codex sí cargó el laboratorio y permitió revisión real sin tocar protecciones.
- Matriz DOM real de cuatro rutas a **320/768/1440**: doce combinaciones sin overflow horizontal, un h1 y mailto correcto; columna máxima observada 768px. La primera lectura de Aviso Legal al cambiar a 1440 todavía midió 768px; se repitió únicamente esa lectura y quedó acreditada a 1440.
- Capturas completas inspeccionadas: Aviso Legal, Privacidad y Cookies a 320 (antes del ajuste exclusivamente de inline-block); Contacto móvil; Aviso Legal y Contacto completos a 1440 en build final. Se observan encabezados, listas, párrafos y finales sin recortes ni solapamientos. No confundir medición DOM con inspección visual completa de las doce combinaciones.
- Teclado en navegador integrado: primer Tab llega al logo; continuación falló por timeout de la acción. No se acredita recorrido completo ni foco del nuevo diseño con teclado. Zoom real 200% del rediseño pendiente; la evidencia del diseño anterior no se reutiliza para afirmarlo.

### Pendientes y entrega para aprobación

**15/17 tareas. T016 y T017 abiertas.** Pendiente aprobación estética del propietario, recorrido completo de teclado/foco y zoom real 200% del nuevo diseño, y completar revisión visual a 768 y restantes vistas de escritorio. Sin bloqueo funcional ni de fidelidad detectado. No CONVERGE hasta disponer de evidencia y aprobación suficientes.

Vista previa final aislada: **http://127.0.0.1:14379/contacto/**; rutas /aviso-legal/, /privacidad/, /cookies/. Servidor estático del dist, vinculado solo a loopback y bajo isolation.sb del harness (red externa/.env bloqueados). Proceso de preview de esta sesión activo; no se cerró el laboratorio previo de 14378, que muestra el diseño antiguo. Captura de Contacto nueva en /private/tmp/todosat-contacto-redesign.png, fuera de Git. No hay datos productivos ni conexiones a backend.

Archivos SDD actualizados: spec.md, plan.md, contracts/legal-presentation.md, tasks.md, qa.md. Tests sin cambios. HEAD y alcance acumulado siguen siendo los de Feature 002. Sin commits, pushes, deploys, instalaciones, producción o CONVERGE.

## Implementación y fidelidad

Cuatro rutas integradas: /aviso-legal/, /privacidad/, /cookies/, /contacto/. Texto extraído de los originales identificados por hash SPEC, convertido a HTML estático, sin runtime DOCX. Conservados caracteres, signos, espacios interiores, títulos, seis/ocho/seis apartados, listas, negritas y tres saltos explícitos de Cookies. Se omite únicamente el párrafo vacío final de maquetación de cada DOCX. Bookmarks OOXML internos no visibles no se convierten en texto. Todos los correos mantienen etiqueta literal y mailto autorizado; incluido «mediante:hola@todosatcom.com» sin espacio añadido.

LegalPage ajustado localmente por necesidad de legibilidad: título adaptable, espaciado de apartados/párrafos, viñetas, wrapping y foco visible/subrayado de enlaces. No se modifica Layout, Footer, CSS global ni componentes de Feature 001. Originales externos intactos; Banner intacto, sin copia pública ni UI operativa. Diagnóstico separado de los textos, sin advertencias añadidas al contenido legal.

## Pruebas ejecutadas

- `python3 tests/legal-contact/extract-documents.py --output /private/tmp/todosat-legal-qa`: cinco hashes originales PASS; extracción OOXML con biblioteca estándar. El primer intento detectó bookmarks internos y se añadió tratamiento explícito sin pérdida de texto; no se ignoraron elementos desconocidos silenciosamente.
- Baseline aislado `node scripts/test-editorial-presentation.mjs --build`: 32 páginas, exit 0. Cuatro pruebas de fidelidad fallaron por contenido provisional, antes de integrar (exit 1, esperado).
- Preview final `node scripts/test-editorial-presentation.mjs --preview`: build 32 páginas PASS; reutiliza harness Feature 001 sin editarlo. Sandbox propio deniega tráfico externo y .env, con sonda obligatoria de bloqueo. No postbuild ni configuración productiva.
- `LEGAL_QA_SOURCE=/private/tmp/todosat-legal-qa LEGAL_QA_DIST=<lab-final>/dist LEGAL_QA_BASELINE=<lab-base>/dist node --test tests/legal-contact/*.test.mjs`: **10/10 PASS, exit 0**. Cuatro cotejos de bloques/caracteres/negritas/br/listas/mailto; cuatro comparaciones de scripts/Header/Footer y ausencia de formularios/almacenamiento/URLs Google; Banner fuente/no publicado/no DOCX en Git; sitemap conserva exclusión de cuatro rutas. Pruebas no equivalen a auditoría productiva.

Baseline: todosat-editorial-cneEMt. Final: todosat-editorial-qYlRAi, bajo TMPDIR del usuario; puntero /private/tmp/todosat-editorial-latest.txt. Preview loopback http://127.0.0.1:14378/ activo al finalizar. Datos restantes del portal ficticios. Documento diagnóstico qa-legal.html exclusivamente en dist temporal, no en repositorio.

## Navegador real y límites — primera sesión (histórico)

Chrome/CUA: página diagnóstica temporal carga las cuatro rutas en iframes con anchos CSS exactos. A 320, 768 y 1440, las doce mediciones devuelven overflow=false, un h1 y mailto correctos. Revisión visual simultánea de principios de los cuatro documentos a 320: texto negro sobre blanco legible, headings, lista de Privacidad y rótulo/salto de Cookies visibles; Contacto completo visible. No se infiere revisión completa de los finales de documentos largos.

Contacto: Tab recorrió logo/menú hasta correo; foco visible negro comprobado en captura, destino mailto correcto, sin activarlo. No se acredita recorrido de todos los enlaces de las otras tres páginas. Intento de zoom con atajo abrió diálogo de ortografía en lugar de ampliar; cerrado con Escape. **Zoom 200 % no acreditado**. No modificar protecciones ni afirmar PASS por presencia de CSS.

T016 pendiente: revisión visual completa de las cuatro páginas (incluidos finales) a tamaños previstos, zoom 200 % y recorrido de teclado restante. T017: auditoría realizada, pero cierre del quickstart condicionado a T016. No bloqueo de fidelidad ni defecto funcional observado; necesaria comprobación manual agrupada de estos puntos para cerrar.

## Reanudación de QA local — 2026-10-24

El propietario comunica que ha revisado la vista previa y que la presentación es correcta. Se registra como aprobación visual general: no se le atribuyen anchos, zoom, teclado ni revisión exhaustiva de finales concretos.

Las observaciones siguientes proceden de Chrome controlado mediante CUA y de sus capturas/árbol de accesibilidad en esta conversación, incluidas las acciones anteriores a la interrupción; no se habían guardado en este archivo. Sustituyen únicamente los pendientes expresamente acreditados de la primera sesión:

- **Zoom real 200 % acreditado** mediante menú de Chrome: incremento desde 100 %, indicador accesible «Zoom: 200 %». No inferido de un atajo ni de CSS. Se mantuvo en las tres rutas largas observadas; no se cambió ninguna protección del navegador.
- **Privacidad**: revisión desde título y primeras listas hasta apartados centrales 2–6 y cierre 7–8, con desplazamiento real al 200 %. Párrafos, listas y encabezados legibles, sin recortes horizontales ni solapamientos observados. Tab alcanza los dos correos; foco negro visible en el segundo, destino mailto correcto, sin activación/envío.
- **Aviso Legal**: inicio, tramo central 2–4 y final 5–6 observados al 200 %. Ambos correos alcanzados mediante Tab, con contorno visible; Tab posterior sale hacia navegación del footer sin activar enlaces. Texto y último correo completos, sin solapamiento observado.
- **Cookies**: inicio y rótulo de cookies necesarias, tramo de análisis/publicidad/terceros y apartados 4–6 observados al 200 %. Rótulos, negritas, párrafos y lista legibles; ningún control ficticio de consentimiento. La captura alcanza el párrafo de Actualizaciones, pero no acredita el último correo ni el recorrido completo de teclado hasta el footer.
- **Adaptable**: conservadas las doce mediciones ya acreditadas a 320/768/1440 (sin overflow, un h1 y enlaces esperados). Captura a 320 de los cuatro comienzos y cuerpo de Contacto legibles. No se convierten estas mediciones en revisión visual exhaustiva de todos los documentos a los tres tamaños.

**Interrupción concreta de navegador:** al intentar el recorrido Tab pendiente de Cookies, CUA devolvió «The user changed '/Applications/Google Chrome.app'. Re-query the latest state ...». Una consulta de estado confirmó que Chrome estaba en otra pestaña ajena al laboratorio. Se detuvieron las acciones para no competir con la navegación del propietario; no hubo intentos repetitivos ni pruebas ficticias.

### Checkpoints aún pendientes

1. Cookies: último correo/final completo y recorrido Tab/foco hasta salir al footer.
2. Contacto: revisión específica al 200 %; teclado a ese zoom. Se conserva la evidencia previa de correo/foco a tamaño normal y de contenido completo a 320.
3. Revisión visual restante a 320/768/1440: finales de documentos largos a 320 y presentación completa de las cuatro rutas a 768/1440. Las doce mediciones de overflow ya PASS no necesitan repetirse.

**T016 permanece abierta. T017 permanece abierta por su dependencia de T016**, aunque la auditoría técnica está acreditada. Resultado: QA local parcial, sin defecto funcional observado; no se recomienda todavía iniciar CONVERGE.

### Recuperación y auditoría final de esta sesión

- HEAD frontend permanece `6122e407b64e34864bda222aa9946a70fb296ce9`; mismo diff funcional. Los cinco archivos funcionales del laboratorio son byte a byte idénticos al checkout.
- Revalidados 15 hashes del manifiesto Feature 001 y 8 del manifiesto Feature 002: PASS. Constitution coincide con SHA controlado `496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7`. Checklist 16/16; sin extensions.yml ni hooks pendientes.
- Se mantienen válidas las 10/10 pruebas y el build aislado de 32 páginas: no se repitieron suite ni build, al no cambiar fuentes ni pruebas. Cotejo puntual del HTML conservado de Contacto contra su DOCX: PASS; el extractor revalida los hashes de las cinco fuentes antes del cotejo. Fidelidad completa de las otras tres rutas respaldada por los cotejos anteriores y las fuentes sin cambios.
- `git diff --check`: PASS. Exactamente cinco archivos funcionales modificados y doce nuevos bajo specs/002-cookies-legal-contact y tests/legal-contact; sin staging, dependencias, DOCX, logs o capturas incorporados. En esta sesión únicamente se actualizan qa.md y tasks.md; no código funcional, tienda, panel de operadores ni Feature 001.
- Laboratorio conservado `todosat-editorial-qYlRAi`, servidor existente PID 2198 escuchando únicamente `127.0.0.1:14378`, accesible en Chrome. La primera sonda curl del sandbox no pudo conectarse; un intento de servir el mismo dist dentro del sandbox terminó con puerto ocupado y no dejó servidor nuevo. No se regeneró el build ni se detuvo el servidor existente.
- Sin producción, backend, servicios externos, instalaciones, commits, pushes, despliegues ni CONVERGE. Gates de publicación definitiva siguen separados del cierre local.

## Diagnóstico separado y publicación

Textos originales conservan afirmaciones sobre Google Analytics, AdSense, redes sociales y compartición. No constituyen evidencia de actividad: Analytics futuro de lanzamiento, AdSense mucho más adelante, ninguna integración ni CMP añadida. Banner futuro sin controles ni preferencias. Tienda y sus posibles almacenamientos/formulario preexistentes quedan intactos; no se certifica inactividad productiva.

Pendiente del propietario antes de publicación definitiva: identidad/razón social del titular, domicilio, identificación fiscal y datos registrales/profesionales si aplican; responsable y contactos pertinentes, buzón operativo y comprobación de servicios reales. No inventados ni insertados. No se realizó revisión jurídica ni envío de correo. No bloquean desarrollo local.

## Auditoría de alcance

Solo cinco archivos funcionales modificados: cuatro páginas y LegalPage. Tests nuevos bajo tests/legal-contact; SDD bajo specs/002-cookies-legal-contact. Manifiesto de Feature 001 verificado íntegro, todas sus huellas coinciden; dependencias y Constitution sin diferencias. No nuevas suites de tienda/editorial ejecutadas. Originales verificados contra SHA de SPEC en cada prueba de fidelidad. Sin DOCX copiados ni temporales en staging. QA corresponde a este diff sin commit.

## Manifiesto SHA-256 del diff funcional y pruebas

- `src/components/LegalPage.astro`: `6ac1ef11219a04f4003f04f59d83d15abf6735e07ad0254a98ac5b4e15ed4c21`
- `src/pages/aviso-legal.astro`: `81db585fc140625ff947ed8ebb3aad43eb686a3fe1f93a8bc8b9631eea2c4faf`
- `src/pages/contacto.astro`: `279ac00cd491903262edd98b712e6b64fc62659ca57f6104ea1f48cbf21448b6`
- `src/pages/cookies.astro`: `a0cface2508e3a5540758c078869826633a26335dd45efd38c9597f57ed193c0`
- `src/pages/privacidad.astro`: `7da94790db6d6e33cb14112e8388540de91144ccb918ad70f6c0527bc1b51699`
- `tests/legal-contact/extract-documents.py`: `b4de15573b6c8386edfe2204ecb9353d39ddc503039e72903b66661ecd2f2245`
- `tests/legal-contact/fidelity.test.mjs`: `ce15118749e6fb04e1fdec4604141935c16cb2ab1377d25a2f2081e1080f4100`
- `tests/legal-contact/scope.test.mjs`: `9849ad4b39ddc9c458219c9e39ee17c202b7dfad61fb3edbbf3f2d3ad4ab863f`
