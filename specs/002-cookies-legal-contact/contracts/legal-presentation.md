# Contrato de presentación local

## Rutas y contenido

Cuatro rutas existentes, mismo Layout/Header/Footer y navegación; LegalPage recibe título literal (Política de Privacidad sustituye el rótulo provisional Privacidad dentro de esa página). Un h1 por documento; apartados y párrafos/listas en orden fuente, sin traducción o corrección jurídica. Espacios y saltos de maquetación HTML pueden normalizarse para comparación, pero saltos explícitos y fronteras de bloques no pueden desaparecer. Correos conservan etiqueta y mailto exactos. Enlaces originales preservan texto y destino; no abrirlos ni enviar correos durante QA.

Mantener noindex, follow y exclusión de sitemap existentes. No añadir avisos al cuerpo literal ni alterar Footer. Se puede conservar descripción técnica provisional existente salvo contradicción con el título, sin añadir afirmaciones jurídicas nuevas.

## Fidelidad

Comparación desde OOXML de cada original a unidades renderizadas del contenido de LegalPage, excluyendo chrome global. Conservar caracteres y signos; decodificar entidades HTML para comparar texto literal. Títulos repetidos, apartados omitidos, listas reordenadas, enlaces cambiados o texto añadido fallan. Escape HTML de contenido; nunca tratar texto como script. Cotejar extracción con lectura de los documentos para no confundir listas o saltos.

Banner: hash coincide con SPEC, lectura íntegra accesible para QA; contenido y opciones no aparecen como UI ni texto en dist. Su original sigue donde estaba; no existe copia DOCX versionada ni publicada.

## Ausencia de activaciones y regresión

Comparar antes/después de scripts, peticiones y almacenamiento en las cuatro páginas. Texto «Google Analytics» o «Google AdSense» no es una integración: detectar scripts/URLs de carga, listeners/controles, formularios o escrituras nuevas. Mantener scripts globales preexistentes; no exigir eliminación de funcionalidades ajenas. No navegar rutas de tienda ni hacer peticiones a producción. Datos jurídicos pendientes se documentan solo en SDD.

## Accesibilidad y visual

320/768/1440 px, zoom 200 %, Tab y foco en enlaces, headings ordenados, contraste y párrafos legibles sin overflow. Comprobar correo largo y final de todos los documentos. No modificar contenidos para resolver layout. Registrar observación real; bloqueo de navegador deja ese checkpoint pendiente.

## Particularidades verificadas de fuente

Privacidad: listas de 3 y 5 elementos. Cookies: lista de 3 elementos y tres saltos explícitos después de rótulos en negrita, conservados como br. Ninguno de los cinco DOCX contiene hyperlinks; solo se añade el mailto autorizado al texto exacto del correo. Mantener «mediante:hola@todosatcom.com» sin insertar espacio. No normalizar espacios interiores de los textos; solo indentación HTML exterior a unidades originales. Banner título H2 y opciones entre corchetes conservados en fuente, no en UI.

## Dirección visual aprobada
Cabecera oscura y título destacado; fondo claro, columna centrada de lectura, apartados/listas diferenciados y espacio equilibrado sin alturas artificiales. Correo de Contacto en línea visual separada y destacada mediante CSS: el texto DOM y sus negritas siguen literales y en el mismo párrafo original. No se agregan encabezados, avisos ni eslóganes. Aprobación de lectura no sustituye aprobación estética; T016/T017 requieren ambas evidencias.

Corrección acotada: footer al borde inferior para contenido corto y después del contenido largo, en flujo normal flex, sin posición fija/absoluta ni overlay. Correo de Contacto al mismo tamaño que el párrafo, azul/subrayado sin fondo, borde ni caja decorativa; separación visual y foco conservados.
