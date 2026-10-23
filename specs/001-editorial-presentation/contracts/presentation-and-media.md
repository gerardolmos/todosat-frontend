# Contract — presentación y lectura de medios

## Lectura actual de noticia

`GET /api/noticias?...populate[imagen_principal]=true...` existente, sin alterar status ni filtros. Captions de imagen_principal se leen del medio relacionado, no del resultado de getImage. Validar caption como string|null; campo ausente exige diagnóstico.

## Lectura de imágenes del cuerpo

Origen únicamente el Strapi configurado del build. Nunca enviar token a URL tomada del contenido. Credencial server-side ya existente; ninguna operación POST/PUT/PATCH/DELETE ni endpoint admin.

Consulta oficial `/api/upload/files/page` con filtros `$eq` para hash, provider y URL original, `pagination[limit]=2` y campos id/hash/provider/url/caption. La serialización debe usar URLSearchParams y codificar valores; jamás concatenar datos sin escape. Para Cloudinary, comparar URL original absoluta completa. Para URL local almacenada relativa, construir su representación únicamente respecto del origen Strapi conocido, sin eliminar query, versión, transformación, nombre ni rutas. Si la representación no puede convertirse inequívocamente, error.

Respuesta paginada {data,meta.pagination}; se exige límite efectivo 2 y total inequívoco. Cero o múltiples candidatos, respuesta inválida, HTTP error, timeout, identidad ausente o caption omitido: conservar caption del bloque con diagnóstico de procedencia histórica. Nunca usar otro medio ni inferir que el caption está vacío. Un candidato exacto y caption string|null permite fuente biblioteca verificada; vacío explícito elimina pie.

El transporte real NO está habilitado: falta evidencia de permiso findPage existente. Sin transporte no se emite petición; se diagnostica METADATA_LOOKUP_UNAVAILABLE por ordinal de bloque, sin contenido, URL ni secretos. La alternativa antigua /api/upload/files está prohibida por no garantizar límite. Una consulta simulada no acredita acceso productivo.

Cache: tupla exacta por resolución de noticia, incluidas promesas en curso; timeout 10 s, concurrencia máxima 4, sin retries automáticos. Las consultas no garantizan snapshot atómico ante ediciones simultáneas; los valores se reflejan según las lecturas de ese build y nuevas ediciones requieren otro build.

## Renderizado

Figura principal y cada bloque image tienen un único figcaption cuando el caption de la fuente utilizada no está vacío. Escape de &, <, > y comillas según contexto; protocolos no seguros rechazados, no HTML interpretado. Imágenes principales ancho 100 %, altura automática limitada a 550 px y object-fit cover centrado; cuerpo máximo ancho disponible y altura proporcional, sin recorte. Mantener alt disponible; no copiar caption a alt. Pie 14 px, contraste >=4.5:1 y wrap, sin truncado.

RenderBlocks: el uso sin opción nueva conserva salida de todos los consumidores. Modo Noticias consume mapa de medios previamente resuelto y solo añade manejo de image; no cambia la representación de los bloques existentes ni ejecuta red. No interpolar valores no escapados en el nuevo markup.

## Aceptación UI

Home: tarjetas sin descripción, mismos nombre/órbita/orden/selección y foco; logo máximo 140 × 55 px sin deformación ni recorte. Panel ampliado y fichas conservados.
Footer: texto exacto SPEC y año derivado de fecha de build; enlaces intactos. Verificación a 320/768/1440 px y zoom 200 %, con captions largos, sin imagen, logos extremos y ausentes.
