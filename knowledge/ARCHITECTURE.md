# Architecture — Información, Sitemap y User Flow

> Describe la arquitectura de información real de Theaveling tal como existe HOY en Figma (archivo "Prototipo final", `Bas9SSdMLitN1S37kjFeOy`), no la versión aspiracional.
> Este documento distingue entre lo que ya está construido/documentado y lo que solo existe como diagrama conceptual.

---

## Arquitectura de información (Sitemap — ya construido)

El Sitemap del archivo "Prototipo final" (nodo `1321:4012`) ya refleja la arquitectura nueva:

```
TODO
├─ Recomendado para ti
├─ Más reservados
└─ Nuevos descubrimientos

ESCENA
├─ Teatro
├─ Danza
├─ Performance
└─ Música

CULTURA
├─ Cine local
├─ Cineclub
├─ Lecturas dramáticas
├─ Charlas
├─ Talleres
└─ Festivales

BÚSQUEDA
├─ Buscar por palabra
└─ Filtros

EXPERIENCIA (página individual)
├─ Información
├─ Artistas / espacio
├─ Comunidad
└─ Reservar

PERFIL
├─ Mis reservas
├─ Favoritos
└─ Preferencias
```

Este resultado viene de un Card Sorting v2 con 10 participantes (tarjetas: Teatro, Danza, Performance, Música en vivo, Cine local, Cineclub, Lectura dramática, Charla artística, Taller, Festival) que agrupó los contenidos en dos clusters claros: **ESCENA** (Teatro, Danza, Performance, Música) y **CULTURA** (Cine/Cine local/Cineclub, Lectura dramática, Charla, Taller, Festival). Tratarlo como evidencia exploratoria, no como validación cuantitativa definitiva.

---

## User Flow (ya construido, más completo que el research original)

Nodo `1335:4010` ("User Flow — Descubrir y reservar una experiencia") en el mismo archivo. Existe además un segundo diagrama de flujo (`1336:4301`, "user-flow-theaveling") no revisado en detalle todavía — posible versión alternativa o más reciente, pendiente de comparar.

**Puntos de entrada a Resultados (todos convergen en el mismo lugar):**
Todo/curaduría · Escena · Cultura · Búsqueda → Resultados → Detalle de experiencia

**Flujo feliz completo:**
Inicio → Onboarding → Selección de preferencias → (Todo/Escena/Cultura/Búsqueda) → Resultados → Detalle de experiencia → ¿Quiere reservar? → Datos de reserva → ¿Hay disponibilidad? → Pago → ¿Pago exitoso? → Confirmación de reserva → Fin

**Estados alternativos ya modelados en el diagrama:**
- Sin resultados → Modificar búsqueda → Volver
- Sin disponibilidad → Seleccionar otra experiencia
- Error de pago → Reintentar pago

Estos tres estados **existen como nodos de decisión en el diagrama de flujo**, con su lógica de "Sí/No" bien definida. Ver el punto siguiente sobre si tienen pantalla real diseñada.

---

## Lo que SÍ está construido como pantalla real (verificado)

Confirmado por inspección directa del árbol de nodos del archivo (no solo por nombre de frame):

- **Home** — existe, pero con chips de categoría desactualizados (ver "Inconsistencias" abajo).
- **Detalle de experiencia** (frame "Overlay-ventana", `933:4971`) — sí tiene bloques reales y diferenciados:
  - Título + foto hero con favorito
  - **"Información sobre la obra"** (texto descriptivo) → corresponde a "Información" del sitemap
  - **"Reseñas"** con rating de estrellas → corresponde a "Comunidad" del sitemap
  - Hay un componente "Header" con Monogram (avatar) + Texto cerca de las reseñas — no está claro si es info del autor de una reseña o si se reutilizaría para "Artistas / espacio"
- **Reserva** (fechas/asientos/hora), **Pago**, **Pago exitoso**, **Tickets** — confirmados en el flujo feliz.

## Lo que NO está construido como pantalla real (solo existe como texto en el Sitemap o en el diagrama de User Flow)

