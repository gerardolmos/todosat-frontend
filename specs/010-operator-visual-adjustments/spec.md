# Feature Specification: Ajustes visuales de operadores

**Scope**: frontend-only
**Repository**: todosat-frontend
**Feature ID**: `010-operator-visual-adjustments`
**Feature Branch**: Sin rama nueva; trabajo documental local en `main`.
**Created**: 2026-10-27
**Status**: SPECIFY aprobado; CLARIFY PASS (2026-10-27); implementación no autorizada en esta fase.
**Input**: Encargo del propietario: pictograma original para Bandas de frecuencia y tratamiento proporcional del logotipo del panel ampliado, máximo 330 × 110 px y desplazamiento adicional de 35 px abajo/derecha. No implementar.
**Governance**: Constitution 2.0.0; autoridad `todosat-backend/.specify/memory/constitution.md`, procedencia controlada en `docs/sdd/governance-reference.json`. Sin cambio de contratos de datos.

## Clarifications

### Session 2026-10-27

- El propietario ratifica pictograma original de 48 × 48 px, máximos proporcionales 330 × 110 px y desplazamiento adicional de 35 px en ambos ejes. No se formulan preguntas redundantes.
- Se conserva la visibilidad actual del panel ampliado y la presentación de los demás elementos. En pantallas donde está oculto, se verifica esa preservación, no se habilita una versión nueva.
- Cobertura de CLARIFY: alcance, datos, interacción, seguridad del texto, dependencias, límites, terminología y criterios de cierre claros. Rendimiento, concurrencia y persistencia no incorporan requisitos nuevos en este ajuste visual. Cero ambigüedades críticas, cero preguntas pendientes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconocer las bandas de frecuencia (Priority: P1)

Como lector de una ficha individual, quiero identificar las bandas de frecuencia mediante el pictograma proporcionado y leer su valor con la misma presentación que las demás características técnicas.

**Why this priority**: Completa una inconsistencia visible sin alterar información editorial.
**Independent Test**: Consultar una ficha ficticia con bandas y comparar su pictograma con los de las otras características.

**Acceptance Scenarios**:

1. **Given** un operador con bandas informadas, **When** se consulta Información técnica, **Then** aparece el pictograma original proporcionado, con dimensiones de 48 × 48 px, alineación y separación equivalentes a los demás pictogramas.
2. **Given** el valor ficticio `Ku / Ka <script>`, **When** se presenta, **Then** se lee como texto, sin ejecutar ni interpretar etiquetas.
3. **Given** bandas ausentes o vacías, **When** se consulta la ficha, **Then** se conserva la omisión actual del bloque, sin crear un icono huérfano ni contenido inventado.

### User Story 2 - Ver completo el logotipo del panel ampliado (Priority: P1)

Como visitante de la Home, quiero reconocer el logotipo completo del operador seleccionado, proporcional, transparente y separado del borde superior izquierdo según el ajuste solicitado.

**Why this priority**: Uniforma el tratamiento de imagen con las minitarjetas sin rediseñar el panel.
**Independent Test**: Comparar logotipos ficticios panorámicos, cuadrados y verticales, incluida la selección sucesiva de operadores.

**Acceptance Scenarios**:

1. **Given** espacio suficiente y un logotipo de cualquier proporción, **When** aparece en el panel, **Then** escala proporcionalmente hasta alcanzar primero 330 px de ancho o 110 px de alto, sin superar ninguno, sin deformación ni recorte y preservando su transparencia.
2. **Given** la posición superior izquierda anterior, **When** se aplica el ajuste, **Then** el logotipo se desplaza adicionalmente 35 px abajo y 35 px a la derecha; se conserva el espaciado anterior y no se aplica dos veces el desplazamiento.
3. **Given** espacio insuficiente para el tamaño máximo, **When** se presenta el logotipo, **Then** su tamaño se limita proporcionalmente al espacio disponible después del desplazamiento, sin desbordamientos ni solapamientos.
4. **Given** selección de otro operador o ausencia de logotipo, **When** se actualiza el panel, **Then** se conserva la interacción y el tratamiento actual de ausencia de imagen, sin logotipos residuales ni sustitutos nuevos.
5. **Given** cualquier anchura de pantalla, **When** se consulta la Home, **Then** las minitarjetas, la visibilidad actual del panel y todos los elementos ajenos al logotipo permanecen sin cambios.

### Edge Cases

