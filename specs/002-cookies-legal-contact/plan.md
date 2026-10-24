# Implementation Plan: Cookies, legales y contacto

**Implementation repository**: todosat-frontend; frontend-only.
**Dependencies**: cinco DOCX locales aprobados, identificados por hash en SPEC; herramientas y dependencias ya instaladas.
**Branch**: main (selector Spec Kit 002-cookies-legal-contact, no rama nueva) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md)
**Input**: SPEC y decisiones literales aprobadas el 2026-10-24.

## Summary

Integración estática y manual de cuatro documentos en sus rutas Astro existentes, mediante HTML semántico y LegalPage. Conservar texto, estructura y enlaces; ninguna generación de código jurídico ni runtime de documentos. Banner permanece como original externo referenciado por hash, sin importarlo en páginas o public. Diagnóstico de servicios futuros y datos legales pendientes solo en SDD. Feature 001 permanece intacta; decisión visual incorporada a SPEC antes de implementar.

## Technical Context

**Language/Version**: Astro/TypeScript existente; Node >=22.12.0; Python 3 estándar para lectura OOXML de prueba.
**Primary Dependencies**: Astro 7.2.4/Tailwind 4.3.0 existentes; sin dependencias nuevas.
**Storage**: contenido estático de cuatro páginas; sin cookies, preferencias ni base de datos nuevas.
**Testing**: node:test, extracción OOXML con zipfile/ElementTree estándar y comparación del HTML construido; Chrome manual aislado.
**Target Platform**: sitio estático; solo laboratorio local en esta entrega.
**Project Type**: JAMSTACK.
**Performance Goals**: ningún JS, petición externa ni almacenamiento adicional por esta feature.
**Constraints**: literalidad, rutas existentes, no producción ni .env reales; sin Google/CMP/banner operativo; no modificar tienda, originales ni Feature 001.
**Scale/Scope**: cuatro páginas y cinco fuentes documentales; no construir importador universal DOCX.

## Constitution Check

Pre-diseño y post-diseño: PASS. Constitution 2.0.0 controlada, hash en SPEC; frontend coordina sin contratos backend nuevos. Etapas anteriores completadas; PLAN no implementa. Originales y Feature 001 inmutables. Pruebas con copia temporal aislada, sin credenciales; bloqueo de salida externa verificado antes de compilar. Identidad del titular y fidelidad tecnológica definitiva son gates de publicación, no desarrollo. Sin commits/push/deploy. Noindex no equivale a control de acceso ni autorización legal. Sin excepciones constitucionales.

## Project Structure

### Documentation (this feature)

spec.md y checklist existentes; plan.md, research.md, data-model.md, contracts/legal-presentation.md, quickstart.md y tasks.md. qa.md se creará durante IMPLEMENT con evidencia real y manifiesto del diff, no ahora.

### Source Code (repository root)

Modificar exclusivamente src/pages/aviso-legal.astro, privacidad.astro, cookies.astro y contacto.astro. Reutilizar src/components/LegalPage.astro, Layout, Header, Footer y estilos sin cambios por defecto. Si legibilidad requiere ajuste, limitarlo a LegalPage (no participó en Feature 001), comprobar sus cuatro consumidores; no alterar CSS global.

Añadir durante IMPLEMENT tests/legal-contact/{extract-documents.py,fidelity.test.mjs,scope.test.mjs}. La extracción lee originales externos, no crea copias DOCX ni introduce textos esperados duplicados en Git. Resultados normalizados y HTML quedan en temporal. Banner se verifica mediante hash y extracción frente al original identificado, y ausencia del texto/controles en salida; no se publica ni se crea página para él.

**Structure Decision**: HTML estático por página es suficiente. Un extractor solo de QA obtiene secuencia de títulos, párrafos, saltos, listas y enlaces de los cinco documentos. Un documento cambiado de hash requiere revisión antes de integrar, no actualización automática. Reutilizar sin editar scripts/test-editorial-presentation.mjs --build/--preview como laboratorio existente con fixtures ficticios; no añadir harness paralelo. Ejecutar pruebas legales sobre su dist temporal. Nunca npm run build en checkout ni postbuild/deploy.

## Complexity Tracking

Sin arquitectura, infraestructura, dependencias ni excepciones nuevas. Validación proporcional: fidelidad de los cuatro textos completos, fuente Banner intacta y no expuesta, navegación/seguridad de presentación, revisión visual y diff acotado.

## Ajuste visual autorizado — 2026-10-24
Conservar arquitectura estática. LegalPage concentra cabecera oscura, título en una columna centrada de máximo 48rem y cuerpo claro con tarjeta blanca, tipografía y espacios adaptables. Sin alturas rígidas; altura mínima del conjunto header/main/footer igual al viewport, con main flexible únicamente en páginas legales. Reutilizar colores existentes de identidad (slate/sky) mediante CSS local. Prop opcional contact en LegalPage, activada solo por Contacto, para separar visualmente su correo con display:block y mantener el enlace al tamaño del texto principal, sin caja decorativa y sin insertar palabras, alterar el párrafo semántico ni duplicarlo. No tocar los archivos Layout/Header/Footer/CSS global. LegalPage aplica body:has(> .legal-page) con min-height:100vh/100svh y flex columna; main flex:1, sin posicionar footer. El selector solo coincide con sus cuatro rutas. No scripts nuevos. Pruebas literales existentes conservadas; repetir build aislado y suite legal por cambio compartido. QA anterior visual queda histórica; T009/T015 requieren reverificación y T016/T017 aprobación estética nueva.
