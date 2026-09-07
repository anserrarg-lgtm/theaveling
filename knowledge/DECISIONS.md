# Product Decisions

> Registro de decisiones históricas importantes que no aparecen en el código ni en Figma.
> Este documento explica el por qué detrás de cada decisión, no solo el qué.
> Se actualiza cada vez que se toma una decisión importante.

---

## De "app de turismo cultural" a "curaduría de nicho de artes escénicas"

**Decisión:** afilar el posicionamiento de Theaveling. Ya no se describe como una app para que turistas encuentren "actividades" o "planes culturales" en general — se describe como una plataforma de descubrimiento y reserva de experiencias artísticas y culturales de nicho, con foco en artes escénicas.

**Contexto:** la hipótesis original ya mencionaba "específicamente teatrales", pero el research y el copy del producto se mantenían amplios (arte y cultura para viajeros en general). La investigación (entrevistas + experiencia personal de Ana) mostró que el problema real no era "no encontrar actividades" sino no tener acceso al conocimiento local necesario para encontrar experiencias de nicho.

**Por qué:** un posicionamiento amplio compite con apps de turismo genéricas (Atrápalo, Visit a City, Fever) sin diferenciarse. El posicionamiento de nicho + curaduría (MUBI + Airbnb + Teatrix) le da a Theaveling un espacio propio y defendible.

**Consecuencia:** "alternativo" y "de nicho" dejan de ser categorías visibles en la navegación — pasan a ser el criterio de curaduría implícito. Ver ARCHITECTURE.md.

---

## Sacar el chat/conexión social del MVP

**Decisión:** eliminar el chat grupal y la funcionalidad de "conectar con personas" como parte core del producto. La comunidad pasa a ser una capa secundaria (reseñas/tips) dentro de la página de experiencia, no una sección principal de navegación.

**Contexto:** el MVP original (research v1) incluía "descubrir y conectar con personas" (chat grupal, conectar con otras personas) como una de las tres funcionalidades imprescindibles, junto con exploración/búsqueda y pago.

**Por qué:** la funcionalidad social se alejaba del problema principal (descubrimiento de experiencias de nicho). Agregarla al MVP diluía la propuesta de valor y sumaba complejidad de producto (moderación, red social, engagement) que no es necesaria para demostrar el núcleo: descubrir → explorar → elegir → reservar.

**Consecuencia:** el prototipo actual todavía tiene un ícono de chat en la navegación principal inferior — esto es una inconsistencia pendiente de resolver, no una decisión tomada. Ver ARCHITECTURE.md.

---

## Arquitectura de información: TODO / ESCENA / CULTURA (Card Sorting v2)

**Decisión:** reorganizar la navegación alrededor de tres secciones principales — TODO (curaduría general), ESCENA (artes escénicas: teatro, danza, performance, música) y CULTURA (cine, lecturas dramáticas, charlas, talleres, festivales) — más BÚSQUEDA, EXPERIENCIA y PERFIL.

**Contexto:** el Card Sorting original (v1) usó un set de tarjetas más disperso y generó clusters ambiguos. Se realizó un segundo Card Sorting (v2) con 10 participantes y un set de tarjetas más específico (Teatro, Danza, Performance, Música en vivo, Cine local, Cineclub, Lectura dramática, Charla artística, Taller, Festival), que arrojó dos agrupaciones claras.

**Por qué:** la agrupación ESCENA/CULTURA refleja mejor cómo las personas piensan sobre este tipo de contenido, y separa las artes escénicas (el foco central del producto) de formatos culturales relacionados pero distintos.

**Consecuencia:** el Sitemap y el User Flow en Figma ya se actualizaron con esta arquitectura. La pantalla Home y la navegación inferior del prototipo hi-fi **todavía no se sincronizaron** — ver ARCHITECTURE.md. No tratar el Card Sorting v2 como validación cuantitativa definitiva — fue un ejercicio exploratorio con 10 participantes.

---

## Modelo de negocio como hipótesis, no como resultado validado

**Decisión:** incluir una sección de modelo de negocio en el case study, pero presentarla explícitamente como proyección/hipótesis, nunca como algo comprobado.

**Contexto:** Teatrix (referente de benchmark) muestra que un producto de nicho puede construir un modelo de negocio alrededor de contenido específico. Esto llevó a explorar posibles direcciones para Theaveling: comisión por reserva/ticketing, membresía o curaduría premium, alianzas con espacios y productores independientes, pases o experiencias curadas.

**Por qué:** le da profundidad de producto al case study sin inflar el estado real del proyecto. Ninguna de estas direcciones fue validada con datos — serían la base de una futura fase de investigación de negocio.

**Consecuencia:** en el case study, esta sección debe etiquetarse claramente como "modelo de negocio previsto" o "cómo podría escalar Theaveling", diferenciada visualmente de la sección de validación real (research, card sorting, testing). Ver CASE_STUDY.md, sección "Validación & éxito".

---

## Simplificación de la paleta de color: rojo y mint pasan a ser acentos puntuales

**Decisión:** en el archivo "Prototipo final" de Figma, se redujo el uso de `#F31006` (rojo) y `#2ECCA6` (mint) a usos extremadamente específicos, y se pasó el resto de la UI a blanco + variaciones de transparencia sobre el fondo `#112C2C`. Rojo queda reservado solo para la palabra "Theaveling" (wordmark). Mint queda reservado solo para el ícono de check de la pantalla "Pago exitoso".

**Contexto:** Ana notó que el rojo, usado ampliamente en la práctica (estrellas de rating, ícono de favoritos, resaltado de fecha en calendario, íconos varios), resultaba visualmente caótico. Pidió mantener el fondo `#112C2C` y mover la mayoría de la UI a blanco/transparencias, dejando el rojo solo para el logo (la palabra "Theaveling") y el mint para "cosas extremadamente puntuales" — dejando a mi criterio cuál sería ese uso puntual del mint.

**Ejecución:** se escaneó el archivo completo (~3224 nodos en Page 1) buscando fills/strokes sólidos que coincidieran con rojo o mint — 67 coincidencias de rojo, 79 de mint. Se excluyeron los swatches de referencia del UI Kit y la decoración del diagrama de Sitemap (documentación, no UI real). El resto se convirtió a blanco, preservando la opacidad que cada capa ya tenía (para no inventar una escala de transparencia nueva no verificada). Se eligió el ícono de "Pago exitoso" como el único uso reservado de mint, por su asociación semántica con éxito/confirmación.

**Correcciones tras verificación visual:** el símbolo/ícono del logo (el círculo y la figura que acompañan a la palabra "Theaveling") se había preservado en rojo junto con el texto, pero al revisar la pantalla "LOGIN CON GOOGLE" se vio que quedaba fuera de lugar — ahí se usa el mismo ícono como parte de un mockup genérico, no como marca. Se corrigió para que el rojo quede solo en el texto "Theaveling", nunca en el ícono. También se detectó que la fecha resaltada del calendario ("hoy"/seleccionada) quedaba invisible al pasar de rojo a blanco sobre un fondo de tarjeta blanco — se corrigió dándole un fondo circular `#112C2C` con texto blanco, en vez de inventar un tercer color.

**Por qué:** el resultado debía verificarse visualmente antes de darse por terminado, no asumirse correcto solo porque el script no tiró errores — ver ARCHITECTURE.md y la práctica general de este proyecto de no dar por sentado sin comprobar en Figma.

**Consecuencia:** paleta simplificada aplicada y verificada en pantallas representativas (búsqueda/rating, pago exitoso, login, logo, calendario, onboarding). Queda un gap sin resolver: el ícono de la pantalla "LOGIN CON GOOGLE" (mockup de placeholder, contenido dice "flamefactory.io") ahora es invisible al quedar blanco sobre blanco — no se inventó un tratamiento nuevo porque esa pantalla no parece ser contenido de marca propia terminado. Ver STACK.md.

---

## Rediseño visual completo: nuevo Design System / UI Foundation desde cero

**Decisión:** Ana decidió no seguir iterando sobre las pantallas existentes de "Prototipo final". En su lugar, va a construir una dirección visual nueva desde cero para Theaveling, manteniendo únicamente la identidad conceptual y de marca ya definida (posicionamiento de nicho, arquitectura ESCENA/CULTURA, colores identitarios verde oscuro + rojo). Antes de rediseñar ninguna pantalla de la app, se construye primero un Design System / UI Foundation completo y reutilizable en Figma, que Ana debe revisar y aprobar antes de usarlo para reconstruir Theaveling.

