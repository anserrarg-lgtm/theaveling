# NOTA PARA ANA

Este prompt es para pegar en tu agente de Figma (no en Claude Code). Hace 2 cambios en el Card System, dentro de "Prototipo final" → página "THEAVELING — DESIGN SYSTEM":

1. En la card **"Experience Card — Más reservados"** (`2130:945`): renombrar el campo mint de "Categoría" a "Etiqueta" (cambio de nombre/contenido, no de estilo).
2. En la card **"Experience Card — Descubrimientos"** (`1912:616`): agregarle el mismo campo de etiqueta mint, y subir la altura total de la card a 310px.

---

## PROMPT

Trabajá en el archivo "Prototipo final" (fileKey `Bas9SSdMLitN1S37kjFeOy`), página "THEAVELING — DESIGN SYSTEM".

### 1. Card "Experience Card — Más reservados" (nodo `2130:945`)

Dentro de esta card hay un texto capa `Categoria` (nodo `2130:952`, contenido actual "CATEGORÍA", Instrument Sans SemiBold, 11px, uppercase, color `#2ecca6` — Thea Mint).

- Renombrá la capa de `Categoria` a `Etiqueta`.
- Cambiá el texto placeholder de "CATEGORÍA" a "ETIQUETA".
- No toques el estilo (tipografía, tamaño, color, posición) — se queda exactamente igual, es solo un cambio de nombre/contenido para reflejar que este campo es una etiqueta curatorial específica (ej. "Teatro de máscaras", "Danza contemporánea"), no la categoría oficial de la taxonomía (Teatro/Danza/Performance/Música/Cine/etc.).

### 2. Card "Experience Card — Descubrimientos" (nodo `1912:616`)

Esta card hoy es 300×240 y solo tiene: Contenedor de Imagen (268×140) + bloque Detalles (268×52, con Título de Experiencia 24px de alto + Metadatos 16px de alto).

Cambios:

- **Agregar un campo de etiqueta mint**, arriba del título, con el mismo estilo exacto que la capa `Etiqueta` de la card "Más reservados" (Instrument Sans SemiBold, 11px, uppercase, color `#2ecca6`), texto placeholder "ETIQUETA". Va justo encima de "Título de Experiencia", con el mismo espaciado chico entre etiqueta y título que usa la card de Más reservados (4px aprox).
- **Subir la altura total de la card a 310px** (de 240 a 310), manteniendo el ancho en 300px.
- Repartí el espacio extra así: el bloque de Detalles crece lo justo para acomodar la nueva línea de etiqueta (queda en torno a 70-72px de alto en vez de 52), y el resto del espacio extra se lo lleva el Contenedor de Imagen (queda en torno a 190px de alto en vez de 140). Mantené los paddings/gaps de 16px que ya tiene la card (arriba, entre imagen y detalles, abajo) — no los cambies.
- Si el componente usa Auto Layout, esto debería reacomodarse solo al agregar la capa nueva y ajustar la altura de la imagen — no hace falta que calcules las posiciones a mano, solo asegurate de que el resultado final quede en 300×310 con esa distribución aproximada.

No modifiques ninguna otra card ni componente del Card System — solo estas dos.
