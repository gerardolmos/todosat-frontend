# Implementation Plan: Ajustes visuales de operadores

**Implementation repository**: todosat-frontend — frontend-only
**Dependencies**: recursos y dependencias instalados; ninguna dependencia nueva ni servicio externo.
**Branch**: main (selector SDD 010-operator-visual-adjustments, no rama Git creada) | **Date**: 2026-10-27 | **Spec**: [spec.md](spec.md)
**Input**: SPEC aprobada y CLARIFY completado. PLAN preparado; IMPLEMENT no ejecutado.

## Summary

Importar el SVG original y asignarlo al elemento Bandas de frecuencia en la ruta de operador, reutilizando el render común de 48 × 48 px. Ajustar exclusivamente la imagen del logotipo seleccionado del panel Home y su espacio inmediato, sin cambiar minitarjetas ni otros contenidos.

## Technical Context

**Language/Version**: Astro y TypeScript existentes; Node >=22.12.0 según package.json.
**Primary Dependencies**: Astro ^7.2.4 y Tailwind ^4.3.0 declarados; usar instalación y lockfile existentes sin actualizar.
**Storage**: ninguno nuevo; datos y recursos editoriales sin cambios.
**Testing**: node:test/assert y render Astro con fixtures locales; medición visual manual local cuando haga falta verificar layout real.
**Target Platform**: sitio Astro estático, navegadores actuales; sin Chrome automatizado.
**Project Type**: frontend web.
**Performance Goals**: ningún consumidor remoto, dependencia ni lógica de red nueva; no añadir manejadores de selección.
**Constraints**: preservar 008/009 byte a byte y resto de producto; no producción, backend, datos, instalaciones, commits o publicación.
**Scale/Scope**: dos archivos de producto y dos recorridos independientes; SVG original reutilizado intacto.

## Constitution Check

PASS antes y después del diseño: Constitution 2.0.0 y procedencia controlada verificadas; alcance frontend-only, autoridad local de SPEC, sin cambio de API/datos. Orden SDD respetado, trabajo reversible por hunks propios sin descartar cambios previos. QA proporcional aislada con evidencia real, no prometer PASS antes de ejecutar. Features 005/006 excluidas; 008/009 preservadas. Publicación y CONVERGE requieren fases/autorizaciones posteriores. No hooks configurados.

## Project Structure

Documentos: spec.md, checklists/requirements.md, plan.md, research.md, data-model.md, contracts/presentation.md, quickstart.md y tasks.md en este directorio. En IMPLEMENT, qa.md y baseline.json conservarán evidencia mínima.

Archivos de producto a modificar, exclusivamente:
- `src/pages/operadores/[slug]/index.astro`: import SVG y asignación a icon, conservando interpolación y filtro de datos.
- `src/components/HomeOperatorsSection.astro`: tamaño/posición del logo seleccionado; solo marcado/clases locales y, si necesario, wrapper inmediato sin modificar la selección.

Recurso a reutilizar SIN modificar: `src/assets/images/pictostecnicosLight/frequencia.svg`.
Pruebas nuevas aisladas: `tests/operator-visual-adjustments/presentation.test.mjs`, `render.mjs` y `fixtures.mjs`. No editar harness ni tests de 008/009.

## Diseño mínimo

US1: reutilizar importación de recursos y renderer existente `item.icon.src`, `h-12 w-12 object-contain`. Mantener `{item.value}` y filtro de datos, sin `set:html` ni nuevas transformaciones.

US2: conservar `data-selected-logo`, src/alt y actualización existente de dimensiones y visibilidad. Usar un área de imagen de ancho `min(330px, espacio interior disponible - 35px)` y alto 110px, con `object-fit: contain` y `object-position: left top`; la imagen visible se adapta hasta el primer límite sin deformarse, aunque el área de imagen tenga otra proporción. El área no tendrá fondo ni marco. Esto reutiliza el comportamiento contain/transparencia de las minitarjetas, no sus límites 140 × 55.

Aplicar margen superior e izquierdo de 35px sobre el logo respecto al flujo actual, manteniendo `p-8`. No combinar margen con transform/offset que duplique el movimiento. Mantener shrink-0 y alineación izquierda. La altura disponible del texto y su scroll existente no deben provocar pérdida de descripción o botón; comprobarlo con texto largo. La reducción de ancho descuenta el margen izquierdo. No tocar los breakpoints: panel oculto antes de xl, visible desde xl.

Medir tanto el área de imagen como la imagen visible: un rectángulo 330 × 110 por sí solo no demuestra proporción ni ausencia de recorte. Si el CSS existente impide cumplirlo, ajustar únicamente las reglas del logo dentro del archivo autorizado; no rehacer el panel.

## Validación y riesgos

Matriz exacta y ejecución en quickstart.md. Proporciones, desplazamiento, ancho disponible, dimensiones editoriales ausentes, selección, texto largo y conservación de minitarjetas son los riesgos relevantes. QA de render sin tráfico y revisión manual local de geometría; no basta buscar clases. No repetir suites/builds generales de otras features. Un render/compilación mínimo aislado de los componentes afectados es admisible en IMPLEMENT; nunca usar el build ordinario contra Strapi.

## Complexity Tracking

Sin excepciones constitucionales, nuevos servicios, modelos o abstracciones compartidas.
