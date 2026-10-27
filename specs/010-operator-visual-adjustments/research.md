# Research — 010

Se reutiliza el diagnóstico aprobado; no se repite investigación externa ni QA.

1. **Decisión:** importar frequencia.svg en la ruta y asignarlo al icono actualmente nulo. **Razón:** ya existe un renderer común 48 × 48. **Alternativas descartadas:** SVG inline, recreación del recurso o renderer independiente, innecesarios y contrarios al alcance.
2. **Decisión:** área limitada 330 × 110, contain y alineación superior izquierda; margen adicional 35px, con ancho disponible descontado. **Razón:** garantiza escalado de la imagen visible hasta el primer límite incluso sin dimensiones editoriales; no depende de añadir JS ni recortar. **Alternativas descartadas:** solo max-width/max-height con tamaño natural (no garantiza alcanzar un límite), cover (recorta), transform sin reserva de espacio (riesgo de desbordamiento), cambios globales del panel (fuera de alcance).
3. **Decisión:** mantener panel oculto antes de xl. **Razón:** preserva diseño y comportamiento aprobados; la comprobación móvil se refiere a ausencia de regresión/overflow, no a crear panel móvil.
4. **Decisión:** tests propios con fixtures, render real local y validación geométrica manual si no hay herramienta local suficiente sin Chrome automatizado. **Razón:** clases CSS no acreditan layout. No instalar herramientas ni marcar PASS ficticio. No quedan incógnitas que exijan investigación de servicios.
