# Data model — vistas sin persistencia
Entrada: noticias publicadas de getNoticias; filtrar activo===true. Campos existentes: documentId, id, slug, fecha_publicacion, publishedAt, destacado. Sin schemas nuevos.
Identidad canónica con prefijo: documentId no vacío; fallback id no nulo; fallback slug no vacío. Documento sin identidad utilizable no produce tarjeta; diagnóstico de build sin datos editoriales. No fabricar identidad por posición.
Fecha: fecha_publicacion si presente, en otro caso publishedAt; inválida => valor inferior a cualquier fecha válida. Orden descendente por fecha, ascendente ordinal por clave canónica. Para filas repetidas con misma identidad/fecha, desempatar por slug y después id de forma ordinal antes de deduplicar; duplicados idénticos son equivalentes.
Deduplicar por identidad tras ordenar. Destacadas = primeras cuatro con destacado===true. Generales = primeras siete del conjunto ordenado cuya identidad no figure en destacadas, sin filtrar destacado. No mutar entrada. Repeticiones de documento no consumen plazas.
Colección Destacados y relaciones existentes: sin transiciones, modificaciones ni borrados.

La deduplicación anterior solo abarca featured/recent. No cruza el conjunto independiente getDestacados, cuya consulta, orden, relaciones y presentación permanecen intactos.