**Contexto:** el 2026-08-14, después de la simplificación de paleta documentada arriba ("Simplificación de la paleta de color: rojo y mint pasan a ser acentos puntuales" — un ajuste rápido sobre el prototipo existente), Ana le dio un prompt detallado a un agente de Figma **fuera de esta sesión** ("figma agent", herramienta/sesión distinta a la usada acá) para que arranque este rediseño completo. Me compartió el prompt para que quedemos conectados, pero fue explícita: **todavía no quiere que yo haga nada sobre el diseño** — ni en Figma ni construyendo pantallas — solo pidió que quede documentado.

**Contenido del brief (para no perderlo, es la referencia de aprobación pendiente):**

*Dirección de marca:* plataforma de descubrimiento/reserva de experiencias artísticas y culturales de nicho. Personalidad: escena artística, teatro, performance, cultura, descubrimiento, curaduría, lo alternativo, lo que queda fuera de los circuitos visibles. Debe transmitir atmósfera escénica, contraste luz/sombra, sensibilidad editorial/cultural, sofisticación, misterio. Evitar estética turística genérica, corporativa, o de app de eventos genérica — más cercana a una plataforma editorial/cultural de nicho combinada con una plataforma moderna de descubrimiento.

*Simbolismo de color (nuevo, no estaba capturado antes):* verde oscuro = sombra, lo oculto, lo que todavía no ha sido descubierto, profundidad, atmósfera teatral. Rojo = luz, escena, performance, lo que se ilumina, energía artística. El rojo debe usarse principalmente como identidad de Thea/logo y como acento extremadamente controlado — no una interfaz llena de rojo. El resto de la interfaz se construye con blanco, transparencias, niveles de opacidad, neutrales derivados del blanco, y verde oscuro en elementos estructurales/de contraste. Sin paleta multicolor por categoría — las categorías de contenido no se diferencian por colores arbitrarios.

*Principio de diseño (frase guía):* "Lo que está en la sombra hasta que Thea lo ilumina." Explícitamente NO debe traducirse literalmente en una interfaz negra con elementos rojos — la metáfora se expresa a través de contraste, transparencias, fotografía, profundidad, espacios, tipografía y pequeños acentos de luz.

*Tokens de color planeados (valores exactos aún no definidos, a definir con foco en accesibilidad):*
- Brand: Thea Green, Thea Red
- Neutrals: White, White/90%, /70%, /50%, /30%, /15%, /8%
- Dark: Deep Green, Deep Green/90%, /70%, /50%
- Semantic: Background, Surface, Surface Elevated, Text Primary, Text Secondary, Text Muted, Border, Divider, Accent, Error

*Tipografía planeada:* jerarquía completa — Display/Hero, H1–H4, Body Large, Body, Body Small, Caption, Label, Button. Tono contemporáneo/editorial pero muy legible. Estilos reutilizables de Figma.

*Spacing:* escala reutilizable, ejemplo dado: 4/8/12/16/24/32/48/64 — sin valores arbitrarios.

*Grid y layout:* mobile grid, desktop grid, márgenes, gutters, max-width, spacing entre secciones. Debe soportar layouts editoriales con cards de distintos tamaños (fuerte presencia de imágenes).

*Componentes planeados:* Navigation (navbar desktop, bottom nav mobile, logo, search), Buttons (primary/secondary/ghost/icon), Inputs (search field, text input, select, filter), Content cards (experience card, featured experience card, recommendation card, category card, artist/space card, community/comment card), Tabs/category navigation/breadcrumbs, Feedback (empty/error/success/loading state), Booking (date/time/quantity selector, booking summary, payment summary).

*Cards (foco especial):* una sola familia coherente de cards, no muchas variantes visualmente distintas. Deben comunicar imagen (protagonista), nombre de experiencia, categoría, ubicación, fecha cuando corresponda, precio, e indicador de curaduría/recomendación cuando corresponda. Interfaz más editorial que transaccional.

*Navegación (reconfirma lo ya documentado en ARCHITECTURE.md, sin cambios):* TODO (Recomendado para ti / Más reservados / Nuevos descubrimientos), ESCENA (Teatro/Danza/Performance/Música), CULTURA (Cine/Cine local/Cineclub/Lecturas dramáticas/Charlas/Talleres/Festivales), BÚSQUEDA (por palabra/filtros), PERFIL (Mis reservas/Favoritos/Preferencias). Comunidad explícitamente fuera de la navegación principal — sigue como capa secundaria dentro de la experiencia.

*Organización pedida en Figma:* una página/sección "THEAVELING — DESIGN SYSTEM" con: 01 Foundations, 02 Colors, 03 Typography, 04 Spacing & Grid, 05 Components, 06 Cards, 07 Navigation, 08 Forms & Inputs, 09 States, 10 UI Examples. Variables y componentes nativos de Figma, Auto Layout y variantes donde corresponda. Explícitamente **no** se diseñan todavía las pantallas completas de la app — primero se revisa y aprueba este sistema.

**Por qué:** evitar reconstruir pantalla por pantalla sin una base consistente — construir primero fundamentos reutilizables (color, tipografía, spacing, componentes) reduce el riesgo de que el nuevo rediseño termine tan inconsistente como el prototipo actual.

**Consecuencia:** esta decisión **extiende y eventualmente reemplaza** la simplificación de paleta anterior — esa fue un ajuste rápido sobre el prototipo existente; esto es una reconstrucción completa desde cero. Mientras el otro agente trabaja, esta sesión no modifica nada en Figma ni construye pantallas — solo queda documentado el brief como referencia. Pendiente: cuando el Design System esté listo, revisarlo contra este brief y recién ahí decidir los próximos pasos (aprobación, ajustes, y eventualmente reconstrucción de pantallas). Ver ROADMAP.md.

---

## Corrección de dirección: no es "editorial", es "artístico" — y se retira la frase de sombra/iluminación

**Decisión:** dos ajustes a la dirección de marca del Design System nuevo, hechos por Ana directamente en Figma y confirmados acá:

1. Se retiró del Foundations la frase guía "Lo que está en la sombra hasta que Thea lo ilumina". Verificado en Figma (nodo `01 — Foundations`, `1369:239`): el Design Principle ahora es solo "Descubre la escena artística alternativa de una ciudad." con las etiquetas Contraste · Transparencias · Fotografía · Profundidad · Tipografía · Espacios — sin ninguna mención a sombra/iluminación.
2. Corrección del framing "editorial" que yo (Claude) venía usando para describir la dirección visual — tanto en el brief original como en mi propia crítica del Design System. Ana fue explícita: **Theaveling no es "editorial"**. Es **artístico**, pero sin dejar de apelar a los patrones de UX/UI convencionales/familiares — no quiere layouts experimentales tipo revista que rompan la grilla o adopten convenciones no estándar de interacción.

**Contexto:** en mi revisión del Design System (ver la sección de crítica más abajo, no registrada como decisión formal sino como feedback) yo había recomendado empujar hacia un tratamiento "magazine" — imagen a sangre, tipografía superpuesta, layouts que rompan la grilla — apoyado en el lenguaje "editorial" que aparecía en el brief original (sección "Dirección de marca" y "Grid y layout" de la entrada de rediseño completo, arriba). Ana corrigió: esa lectura no es la que quiere. La referencia debe seguir siendo reconocible como UX/UI de producto, no como una publicación editorial/revista.

**Por qué:** mantener patrones de interacción familiares reduce fricción de uso — la sofisticación artística debe vivir en tipografía, color, fotografía y atmósfera, no en reinventar la forma en que la gente navega o reconoce componentes de interfaz. Esto es consistente con la corrección de Voice & Messaging que se viene discutiendo en paralelo: sofisticación sin sacrificar claridad/usabilidad.

**Consecuencia:** las referencias a "editorial" en la entrada "Rediseño visual completo" (arriba, en este mismo archivo) y en GLOSSARY.md quedan como registro histórico del brief original — no se reescriben, pero ya no reflejan la dirección vigente. La dirección vigente es: **artístico, atmosférico, curado — dentro de formas de UX/UI reconocibles**, no editorial/magazine. La recomendación que hice de romper la grilla en las cards queda retirada. Pendiente: si Ana quiere, ajustar también PRODUCT.md (que usa "tono editorial y artístico" para describir la narrativa del case study en el portfolio, un contexto distinto — la voz de cómo se *escribe sobre* el proyecto, no el lenguaje visual del producto en sí) — no se tocó porque no está claro si aplica ahí también.

---

## Corrección del sistema de color del Design System nuevo

**Decisión:** el primer intento del agente de Figma que está construyendo el Design System interpretó mal el sistema de color — entre otras cosas, inventó "Deep Green" como un color de marca separado de Thea Green. Ana le dio una corrección explícita, con instrucción de tocar **solo** el sistema de color (no tipografía, no componentes/cards/navegación/spacing/layout salvo para actualizar sus tokens de color, no pantallas de aplicación) y reemplazarlo por la dirección final. Ver la versión final completa en STACK.md, sección "Sistema de color — versión final".

