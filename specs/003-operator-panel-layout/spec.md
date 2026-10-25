# Feature Specification: Distribución del panel ampliado de operadores

**Scope**: frontend-only
**Repository**: todosat-frontend
**Feature Branch**: no creada; trabajo local en main, ID `003-operator-panel-layout`
**Created**: 2026-10-24
**Status**: Especificada
**Input**: Ajuste visual acotado autorizado por Gerard del panel ampliado de Home.

## User Scenarios & Testing

### User Story 1 - Leer el operador seleccionado (Priority: P1)
El visitante ve el logo arriba y el nombre, órbita y descripción agrupados abajo, antes de los pictogramas.
**Why this priority**: Es el cambio principal; mejora la distribución sin alterar información ni interacción.
**Independent Test**: Seleccionar operadores ficticios con descripciones cortas y largas en Home y comprobar distribución y lectura completa.
**Acceptance Scenarios**:
1. **Given** una descripción corta, **When** se muestra el panel, **Then** logo arriba a la izquierda, espacio flexible debajo y bloque compacto de nombre, órbita y descripción al final antes del divisor.
2. **Given** una descripción larga o nombre largo, **When** se selecciona, **Then** todo el texto sigue accesible, sin truncado, solapamientos ni desbordamiento horizontal; puede utilizarse el desplazamiento interno existente.
3. **Given** móvil o tableta, **When** se visita Home, **Then** se conserva la visibilidad actual del panel y las tarjetas existentes, sin desbordamientos nuevos.
4. **Given** otro operador seleccionado, **When** cambia el panel, **Then** los pictogramas, enlaces, logo y contenido corresponden al mismo operador como antes.

### User Story 2 - Descripción adecuada en cada contexto (Priority: P1)
Conservar la descripción breve blanca en la ficha y reservar la descripción gris del panel para Home.
**Why this priority**: Ajuste final solicitado expresamente por el propietario.
**Independent Test**: Con ambos textos ficticios, la ficha muestra solo la descripción breve y la Home conserva la del panel.
**Acceptance Scenarios**:
1. **Given** ambas descripciones, **When** se abre la ficha, **Then** muestra la breve y omite la del panel.
2. **Given** el mismo operador, **When** se abre Home, **Then** conserva su descripción del panel sin cambios.
3. **Given** descripción breve vacía, **When** se abre la ficha, **Then** no se sustituye por la descripción del panel.

### Edge Cases
- Descripción extensa: lectura completa mediante desplazamiento existente.
- Nombre largo y palabras extensas: ajuste de línea sin invasión lateral.
- Logo ausente: conservar su ocultación y la colocación inferior del texto.

## Requirements

### Functional Requirements
- **FR-001**: Conservar logo superior izquierdo, proporción y padding existente del panel ampliado.
- **FR-002**: Reducir ligeramente nombre y agruparlo con órbita y descripción, con separación compacta.
- **FR-003**: Situar el grupo al final del espacio previo al divisor; colocar el espacio flexible entre logo y nombre.
- **FR-004**: Conservar descripción completa y accesible independientemente de su longitud, sin solapamientos ni desbordamiento horizontal.
- **FR-005**: Conservar pictogramas, interacciones, enlaces, tarjetas pequeñas, fichas individuales salvo FR-006, otras páginas y visibilidad adaptable existentes.

- **FR-006**: La ficha individual debe conservar la descripción breve y dejar de mostrar la descripción del panel; Home conserva esta última. No modificar campos, contenidos, imágenes ni información técnica.

## Success Criteria

### Measurable Outcomes
- **SC-001**: Con texto corto, logo alineado arriba y grupo inferior antes del divisor; nombre visiblemente menor que antes.
- **SC-002**: En 320, 768, 1280 y 1440 px no aparecen desbordamientos nuevos; donde el panel es visible, texto corto y extenso resultan íntegramente accesibles.
- **SC-003**: Seleccionar dos operadores actualiza sus datos y conserva pictogramas y enlace de destino; ninguna modificación fuera del panel ampliado salvo la retirada de descripción de FR-006.

- **SC-004**: En la ficha ficticia aparece «Descripción preservada» y no «Panel preservado»; Home conserva «Panel preservado».

## Assumptions
- Se mantiene el panel oculto por debajo del ancho de escritorio amplio actual; no se crea una presentación móvil nueva.
- Reducir un escalón tipográfico y conservar el desplazamiento interno para texto largo son decisiones menores de diseño autorizadas.
- Sin cambios de datos, APIs, dependencias, Features 001/002 ni producción.
- CLARIFY: revisión de alcance, datos, UX, límites, integraciones, terminología y aceptación sin ambigüedades relevantes. No se requieren preguntas.

## Clarifications
### Session 2026-10-25
- Decisión expresa del propietario: retirar solo la descripción gris en ficha, conservar blanca y Home. Ampliación controlada de Feature 003 abierta; no reabrir Features 001/002 ni modificar la implementación aprobada de imagen/información técnica de Feature 004. Sin dudas pendientes.
