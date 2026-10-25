# Research — 2026-10-24
- Observado: cuadrícula xl:h-[820px], panel hidden/xl:block, área superior xl:h-[550px] con overflow-y-auto; script selecciona por data-* y sustituye textContent.
- Decisión: conservar alturas, scroll, padding, breakpoint e interacciones. Flex vertical con logo shrink-0/self-start y grupo shrink-0/mt-auto/pt-8. El scroll permite texto arbitrariamente largo sin recortarlo ni desplazar pictogramas.
- Alternativas descartadas: crecer toda la cuadrícula (afecta tarjetas); posicionamiento absoluto (solapa texto); truncado (incumple FR-004).
- Logo mantiene máximo 420 × 192; limitar además al ancho disponible evita desbordamiento en el escritorio estrecho. Nombre 36 px frente a 48 px. Palabras largas pueden partirse solo en este grupo.
- No investigación externa necesaria: únicamente mecanismos CSS existentes, sin elección de tecnología ni API nueva.

- QA 2026-10-25: object-contain centraba el dibujo dentro de la caja; object-left-top alinea también el contenido gráfico. La altura 550 px es una base flexible: el layout existente la reduce (471 px observados a 1440), sin impedir la alineación inferior.

## Descripciones — 2026-10-25
Texto blanco: marca.descripcion_corta en ficha. Gris: marca.descripcion_home en ficha; mismo campo corresponde al panel de Home. Se retira únicamente su condicional de presentación en ficha. Sin cambios de datos.
