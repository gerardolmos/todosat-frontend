# Data Model — 010

No se crean ni alteran entidades persistentes, esquemas, consultas o contratos de Strapi.

- Bandas: valor existente string; se conserva trim y omisión de vacío/no string actuales. Restricción: **«El valor se presenta como texto escapado; no se interpreta como HTML.»**
- Pictograma: recurso local ya aportado, identidad y bytes inmutables. SHA256 `87f462218ea7b6e2832d5fa109925dad88fe05150bd98928610c82c46c0b1c52`.
- Logotipo: src, dimensiones y nombre/alt existentes. Restricción: **«No se modifican imágenes ni referencias editoriales.»** Dimensiones editoriales pueden faltar; contain usa la proporción natural de la imagen cargada.
- Estado: selección de operador existente; con logo se muestra y actualiza, sin logo se oculta. No estado nuevo ni persistencia.
