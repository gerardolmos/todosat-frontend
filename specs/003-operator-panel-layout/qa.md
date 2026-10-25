# QA local — 003-operator-panel-layout

Fecha: 2026-10-25. Estado: PASS local; revisión estética del propietario pendiente. Sin CONVERGE.

## Revisión exacta y recuperación
- Frontend base: `b6b2c60b23e8e9f9be0ac61426d759fdf092a6a8`; rama main, sin commit de esta feature.
- SHA-256 del diff funcional (`git diff -- src/components/HomeOperatorsSection.astro`): `1061dca86476154632b04d94a67e5f68c7dc097a13c79a444d8686d4b4fa6e14`.
- SHA-256 del componente final: `e8c50638e7c0294f255a69222536ad1259cf9942f1fc880c0e9d7a9215f36ecf`.
- Constitution 2.0.0: hash `496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7`, coincidente con referencia controlada. Sin hooks registrados.
- Recuperados T001–T003 marcados, SPECIFY/CLARIFY 16/16 y ANALYZE PASS anteriores. SPEC/PLAN/TASKS coherentes; no se repitieron fases. Cobertura FR-001–FR-005 en T003/T005/T006, sin contradicciones.
- El build anterior PASS (32 páginas) quedó en la conversación, sin qa.md. Su laboratorio ya no existía; se reconstruyó para continuar QA, sin repetir suites ajenas.

## Implementación y defecto corregido
- Flex vertical, grupo inferior con margen automático y separación mínima de 32 px respecto al logo; título 36 px frente a 48; separaciones internas 12/16 px.
- Defecto observado: object-contain centraba el dibujo dentro de su caja. Corregido solo en el logo ampliado con object-left-top; valor computado `0% 0%`.
- Padding 32 px y scroll existentes preservados. La base de 550 px se reduce por flex a 471 px en fixtures de escritorio; es comportamiento real, no una promesa de altura fija efectiva.

## Pruebas y evidencia
- Build aislado inicial reconstruido: PASS, 32 páginas. Build posterior a corrección demostrada: PASS, 32 páginas, salida 0. Harness existente sin modificaciones, red externa bloqueada y lectura .env denegada; solo API ficticia loopback.
- Laboratorio final: `/private/var/folders/7t/w43nqwr10q1cfrzlxg0kv5940000gn/T/todosat-editorial-vgNCvm`. Su dist se copió al servidor temporal nb76o4; URL `http://127.0.0.1:14380/`.
- Navegador integrado autorizado accesible esta sesión; no Chrome ni zoom. Overrides restaurados al acabar.
- 1440 px, texto corto: área 471 px; descripción acaba exactamente en su borde inferior; divisoria 24 px después. Nombre 36 px. Logo y área comparten coordenadas superiores e izquierdas; dibujo alineado 0% 0%.
- 1280 px: nombre largo ocupa dos líneas, sin solapamiento; página 1272/1272 px de clientWidth/scrollWidth. A 1440: 1432/1432.
- 320 y 768 px: página 312/312 y 760/760; panel oculto como antes y cuatro tarjetas presentes. Sin desbordamiento horizontal.
- Fixture temporal panel-largo.html: 3276 caracteres, palabra de 160 y marcador FIN-DESCRIPCIÓN. Solo cambia descripción ficticia en HTML/JSON del laboratorio, no datos ni fuente del proyecto.
- Descripción larga 1280/1440: altura desplazable 1860 px, viewport 471, scroll final 1389; marcador final visible y fondo del texto coincidente con fondo del área. Divisoria a 24 px. Ancho interno 478/478 y 482/482, sin desbordamiento lateral. Captura inspeccionada: texto final legible y separado de pictogramas.
- Selección real de operador vertical: nombre, logo y enlace `/operadores/vertical` actualizados. Sin logo: imagen oculta, nombre y enlace `/operadores/sin-logo` correctos. Pictogramas Cobertura/Velocidad/Latencia conservados.
- En una captura del fixture largo Latencia apareció sin cargar; comprobación posterior de la Home final: los tres recursos completos y naturalWidth positivo. No se alteró ningún recurso.
- Comparación exacta con HEAD: todo el componente anterior y posterior al bloque modificado es idéntico, incluidas tarjetas pequeñas, pictogramas y JavaScript de selección. Único archivo funcional modificado; Features 001/002, otras páginas y backend sin cambios realizados.
- `git diff --check`: PASS.

## Límites
QA con datos ficticios; no validación productiva. Se conserva scroll para texto largo, sin truncarlo. Aprobación estética final del propietario no atribuida ni anticipada. Sin bloqueos técnicos pendientes, sin dependencias, commits, pushes o despliegues.

## Ajuste final autorizado — 2026-10-25
Estado actual: 8/8 tareas, QA local PASS. Evidencia anterior US1 preservada; esta sección añade US2.
- SPEC/PLAN/contrato actualizados antes de implementación. SPECIFY/CLARIFY revalidados 16/16, sin preguntas; ANALYZE PASS: FR-006/SC-004 cubiertos por T007/T008; excepción explícita a FR-005/SC-003, sin contradicciones. Sin repetir fases de Features cerradas.
- Campo blanco: descripcion_corta; campo gris: descripcion_home. Retirado solo su condicional en ficha individual. Home sin cambios.
- Comparación con captura local anterior a este ajuste: toda la ficha es idéntica salvo el bloque eliminado, incluidos cover aprobado y sección técnica. Código sin fallback a descripcion_home.
- Build aislado con fixtures: PASS, 32 páginas, exit 0. Laboratorio `/var/folders/7t/w43nqwr10q1cfrzlxg0kv5940000gn/T/todosat-editorial-sE2jUS`. Sin .env real ni red externa; sin Chrome, zoom o revisión visual repetida.
- Verificación del HTML visible (excluidos scripts/styles): cuatro fichas con Descripción preservada y sin Panel preservado; Home conserva Panel preservado. Cinco comprobaciones PASS.
- Diff Home SHA-256 `1061dca86476154632b04d94a67e5f68c7dc097a13c79a444d8686d4b4fa6e14`: idéntico al ya validado.
- Fuente final ficha SHA-256 `39e1146a6fa054e0041e9783bcea44ca890c3218663b58d665ccb5c4a11e16bb`; diff completo de ficha contra HEAD SHA-256 `ad626a6411dcf28845d539f7cd38987f3ed98156c75a0fdb0a34dd8f9af04ad5`. Este diff incluye las dos clases previas de Feature004, que no se han alterado en esta intervención. Base HEAD b6b2c60b23e8e9f9be0ac61426d759fdf092a6a8.
- Aprobación humana de imagen e información técnica comunicada por el propietario; no se le atribuyen pruebas adicionales. Documentación de Feature004 intacta, su QA corresponde a su revisión histórica.
- git diff --check PASS. Sin datos, producción, backend, dependencias, commits, pushes, despliegues o CONVERGE.
