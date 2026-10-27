# QA local — 010-operator-visual-adjustments

Fecha: 2026-10-27. IMPLEMENT y QA local PASS, 10/10 tareas. T008 aprobada manualmente por el propietario; T010 completada. Sin commit, push ni publicación.

## Preflight y trazabilidad

Skill oficial local speckit-implement; checklist 16/16, hooks ausentes, Constitution 2.0.0 idéntica a autoridad y procedencia vigentes. Ignores existentes adecuados; sin cambios de configuración/dependencias.
Base HEAD `eb18708aaa4f50d27bec7d3f4adced5388a7471b`; estado anterior y 252 hashes en baseline.json. Se verificó que el componente Home anterior coincide con esa revisión, por lo que la vista /antes/ usa esa fuente exacta.

Único diff funcional: importación/asignación de frequenciaIcon y clases del logo seleccionado. SHA256 del diff de ambos archivos: `087bf7ea15cbeaa1d09eeb73b775c3bef9c87ada35883193cee0fd19338b14b3`.
- HomeOperatorsSection.astro: `5cdf52fd1c64ab16cf1d56fde3865aa7f60a93a3fef3e88b6011e4785ca69fd2`.
- operadores/[slug]/index.astro: `771c09586b2287693093eab77e6209567a02155bbacf84e3f736947e87c321f0`.

## Evidencia ejecutada

- Prueba previa: 3 PASS, 2 FAIL esperados (icono ausente y medidas anteriores). Tras implementación: 9/9 PASS con `QA010_DIST=<laboratorio>/dist node --test tests/operator-visual-adjustments/presentation.test.mjs`.
- SVG original SHA256 inalterado; importación y renderer común 48 × 48; HTML real con `Ku / Ka &lt;script&gt;`, sin interpretación como script; omisión de bandas vacías/null/ausentes; restantes cinco campos presentes.
- Contrato de clases 330 × 110, margen adicional 35/35, contain y posición izquierda/superior PASS; CSS compilado contiene las reglas esperadas. Esta prueba automatizada por sí sola no acredita geometría visual; la aceptación humana de T008 se registra abajo.
- Todo el componente Home excepto el tag del logo seleccionado es idéntico a la base: minitarjetas, contenido, métricas, botón, scripts y estilos ajenos preservados.
- Ejecución del script real de selección en VM con DOM simulado: logo presente → ausente → presente sin dimensiones, PASS. No se atribuye esta prueba a interacción real mediante teclado.
- Imágenes optimizadas reales de fixtures panorámico/cuadrado/vertical conservan proporción natural y canal alpha con píxeles transparentes, PASS. Aspecto visual aprobado posteriormente por el propietario en T008.
- Render/compilación mínima aislada de 8 rutas (Home actual/anterior y seis fichas ficticias), PASS. Sin build general, postbuild, servicios o datos reales. Configuración temporal, .env excluido, entorno ficticio, guardas net/http/https/tls y fetch limitado a respuestas sintéticas; sonda de bloqueo de sockets PASS.
- Dos intentos iniciales del harness fallaron por validación de URL de imagen: Response sintética sin URL final; corregido únicamente el simulador. El render posterior pasa; ningún cambio adicional de producto motivado por esos fallos.
- Preservación final: 250 archivos preexistentes ajenos a los dos archivos permitidos, incluidas Features 008/009 y SVG, idénticos byte a byte. `git diff --check`: PASS.

## Revisión manual — T008 PASS

Servidor Python PID 1690, sesión 32353, solo 127.0.0.1:14390. El sandbox denegó bind; apertura local autorizada mediante elevación. Datos ficticios; CSP de la muestra bloquea conexiones y recursos externos. No navegador automatizado.

- Actual: http://127.0.0.1:14390/
- Comparación: http://127.0.0.1:14390/antes/
- Pictograma y texto seguro: http://127.0.0.1:14390/operadores/fixture-0/
- Ausencia de bandas: http://127.0.0.1:14390/operadores/fixture-1/

