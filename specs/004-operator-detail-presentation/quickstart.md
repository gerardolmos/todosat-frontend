# QA mínima
1. Copiar a temporal el harness aislado existente, worker y fuentes necesarias excluyendo .env; enlazar node_modules instalado. Cambiar solo worker temporal: operador base mantiene solo órbita; variante vertical tiene cinco pares técnicos; cuadrada tiene descripción sin valor; sin-logo carece también de portada.
2. Ejecutar harness --build temporal: su sandbox debe bloquear salida externa y .env antes de construir. No usar Strapi real.
3. Leer HTML de fichas: solo órbita=1, completa=5 con valores/descripciones, texto sin valor visible, portada ausente sin marco.
4. Servir dist en loopback. Navegador integrado: portada horizontal/vertical a 320 y 1440; caja de imagen coincide con interior del marco, cover/center computados, sin overflow. No Chrome/zoom.
5. Revisar diff único y registrar SHA/diff, resultados y límites en qa.md. Parar antes de CONVERGE.