- Logotipos panorámicos, cuadrados y verticales; tamaño disponible menor que los máximos solicitados.
- Imagen sin dimensiones editoriales o logotipo ausente; selección sucesiva entre operadores con y sin imagen.
- Descripciones largas: el ajuste no puede ocultar texto, métricas ni el acceso al detalle.
- Pantallas móviles donde el panel ampliado ya está oculto: no hacerlo visible como efecto de esta feature.
- Bandas vacías, texto largo y caracteres reservados: conservar presentación segura y comportamiento existente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mostrar el pictograma definitivo proporcionado para Bandas de frecuencia a 48 × 48 px, usando la misma presentación que Cobertura, Satélites, Velocidad, Latencia y Tipo de órbita.
- **FR-002**: Conservar íntegro el recurso original `frequencia.svg`, sin redibujarlo, renombrarlo, sustituirlo ni modificarlo.
- **FR-003**: Conservar los valores editoriales, su tratamiento como texto seguro y la omisión de bandas sin contenido; no cambiar modelos ni datos.
- **FR-004**: Mostrar completo el logotipo grande, con su proporción y transparencia originales, sin recortes ni deformaciones, aplicando máximos simultáneos de 330 × 110 px y escalado hasta el primer límite disponible.
- **FR-005**: Añadir exactamente 35 px abajo y 35 px a la derecha respecto al espaciado actual, una sola vez, manteniendo la referencia superior izquierda.
- **FR-006**: Respetar el espacio disponible tras ese desplazamiento, reduciendo proporcionalmente la imagen cuando proceda y evitando desbordamientos o solapamientos.
- **FR-007**: Conservar el comportamiento de selección y de logotipo ausente, así como las referencias editoriales y los archivos originales de imágenes.
- **FR-008**: Mantener sin cambios minitarjetas, visibilidad del panel por anchura, fondo, imagen principal, descripción, métricas, botón de detalle y demás secciones y fichas, salvo el pictograma indicado.
- **FR-009**: Preservar byte a byte los cambios locales de Features 008 y 009; no reabrir Feature 006 ni intervenir en Feature 005. No modificar backend, servicios, dependencias ni contenidos.

### Key Entities

- **Bandas de frecuencia**: texto editorial existente asociado a un operador; sin modificación del dato.
- **Pictograma proporcionado**: recurso visual original aprobado para identificar ese texto.
- **Logotipo de operador**: imagen editorial existente reutilizada por minitarjeta y panel ampliado; solo cambia la presentación en este último.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cada ficha con bandas muestra un único pictograma aprobado con el mismo tamaño, alineación y espaciado que sus compañeros; ninguna ficha sin bandas incorpora contenido nuevo (FR-001–003).
- **SC-002**: Para logotipos panorámicos, cuadrados y verticales, el 100 % de la imagen permanece visible, ambos máximos se respetan y la proporción original se conserva (FR-004).
- **SC-003**: La posición incorpora una sola vez los 35 px adicionales en ambos ejes y no introduce desbordamiento horizontal ni solapamiento con el contenido en las anchuras verificadas de móvil, tableta y escritorio (FR-005–006).
- **SC-004**: La selección de operadores y ausencia de logotipo conservan su resultado anterior; ningún elemento ajeno a los dos ajustes presenta cambios (FR-007–009).
- **SC-005**: El texto ficticio con etiquetas se presenta literalmente sin ejecución; no se modifica ningún valor editorial ni recurso original (FR-002–003, FR-007).

## Assumptions

- El recurso proporcionado es el definitivo y está disponible localmente en `src/assets/images/pictostecnicosLight/frequencia.svg`.
- Las tarjetas grandes solicitadas corresponden al panel ampliado de operadores de la Home; no al panel superior de la ficha individual.
- Se conserva la visibilidad actual del panel ampliado, que no aparece en móvil. La exigencia de adaptación no autoriza mostrarlo en nuevos tamaños de pantalla.
- Los 35 px son adicionales al espaciado existente y el tamaño disponible puede imponer un límite menor que 330 × 110 px.
- La QA posterior será local y proporcional, con datos ficticios y sin Chrome automatizado siempre que las comprobaciones deterministas sean suficientes. No se ha ejecutado QA de implementación en SPECIFY.
- CLARIFY no identifica decisiones funcionales pendientes; los detalles de dimensionado y verificación se resuelven en PLAN sin ampliar el alcance.
