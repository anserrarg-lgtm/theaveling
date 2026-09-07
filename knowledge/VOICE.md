# Voice & Content

> Cómo habla y escribe Theaveling dentro del producto. Mismo espíritu que VOICE.md del portfolio, pero para el producto en sí, no para el case study.
> Definido en conjunto con Ana el 2026-08-16, a partir de una idea que surgió hablando con GPT sobre una sección de "Voice & Messaging" para el Design System.

---

## Personalidad de marca

Artística, sofisticada, curiosa, curatorial, orientada al descubrimiento. **No editorial** — ver DECISIONS.md, "Corrección de dirección: no es 'editorial', es 'artístico'". Cercana pero no informal en exceso. Debe seguir sintiéndose como UX/UI convencional y reconocible, no como una publicación tipo revista.

---

## "Artístico" en términos de UX (no editorial)

Definido con Ana el 2026-08-17, para poder aplicar el criterio de forma concreta en vez de quedarse en el adjetivo. Cuatro puntos:

1. **Se expresa en atmósfera, no en estructura.** Contraste, transparencia, fotografía, tipografía y composición — no romper grillas, no superponer texto sobre imagen al estilo revista, no layouts experimentales. Ver DECISIONS.md, "Corrección de dirección: no es 'editorial', es 'artístico'".
2. **Los patrones de interacción se mantienen convencionales.** Navegación, cards, botones, gestos — reconocibles como UX/UI de producto. Lo artístico vive en el tratamiento visual (peso tipográfico, jerarquía, fotografía, espacio), no en inventar nuevas formas de interacción.
3. **El copy es preciso y curado, no narrativo.** Dice qué hace especial una experiencia con criterio y datos concretos — no cuenta una historia sobre ella ni usa lenguaje poético/editorializante. Ver "Principio de escritura" abajo.
4. **La curaduría es el gesto artístico central.** Thea selecciona, no decora. La voz del producto se demuestra en qué se elige y cómo se organiza (Escena/Cultura, Recomendado para ti), no en lenguaje ornamentado.

## Principio de escritura

Específico y curado, nunca genérico de marketplace/turismo. El ejemplo de referencia ya está instalado en Foundations del Design System:

✅ "Descubre la escena artística alternativa de una ciudad."
❌ "¡Descubre experiencias increíbles cerca de ti!"

**Matiz importante (definido el 2026-08-16):** el problema del ejemplo ❌ no es mencionar la ubicación/cercanía — el producto sí recomienda por proximidad, y si no hay nada curado cerca, simplemente no lo muestra. Eso es un comportamiento real del sistema, no habría problema en comunicarlo. El problema es el tono genérico y de hype ("increíbles", signo de exclamación, cero especificidad). Si un mensaje necesita mencionar ubicación de forma honesta y específica, está bien — lo que no debe sonar es a plantilla de cualquier app de descubrimiento local.

Tampoco todo necesita cargar la palabra "curaduría" o sonar a marca todo el tiempo — la marca se sostiene en qué se muestra y cómo está organizada la navegación (Escena/Cultura, Recomendado para ti), no en que cada string individual la mencione. Un estado vacío o de error puede ser simplemente funcional y honesto.

---

## Nomenclatura — términos que usamos

- **"Experiencia"** / **"Experiencia de nicho"** — nunca "actividad" ni "plan" (ver DECISIONS.md, decisión de pasar de "app de turismo cultural" a "curaduría de nicho").
- **"Escena"** y **"Cultura"** — las dos categorías principales.
- **"Curaduría"** / **"Curado por Theaveling"** — señala el criterio de selección.
- **"Thea"** — el criterio curatorial del producto (qué se muestra, cómo se organiza). No es un personaje ni un asistente conversacional — nunca darle voz en primera persona ni tono de chatbot. Ver GLOSSARY.md.
- **Navegación (ya construida, mantener consistencia):** Recomendado para ti / Más reservados / Nuevos descubrimientos (dentro de Todo); Teatro / Danza / Performance / Música (Escena); Cine / Cine local / Cineclub / Lecturas dramáticas / Charlas / Talleres / Festivales (Cultura); Mis reservas / Favoritos / Preferencias (Perfil).
- **"Comunidad"** — capa secundaria únicamente (reseñas/tips dentro de una experiencia), nunca sección principal de navegación.

