# Theaveling — Case Study (contenido crudo)

> Este documento junta todo el material investigado y narrativo para construir el case study.
> No es el case study redactado — es la materia prima organizada.

---

## El problema

Las experiencias artísticas más especiales, locales y alternativas son difíciles de descubrir porque requieren conocer la escena, saber dónde mirar y, muchas veces, conocer personas que ya están dentro de ese ecosistema. No es un problema de que las experiencias no existan — es un problema de acceso al conocimiento necesario para encontrarlas.

**Hipótesis original (research v1):** la dificultad de un turista, o incluso nativo, de encontrar un catálogo que brinde ofertas de experiencias artísticas alternativas, específicamente teatrales, cuya organización esté detallada y contenga la información de los diferentes programas que normalmente no llegan a los demandantes por no conocer los diferentes destinos a los que van.

---

## Historia de origen (personal, de Ana)

Theaveling nació de una experiencia personal. Desde que Ana llegó al país ya tenía la percepción de que las propuestas culturales que encontraba en lugares turísticos y plataformas eran buenas, pero bastante visibles, tradicionales y predecibles. En un espacio comercial pero también artístico vio una obra que le gustó, pero sintió que quería encontrar algo más.

Después, a través de un amigo que ya vivía en el país, conoció un grupo de teatro que realizó una obra inmersiva en una calle poco turística, dentro de un edificio antiguo. La experiencia la sorprendió muchísimo y ahí entendió la diferencia entre la oferta cultural visible y esa otra escena que existe pero que requiere conocer, explorar y saber dónde mirar.

Cuando empezó el curso de UX ya sabía qué problema quería investigar. La investigación no creó la hipótesis desde cero — le permitió comprobar si esa experiencia que ella había vivido también existía para otras personas, y entender por qué.

---

## Frases textuales de entrevistas (oro para el case)

**Sobre qué limita encontrar experiencias nuevas, diferentes, genuinas o exclusivas:**

> "En general lo inaccesibles que pueden ser las ofertas que son distintas, y cuando viajo literalmente no saber nada de ese lugar o saber solo por encima."

> "Que a veces son muy de nicho entonces tienes acceso a ellas solo si estás ahí dentro, y más cuando viajas."

**Sobre cómo creen que podría cambiar eso (formas actuales de acceder):**

> "Conociendo gente."

> "Andando por las calles, viendo, explorando."

> "Salir solo sin expectativas."

**Sobre cómo buscan hoy:**

> "Busco específico en internet lo que quiero y pues muchas veces estoy bastante tiempo buscando hasta que encuentro algo que llama mi atención."

**Síntesis del insight (sin convertir las frases en algo que los usuarios no dijeron):**
Las experiencias diferentes o de nicho no necesariamente son difíciles de encontrar porque no existan, sino porque su descubrimiento depende de tener conocimiento local, saber dónde mirar o pertenecer al circuito que las conoce. La tensión: las personas quieren descubrir algo diferente, pero descubrirlo por sí mismas requiere demasiado conocimiento, tiempo o acceso al ecosistema local. Esto conecta con la idea de que Thea no es simplemente una cartelera, sino un criterio local/curatorial que hace visible una escena que normalmente permanece escondida.

---

## Cómo están resolviendo el problema hoy

- Conociendo gente que ya está dentro del circuito
- Caminando y explorando sin expectativas concretas
- Búsqueda específica y prolongada en internet, dependiente de saber de antemano qué se busca

---

## Lo que más les frustra

- Lo inaccesibles que resultan las ofertas distintas cuando se viaja sin conocimiento del lugar
- Que las experiencias de nicho solo sean accesibles si ya se está "dentro" del circuito
- El tiempo que toma buscar en internet algo que llame la atención, sin garantía de encontrarlo

---

## Solución ideal

Un criterio curatorial que haga el trabajo de "conocer la escena" por la persona — sin que tenga que caminar, conocer gente o pasar horas buscando en internet para encontrar algo que ni sabía que estaba buscando.

---

## Usuarios principales

Ver ACTORS.md para el detalle completo. Persona principal: **Aimeth**, actriz de teatro que viaja haciendo trabajo de campo artístico y busca experiencias teatrales alternativas en cada ciudad que visita.

---

## MVP

**Núcleo:** Descubrir → Explorar → Elegir → Reservar.

La propuesta de valor principal debe poder cumplirse sin necesitar chatbot, red social, funcionalidades avanzadas de comunidad ni otras capas secundarias.

**Funcionalidades del MVP original (research v1), para referencia:**
- Exploración y búsqueda: sugerencia de experiencias artísticas, buscar con palabras clave
- ~~Descubrir y conectar con personas: entrar al chat grupal, conectar con otras personas~~ → **descartado del MVP actual**, ver DECISIONS.md
- Pago: seleccionar y comprar, ver tickets después del pago

---

## Arquitectura de la información (resumen — detalle completo en ARCHITECTURE.md)

A partir de un Card Sorting con 10 participantes (tarjetas: Teatro, Danza, Performance, Música en vivo, Cine local, Cineclub, Lectura dramática, Charla artística, Taller, Festival), la arquitectura se redefinió alrededor de:

