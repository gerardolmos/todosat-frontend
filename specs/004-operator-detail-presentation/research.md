# Research — 2026-10-25
- Portada: marco con p-3 y img object-contain/aspect-[16/11]. Ambos explican zonas vacías. Decisión: marco con aspect-ratio y sin padding; imagen absoluta cover centrado. Se descarta estirar o usar imagen de fondo porque se conservan img y alt.
- getOperadores en src/lib/content.ts usa populate=* sin selección restrictiva de campos; getStaticPaths pasa marca íntegra a la ficha.
- detallesTecnicos contempla cobertura/satelites/velocidad/latencia/tipo_orbita y sus descripciones, filtrando item.text || item.value. El render muestra título, valor y descripción.
- Fixture existente tests/editorial-presentation/fixtures/build-worker.mjs: operator solo rellena tipo_orbita: LEO. Diagnóstico inicial: datos limitados, no evidencia de render roto. Confirmar con fixture completo antes de concluir.
- No APIs nuevas ni investigación externa necesaria; solo arquitectura y código existentes.