Verificado buscando cada término en el árbol completo de nodos del archivo — en los tres casos, **todas las coincidencias están dentro de las cajas del Sitemap o del/los diagrama(s) de User Flow**, con dimensiones de diagrama (decenas a ~150px), nunca con dimensiones de pantalla móvil real (360×800):

- **Perfil** (`Mis reservas / Favoritos / Preferencias`) — no existe una pantalla de perfil diseñada. Solo existe: el ícono de perfil en la nav inferior (`Molecula/navbar/perfil`) y la caja "PERFIL" en el Sitemap/User Flow.
- **Sin resultados / Sin disponibilidad / Error de pago / Reintentar pago** — no existen pantallas para estos estados. Solo existen como nodos de decisión dentro del/los diagrama(s) de User Flow.
- **"Artistas / espacio"** como bloque visual explícito y diferenciado — no confirmado. En el Detalle real hi-fi, lo más cercano es el componente "Header" (Monogram + Texto) cerca de "Reseñas", pero no está etiquetado como tal y podría ser simplemente el encabezado de una reseña individual, no una sección dedicada a artistas/espacio.

**No asumir que estas pantallas existen.** Están marcadas como gap — ver ROADMAP.md para decidir si se diseñan para el case/prototipo actualizado o si el diagrama de flujo es suficiente para el case study.

---

## Inconsistencia detectada: Home todavía no está actualizada

La pantalla Home hi-fi capturada muestra una fila plana de chips: `Todo, Escena, Cultura, Teatro, Baile, Música, Hobbies y arte, Performance`.

Problemas respecto al Sitemap actual:
- Mezcla los 3 niveles jerárquicos (Todo/Escena/Cultura) con subcategorías sueltas (Teatro, Baile, Música, Performance) en la misma fila, en vez de anidar Teatro/Danza/Performance/Música bajo Escena.
- Usa **"Baile"**, el Sitemap nuevo usa **"Danza"**.
- Incluye **"Hobbies y arte"**, categoría que no existe en el Sitemap nuevo.

Conclusión: **la arquitectura de información ya se actualizó (Sitemap + User Flow), pero la pantalla Home del prototipo hi-fi todavía no se sincronizó con ese cambio.**

---

## Inconsistencia detectada: navegación inferior todavía tiene chat (resuelto, 2026-08-17)

**Nota de estado:** la pantalla "Home" hi-fi original ya no existe en el archivo — Ana reconstruyó todo el archivo como Design System puro durante esta colaboración (ver DECISIONS.md, "Rediseño visual completo"), y las pantallas hi-fi viejas (Home, Sitemap, User Flow, Detalle overlay) fueron eliminadas del canvas en el proceso. Los nodos referenciados abajo (`1321:4012`, `1335:4010`/`1336:4301`, `933:4971`) ya no existen — verificado por inspección directa el 2026-08-17. Este hallazgo queda como registro histórico.

La barra de navegación inferior de la Home vieja tenía 5 íconos: chat, tickets, favoritos (heart), home, perfil.

El ícono de chat contradecía la decisión de sacar la comunidad/conexión social de la navegación principal (ver DECISIONS.md). **Resuelto de hecho:** el componente real "Mobile Bottom Navigation" que existe hoy en 02.1 — Navigation (`1419:118`) ya tiene solo 3 tabs — Descubrir / Reservas / Perfil — sin ícono de chat. No se sabe si fue una corrección intencional de Ana o un efecto colateral de reconstruir desde cero, pero el resultado ya es consistente con la decisión.

---

## Navegación mobile — arquitectura definida (2026-08-17)

Definido en conjunto con Ana a partir de dos preguntas suyas: por qué el navbar de desktop no tenía versión mobile, y a qué pertenecía "Tab Navigation" (390px Horizontal Scrollable). Verificado por inspección directa que ninguno de los dos existía en el Design System: no había ningún componente mobile para elegir entre Todo/Escena/Cultura, y "Tab Navigation" (con las 3 pestañas de Todo — Recomendado/Más reservados/Nuevos descubrimientos) quedaba sin ancla, porque el nivel que debería contenerlo no estaba construido.

