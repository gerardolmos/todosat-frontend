# Research — decisiones de PLAN

## Presentación literal
- Decision: HTML semántico estático dentro de LegalPage; cada título original aparece una vez como h1 y los apartados conservan orden y texto. Correo enlazado a mailto:hola@todosatcom.com con etiqueta literal. Preservar enlaces OOXML existentes sin inventar destinos para menciones de Google/AEPD sin enlace.
- Rationale: cuatro documentos breves; no requieren CMS ni dependencias. Separar texto jurídico de diagnóstico SDD.
- Alternatives considered: conversor DOCX en runtime, CMS o librería nueva descartados por complejidad; reescritura editorial descartada por requisito expreso.

## Fidelidad y fuentes
- Decision: extraer OOXML en pruebas con biblioteca estándar, incluir saltos explícitos y destinos de relaciones hyperlink, validar hashes de los cinco originales contra SPEC. Comparar unidades semánticas con HTML: solo normalizar whitespace de maquetación, nunca palabras, signos, acentos, orden o separación de bloques. No usar normalización que oculte párrafos omitidos o fusionados. Listas/encabezados se interpretan según OOXML real, no por formato visual supuesto.
- Rationale: comparar solo texto concatenado pierde saltos o listas. El fichero original es autoridad del contenido; no duplicar expected text manualmente.
- Alternatives considered: snapshot manual duplicado de textos descartado por posible divergencia. No copiar DOCX a Git.

## Banner y servicios futuros
- Decision: mantener Banner externo con hash y extracción de control en QA; ninguna copia en public, componente, controles ni persistencia. Los nombres Analytics/AdSense deben poder existir como texto sin activar scripts.
- Rationale: aprobación del texto no autoriza operación. Inventario separado en SPEC y QA; referencias en presente siguen intactas.
- Alternatives considered: banner ficticio o CMP preparatoria descartados expresamente.

## Laboratorio y regresión
- Decision: reutilizar harness existente de Feature 001 sin modificarlo, con copia temporal que contiene las páginas actuales, sin .env, dependencias existentes y salida externa bloqueada. Tests nuevos acotados en tests/legal-contact. No repetir suite editorial si sus fuentes/hashes no cambian.
- Rationale: no infraestructura nueva ni tocar Feature 001. Shared LegalPage tiene solo cuatro consumidores; comprobarlos si se ajusta.
- Alternatives considered: build normal contra configuración real prohibido; servidor real Strapi innecesario.

## Pendientes externos no bloqueantes localmente
Datos del titular y aplicabilidad de identificadores, buzón operativo, dominio, tratamientos/terceros reales y revisión de publicación definitiva. Analytics futuro de lanzamiento; AdSense mucho más adelante. No consultar producción ni decidir estos puntos unilateralmente.

## Evidencia OOXML de los cinco originales

Inspección delegada de solo lectura: Aviso Legal 22 párrafos/H1/6 H2; Privacidad 32 párrafos/H1/8 H2 y listas de 3 y 5 elementos; Cookies 28 párrafos/H1/6 H2, lista de 3 y tres saltos explícitos w:br entre rótulos en negrita y explicación. Contacto 5 párrafos/H1, conserva literalmente «mediante:hola@todosatcom.com», sin insertar espacio. Banner 5 párrafos, título H2 y opciones como texto entre corchetes. No hay hyperlinks OOXML, tablas, imágenes, campos ni tabuladores. No inventar destinos para menciones textuales. Preservar negritas significativas de los rótulos. La comparación permite ignorar indentación generada entre elementos HTML, nunca espacios internos originales, signos, palabras unidas o saltos explícitos.
