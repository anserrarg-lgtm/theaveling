# Stack

> Describe las herramientas y el sistema visual de Theaveling hasta ahora.
> No hay stack de código decidido todavía — Ana quiere primero terminar los cambios de design system en Figma antes de pasar a código/responsive.

---

## Diseño

**Figma** — dos archivos relevantes:

- **Prototipo final** — `https://www.figma.com/design/Bas9SSdMLitN1S37kjFeOy/Prototipo-final` — pantallas hi-fi, wireframes en baja (no usar), Sitemap y User Flow actualizados.
- **ENTREGA-FINAL-SERRANO** — `https://www.figma.com/design/yv97GFGHTBGB5UT5EZejus/ENTREGA-FINAL-SERRANO--Copy-` — research board original: metodología, problema, personas, benchmarking v1, cardsorting v1, testing, UI Kit.

Archivo `theaveling` (`xRwpPVnt9mCEZDpC7EFvqR`) — **no usar**, solo contiene una página de íconos, no las pantallas del producto.

---

## UI Kit — colores (histórico, superado por el Design System nuevo, ver abajo)

Esta sección documenta el ajuste rápido de paleta hecho el 2026-08-14 directamente sobre el prototipo existente ("Prototipo final"), antes de que arrancara el rediseño completo del Design System. Se deja como referencia histórica — ver la sección "Sistema de color — versión final" más abajo para las reglas vigentes.

- `#112C2C` — fondo principal (verde oscuro/teal), se mantiene.
- Blanco + variaciones de transparencia — pasa a ser el color dominante de la UI (texto, íconos, estrellas de rating, toggles, spinners de carga, indicadores de onboarding, tarjetas de pago, resaltado de fecha en calendario, etc.). Reemplaza el uso extendido que antes tenían el rojo y el mint.
- `#F31006` (rojo) — reservado **exclusivamente** para la palabra "Theaveling" (wordmark). Ya no se usa en el símbolo/ícono del logo (el círculo + figura que acompaña al texto) ni en ningún otro elemento de UI — se verificó visualmente que aplicarlo también al ícono producía resultados no deseados (p. ej. se veía fuera de lugar en la pantalla de login con Google).
- `#2ECCA6` (mint) — reservado **exclusivamente** para la confirmación de "Pago exitoso" (el ícono de check). Se eligió como el único uso "extremadamente puntual" del acento, por su asociación semántica con éxito/confirmación.
- `#FBFBFB` — texto/fondo claro, se mantiene donde aplica.

**Nota de alcance:** los swatches de referencia del UI Kit (los rectángulos y textos "F31006"/"2ECCA6" que documentan los códigos hex) y la decoración del diagrama de Sitemap (barras de acento, secciones) se dejaron sin modificar a propósito — son documentación/diagrama, no pantallas reales de producto.

**Pendiente de decisión:** en la pantalla "LOGIN CON GOOGLE" (mockup del selector de cuenta nativo de Google, contenido de placeholder — el texto dice "flamefactory.io", no "theaveling.io") había un ícono circular que reutilizaba el símbolo del logo de Theaveling en rojo. Al pasarlo a blanco quedó invisible (blanco sobre fondo blanco de esa tarjeta). Como esta pantalla parece ser un mockup genérico de un flujo de terceros (no una pantalla de marca propia), se dejó así por ahora en vez de inventar un tratamiento nuevo — Ana debe decidir si esa pantalla necesita su propio ícono de Google real, o si no es relevante para el case study.

---

## Sistema de color — versión final (Design System nuevo, corregido 2026-08-14)

El agente que está construyendo el Design System nuevo (fuera de esta sesión) interpretó mal el sistema de color en un primer intento — entre otras cosas, inventó un "Deep Green" como color de marca separado. Ana le dio una corrección explícita con la dirección final. Estas son las reglas vigentes (ver también DECISIONS.md):

**01 — Brand**
- **Thea Green** `#112C2C` — color primario de marca y estructural. Fondo principal de la app, superficies oscuras grandes, fondos de navegación, elementos estructurales primarios, overlays oscuros, texto primario sobre fondos claros, superficies de UI oscuras. Es el único verde de marca — no debe existir un "Deep Green" ni ningún otro verde oscuro alternativo.
- **Thea Red** `#F31006` — color de identidad de Thea, uso extremadamente escaso. **Dos usos aprobados, y solo esos dos:** el wordmark "Theaveling" (momentos de identidad de marca directamente asociados a Thea), y el ícono de corazón cuando una experiencia está favoriteada (estado activo del botón de favorito) — agregado 2026-09-03, decisión explícita de Ana tras probarlo en código ("me gustó, hay que dejar acentado que solo Theaveling y los corazones van a usar este color"). Antes de esto el corazón activo usaba Thea Mint, como cualquier otro estado de interacción chico (ver 02 — Interaction) — queda reemplazado a propósito, no es un descuido. Nunca como acento genérico de UI fuera de esos dos casos: no botones primarios, no estados de navegación ni de interacción en general, no colores de categoría, no links, no highlights generales, no estados de error, no cards, no fondos, no otras acciones destructivas. **Resuelto 2026-09-03:** el código de "Eliminar cuenta" (Perfil → Datos de cuenta) había quedado en Thea Red por error de implementación (copiado tal cual de Figma, que ahí solo usaba el hex suelto, no un token) — no era uno de los dos usos aprobados acá. Ana lo corrigió a `Warning` (`#F5A623`, ver "05 — Semantic" abajo) en vez de sumarlo como tercera excepción de Thea Red. Su rareza es intencional — es una firma de marca, no un color funcional genérico.