**Insight clave:** el Bottom Nav mobile (Descubrir/Reservas/Perfil) y el navbar de desktop (Todo/Escena/Cultura + búsqueda + cuenta) no son la misma navegación en dos tamaños — resuelven preguntas distintas. El navbar desktop responde "¿qué tipo de contenido querés ver?" (eje de contenido). El Bottom Nav mobile responde "¿en qué área funcional de la app estás?" (eje funcional: contenido / tus reservas / tu cuenta). La elección de tipo de contenido (Todo/Escena/Cultura) tiene que vivir **adentro** de la pantalla "Descubrir" en mobile, no como un tab más del Bottom Nav.

**Anatomía definida para la pantalla Descubrir en mobile (de arriba hacia abajo):**

1. **Mobile Top Bar** — liviana, no es el navbar completo de desktop: wordmark/logo a la izquierda (toca y vuelve a Descubrir) + ícono de búsqueda a la derecha (toca y abre el destino BÚSQUEDA del Sitemap, que tiene su propia sección con filtros — búsqueda es un destino de primer nivel, no un accesorio de navbar). No incluye cuenta — eso ya lo resuelve Perfil en el Bottom Nav, no hace falta duplicarlo arriba. **(2026-08-31: se suma un 3er elemento, el control de ciudad — ver "Selección de ciudad/ubicación", más abajo.)**
2. **Category Tabs (nivel 1)** — chip row horizontal scrollable, mismo patrón visual ya construido para Tab Navigation (390px). Contenido: Todo / Escena / Cultura — mismos nombres y orden que el navbar de desktop, esos ya son finales.
3. **Sub-category Tabs (nivel 2, contextual)** — el componente que hoy se llama "Tab Navigation" deja de ser exclusivo de Todo y pasa a ser un componente genérico de segundo nivel, que cambia de contenido según qué chip del nivel 1 esté activo:
   - Todo → Recomendado / Más reservados / Nuevos descubrimientos (copy final, sin cambios).
   - Escena → Teatro / Danza / Performance / Música (**copy placeholder** — Ana fue explícita: van a llevar frases más atractivas, no los nombres genéricos de disciplina. Sirve para definir la estructura, no el copy final).
   - Cultura → Cine local / Cineclub / Lecturas dramáticas / Charlas / Talleres / Festivales (**copy placeholder**, misma razón — 6 ítems, por eso importa que el componente ya soporte scroll horizontal).
4. **Grid/lista de contenido** — sin cambios respecto a lo ya documentado.

Esta anatomía mobile es estructuralmente equivalente al navbar de desktop (logo + Todo/Escena/Cultura + búsqueda + cuenta), solo partida en dos filas por el ancho angosto y sin duplicar cuenta.

**Pendiente, no resuelto todavía:** copy final de los ítems de nivel 2 dentro de Escena y Cultura (Ana los va a definir con frases más atractivas). Contenido de "Configuraciones de búsqueda contextual" (mencionado en la documentación de 02.1 — Navigation pero nunca definido — ver DECISIONS.md).

---

## Contenido de Reservas, Perfil, Búsqueda y Filtros — definido (2026-08-17)

Definido en conjunto con Ana, continuando la arquitectura de la sección anterior. Resuelve una duda real que Ana planteó: si "Reservas" (tab del Bottom Nav) debía existir como tab propio o volver a vivir como "Mis reservas" dentro de Perfil, tal como estaba en el Sitemap original (PERFIL → Mis reservas / Favoritos / Preferencias).

**Reservas se queda como tab propio del Bottom Nav — no vuelve a Perfil.** Razón: en BENCHMARK.md, Airbnb (referente directo de arquitectura de descubrimiento/reserva) tiene "Trips" como tab de primer nivel, no enterrado en el perfil, precisamente porque revisar una reserva (hora, lugar, ticket) es una acción de alta frecuencia y con presión de tiempo — más aún para gente que viaja (ver PRODUCT.md, inclinación hacia gente viajera). Con Descubrir y Perfil ya resueltos como tabs, Reservas no compite por espacio ni satura el Bottom Nav.

