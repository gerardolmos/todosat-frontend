# Quickstart — QA prevista, no ejecutada

Requiere IMPLEMENT autorizado, Node compatible, Python 3 y dependencias existentes, cinco originales accesibles en ruta de SPEC y Chrome. No instalar herramientas. Comprobar hashes primero.

1. `python3 tests/legal-contact/extract-documents.py --output <directorio-temporal>`: validar los cinco hashes y extraer contenido/estructura/enlaces de originales sin escribir en ellos. Archivo ausente o hash diferente: STOP de fidelidad, no inventar expected text.
2. `node scripts/test-editorial-presentation.mjs --build`: harness existente sin cambios; salida externa bloqueada antes de compilar, solo fixtures, sin .env reales. Leer ruta temporal generada; no usar build del checkout ni npm run build.
3. `node --test tests/legal-contact/*.test.mjs`: recibir mediante variables de entorno exclusivas LEGAL_QA_SOURCE y LEGAL_QA_DIST las rutas de extracción y dist temporal; comparar cuatro documentos, verificar quinto intacto/no publicado, rutas, enlaces, scripts y controles. No usar valores reales ni env completo para la compilación.
4. `node scripts/test-editorial-presentation.mjs --preview` únicamente si no existe preview vigente del mismo diff: sirve fixtures loopback. Inspeccionar las cuatro rutas a 320/768/1440, zoom 200 %, Tab/foco y correo sin activarlo. No repetir build si preview ya generó el mismo artefacto; las pruebas pueden reutilizarlo.
5. Registrar en qa.md comandos, resultados, revisión humana real, SHA de base y manifiesto del diff; datos pendientes del titular y límites tecnológicos separados de las páginas. Verificar originales y Feature 001 intactos y ausencia de dependencias/secretos/temporales versionados.

No realizar comprobaciones de buzón por envío ni afirmar legalidad definitiva. La fuente Banner se conserva externamente, no se muestra ni activa. No producción ni deploy. No marcar revisión visual PASS sin evidencia real.
