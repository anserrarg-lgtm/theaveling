# Theaveling — Product Overview

> Visión general del producto. Para profundizar en cada tema, cada sección referencia el documento correspondiente.
> Este documento responde a una sola pregunta: ¿qué es Theaveling y por qué existe?

---

## Qué es Theaveling

Theaveling es una plataforma de descubrimiento y reserva de experiencias artísticas y culturales de nicho, especialmente vinculadas a las artes escénicas (teatro, danza, performance, música, cine local/cineclub, lecturas dramáticas, charlas, talleres, festivales, experiencias inmersivas y sensoriales).

No es una app de "encontrar actividades" ni una cartelera cultural genérica. El problema que resuelve es más específico: **las experiencias artísticas más especiales, locales y alternativas son difíciles de descubrir porque requieren conocer la escena** — saber dónde mirar, y muchas veces conocer personas que ya están dentro de ese ecosistema.

Theaveling funciona conceptualmente como esa persona que "conoce la escena". No necesita mostrar literalmente a una persona como interfaz — la plataforma incorpora ese criterio mediante curaduría.

**Inclinación hacia gente viajera (definido con Ana, 2026-08-16):** Theaveling es una plataforma de curaduría de nicho de artes escénicas — no una app de turismo cultural (ver DECISIONS.md). Pero eso no significa que haya perdido el contexto de viaje: sigue inclinada hacia esa persona que está viajando y quiere acceder a una oferta cultural de nicho sin conocer lo local. Theaveling funciona como esa persona que *ya* conoce la ciudad, y por eso tiene acceso a ofertas más infravaloradas del sector artístico escénico — ese es el valor que entrega. Esto **no es un patrón de uso idéntico al de Airbnb** — son productos distintos — pero encuentra sentido en varias cosas de cómo funciona ese servicio: lo puede usar cualquiera, nativos y no nativos, pero está inclinado hacia gente que está viajando a un lugar (ver Posicionamiento, más abajo). No es exclusivo para turistas ni se diseña solo para ellos — pero el caso de uso más fuerte, el que más valor recibe, es el de alguien de paso.

**Thea = curaduría + descubrimiento.**

**Frase que resume la propuesta:** *"La escena que no sabías que estabas buscando."*

---

## El problema

Confirmado por 10 entrevistas (ver CASE_STUDY.md para las citas textuales):

Las experiencias diferentes o de nicho no son difíciles de encontrar porque no existan, sino porque su descubrimiento depende de tener conocimiento local, saber dónde mirar, o pertenecer al circuito que ya las conoce. Las formas en que la gente sí las encuentra hoy — conocer gente, caminar sin expectativas, explorar — no son accesibles para alguien de paso. La alternativa (buscar específico en internet) toma mucho tiempo y exige saber de antemano qué se está buscando, lo cual contradice la idea misma de "descubrir".

**La tensión central:** las personas quieren descubrir algo diferente, pero descubrirlo por sí mismas requiere exactamente el conocimiento, tiempo o acceso al ecosistema local que no tienen por ser de fuera (o por no estar "dentro" de la escena).

---

## Cómo lo resuelve

El núcleo del producto es un flujo simple: **Descubrir → Explorar → Elegir → Reservar**. La propuesta de valor debe poder cumplirse sin depender de chat, red social, ni otras capas secundarias — esas cosas fueron consideradas y descartadas del MVP (ver DECISIONS.md).

La curaduría no se expone como una categoría más ("alternativo", "de nicho") dentro de la navegación — es el criterio implícito con el que se organiza y presenta todo el contenido.

→ Ver ARCHITECTURE.md para la arquitectura de información real (TODO / ESCENA / CULTURA / BÚSQUEDA / EXPERIENCIA / PERFIL).

---

## Posicionamiento y referentes

Theaveling no se posiciona como "una plataforma de actividades alternativas" genérica. Combina tres ideas de productos existentes, sin ser una copia de ninguno:

- **MUBI** — nicho, criterio y curaduría (sin necesidad de etiquetar el contenido como "alternativo").
- **Airbnb (Experiences)** — arquitectura de información orientada al descubrimiento y la reserva. No es un patrón de uso idéntico, pero varias cosas de cómo funciona ese servicio tienen sentido acá: puede usarlo cualquiera, pero está inclinado hacia gente que está viajando a un lugar (ver nota en "Qué es Theaveling", arriba).
- **Teatrix** — referencia de plataforma cultural de nicho y de cómo construir un modelo de negocio alrededor de contenido altamente específico.

→ Ver BENCHMARK.md para el detalle de cada referente y por qué se eligió.

---

## Los actores

El actor principal es la persona usuaria que busca descubrir experiencias (ver persona Aimeth en ACTORS.md). Thea actúa como el "criterio curatorial" — no es un actor humano dentro de la interfaz, es el comportamiento del producto.

La comunidad (reseñas, tips de quienes ya asistieron) es una capa secundaria que respalda la experiencia, no una sección principal de navegación. Originalmente se consideró un chat grupal para conectar viajeros — se descartó del MVP por alejarse del problema principal.

→ Ver ACTORS.md para el detalle completo.

---

## Filosofía

**Curaduría antes que catálogo.** Theaveling no busca listar todo lo que existe — busca hacer visible lo que normalmente permanece oculto por falta de conocimiento local.

**El núcleo no necesita comunidad para funcionar.** El MVP demuestra que Theaveling puede llevar a una persona desde el descubrimiento de una experiencia de nicho hasta la reserva, sin fricción y sin depender de funcionalidades sociales.

**Tono editorial y artístico, sin perder rigor de producto.** La narrativa del case study puede sentirse curatorial, cultural, exploratoria y humana — pero cada decisión de diseño se sostiene en investigación e insight, no solo en estética.

---

## Estado actual

Theaveling tiene un prototipo hi-fi en Figma con el flujo principal completo (Presentación → Onboarding → Login → Home → Búsqueda → Detalle → Reserva → Pago → Confirmación → Tickets). La arquitectura de información fue actualizada recientemente (Sitemap y User Flow ya reflejan TODO/ESCENA/CULTURA) pero **la pantalla Home y la navegación inferior todavía no se actualizaron** a esa misma arquitectura — ver ARCHITECTURE.md.

Todavía no existe código de producto ni se decidió stack — este es el estado de consolidación de investigación y narrativa antes de esa etapa. Ver ROADMAP.md.
