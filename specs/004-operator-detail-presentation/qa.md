# QA local — 004-operator-detail-presentation
Fecha: 2026-10-25. PASS local; 6/6 tareas. El propietario ha confirmado posteriormente que la imagen y la información técnica funcionan correctamente; no se le atribuyen comprobaciones adicionales.

## Trazabilidad
- Base histórica de las pruebas: frontend `b6b2c60b23e8e9f9be0ac61426d759fdf092a6a8`, main. Diff exclusivo de ficha SHA-256 `2295bf7c1ad3804d7366bedf10c3bcb0a238317fa721f011274fa67592b373bc`.
- Único cambio funcional de esta feature: dos clases en src/pages/operadores/[slug]/index.astro (marco e imagen).
- Durante esas pruebas, Feature 003 estaba sin commit y se preservó: diff Home SHA-256 `1061dca86476154632b04d94a67e5f68c7dc097a13c79a444d8686d4b4fa6e14`, idéntico a su QA anterior. No modificaciones en sus documentos ni en Features 001/002.
- Constitution 2.0.0 controlada hash 496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7. Sin hooks.
- SPECIFY/CLARIFY PASS 16/16; ANALYZE antes de implementación PASS: 4 requisitos, 6 tareas, cobertura completa (FR-001/002 T003/T004, FR-003/004 T002/T005); cero contradicciones o ambigüedades relevantes.

## Diagnóstico de información técnica
No se demuestra regresión: el fixture original solo aporta tipo_orbita=LEO. La consulta getOperadores usa populate=* y pasa marca sin eliminar campos. detallesTecnicos incluye cinco pares valor/descripción y conserva cada apartado con alguno rellenado. La matriz compilada confirma su funcionamiento:
- operador-ficticio: 1 apartado (órbita).
- vertical: 5 apartados, valores y descripciones de cobertura, satélites, velocidad, latencia y órbita presentes literalmente.
- cuadrado: 2 apartados (órbita y cobertura con descripción sin valor), descripción visible.
- sin-logo: 1 apartado y ausencia de portada sin marco de imagen.
Se verificó mediante HTML generado y árbol accesible del navegador (casos completo y original). No se ha modificado código de datos ni render técnico. No se consultó contenido productivo; el diagnóstico se limita al ejemplo local y al frontend comprobado.

## Imagen y pruebas
- Marco 16/11 sin padding interior; imagen absoluta inset-0, ancho/alto completos, object-cover/object-center. Mantiene imagen semántica, alt, etiquetas y enlaces.
- Build de 32 páginas PASS, exit 0. Harness existente copiado a temporal y fixtures ampliadas únicamente allí; ninguna dependencia instalada ni script anterior modificado.
- Fuente temporal `/private/var/folders/7t/w43nqwr10q1cfrzlxg0kv5940000gn/T/todosat-004-source-xgjxcvn_`; salida `/private/var/folders/7t/w43nqwr10q1cfrzlxg0kv5940000gn/T/todosat-editorial-dM6WvA/dist`.
- Sandbox del harness bloquea red externa y lectura .env; API ficticia loopback. Servidor estático aislado en http://127.0.0.1:14381/.
- Navegador integrado, sin Chrome ni zoom: cuatro combinaciones horizontal 600×300 / vertical 200×600 a 320 y 1440 px. Recursos cargados con naturalWidth/Height correctos; objectFit=cover, objectPosition=50% 50%.
- A 320: caja imagen 220×150.625 px, ocupa exactamente el interior del marco (clientHeight redondeado 151); offset 1×1 por borde. Página clientWidth/scrollWidth 312/312.
- A 1440: caja imagen 584.945×401.523, interior redondeado 585×402; mismo offset de borde. Página 1432/1432. Sin bandas interiores ni desbordamiento horizontal; proporción conservada por cover con recorte centrado.
- La captura del navegador quedó limitada al ancho anterior durante un cambio de viewport; no se utiliza para afirmar revisión estética completa. La verificación funcional de dimensiones y estilos computados se completó en los cuatro casos. Overrides restaurados.
- Comparación exacta del código técnico y parte inferior contra HEAD: idénticos. git diff --check PASS.

## Límites y cierre
No se inspeccionaron fichas productivas, ni se modificó Strapi, backend, datos, medios o publicación. Carlos puede continuar su trabajo editorial habitual: esta actuación no lo interrumpe. Las pruebas se ejecutaron sin commits, pushes ni deploys. QA funcional local suficiente y aprobación humana posterior de imagen e información técnica comunicada expresamente. Sin bloqueos técnicos.

## Trazabilidad del cierre controlado
Feature 003 cerrada en `e806b5418caff853bd96db1f99a681dccc10d704`, base actual de Feature 004. La eliminación de descripción gris ya pertenece a ese commit. El diff restante solo contiene las dos clases de marco/imagen aprobadas, SHA-256 `2f8b44ce683510e7007fda1a2f771db8d6ede047f7d2b6ec38f0aed47b923ea8`. Las evidencias anteriores se conservan como históricas; no se han repetido pruebas ni builds. La autorización actual permite CONVERGE y un commit local exclusivo de Feature 004, sin producción, push o despliegue.