**Contexto:** esto pasó inmediatamente después de la sesión anterior donde documentamos el brief original del Design System (colores como "tokens a definir"). El agente externo ya había avanzado y se equivocó en la interpretación — el error concreto que Ana identificó fue la creación de un verde de marca alternativo ("Deep Green") en vez de usar Thea Green (`#112C2C`) como el único verde estructural.

**Reglas clave de la corrección (resumen, ver STACK.md para el detalle completo):**
- Thea Green `#112C2C` es el único verde de marca — nada de "Deep Green" ni otro verde oscuro alternativo.
- Thea Red `#F31006` se mantiene extremadamente escaso — únicamente wordmark/identidad de Thea, nunca como color funcional de UI (no botones, no nav, no categorías, no links, no error, no cards, no fondos).
- Thea Mint `#2ECCA6` se renombra "Interaction Accent" — deja de pensarse como segundo color de marca, pasa a ser exclusivamente para estados de interacción chicos (selección, toggles, checkmarks, filtros, confirmaciones sutiles).
- Off-white `#FBFBFB` como color claro primario, evitando blanco puro salvo necesidad técnica.
- La jerarquía visual se construye con una escala de tokens de opacidad reutilizables (blanco sobre verde, verde sobre superficies claras) en vez de una paleta de grises arbitraria.
- Los colores semánticos (Error/Warning/Success/Info) quedan separados de los colores de marca — Thea Red no es "el error", Thea Mint no es "el éxito".
- Sin colores por categoría de contenido (Teatro/Danza/Cine/etc.) — la diferenciación viene de fotografía/tipografía/contenido/curaduría/layout.

**Por qué:** mantener el rojo y el mint como firmas de marca extremadamente controladas, en vez de accesorios funcionales de UI, es coherente con la decisión original de Ana de reducir el uso de ambos colores (ver la entrada anterior "Simplificación de la paleta de color") — esta corrección la formaliza y la lleva al nivel de sistema de tokens, y corrige un desvío del agente externo antes de que se propague a componentes.

**Consecuencia:** esta sesión no tocó Figma — Ana volvió a ser explícita en que esto se lo está pidiendo a un agente externo y que acá solo queda documentado para referencia. Los valores hexadecimales confirmados (`#112C2C`, `#F31006`, `#2ECCA6`, `#FBFBFB`) coinciden con los que ya estaban documentados en STACK.md del ajuste de paleta anterior — no hubo cambio de valores, solo de roles/reglas de uso y de la estructura de tokens. Pendiente: revisar el Design System una vez que el agente externo aplique esta corrección.

---

## Patrón nuevo: Featured Card + riel horizontal de curaduría

**Decisión:** debajo de cada card destacada grande (Featured Experience) que ocupa scroll vertical importante, agregar un riel horizontal chico con otras recomendaciones curadas — reusando el "Supporting Card / Recommendation" (280px) que ya existe en el Card System, sin necesidad de un componente nuevo. El riel debe llevar un título que lo ate a la curaduría (por ejemplo reusando "Más reservados" / "Nuevos descubrimientos" de la navegación ya construida, o algo como "Otros descubrimientos curados por Thea"), no un título genérico tipo "más contenido".

**Contexto:** idea de Ana al notar que los destacados de Thea (Featured Experience cards) son grandes y requieren scroll — surgió la pregunta de qué va justo después de esa card grande.

**Por qué:** es el mismo patrón que usa MUBI en sus Colecciones — un ítem destacado grande seguido de un riel horizontal con el resto de esa selección curada (ver la entrada de arriba sobre filtros de género y el precedente de MUBI). Comunica "esto es un grupo elegido a propósito" en vez de un feed genérico infinito, y es un patrón de interacción extremadamente convencional (Netflix, Spotify, Airbnb Experiences) — coherente con la corrección de dirección "artístico pero dentro de formas de UX/UI reconocibles".

**Consecuencia:** se documenta como Pattern nuevo a pedirle al agente de Figma (sección 03 — Patterns del Design System), mostrando la composición Featured Card + riel horizontal debajo. No implica crear un componente de card nuevo — reusa el Supporting Card / Recommendation existente.

---

## No inventar pantallas que no existen en el prototipo

**Decisión:** antes de dar por sentado que existen pantallas para Perfil, los estados de error del User Flow (sin resultados, sin disponibilidad, error de pago) o un bloque dedicado a "Artistas / espacio", se verificó directamente en el árbol de nodos de Figma.

**Contexto:** el Sitemap y el User Flow mencionan estos elementos como cajas/nodos de diagrama, lo cual podía confundirse con pantallas reales ya diseñadas.

**Por qué:** el case study debe reflejar el estado real del prototipo, no lo que el diagrama de arquitectura sugiere conceptualmente. Presentar un diagrama como si fuera una pantalla diseñada sería inexacto.

**Consecuencia:** se confirmó que Perfil, los 3 estados de error y "Artistas / espacio" como bloque diferenciado **no existen como pantallas reales** — solo como texto dentro del Sitemap/User Flow. Quedan marcados como gap en ROADMAP.md, pendientes de decisión (diseñarlos o representarlos solo conceptualmente en el case).

---

## Corrección: no perder la inclinación hacia gente viajera al definir el brand

**Decisión:** al pasar de "app de turismo cultural" a "curaduría de nicho de artes escénicas" (ver primera entrada de este archivo), esa corrección afiló el posicionamiento pero **no significa que Theaveling dejó de estar orientada a gente que viaja**. Sigue inclinada hacia esa persona, aunque no es exclusiva para turistas.

**Contexto:** al pedirme una definición del brand de Thea en lo estético y teórico, resumí el producto como "plataforma de curaduría de nicho de artes escénicas, no una app de turismo cultural" — describiéndolo como si el contexto de viaje se hubiera dejado atrás por completo. Ana corrigió: sí es curaduría de nicho, pero sigue inclinada a la gente viajera que quiere acceder a una oferta cultural de nicho sin conocer lo local. Su formulación exacta: "theaveling es esa persona que ya conoce la ciudad, por eso tiene acceso a ofertas más infravaloradas del sector artístico escénico" — y comparó el patrón de uso con Airbnb: "lo puede usar todo el mundo, nativos y no nativos, pero está inclinado hacia gente que está viajando a un lugar."

En una segunda vuelta, Ana ajustó también mi primera redacción de esta corrección: yo había escrito que el patrón de uso "es el mismo" que el de Airbnb. Ana precisó: **no es igual a Airbnb, pero encuentra sentido en varias cosas del servicio de esa app.** Es un referente parcial/análogo, no una equivalencia — Airbnb es una plataforma de alojamiento/experiencias en general, sin el foco de nicho curado de artes escénicas que tiene Theaveling.

**Por qué:** el giro de "turismo cultural" a "curaduría de nicho" (documentado en la primera entrada de este archivo) fue sobre el *tono y la categoría de producto* — dejar de sonar a app de turismo genérica y competir por posicionamiento de nicho — no sobre abandonar el contexto de uso real. El problema que resuelve Theaveling (no conocer la escena local) es estructuralmente más agudo para alguien de paso que para alguien que vive en la ciudad, así que el caso de uso más fuerte sigue siendo el de la persona viajera, sin que eso convierta al producto en exclusivo para turistas.

**Consecuencia:** se actualizó PRODUCT.md, sección "Qué es Theaveling", agregando el párrafo "Inclinación hacia gente viajera" con esta definición, dejando explícito que el parecido con Airbnb es parcial/análogo, no una equivalencia de producto. También se agregó una aclaración en la sección "Posicionamiento y referentes", en el bullet de Airbnb, con la misma precisión. No se tocó la sección "El problema" (ya mencionaba "por ser de fuera / no estar dentro de la escena", que es consistente con esta corrección, solo menos explícito) ni la primera entrada de este archivo sobre el giro de posicionamiento, que sigue siendo válida — esta entrada la complementa, no la reemplaza.

---

## Revisión de verificación del canvas (2026-08-17)

**Decisión:** a pedido de Ana, se hizo una revisión completa del canvas del Design System (lectura, no solo confianza en lo reportado por el agente externo) buscando inconsistencias con el criterio de marca ya documentado. Se encontraron tres puntos; dos quedaron resueltos, uno queda abierto.

**Hallazgo 1 — corregido en mi lectura, no en Figma:** inicialmente reporté los frames "categoría-theaveling-cards desktop/mobile" (`1405:90`, `1407:4`) como pantallas completas de la app construidas fuera de alcance. Ana corrigió: son un sistema de cards aparte para desktop y mobile de categorías, no pantallas de producto. Queda como corrección de mi lectura, no hay cambio en Figma ni en el resto de la documentación por este punto.

