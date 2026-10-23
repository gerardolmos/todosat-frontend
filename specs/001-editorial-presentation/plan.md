# Implementation Plan: Presentación editorial

**Implementation repository**: todosat-frontend
**Dependencies**: Content API de Strapi 5.51.0 ya existente; permisos de lectura de upload actuales, aún no verificados en producción. Sin cambios backend.
**Branch**: main (sin nueva rama) | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)
**Input**: `specs/001-editorial-presentation/spec.md`, refinada por el encargo de captions vigentes.

## Summary

Mantener Astro estático. Ajustes locales de CSS y markup en Home y footer; figura principal con ancho 100 %, altura automática limitada a 550 px y recorte centrado proporcional. Resolver metadatos actuales de las imágenes del cuerpo solo durante el build mediante la API oficial upload, con identidad exacta y errores explícitos. Añadir un modo opt-in de imágenes a renderBlocks, utilizado únicamente por Noticias; llamadas existentes sin opción deben conservar su salida. No hay nueva dependencia, base de datos, endpoint ni servicio.

## Technical Context

**Language/Version**: TypeScript/JavaScript, Node >=22.12.0 (package.json); laboratorio con Node instalado compatible.
**Primary Dependencies**: Astro 7.2.4, Tailwind 4.3.0 instalados; fetch y node:test nativos. Strapi 5.51.0 consultado como dependencia externa de lectura.
**Storage**: ninguno nuevo; caché en memoria por resolución de noticia, nunca persistente ni en navegador.
**Testing**: node:test con fixtures y transporte simulado, compilación Astro en copia temporal aislada y revisión real en Chrome local. No declarar revisión visual por pruebas de strings.
**Target Platform**: sitio estático Netlify; validación solo local.
**Project Type**: web JAMSTACK.
**Performance Goals**: ninguna consulta adicional de metadatos en navegador; una resolución por identidad de imagen y resolución de noticia; máximo 4 consultas simultáneas y timeout 10 s sin reintentos automáticos. No prometer consistencia transaccional entre lecturas durante cambios editoriales simultáneos.
**Constraints**: 140 × 55 px logos, pies 14 px y contraste >=4.5:1, viewport mínimo 320 px, zoom 200 %, sin writes editoriales ni backend/permisos nuevos. No acceder a producción en esta fase.
**Scale/Scope**: tres historias; imágenes principales y bloques image de Noticias, tarjetas selectoras de Home y footer global. No otros tipos de bloques, fichas de operadores ni tienda.

## Constitution Check

Constitution 2.0.0 idéntica y alcance frontend-only. G1/G2 limitan únicamente la recuperación adicional: sin evidencia de permisos e identidad no se emite consulta, se conserva caption histórico con diagnóstico. No bloquean implementación local ni publicación. G3 exige laboratorio sin .env real ni tráfico externo antes de builds. No se modifica backend, permisos o credenciales.
El incidente Railway impide cualquier actuación productiva en esta misión. Las futuras operaciones productivas conservan los gates de `docs/sdd` y su aprobación separada; no se ejecutan backups, rotaciones ni despliegues aquí.

## Project Structure

### Documentation (this feature)

`spec.md`, `checklists/requirements.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/presentation-and-media.md`, `quickstart.md`, `tasks.md`. QA se registrará en `qa.md` durante implementación, no fingir resultados ahora.

### Source Code (repository root)

- Existentes: `src/components/HomeOperatorsSection.astro`, `src/components/Footer.astro`, `src/pages/noticias/[slug]/index.astro`, `src/lib/renderBlocks.ts`, `src/lib/content.ts`, `src/lib/api.ts`, `src/lib/media.ts`.
- Propuestos: `src/lib/news-media.ts` (resolución pura con transporte inyectable), `src/components/NewsImage.astro` (figura principal).
- Pruebas propuestas: `tests/editorial-presentation/{fixtures,media.test.mjs,render.test.mjs,home.test.mjs,footer.test.mjs,integration.test.mjs}` y `scripts/test-editorial-presentation.mjs` (laboratorio temporal).

**Structure Decision**: no modificar consultas globales de getNoticias para añadir lecturas de biblioteca en listados o búsqueda; resolver imágenes del cuerpo al construir las páginas individuales, con caché por resolución de noticia. Reutilizar fetch server-side sin imprimir tokens, URLs privadas o respuestas completas. Evitar mutar el objeto de noticia: generar modelos de presentación independientes.

## Design and execution gates

1. Medio principal: `getNoticias()` ya incluye `populate[imagen_principal]=true`. El caption es atributo del registro relacionado vivo; se conserva antes de pasar URL a getImage. Una edición del medio se ve en el siguiente build exitoso sin republicar la noticia por ese mero cambio de metadatos. No se ha comprobado contenido real.
2. Bloques: el endpoint antiguo /api/upload/files NO garantiza límite anidado. Única alternativa paginada: /api/upload/files/page, filtros exactos y límite 2, data/meta. Su permiso findPage no está acreditado. En esta implementación no se conecta ningún transporte real: se conservan captions incorporados con diagnóstico. El resolvedor admite transporte inyectado exclusivamente en pruebas; habilitar recuperación real requeriría evidencia y revisión separada, sin cambio automático de permisos.
3. Caption vacío verificado elimina pie. Fallo, identidad incompleta, acceso no acreditado o respuesta ambigua conservan caption histórico cuando existe, con fuente explícita en diagnóstico/QA. No se descarga biblioteca completa ni se bloquea build por esta causa.
4. En renderBlocks, opción explícita para renderizar image con mapa ya resuelto; sin llamadas HTTP ni cambios a los demás bloques. Escapar caption/alt/atributos; validar URL de imagen; no ampliar sanitización general de todo el renderizador en esta feature.
5. Imágenes: `figure/img/figcaption`, ancho 100 % y altura auto en principal y límite al ancho del cuerpo. Solo principal: max-height 550 px, object-fit cover y object-position center; cuerpo completo sin recorte. Color del pie medido sobre su fondo real. Mantener alt editorial disponible y no usar caption como sustituto.
6. QA antes de cierre: casos del contrato, dependientes compartidos, diseño adaptable y teclado reales, revisión de diff y ausencia de escrituras/secretos. No ejecución en este PLAN.

## Complexity Tracking

Sin excepciones constitucionales ni infraestructura adicional. G1 no verificado: recuperación adicional inactiva; fallback autorizado permite completar la feature.