**Contenido de Reservas:** Próximas / Pasadas. Próximas con fecha/hora y acceso al ticket/detalle. Pasadas como historial, con opción de volver a reservar o dejar reseña (conecta con Comunidad, ver "Detalle de experiencia" arriba). No se define un tercer estado (ej. canceladas) todavía — sin un caso de uso real que lo justifique.

**Contenido de Perfil** (una vez que Reservas se independiza, Perfil pierde "Mis reservas" del Sitemap original): Favoritos (lista de experiencias guardadas, alimentada por el ícono de favorito que ya vive en Piece Info Hero) + Preferencias. Preferencias incluye el selector de idioma de interfaz ya pendiente en ROADMAP.md (definido en Onboarding, editable acá) y moneda — el alcance de Moneda ya quedó confirmado (ver más abajo, "Distinción Detalle vs. Preferencias", 2026-08-18). Lo que todavía no está confirmado es el alcance exacto de Notificaciones y Datos de cuenta.

**Búsqueda** (destino del Sitemap, se llega desde el ícono del Mobile Top Bar):
1. Estado inicial, antes de escribir: **Sugerencias curadas**, no autocomplete genérico — coherente con VOICE.md ("Thea selecciona, no decora"). Ej.: "Teatro experimental esta semana", sugerencias por proximidad (mismo criterio de cómo comunicar proximidad que ya está en VOICE.md).
2. Búsqueda por palabra (ya estaba en el Sitemap).
3. Filtros, como acción secundaria, no paso obligatorio.

**Filtros — resuelve una hipótesis que estaba abierta en ROADMAP.md** ("Filtros de género dentro de las subcategorías de Escena"). Se confirma como decisión, no solo hipótesis: Género vive dentro de Filtros, como filtro avanzado/secundario, nunca como navegación principal — mismo criterio que ya proponía ahí la referencia de MUBI. El resto de facetas de Filtros (Fecha, Ubicación, Precio) todavía no tienen comportamiento exacto definido: ¿Fecha es día puntual o rango? ¿Ubicación es distancia desde el usuario o zona/barrio elegible? ¿Precio es rango con slider o brackets (gratis/bajo/medio/alto)? Pendiente de definir con Ana antes de construir el detalle visual de Filtros.

**Pendiente:** comportamiento exacto de cada faceta de Filtros excepto Género (que ya tiene precedente claro vía la hipótesis de ROADMAP.md). Alcance de Notificaciones y Datos de cuenta en Preferencias (Moneda ya no está pendiente — ver arriba). Copy final de Escena/Cultura nivel 2 (ya documentado en la sección anterior). Taxonomía exacta de Género por subcategoría de Escena (Teatro/Danza/Performance/Música) — ver ROADMAP.md, sigue sin contenido real para confirmar volumen.

---

## "Búsqueda contextual" — definido (2026-08-18)

Resuelve el bloque que había quedado marcado como pendiente en 02.1 — Navigation ("Configuraciones de búsqueda contextual — Sin definición de producto"). Definido con Ana, con referencia visual directa (capturas de Airbnb Experiences, filtro de "Experiencias en Cartagena" con chips "Originals / Tipo / Hora del día" inline sobre los resultados).

**Cómo funciona:** "contextual" no es un modo de búsqueda distinto — es que los filtros disponibles cambian según desde dónde entraste, no un único set fijo de Filtros global.

- **Búsqueda global** (desde el ícono del Mobile Top Bar, ver "Navegación mobile — arquitectura definida"): siempre muestra las Sugerencias curadas de Thea primero — sin filtros contextuales todavía, porque no hay un contexto de categoría activo.
- **Dentro de una categoría o subcategoría** (ej. entraste a Escena → Danza): los filtros que aparecen ahí son específicos de ese contexto, no el set genérico de Fecha/Ubicación/Precio/Género. Ejemplo dado por Ana: adentro de Danza, los filtros son de género de danza — contemporánea, folclórica, urbana, etc. — no un dropdown genérico de "Género" con todas las disciplinas mezcladas.