**Hallazgo 2 — resuelto, no era el problema que planteé inicialmente:** esos mismos frames usan Thea Mint en las etiquetas de categoría de cada card (ej. "DANZA CONTEMPORÁNEA", "TEATRO EXPERIMENTAL" — 16 instancias). Yo lo marqué como posible error citando la regla vigente en STACK.md ("nunca diferenciación de categorías", "debe aparecer ocasionalmente"). Ana preguntó cuál era exactamente el problema y si no se veía bien. Al revisarlo de nuevo con más precisión: no se rompe la regla de "sin colores por categoría" — esa regla es sobre no darle a cada categoría un color propio (Teatro un color, Danza otro); acá todas comparten el mismo mint, no hay diferenciación, es una etiqueta de taxonomía consistente. Lo único que chocaba era la letra de la frase de interacción, que no describía este uso — no un problema visual real. Además, el rojo es la única firma de identidad de marca (exclusiva del wordmark); el mint nunca cargó ese mismo peso, así que no necesita la misma restricción severa. Se actualizó STACK.md: Mint ahora tiene dos usos válidos documentados — estados de interacción chicos, y etiquetas chicas de taxonomía/categoría (uso consistente, nunca por-categoría). Se confirmó que el Card System oficial (sección 04, componentes aprobados) no usa mint así — pero ya no es relevante como problema, es simplemente otro contexto de uso.

**Hallazgo 3 — corregido directamente en Figma, por esta sesión:** la sección "01.5 — Icons" tenía dos textos con "editorial" ("el carácter visual se inspira en la calidez editorial del producto", nodo `1480:8`; "Editorial antes que corporativo" como rasgo de personalidad, nodo `1480:18`) — contradecía la corrección ya vigente en "01.4 — Brand & Content" (que sí dice correctamente "NO editorial/revista"), es decir, era una inconsistencia interna del mismo archivo. Ana pidió definir primero qué significa "artístico" en términos de UX (no solo el adjetivo) — esa definición quedó documentada en VOICE.md, sección "'Artístico' en términos de UX (no editorial)". Con esa base, Ana pidió explícitamente que esta sesión corrigiera el texto directamente en Figma (excepción puntual al patrón habitual de esta colaboración, donde los cambios en Figma los aplica un agente externo a partir de prompts que yo redacto — ver README y las entradas de arriba). Se cambió "la calidez editorial del producto" → "la sensibilidad artística y curatorial del producto", y "Editorial antes que corporativo" → "Curatorial antes que corporativo" (mantiene la estructura paralela de la lista y conecta con el vocabulario ya establecido de curaduría). Verificado con screenshot tras el cambio — sin overflow ni corte de texto.

**Por qué:** esta revisión reafirma la práctica del proyecto de verificar directamente en Figma en vez de asumir que el agente externo aplicó todo correctamente — dos de los tres hallazgos eran reales, uno era una mala lectura mía que Ana corrigió a tiempo.

**Consecuencia:** ver VOICE.md (nueva sección) y STACK.md (nota sobre el hallazgo 2, pendiente de decisión). El resto de la revisión salió limpio: el cambio a Archivo Thin en Display/H1 está aplicado correctamente (21 nodos en Thin a tamaños grandes, cero en Bold en esos tamaños), el placeholder de búsqueda está resuelto en todos los lugares donde aparece, la sección 01.4 — Brand & Content coincide con VOICE.md, y no se encontró Thea Red filtrado fuera de sus usos aprobados.

---

## Piece Info Hero — primera card construida directamente por esta sesión en el Card System

**Decisión:** se construyó "Piece Info Hero" — la cabecera de la pantalla de Detalle de experiencia (imagen/video a sangre + back/share/favorito encrustados + título + precio + descripción) — como componente real de Figma en 02 — Components → Cards, junto a los otros 4 tipos (Experience, Curated/Featured, Supporting, Artist/Space). Ver ARCHITECTURE.md para el contenido completo de la pantalla de Detalle.

**Contexto:** al revisar el canvas para esta card (pedido de Ana), se encontró que el Card System se reestructuró — Ana confirmó que lo cambió ella misma directamente en Figma: los componentes reales viven ahora en "02 — Components → Cards" (4 tipos), y "04 — Card System" quedó como la documentación/razón de ser de cada tipo, sin las cards visuales. También se encontró que el set de íconos (01.5 — Icons) estaba inestable — nodos que existían en un escaneo ya no estaban dos minutos después, por edición concurrente de Ana. Se reportó esto antes de construir nada.

**Ejecución:** Ana pidió construir la card igual, y de paso volver reutilizables los íconos. Se verificó que `icon/heart` y `icon/caret-left` ya existían como componentes reales (20×20px, con instancias ya usadas en otras cards) — se reusaron directamente, sin crear nada nuevo. `icon/share` no existía como componente — solo como capa suelta (`share-network-thin`, 256×256, sin componentizar). Se creó `icon/share` como componente nuevo de 20×20px a partir de esa capa, siguiendo la misma convención de tamaño, color (Thea Green sólido) y nombre (`icon/*`) que los otros íconos. El botón de back reusa `icon/caret-left` existente — no se inventó un ícono de "atrás" distinto.

La card se armó en dos pasos (bloque de imagen con los tres chips de ícono primero, verificado con screenshot; luego el bloque de contenido y el ensamblado final) y se agregó como 5ª card en la fila de "Card Components", con el mismo formato de etiqueta + descripción que usan las otras 4. Tipografía y color reusan exactamente los valores ya en uso (Archivo Thin 32px para el título — mismo tratamiento que H1 en 01.2 Typography —, Instrument Sans SemiBold 20px para precio, Instrument Sans Regular 15px/70% para descripción, superficie Off-white, sin radio en la zona de imagen porque es a sangre, no una card contenida como las otras 4).

**Por qué:** es la primera pieza real de la pantalla de Detalle, y no existía ni la card ni un ícono de share reusable — sin esto, cualquier prompt al agente de Figma para armar la pantalla completa hubiera tenido que inventar el ícono de share de cero.

**Consecuencia:** el precio de muestra quedó en USD ("Desde US$15"), reflejando la decisión de mostrar precio en dólares en esta pantalla (ver ARCHITECTURE.md). La documentación en 04 — Card System se completó después, en una pasada separada — ver entrada siguiente.

---

## Pasada de QA: ícono Caret Down, documentación de Piece Info Hero, e inconsistencia encontrada en Pattern / Booking

**Decisión / hallazgos, todos del 2026-08-17:**

1. **Bug corregido:** la card "Caret Down" en la galería de 01.5 — Icons tenía `primaryAxisAlignItems: CENTER` en su contenedor, en vez de `MIN` como las otras 17 cards de íconos — el glyph (correctamente dibujado) quedaba flotando a media altura en vez de pegado arriba. Corregido a `MIN`, verificado con posiciones idénticas a Caret Left tras el fix.

2. **Nota sin resolver:** la card de "Share" en esa misma galería no tiene el mismo tratamiento visual que el resto (sin fondo blanco, sin label) — detectado pero no corregido, pendiente de que Ana confirme si quiere que se toque.

3. **Documentación completada:** se agregó "Piece Info Hero" como 5ª entrada en la lista de tipos de 04 — Card System → Card Family → Card Types (mismo formato que las otras 4), y se agregó una sección nueva "Piece Info Hero — Ficha completa" al final de 04 — Card System, cubriendo anatomía, imagen, tipografía, radio/superficie, responsive y reutilización de íconos — todo en un bloque de texto consolidado en vez de insertarse en cada una de las 8 grillas existentes (evitando el riesgo de romper el auto-layout de secciones muy densas ya construidas).

4. **Inconsistencia real encontrada, pedido explícito de Ana ("fíjate si hay consistencia entre lo que hay en pattern y componentes sobre cards"):** en 03 — Patterns, el patrón "Pattern / Featured + Rail" sí reusa instancias reales de los componentes del Card System (`Curated / Featured Card`, `Supporting Card` — confirmado programáticamente vía `getMainComponentAsync()`). Pero "Pattern / Booking" → "Booking Summary" **no es una instancia de ningún componente** — es un frame armado a mano, con su propio tratamiento de categoría/título/metadata (incluye un patrón de bullet-point que no está documentado en ningún lado del Card System). Esto significa que si el Card System cambia (tipografía, color, spacing), "Booking Summary" no lo hereda automáticamente — puede desviarse con el tiempo. **No se corrigió** — es una decisión de alcance mayor (¿se convierte en un componente formal del Card System, o es intencionalmente distinto por ser una vista de resumen de compra?), se lo reporté a Ana en vez de decidir por mi cuenta.

