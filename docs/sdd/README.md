# Gobernanza SDD frontend

Constitution local es copia controlada de todosat-backend. Verificar versión, SHA-256 y procedencia en governance-reference.json; no editar originalmente. La gobernanza común se custodia en backend; transición EN CURSO, aún sin cierre operativo.

Consultar risks.md, production-gates.md, backlog.md y adr/ en docs/sdd de todosat-backend por revisión identificada. authority_commit permanece null: esta migración no tiene commit de origen nuevo. Hasta existir revisión publicada, identificar el snapshot local exacto mediante su hash y registro de migración; no tratar el HEAD anterior como si incluyera los documentos nuevos. Si no se puede identificar o acceder a la revisión aplicable, detener trabajo afectado.

Documentos frontend-only permanecen en este repositorio; SPEC/PLAN/TASKS/QA por feature en specs/. No duplicar riesgos ni decisiones comunes. Para cross-repo, SPEC global única en coordinador y referencia local por repo/ruta/revisión. No asumir rutas hermanas.

Spec Kit 1.1.0 procede del repositorio histórico local SDD, HEAD c73cbd545c699f0c4982bad31ad396771577bfd7. Adaptaciones e inventario: docs/sdd/governance-history.md del backend. Los manifiestos de instalación originales conservan hashes y fechas del origen, no certifican los archivos adaptados como originales. El histórico permanece intacto y no retirado.