Esto confirma y cierra la hipótesis que estaba abierta en ROADMAP.md ("Filtros de género dentro de las subcategorías de Escena"): el mecanismo ya no es hipótesis, es la definición vigente. Sigue pendiente la taxonomía exacta por subcategoría (qué géneros lista Teatro vs. Danza vs. Performance vs. Música) — eso todavía depende de contenido real.

---

## Detalle de experiencia y Compra — arquitectura definida (2026-08-17, pendiente de armar como pantallas completas)

Definido en conjunto con Ana a partir de la sección EXPERIENCIA del sitemap (Información / Artistas-espacio / Comunidad / Reservar). Se separó en dos pantallas distintas:

**Detalle de experiencia** (scroll simple, no es un flujo de pasos):
1. **Piece Info Hero** — imagen/video a sangre (desde arriba de la pantalla hasta un poco más arriba de la mitad), con back arriba-izquierda y share + favorito encrustados juntos arriba-derecha. Debajo: título, precio (en USD) y descripción corta, alineados a la izquierda. **Ya existe como componente real en Figma** — ver DECISIONS.md.
2. **Por qué descubrir esto** — la valoración/criterio editorial de Thea sobre esta pieza puntual (no la descripción general del punto 1, es el argumento curatorial).
3. **Ficha de la pieza** — información específica: cuántas veces se presentó, en qué festivales/eventos participó, premios, si es remake/en qué se inspiró, idioma de la pieza (relevante por la inclinación hacia gente viajera — ver PRODUCT.md).
4. **Artista / compañía** — quién la produce. Reusa el Artist/Space Card ya existente en el Card System.
5. **Comunidad** — reseñas de quienes ya asistieron. Capa secundaria, va después de la info y el artista, no antes (ver VOICE.md, "Thea descubre, la comunidad respalda").
6. **Contenido similar** — cierre con riel de otras experiencias curadas, reusando el patrón Featured + Rail, para no cortar el flujo de descubrimiento.

CTA fijo abajo, siempre activo — lleva a la pantalla de Compra. Texto
**"Ver opciones"** (cambiado 2026-09-03, era "Reservar"): tocarlo no
reserva nada todavía, solo abre Compra donde se elige fecha/hora/asiento
— "Reservar" prometía más de lo que el botón hace en el momento de
tocarlo. "Ver opciones" cubre las 3 cosas que se eligen ahí, no solo
fecha (se evaluó "Ver fechas"/"Ver disponibilidad" y se descartaron por
eso). Ver DetalleExperiencia.tsx.

**Compra** (pantalla aparte, es donde se completa la reserva):
- **Campos obligatorios, siempre visibles, nunca plegados:** fecha, hora, asientos (mapa de asientos solo en experiencias con butaca asignada — las que no la tienen usan el selector de cantidad que ya existe en el patrón de Reserva de 03 — Patterns).
- **Bloques de información adicional, plegables/expandibles al tocarlos** (tarjetas delgadas tipo acordeón, para organizar la info y que no sea todo un solo scroll continuo): duración, bloque del lugar, restricción de edad (si aplica), mapa de ubicación. **Regla de contenido importante:** estos bloques no son solo datos — tienen que tener contenido curioso/narrativo real. Ejemplo dado por Ana: el bloque del lugar no es solo la dirección — es "una antigua fábrica abandonada que antiguamente producía arroz", conectado con la pieza cuando aplica ("la obra trata precisamente de esto"); el mapa no es solo un pin — incluye contexto del barrio ("el lugar queda aquí, entre tal y tal, un barrio residencial que históricamente fue tal cosa"). Ver VOICE.md.
- CTA final de compra queda **bloqueado hasta que fecha + hora + asiento estén completos**.
- **Moneda y pago (refinado 2026-08-18, y precisado el mismo día):** precio base siempre en USD (Detalle y Compra) — es la referencia universal, fija, no depende de dónde esté el usuario. En las opciones de pago de Compra, el usuario puede elegir pagar con tarjeta local si tiene una, y seleccionar en qué moneda pagar — mismo modelo que usaba Airbnb al principio. Nota de Ana, no implementada como regla todavía: en contextos de inestabilidad económica (mencionó Argentina como ejemplo reciente), puede que el pago solo esté disponible en USD por restricciones reales del país — queda como consideración a futuro, no como lógica a diseñar ahora.
- **Distinción Detalle vs. Preferencias (precisado 2026-08-18):** el campo "Moneda" en Perfil → Preferencias no es lo mismo que el precio fijo en USD de Detalle — es la **moneda de pago preferida**, la que se usa al confirmar en Compra. Se detecta automáticamente según el país donde está el usuario (ej. COP si está en Colombia) y queda editable, con USD siempre disponible como opción manual — cubre el caso de países donde USD es la única opción real de pago.