---

## Contenido narrativo en bloques de "curiosidad" (Detalle / Compra)

Definido con Ana el 2026-08-17 (ver ARCHITECTURE.md, sección Detalle de experiencia y Compra). Los bloques secundarios/expandibles de la pantalla de Compra (bloque del lugar, mapa de ubicación) no deben limitarse a datos duros (dirección, coordenadas) — necesitan contenido curioso, con historia real detrás, y conectado con la pieza cuando aplica.

Ejemplo dado por Ana: el bloque del lugar no dice solo la dirección — dice algo como "es una antigua fábrica abandonada que antiguamente producía arroz", y si la obra tiene relación temática con eso, se lo conecta explícitamente ("la obra trata precisamente de esto y esto y esto"). El mapa no es solo un pin — ubica narrativamente ("el lugar queda aquí, entre tal y tal, un barrio residencial que históricamente fue tal cosa").

Esto es coherente con el resto de VOICE.md: específico y curado, no genérico — y refuerza el rol de Thea como "la persona que conoce la escena", acá aplicado a lugares, no solo a experiencias.

## Lo que evitamos

- Lenguaje genérico de turismo/marketplace ("planes imperdibles", "actividades increíbles").
- Lenguaje corporativo/SaaS ("optimiza tu experiencia", "la operación").
- Lenguaje poético/metafórico excesivo que sacrifique claridad — Theaveling no es editorial, el copy tiene que seguir siendo rápido de leer y usar. En particular, ya no usamos ninguna variación literal de "iluminar lo oculto" / "sombra" — esa frase se retiró de Foundations (ver DECISIONS.md).
- Darle a "Thea" una voz conversacional en primera persona.

---

## Microcopy — estados de feedback (Components → Feedback States)

**Empty state**
Título: "Nada por aquí... todavía" (sin cambios, ya tiene voz propia)
Descripción — actualizar de "Explora el catálogo para descubrir experiencias artísticas cerca de ti." a: **"Todavía no encontramos experiencias cerca de tu ubicación. Probá ampliar la búsqueda o explorá Escena y Cultura."** (saca "el catálogo", que es lenguaje de inventario; mantiene la ubicación porque es información real sobre cómo funciona el sistema; agrega una salida concreta).
Botón: "Explorar" (sin cambios)

**Loading state**
"Cargando experiencias..." (sin cambios)
Actualizar de "Buscando las mejores experiencias para ti..." a: **"Buscando en la escena y la cultura..."** (saca el cliché de personalización algorítmica "lo mejor para ti").

**Error state**
"Algo salió mal" (sin cambios)
Actualizar de "No pudimos completar la operación. Intenta nuevamente." a: **"No pudimos hacer esto ahora. Intentá de nuevo en un momento."** (saca "la operación", lenguaje técnico/corporativo; queda genérico a propósito porque hoy es un solo estado de error para todo).
Botón: "Reintentar" (sin cambios)

**Nota pendiente:** si en algún momento se diseñan los 3 estados de error específicos que quedaron como gap sin resolver (sin resultados, sin disponibilidad, error de pago — ver ROADMAP.md), este texto genérico debería separarse por contexto en vez de cubrir los tres casos con el mismo mensaje.

**Success state**
"Reserva confirmada" / "Recibirás un email con los detalles de tu reserva." — sin cambios, ya está alineado.

## Bug detectado (no es decisión de voz)

El placeholder del buscador en el navbar desktop dice "Buscar artístico..." — gramaticalmente incompleto en español. Debería decir "Buscar experiencia..." Reportado para corregir junto con esta sección.