**02 — Interaction**
- **Thea Mint — Interaction Accent** `#2ECCA6` — no es un segundo color de identidad como el rojo (el rojo es la firma de marca, exclusiva del wordmark — ver arriba). Mint es un acento funcional de menor jerarquía, con dos usos válidos (redefinido 2026-08-17, ver DECISIONS.md "Revisión de verificación del canvas"):
  1. Estados de interacción chicos e intencionales: seleccionado, activo, toggle, checkmark, filtro seleccionado, confirmación sutil. **Excepción, 2026-09-03:** el corazón de favorito (estado activo) salió de esta categoría y pasó a Thea Red — ver 01 — Brand.
  2. Etiquetas chicas de taxonomía/categoría (ej. "TEATRO", "DANZA CONTEMPORÁNEA" como eyebrow sobre el título de una card) — uso consistente, el mismo mint para todas las categorías, nunca un color distinto por categoría.

  Esto no contradice "sin colores por categoría" (ver abajo): esa regla es sobre no darle a Teatro un color y a Danza otro — acá todas comparten el mismo acento, funciona como marca de "esto es un tag", no como diferenciación arbitraria. Sigue sin usarse en fondos grandes, botones grandes, cards grandes, secciones decorativas ni branding primario, y sigue subordinado visualmente a Thea Green.

**03 — Light**
- **Off-white** `#FBFBFB` — color claro primario (texto sobre fondo oscuro, headings, íconos, superficies claras, fondos claros, cards cuando corresponda). Evitar blanco puro salvo necesidad técnica.

**04 — Transparency (jerarquía vía opacidad, no grises arbitrarios)**
Blanco sobre Thea Green: White 100% (texto primario), 80% (texto secundario), 60% (terciario/metadata), 40% (íconos sutiles/soporte), 20% (bordes/dividers), 12% (superficies sutiles), 8% (superficies elevadas), 6% (fondo de card de contenido — el que ya usan las Experience Card reales, Más reservados/Descubrimientos, confirmado 2026-08-31 revisando el componente directo en Figma; se agrega acá porque no estaba escrito en ningún lado, solo construido), 4% (overlays muy sutiles).
Thea Green sobre superficies claras: Green 100% (texto primario), 70% (secundario), 50% (metadata), 20% (bordes sutiles), 12% (dividers), 8% (superficies sutiles).
Se implementan como variables de Figma reutilizables, no colores grises inventados manualmente. **Nota real (2026-08-31):** la escala de Green sí está tokenizada así de verdad (`Green/8`, `Green/20`, `Green/50`, `Green/100`, opacidad horneada en la variable). La escala de "Blanco sobre Thea Green" de arriba, en cambio, no lo estaba — cada uso translúcido se armaba a mano sobre "Light/Off-White", sin token, causa raíz de varios bugs de opacidad de esta sesión. Se está creando la escala real equivalente (`White/100` a `White/4`, mismo patrón) — ver PENDIENTES.md para el estado de la migración.

**05 — Semantic (separados de los colores de marca)**
Error, Warning, Success, Info son tokens propios, restringidos y funcionales — no deben competir visualmente con los colores de marca. Thea Red **no** es el color de error genérico. Thea Mint **no** es el color de éxito genérico. Success debe ser un verde distinguible de Thea Green y Thea Mint; Error debe ser distinguible de Thea Red.

**Warning** `#F5A623` — primer semántico con valor hex definido (2026-09-03). No existía en Figma (confirmado con búsqueda en el design system, sin resultados para Warning/Orange/Semantic) — Ana lo eligió directamente en código a pedido explícito ("ponlo en el naranja de semánticos"), motivado por corregir "Eliminar cuenta" (ver 01 — Brand) que había quedado mal en Thea Red. Primer uso: texto de "Eliminar cuenta" en Datos de cuenta (acción destructiva). Error/Success/Info siguen sin valor hex — no inventar, agregar cuando Ana los defina.

**Sin colores por categoría:** Teatro, Danza, Performance, Música, Cine, Cine local, Cineclub, Lecturas dramáticas, Charlas, Talleres, Festivales comparten el mismo sistema visual — su identidad viene de fotografía, tipografía, contenido, curaduría y layout, no de colores arbitrarios.

**Resuelto (2026-08-17):** el uso de Thea Mint en etiquetas de categoría de cards (encontrado en una revisión del canvas — ver DECISIONS.md, "Revisión de verificación del canvas") queda confirmado como uso válido, no como desvío. Ver la definición actualizada de Mint arriba, en "02 — Interaction".

