# Theaveling — Knowledge Base

Punto de entrada para cualquier IA o colaborador nuevo.

## Cómo leer esta documentación

- Si eres una IA: empieza por PRODUCT.md, luego GLOSSARY.md
- Si vas a tocar la arquitectura de información o el flujo: lee ARCHITECTURE.md
- Si vas a escribir o ajustar el case study: lee CASE_STUDY.md y ACTORS.md
- Si quieres entender por qué el proyecto cambió de dirección: lee DECISIONS.md
- Si vas a comparar con la competencia: lee BENCHMARK.md
- Si quieres saber qué falta confirmar antes de dar algo por hecho: lee ROADMAP.md
- Si vas a escribir copy/microcopy del producto: lee VOICE.md
- Si vas a tocar el Design System en Figma (colores, tipografía, componentes): lee STACK.md

## Documentos

- PRODUCT.md — qué es Theaveling y por qué existe
- ACTORS.md — personas, quién es Thea conceptualmente, y los demás actores
- ARCHITECTURE.md — arquitectura de información, sitemap y user flow (estado real en Figma)
- CASE_STUDY.md — contenido crudo para el case study (research, quotes, MVP, testing)
- BENCHMARK.md — competencia y referentes de posicionamiento
- DECISIONS.md — decisiones históricas y su por qué, incluyendo el giro narrativo
- GLOSSARY.md — vocabulario del dominio
- ROADMAP.md — qué está confirmado, qué es hipótesis, y qué falta verificar en Figma
- STACK.md — herramientas, Figma, y el sistema de color/tipografía del Design System nuevo
- VOICE.md — cómo habla y escribe Theaveling dentro del producto (voz, nomenclatura, microcopy)

## Estado de este proyecto (actualizado 2026-09-15)

Esta base de conocimiento se armó **antes de escribir código** — en ese momento era la etapa de consolidar investigación y narrativa antes de pasar a Figma → código. Eso ya cambió: **el producto está construido y funcionando** (React + TypeScript + Vite + Tailwind CSS, ver STACK.md), con el flujo completo Descubrir → Detalle → Compra → Confirmación, más Reservas, Favoritos y Perfil, en versión mobile y de escritorio.

**Los documentos de esta carpeta (`knowledge/`) documentan sobre todo la etapa de investigación y diseño previa al código** — siguen siendo valiosos para entender el porqué de las decisiones (research, personas, benchmarking, filosofía de producto), pero varias afirmaciones puntuales sobre "qué existe" o "qué falta construir" quedaron desactualizadas una vez que se empezó a programar. Cuando haya diferencia entre lo que dice un documento acá y lo que hace la app de verdad, **el código manda** — la carpeta `src/` del proyecto (ver STACK.md, sección "Código") es la fuente de verdad sobre qué está construido hoy.

PRODUCT.md y STACK.md ya se actualizaron (2026-09-15) para reflejar el estado real del código. ARCHITECTURE.md conserva su contenido histórico de la etapa de Figma (todavía útil como registro del proceso de decisión) con una sección nueva al principio que resume la arquitectura real tal como quedó construida. DECISIONS.md, PENDIENTES.md, ROADMAP.md, CASE_STUDY.md, ACTORS.md, BENCHMARK.md y VOICE.md no se tocaron en esta actualización — son registros históricos/de investigación por naturaleza, no descripciones del estado actual del código.

## Fuentes

- Figma "Prototipo final" (`Bas9SSdMLitN1S37kjFeOy`) — pantallas hi-fi, Sitemap, User Flow.
- Figma "ENTREGA-FINAL-SERRANO" (`yv97GFGHTBGB5UT5EZejus`) — research board original (metodología, problema, personas, benchmarking v1, cardsorting v1, testing, UI Kit).
- Conversación con Ana (agosto 2026) — nueva dirección narrativa, historia de origen, quotes de entrevistas, respuestas a los 7 puntos de diagnóstico.