**Por qué:** todo esto surgió de un pedido puntual de Ana (revisar el ícono Caret Down) que llevó a completar dos tareas que habían quedado pendientes explícitamente a pedido suyo en el mismo mensaje.

**Consecuencia:** Card System queda con 5 tipos documentados de punta a punta. Pendiente de decisión: qué hacer con "Booking Summary" y con la card de "Share" en la galería de íconos.

---

## Booking Summary Card — 6ª card formal del Card System, resolviendo la inconsistencia de la entrada anterior

**Decisión:** se formalizó "Booking Summary" como componente real del Card System — "Booking Summary Card" — en 02 — Components → Cards, junto a las otras 5 (Experience, Curated/Featured, Supporting, Artist/Space, Piece Info Hero). Cierra el hallazgo 4 de la entrada anterior (Pattern/Booking usaba un frame armado a mano, no una instancia de componente).

**Contexto:** al preguntar Ana dónde estaba la card de resumen y si "Piece Info Hero" simplemente la podía reemplazar, se determinó que no — son estructuralmente distintas: Piece Info Hero es una cabecera de imagen a sangre de 390×400 sin CTA propio (se toca la pantalla entera para navegar), mientras que Booking Summary es una card compacta de 358×160 con franja de color (no imagen) y un botón de confirmación incrustado — vive en Compra, no en Detalle, y recapitula una decisión ya tomada en vez de invitar a explorar. Ana pidió una sugerencia y, tras proponer convertirla en 6º componente formal (en vez de dejarla como excepción no documentada), aprobó con "hazlo".

**Ejecución:** se clonó el "Booking Summary" original (`1373:54`) en vez de reconstruir desde cero, para preservar la estructura ya aprobada visualmente, y se corrigieron las tres desviaciones encontradas en la pasada de QA anterior:
- **Categoría** ("PERFORMANCE"): Instrument Sans Medium 45% de opacidad → **Instrument Sans SemiBold 100%**, alineando con la convención de etiquetas que ya usan las otras cards.
- **Título** ("Cuerpos en tránsito"): Archivo Regular 22px (fuera de escala) → **Archivo Regular 20px**, alineando con 01.2 — Typography.
- **CTA**: frame dibujado a mano que imitaba un botón → **instancia real del componente Button** (Style=Primary, State=Default, `1388:2`), texto "Confirmar reserva", `layoutSizingHorizontal: FILL` — ahora cualquier cambio futuro al componente Button se propaga acá automáticamente, que era exactamente el riesgo que motivó formalizar esta card.

Con esas correcciones aplicadas sobre el clon, se componentizó con `createComponentFromNode` (id `1538:149`) y se agregó como 6ª card en la fila de "Card Components", con el mismo formato de etiqueta + descripción que usan las otras 5 — nota explícita en la descripción de que es la única de las 6 con acción primaria incrustada.

Para cerrar el loop, se reemplazó el "Booking Summary" original dentro de "Pattern / Booking" (`1373:6`) por una instancia real del nuevo componente, en la misma posición (x:352, y:0) — verificado con screenshot que la composición completa (selectores de fecha/hora/cantidad a la izquierda, card de resumen a la derecha) se ve idéntica a como estaba, pero ahora conectada al Card System real.

Se completó también la documentación en 04 — Card System: "Booking Summary Card" se agregó como 6ª entrada en Card Family → Card Types, y se agregó la sección consolidada "Booking Summary Card — Ficha completa" al final del documento, mismo formato que las 5 fichas anteriores (anatomía, imagen, tipografía con los valores corregidos, radio/superficie, componentes reusados/CTA).

**Por qué:** dejar "Booking Summary" como frame no oficial significaba que no heredaba cambios del sistema con el tiempo — exactamente el riesgo documentado en la entrada anterior. Formalizarla resuelve eso y además corrige tres desviaciones reales de estilo que se habían acumulado sin que nadie las hubiera revisado contra el resto del Card System.

**Consecuencia:** Card System queda con 6 tipos documentados y componentizados de punta a punta — Experience, Curated/Featured, Supporting, Artist/Space, Piece Info Hero, Booking Summary Card. La inconsistencia entre 03 — Patterns y 02 — Components reportada en la entrada anterior queda resuelta: ambos patrones (Featured + Rail, Booking) ahora reusan instancias reales del Card System. Pendiente sin resolver, sin relación con esta entrada: la card de "Share" en la galería de íconos de 01.5 (sin fondo blanco ni label, ver entrada anterior).

---

## Auditoría de "02.1 — Navigation" y arquitectura de navegación mobile

**Decisión:** dos pasadas sobre la misma sección, la primera de QA de componentes y la segunda de arquitectura de información, terminaron en un plan conjunto de qué construir en Figma. Todavía **no ejecutado** — esta entrada documenta el diagnóstico y el plan acordado con Ana, pendiente de que el agente externo de Figma lo aplique.

**Contexto — pasada 1 (QA de componentes, a pedido de Ana: "chequealo"):** se inspeccionó nodo por nodo Desktop Navbar (`1419:94`), Mobile Bottom Navigation (`1419:118`) y Tab Navigation (`1419:175`) dentro de `1419:85`. Hallazgos, todos verificados por inspección directa (no supuestos):
1. La sección promete "Configuraciones de búsqueda contextual" en su descripción (`1419:89`) pero no hay ningún contenido construido para eso.
2. Cero especificaciones de interacción/teclado dentro de la sección — sí existen para Buttons, Inputs, Icons y Card System, pero ninguna cubre Navigation.
3. Desktop Navbar y Tab Navigation son FRAME sueltos, no componentes reales — a diferencia de Mobile Bottom Navigation, que sí es un COMPONENT_SET válido.
4. El campo de búsqueda del navbar es un frame hecho a mano (ícono + texto estático), no una instancia del componente real Input "Type=Search" (que ya tiene sus propios estados Hover/Focused documentados).
5. El ícono de "Perfil" en Mobile Bottom Nav es una forma dibujada a mano (dos elipses) en vez de reusar `icon/user` (`1483:171`), que ya existe en la librería. Los íconos de "Descubrir" (compás) y "Reservas" (ticket) no tienen equivalente en la librería todavía.

**Contexto — pasada 2 (arquitectura, a pedido de Ana):** Ana cuestionó algo más de fondo — el navbar de desktop no tiene versión mobile, y no quedaba claro a qué pertenecía Tab Navigation. Se verificó por inspección que, efectivamente, no existe en ningún lugar del archivo un componente mobile para elegir entre Todo/Escena/Cultura.

**Insight que destrabó la conversación:** el Bottom Nav mobile (Descubrir/Reservas/Perfil) y el navbar de desktop (Todo/Escena/Cultura + búsqueda + cuenta) resuelven preguntas distintas, no son la misma navegación en dos tamaños. Desktop responde "qué tipo de contenido querés ver" (eje de contenido); mobile Bottom Nav responde "en qué área funcional de la app estás" (eje funcional). La elección de contenido (Todo/Escena/Cultura) tiene que vivir dentro de la pantalla Descubrir en mobile, no como un tab más del Bottom Nav — por eso Tab Navigation quedaba sin ancla: intentaba resolver el eje de contenido sin que el nivel que lo contiene existiera todavía.

**Arquitectura acordada** (detalle completo en ARCHITECTURE.md, sección "Navegación mobile — arquitectura definida"): pantalla Descubrir en mobile = Mobile Top Bar (logo + ícono de búsqueda) → Category Tabs nivel 1 (Todo/Escena/Cultura, chip row horizontal scrollable, mismo patrón visual que ya existe) → Sub-category Tabs nivel 2 (contextual: cambia de contenido según qué chip de nivel 1 esté activo — Todo ya tiene copy final, Escena y Cultura llevan copy **placeholder**, Ana los va a redefinir con frases más atractivas en vez de los nombres genéricos de disciplina) → grid/lista de contenido. Estructuralmente equivalente al navbar de desktop, partido en dos filas por el ancho angosto.

**Por qué:** sin esto, cualquier construcción de la pantalla Descubrir en mobile iba a quedar sin lugar para elegir Escena o Cultura — un gap real de producto, no solo un detalle visual.

**Consecuencia:** se armó un prompt consolidado para el agente externo de Figma que cubre ambas pasadas — fixes de componentes existentes (ítems 1–5 de la pasada de QA) más la construcción nueva de Mobile Top Bar, Category Tabs nivel 1, y la generalización de Tab Navigation a Sub-category Tabs nivel 2 con las 3 variantes de contenido (Todo final, Escena/Cultura placeholder). Pendiente: que el agente lo aplique, y una nueva pasada de chequeo de esta sesión sobre el resultado. También queda pendiente, sin resolver todavía: el contenido de "Configuraciones de búsqueda contextual" (nadie definió qué significa "contextual" en ese contexto — no se inventó, se dejó marcado) y el copy final de los ítems de Escena/Cultura nivel 2.

