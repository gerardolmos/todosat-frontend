# QA — Feature 009

**Estado vigente (2026-10-27): QA local PASS, 14/14 y aprobación manual del propietario.** Las secciones anteriores de recuperación documentan estados históricos, superados por el cierre al final.

IMPLEMENT local autorizado. Base eb18708aaa4f50d27bec7d3f4adced5388a7471b. Huellas previas en baseline.json; fuentes originales de los tres archivos autorizados disponibles en ese commit. Feature 008 y todos los archivos ajenos se compararán byte a byte por SHA256. Sin .env ni datos reales.

Preflight: checklist 16/16, hooks ausentes, Git con cambios previos exclusivos de 008 y SDD009. Ignore de dependencias, dist, .env y logs existente adecuado.

Selector: RED inicial por export inexistente; GREEN 24/24. Markup: RED del control CTA ausente; GREEN 10/10 tras integración. CTA original literal comparada contra HEAD; index idéntico a base al revertir solo los tres reemplazos autorizados. Build aislado PASS recuperado del registro de ejecución: seis escenarios HTML PASS. Véase cierre de recuperación.

## Recuperación y cierre de ejecución — 2026-10-27
No se repitieron tests ni build, ni se modificó código. Diff actual revisado y coincidente con los cambios guardados en la ejecución acreditada. Base Git sin cambios. T001–T011 y T013–T014 completadas; T012 sigue pendiente, 13/14.

### Evidencia acreditada del registro anterior
- Selector: 24/24 PASS (límites 0/1/4/6 destacadas y 0/1/6/7/9 ordinarias, empates, identidad, inactivos, entrada no mutada).
- Markup: 10/10 PASS; tarjeta original literal y bloques compartidos preservados.
- Build Astro y postbuild aislados PASS. Casos HTML: zero 0/7, one 1/2, four 4/7, many 4/7, empty 0/0, only 1/0 (destacadas/generales). CTA exactamente una, solo generales. Cuatro recomendaciones ficticias de diferentes tipos conservadas, incluida noticia que también aparece en noticias.
- Primera aserción del harness falló por fixture que agrupaba cuatro relaciones en una tarjeta cuya implementación utiliza la primera relación. Solo se corrigió el fixture a cuatro recomendaciones; repetición justificada PASS, sin cambiar recomendaciones.
- Entorno: copia temporal sin .env, fetch de fixtures, conexiones externas denegadas y guard comprobado. Sin consultas productivas. Publicación es precondición de getNoticias, comprobada por el harness; no se atribuye filtrado de borradores al selector puro.

### Visual — alcance real y pendiente T012
Navegador integrado local anterior (no Chrome): anchuras 320/768/1440, scrollWidth 312/760/1432. Geometría de ambas secciones y tarjetas dentro de contenedores, sin solapamientos medidos; columnas de generales 1/2/4 según ancho. Captura móvil mostró título e inicio de Noticias; tableta mostró tarjetas y CTA; captura de escritorio quedó desplazada a Hardware, por lo que no acredita inspección visual de noticias en escritorio. No hubo aprobación humana.
Pendiente: revisión visual agrupada de ambas secciones (incluida una sola destacada y estado vacío) a 320/768/1440, especialmente escritorio. No se marca PASS por geometría o capturas de otros bloques. El servidor 127.0.0.1:14389 y su directorio temporal ya no existen al recuperar; no se promete URL operativa. Se conserva el harness --preview para regenerar una copia ficticia en una sesión de revisión autorizada; no se repite build en esta recuperación por instrucción del propietario. No hay defecto funcional demostrado.

### Integridad y alcance
Comparación SHA256 con baseline.json: todos los archivos previos fuera de los tres paths de producto autorizados permanecen idénticos, incluidos todos los archivos de Feature 008. git diff --check PASS. Recomendados conserva import, consulta, condición, posición, separador y componentes; Operadores, Hardware, Manuales y búsqueda sin cambios. Default y datos backend no tocados.
No commits, pushes, deploys, servicios externos ni dependencias nuevas. CONVERGE local no iniciado: T012 no satisfecha; no se añaden tareas duplicadas para un pendiente ya identificado. Siguiente paso: revisión visual manual sobre preview ficticio, registrar evidencia y entonces evaluar CONVERGE local. No autoriza publicación.

