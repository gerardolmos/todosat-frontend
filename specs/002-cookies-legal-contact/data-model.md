# Data Model — presentación documental

No se crea modelo persistente ni API.

- Fuente aprobada: filename, SHA-256 fijado por SPEC, ruta externa y secuencia OOXML. Regla: «cinco originales inmutables; hash distinto detiene integración afectada». Estado: aprobada → integrada localmente (cuatro) o reservada (Banner); ninguno implica publicación autorizada.
- Unidad de presentación: tipo título/apartado/párrafo/lista, posición, texto literal, saltos explícitos y enlaces con texto/destino. Regla: «mismo contenido y orden; solo whitespace de maquetación normalizable». Título principal único; listas conservan orden y pertenencia.
- Ruta: aviso legal→/aviso-legal, privacidad→/privacidad, cookies→/cookies, contacto→/contacto. Banner: sin ruta pública.
- Pendiente legal: campo o validación, estado pendiente/confirmado y evidencia del propietario, fuera del texto original. Regla: «ningún dato identificativo inventado». Fuente de pendientes: sección correspondiente de SPEC, sin nueva base de datos.
- Diagnóstico: afirmación original, servicio futuro/condicional/no acreditado y evidencia de código. Regla: «diagnóstico separado, sin reescritura del documento».