---

## Reservas como tab propio, y contenido de Búsqueda/Filtros/Reservas/Perfil

**Decisión:** "Reservas" se queda como tab propio del Bottom Nav, no vuelve a vivir como "Mis reservas" dentro de Perfil (así estaba en el Sitemap original: PERFIL → Mis reservas / Favoritos / Preferencias). Además se definió el contenido de Reservas, Perfil, Búsqueda y Filtros — completando la arquitectura de navegación que se venía armando en las entradas anteriores. Detalle completo en ARCHITECTURE.md, "Contenido de Reservas, Perfil, Búsqueda y Filtros — definido".

**Contexto:** al cerrar la arquitectura de navegación de categorías (entrada anterior), Ana abrió la duda de si Reservas debía existir como tab de primer nivel o volver a Perfil como estaba en el Sitemap original. En paralelo pidió definir Filtros (con Fecha/Ubicación/Precio/Tipo como facetas que ella misma propuso) y el contenido real de Reservas y Perfil.

**Por qué Reservas se queda como tab propio:** en BENCHMARK.md, Airbnb (referente directo de arquitectura de descubrimiento/reserva) tiene "Trips" como tab de primer nivel, no enterrado en el perfil — precisamente porque revisar una reserva (hora, lugar, ticket) es una acción de alta frecuencia y con presión de tiempo, más aún para gente que viaja (ver PRODUCT.md, inclinación hacia gente viajera). Con Descubrir y Perfil ya resueltos como tabs, Reservas no compite por espacio.

**Contenido definido:**
- **Reservas:** Próximas / Pasadas.
- **Perfil:** Favoritos + Preferencias (con el selector de idioma pendiente en ROADMAP.md, y probablemente moneda — dado que el precio se muestra en USD — pero el alcance exacto de Preferencias no está confirmado del todo).
- **Búsqueda:** estado inicial con Sugerencias curadas (no autocomplete genérico, coherente con VOICE.md — "Thea selecciona, no decora") → búsqueda por palabra → Filtros como acción secundaria, no paso obligatorio.
- **Filtros:** Género (resuelve la hipótesis abierta en ROADMAP.md sobre filtros de género en Escena — confirmada como decisión estructural: filtro secundario, nunca navegación principal, mismo criterio que MUBI) + Fecha + Ubicación + Precio. El comportamiento exacto de Fecha/Ubicación/Precio todavía no está definido (rango vs. puntual, distancia vs. zona, slider vs. brackets).

**Consecuencia:** ARCHITECTURE.md y ROADMAP.md actualizados. Se arma un prompt separado para el agente externo de Figma, distinto del de navegación de categorías, para construir estas pantallas/patrones a nivel estructural (no visual final) — Reservas, Perfil, Búsqueda con Sugerencias, y Filtros con las 4 facetas, marcando como pendiente lo que todavía no tiene definición exacta (comportamiento de Fecha/Ubicación/Precio, alcance final de Preferencias, copy de Escena/Cultura nivel 2).

---

## Ejecutado y verificado: reorganización de "02.1 — Navigation" en dos secciones (chrome vs. distribución de contenido)

**Decisión:** el agente externo de Figma aplicó el prompt de navegación de categorías (de la entrada "Auditoría de 02.1 — Navigation...") y esta sesión lo verificó nodo por nodo — quedó bien construido. Pero al revisarlo con Ana, surgió una distinción más de fondo que llevó a una segunda reorganización, también ya ejecutada y verificada: separar navegación de chrome persistente de controles de distribución de contenido, que hasta ese momento estaban mezclados bajo el mismo nombre "Navigation".

**Contexto:** Ana notó dos cosas al revisar el resultado. Primero, que el ítem "4. Mobile Navigation Stack" era raro — resultó ser un FRAME de preview (no un componente) armado porque los componentes maestros de Mobile Top Bar y Category Tabs habían quedado sueltos fuera de la sección en vez de catalogados, verificado por posición absoluta (ambos por debajo del límite inferior de la sección). Segundo, y más importante: Category Tabs y Sub-category Tabs no son navegación de chrome — son controles de distribución/organización de contenido dentro de una pantalla (dejan entrar a "Más reservados", por ejemplo), y no van a estar pegados en una sola barra fija con el Mobile Top Bar como el frame de preview sugería. Cita de Ana: "no va a haber una barra en donde estén juntas."

**Ejecución (verificada por inspección directa, no por lo que reportó el agente):**
- **"02.1 — Navigation"** quedó solo con chrome de navegación real: 1. Desktop Navbar, 2. Mobile Top Bar (ahora catalogado adentro de la sección, ya no suelto), 3. Mobile Bottom Navigation. Descripción de la sección actualizada. "Mobile Navigation Stack" eliminado por completo.
- **Nueva sección "02.2 — Tabs (Category & Sub-category)"** creada, con su propia descripción explicando la distinción (controles de distribución de contenido, no chrome persistente): 1. Category Tabs (Active=Todo/Escena/Cultura), 2. Sub-category Tabs (Content=Todo/Escena/Cultura). Las especificaciones de interacción/teclado de ambos se movieron junto con los componentes, no se reescribieron.
- "Configuraciones de búsqueda contextual — Pendiente" se mantuvo sin cambios en 02.1 — Navigation, tal como se pidió.

**Por qué:** la distinción que hizo Ana es real y mejora el sistema — Navigation ahora describe correctamente qué es chrome persistente (igual en toda la experiencia) vs. qué es organización de contenido específica de cada pantalla, evitando que alguien asuma que Category/Sub-category Tabs están fusionados con el Top Bar en una sola barra fija.

**Consecuencia:** Card System y Navigation quedan como los dos sistemas de documentación más maduros del archivo — ambos con historial de auditoría, corrección y verificación directa en vez de confiar en lo reportado por el agente externo. Pendiente: revisión de "componentes completos" que Ana pidió a continuación (que cada pieza tenga sentido y funcione de forma aislada) — todavía no arrancada.

---

## Revisión de componentes completos, ronda 1: ícono Descubrir, búsqueda contextual, ciudad/moneda de ejemplo

**Decisión:** primera pasada de la revisión de "componentes completos" que Ana pidió. Se verificaron 4 cosas puntuales que ella señaló, con inspección directa de geometría en Figma en vez de asumir — dos quedaron descartadas como falsa alarma (con matemática exacta de por qué), dos quedaron definidas y documentadas.

**1. Ícono de Descubrir "no centrado" — verificado, NO es un bug.** Ana notó que dentro de su contenedor no se veía centrado, pero aclaró que si era a propósito, se dejaba así. Se midió la geometría exacta: el glyph interno de `icon/compass` (anillo + rombo) está centrado con un margen de error de 0.4px, imperceptible. Lo que sí es real es que el bloque ícono+label del tab "Descubrir" está 4px más arriba que el de "Reservas"/"Perfil" dentro del mismo contenedor de 56px — pero es intencional: el tab activo tiene un `active-indicator` (punto de 4px) debajo del label que los tabs inactivos no tienen, y el bloque completo (ícono + label + punto) está centrado como grupo con márgenes simétricos de 3px arriba y abajo. Confirmado con los números exactos. No se toca nada.

**2. "Configuraciones de búsqueda contextual" — definido.** Ver ARCHITECTURE.md, nueva sección ""Búsqueda contextual" — definido". Resumen: no es un modo de búsqueda aparte, es que el set de filtros disponibles cambia según el contexto de navegación — búsqueda global muestra Sugerencias curadas sin filtros; adentro de una subcategoría (ej. Danza dentro de Escena) los filtros ya son específicos de ese contexto (género de danza: contemporánea/folclórica/urbana), no un dropdown genérico. Ana lo explicó con referencia visual directa: capturas de Airbnb Experiences ("Experiencias en Cartagena", chips "Originals/Tipo/Hora del día" inline sobre los resultados). Esto cierra la hipótesis de ROADMAP.md sobre filtros de género — ya no es hipótesis, es la definición vigente del mecanismo (falta la taxonomía exacta por subcategoría, que depende de contenido real).

