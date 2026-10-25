# Implementation Plan: Distribución del panel ampliado
**Implementation repository**: todosat-frontend
**Dependencies**: Astro y Tailwind instalados; ninguna nueva.
**Branch**: main (selector Spec Kit: 003-operator-panel-layout) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md)

## Summary
Cambio inicial: bloque previo al divisor en HomeOperatorsSection. Contenedor flex vertical de 550 px con scroll existente, logo sin encogimiento alineado al inicio y grupo de texto con margin-top:auto y separación superior mínima. Nombre de 48 a 36 px; márgenes internos de 12 y 16 px. El grupo no se encoge: cuando excede espacio se desplaza íntegro dentro del área existente.

## Technical Context
**Language/Version**: Astro 7.2.4, HTML y clases Tailwind 4.3.0 existentes.
**Primary Dependencies**: las instaladas; sin instalaciones.
**Storage**: no aplica.
**Testing**: build aislado con harness existente y comprobaciones de geometría/render mediante navegador integrado, nunca Chrome ni zoom.
**Target Platform**: web estática; 320, 768, 1280 y 1440 px.
**Project Type**: frontend JAMSTACK.
**Performance Goals**: ninguna petición, script o dependencia añadida.
**Constraints**: únicamente fixture local; no .env real, producción, backend, commits ni CONVERGE.
**Scale/Scope**: bloque del panel Home y retirada de un párrafo en ficha individual, sin otros cambios.

## Constitution Check
PASS antes y después de diseño: Constitution 2.0.0 y hash coincidentes con referencia controlada. Frontend-only, SDD completo antes de código, alcance reversible, QA sobre SHA y diff, evidencia honesta, sin operaciones externas. No excepciones.

## Project Structure
- src/components/HomeOperatorsSection.astro: cambio inicial preservado.
- src/pages/operadores/[slug]/index.astro: retirar únicamente condicional de marca.descripcion_home; conservar marca.descripcion_corta y resto byte a byte.
- specs/003-operator-panel-layout/: spec, checklist, plan, research, data-model, contracts/panel.md, quickstart, tasks y qa.
- scripts/test-editorial-presentation.mjs: reutilizado sin modificar; fixture de descripción extensa solo en salida temporal de laboratorio.
**Structure Decision**: conservar estructura y script existentes; sin componentes ni infraestructura nuevos.

## Complexity Tracking
Sin excepciones ni complejidad adicional.

## Ajuste final autorizado — 2026-10-25
Retirar solo el párrafo que renderiza descripcion_home en la ficha individual. Home intacta. QA selectiva: build aislado existente y comparación del HTML visible en ficha/Home; no repetir matriz visual ni zoom. Preservar las dos clases de portada de Feature 004 y toda la sección técnica.