**Reservas — formalización pendiente de construir (definido 2026-08-18):** las cards de "Próximas"/"Pasadas" en 07 — Reservas se van a formalizar como una card nueva del Card System con secciones desplegables (mismo patrón de acordeón que los bloques de Compra), en vez de quedar como frames armados a mano. Necesita un ícono nuevo, `icon/map` (acción de "ver en mapa"), distinto de `icon/map-pin` (que ya existe y es solo el glyph decorativo usado junto al texto de ubicación) — mismo criterio de creación que se usó para `icon/share` y `icon/compass`.

**Pendiente, no resuelto todavía:** selector de idioma de interfaz en Onboarding + editable en Perfil (nuevo, no estaba en el sitemap original — ver ROADMAP.md).



Las pantallas de Onboarding (selección de intereses) muestran: Drama, Comedia, Onírico, Performance, Musicales, Danza, Marionetas, Callejero, Vanguardismo — 9 categorías, varias de las cuales (Comedia, Onírico, Marionetas, Callejero, Vanguardismo) no aparecen en la taxonomía ESCENA/CULTURA del Sitemap nuevo.

No está confirmado si esto es intencional (personalización más amplia y granular que la navegación) o si quedó desactualizado respecto al Card Sorting v2. Pendiente de decisión — ver ROADMAP.md.

---

## "Búsqueda contextual" — revertido, solo búsqueda general (2026-08-18)

Ana decidió que el concepto de "búsqueda contextual" definido arriba (filtros que cambian según la categoría/subcategoría desde donde se entra) no hace falta — queda descartado. La búsqueda funciona siempre igual: Sugerencias curadas de Thea primero, sin ningún modo "contextual" ni filtros que varíen por categoría.

También se confirma que el filtro de **Género** (dentro de "Filtros — resuelve una hipótesis...", más arriba) no hace falta — Ana lo calificó como innecesario para Thea. Se elimina de "06 — Filtros" (queda con 3 facetas: Fecha, Ubicación, Precio, en vez de 4). Esto revierte también la hipótesis que se había cerrado en ROADMAP.md ("Filtros de género dentro de las subcategorías de Escena") — ya no aplica, no hace falta seguir su taxonomía por subcategoría.

**Consecuencia:** el texto en 02.1 — Navigation se simplifica a "Búsqueda — definido" (sin "contextual"). "06 — Filtros" se queda con Fecha, Ubicación y Precio únicamente.

---

## Selección de ciudad/ubicación — nueva funcionalidad, definida (2026-08-31)

Ana pidió resolver cómo el usuario elige/confirma dónde está, con dos referencias visuales concretas (Rappi: dirección + "Casa" con flecha; una app de eventos tipo Fever: "Lugar: Bogotá ⌄" bajo la barra de búsqueda) y un requisito claro: "antes debe pedir la ubicación aproximada para empezar a recomendar y pueda encontrar algo en la home el usuario apenas entra."

**Investigué primero cómo lo hace Rappi**, para no inventar el patrón de cero: Rappi opera solo en países/ciudades específicos (9 países, 300+ ciudades, cobertura despareja incluso dentro de países servidos) — GPS es la señal por defecto (recolecta ubicación precisa activamente), con una pantalla/flujo separado y nombrado para cambiar la dirección manualmente cuando el GPS falla o el usuario quiere otra dirección.

