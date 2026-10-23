# Quickstart — validación local prevista

Esta guía NO acredita ejecución. Los comandos siguientes estarán disponibles tras las tareas de implementación; no ejecutarlos ahora. No `npm install`, no builds en checkout con .env real.

## Prerrequisitos

Node compatible >=22.12.0, dependencias actuales, Chrome accesible. Permisos productivos de upload no se dan por probados. Ninguna prueba usa tokens reales, Railway o Cloudinary. Sin permiso acreditado, recuperación adicional inactiva y fallback diagnosticado; resto de feature continúa.

## Flujo seguro

1. Implementar primero el harness `scripts/test-editorial-presentation.mjs`. Debe crear copia temporal de frontend sin .env*, .git ni datos reales, reutilizar dependencias instaladas sin copiar secretos, suministrar fixtures/medios ficticios y un servidor loopback. Entorno limpio, URL loopback y token ficticio. Aplicar aislamiento de salida IP con el mecanismo local disponible; demostrar rechazo de destino no local antes de ejecutar Astro. Nunca arrancar Strapi productivo ni su .env.
2. `node scripts/test-editorial-presentation.mjs --unit`: ejecutar tests Node contra transporte simulado y el código TS compilado con herramientas instaladas. Evitar tests que solo comparen strings del código fuente.
3. `node scripts/test-editorial-presentation.mjs --build`: build en copia aislada con respuestas ficticias para todas las consultas existentes de home/listados/detalles; no editar endpoints productivos. Incluir APIs oficiales upload y respuestas data/meta.
4. `node scripts/test-editorial-presentation.mjs --preview`: servir solo en loopback el resultado local y anunciar URL/puerto real. No abrir a Internet. Chrome manual: anchos 320, 768, 1440; zoom 200 %; Tab/Shift-Tab/Enter/Espacio; imágenes completas y pies/contraste. No marcar visual PASS sin interacción real.
5. Registrar comandos, códigos de salida, resultados visuales, límites y diff exacto + SHA frontend en `specs/001-editorial-presentation/qa.md`. Revisar que backend permanezca intacto y que dist/cliente no contenga credencial ficticia ni metadatos privados.

## Matriz mínima

- Caption principal vigente; bloque con caption antiguo y biblioteca nueva; bloque vacío y biblioteca con caption; biblioteca vaciada y bloque antiguo; repetición de imagen/cache.
- Mismo nombre y distintos hash/URL: nunca cruce; identidad incompleta, cero candidatos, duplicados exactos, campo caption omitido, 401/403/500, timeout, JSON inválido: diagnóstico y build exitoso con caption histórico.
- Caption con etiquetas/script/comillas, alt con comillas, URL javascript/data no admitida: no ejecución; captions largos y multilínea completos.
- Principales y cuerpo horizontales/verticales/cuadrados, espacios internos propios del archivo, imagen ausente, URL inválida.
- Sin opción nueva de renderBlocks: regresión de manuales, operadores, hardware y ambos campos de producto; sin alterar filtros de content.ts, selección ni estados.
- Home sin logo/nombre largo/logos extremos/selección del panel, descripciones ajenas preservadas; footer en 2026/2027 y enlaces idénticos.

Un mock demuestra contrato y tratamiento de fallos, no permisos ni contenidos reales de Carlos. No declarar captions productivos verificados. G1 y compatibilidad de identidades requieren evidencia posterior autorizada de solo lectura, fuera de esta misión.
