# Roadmap

> Lista de lo que está confirmado, lo que es hipótesis explícita, y lo que falta verificar o decidir.
> No incluye ideas especulativas fuera de lo que Ana ya planteó.
> Se actualiza cuando cambian las prioridades o se resuelven los gaps marcados aquí.

---

## Estado actual

Investigación y narrativa consolidadas. Se hizo un primer ajuste de paleta sobre el prototipo existente (ver DECISIONS.md), pero luego Ana decidió ir más allá: está construyendo un **Design System / UI Foundation completo desde cero** para Theaveling, a través de un agente de Figma fuera de esta sesión. El brief completo (color, tipografía, spacing, grid, componentes, cards, principio de diseño) está documentado en DECISIONS.md. **Esta sesión no está tocando Figma mientras tanto** — a la espera de que Ana revise/apruebe el resultado. Ver STACK.md.

---

## En construcción por fuera de esta sesión (no tocar hasta que Ana avise)

Design System / UI Foundation nuevo para Theaveling — página "THEAVELING — DESIGN SYSTEM" en Figma, con foundations, colores, tipografía, spacing/grid, componentes, cards, navegación, forms/inputs, states y ejemplos de UI. Ana pidió expresamente no diseñar todavía pantallas completas de la app. Brief completo en DECISIONS.md. Pendiente: revisar el resultado contra el brief cuando Ana lo pida, y recién ahí decidir próximos pasos.

---

## Confirmado (contenido ya decidido, listo para el case study)

- Historia de origen personal de Ana — redactada, ver CASE_STUDY.md.
- Benchmark ampliado con MUBI / Airbnb Experiences / Teatrix — enmarcado como referentes de posicionamiento, no competencia directa. Ver BENCHMARK.md.
- Modelo de negocio como hipótesis/proyección — direcciones listadas, explícitamente no validadas. Ver CASE_STUDY.md.
- Card Sorting v2 documentado (10 participantes, resultado ESCENA/CULTURA) — con la salvedad de no sobrepresentarlo como validación cuantitativa. Ver ARCHITECTURE.md.
- Sección "Validación & éxito" con distinción clara entre lo validado (entrevistas, card sorting, testing) y lo previsto (métricas de producto si existiera en producción).

---

## Pendiente de verificar en Figma antes de decidir (no asumir que existen)

### Estados de error del User Flow
Sin resultados, sin disponibilidad, error de pago existen como nodos de decisión en el diagrama de User Flow, pero **no como pantallas diseñadas**. Decidir: ¿se diseñan pantallas reales para el case/prototipo actualizado, o basta con representarlas conceptualmente en el diagrama de flujo?

### Pantalla de Perfil
El ícono de perfil existe en la navegación, pero no hay una pantalla de Perfil (Mis reservas / Favoritos / Preferencias) diseñada. Decidir si se necesita para el case study o si el gap se documenta y ya.

### Bloque "Artistas / espacio"
Aparece en el Sitemap dentro de EXPERIENCIA, pero no está confirmado como bloque visual independiente en el Detalle hi-fi — lo más cercano es un componente "Header" (Monogram + Texto) cerca de las reseñas, sin etiqueta clara. Si sigue integrado dentro de "Información", probablemente no se necesite una pantalla nueva — podría ser solo una decisión de contenido dentro del detalle existente.

---

## Hipótesis nuevas, sin validar (surgidas en conversación, no en investigación)

### Filtros de género dentro de las subcategorías de Escena (parcialmente resuelto, 2026-08-17)
**Actualización:** la parte estructural de esta hipótesis ya no es hipótesis — se confirmó como decisión al definir la arquitectura de Búsqueda/Filtros (ver ARCHITECTURE.md, "Contenido de Reservas, Perfil, Búsqueda y Filtros"). Género vive dentro de Filtros, como filtro avanzado/secundario, nunca como navegación principal — exactamente el criterio que ya proponía la referencia de MUBI documentada abajo. Lo que **sigue sin resolver** es la taxonomía exacta de género por subcategoría (ver el resto de esta sección, sin cambios) — eso todavía depende de tener contenido real para confirmar volumen y vocabulario.

Idea original de Ana: agregar un filtro de búsqueda por género dentro de Teatro (drama, comedia, musicales, etc.), y evaluar lo mismo para Danza, Performance y Música. **No se decidió que las 4 subcategorías necesiten filtro** — se trata sección por sección, según dos criterios: si el arte tiene un vocabulario de género legible y no forzado, y si va a haber volumen de contenido real como para que un filtro tenga sentido.

Lectura inicial (sin investigación, a revisar cuando haya contenido real):
- **Teatro** — candidato más fuerte; drama/comedia/musicales es un vocabulario ya conocido por los usuarios.
- **Performance** — el más dudoso; la disciplina históricamente resiste categorías cerradas de género. Si necesita filtro, probablemente no sea por género (podría ser por formato, duración o tipo de espacio).
- **Danza** y **Música** — vocabularios plausibles (contemporánea/clásica/folklórica/urbana; jazz/clásica/en vivo/experimental), pero sin forma de confirmar volumen todavía.

Precedente que informó esta hipótesis: MUBI usa género (Drama, Comedia, Musical, etc.) como **filtro avanzado/secundario**, nunca como navegación principal — lo primero que se ve es la curaduría editorial (En Cartelera, Colecciones, Listas). Si se implementa, debería seguir esa misma jerarquía: la curaduría (Recomendado para ti / Más reservados / Nuevos descubrimientos) como capa principal, género como refinamiento opcional después, nunca como punto de entrada.

Pendiente: revisar cuando haya contenido real en cada subcategoría de Escena, decidir cuáles necesitan filtro y con qué taxonomía exacta.

---

## Pendiente de sincronizar en el prototipo (no bloquea el case study, pero es una inconsistencia real)

- **Home:** los chips de categoría todavía muestran la taxonomía vieja (Todo/Escena/Cultura mezclado con Teatro/Baile/Música/Performance/Hobbies y arte) en vez de la jerarquía nueva (Escena → Teatro/Danza/Performance/Música). "Baile" debería decir "Danza". "Hobbies y arte" ya no existe en el Sitemap.
- **Navegación inferior:** todavía incluye un ícono de chat que contradice la decisión de sacar la conexión social del MVP.
- **Onboarding:** las categorías de interés (Drama, Comedia, Onírico, Marionetas, Callejero, Vanguardismo, entre otras) son más amplias que la taxonomía ESCENA/CULTURA actual — no confirmado si es intencional.

---

## Pendiente de definir — selector de idioma de interfaz

Surgió al definir la pantalla de Detalle (2026-08-17, ver ARCHITECTURE.md): dado que el precio se muestra en USD y el producto está inclinado hacia gente viajera (ver PRODUCT.md), Ana pidió agregar un paso de Onboarding donde se elija el idioma de la interfaz, y que también sea editable después en Perfil → Preferencias. No estaba en el sitemap original — es una ampliación real de alcance (soporte multi-idioma de la interfaz), no solo una pantalla más. No confundir con el idioma de la pieza (dato de la ficha de la obra, ver ARCHITECTURE.md) — son dos cosas distintas. Pendiente: definir qué idiomas soporta, si el copy ya escrito en VOICE.md se traduce o el español queda como base.

---

## Explícitamente fuera de alcance por ahora

- Diseñar o modificar cualquier pantalla en Figma — no se ha hecho todavía, por decisión de Ana ("primero entender, no diseñar").
- Escribir código de producto o del case study en el portfolio — no se ha decidido stack ni se ha tocado `ana-portfolio`.
- Presentar cualquier métrica de "Validación & éxito" como resultado de producción real.
