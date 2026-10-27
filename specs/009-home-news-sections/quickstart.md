# Quickstart — validación futura
No ejecutado en PLAN. Tras TASKS, ANALYZE y autorización de IMPLEMENT:
1. Registrar base y diffs ajenos (008); trabajar solo en paths PLAN.
2. Crear pruebas de matriz antes del selector; ejecutar `node --test tests/home-news-sections/news.test.mjs tests/home-news-sections/markup.test.mjs` con runtime existente.
3. Crear harness conforme al patrón local y ejecutar `node tests/home-news-sections/build.mjs`: copia temporal sin .env, fixtures ficticios y red externa bloqueada; no usar npm run build sobre checkout con entorno real. Comandos previstos, archivos todavía no creados.
4. Verificar contrato home-news.md en HTML: límites, orden, CTA literal única, preservación de Recomendados en su ubicación actual y preservación de bloques. Sin repetir suites generales de features cerradas.
5. Registrar resultados reales y diff exacto en qa.md; no inferir PASS antes de ejecutar. Ningún push/deploy/commit autorizado.