**3. Ciudad y moneda del contenido de ejemplo — definido.** Se encontraron 25 instancias de "Madrid" como ciudad de ejemplo en Cards y pantallas del Design System — inconsistente con lo ya documentado (CASE_STUDY.md usa Buenos Aires, Argentina, en la tarea real de testing de usabilidad). Ana preguntó directamente mi opinión sobre si cambiar a Bogotá. Recomendé Bogotá — coincide con su contexto actual (no está en Argentina) y con las referencias visuales que trajo (Cartagena, Colombia) — y ella lo confirmó. Ver STACK.md, nueva nota "Ciudad de ejemplo para contenido de mockups". Los nombres específicos de venues inventados se dejan igual por ahora, se corrigen cuando se trabaje la ficha de ubicación real. Moneda: precio base en USD siempre, con opción de pagar con tarjeta local y elegir moneda en Compra — mismo modelo que Airbnb al principio. Ver ARCHITECTURE.md, sección Compra, actualizada.

**Por qué:** Ana pidió explícitamente ir "uno a uno" en vez de resolver todo de golpe — este registro documenta esa primera ronda completa, con evidencia verificada para cada punto en vez de asunciones.

**Consecuencia:** queda pendiente construir en Figma lo que sí requiere cambios: el reemplazo Madrid → Bogotá en las 25 instancias encontradas, y la versión alternativa de fondo verde con transparencias (aprobada, ver entrada anterior) aplicada a las 5 piezas reusables de Navigation/Tabs. El ícono de Descubrir y la definición de búsqueda contextual no requieren cambios en Figma por ahora — el primero porque ya está bien, el segundo porque Búsqueda/Filtros todavía están a nivel estructural (ver entrada "Reservas como tab propio...").

---

## Ejecutado (Madrid→Bogotá y fondo verde) + ronda 2: geografía mezclada, patrón de chips, Reservation Card

**Decisión:** se verificó que el prompt de la ronda 1 se ejecutó parcialmente — Madrid→Bogotá quedó perfecto (0 instancias de Madrid, 25 de Bogotá confirmadas), pero el fondo verde no se había corrido; se re-pidió y esta vez sí se aplicó (5 componentes duplicados: `desktop-navbar — Fondo verde`, `mobile-top-bar — Fondo verde`, `Mobile Bottom Navigation — Fondo verde`, `Category Tabs — Fondo verde`, `Sub-category Tabs — Fondo verde`, todos verificados por inspección directa). Mientras se esperaba esa corrida, se revisaron las 4 pantallas estructurales construidas antes (05 — Búsqueda, 06 — Filtros, 07 — Reservas, 08 — Perfil) y salieron 3 hallazgos nuevos, ya resueltos en conversación con Ana.

**1. Geografía mezclada, más allá de "Madrid".** El sweep anterior solo buscó la palabra "Madrid" — pero 07 — Reservas tenía contenido que nunca decía Madrid y quedó inconsistente igual: "CABA" y "San Telmo" (Buenos Aires) en dos reservas de ejemplo, y "ARS $" como moneda en Preferencias. Ana confirmó estandarizar todo a Bogotá — pendiente de aplicar (ver STACK.md, nota de ciudad de ejemplo, ronda 2).

**2. Moneda de Detalle vs. Preferencias — distinción aclarada.** Surgió la duda de si Preferencias debía mostrar la moneda del país donde está el usuario o dólares. Resuelto: son dos cosas distintas. Detalle se queda siempre en USD, fijo — es la referencia universal para cualquier viajero. "Moneda" en Preferencias es la moneda de **pago preferida** en Compra — se detecta automáticamente según el país del usuario y queda editable, con USD siempre disponible como alternativa (cubre el caso de países donde USD es la única opción real, que Ana mencionó sobre Argentina). Ver ARCHITECTURE.md, sección Compra.

**3. Patrón de chips — scroll horizontal no es siempre lo correcto.** Se encontró que el row de chips de Género en Filtros (477px) desbordaba el ancho de pantalla de 390px, sin el mismo wrapper de scroll que ya tiene Sub-category Tabs. En vez de aplicar el mismo patrón por default, se distinguió el caso: Category/Sub-category Tabs son navegación (el usuario sabe a dónde va, scroll horizontal alcanza) — los chips de valores dentro de un filtro (Género) son selección (el usuario necesita ver todas las opciones antes de decidir) y usan wrap hacia abajo en cambio. Ver STACK.md, nueva regla "Patrón de chips".

**4. Reservas se formaliza como card del Card System, con desplegables.** Las cards de "Próximas"/"Pasadas" en 07 — Reservas están armadas a mano (mismo riesgo que tenía Booking Summary antes de formalizarla). Ana confirmó: se convierte en una card nueva con secciones desplegables tipo acordeón (mismo patrón que los bloques de Compra), y va a necesitar un ícono nuevo — `icon/map` (acción "ver en mapa"), distinto de `icon/map-pin` (que ya existe, es solo el glyph decorativo junto al texto). Ver ARCHITECTURE.md.

**Por qué:** la revisión de "componentes completos" que pidió Ana sigue encontrando el mismo tipo de problema real — piezas armadas a mano en vez de componentes, y patrones copiados por similitud visual en vez de por la interacción que realmente corresponde. Verificar en vez de asumir sigue rindiendo hallazgos concretos.

**Consecuencia:** se arma un prompt consolidado para Figma con los 4 puntos. Card System pasaría a tener un 7º tipo (Reservation Card) una vez construida — mismo tratamiento de formalización que ya se le dio a Booking Summary Card.

---

## Ronda 2: primer "listo" fue falso, segunda corrida sí se aplicó — verificado con evidencia

**Decisión:** el prompt consolidado de ronda 2 (los 4 puntos de la entrada anterior) se mandó a correr con el agente externo. Ana avisó "listo" una primera vez — se verificó por inspección directa y **ninguno de los 4 puntos se había aplicado** (geografía sin cambios, chips de Género seguían sin wrap, no existía componente "Reservation Card" ni "icon/map"). Se lo reporté a Ana tal cual, sin asumir éxito parcial, y le pedí confirmar qué había pasado antes de reintentar. Ana pidió "revisa ahora" para una segunda verificación — esa corrida sí se había aplicado, confirmado con datos exactos:

- **Geografía:** los 4 nodos de texto originales con contenido viejo (`1557:385`, `1557:419`, `1557:367`) ya no existen — fueron reemplazados por el nuevo componente Reservation Card. `1557:501` (moneda en Preferencias) pasó de "ARS $" a "COP $". Sweep completo por `CABA|San Telmo|ARS \$|Buenos Aires` en toda la página: 0 coincidencias reales (los 2 matches que salieron eran falso positivo del propio regex, la palabra "acaban" contiene la subcadena "caba"). Las 4 reservas de ejemplo ahora muestran "Bogotá" en su ubicación (Espacio Callejón, Teatro Sarmiento, Teatro San Martín, Cineteca Matadero — todas ", Bogotá").
- **Chips de Género:** el frame `genre-chips` pasó de 477×34px en HORIZONTAL sin wrap, a 350×76px con `layoutWrap: WRAP` — confirmado visualmente, ahora arma 2 filas dentro del contenedor de 390px sin desbordar.
- **Reservation Card:** existe como COMPONENT_SET real (`1594:349`) con variantes `Status=Próxima` / `Status=Pasada`, mismo patrón de nomenclatura que el resto del sistema. 07 — Reservas ya usa 4 instancias reales de este componente (no frames armados a mano), con ícono `icon/caret-down` como indicador de desplegable/acordeón — cumple lo que pidió Ana.
- **icon/map:** existe como componente real (20×20px, `1594:293`), usado dentro de las cards "Próxima" en la acción "Ver en mapa" — correctamente NO aparece en las cards "Pasada" (no tiene sentido navegar al mapa de un evento que ya ocurrió), que es una decisión de diseño acertada del agente, no un error.

**Hallazgo nuevo, no resuelto todavía:** el componente Reservation Card quedó **huérfano** en el canvas — no vive dentro de "04 — Card System" (`1419:186`) ni de ninguna sección, está parentado directamente a la página. Tampoco aparece mencionado en los textos de overview de esa sección ("Card Family" sigue listando solo Experience/Curated-Featured/Supporting/Artist-Space, más Piece Info Hero y Booking Summary Card documentadas aparte; "Variants" tampoco lo menciona). Es decir: el componente en sí está bien construido y funciona correctamente en 07 — Reservas, pero **no recibió el mismo tratamiento de documentación formal** que se le dio a Booking Summary Card cuando se formalizó (sin "Ficha completa", sin entrada en el overview de Card Family/Variants, sin ubicación dentro de la sección). Pendiente decidir con Ana si se arma ese prompt de formalización documental como siguiente paso.

**Por qué importa:** confirma otra vez que "listo" de parte del agente externo no es señal confiable — la verificación por inspección directa encontró tanto el falso "listo" inicial como, en la corrida que sí funcionó, un hueco que el reporte del agente no habría revelado (documentación faltante, aunque el componente funcione).

