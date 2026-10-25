# Implementation Plan: Ficha de operador
**Implementation repository**: todosat-frontend
**Dependencies**: solo dependencias instaladas.
**Branch**: main | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

## Summary
En src/pages/operadores/[slug]/index.astro, trasladar aspect-ratio 16/11 al marco, eliminar padding interior y colocar imagen absoluta inset-0, h-full/w-full, object-cover/object-center. Conservar etiquetas superpuestas y demás markup. Verificar render técnico mediante API ficticia con todos los campos; no modificarlo si funciona.

## Technical Context
**Language/Version**: Astro 7.2.4, Tailwind 4.3.0, Node instalado.
**Primary Dependencies**: sin nuevas.
**Storage**: ninguno.
**Testing**: build aislado con harness existente copiado a laboratorio temporal; ampliar exclusivamente fixtures temporales. Inspección HTML de apartados y navegador integrado para geometría a 320/1440, sin Chrome ni zoom.
**Target Platform**: web estática adaptable.
**Project Type**: frontend JAMSTACK.
**Performance Goals**: cero peticiones adicionales en runtime.
**Constraints de implementación**: sin backend, producción ni .env real. El cierre posterior autoriza CONVERGE y un commit local exclusivo de Feature 004; no push ni despliegue.
**Scale/Scope**: una ruta; dos historias pequeñas.

## Constitution Check
PASS antes/después del diseño. Constitution 2.0.0 y hash controlado verificados. Entorno ficticio, red externa bloqueada; cambios reversibles y acotados; QA sobre revisión/diff exactos. Feature 003 está cerrada mediante commit e806b5418caff853bd96db1f99a681dccc10d704. Su retirada de la descripción gris pertenece exclusivamente a Feature 003 y se preserva íntegra.

## Project Structure
- src/pages/operadores/[slug]/index.astro: único cambio funcional previsto.
- specs/004-operator-detail-presentation/: spec, checklist, plan, research, data-model, contracts/presentation.md, quickstart, tasks y qa.
- Harness y fixtures existentes se copian fuera del repositorio, sin modificar Features 001–003.
**Structure Decision**: no componentes, APIs ni dependencias nuevos.

## Complexity Tracking
Sin excepciones.
