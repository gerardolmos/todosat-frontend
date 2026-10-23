# QA — 001-editorial-presentation

Fecha: 2026-10-23. Frontend-only. Constitution 2.0.0 comprobada idéntica a backend.
Base frontend: d45667333d84bd3cb8dead950753baaab07152a4. Backend: 6a626c9728bedacd35748cf1102ffd1df3fd0b0d, sin cambios. Cambios locales sin commit; no push ni deploy. No CONVERGE.

## SDD

Aprobación explícita FR-007/SC-003 incorporada a SPEC, escenarios, supuestos, PLAN, contratos, research, modelo y tareas. SPECIFY 16/16. ANALYZE PASS: 13 FR + 6 SC cubiertos; 26 tareas, sin requisitos sin tarea ni conflicto constitucional. G1/G2 no acreditan recuperación real: modo histórico diagnóstico autorizado. No se leyó .env real ni se accedió a Strapi/PostgreSQL/Cloudinary productivos.

## Evidencia anterior a los últimos ajustes (histórico)

20/26 tareas terminadas. Tarjetas sin descripción, logo máximo 150×55, foco visible; panel y descripciones ajenas conservados. Figura principal proporcional con caption recibido y alt editorial. Bloques image opt-in solo Noticias, captions escapados, URL insegura omitida con diagnóstico, URL relativa del medio normalizada con origen ya configurado. Footer aprobado con año dinámico.

