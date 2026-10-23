# Data model — solo modelos de presentación

No migraciones, esquemas nuevos ni registros persistidos.

- News: noticia publicada ya seleccionada por lógica existente; imagen_principal media y contenido blocks se leen sin mutarlos.
- MediaSnapshot: hash/provider/url del bloque, caption histórico, alternativeText, dimensiones. `hash`, `provider` y `url`: cadenas no vacías para resolver; dimensiones positivas cuando se usan. Identidad incompleta conserva caption histórico con diagnóstico, no inferencia.
- ResolvedMedia: candidato único con id, hash, provider, url y caption. Caption debe existir en respuesta y ser string o null; null/cadena vacía/solo espacios significa ausencia confirmada. Un campo no entregado es error, no ausencia. No modificar caption ni almacenarlo en base/caché persistente.
- ResolutionResult: resolved-with-caption, resolved-empty o historical-fallback. Error incluye código y ordinal de bloque/noticia de diagnóstico local sin tokens, URL privada ni cuerpo de respuesta; cualquier error de recuperación conserva caption histórico y permite continuar.
- Figure: URL válida http/https o recurso local autorizado, alt existente, caption vigente, dimensiones positivas. Sin atributos event-handler; caption/alt siempre escapados. Preservar orden de bloques.
- OperatorCard: nombre, tipo_orbita, logo opcional. Máximos 140 × 55 px; otras descripciones permanecen en datos para sus usos existentes.
- Footer: descripción literal de SPEC y año del build.

No transiciones editoriales. Caché de resolución vive solo dentro del proceso: pending → resolved o rejected; no reutilizar éxitos de builds anteriores. Resolver una vez cada identidad distinta y reutilizar el resultado para las apariciones en ese proceso.
