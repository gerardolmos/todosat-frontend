# Implementation Plan: Home noticias
**Implementation repository**: todosat-frontend; frontend-only.
**Dependencies**: contratos actuales de lectura compatibles; diagnóstico ya acreditado, sin nuevas consultas productivas.
**Branch**: main sin cambios; selector Spec Kit 009-home-news-sections | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)
**Input**: contrato del propietario; base frontend eb18708aaa4f50d27bec7d3f4adced5388a7471b. Backend de referencia 9921ee5f00ecd0aff0882b1078e39c748d236b58, no modificado.

## Summary
Una sola lectura getNoticias existente alimenta dos selecciones en build. No modificar consultas compartidas ni esquema. Seleccionar/deduplicar/ordenar antes de limitar: destacadas hasta cuatro; generales excluyen sus identidades y toman siete. Conservar íntegramente invocación, import, lectura getDestacados y separador condicional de HomeFeaturedSection en index; recomendaciones mixtas fuera de la corrección.
Reutilizar HomeArticlesSection con título y presencia de tarjeta como props. Su markup, clases, ArticleCard y tarjeta original permanecen iguales; no copiar ni crear otro componente de tarjeta. Dos instancias: destacadas sin CTA (solo si hay documentos), Noticias siempre con CTA. No reutilizar HomeFeaturedSection para noticias: su tarjeta y sus datos pertenecen a otra colección.

## Technical Context
**Language/Version**: TypeScript/JavaScript, Astro existente (^7.2.4).
**Primary Dependencies**: solo las instaladas; ninguna nueva.
**Storage**: ninguno nuevo; build estático con lectura contractual published/activo existente.
**Testing**: node:test y harness aislado basado en patrón local, con fixtures, sin .env real ni salida de red. No ejecutar ahora.
**Target Platform / Project Type**: Astro estático / Netlify, sin cambios de infraestructura.
**Performance Goals**: una obtención de noticias, sin consultas adicionales; orden O(n log n), selección O(n).
**Constraints**: sin datos reales, SDK, backend, commits, pushes ni deploys; preservar 006/008.
**Scale/Scope**: dos bloques de Home; máximos 4+7 tarjetas de noticia y una CTA.

## Constitution Check
Antes y después del diseño: PASS. Constitution 2.0.0 idéntica byte a byte y hash 496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7 verificado con referencia local. Alcance frontend-only, autoridad única, sin operaciones productivas, mínimo cambio reversible. No hay violaciones ni gates de producción ejecutados. No se reabre 006: nueva decisión sustituye comportamiento de Home, no histórico.
SPECIFY/CLARIFY PASS (16/16); revisión documental SPEC/PLAN/contrato sin contradicciones. TASKS generado por autorización posterior del propietario; ANALYZE formal se informa en la entrega de esta fase. IMPLEMENT/QA/CONVERGE permanecen pendientes; no se autorizan por este plan.

## Project Structure
Artefactos: spec.md, checklists/requirements.md, plan.md, research.md, data-model.md, contracts/home-news.md y quickstart.md en este directorio. tasks.md generado en su fase; qa.md se generará durante IMPLEMENT, sin adelantar evidencia.
Archivos funcionales previstos (no modificados):
- src/lib/news-home.ts: añadir selector de las dos listas; conservar export legado selectFeaturedNews para no alterar contrato/pruebas históricos de 006, sin usarlo en Home nueva.
- src/pages/index.astro: usar nuevo selector, preservar consumo y posición Home de getDestacados/HomeFeaturedSection, colocar las dos secciones y separadores correspondientes.
- src/components/HomeArticlesSection.astro: props explícitas de título y CTA; mismo markup/clases/diseño y enlace /noticias. Valores por defecto compatibles con uso anterior.
Nuevas pruebas previstas: tests/home-news-sections/news.test.mjs, markup.test.mjs y build.mjs. Reutilizar patrón de harness existente sin editar suites de 006/008.
Sin cambios: src/lib/content.ts, HomeFeaturedSection, FeaturedCard, ArticleCard, componentes Operadores/Hardware/Manuales, Layout, Footer, backend y documentos legales.

## Diseño y validación
Aplicar contracts/home-news.md y data-model.md. Orden final: hero/búsqueda existentes, Operadores, Recomendados por TodoSatcom (condición actual intacta), Noticias destacadas (si no vacía), Noticias, Hardware, Manuales. Mantener estilos de bloques y separadores existentes; ajustar únicamente separadores de las dos secciones de noticias; no tocar el separador condicional de Recomendados.
Pruebas: matriz de SPEC con fixtures y permutaciones de entrada; CTA original comparada con base y única en HTML; comprobar orden de secciones, preservación de Recomendados y bloques no afectados intactos. Build aislado solo en IMPLEMENT autorizado. No QA general ni navegador en esta fase.

## Colisiones y límites
008 modifica Footer/Layout y añade consentimiento/pruebas/SDD; ninguno de los tres archivos funcionales previstos se cruza. No incluir ni revertir su diff. El selector ignorado .specify/feature.json apunta ahora a 009, como requiere Spec Kit; para retomar 008 se seleccionará su directorio sin cambiar sus artefactos. No modificar código ni colección Destacados; su uso Home sigue activo según su condición actual. Ningún dato de producción se ha consultado para este plan.
