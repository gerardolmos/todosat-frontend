# Feature Specification: Imagen y datos técnicos de ficha de operador
**Scope**: frontend-only
**Repository**: todosat-frontend
**Feature Branch**: main; identificador 004-operator-detail-presentation, sin rama nueva
**Created**: 2026-10-25
**Status**: Especificada
**Input**: Imagen superior derecha cubriendo el marco sin deformarse; comprobar información técnica con datos ficticios y corregir solo regresiones demostradas.

## User Scenarios & Testing
### User Story 1 - Ver la portada completa del marco (Priority: P1)
El visitante ve la imagen ocupando toda la superficie de su marco, con recorte centrado proporcional si es necesario.
**Why this priority**: Cambio visual principal aprobado.
**Independent Test**: Fichas ficticias con imágenes horizontal y vertical en móvil y escritorio.
**Acceptance Scenarios**:
1. **Given** imagen horizontal o vertical, **When** se muestra, **Then** no quedan bandas vacías, el recorte es centrado y no hay deformación.
2. **Given** ficha sin imagen, **When** se abre, **Then** se conserva la omisión del marco y el resto de la ficha.

### User Story 2 - Consultar información técnica disponible (Priority: P1)
El visitante puede consultar todos los apartados rellenados; los vacíos no inventan información.
**Why this priority**: Aclarar si el ejemplo limitado representa un defecto real.
**Independent Test**: Contrastar ejemplo de solo órbita, ficha completa y apartado con descripción sin valor.
**Acceptance Scenarios**:
1. **Given** solo órbita rellenada, **When** se abre la ficha, **Then** aparece únicamente ese apartado.
2. **Given** cinco apartados rellenados, **When** se abre la ficha, **Then** se muestran cobertura, satélites, velocidad, latencia y órbita con sus valores y descripciones.
3. **Given** descripción sin valor, **When** se abre, **Then** el apartado conserva esa descripción.

### Edge Cases
Imagen ausente, imagen vertical, campos técnicos vacíos y descripción técnica sin valor.

## Requirements
### Functional Requirements
- **FR-001**: La imagen superior derecha debe cubrir su marco sin zonas vacías, conservar proporciones y recortarse centrada.
- **FR-002**: Conservar logos, etiquetas, enlaces y demás contenido de la ficha, sin desbordamiento nuevo en móvil o escritorio.
- **FR-003**: Mostrar cada apartado técnico con valor o descripción disponible y conservar su contenido; omitir apartados vacíos.
- **FR-004**: Identificar en QA si la limitación observada procede del ejemplo local; corregir el render técnico únicamente si hay regresión demostrada.

## Success Criteria
### Measurable Outcomes
- **SC-001**: Imágenes horizontal y vertical llenan el marco a 320 y 1440 px, con recorte centrado y sin deformación.
- **SC-002**: Casos técnicos muestran respectivamente uno y cinco apartados; descripción sin valor visible.
- **SC-003**: Ningún cambio en Home, features anteriores, datos o backend; no conexiones productivas.

## Assumptions
- El marco de imagen conserva su proporción de presentación actual; se elimina el padding interior para cubrirlo.
- No se pretende igualar la altura de ambas columnas ni rediseñar la ficha.
- CLARIFY: alcance, comportamiento, casos límite y aceptación claros; no preguntas imprescindibles. Solo fixtures locales, sin datos reales.