**Por qué NO se copia el patrón de Rappi tal cual:** Rappi necesita precisión de **dirección de entrega** (puerta específica) porque reparte objetos físicos. Theaveling no reparte nada — solo necesita saber en qué **ciudad** está el usuario para curar contenido relevante (mismo nivel de precisión que ya usa Moneda en Preferencias, detectada por país). Pedir ubicación exacta sería más fricción/permiso de la que el caso de uso justifica, y no encaja con el tono "artístico pero no editorial/no-invasivo" del producto (ver DECISIONS.md, dirección de marca). Por eso el control final se parece más a la referencia tipo "Lugar: Bogotá ⌄" (nivel ciudad) que a la de Rappi (nivel dirección con ícono de casa).

**Flujo definido:**

1. **Onboarding, paso nuevo (a construir — hoy no existe ningún flujo de Onboarding real en el archivo, solo se documentaba conceptualmente):** al entrar por primera vez, se pide permiso de **ubicación aproximada** (no precisa/GPS exacto — mismo criterio de "solo lo necesario", coherente con no pedir dirección de calle). Si se concede, la ciudad se detecta sola y Home ya muestra contenido curado de esa ciudad apenas se entra — cumple el requisito de Ana de "poder encontrar algo apenas entra".
2. **Si se niega o no está disponible:** el mismo paso de Onboarding cae a un selector manual de ciudad (lista con buscador simple), para no dejar a Home sin poder recomendar nada. Mismo problema que resuelve Rappi con su flujo de dirección manual, pero a nivel ciudad, no calle.
3. **Control persistente en Home, para cambiar de ciudad cuando se quiera:** un control tipo "📍 [Ciudad] ⌄" (reusa `icon/map-pin`, ya existe, y `icon/caret-down`, ya existe — no hace falta ningún ícono nuevo) que vive en el Mobile Top Bar (a construir) y en el desktop-navbar (a construir), no debajo de la barra de búsqueda como en la referencia de Fever, porque Theaveling en mobile no tiene una barra de búsqueda inline en el Top Bar — tiene un ícono que lleva a Búsqueda como destino aparte (ver arriba). Se verificó en Figma que ambos top bars (mobile y desktop, claro y verde) tienen de sobra espacio libre en el layout `justify-between` actual para sumar este 3er/4to elemento sin romper la estructura de 2/3 elementos ya documentada.
4. **Tocar el control reabre el mismo selector de ciudad** del paso 1 — mismo componente, dos entradas (permiso inicial y cambio manual posterior).

**Alcance multi-ciudad (decidido con Ana):** el selector no es solo un gesto visual — Ana pidió contenido curado real para más de una ciudad, no un estado vacío. Ciudades elegidas para el prototipo: **Bogotá** (ya existente, base actual de todo el sistema) + **Madrid** y **Buenos Aires** — elegidas porque ya habían sido ciudades de ejemplo reales en versiones anteriores del archivo antes del barrido de consistencia geográfica (ver DECISIONS.md, "Madrid→Bogotá" y "CABA"/"San Telmo"), así que reintroducirlas como ciudades reales (en vez de contenido inventado desde cero) es consistente con el historial del proyecto. **Pendiente de confirmación de Ana** — si prefiere otras 2 ciudades, se cambian antes de construir el contenido curado.

**Pendiente, no resuelto todavía:** contenido curado real de Home para Madrid y Buenos Aires (experiencias, artistas, lugares — mismo nivel de detalle narrativo que ya exige VOICE.md, no genérico). El resto del Onboarding (selección de intereses, idioma) sigue sin construirse en Figma — este paso de ubicación es el primero que se construye ahí, no se resuelve el resto del flujo en este mismo prompt.

---

## Selección de ciudad/ubicación — revertido el paso de Onboarding que bloqueaba (2026-08-31)