- **TODO** — Recomendado para ti / Más reservados / Nuevos descubrimientos
- **ESCENA** — Teatro / Danza / Performance / Música
- **CULTURA** — Cine / Cine local / Cineclub / Lecturas dramáticas / Charlas / Talleres / Festivales
- **BÚSQUEDA** — Buscar por palabra / Filtros
- **EXPERIENCIA** (página individual) — Información / Artistas-espacio / Comunidad / Reservar
- **PERFIL** — Mis reservas / Favoritos / Preferencias

No interpretar el Card Sorting como prueba estadística definitiva — 10 participantes, evidencia exploratoria para apoyar una decisión de arquitectura, no una validación cuantitativa.

---

## Testing de usabilidad

**Metodología:** test realizado por Zoom a 5 usuarios.

**Perfil del usuario del test:** personas a las que les gusta viajar y el arte, específicamente el teatro.

**Tarea:** reservar una experiencia en el Teatro Sanitario de Operaciones en Buenos Aires, Argentina, en el horario de 30/03 a las 08:30 pm.

**Objetivo:** encontrar el nivel de satisfacción y dificultad que tuvieron los usuarios al completar la tarea.

**Conclusiones:** la mayoría de usuarios pudieron completar con menor problema los distintos pasos de la tarea a realizar, en forma y tiempo, de manera intuitiva.

---

## Validación & éxito

*(Contenido tal como lo definió Ana — mantener la distinción entre validado y previsto)*

**1. Lo que se pudo validar (resultados reales):**
- 10 entrevistas → ayudaron a validar el problema de descubrimiento de experiencias artísticas de nicho y a entender el papel del conocimiento local, la exploración y las recomendaciones.
- 10 participantes en Card Sorting → ayudaron a definir la arquitectura de contenido y la separación entre Escena y Cultura.
- 5 participantes en usability testing → permitieron evaluar el flujo de descubrimiento y reserva y detectar oportunidades de mejora.

**2. Cómo se mediría el éxito si Theaveling existiera en producción (NO son métricas obtenidas — son indicadores previstos):**
- **Discovery rate:** % de usuarios que descubren una experiencia que no estaban buscando inicialmente.
- **Recommendation → booking:** % de recomendaciones que terminan en reserva.
- **Save rate:** % de experiencias guardadas/favoritas.
- **Repeat discovery:** % de usuarios que regresan para descubrir nuevas experiencias.
- **Independent scene impact:** reservas generadas para espacios y artistas independientes.

**North Star Metric candidata:** % de usuarios que descubren y reservan una experiencia que no habrían encontrado por su cuenta. Esta métrica conecta directamente el problema, la propuesta de valor y el modelo de producto: si Theaveling solo ayuda a encontrar algo que el usuario ya sabía buscar, se comporta como una ticketera; si consigue que descubra y reserve algo que no conocía, cumple su promesa de curaduría y descubrimiento.

**Narrativa de esta sección:** investigamos → validamos el concepto → tomamos decisiones de producto → definimos cómo mediríamos el éxito si se convierte en producto real. Visualmente diferenciar siempre "validado" de "previsto" — nunca presentar lo previsto como si fueran resultados de producción reales.

---

## Modelo de negocio (hipótesis/proyección, NO validado)

Direcciones posibles exploradas para una eventual evolución del modelo:
- Comisión por reserva/ticketing
- Membresía o curaduría premium
- Alianzas con espacios y productores independientes
- Pases o experiencias curadas

Presentar siempre como "modelo de negocio previsto" o "cómo podría escalar Theaveling" — nunca como decisiones definitivas ni como ingresos obtenidos. La prioridad del MVP sigue siendo demostrar descubrimiento → selección → reserva.

---

## Herramientas utilizadas

- **Diseño de interfaz y prototipado:** Figma
- **UX Research:** entrevistas, encuestas, card sorting, usability testing (Zoom)

---

## Insights clave para el case study

- El insight central: las experiencias de nicho no son difíciles de encontrar por no existir, sino por depender de conocimiento local/pertenecer al circuito.
- La tensión que resuelve el producto: querer descubrir algo distinto vs. no tener el conocimiento/tiempo/acceso para encontrarlo por cuenta propia.
- Theaveling no es una cartelera — es un criterio curatorial que hace visible una escena escondida.
- La decisión de diseño más importante: sacar la conexión social/chat del núcleo del MVP para no diluir la propuesta de descubrimiento + reserva.
- El posicionamiento se construye combinando tres referentes (MUBI + Airbnb + Teatrix), no copiando a ninguno — ver BENCHMARK.md.

---

## Frases para usar en el case

- *"La escena que no sabías que estabas buscando."*
- *"Thea descubre. La comunidad respalda."*
- *"No es que las experiencias de nicho no existan — es que hay que conocer la escena para encontrarlas."*
- *"Querer descubrir algo diferente y no tener cómo descubrirlo por cuenta propia: esa es la tensión que resuelve Theaveling."*
