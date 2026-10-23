# Research — revisión aprobada 2026-10-23

La inspección de Strapi 5.51.0 confirma que upload.findMany pasa query al transformador que procesa limit plano, no pagination[limit]. El PLAN anterior asumía incorrectamente límite 2 en /api/upload/files. La documentación oficial https://docs.strapi.io/cms/api/rest/upload advierte que esa ruta no pagina. No utilizarla ni descargar toda la biblioteca.

La ruta oficial /api/upload/files/page usa findAndCountPage, transforma paginación anidada y devuelve data/meta. Su scope findPage no está admitido por tokens read-only (solo find/findOne); un token custom necesitaría permiso existente correspondiente. No se han leído credenciales ni comprobado permisos productivos. No habilitar consultas reales por inferencia.

Decisión proporcionada: imagen principal usa caption del populate existente; bloques usan caption histórico diagnosticado mientras no haya consulta acotada autorizada. Implementar resolución pura con transporte inyectable para probar actualización inequívoca y fallos sin afectar publicación. No conectar transporte real, añadir flags de configuración, permisos o endpoints. Ausencia de verificación no equivale a ausencia de caption.

Los bloques copian caption/hash/provider/url al insertar y excluyen id/documentId (content-manager Blocks/Image.js); upload.updateFileInfo solo actualiza file, no bloques. No sincronización editorial ni asociaciones por nombre. Comparación exacta hash/provider/url, sin eliminar versiones o transformaciones. Caption actual vacío prevalece sobre histórico si se acredita.

Alternativas descartadas: descarga completa, búsquedas por nombre, modificación backend/permisos, fallo global de build por metadatos secundarios. La última fue sustituida por aprobación expresa de FR-007 y SC-003 el 2026-10-23.

Presentación: imágenes completas de altura automática; logos 140×55; pie 14 px con contraste medido; escape de nuevos captions/alt/URL. renderBlocks opt-in solo Noticias, regresión de salida por defecto en otros consumidores. Footer conserva año de build.

Validación: fixtures locales, entorno sin .env reales, aislamiento de red demostrado, node:test y build Astro, revisión real de navegador cuando accesible. Ninguna evidencia local acredita captions productivos. Sin dependencias adicionales ni cambios de arquitectura.
