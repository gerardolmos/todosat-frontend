# Contrato de presentación — 010

Sin endpoints ni cambios de API.

## US1

Importar recurso original en ruta; usar renderer común, 48 × 48 px, misma alineación y separación. Datos presentes → un icono; ausentes/vacíos → bloque omitido según comportamiento actual. `Ku / Ka <script>` debe aparecer como texto, nunca como nodo script. Alt y encabezado conservan patrón de las otras características.

## US2

Sea W el ancho disponible dentro del contenedor actual del logo, antes del nuevo margen. El área útil horizontal es A = min(330, max(0, W - 35)). Alto máximo 110. Para imagen natural de ancho w y alto h positivos, la imagen visible debe medir (w·s, h·s), con s = min(A/w, 110/h). Comparar con tolerancia de redondeo de 1px. No cambiar píxeles del recurso ni alpha.

Origen de presentación: origen anterior + (35,35) px; mismo padding ancestral. No centrar dentro del área ni aplicar el desplazamiento por segunda vez. Si W <= 35, no permitir anchuras negativas/overflow; ese extremo no implica habilitar el panel en breakpoints donde está oculto.

Mantener selección, ausencia de logo, atributos accesibles y sus valores. Conservar marked sections restantes y todas las minitarjetas; no modificar lógica de datos/imagen de fondo/nombre/descripción/métricas/botón. Con textos largos se conserva lectura completa mediante el scroll ya existente.

## Aislamiento

Únicos archivos de producto editables: HomeOperatorsSection.astro y operadores/[slug]/index.astro. SVG sin cambios. Ningún archivo de 008/009 debe cambiar de hash. Las modificaciones anteriores de esos archivos ajenos no se incorporan ni revierten.