30 pruebas automatizadas PASS (node --test tests/editorial-presentation/*.test.mjs). Pruebas del resolvedor y renderer ejecutadas primero en rojo (módulo inexistente y figura ausente); Home/footer también fallaron antes del cambio y pasaron después. Se cubren caption nuevo/vaciado/histórico, identidad exacta/ambigua/incompleta, 401/403/500 simulados, timeout sin retry, caché por resolución, máximo 4 peticiones simuladas concurrentes, no mutación, escaping y protocolos, salida compartida igual al baseline, HTML principal/cuerpo, imágenes vertical/cuadrada/ausente, Home y footer. No son 30 pruebas visuales.

Build Astro final: 32 páginas ficticias, PASS. Builds con reloj inyectado 2026 y 2027 y comprobación del año del footer: PASS. Sin cambiar reloj del Mac. Contraste calculado de #475569 sobre blanco >4.5:1; verificación visual completa de contraste/zoom aún pendiente.

Harness scripts/test-editorial-presentation.mjs crea copia temporal sin .env*, entorno limpio, token ficticio, API e imágenes loopback, sandbox-exec deniega red externa y lectura .env. Una sonda a dirección reservada 192.0.2.1 debe fallar EPERM/EACCES antes de permitir build. Intentos iniciales sin aislamiento válido abortaron sin build; perfil corregido y probado antes de builds exitosos. La ejecución del sandbox requirió aprobación técnica de herramienta fuera del sandbox contenedor, manteniendo el sandbox de red propio. No se instaló software.

## Captions: garantías y límites

Principal: se presenta el caption del medio ya recibido por populate; sin consulta extra. Cuerpo: transporte real no conectado; se conserva caption incorporado y se registra source=historical current-library-caption=unverified por ordinal de bloque. Si está vacío no se inventa pie. El resolvedor con transporte inyectado solo se prueba con fixtures: no acredita permisos ni captions productivos. No se descarga biblioteca completa. No existe búsqueda por nombre ni actualización de registros. Una incidencia de metadatos conserva información y no hace fallar todo el build.

## Revisión visual anterior (histórico)

Chrome nativo accesible mediante CUA. Se abrió noticia ficticia, se observaron texto literal, imágenes y pies a 320 y 768 px. Hubo timeout inicial y control irregular del campo Width (valores introducidos no siempre aplicados). No se acredita 1440 px, zoom 200 %, selección con teclado ni matriz visual completa de retratos/logos. No confundir capturas parciales con PASS de toda la matriz. Se intentó devolver DevTools al modo normal; no se usa esa acción como evidencia de QA.

Pendientes: T015 (matriz visual Noticias), T018 (Home adaptable/teclado), T021 (footer adaptable completo), T024 (QA visual conjunta), T025 (quickstart completo incluida revisión), T026 (cierre final tras estos checkpoints). No hay decisión funcional nueva pendiente; se necesita completar revisión manual agrupada. Recuperación de captions productivos sigue no acreditada, sin bloquear modo histórico aprobado.

Preview anterior, ya no disponible al recuperar la ejecución; entonces listener comprobado solo loopback http://127.0.0.1:14378/ con noticia-ficticia, vertical, cuadrada y sin-imagen en /noticias/. Mantiene fixtures ficticios. No usar como producción.

## Recuperación y QA local — 2026-10-23

Estado actual: **21/26 tareas completas**. El código y SPEC/PLAN/TASKS ya conservaban los ajustes aprobados de logos 140×55 y principal ancho completo/máximo 550/object-fit cover centrado. ANALYZE PASS previo se conserva; no se cambiaron requisitos ni código funcional en esta recuperación. La cifra 20/26 y los 150 px del apartado histórico quedan superados por este registro. T021 estaba correctamente cerrada por aceptación humana del footer.

El laboratorio anterior y su puntero temporal ya no existían. Se recreó con `node scripts/test-editorial-presentation.mjs --preview`, con sandbox propio, sonda de bloqueo externo y sin .env real. Build actual: **32 páginas, PASS**. Preview activo en http://127.0.0.1:14378/; copia temporal `todosat-editorial-V2mGVP`, datos ficticios y servicios loopback. No se ejecutó build contra Strapi real.

La ejecución anterior había acreditado 31 casos automatizados tras los ajustes. En esta recuperación se revalidaron únicamente Home e integración contra el nuevo artefacto: `node --test tests/editorial-presentation/home.test.mjs tests/editorial-presentation/integration.test.mjs`: **7/7 PASS, exit 0** (subconjunto de los 31, no casos adicionales). Incluye contraste calculado, caption literal, variantes de imagen y restricción de recorte a principal. Regresiones compartidas/resolvedor no repetidas: archivos sin cambios respecto a sus hashes acreditados. Las aserciones de clases no sustituyen la geometría visual.

### Evidencia humana aportada por Gerard

- Footer: PASS, sin modificar su código en esta recuperación.
- Zoom 200 %: PASS únicamente en su recorrido manual comunicado; no consta matriz de viewports/páginas.
- Tab: PASS únicamente en su recorrido manual comunicado; no acredita Shift-Tab/Enter/Espacio ni todos los controles.
- Diseño de Home aprobado, sujeto a anchura final de logos.

### Observación real en Chrome mediante CUA

- Viewport responsive **1440 px**, valor visible confirmado. `/noticias/vertical/`: la principal ocupa visualmente el ancho de la figura, con caja apaisada pese al original vertical; caption completo debajo, fuera de la imagen. Cuerpo vertical completo y pie largo envuelto sin desbordamiento observado. La fixture de color sólido permite observar caja y proporción exterior, pero no demuestra por sí sola el punto de recorte ni ausencia de deformación de detalles internos. No se declara medición independiente de 550 px.
- Home a **1440 px**: logos cuadrado/horizontal/vertical completos visualmente, nombres largos y tarjeta sin logo sin solapamiento observado; selector sin descripción y panel ampliado conservado. No se declara medición exacta de máximos por esta captura.
- Intento de cambiar Width a 320 mediante control nativo no aplicado: permaneció 1440. No se repitieron intentos improductivos; **320 y 768 actuales quedan pendientes**. Las observaciones antiguas no validan automáticamente el nuevo CSS.
- La lectura de geometría/estilos por consola fue bloqueada por la protección de pegado de Chrome. No se habilitó `allow pasting`, no se cambió seguridad y no se ejecutó ese script.

### Pendientes concretos

T015 y T018: cerrar matriz actual 320/768 y medición efectiva del límite/centrado y proporciones; recorrido de selección/foco pendiente más allá del Tab humano acreditado. T024: consolidación accesible completa. T025: quickstart parcial por esos pasos visuales. T026: auditoría de alcance realizada, pero cierre integral condicionado a los checkpoints previos. Se mantienen las cinco tareas sin marcar. No hay bloqueo funcional nuevo demostrado ni cambio de requisitos necesario.

Auditoría: backend limpio y mismo SHA; Constitution idéntica y procedencia coincidente; package.json/package-lock.json sin diferencias, ninguna dependencia instalada. Footer SHA sin cambios respecto a aprobación. `git diff --check`: PASS. Frontend conserva modificaciones locales de esta feature y artefactos sin seguimiento. Sin commits, pushes, deploys ni CONVERGE. Captions productivos y permisos de recuperación adicional siguen sin acreditarse: permanece el fallback histórico diagnosticado aprobado.

## Identificación exacta del estado funcional actual

SHA-256; documentación no forma parte del binario probado:

- `.gitignore`: `f137c642219184f49f0da7d26dcac94f1d0d1a6fc6349c23fe3f1112634aa7c3`
- `scripts/test-editorial-presentation.mjs`: `dae5c6b1c54cb824679c565fb334be3147dfb3d130210e11c6971b23df0b295d`
- `src/components/Footer.astro`: `49bf7b9d817bb92bde56e3a8234a440a5ea1e9360a902c557414e47dd7954f40`
- `src/components/HomeOperatorsSection.astro`: `846b30c32347c0d904396fa619a4fdce835c50de87f14f19b069997487d8795f`
- `src/components/NewsImage.astro`: `ee4a8ee6bb8076f9949000e8f95a4f088cc931d214ace70ca0ae9b43a4cf22a1`
- `src/lib/news-media.ts`: `75d8243c6e047073c1a8b937f66390baa6ebd3f9561e963e02046febf67bf69e`
- `src/lib/renderBlocks.ts`: `8871c7bebfcaa49b6de5be058521c695431557b22b120816729c0d84f85aff3e`
- `src/pages/noticias/[slug]/index.astro`: `344f7dc9fda0e0440bd3ffb19cf2a048923934a316973c28eb3512e917727565`
- `tests/editorial-presentation/fixtures/build-worker.mjs`: `511b8044bd4fbb19ca3c392dbfff2629ad61c5af3206ba4574eb6ffa4dba7e9b`
- `tests/editorial-presentation/fixtures/renderBlocks-before.ts`: `e5b4c1f7b80571f016712a62a997f9db186552c45a5843fe02da83aab7db0118`
- `tests/editorial-presentation/footer.test.mjs`: `5c7819b221fbf21174366e18fe29b7d0883a8a1962b20b6b8215454782c7d166`
- `tests/editorial-presentation/home.test.mjs`: `2039967342a5ef8915dffeaa5bcbacf9245492c49433dc14e8b29bbad442a164`
- `tests/editorial-presentation/integration.test.mjs`: `b507a3d80f784e81820be3e5ef8c22941ffc2d30586b2e2c22341f2f0f5def15`
- `tests/editorial-presentation/media.test.mjs`: `7845eda6ac6653f5cb9be203e6faaf416d2672a175226f6b8082490c405db0af`
- `tests/editorial-presentation/render.test.mjs`: `e076cba2496a890fc4e6e4f314667cf9264d162d4bf77613fe77d1ef60462fd1`

## Cierre final de QA local — aprobación humana y geometría efectiva

**Resultado vigente: PASS local, 26/26 tareas completas.** Este cierre sustituye los pendientes de la recuperación anterior; conserva su registro histórico. CONVERGE no ejecutado.

Gerard comunica expresamente «Todo perfecto» tras la revisión manual pendiente. Se registra como evidencia humana, no como prueba automatizada: Home/Noticias a 320 y 768 px, imágenes y captions, selección de operadores, footer, zoom 200 % y navegación mediante Tab, dentro de los recorridos revisados por él. Se combina con la observación previa a 1440 px. No se atribuyen pruebas individuales de Shift-Tab/Enter/Espacio, lector de pantalla, todos los navegadores ni todas las páginas que no hayan sido comunicadas.

### Comprobación técnica adicional, sin cambios funcionales

Se creó exclusivamente en `dist/qa-geometry.html` del laboratorio ficticio existente una página diagnóstica temporal. Carga `/noticias/vertical/` en iframe local de 1440 px y lee `getBoundingClientRect`, `clientWidth`, dimensiones naturales y `getComputedStyle`. Chrome abrió la página mediante CUA; no se utilizó ni desbloqueó la consola, no se cambió seguridad, no se instalaron herramientas y no se recompiló.

Resultado real leído del navegador:

```json
{"viewport":1440,"image":{"width":1232,"height":550,"container":1232,"naturalWidth":200,"naturalHeight":600,"maxHeight":"550px","fit":"cover","position":"50% 50%"},"captionBelow":true,"pass":true}
```

La principal tiene exactamente el ancho del contenedor y 550 px de alto. Los estilos efectivos `cover` y `50% 50%` aplican escala uniforme y recorte centrado: para el original 200×600, factor uniforme 6.16, tamaño del objeto 1232×3696 y excedente vertical repartido por igual (1573 px por lado). No se trata solo de encontrar clases en el código. Caption fuera del área recortada acreditado por sus rectángulos. La imagen de cuerpo conserva caja 200×600; su carga diferida no había completado dimensiones naturales en esta lectura, por lo que no se añade una nueva prueba de píxeles de cuerpo: se reutilizan revisión humana y pruebas anteriores.

### Cierre de tareas y auditoría

- T015: matriz visual humana 320/768 + observación 1440, contraste automatizado previo y medición principal anterior: PASS.
- T018: aceptación humana de logos/tarjetas, selección y Tab; pruebas Home vigentes: PASS.
- T024: consolidación adaptable/accesible dentro del alcance revisado: PASS, sin declarar auditoría exhaustiva de accesibilidad.
- T025: quickstart contrastado con evidencias de harness, fixtures, unitarios, build, preview y QA manual. Los ejemplos de teclas no comunicadas no se presentan como pruebas ejecutadas; no bloquean los criterios funcionales aprobados. Recuperación real de biblioteca y permisos productivos quedan fuera de este cierre, conforme al fallback aprobado.
- T026: manifiesto SHA-256 completo verificado contra los archivos actuales, todos coinciden; no hay cambios funcionales nuevos ni motivo para repetir pruebas. Backend limpio, SHAs frontend/backend y Constitution idénticos a los documentados; dependencias sin cambios; `git diff --check` PASS. Se conservan las 31 pruebas acreditadas y build de 32 páginas, sin inflar conteos con la comprobación geométrica.

En esta sesión solo se actualizan tasks.md/qa.md en el repositorio y un diagnóstico temporal fuera del repositorio. No se detectan regresiones nuevas ni modificaciones adicionales fuera del alcance; esto se sustenta en integridad del manifiesto y evidencias previas, no en una nueva suite completa. Sin producción, Strapi, contenidos, commits, pushes ni deploys.

No quedan bloqueos para **iniciar** CONVERGE cuando Gerard lo autorice. Esta recomendación no acredita que CONVERGE haya terminado ni autoriza publicación. La limitación de captions históricos permanece explícita y aprobada; no se afirma sincronización productiva de biblioteca.
