# Specification Quality Checklist: Ajustes visuales de operadores

**Purpose**: Validar la especificación antes de CLARIFY y PLAN.
**Created**: 2026-10-27
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] Sin decisiones de implementación ni arquitectura.
- [x] Centrada en valor para el usuario y necesidades aprobadas.
- [x] Escrita para interesados no técnicos.
- [x] Todas las secciones obligatorias completas.

## Requirement Completeness

- [x] Sin marcadores NEEDS CLARIFICATION.
- [x] Requisitos verificables e inequívocos.
- [x] Criterios de éxito medibles.
- [x] Criterios de éxito independientes de la implementación.
- [x] Escenarios de aceptación definidos.
- [x] Casos límite identificados.
- [x] Alcance acotado explícitamente.
- [x] Dependencias y supuestos identificados.

## Feature Readiness

- [x] Requisitos relacionados con criterios de aceptación.
- [x] Escenarios cubren los dos recorridos principales.
- [x] Resultados medibles definidos; no se confunden con QA ejecutada.
- [x] Especificación sin solución técnica impuesta.

## Notes — preflight y diagnóstico local

SPECIFY PASS, 16/16. CLARIFY y fases posteriores NO ejecutadas. Sin hooks de extensión configurados.

- Constitution 2.0.0 autoritativa y copia frontend idénticas: SHA256 `496e689579ec2bd9340d9b311ea36ee69e084c47309547d2af02fe1184cb14d7`; procedencia registrada en `docs/sdd/governance-reference.json`.
- Base frontend `eb18708aaa4f50d27bec7d3f4adced5388a7471b`, rama main, con cambios locales anteriores de 008/009 y SVG aportado sin seguimiento. Se preservan; no hay commit ni publicación.
- `src/pages/operadores/[slug]/index.astro`: los cinco pictogramas se importan como recursos SVG y se muestran mediante `item.icon.src`, clase `h-12 w-12 object-contain`, dentro del mismo encabezado. Bandas tiene `icon: null`. Su valor se inserta con `{item.value}`, sin `set:html`: el código conserva el escapado de texto. Esto es inspección estática, no prueba nueva de ejecución.
- `src/components/HomeOperatorsSection.astro`: minitarjetas usan `h-auto w-auto`, máximos 140 × 55 y `object-contain`. El logo grande tiene máximos actuales 420 px/`max-h-48`, atributos de dimensiones editoriales y `object-contain object-left-top`; carece de las clases automáticas de tamaño de la minitarjeta. No se ha acreditado una deformación visual por navegador en esta fase.
- El logo grande está en flujo, dentro de un contenedor `p-8`, no posicionado absolutamente. Panel `hidden ... xl:block`; interior `xl:h-[550px] xl:overflow-y-auto`. Deben prevenirse doble desplazamiento, recorte por contenedores y pérdida de espacio para descripciones largas. No cambiar la visibilidad móvil ni el resto del panel.
- Recurso original: `src/assets/images/pictostecnicosLight/frequencia.svg`, 4247 bytes, XML válido, viewBox `0 0 522.386 515.142`, sin dimensiones raíz fijas. SHA256 `87f462218ea7b6e2832d5fa109925dad88fe05150bd98928610c82c46c0b1c52`. Elementos únicamente svg/g/path/polygon; sin scripts, manejadores de eventos ni referencias externas. Es una identificación de integridad actual, no comparación con un hash externo proporcionado por el autor.
- Archivos mínimos de producto previstos: los dos componentes/rutas citados y referencia al SVG existente, sin editar el recurso. No coinciden con los archivos de producto modificados de 008/009.
- Riesgos a concretar posteriormente: dimensiones intrínsecas y cambio de selección, proporciones extremas, falta de logotipo, espacio útil tras el desplazamiento y descripciones largas. No hay bloqueo funcional detectado ni autorización de implementación.
- Preservación comprobada mediante hashes antes/después de los 252 archivos versionados o no ignorados preexistentes, incluidas Features 008/009 y el SVG. Solo se añaden SPEC/checklist de 010 y se cambia el selector local ignorado `.specify/feature.json` conforme a la skill.
