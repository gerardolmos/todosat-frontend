# Contrato de presentación
- Mantener todos los atributos data-selected-*, data-feature-* y listeners existentes.
- Solo envolver nombre, órbita y descripción en grupo compacto. No modificar contenido, orden de lectura ni pictogramas.
- Logo arriba, espacio automático antes del grupo; separación mínima de 32 px; nombre 36 px, órbita a 12 px y descripción a 16 px.
- Área superior de 550 px en xl, scroll vertical conservado; logo y grupo sin encogimiento. Texto y logo no sobrepasan su ancho.
- Panel oculto por debajo de xl como antes. No contratos de API nuevos.

## Contrato final de descripciones
La ficha muestra descripcion_corta cuando existe; nunca renderiza descripcion_home ni la usa como fallback. Home mantiene su comportamiento actual. No modificar datos ni otros bloques de ficha.