A 1280/1440 seleccionar los seis operadores: panorama, cuadrado, vertical, sin logo, sin dimensiones editoriales y descripción larga. Verificar logo completo sin deformación, desplazamiento 35px respecto a /antes/, ausencia de recortes/overflow, contenido/botón completos y foco/selección por teclado. A 320/768 conservar panel oculto, minitarjetas y navegación a fichas sin overflow; comprobar pictograma y texto de bandas. Revisar tamaño real 48 × 48 y límites 330 × 110, no solo clases.

El 2026-10-27 el propietario confirma expresamente que ha realizado y aprobado personalmente las seis comprobaciones visuales de T008. Se registra como evidencia humana de los recorridos previstos arriba, no como medición automatizada de Codex ni como pruebas adicionales. No se repite la revisión ni el QA acreditado. T008 y T010 completadas.

Laboratorio: /var/folders/7t/w43nqwr10q1cfrzlxg0kv5940000gn/T/todosat-010-ydOPs0/dist. Servidor detenido tras confirmar PID, puerto y directorio exclusivos del laboratorio 010; archivos temporales conservados, sin borrado. No usar sus datos ni archivos en publicación.

## Cierre local y CONVERGE — 2026-10-27

Cierre documental autorizado de T008/T010 previo a CONVERGE. Evaluación con skill local speckit-converge: 9 requisitos FR, 5 criterios SC, 8 escenarios de aceptación y 10 tareas contrastados con código actual y evidencia existente. Decisiones de PLAN (renderer común, contain, máximos, margen aditivo, selección/visibilidad, aislamiento y preservación) satisfechas. Constitution 2.0.0 aplicable respetada; sin hooks configurados.

CONVERGE local: PASS / converged. Cero hallazgos missing, partial, contradicts o unrequested; cero tareas añadidas. CONVERGE no reescribe SPEC/PLAN ni añade una fase vacía a TASKS. Los estados de preparación de SPEC/PLAN se conservan como contexto histórico; estado operativo final en este cierre y tasks.md.

Revisión final: diff funcional idéntico al hash arriba; únicamente dos archivos de producto de 010 modificados. SVG intacto. Comparación de 250 archivos protegidos frente a baseline: sin diferencias, incluidas Features 008/009. Sin pruebas ni builds repetidos. Estado Git conserva todos los cambios previos; documentación/pruebas de 010 y SVG aportado siguen sin seguimiento, producto sin commit.

Servidor identificado mediante comando completo: Python http.server 14390, bind 127.0.0.1, directorio exacto del laboratorio indicado arriba. Detenido exclusivamente mediante SIGTERM al PID 1690. No se afectan otros servidores.

Publicación futura: autorización independiente para commit selectivo, push y despliegue con controles vigentes; preservar y separar los cambios pendientes de 008/009 e incluir el SVG original requerido. Este PASS acredita exclusivamente cierre local, no producción.


## Publicación y aceptación productiva — 2026-10-27

Feature 010 publicada mediante commit `5b21b576b6526c7849d99fef46f6f2671c37b571`, GitHub main confirmado y Netlify published_deploy `6ae09df1955bb0c9118c581c` ready con SHA idéntico. El propietario aprueba personalmente pictograma y dimensiones/posición/presentación del logo grande en la web publicada, sin incidencias en secciones o navegación. No se repite QA.

El cierre conjunto y la distinción entre evidencia manual productiva, build ficticio y limitación HTTP 401 constan en [QA de publicación conjunta](../009-home-news-sections/qa.md#publicación-conjunta-009--010--2026-10-27). Integridad de Feature 008 confirmada; Git 0/0 e índice vacío antes de esta actualización documental. Estado local PASS y despliegue PASS; el STOP técnico inicial queda resuelto por el cierre postdeploy definitivo del 2026-10-27. Sin nuevos commits, pushes, despliegues o cambios de código.


## Cierre postdeploy definitivo — PASS

El propietario confirma robots noindex,nofollow y cero coincidencias de cookiebot, google-analytics, googletagmanager y adsbygoogle en el HTML inicial de la portada autenticada. Evidencia manual, distinta del QA aislado y de la consulta HTTP 401 de Codex. Alcance y límites precisos en [cierre conjunto](../009-home-news-sections/qa.md#cierre-postdeploy-definitivo-009--010--2026-10-27). No quedan bloqueos acordados; no se atribuye inspección dinámica ni comprobaciones manuales adicionales. Feature 008 íntegra, sin operaciones productivas nuevas.
