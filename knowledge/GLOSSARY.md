# Glossary

> Vocabulario del dominio de Theaveling. Cada término tiene una única definición aquí.
> El resto de documentos referencian este archivo en lugar de redefinir términos.

---

**Thea**
El criterio curatorial de Theaveling. No es un personaje ni una interfaz de chat — es el comportamiento del producto: qué se muestra, cómo se organiza, qué se prioriza. "Thea descubre. La comunidad respalda."

**Curaduría**
El criterio con el que se seleccionan y presentan las experiencias, sin necesidad de etiquetarlas explícitamente como "alternativas" o "de nicho" dentro de la navegación.

**Escena**
Categoría principal de la arquitectura de información. Agrupa las artes escénicas: Teatro, Danza, Performance, Música.

**Cultura**
Categoría principal de la arquitectura de información. Agrupa formatos culturales relacionados pero distintos de las artes escénicas: Cine/Cine local/Cineclub, Lecturas dramáticas, Charlas, Talleres, Festivales.

**Experiencia**
Página individual de cada oferta artística/cultural. Contiene Información, Artistas/espacio, Comunidad y Reservar.

**Experiencia de nicho**
Una experiencia artística o cultural que no es fácilmente descubrible por canales tradicionales — su acceso depende de conocimiento local o de pertenecer al circuito que ya la conoce.

**Card Sorting v1 / v2**
Dos rondas de investigación de arquitectura de información. La v1 (research original) usó un set de tarjetas más disperso y generó clusters ambiguos. La v2 (10 participantes, tarjetas específicas de artes escénicas y formatos culturales) generó la agrupación ESCENA/CULTURA vigente hoy. Ver DECISIONS.md.

**Comunidad**
Capa secundaria dentro de la página de Experiencia — comentarios, recomendaciones y tips de quienes ya vivieron esa experiencia. No es una sección principal de navegación (decisión explícita, ver DECISIONS.md).

**Artistas / espacio**
Sección de la página de Experiencia dedicada a quién produce o aloja la experiencia (grupo de teatro, espacio independiente, artista). Su existencia como bloque visual diferenciado en el prototipo hi-fi no está confirmada — ver ARCHITECTURE.md.

**Thea Green**
`#112C2C`. Color primario de marca y estructural del Design System — el único verde de marca (no existe un "Deep Green" separado, eso fue un error corregido). Representa sombra, lo oculto, lo que todavía no ha sido descubierto, profundidad, atmósfera teatral. Se usa en fondos, superficies oscuras, navegación, overlays y como base de la jerarquía de opacidad. Ver DECISIONS.md, "Corrección del sistema de color del Design System nuevo".

**Thea Red**
`#F31006`. Color de identidad de Thea, de uso extremadamente escaso — únicamente el wordmark "Theaveling" y momentos de identidad de marca directamente asociados a Thea. Representa luz, escena, performance, energía artística. Nunca se usa como color funcional de UI (botones, navegación, categorías, links, error, cards, fondos) — su rareza es intencional, es una firma de marca, no un acento genérico.

**Thea Mint — Interaction Accent**
`#2ECCA6`. Ya no se considera un segundo color de marca — es un acento de interacción, subordinado visualmente a Thea Green. Se usa solo en estados chicos e intencionales: selección, indicadores activos, toggles, checkmarks, filtros seleccionados, confirmaciones sutiles. Nunca en fondos o componentes grandes, ni para diferenciar categorías.

**"Lo que está en la sombra hasta que Thea lo ilumina"** *(retirada)*
Frase guía original del principio de diseño del nuevo Design System — **ya no está vigente**, Ana la retiró de Foundations en Figma. Queda documentada acá solo como registro histórico. El Design Principle actual en Foundations es simplemente "Descubre la escena artística alternativa de una ciudad." Ver DECISIONS.md, "Corrección de dirección: no es 'editorial', es 'artístico'".

**North Star Metric (candidata)**
% de usuarios que descubren y reservan una experiencia que no habrían encontrado por su cuenta. Conecta problema, propuesta de valor y modelo de producto.

**Discovery rate / Recommendation → booking / Save rate / Repeat discovery / Independent scene impact**
Indicadores de éxito previstos (no validados) para Theaveling en producción. Ver CASE_STUDY.md, sección "Validación & éxito".
