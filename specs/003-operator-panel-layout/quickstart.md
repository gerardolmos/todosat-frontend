# Validación local proporcional
1. Ejecutar `node scripts/test-editorial-presentation.mjs --build` con aislamiento OS del harness; no cargar .env ni usar Strapi real.
2. Servir únicamente dist del laboratorio en 127.0.0.1. Usar navegador integrado, no Chrome; 320/768/1280/1440 px, sin zoom.
3. En escritorio medir logo arriba y bloque abajo, nombre 36 px, límites y divisor. Seleccionar otro operador y revisar enlace/pictogramas.
4. En una copia temporal de la Home generada, sustituir únicamente la descripción ficticia por texto largo con palabra extensa y marcador final. Verificar scroll y acceso al final sin desbordamiento lateral ni solapamiento de pictogramas.
5. Revisar diff: solo bloque ampliado; fuente de script, tarjetas, otras páginas y Features 001/002 intactas. Registrar revisión exacta, resultados y límites en qa.md. Revisión estética del propietario pendiente; no CONVERGE.

Ajuste final US2: comprobar HTML visible de ficha (descripcion_corta presente, descripcion_home ausente) y Home (descripcion_home presente). Verificar resto de ficha e imágenes/técnica idénticos a antes del ajuste. Sin pruebas visuales adicionales.