### Huellas finales de implementación y pruebas
- `src/lib/news-home.ts`: `2a3f8859578382427f443f135850af60d0f16910e54b3e1425d9ef7ad06fb944`
- `src/pages/index.astro`: `1866a04fc80779e084f132590cabdeffeb563db3667e087741270adf32539210`
- `src/components/HomeArticlesSection.astro`: `00f2ef063fb990a1759429b911bf80ea4fc5186ad6eee5e6acd10f34cbdd5be2`
- `tests/home-news-sections/build.mjs`: `0d9f7e82f165f65e1898634af9f4e7d9e806c2aa4257fbfb722a13f1386a8f13`
- `tests/home-news-sections/markup.test.mjs`: `adc192b18cbec1d9d36ff5a6406817f353e7eb5770657baf5d90f86dd65fa9b4`
- `tests/home-news-sections/news.test.mjs`: `cf4010930760c77cb5ed1087b99af083940457b447c1c24d35fcbcbd8e68b483`

## Vista manual T012 — 2026-10-27
Preparada en http://127.0.0.1:14389/qa009-four/ con Astro dev en copia temporal, componentes reales y fixtures del harness: cuatro destacadas, siete generales, recomendaciones mixtas, CTA original, Hardware y Manuales. Sin ejecutar build ni suites. Respuesta HTTP local 200 y listener exclusivamente 127.0.0.1 confirmados. Sin navegador automatizado. Entorno sin .env, credencial literal ficticia, fetch interceptado y conexiones salientes de Node bloqueadas por el guard del harness. Feature 008/producto no editados. Servidor mantenido activo para revisión humana; T012 sigue pendiente. Variantes: /qa009-one/, /qa009-zero/ y /qa009-empty/.

## Cierre documental y aceptación humana — 2026-10-27
El propietario confirma haber realizado y aprobado personalmente T012, incluidas las seis comprobaciones previstas y las variantes locales. Se registra esa declaración como evidencia humana, sin atribuirle pruebas automatizadas adicionales. T012 completada; T001–T014: 14/14.
Se conservan los resultados acreditados: 24 pruebas de selección, 10 de marcado, seis escenarios HTML y build aislado PASS. No se repitieron suites, builds ni navegador en este cierre.
Verificación final: huellas de los seis archivos de producto/pruebas enumerados arriba coinciden; baseline.json confirma igualdad de todos los archivos ajenos a los tres paths de producto, incluidos los cambios locales de 008. Recomendados conserva contrato, consulta, componentes, ubicación, condición y relaciones. Diff dentro del alcance; git diff --check PASS.
Servidor temporal de revisión finalizado mediante la sesión exacta 30084 creada para el laboratorio, previamente identificado como listener node PID2870 en 127.0.0.1:14389; comprobación posterior sin listener. No se detuvieron otros servicios.

## Resultado de CONVERGE local
Skill local speckit-converge aplicada tras IMPLEMENT: 8 requisitos, 4 criterios de éxito, 9 escenarios de aceptación y 14 tareas revisados contra los tres archivos de producto y las evidencias QA. Diseño mínimo y restricciones constitucionales satisfechos en el alcance local. Cero hallazgos missing/partial/contradicts/unrequested; cero tareas añadidas. Sin hooks configurados ni operaciones externas requeridas. Tras registrar T012, CONVERGE no modifica tasks.md ni crea una fase vacía.
Resultado: PASS / converged. No constituye publicación ni autorización para ella. Para publicar: autorización expresa del propietario, preparación de un commit exclusivo de 009 separado del diff de 008, y controles de publicación aplicables antes de push/deploy. No se crean commits, PR, pushes ni despliegues aquí. Producción y backend intactos.
