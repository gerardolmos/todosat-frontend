# TodoSatcom — instrucciones SDD

Constitution local es copia controlada: no editar originalmente. Comprobar hash y procedencia en docs/sdd/governance-reference.json; discrepancia bloquea trabajo afectado. Gobernanza común en todosat-backend; frontend-only se especifica localmente.

- Antes de acciones o hooks, leer `.specify/memory/constitution.md` y documentos operativos aplicables. Constitution prevalece sobre defaults y ejemplos de Spec Kit; los hooks no amplían el alcance autorizado.
- Flujo: SPECIFY → CLARIFY → PLAN → TASKS → ANALYZE → IMPLEMENT → CONVERGE. Herramientas no autorizan omitir etapas.
- SPEC/PLAN/TASKS/QA locales junto a implementación. Cross-repo según Constitution 2.0.0: ID común; backend coordina cambios de contratos/datos/permisos/eventos/reglas backend, frontend cambios visibles con contratos compatibles; backend desempata. SPEC global única y QA sobre pareja exacta de SHAs.
- Separar preparar, modificar, commit, push/merge, deploy y datos/producción. No producción sin aprobación explícita y gates satisfechos. Respetar el flujo editorial ordinario ya autorizado.
- Firewall absoluto con otros proyectos; no importar sus contenidos ni revelar secretos.
- Spec Kit 1.1.0 tiene adaptaciones locales: consultar procedencia antes de actualizar; no restaurar defaults que contradigan Constitution.
- Transición EN CURSO: histórico preservado y no retirado. No asumir autoridad operativa cerrada ni pendientes resueltos.

- Cross-repo: el `spec.md` del repo no coordinador es una referencia con ID común, repositorio/ruta y revisión de la SPEC global. Resolver y leer esa revisión antes de usar skills que consumen la SPEC; no tratar la referencia como requisitos completos ni crear otra autoridad. Si falta acceso o revisión identificada, detener el trabajo afectado. No asumir rutas hermanas.
- QA se conserva localmente con revisión exacta y, si hay cambios sin commit, identificación de ese diff. En cross-repo, registrar pareja `{ frontend SHA, backend SHA }`, compatibilidad y orden/estado de deploy. La evaluación de CONVERGE no sustituye este registro de QA.