**Se retracta el punto 1 y 2 de la sección anterior** ("Onboarding, paso nuevo" / "Si se niega o no está disponible"). Ana compartió una captura real de Airbnb (flujo "Experiencias" → buscar destino) que mostró algo importante: Airbnb **nunca** pide permiso de ubicación al entrar. El permiso solo se dispara si el usuario elige a propósito la opción "Por la zona" — una fila más dentro de la lista de sugerencias de destino (al lado de destinos con nombre propio, ej. "Santa Marta", "Bogotá"), nunca antes.

**Por qué se corrige:** el paso de Onboarding bloqueante que se había diseñado (pedir permiso antes de mostrar Home) en realidad contradecía el propio requisito de Ana ("que el usuario encuentre algo en la home apenas entra") — un cartel de permiso del sistema operativo frena al usuario ahí parado hasta que responde, que es peor para ese objetivo, no mejor.

**Flujo corregido:**

1. **No hay pantalla de Onboarding que bloquee.** Home carga directo con Bogotá (la base estable de todo el sistema) — cero fricción, contenido real desde el primer segundo.
2. **"Cerca de mí" es la primera fila del selector de ciudad** (mismo lugar/criterio que "Por la zona" en la referencia de Airbnb), arriba de Bogotá/Madrid/Buenos Aires en "City Picker Row". El permiso de ubicación del sistema operativo solo se pide si el usuario la toca a propósito — nunca antes, nunca de forma bloqueante.
3. El control persistente "📍 [Ciudad] ⌄" en los headers (ver sección anterior) se queda igual — sigue siendo la forma de reabrir el selector y cambiar de ciudad cuando se quiera.

**Consecuencia constructiva:** las 2 pantallas que se habían construido en "06.1 — Onboarding" (`prompt_onboarding_ubicacion.md`, ya corrido) se borran — no encajan con el flujo corregido. La sección "06.1 — Onboarding" queda vacía y también se borra; el resto del Onboarding conceptual (selección de intereses, idioma) sigue sin construirse, sin cambios respecto a lo ya documentado.

---

## Selección de ciudad/ubicación — versión final: vive en Búsqueda, header queda solo informativo (2026-08-31)

**Se retracta el control tipo píldora del header** (secciones anteriores del 2026-08-31) y "Cerca de mí". Versión final, decidida con Ana tras revisar cómo Airbnb hace la detección real (IP, sin permiso — ver DECISIONS.md):

1. **Detección de ciudad: automática por IP, sin ningún permiso ni pantalla de por medio.** Home siempre carga con contenido real desde el primer segundo (hoy, Bogotá).
2. **El control funcional de ciudad vive en Búsqueda, no en el header.** Nueva fila "Ubicación" (mismo estilo que la fila ya real "Por fecha", con ícono `icon/map-pin`), ubicada arriba de "Por fecha" — las 2 agrupadas en una card con fondo traslúcido y borde (no blanco sólido), mismo criterio que ya usa el Input. Al tocar "Ubicación" se abre el mismo City Picker ya construido (Bogotá/Madrid/Buenos Aires).
3. **El header solo muestra un indicador liviano, sin acción**, "Location Indicator": ícono de pin + texto subrayado con la ciudad actual, sin fondo ni borde — en mobile debajo de Category Tabs (a la derecha), en desktop al lado del wordmark "Theaveling". Es contexto visual, no un control — cambiar de ciudad se hace desde Búsqueda.
4. **Búsqueda se reorganiza en 2 cards separadas**, ambas con el mismo tratamiento traslúcido+borde: arriba "Ubicación + Por fecha" (filtros estructurados), abajo un solo bloque de sugerencias con miniatura (5 ítems) — en mobile se llama "Tendencias", en desktop "Sugerencias" (se eliminó la duplicación de tener las 2 secciones en la misma pantalla).

Prompt: `prompt_ubicacion_a_busqueda_y_header_liviano.md`. Reemplaza y deja obsoletos a `prompt_selector_ciudad_control_y_picker.md` (parcialmente — el City Picker en sí se sigue usando, pero el pill del header no), `prompt_arreglar_location_selector.md` (ya no aplica, el pill se borra entero) y `prompt_revertir_onboarding_y_cerca_de_mi.md` (ya no aplica, "Cerca de mí" no se agrega).