**Consecuencia:** Ronda 2 queda cerrada en su parte funcional (los 4 puntos están construidos y correctos). Queda abierto un ítem de seguimiento: formalizar Reservation Card dentro de 04 — Card System (ubicarlo en la sección, agregar su "Ficha completa", sumarlo a los textos de Card Family/Variants) — mismo patrón ya usado 6 veces antes.

---

## "Sub-category Tabs" era el componente equivocado — se borra, se reemplaza por patrón "Título + flecha" (2026-08-18)

Ana notó, viendo el mockup "categoría-theaveling-cards" (Curado por Theaveling / Más reservados / Descubrimientos), que el componente "Sub-category Tabs" (chips seleccionables con variantes Content=Todo/Escena/Cultura, en 02.2 — Tabs) no corresponde a cómo funciona el contenido real. Confirmado con referencia visual directa (captura de Airbnb: "Todo/Alojamientos/Experiencias" arriba SÍ son tabs reales que se tocan para filtrar; "Alojamientos populares en Santa Marta" debajo NO es un tab — es un título fijo con una flecha circular al lado para entrar a ver todo ese contenido, y varios títulos así aparecen apilados uno tras otro en la misma pantalla).

**Confirmación adicional:** se verificó que "Sub-category Tabs" (blanca y verde) tiene **0 instancias reales** en cualquier pantalla del archivo — nunca se llegó a usar, lo cual es consistente con que el patrón no correspondía a un caso de uso real.

**Decisión:** se borra el componente "Sub-category Tabs" (`1552:247`) y "Sub-category Tabs — Fondo verde" (`1582:386`), junto con toda su documentación asociada (specs de teclado, foco, ARIA, scroll horizontal — todo específico de ese patrón). Category Tabs (Todo/Escena/Cultura, `1552:214`/`1582:355`) no se toca — esos sí son tabs reales, la comparación con la referencia de Airbnb los confirma.

**Patrón nuevo:** "Título + botón de flecha circular" — mismo trato visual que "Favorito Boton" en las cards (círculo `#FBFBFB` al 14.9% de opacidad, `cornerRadius: 999`), con `icon/caret-right` adentro. No dice "ver todo", solo el título y la flecha. Se construyó el primer ejemplo real en "Curado por Theaveling" (dentro de "categoría-theaveling-cards desktop"). Pendiente: aplicar el mismo patrón a "Más reservados" y "Descubrimientos", y a lo que se defina para Escena/Cultura — Ana todavía no tiene los textos definidos para esas.

**Consecuencia:** el prompt anterior que corregía el texto de las chips de "Sub-category Tabs" (`prompt_fix_labels_subtabs_todo.md`, "Recomendado" → "Curado por Thea") queda obsoleto — no hace falta correrlo, el componente completo se borra.

---

## Aclaración importante: "categoría-theaveling-cards" es una composición de referencia, no una pantalla real (2026-08-18)

Ana corrigió un malentendido: los frames "categoría-theaveling-cards desktop" y "...mobile" (sueltos fuera del Design System) NO son pantallas reales de producto — son una composición de referencia para probar visualmente cómo se ven las cards contra el fondo Thea Green, nada más. Esto ya estaba documentado en 04 — Card System → "Comportamiento Responsivo": "Theaveling tiene cambios estructurales intencionales entre breakpoints, documentados en las composiciones de referencia (categoría-theaveling-cards desktop y categoría-theaveling-cards mobile)" — pero no se había tenido en cuenta al trabajar en esa sección. A tener en cuenta de ahora en adelante: cualquier trabajo en esos dos frames es para visualizar componentes, no para construir una interfaz real.

## Nueva card: "Editorial Card" (2026-08-18)

Falta un tipo de card para contenido editorial curado en formato angosto (rail) — distinto de "Curated / Featured Card" (que es horizontal, imagen al lado del contenido, para un solo ítem destacado). "Editorial Card": 280×360px, imagen a sangre con texto superpuesto, solo título y descripción — sin etiqueta de categoría ni precio (a diferencia de Experience/Supporting Card, que sí llevan esos campos). Se usa en rails de contenido curado, como "Curado por Theaveling" en mobile. Se registra como el 8vo tipo en la familia de tarjetas (Card Family, 04 — Card System), sumado a los 7 ya documentados: Experience, Curated/Featured, Supporting, Artist/Space, Piece Info Hero, Booking Summary, Reservation Card.

**Regla de composición confirmada por Ana:** en escritorio, "Curado por Theaveling" se queda en scroll vertical con las 3 cards grandes (estilo completo, texto superpuesto, botón de "ver todo" en la esquina de la primera card). En mobile, la misma sección pasa a scroll horizontal (rail) usando "Editorial Card" — angosta, mismo tratamiento de texto superpuesto, sin categoría ni precio. "Más reservados" y "Descubrimientos" no cambian — siguen usando "Tarjeta de Experiencia" (bloque de detalles debajo de la imagen, con categoría/metadatos/precio), ese estilo es exclusivo de esas dos secciones.

**Pendiente, no resuelto todavía:** quitar el borde (stroke) de las cards — Ana lo mencionó como tema abierto, todavía no se definió el alcance exacto (qué cards, qué borde específico).

---

## Limpieza de bordes + escala formal de transparencia en el Card System (2026-08-20)

**Decisión:** cierra el pendiente de la entrada anterior. Se auditaron las 8 cards del Card System buscando bordes y se catalogó cada valor de opacidad en uso, antes de tocar nada — con evidencia exacta, no a ojo.

**Hallazgo — bordes:** 4 de los 8 masters (Experience Card `1499:114`, Curated/Featured Card `1499:115`, Supporting Card `1499:116`, Artist/Space Card `1501:113`) tenían el mismo stroke puesto (1px, verde Thea, 12% opacidad) — contradice lo que 04 — Card System → Radius + Surfaces ya documentaba ("no usar bordes como mecanismo de separación de tarjetas"). Las otras 4 (Piece Info Hero, Booking Summary Card, Reservation Card, Editorial Card) ya estaban limpias. Se quitó el stroke de los 4 masters — al ser componentes, la limpieza se propagó a todas las instancias del archivo automáticamente. Se verificó por separado que no quedó ninguna instancia con override local del borde (sweep de todo el archivo por ese color/opacidad — los únicos matches restantes son líneas separadoras internas legítimas, ya documentadas como permitidas).

**Hallazgo — transparencias:** no existía una escala formal (a diferencia del spacing, que sí tiene una escala documentada: 4/8/12/16/24/32/48/64). Los valores de opacidad en uso eran mayormente consistentes por rol (100% texto primario, 80% chips sobre imagen en Piece Info Hero, 70% texto secundario, 15% botón de ícono sobre fondo verde), pero se encontraron 3 pares que claramente querían decir lo mismo con números ligeramente distintos por deriva manual: fechas/ubicaciones sueltas al 45% en unas cards y 50% en otras, contenedor de ícono pequeño al 30% en Artist/Space Card vs. 40% en Booking Summary/Reservation Card, y separadores internos al 6% en Booking Summary Card vs. 12% en Reservation Card. Se consolidó cada par en el valor mayor (50%, 40%, 12%).

**Ejecución:** los 6 nodos de texto/fill afectados por la consolidación de opacidad se corrigieron uno por uno (ver lista de nodos en `prompt_limpieza_bordes_y_transparencias.md`), y se agregó una nueva sección "Transparencia" en 04 — Card System (entre Radius + Surfaces y Typography), documentando los 7 niveles formales del sistema: 100% texto primario, 80% chips de acción sobre imagen, 70% texto secundario, 50% etiquetas, 40% contenedor de ícono pequeño, 15% botón de ícono sobre fondo verde, 12% separador interno. Todo verificado nodo por nodo tras la corrida — strokes en 0 en los 4 masters, la línea separadora interna de Curated/Featured Card intacta, los 6 valores de opacidad exactos, y el texto de la nueva sección completo y bien ubicado.

**Por qué:** mismo patrón que el resto del proyecto — las inconsistencias no eran decisiones de diseño distintas, eran el mismo criterio escrito a mano en momentos distintos y con pequeña deriva. Formalizar la escala de transparencia (igual que ya existe para spacing y radio) evita que seguir construyendo cards nuevas (Ver Todo, "+N", Reservation Card como bottom-sheet) introduzca más valores arbitrarios.

**Consecuencia:** Card System queda con sus 4 sistemas de valores completamente documentados y consistentes (spacing, radio, transparencia, estados). Pendiente sin resolver, no tocado en esta limpieza: el stroke de 1.2px al 100% de opacidad dentro de un ícono de Reservation Card (`I1594:318;1546:158`) — es parte del dibujo interno del ícono, no un borde de card, se dejó fuera de alcance a propósito.