**Atmósfera visual:** la relación principal es Thea Green + Off-white + transparencia, con Thea Red como firma de marca extremadamente rara y Thea Mint como acento de interacción extremadamente restringido. Evitar neón, glow, gradientes luminosos/excesivos, UI colorida, efectos de iluminación futuristas, sistemas de color genéricos de SaaS, componentes coloridos excesivamente redondeados. La referencia teatral se logra con contraste, profundidad, fotografía, transparencia y composición — no con efectos de luz.

**Ciudad de ejemplo para contenido de mockups (2026-08-18, ronda 2 el mismo día):** el contenido de ejemplo del Design System (Experience Cards, Featured Cards, Artist/Space Cards, etc.) tenía "Madrid" hardcodeado como ciudad — 25 instancias encontradas en una revisión. Se reemplaza por **Bogotá, Colombia**, decisión de Ana. Contexto: Thea se originó pensando en Argentina, pero Ana no está ahí actualmente — Bogotá es la ciudad más cercana a su contexto real hoy (confirmado también porque sus referencias visuales de Airbnb Experiences, usadas para definir Búsqueda contextual, son de Cartagena, Colombia). Esto **no fija Bogotá como la única ciudad del producto** — Theaveling funciona en cualquier ciudad, es solo la ciudad de referencia para contenido de ejemplo mientras se termina el Design System. No confundir con CASE_STUDY.md, donde la tarea de testing de usabilidad usa Buenos Aires, Argentina como ciudad real — eso es research ya realizado, no se toca. Los nombres específicos de lugares/venues inventados (Teatro Pradillo, Cineteca Matadero, Búnker 43, etc.) se dejan sin corregir por ahora — se revisan cuando se trabaje el contenido real de la ficha de ubicación. **Ronda 2 (mismo día):** al revisar 07 — Reservas se encontró contenido que nunca decía "Madrid" pero sí quedó inconsistente — "CABA" y "San Telmo" (Buenos Aires) en dos reservas de ejemplo, y "ARS $" como moneda en Preferencias. Ana confirmó estandarizar todo a Bogotá — pendiente de aplicar en Figma.

**Patrón de chips: scroll horizontal (navegación) vs. wrap hacia abajo (selección de filtros) — definido 2026-08-18.** Category Tabs y Sub-category Tabs usan scroll horizontal con indicador de contenido adicional — correcto para navegación, donde el usuario típicamente sabe a qué destino quiere ir y no necesita comparar todas las opciones a la vez. Los chips de valores dentro de un filtro (ej. Género en 06 — Filtros) usan en cambio **wrap hacia abajo** — el usuario se beneficia de ver todas las opciones disponibles antes de elegir, sin depender de notar que hay más contenido fuera de pantalla. No tratar estos dos casos como el mismo patrón solo porque visualmente ambos son "chips".

**Tipografía (histórica, del UI Kit viejo):** Roboto (tamaños vistos en el UI Kit: 20/Regular, 18/Extralight, 15/Light, 15/Medium, 14/Light). Ver más abajo la tipografía vigente del Design System nuevo.

**Nota:** para el portfolio de Ana (proyecto separado, `ana-portfolio`), el nombre "Theaveling" se muestra en **Sansita**, no en Roboto — esa es la tipografía de identidad del case study dentro del portfolio, no la tipografía de la UI del producto.

---

## Tipografía — Design System nuevo

Dos familias documentadas en `01.2 — Typography`: **Archivo** para Display/Headers/Intro, **Instrument Sans** para Body/UI. **Sansita** es la única excepción — reservada solo para el wordmark "Theaveling" (ver DECISIONS.md, corrección del sistema de color).

**Ajuste 2026-08-16 (pendiente de aplicar):** Display y H1 pasan de Archivo Bold a **Archivo Thin**, en tamaños grandes únicamente. Decisión de Ana: le gusta Archivo pero en Thin y grande para títulos — un peso fino a gran tamaño lee más "galería/cultura" que el Bold actual, que se parecía demasiado a tipografía de producto SaaS genérico (Notion, Linear). Regla acordada: Thin se reserva para Display/H1 (tamaños grandes, donde el trazo fino sigue siendo legible) — H2/H3/Intro/Body/UI se mantienen con su peso actual (Regular/Medium/SemiBold), para no perder legibilidad ni jerarquía en tamaños chicos. Cuando haya fotografía real detrás de títulos en Thin, van a necesitar un overlay/degradado para mantener contraste — queda anotado para cuando se llegue a esa etapa, no es urgente ahora.

---

## Investigación

- Entrevistas (10)
- Encuestas
- Card Sorting (Figma / presencial, 2 rondas — v1 y v2)
- Usability testing vía Zoom (5 usuarios)

---

## Código — no decidido

Todavía no se ha elegido stack para construir el producto ni el case study. Cuando se decida, documentar aquí siguiendo el mismo formato que `orbit-app/knowledge/STACK.md` (framework, routing, UI/componentes, IA si aplica, datos, infraestructura, estructura de carpetas).

**Antes de llegar a esta etapa**, según lo acordado con Ana: primero se terminan los cambios de design system en Figma, luego se pasa a trabajar la responsividad, y solo después se decide cómo se traduce a código.
