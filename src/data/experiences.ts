/*
 * Dataset mock de experiencias — 2026-09-02.
 *
 * Contenido cosechado del canvas real de Figma (títulos, descripciones,
 * venues, precios, fechas, reseñas ya escritos por Ana mientras armaba
 * el Design System) en vez de inventado de cero — ver investigación en
 * PENDIENTES.md. Las 5 inconsistencias que ese contenido tenía entre
 * mockups fueron resueltas en conversación con Ana (2026-09-02):
 *
 * - "Cuerpos en tránsito": tenía 2 identidades (Danza en Centro Danza
 *   Canal vs Performance en Espacio Callejón) — se usa la versión
 *   Espacio Callejón, que tiene la narrativa rica del lugar.
 * - "Materia y memoria": originalmente se mantenían 2 piezas separadas
 *   (lectura + taller). 2026-09-02: la variante "taller" se retiró a
 *   pedido de Ana — queda solo la versión "lectura". (La reemplazó
 *   primero "Bajo Tierra: Musical de Cámara", retirada porque la idea no
 *   convenció; después "Voces del margen" ocupó ese lugar brevemente al
 *   intercambiarse con "Uno a Uno" en Más reservados; finalmente Ana pidió
 *   que ese primer lugar de Descubrimientos fuera un musical de verdad —
 *   ahí quedó "A Chorus Line: Historias Reales de Bogotá" y "Voces del
 *   margen" salió del todo del prototipo, con su imagen reasignada a "Uno
 *   a Uno". Después, 2026-09-02: Ana pidió otro intercambio más — "Uno a
 *   Uno" pasó de Más reservados a Descubrimientos (tercer lugar) y "La
 *   casa de los silencios" pasó de Descubrimientos a Más reservados,
 *   entre "Las Tetas de Tiresias" y "Cuerpos en tránsito".)
 * - Ciudad: el prototipo es de una sola ciudad, Bogotá — no se
 *   incluyen Madrid ni Buenos Aires.
 * - "Fronteras Difusas": el título aparecía a medio terminar en
 *   distintos mockups — se usa la versión más completa,
 *   "Fronteras Difusas: Retrospectiva Analógica".
 * - detalle-mobile mezclaba el hero de "Dramaturgias Nómadas" con la
 *   ficha/artista/reseñas de una pieza de clown sin nombre — se
 *   separaron en 2 experiencias distintas; la de clown se bautizó
 *   "Comité del Fracaso: Ensayo Abierto" (título inventado, el resto del
 *   contenido — descripción, artista, festival, reseñas — es real).
 *
 * `rating` va siempre en escala de 10 (ej. "9.0"), nunca en porcentaje
 * — decisión de Ana, 2026-09-02 (ver ExperienceCardMasReservados.tsx).
 *
 * `rail` indica en qué sección de Descubrir aparece cada una: "curado"
 * (las 3 más editoriales, hero a sangre), "mas-reservados" (con precio
 * y rating visibles) o "descubrimientos" (sin precio/rating, más
 * minimalista — decisión de Ana sobre qué rieles se sienten
 * "comerciales" y cuáles no).
 */

export type Category =
  | "Teatro"
  | "Danza"
  | "Performance"
  | "Música"
  | "Cine"
  | "Cine local"
  | "Cineclub"
  | "Lecturas dramáticas"
  | "Charlas"
  | "Talleres"
  | "Festivales";

export interface Experience {
  id: string;
  title: string;
  /** Etiqueta curatorial específica (ej. "Teatro de máscaras") — NO la categoría oficial. */
  tag: string;
  category: Category;
  description: string;
  venue: string;
  city: "Bogotá";
  /*
   * 2026-09-05, a pedido de Ana: "PORQUE ESTAS PONIENDO DIFERENTES
   * FECHAS, EMPIEZA CON TODAS... LAS PROX POR LO MENOS AHORA EN OCTUBRE
   * SI O SI Y YA DESPUES LAS OTRAS DE AHI EN ADELANTE LO QUE QUIERAS
   * HASTA DICIEMBRE". Las 17 fechas del catálogo traían meses viejos
   * (mayormente marzo/abril) que quedaron en el pasado respecto a HOY
   * (Compra.tsx ahora dice "Fecha y hora PRÓXIMAS", ver esa nota) — una
   * inconsistencia real, no cosmética. Se reasignaron todas dentro de
   * octubre–diciembre 2026 (con octubre bien representado, como pidió),
   * espaciadas para no repetirse, conservando la hora original de cada
   * una (ese dato sí era intencional, no se toca).
   *
   * El nombre del día de la semana de cada fecha nueva es el REAL según
   * el calendario 2026 (calculado, no puesto a mano) — no tenía sentido
   * arreglar "qué tan futura" es la fecha y dejar el día de la semana
   * mal (ej. "Viernes 14 oct" cuando el 14 de octubre de 2026 cae
   * miércoles). El generador de opciones de Compra (`generarOpcionesFechaHora`
   * en utils/price.ts) sigue funcionando igual — deriva sus 6 chips a
   * partir de ESTA fecha real, ciclando los días de la semana desde acá.
   */
  date: string;
  /** "Gratis" o un monto formateado tipo "$35.000 COP". */
  price: string;
  /** Escala de 10, ej. "9.0". */
  rating: string;
  /** Cantidad de calificaciones detrás de `rating` — 2026-09-04, a pedido
   * de Ana, se muestra junto al puntaje en el Piece Info Hero de Detalle
   * (ver DetalleExperiencia.tsx). Primera pasada, número inventado (mismo
   * criterio que `porQueDescubrir`/`ficha`/`artista`) — no hay conteo real
   * de calificaciones todavía. */
  ratingCount: number;
  /** Opcional desde 2026-09-07: las 10 experiencias nuevas de Danza/
   * Performance/Música (a pedido de Ana, para sumar contenido real a
   * las secciones de Escena) no van en ningún riel de la pestaña
   * "Todo" — solo se ven filtradas por categoría en Escena/Cultura
   * (ver `getExperiencesByCategories`). Antes este campo era
   * obligatorio (las 17 experiencias originales sí viven en un riel);
   * se vuelve opcional para que estas piezas nuevas puedan quedar
   * fuera de los 3 rieles sin inventarles un lugar ahí (evita, por
   * ejemplo, inflar "Descubrimientos" y volver falso el conteo fijo
   * "+40" de su VerMasCard, que no se tocó). */
  rail?: "curado" | "mas-reservados" | "descubrimientos";
  /** 2026-09-08, a pedido de Ana ("las img que te di van para sumarle a
   * los contenidos en ver mas, no para poner en el scroll"): marca una
   * experiencia que SÍ cuenta para `getVerMasContent` (aparece en la
   * pantalla `/ver-mas/:slug`) pero NO debe listarse en el scroll de la
   * pestaña "Todo" — para eso, Descubrir.tsx filtra este campo antes de
   * armar el riel. Se usa en las 15 piezas nuevas de Descubrimientos: el
   * riel de la Home sigue mostrando solo las 7 de siempre, la pantalla
   * de "Ver más" muestra esas 7 más estas 15 (22 en total). */
  soloVerMas?: boolean;
  imageUrl?: string;
  /** 2026-09-08, a pedido de Ana ("corre la del filbo un poco hacia la
   * izq, con tal de que se vea lo que dice"): valor CSS de object-position
   * para el recorte de `imageUrl` en ExperienceCardCurado (usada en el
   * riel de Curado y en FestivalesCarousel). Opcional — sin este campo
   * el recorte sigue centrado como siempre. El afiche de FiLBo es más
   * ancho que la proporción de la card (390:520) y a "center" tapaba
   * el texto ("15 de Octubre") del lado derecho del afiche. */
  imagePosition?: string;
  /** Video de fondo para el Piece Info Hero de Detalle (autoplay, muted, loop).
   * Archivo en public/assets/videos/, se referencia como ruta absoluta —
   * no import, Vite lo sirve tal cual. Si no hay video, el Hero cae a
   * `imageUrl`, y si tampoco hay imagen, al placeholder gris actual. */
  videoUrl?: string;
  /** Si se muestra "Desde $X" o solo "$X" en precio. 2026-09-02, regla de
   * Ana: por defecto SIN "Desde" — se reserva para piezas en teatros
   * formales de verdad (escenario convencional con boletería por zonas,
   * ej. Teatro Mayor), donde "Desde" tiene sentido real porque hay
   * varias categorías de precio. No es una decisión estética suelta,
   * depende del tipo de venue. */
  mostrarDesde?: boolean;
  /** Si la experiencia tiene butaca asignada (sala de teatro/cine con
   * filas fijas) o es de aforo general (talleres, charlas, recorridos,
   * rituales inmersivos, festivales, funciones íntimas/a puerta
   * cerrada) — 2026-09-05, a pedido de Ana: "LA CANTIDAD DED PERSONAS
   * DEBE ESTAR RELACIONADO CON EL MAPA DE BUTACAS... Y EN ALGUNO
   * SIMPLEMENTE EL MAPA DE BUTACAS NO VA A SER CLICKEABLE PORQUE NO LO
   * NECESITA". Ya estaba en ARCHITECTURE.md como regla pendiente de
   * aplicar ("mapa de asientos solo en experiencias con butaca asignada
   * — las que no la tienen usan el selector de cantidad") — este campo
   * es la primera vez que se modela de verdad en el catálogo.
   *
   * Opcional, default `false` (aforo general) donde no está puesto —
   * mismo criterio que `mostrarDesde` arriba (booleano opcional, la
   * mayoría cae al comportamiento por defecto, se activa puntualmente).
   * Con `true`: Compra.tsx muestra `MapaButacas.tsx` (clickeable, define
   * la cantidad de personas eligiendo butacas — ver Compra.tsx). Con
   * `false`/ausente: no se muestra ningún mapa de butacas — "Cantidad
   * de personas" vuelve a ser el stepper +/- manual de siempre, porque
   * no hay butacas que elegir.
   *
   * Asignado acá como PRIMERA PASADA por tipo de puesta en escena
   * (no hay dato real de venue/boletería todavía, mismo criterio que el
   * resto de estos campos) — `true` para producciones formales en sala
   * fija con filas de butacas (teatro/danza tradicional, funciones de
   * cine); `false` para formatos sin fila de butacas (ensayos abiertos,
   * recorridos inmersivos, rituales/performance no convencional,
   * festivales con varios espacios, funciones íntimas 1 a 1, talleres,
   * charlas, lecturas). Ver el campo en cada experiencia más abajo para
   * el criterio puntual. */
  asientoAsignado?: boolean;
  /** Duración de la experiencia, en prosa (no solo el número) — 2026-09-04,
   * a pedido de Ana: sección "Información adicional" de Compra (ver
   * Compra.tsx). ARCHITECTURE.md pedía esto como "contenido narrativo
   * real, no solo datos", así que no es un simple "90 min" suelto sino
   * una frase con contexto (si tiene intermedio, si la duración varía,
   * etc). Primera pasada, contenido inventado siguiendo el mismo
   * criterio que `porQueDescubrir`/`ficha`/`artista`/`resenas` — no hay
   * dato real de producción todavía. Opcional a propósito, mismo
   * criterio que el resto de estos campos: donde falta, Compra cae a un
   * mensaje "pendiente de contenido real". */
  duracion?: string;
  /** Restricción de edad, en prosa con el motivo (no solo "+14") — mismo
   * pedido y mismo criterio que `duracion` de arriba. La mayoría de las
   * piezas del catálogo son "Todo público"; donde hay restricción, el
   * motivo se basa en lo que ya cuenta `description`/`tag` de esa misma
   * pieza (proximidad física, intensidad sensorial, lenguaje adulto),
   * no en contenido nuevo inventado sin relación. Contenido de primera
   * pasada, no hay clasificación oficial real todavía. */
  restriccionEdad?: string;
  /** "Dirección completa", "Curiosidad del lugar" y "contexto de barrio"
   * — 2026-09-04, para la sección "Información adicional" de Detalle
   * (nodo real de Figma `informacion-adicional-bottom-sheet`, `1950:670`,
   * traído vía get_design_context, ver DetalleExperiencia.tsx). Ana pidió
   * calcar el frame literal "con la info falsa por ahora, después la
   * corregimos" — así que estos 3 campos son PRIMERA PASADA a propósito
   * inventada (no hay direcciones/geodata real todavía, mismo criterio
   * que `ficha`/`artista`/`resenas`), pensada para verse bien en
   * pantalla mientras se arma el dato real, no para tomarse como
   * dirección real de ningún venue. Opcionales — donde faltan, la
   * sección cae a "pendiente de contenido real" como el resto. */
  direccionCompleta?: string;
  /** Texto narrativo sobre una curiosidad/historia del lugar — ver nota
   * de `direccionCompleta` arriba, mismo criterio y mismo estado
   * (primera pasada inventada, pendiente de corrección real). */
  curiosidadDelLugar?: string;
  /** Texto narrativo sobre la zona/barrio donde queda el venue — ver
   * nota de `direccionCompleta` arriba, mismo criterio. Deliberadamente
   * vago en vez de afirmar datos geográficos reales específicos de
   * venues reales (ej. "La Candelaria") que no pude verificar — mismo
   * cuidado que ya se tuvo con las coordenadas del mapa en Compra.tsx. */
  contextoBarrio?: string;
  /** Categoría/tipo del VENUE (ej. "Sala de teatro", "Cineclub") — NO
   * confundir con la categoría del ARTISTA/compañía (`artista.categoria`,
   * ej. "Compañía de performance"). 2026-09-04, corrección de Ana sobre
   * la sección "Información adicional" de Detalle: la primera versión
   * de esa sección reusaba `experiencia.artista` (nombre/categoría/
   * ciudad/foto) para la foto+ficha de arriba, pero esa sección habla
   * del LUGAR, no de la compañía ("ahí no se va a hablar de la
   * compañía, se va a hablar del lugar") — son 2 entidades distintas
   * que ya tienen su propia sección en Detalle (Artista/compañía) y no
   * deben mezclarse. `experiencia.venue` y `experiencia.city` (arriba)
   * ya son datos reales del lugar — este campo suma la categoría/tipo
   * de espacio que faltaba, mismo criterio de "info falsa por ahora"
   * que el resto de estos campos nuevos. */
  venueCategoria?: string;
  /** Barrio del venue (ej. "La Candelaria") — 2026-09-04, mismo día,
   * pedido explícito de Ana sobre la ficha de "Información adicional":
   * "cómo se llama el lugar y qué es y el barrio y pues en qué ciudad".
   * `venue`+`venueCategoria`+esto+`city` arman esa línea de identidad
   * (nombre / qué es / barrio · ciudad). Primera pasada inventada, mismo
   * criterio de "info falsa por ahora" que el resto de estos campos —
   * nombres de barrios reales de Bogotá usados como ambientación, no
   * como dato verificado de dónde queda cada venue (varios venues del
   * catálogo son ficticios de por sí). */
  venueBarrio?: string;
  /** Foto real del LUGAR (no de la compañía/artista — ver nota de
   * `venueCategoria` arriba). Distinta de `artista.imageUrl`: esa es la
   * foto de la compañía/artista que ya se usa en la sección "Artista /
   * compañía"; esta sería una foto del espacio físico en sí. Ana
   * todavía no subió fotos de lugares (solo de artistas/compañías hasta
   * ahora, ver el patrón de subida en experiences.ts más abajo) — queda
   * sin poblar para las 17 piezas a propósito, así que la sección cae
   * al placeholder (degradado + ícono de edificio) hasta que existan
   * fotos reales del lugar. NO se reusa `artista.imageUrl` acá aunque
   * técnicamente "funcionaría" — sería la misma confusión de entidades
   * que Ana pidió corregir. */
  venueImageUrl?: string;
  /** Contenido de las secciones 2-6 de Detalle (ver DetalleExperiencia.tsx,
   * traído del nodo real de Figma `detalle-mobile`, 1867:654, 2026-09-03).
   * Opcional a propósito: todavía no está escrito para las 16 experiencias
   * — donde falta, Detalle cae a un mensaje "pendiente de contenido real"
   * en vez de inventar specifics (mismo criterio que `description` cuando
   * falta). No confundir `porQueDescubrir` con `description`: `description`
   * es la bajada corta del hero (qué es), `porQueDescubrir` es el
   * argumento curatorial de Thea (por qué esta pieza y no otra). */
  porQueDescubrir?: string;
  ficha?: {
    presentaciones: string;
    festivales: string;
    premios: string;
    origen: string;
    idioma: string;
  };
  artista?: {
    nombre: string;
    /** Ej. "Compañía independiente" — chip corto, no la `category` oficial. */
    categoria: string;
    ciudad: string;
    /** Foto real del artista/compañía para el avatar de Artist/Space Card.
     * Opcional a propósito: el nodo real de Figma no trae foto (es
     * placeholder en el propio diseño) — donde falta, la card cae al
     * degradado + ícono de edificio (ver ArtistSpaceCard.tsx). */
    imageUrl?: string;
    /** Saludo breve en primera persona del artista/compañía hacia quien
     * está mirando la pieza — 2026-09-04, a pedido de Ana, se muestra
     * debajo de Artist/Space Card en Detalle. No es la voz de "Thea"
     * (el criterio curatorial del producto, que VOICE.md prohíbe poner
     * en primera persona) — es la voz de un artista/compañía REAL de la
     * ficción del catálogo hablando de sí mismo, distinto caso. Primera
     * pasada, contenido inventado (mismo criterio que el resto de esta
     * sección). */
    saludo?: string;
  };
  /** Reseñas de "Comunidad" en Detalle — 2026-09-04, a pedido de Ana: antes
   * eran 2 reseñas mock UNIVERSALES (mismas para las 17 piezas, ver nota
   * vieja que se borra en DetalleExperiencia.tsx). Ahora cada experiencia
   * tiene su propio set de al menos 5, escritas específicas a esa pieza
   * (tip práctico de logística, experiencia yendo solo/a, reacción al
   * contenido puntual, recomendación cruzada a otra pieza real del
   * catálogo). Contenido inventado, mismo criterio que `porQueDescubrir`/
   * `ficha`/`artista` — no hay backend de reseñas real todavía. */
  resenas?: Reseña[];
}

export interface Reseña {
  nombre: string;
  /** Escala de 10, ej. "★ 9.2" — mismo criterio que `rating` de arriba,
   * nunca en porcentaje. */
  rating: string;
  fecha: string;
  texto: string;
}

export const experiences: Experience[] = [
  // — Curado (3, editorial, hero a sangre) —
  {
    id: "dramaturgias-nomadas",
    title: "Dramaturgias Nómadas: Muestra Estival",
    tag: "Teatro experimental",
    // 2026-09-04, a pedido de Ana: "Muestra Estival" no es solo el
    // subtítulo, la pieza ya estaba ligada al FITB 2025 en su propia
    // ficha (`ficha.festivales`, abajo) — y "Festivales" ya existía
    // como Category en el tipo de acá arriba pero ninguna experiencia
    // la usaba todavía. Se cambia de "Teatro" a "Festivales" para que
    // el dato quede consistente en los dos lugares. Sin efecto
    // colateral: `category` solo se usa como eyebrow de texto en
    // Compra.tsx y para agrupar "contenido similar" en
    // getRelatedExperiences (con fallback a cualquier otra si no hay
    // más "Festivales" — no lo hay todavía, así que sigue
    // completando con el resto igual que antes).
    category: "Festivales",
    description:
      "Hibridación de las artes escénicas europeas en un entorno industrial recuperado de la periferia urbana.",
    venue: "Teatro Sarmiento",
    city: "Bogotá",
    venueCategoria: "Nave industrial reconvertida",
    venueBarrio: "San Felipe",
    // 2026-09-04, foto real subida por Ana a la carpeta de assets para
    // el bloque "Sobre el lugar" de Detalle.
    venueImageUrl: "/assets/images/nomadas.jpg",
    date: "Viernes 2 oct · 21:00",
    price: "$42.000 COP",
    duracion: "80 minutos, sin intermedio — el ritmo está pensado para verse de un tirón, sin corte.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 22 #6-35, Bogotá",
    curiosidadDelLugar: "El edificio fue una fábrica textil hasta los años 90 — la compañía conservó los rieles del techo, hoy parte de la escenografía.",
    contextoBarrio: "Una zona de bodegas reconvertidas en espacios culturales, a pocas cuadras del centro.",
    rating: "9.3",
    ratingCount: 214,
    rail: "curado",
    // Nombre real del archivo que subió Ana — quedó con doble extensión
    // (.mp4.mp4), lo referencio tal cual está en la carpeta.
    videoUrl: "/assets/videos/dramaturgias-nomadas.mp4.mp4",
    // El video manda en el Hero de Detalle, pero la card de Curado en
    // Descubrir solo pinta imagen (no video) — por eso también necesita
    // imageUrl para su miniatura.
    imageUrl: "/assets/images/Dramaturgias%20N%C3%B3madas.png",
    // 2026-09-04: primera pasada de contenido — se había quedado afuera
    // de la ronda inicial (2026-09-03) por error: esa vez se trató a
    // "comite-del-fracaso" como si fuera la única pieza con contenido
    // "ya resuelto" (real, cosechado de Figma) y a esta como pendiente
    // de una decisión sobre dónde vivía el contenido mezclado del nodo
    // `detalle-mobile` — una vez que se resolvió (separarlas en 2 piezas
    // distintas, ver header del archivo), esta quedó sin su propio
    // contenido de las secciones 2-6. Ana lo notó al revisar varias
    // pantallas de Detalle seguidas. Mismo criterio de invención que el
    // resto de esta ronda — ver nota completa en "la-consagracion-del-otono".
    porQueDescubrir:
      "Danza, texto y video en vivo conviven acá sin que ninguna disciplina domine sobre las otras — montado en una nave industrial reconvertida que todavía conserva parte de la maquinaria original. Theaveling la eligió por esa hibridación real, no solo anunciada en el programa de mano.",
    ficha: {
      presentaciones: "14 funciones desde su estreno en 2025",
      festivales: "Festival Internacional de Teatro de Bogotá (FITB) 2025",
      premios: "sin premios todavía",
      origen: "pieza original, no es una adaptación",
      idioma: "Español, con tramos en inglés y francés",
    },
    artista: {
      nombre: "Compañía Nómada",
      // 2026-09-04, a pedido de Ana: "decimos mucho compañía y
      // colectivo" en el campo `categoria` de varias piezas — se
      // reparte el vocabulario (grupo/ensamble/agrupación/formación/
      // laboratorio/núcleo/plataforma/productora) entre las 8 que
      // repetían "Compañía..." acá, evitando además que se repita la
      // misma palabra del `nombre` en la línea de abajo.
      categoria: "Agrupación internacional",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx). Igual que "materia y memoria",
      // el archivo original es una foto de escena panorámica (todo el
      // elenco disperso en el escenario) — a 96px el avatar circular
      // dejaba las caras minúsculas e irreconocibles. Se usa un recorte
      // cuadrado centrado en las 2 bailarinas más cercanas a cámara
      // (mismo archivo, sin alterar el original en la carpeta de Ana).
      imageUrl: "/assets/images/dramatugia%20recorte.jpg",
      saludo:
        "Somos Compañía Nómada — un grupo de artistas de distintos países que se conoció trabajando en Europa y decidió seguir haciéndolo desde Bogotá. Ninguno de nosotros viene solo del teatro.",
    },
    resenas: [
      {
        nombre: "Camila R.",
        rating: "★ 9.5",
        fecha: "Hace 3 días",
        texto:
          "Llegué con tiempo pero igual la fila para entrar a la nave industrial es larga — mejor llegar 20 minutos antes de lo que dice el ticket.",
      },
      {
        nombre: "Andrés L.",
        rating: "★ 9.0",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola y no me sentí incómoda ni un segundo, hay mucha gente que va sin compañía, se nota en la sala.",
      },
      {
        nombre: "Valentina G.",
        rating: "★ 9.4",
        fecha: "Hace 2 semanas",
        texto:
          "La mezcla de danza, texto y video en vivo me desubicó al principio, pero a los 10 minutos entendí el ritmo y no quise que terminara.",
      },
      {
        nombre: "Sebastián V.",
        rating: "★ 8.8",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Trance: Ritual Sonoro Colectivo — mismo tipo de riesgo formal, distinto lenguaje.",
      },
      {
        nombre: "Paula H.",
        rating: "★ 9.6",
        fecha: "Hace 2 meses",
        texto:
          "El edificio solo ya vale la entrada, todavía tiene maquinaria industrial original. La obra está a la altura del espacio.",
      },
    ],
  },
  {
    // 2026-09-02: intercambio de posición pedido por Ana — esta pieza
    // (antes en "mas-reservados") pasa a Curado, y "cuerpos-en-transito"
    // (antes acá) pasa a Más reservados. Ver esa entrada más abajo.
    id: "la-consagracion-del-otono",
    title: "La consagración del otoño",
    tag: "Danza contemporánea",
    category: "Danza",
    description:
      "Una reinterpretación visceral y minimalista de la consagración primaveral a través de técnicas de danza butoh y expresión contemporánea.",
    // 2026-09-04, a pedido de Ana ("cuerpo sy otoño comparten lugar
    // pero expecificando que en esa pieza especial de otoño se hizo y
    // monto la escenografia afuera en la calle cerrada AL LADO del
    // teatro"): esta pieza comparte venue con "Cuerpos en tránsito"
    // (Espacio Callejón, La Candelaria — ver ese bloque más abajo, es
    // el mismo criterio de venue compartido que Casa Cuarta Pared entre
    // "Comité del Fracaso" y "La casa de los silencios"), pero a
    // diferencia de Cuerpos en Tránsito (que sí es adentro de la sala),
    // esta función se monta afuera, en la calle cerrada al lado del
    // teatro — ver esa distinción en `curiosidadDelLugar`. Antes decía
    // "Teatro San Martín" (nombre inventado, sin relación con ningún
    // otro venue del catálogo) — se reemplaza por completo.
    venue: "Espacio Callejón",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "La Candelaria",
    // 2026-09-04: Ana subió "espacio callejon.jpg" — se usa acá y en
    // "Cuerpos en tránsito" (mismo venue compartido).
    venueImageUrl: "/assets/images/espacio%20callejon.jpg",
    date: "Jueves 8 oct · 20:00",
    price: "$45.000 COP",
    // Pieza de danza formal en sala — butacas típicas de este formato.
    asientoAsignado: true,
    duracion: "65 minutos, sin intermedio.",
    restriccionEdad: "+14 años — el lenguaje corporal del butoh es intenso, y algunas imágenes pueden resultar fuertes para público infantil.",
    direccionCompleta: "Carrera 5 #26-42, Bogotá",
    curiosidadDelLugar: "Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo. Para esta pieza en particular la escenografía no se monta adentro de la sala: se hace afuera, en el tramo de calle que se cierra al tráfico justo al lado del teatro.",
    contextoBarrio: "Centro histórico de Bogotá, zona mayormente peatonal con calles empedradas.",
    rating: "9.1",
    ratingCount: 96,
    rail: "curado",
    imageUrl: "/assets/images/La%20consagraci%C3%B3n%20del%20oto%C3%B1o.png",
    // 2026-09-03: video generado en Pika (imagen de referencia +
    // secuencia de venia/saludo/aplauso armada con Ana). Solo se usa en
    // Detalle — en Home (Curado) sigue la foto, a pedido explícito de Ana
    // (ver nota de reversión en ExperienceCardCurado.tsx).
    videoUrl: "/assets/videos/oto%C3%B1o.mp4",
    // 2026-09-03: primera pasada de contenido para las secciones 2-6 de
    // Detalle — a diferencia de "Comité del Fracaso" (contenido real
    // cosechado de Figma), esto es contenido INVENTADO por esta sesión a
    // partir de lo que ya dice `title`/`description`/`tag`/`venue` de
    // cada pieza — mismo criterio de invención ya usado para las 5
    // experiencias marcadas como tal más abajo. Pendiente de revisión de
    // Ana antes de darlo por definitivo (nombres de compañía, festivales
    // y cifras de presentaciones son plausibles, no verificables).
    porQueDescubrir:
      "Nijinsky y Stravinsky escandalizaron a París en 1913 con esta pieza — acá se la despoja de espectáculo (sin orquesta en vivo, sin vestuario de época) y se la lleva al extremo opuesto: butoh lento, casi inmóvil, un solo cuerpo cargando toda la tensión. Theaveling la eligió por esa reducción, no por el nombre del clásico que reinterpreta.",
    ficha: {
      presentaciones: "8 funciones desde su estreno en 2025",
      festivales: "Festival de Danza Contemporánea de Bogotá 2025",
      premios: "sin premios todavía — producción reciente",
      origen:
        "reinterpretación libre de \"La consagración de la primavera\" (Stravinsky/Nijinsky, 1913), no una reconstrucción histórica",
      idioma: "Sin diálogo (pieza de danza)",
    },
    artista: {
      nombre: "Cuerpo Errante",
      categoria: "Formación de danza contemporánea",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/oto%C3%B1o.jpg",
      saludo:
        "Hola, somos Cuerpo Errante — llevamos 4 años investigando butoh y danza contemporánea desde Bogotá. Nos interesa el cuerpo lento, el que no busca el aplauso inmediato.",
    },
    resenas: [
      {
        nombre: "Natalia Q.",
        rating: "★ 9.3",
        fecha: "Hace 4 días",
        texto:
          "Aviso: es lentísima a propósito. Si vas esperando algo dinámico te vas a desesperar — hay que entrar con la cabeza puesta en otro ritmo.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.8",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola un viernes y terminé pensando en la pieza todo el camino a la casa. No hace falta ir acompañada para que pegue.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 9.2",
        fecha: "Hace 3 semanas",
        texto:
          "El butoh no es para todo el mundo pero la ejecución acá es impecable, ni un movimiento de más.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.6",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Sesión Subterránea — otra pieza que se apoya solo en el cuerpo, sin palabras.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 9.4",
        fecha: "Hace 3 meses",
        texto:
          "Sin orquesta en vivo, ojo, es todo grabado — no lo esperaba y me tomó un momento acostumbrarme, pero funciona.",
      },
    ],
  },
  {
    // Renombrada 2026-09-02 a pedido de Ana: quería un nombre más de
    // clown y de paso saca otro "cuerpo" de en medio (ver nota de la
    // charla más abajo, mismo motivo).
    id: "comite-del-fracaso",
    title: "Comité del Fracaso: Ensayo Abierto",
    tag: "Clown y creación colectiva",
    category: "Teatro",
    description:
      "Un ensayo escénico poco frecuente en el circuito local: cruza clown físico con dramaturgia de creación colectiva, sin texto previo — se construye enteramente en sala durante meses de work-in-progress. Theaveling la eligió por el riesgo formal, no por el nombre del elenco.",
    // 2026-09-04, a pedido de Ana ("lo de la sala cuarta pared no
    // gusta, pongamosle casa cuarta pared. es un espacio de
    // presentacion esccenica"): "Sala Cuarta Pared" → "Casa Cuarta
    // Pared" (venueCategoria también se ajusta). Además, Ana corrigió
    // cómo se cuenta el venue compartido con "La casa de los
    // silencios": antes esta descripción nombraba la OTRA pieza
    // directamente ("no las mezcles asi") — ahora cada una describe el
    // venue desde lo que pasa en SU propia función: acá el ensayo
    // abierto ocurre en una de las salas subterráneas de la casa.
    venue: "Casa Cuarta Pared",
    city: "Bogotá",
    venueCategoria: "Espacio de presentación escénica",
    venueBarrio: "La Soledad",
    // 2026-09-04: Ana volvió a renombrar el archivo, ahora a "casa
    // cuarta pared.jpg" (antes "lugar clown.jpg", antes "comite.jpg")
    // — se actualiza la referencia. Mismo venue compartido con "La casa
    // de los silencios".
    venueImageUrl: "/assets/images/casa%20cuarta%20pared.jpg",
    date: "Domingo 11 oct · 17:00",
    price: "$15.000 COP",
    duracion: "70 minutos aproximados — al ser un ensayo abierto todavía en construcción, la duración puede variar de función a función.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 60 #9-18, Bogotá",
    curiosidadDelLugar: "Casa Cuarta Pared empezó como una casa de familia — el patio interior sigue siendo parte del recorrido antes de entrar. Este ensayo abierto ocurre en una de las salas subterráneas de la casa, bajo el nivel del patio — más íntima y con menos eco que las salas de arriba.",
    contextoBarrio: "Barrio residencial tranquilo, con parqueo fácil los fines de semana.",
    rating: "9.2",
    ratingCount: 58,
    imageUrl: "/assets/images/comite%20del%20fracaso.png",
    rail: "curado",
    // 2026-09-03: video generado en Pika (imagen de referencia + payasos
    // girando a ver cámara, saludo y mueca final, armado con Ana). Solo
    // se usa en Detalle — en Home (Curado) sigue la foto, mismo criterio
    // que Dramaturgias Nómadas y La consagración del otoño.
    videoUrl: "/assets/videos/clown.mp4",
    // 2026-09-03: contenido real del nodo Figma `detalle-mobile` (ver nota
    // en el tipo `Experience` arriba) — es justo el contenido que
    // originalmente estaba mezclado bajo el hero de "Dramaturgias
    // Nómadas" en Figma, y que ya se había separado acá como esta pieza
    // propia. `porQueDescubrir` repite el mismo texto que `description`
    // a propósito: es el único texto real que existe para esta pieza, y
    // en Figma cumple los dos roles (bajada del hero + argumento
    // curatorial) — no se inventó contenido nuevo para diferenciarlos.
    porQueDescubrir:
      "Un ensayo escénico poco frecuente en el circuito local: cruza clown físico con dramaturgia de creación colectiva, sin texto previo — se construye enteramente en sala durante meses de work-in-progress. Theaveling la eligió por el riesgo formal, no por el nombre del elenco.",
    ficha: {
      presentaciones: "12 desde su estreno en 2024",
      festivales: "Festival Internacional de Teatro de Bogotá (FITB) 2025",
      premios: "sin premios todavía — producción reciente",
      origen: "no es un remake, parte de improvisaciones originales del elenco",
      idioma: "Español",
    },
    artista: {
      nombre: "Colectivo Membrana",
      categoria: "Laboratorio de teatro independiente",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/comite.jpg",
      saludo:
        "Somos Colectivo Membrana. Trabajamos sin texto previo — todo lo que ves salió de meses de ensayo en sala, no de un guión escrito de antemano.",
    },
    resenas: [
      {
        nombre: "David A.",
        rating: "★ 9.4",
        fecha: "Hace 2 días",
        texto:
          "Es un ensayo abierto de verdad, no una obra terminada — no vayas esperando algo pulido, esa es justamente la gracia.",
      },
      {
        nombre: "Mariana K.",
        rating: "★ 8.9",
        fecha: "Hace 6 días",
        texto:
          "Fui sola un domingo y terminé hablando con el elenco al final, se quedan un rato después de la función.",
      },
      {
        nombre: "Esteban Z.",
        rating: "★ 9.3",
        fecha: "Hace 2 semanas",
        texto:
          "Por $15.000 es de las cosas más generosas que he visto este año, no doy fe de que dure ese precio.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 8.7",
        fecha: "Hace 5 semanas",
        texto:
          "Si te gustó esto, también me gustó Uno a Uno — otra pieza que se construye distinto cada vez que la ves.",
      },
      {
        nombre: "Camilo W.",
        rating: "★ 9.5",
        fecha: "Hace 2 meses",
        texto:
          "Se ríe uno mucho pero hay un par de momentos incómodos a propósito, no es solo comedia liviana.",
      },
    ],
  },

  // — Más reservados (4, con precio y rating) —
  {
    id: "sesion-subterranea",
    title: "Sesión Subterránea: Ritual de Máscaras",
    tag: "Teatro de máscaras",
    category: "Teatro",
    // 2026-09-03, corregido a pedido de Ana: el `tag` ("Teatro de
    // máscaras") no coincidía con esto — la versión anterior describía
    // una sesión de música modular, sin ninguna máscara. Se reescribe
    // toda la pieza (título, descripción, ficha, artista) para que sea
    // coherente como teatro de máscaras de punta a punta, no un parche
    // de tag. "Sesión Subterránea" y "Búnker 43" se mantienen — funcionan
    // igual de bien para un ritual escénico que para una sesión sonora.
    description:
      "Un ritual escénico sin palabras: actores con máscaras talladas a mano cuentan la historia solo con el cuerpo y el gesto, en un búnker reconvertido. Sólo 40 espectadores por función, sentados a centímetros del escenario, sin cuarta pared.",
    venue: "Búnker 43",
    city: "Bogotá",
    venueCategoria: "Espacio alternativo",
    venueBarrio: "Santa Fe",
    // 2026-09-04: Ana renombró el archivo en su carpeta a "bunker 43.jpg"
    // (antes era una foto suelta sin nombre claro, "ritual mascaras.jpg",
    // que había asignado por descarte) — se actualiza la referencia.
    venueImageUrl: "/assets/images/bunker%2043.jpg",
    // 2026-09-04, a pedido de Ana: "UTILIZA OCT EN VEZ DE FEB" — mes
    // cambiado de febrero a octubre, mismo día 14 y hora.
    date: "Miércoles 14 oct · 20:00",
    price: "$95.000 COP",
    // 2026-09-07 — hubo un campo `agotada` acá por un rato (para
    // demostrar un estado "sin disponibilidad" en Detalle/Compra), pero
    // Ana decidió que Theaveling no debe mostrar contenido sin
    // disponibilidad — "esa opcion la podemos quitar". Se revirtió del
    // todo: el campo, el badge y el bloqueo en Detalle/Compra ya no
    // existen (ver DetalleExperiencia.tsx/Compra.tsx). Esta pieza vuelve
    // a ser "siempre disponible" como el resto del catálogo.
    duracion: "50 minutos, sin palabras y sin intermedio.",
    restriccionEdad: "+12 años — se está sentado a centímetros del escenario, sin cuarta pared, en un ambiente de penumbra sostenida que puede resultar intenso para los más chicos.",
    direccionCompleta: "Carrera 7 #45-20 (sótano), Bogotá",
    curiosidadDelLugar: "Búnker 43 fue, literalmente, un refugio antiaéreo — la compañía mantuvo las paredes de concreto original sin revestir.",
    contextoBarrio: "Se entra por una puerta sin aviso grande — conviene mirar bien la fachada antes de llegar.",
    rating: "8.8",
    ratingCount: 34,
    rail: "mas-reservados",
    // 2026-09-04: la carpeta de assets de ESTE proyecto (no la de Ana)
    // estaba desactualizada y no tenía el .webp real — se llegó a
    // cambiar esta referencia al .png viejo por error. Ya está
    // corregido: el .webp real se trajo de la carpeta de Ana y vuelve a
    // ser la referencia correcta, tal cual estaba.
    imageUrl:
      "/assets/images/Sesi%C3%B3n%20Subterr%C3%A1nea%20%E2%80%94%20Modular%20en%20vivo.webp",
    // 2026-09-03: primera pasada de contenido — ver nota completa en la
    // primera entrada que la trae ("la-consagracion-del-otono", arriba).
    porQueDescubrir:
      "Sin diálogo y con la cara cubierta, los actores no pueden apoyarse en la palabra ni en el gesto facial — todo pasa por el cuerpo. Con 40 espectadores como techo, sentados casi encima del escenario, no hay distancia posible con lo que se está contando. Theaveling la eligió por esa exposición: nada que esconder detrás de un texto.",
    ficha: {
      presentaciones: "6 funciones desde su estreno en 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen:
        "las máscaras se inspiran en tradiciones de teatro ritual latinoamericano, sin imitar ninguna en particular — diseño original de la compañía",
      idioma: "Sin diálogo (teatro de máscaras)",
    },
    artista: {
      nombre: "Compañía Máscara Viva",
      categoria: "Ensamble de teatro de máscaras",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/ritual%20mascaras.jpg",
      saludo:
        "Somos Compañía Máscara Viva. Tallamos nuestras propias máscaras y creemos que el cuerpo, sin cara visible, cuenta historias que la palabra no puede.",
    },
    resenas: [
      {
        nombre: "Laura B.",
        rating: "★ 9.0",
        fecha: "Hace 5 días",
        texto:
          "Solo 40 cupos, se agota rápido — compra apenas veas fecha, no esperes a la semana de la función.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.5",
        fecha: "Hace 2 semanas",
        texto:
          "Fui sola y por un momento me sentí observada por los actores — al estar tan cerca del escenario no hay dónde esconderse, en el buen sentido.",
      },
      {
        nombre: "Andrea M.",
        rating: "★ 8.9",
        fecha: "Hace 3 semanas",
        texto:
          "Sin diálogo y con máscaras todo el tiempo, cuesta un poco entrar al principio, pero después el cuerpo cuenta todo lo que hace falta.",
      },
      {
        nombre: "Santiago P.",
        rating: "★ 8.3",
        fecha: "Hace 6 semanas",
        texto:
          "Si te gustó esto, también me gustó La consagración del otoño — otra pieza que confía en el cuerpo sin apoyarse en texto.",
      },
      {
        nombre: "Julián T.",
        rating: "★ 9.1",
        fecha: "Hace 3 meses",
        texto:
          "El búnker en sí ya pone el ambiente antes de que empiece nada. Llega 15 minutos antes para sentir el lugar.",
      },
    ],
  },
  {
    // 2026-09-02: reemplaza a "Cámara de Ecos: Espacio Sensorial" (retirada),
    // primero por "Umbral: Danza Expandida" y después, a pedido de Ana, por
    // esta — quería teatro, no danza. Es la obra real de Apollinaire (1917,
    // París) que le dio nombre al movimiento surrealista: él mismo la
    // subtituló "drama surrealista". El argumento (una mujer que cambia de
    // sexo para escapar del mandato doméstico y termina gobernando entre
    // hombres) ya era, para su época, una provocación proto-feminista —
    // acá se monta con una lectura explícitamente feminista contemporánea.
    // Sigue en un teatro formal real de Bogotá (escenario convencional,
    // boletería por zonas → "Desde" tiene sentido), aunque la puesta en
    // escena sea arriesgada.
    id: "las-tetas-de-tiresias",
    title: "Las Tetas de Tiresias: Lectura Feminista",
    tag: "Farsa surrealista",
    category: "Teatro",
    description:
      "La obra que le dio nombre al surrealismo — Apollinaire, 1917 — sobre una mujer que cambia de sexo para escapar del mandato doméstico y termina gobernando entre hombres. Esta versión traslada el escándalo original a una lectura explícitamente feminista contemporánea, sin perder el tono de farsa absurda del texto.",
    venue: "Teatro Mayor Julio Mario Santo Domingo",
    city: "Bogotá",
    venueCategoria: "Teatro",
    venueBarrio: "Chicó",
    // 2026-09-04: Ana subió y nombró "teatro mayor.jpg" específicamente
    // para el venue — distinta de "las tetas.jpg" (foto de la ARTISTA,
    // `artista.imageUrl` más abajo, "Compañía Teatro Mayor"). Antes esta
    // sección no tenía foto propia justamente para no mezclar las dos.
    venueImageUrl: "/assets/images/teatro%20mayor.jpg",
    date: "Sábado 17 oct · 20:00",
    price: "$55.000 COP",
    // Lectura dramatizada formal en sala de teatro — butacas típicas.
    asientoAsignado: true,
    duracion: "95 minutos, con un intermedio de 15 minutos.",
    restriccionEdad: "+14 años — hay humor y lenguaje adulto propios de la farsa original de Apollinaire.",
    direccionCompleta: "Calle 71 #10-25, Bogotá",
    // 2026-09-04, a pedido de Ana (balancear las curiosidades del lugar
    // entre historia/dato de origen y algo actual — ver nota completa
    // en "trance-ritual-sonoro", primera vez que se hace este cambio):
    // se agrega una segunda frase con un dato actual/de prestigio en
    // vez de dejarlo solo en la anécdota operativa de la boletería. El
    // Teatro Mayor es un venue real de Bogotá — sí programa
    // regularmente compañías internacionales de ópera, ballet y danza
    // (confirmado por su programación pública), la frase se mantiene
    // genérica a propósito, no se inventan nombres de compañías
    // puntuales para no afirmar algo no verificable sobre un lugar real.
    curiosidadDelLugar: "El Teatro Mayor tiene una de las pocas boleterías físicas por zonas que quedan en la ciudad — vale la pena llegar temprano si quieres elegir asiento. Por su escenario pasan regularmente compañías internacionales de ópera, ballet y danza que rara vez llegan a otras salas de la ciudad.",
    contextoBarrio: "Zona de teatros y restaurantes, con buena conexión de transporte público.",
    rating: "9.2",
    ratingCount: 312,
    rail: "mas-reservados",
    mostrarDesde: true,
    imageUrl: "/assets/images/las%20tetas%20de%20tiresias.jpg",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "Apollinaire escandalizó a París en 1917 con esta farsa; un siglo después, la misma provocación —una mujer que se libera del mandato doméstico y termina gobernando entre hombres— se lee distinto. Theaveling la eligió porque la puesta no intenta suavizar el original ni actualizarlo: lo deja intacto y confía en que el público de hoy lo escuche de otra forma.",
    ficha: {
      presentaciones: "20 funciones desde su estreno en 2024",
      festivales: "Festival Iberoamericano de Teatro de Bogotá (FITB) 2024",
      premios: "Mención especial de dirección, FITB 2024",
      origen: "adaptación de \"Les Mamelles de Tirésias\" de Guillaume Apollinaire (1917)",
      idioma: "Español",
    },
    // 2026-09-04, a pedido de Ana: "debemos separar lo que es lugar
    // del artista... eso debe ser distinto en la mayoria de los
    // casos". Varias piezas de teatro/danza/performance tenían el
    // campo `artista` reciclando la identidad del `venue` ("Compañía
    // Teatro Mayor" en el Teatro Mayor, "Teatro Matacandelas" en
    // Teatro Matacandelas, etc.) — como si el lugar y quien crea la
    // pieza fueran la misma entidad. Se reescriben con una identidad
    // propia (nombre de compañía o de persona, distinto del venue) y
    // un saludo que habla de lo que crearon, con nombre real de quien
    // dirige/actúa — no del espacio que los aloja. Mismo criterio
    // aplicado acá y en "antigona-ahora", "a-chorus-line", "uno-a-uno"
    // y "materia-y-memoria" (las 5 piezas con este problema). Cine
    // (Cine Tonalá, El Muro, Cinemateca del Parque) y
    // charlas/talleres/clases (Ditirambo, Danza Canal) se quedan como
    // programación del propio espacio — Ana los dio por buenos así.
    artista: {
      nombre: "Colectiva Delirio",
      categoria: "Grupo de teatro independiente",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/las%20tetas.jpg",
      saludo:
        "Somos Colectiva Delirio. Llevamos ocho años montando clásicos del absurdo con elencos y miradas mayoritariamente femeninas — esta lectura de Apollinaire la dirige Renata Aguilar, y no le suaviza ni una línea al texto original.",
    },
    resenas: [
      {
        nombre: "Camila R.",
        rating: "★ 9.4",
        fecha: "Hace 1 día",
        texto:
          "Compra con tiempo si quieres zona cerca del escenario — las localidades se venden por sectores y las de adelante vuelan primero.",
      },
      {
        nombre: "Esteban Z.",
        rating: "★ 8.9",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola una noche entre semana y la sala estaba llena igual, no hace falta esperar al fin de semana.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 9.3",
        fecha: "Hace 3 semanas",
        texto:
          "Me esperaba algo más solemne por ser un clásico de 1917 y es una farsa absurda de principio a fin, me reí muchísimo.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.7",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Comité del Fracaso — mismo espíritu de reírse de las cosas serias.",
      },
      {
        nombre: "Andrea M.",
        rating: "★ 9.5",
        fecha: "Hace 2 meses",
        texto:
          "La lectura feminista está bien integrada, no se siente pegada encima del texto original.",
      },
    ],
  },
  {
    // 2026-09-02: Ana pidió que "La casa de los silencios" pasara a este
    // riel, justo acá — entre "Las Tetas de Tiresias" y "Cuerpos en
    // tránsito" — a cambio de que "Uno a Uno" pasara a Descubrimientos
    // (ver esa entrada más abajo, tercer lugar). Contenido sin cambios,
    // solo cambia `rail`.
    id: "la-casa-de-los-silencios",
    title: "La casa de los silencios: Recorrido Inmersivo",
    tag: "Teatro inmersivo",
    category: "Teatro",
    description:
      "Un espacio escénico donde el silencio se convierte en protagonista. Teatro inmersivo que explora los límites de la percepción auditiva.",
    // 2026-09-04, a pedido de Ana ("la de la casa de los silencios es
    // el mismo lugar que el clown no?") — confirmado, comparte venue
    // con "Comité del Fracaso". Nombre actualizado a "Casa Cuarta
    // Pared" (ver esa nota en "comite-del-fracaso"). Corrección
    // posterior de Ana ("no le pongas lo de clown wtf, solo pones la
    // descripcion del lugar inclinado a lo que se hace en la obra...
    // no las mezcles asi"): esta descripción ya NO nombra a "Comité del
    // Fracaso" — cada pieza describe el venue desde su propia función,
    // sin cruzar referencias entre sí.
    venue: "Casa Cuarta Pared",
    city: "Bogotá",
    venueCategoria: "Espacio de presentación escénica",
    venueBarrio: "La Soledad",
    // Reusa la misma foto de Casa Cuarta Pared — Ana la renombró a
    // "casa cuarta pared.jpg" (antes "lugar clown.jpg", antes "comite.jpg").
    venueImageUrl: "/assets/images/casa%20cuarta%20pared.jpg",
    date: "Jueves 22 oct · 19:30",
    price: "$38.000 COP",
    duracion: "60 minutos, sin intermedio — es un recorrido inmersivo, no hay butacas fijas.",
    restriccionEdad: "+10 años — el recorrido se hace en penumbra y en silencio casi total, lo cual puede incomodar a los niños más pequeños.",
    direccionCompleta: "Calle 60 #9-18, Bogotá",
    curiosidadDelLugar: "Casa Cuarta Pared tiene techos altos y queda prácticamente vacía para este recorrido — esa amplitud es la que le da a la pieza su aire de soledad y misterio, sin necesidad de ningún efecto adicional.",
    contextoBarrio: "Barrio residencial tranquilo, ideal para llegar caminando desde estaciones cercanas.",
    rating: "9.0",
    ratingCount: 71,
    rail: "mas-reservados",
    imageUrl: "/assets/images/La%20casa%20de%20los%20silencios.png",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "La mayoría del teatro inmersivo apuesta por saturar los sentidos; acá se apuesta por vaciarlos — el silencio como material de construcción, no como ausencia. Theaveling la eligió por ir a contracorriente de lo que suele venderse como \"inmersivo\".",
    ficha: {
      presentaciones: "10 funciones desde su estreno en 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, no es una adaptación",
      idioma: "Español (con tramos sin diálogo)",
    },
    artista: {
      nombre: "Colectivo Umbral",
      categoria: "Núcleo de teatro independiente",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/la%20casa.jpg",
      saludo:
        "Somos Colectivo Umbral. Nos obsesiona el silencio como material escénico — construimos piezas donde lo que no se dice pesa tanto como lo que sí.",
    },
    resenas: [
      {
        nombre: "Paula H.",
        rating: "★ 9.2",
        fecha: "Hace 3 días",
        texto:
          "Ojo con el celular — literal, te lo piden apagar del todo, no en silencio, porque cualquier vibración se escucha en la sala.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.7",
        fecha: "Hace 2 semanas",
        texto:
          "Fui sola y fue la mejor decisión, es una experiencia que se vive muy hacia adentro, mejor sin tener que comentarla con nadie al lado.",
      },
      {
        nombre: "Valentina G.",
        rating: "★ 9.1",
        fecha: "Hace 4 semanas",
        texto:
          "Esperaba que 'inmersivo' significara más estímulos, no menos — al principio incomoda el vacío, después se agradece.",
      },
      {
        nombre: "Camilo W.",
        rating: "★ 8.5",
        fecha: "Hace 6 semanas",
        texto:
          "Si te gustó esto, también me gustó Uno a Uno — otra pieza que apuesta por la intimidad en vez del espectáculo.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 9.3",
        fecha: "Hace 3 meses",
        texto:
          "No es apta para claustrofobia leve, el espacio es cerrado y bastante oscuro en tramos largos.",
      },
    ],
  },
  {
    // Ver nota en Curado, arriba — intercambio de posición 2026-09-02.
    id: "cuerpos-en-transito",
    title: "Cuerpos en tránsito: Función Íntima",
    tag: "Performance íntima",
    category: "Performance",
    description:
      "Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo. «Cuerpos en tránsito» dialoga directamente con ese pasado: un montaje sobre cuerpos que atraviesan espacios de resistencia.",
    venue: "Espacio Callejón",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "La Candelaria",
    // 2026-09-04: Ana subió "espacio callejon.jpg" — mismo venue
    // compartido con "La consagración del otoño".
    venueImageUrl: "/assets/images/espacio%20callejon.jpg",
    date: "Sábado 24 oct · 20:30",
    price: "$40.000 COP",
    duracion: "45 minutos, sin intermedio — formato íntimo, aforo reducido.",
    restriccionEdad: "+16 años — la cercanía física entre actores y público es parte del lenguaje de la pieza.",
    direccionCompleta: "Carrera 5 #26-42, Bogotá",
    curiosidadDelLugar: "Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo.",
    contextoBarrio: "Centro histórico de Bogotá, zona mayormente peatonal con calles empedradas.",
    rating: "9.4",
    ratingCount: 88,
    rail: "mas-reservados",
    imageUrl: "/assets/images/Cuerpos%20en%20tr%C3%A1nsito.png",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba. Acá `porQueDescubrir` retoma
    // el mismo dato real del lugar que ya trae `description` (la
    // imprenta clandestina) porque es justo el tipo de argumento
    // curatorial que pide VOICE.md — no hacía falta inventar otro.
    porQueDescubrir:
      "Se hizo específicamente para Espacio Callejón, no se podría montar en cualquier sala: dialoga en vivo con las prensas clandestinas que todavía están expuestas en el vestíbulo. Theaveling la eligió por esa relación directa entre pieza y lugar, poco común en la cartelera actual.",
    ficha: {
      presentaciones: "9 funciones desde su estreno en 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, creada específicamente para Espacio Callejón",
      idioma: "Español",
    },
    artista: {
      nombre: "Tránsito Colectivo",
      categoria: "Plataforma de performance",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/cuerpos%20en%20transito%202.jpg",
      saludo:
        "Somos Tránsito Colectivo. Creamos piezas específicamente para los lugares donde se presentan — no llevamos un montaje de gira, primero escuchamos el espacio.",
    },
    resenas: [
      {
        nombre: "Andrés L.",
        rating: "★ 9.6",
        fecha: "Hace 4 días",
        texto:
          "Pregunta por las prensas de la imprenta clandestina antes de entrar — están en el vestíbulo y le dan otro sentido a toda la función.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 9.1",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola un sábado y terminé conversando con otras personas que también fueron solas, se arma un ambiente lindo antes de entrar.",
      },
      {
        nombre: "Sebastián V.",
        rating: "★ 9.5",
        fecha: "Hace 2 semanas",
        texto:
          "Es corta pero se siente completa, no le sobra ni le falta nada.",
      },
      {
        nombre: "Mariana K.",
        rating: "★ 8.9",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó La casa de los silencios — otra función íntima que no necesita gran producción para pegar fuerte.",
      },
      {
        nombre: "David A.",
        rating: "★ 9.7",
        fecha: "Hace 2 meses",
        texto:
          "El lugar en sí es parte de la experiencia, no es solo un teatro cualquiera con historia bonita en el programa de mano.",
      },
    ],
  },
  {
    id: "fronteras-difusas",
    title: "Fronteras Difusas: Retrospectiva Analógica",
    tag: "Cine documental",
    category: "Cine",
    description:
      "Ciclo de cine experimental en formato analógico que cuestiona los límites del relato de no-ficción y la materialidad del soporte fílmico.",
    // 2026-09-04, a pedido de Ana ("no me gusta la descripcion del
    // espacio de mataderos, ponle tonala... que si era una cinemateca
    // q habia en bogo pero creo q con la pandemia murio"): "Cineteca
    // Matadero" (venue inventado) se reemplaza por Cine Tonalá, un
    // cine-bar real y actualmente en funcionamiento en Bogotá (barrio
    // La Merced, formato mexicano que combina 2 salas de cine con bar
    // y restaurante — confirmado vía cinetonala.co, sigue operando).
    venue: "Cine Tonalá",
    city: "Bogotá",
    venueCategoria: "Cine-bar",
    venueBarrio: "La Merced",
    // 2026-09-04: Ana subió "tonala.jpg" para el venue.
    venueImageUrl: "/assets/images/tonala.jpg",
    date: "Viernes 30 oct · 20:30",
    price: "$25.000 COP",
    // Función de cine en sala — butacas numeradas típicas de este formato.
    asientoAsignado: true,
    duracion: "Programación de 100 minutos en total, incluye una breve introducción curatorial antes de la primera proyección.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 6 #35-37, Bogotá",
    curiosidadDelLugar: "Cine Tonalá llegó desde México con un formato poco común en Bogotá: dos salas de cine (Luis Ospina y Kubrick) que conviven con un bar y un restaurante en el mismo edificio — el boleto se compra en línea y se entra directo a sala, sin filas.",
    contextoBarrio: "La Merced, un sector residencial tranquilo cerca del centro, con varias casas antiguas convertidas en oficinas y espacios culturales.",
    rating: "9.1",
    ratingCount: 42,
    rail: "mas-reservados",
    // 2026-09-02: Ana reemplazó la imagen en su carpeta — quedó en .avif
    // (antes .png).
    imageUrl: "/assets/images/Fronteras%20Difusas.avif",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "Todo el ciclo está rodado en formato analógico, sin pasar por digital en ningún punto — el grano, los rayones y los errores de revelado son parte del argumento, no un defecto a corregir. Theaveling lo eligió por sostener esa postura hasta el final, en un momento donde casi todo el documental ya es 100% digital.",
    ficha: {
      presentaciones: "3 funciones (ciclo limitado)",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "selección curada de cortometrajes existentes, no son piezas producidas para el ciclo",
      idioma: "Español / sin diálogo según el corto",
    },
    artista: {
      nombre: "Cine Tonalá — Curaduría",
      categoria: "Programa curatorial",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/fronteras.jpg",
      saludo:
        "Somos el equipo de curaduría de Cine Tonalá. Programamos cine que no encuentra pantalla en ningún otro lado de la ciudad.",
    },
    resenas: [
      {
        nombre: "Carolina N.",
        rating: "★ 9.3",
        fecha: "Hace 2 días",
        texto:
          "Son solo 3 funciones, no lo dejes para después — cuando se agota no hay reposición.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.8",
        fecha: "Hace 6 días",
        texto:
          "Fui sola un sábado de tarde y la sala tenía buen ambiente, gente que realmente quería estar ahí, no de paso.",
      },
      {
        nombre: "Laura B.",
        rating: "★ 9.2",
        fecha: "Hace 3 semanas",
        texto:
          "El grano y los rayones del análogo al principio parecen error técnico — no lo son, es parte del argumento.",
      },
      {
        nombre: "Julián T.",
        rating: "★ 8.6",
        fecha: "Hace 5 semanas",
        texto:
          "Si te gustó esto, también me gustó Noche de Cortos: Ciudad Invisible a 5 Km — otro programa curado con mirada bien específica.",
      },
      {
        nombre: "Santiago P.",
        rating: "★ 9.4",
        fecha: "Hace 3 meses",
        texto:
          "No es cine convencional, si vas esperando una narrativa clara te va a costar. Va mejor si sueltas esa expectativa.",
      },
    ],
  },
  // Las 3 siguientes son contenido inventado (no cosechado de Figma),
  // agregadas 2026-09-02 a pedido de Ana para ampliar el riel — mismo
  // criterio de invención que "Comité del Fracaso: Ensayo Abierto".
  {
    id: "trance-ritual-sonoro",
    title: "Trance: Ritual Sonoro Colectivo",
    tag: "Música experimental",
    category: "Música",
    description:
      "Un set en vivo de música electroacústica pensado como ritual colectivo: capas de sintetizadores modulares y percusión ancestral que se construyen en tiempo real, sin repetir nunca el mismo set dos veces.",
    venue: "Auditorio Fragua",
    city: "Bogotá",
    venueCategoria: "Auditorio",
    venueBarrio: "Teusaquillo",
    // 2026-09-04: Ana subió "fragua.jpg" para el venue.
    venueImageUrl: "/assets/images/fragua.jpg",
    date: "Viernes 6 nov · 21:30",
    price: "$38.000 COP",
    duracion: "90 minutos continuos, sin cortes ni intermedio — el set está pensado para escucharse como una sola pieza.",
    restriccionEdad: "+16 años — hay luces estroboscópicas y volumen alto sostenido; no recomendado para personas fotosensibles.",
    direccionCompleta: "Calle 26 #13-50, Bogotá",
    // 2026-09-04, a pedido de Ana ("todos como que dicen una curiosidad
    // antigua... podria tambien ser una curiosidad actual, por ejemplo
    // cosas interesantes o grupos muy famosos que han pasado por ahi, o
    // obras o piezas que han tenido mucho exito... equilibra"): la
    // mayoría de los 15 lugares del catálogo tenían la curiosidad
    // enfocada solo en origen/historia del edificio — se balancean 7 de
    // ellos (este es uno) agregando una segunda frase con un dato
    // actual (compañías que pasan hoy, funciones agotadas, etc.), sin
    // tocar la primera frase histórica. El resto del catálogo se deja
    // como estaba — no todos necesitan el mismo tratamiento, es
    // "equilibrar" el conjunto, no aplicar la fórmula a los 15.
    curiosidadDelLugar: "El Auditorio Fragua fue diseñado originalmente como sala de ensayo para orquesta — la acústica sigue siendo el motivo por el que lo eligen para música en vivo. Hoy es uno de los pocos espacios de la ciudad donde la escena de música modular arma sesiones completas sin refuerzo de sonido adicional, gracias a esa acústica original.",
    contextoBarrio: "Bien conectado por transporte público, cerca de otros espacios culturales.",
    rating: "9.0",
    ratingCount: 27,
    rail: "mas-reservados",
    // 2026-09-04: la carpeta de assets de ESTE proyecto (no la de Ana)
    // estaba desactualizada y no tenía el .webp real — se llegó a
    // cambiar esta referencia al .jpg viejo por error. Ya está corregido:
    // el .webp real se trajo de la carpeta de Ana y vuelve a ser la
    // referencia correcta, tal cual estaba.
    imageUrl: "/assets/images/trance%20ritual.webp",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "No hay dos sets iguales: se construye en tiempo real, capa sobre capa, sin partitura ni repetición programada. Theaveling la eligió por ese riesgo — nadie en la sala, ni siquiera quien toca, sabe bien a dónde va a llegar el set.",
    ficha: {
      presentaciones: "4 sesiones desde 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "set improvisado en vivo, no se repite entre sesiones",
      idioma: "N/A (sin diálogo)",
    },
    artista: {
      nombre: "Xolo Modular",
      categoria: "Proyecto sonoro independiente",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // primera pieza que prueba `artista.imageUrl` en ArtistSpaceCard
      // (antes solo existía el placeholder). Ver esa nota en el
      // componente y en el tipo `Experience` de arriba.
      imageUrl: "/assets/images/trance%20artistas.jpg",
      saludo:
        "Somos Xolo Modular. Tocamos en vivo, sin partituras — cada sesión es la única vez que va a existir ese set exacto.",
    },
    resenas: [
      {
        nombre: "Manuela S.",
        rating: "★ 9.2",
        fecha: "Hace 5 días",
        texto:
          "Cada sesión es distinta de verdad, no es marketing — fui dos veces y no se pareció en nada la una a la otra.",
      },
      {
        nombre: "Camilo W.",
        rating: "★ 8.7",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola y terminé bailando igual, nadie te mira raro por ir sin grupo, la sala entera se mueve.",
      },
      {
        nombre: "Andrea M.",
        rating: "★ 9.1",
        fecha: "Hace 2 semanas",
        texto:
          "Si te gustó esto, también me gustó Sesión Subterránea — otro ritual colectivo, distinto formato.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.5",
        fecha: "Hace 1 mes",
        texto:
          "Llega temprano si quieres estar cerca de los sintetizadores, el sonido pega distinto ahí.",
      },
      {
        nombre: "Paula H.",
        rating: "★ 9.3",
        fecha: "Hace 6 semanas",
        texto:
          "No hay descanso ni intermedio, son casi 90 minutos seguidos, ve al baño antes de entrar.",
      },
    ],
  },
  {
    id: "antigona-ahora",
    title: "Antígona, Ahora: Tragedia Urbana",
    tag: "Tragedia contemporánea",
    category: "Teatro",
    description:
      "Una relectura de Sófocles trasladada a un contexto urbano contemporáneo: la misma pregunta sobre la ley y la desobediencia, dicha con el lenguaje de hoy.",
    // Real, pero de Medellín (barrio Prado), no de Bogotá — a pedido de
    // Ana 2026-09-02, se usa igual aunque `city` siga fijo en "Bogotá"
    // (mismo caso ya aceptado con "Espacio Callejón").
    venue: "Teatro Matacandelas",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "La Macarena",
    // 2026-09-04: Ana subió "matacandelas.jpg" para el venue.
    venueImageUrl: "/assets/images/matacandelas.jpg",
    date: "Jueves 12 nov · 20:00",
    price: "$44.000 COP",
    // Producción teatral formal en sala — butacas típicas.
    asientoAsignado: true,
    duracion: "85 minutos, sin intermedio.",
    restriccionEdad: "+14 años — por la carga temática y dramática del texto, más que por contenido explícito.",
    direccionCompleta: "Carrera 24 #63-15, Bogotá",
    curiosidadDelLugar: "Teatro Matacandelas lleva el nombre de la compañía fundadora, activa en el circuito independiente desde hace más de tres décadas.",
    contextoBarrio: "Barrio tranquilo con oferta gastronómica cerca del teatro.",
    rating: "9.2",
    ratingCount: 164,
    rail: "mas-reservados",
    imageUrl: "/assets/images/antigona.jpg",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba. `ciudad` del artista queda en
    // Medellín (no Bogotá) — mismo criterio ya aceptado para `venue` en
    // esta pieza (ver nota arriba, junto a `venue`).
    porQueDescubrir:
      "La pregunta de Antígona —¿qué ley pesa más, la del estado o la propia?— se traslada acá a un conflicto reconocible hoy: la desobediencia civil urbana. Theaveling la eligió por no quedarse en la referencia clásica como adorno, sino usarla para hablar de algo actual.",
    ficha: {
      presentaciones: "15 funciones desde su estreno en 2023",
      festivales: "Festival Internacional de Teatro de Manizales 2024",
      premios: "sin premios todavía",
      origen: "adaptación libre de \"Antígona\" de Sófocles",
      idioma: "Español",
    },
    // 2026-09-04, a pedido de Ana: separar lugar de artista — ver
    // nota completa en "las-tetas-de-tiresias", primera de esta
    // ronda. Acá el caso era el más literal: `artista.nombre` era
    // idéntico a `venue` ("Teatro Matacandelas" y "Teatro
    // Matacandelas"). Se separa en un elenco propio para esta puesta,
    // con nombre de quien dirige.
    artista: {
      nombre: "Colectivo Ágora",
      categoria: "Elenco y dirección",
      ciudad: "Medellín, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/antigona%202.jpg",
      saludo:
        "Somos Colectivo Ágora, el elenco de esta versión de Antígona. La dirige Tomás Rincón — llevamos dos años trabajando la tragedia griega desde el conflicto urbano de hoy, hasta que la pregunta de Antígona deja de ser un mito y se vuelve una decisión política concreta.",
    },
    resenas: [
      {
        nombre: "Esteban Z.",
        rating: "★ 9.4",
        fecha: "Hace 3 días",
        texto:
          "Ojo que el venue queda un poco lejos del centro, calcula tiempo extra para llegar.",
      },
      {
        nombre: "Valentina G.",
        rating: "★ 8.9",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola entre semana y no hubo ningún problema, la función arranca puntual así que no llegues sobre la hora.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 9.3",
        fecha: "Hace 3 semanas",
        texto:
          "La traslación a un conflicto urbano actual está muy bien lograda, no se siente forzada.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 8.7",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Las Tetas de Tiresias — otra relectura de un clásico que no le tiene miedo al texto original.",
      },
      {
        nombre: "Camila R.",
        rating: "★ 9.5",
        fecha: "Hace 2 meses",
        texto:
          "Sabía la historia de Antígona de memoria y aun así me sorprendió cómo la aterrizan acá.",
      },
    ],
  },

  // — Descubrimientos (7, sin precio/rating visible en Home) —
  // Contenido inventado (no cosechado de Figma), agregada 2026-09-02 a
  // pedido de Ana en reemplazo de "Materia y memoria: Taller de técnica
  // mixta" (retirada) — quería una experiencia de teatro musical, de
  // primera en el scroll.
  {
    // 2026-09-02: cadena completa de este lugar en el riel — "Materia y
    // memoria: Taller" → "Bajo Tierra: Musical de Cámara" (idea
    // rechazada) → "Voces del margen" (de paso por acá, salió del
    // prototipo al intercambiarse con "Uno a Uno" en Más reservados —
    // "Uno a Uno" después volvió a moverse, ver nota en su entrada, tercer
    // lugar de este mismo riel) → "A Chorus Line: Historias Reales de
    // Bogotá", pedido explícito de Ana de que el primer lugar de
    // Descubrimientos fuera un musical real.
    // Verificado: "A Chorus Line" es un musical real de Broadway (1975,
    // dirección y coreografía de Michael Bennett, libro de James Kirkwood
    // Jr. y Nicholas Dante, música de Marvin Hamlisch) — Premio Pulitzer
    // de Teatro 1976. La premisa original YA se basaba en historias reales
    // de bailarines de Broadway entrevistados por Bennett; esta versión
    // traslada ese mismo mecanismo a bailarines reales de la escena
    // bogotana actual, sin cambiar el concepto de fondo.
    id: "a-chorus-line",
    title: "A Chorus Line: Historias Reales de Bogotá",
    tag: "Musical",
    category: "Teatro",
    description:
      "Diecisiete bailarines compiten por ocho cupos en el coro de un musical de Broadway. El director los pone en una sola fila y les pide contar, en primera persona, por qué necesitan ese trabajo — la premisa de 1975 se mantiene intacta, solo que ahora son bailarines reales de la escena bogotana contando sus propias historias, en un escenario vacío, sin vestuario ni escenografía de por medio.",
    venue: "Sala Seki Sano",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "Centro",
    // 2026-09-04: Ana subió "seki sano.jpg" para el venue.
    venueImageUrl: "/assets/images/seki%20sano.jpg",
    date: "Miércoles 18 nov · 20:00",
    price: "$42.000 COP",
    // Producción teatral formal tipo testimonial en sala — butacas típicas.
    asientoAsignado: true,
    duracion: "105 minutos, con un intermedio de 15 minutos.",
    restriccionEdad: "+12 años — algunas escenas tocan temas adultos propios del musical original, sin ser explícitas.",
    direccionCompleta: "Calle 12 #5-40, Bogotá",
    // 2026-09-04, a pedido de Ana: balance historia/actualidad — ver
    // nota completa en "trance-ritual-sonoro".
    curiosidadDelLugar: "Sala Seki Sano rinde homenaje al director de teatro que impulsó buena parte del teatro experimental latinoamericano del siglo XX. Hoy sigue siendo una de las salas más buscadas por compañías de teatro musical independiente para montar temporadas largas.",
    contextoBarrio: "Centro de la ciudad, con varias opciones de transporte y parqueaderos cercanos.",
    rating: "9.1",
    ratingCount: 121,
    rail: "descubrimientos",
    // 2026-09-04: este campo apuntaba a "a chorus.png", que la carpeta
    // de assets de ESTE proyecto (no la de Ana) no tenía — de ahí el
    // 404. Al corregirlo se cometieron 2 errores seguidos: 1) se apuntó
    // por error a "A chorus line.jpg" (esa es la foto del ARTISTA, más
    // abajo — Ana: "esa es la de artistas"), confundiendo las 2 fotos;
    // 2) esa foto además era un JPEG progresivo de 6000×4000 (2.3MB),
    // por eso se optimizó (queda esa optimización, no hace daño). Ya
    // corregido de verdad: el campo vuelve a apuntar a "a chorus.png"
    // (la foto de la EXPERIENCIA — la función en el escenario), traída
    // ahora de la carpeta real de Ana. "A chorus line.jpg" (la foto de
    // grupo del elenco) se queda solo en `artista.imageUrl`, más abajo,
    // que es donde siempre debió estar.
    imageUrl: "/assets/images/a%20chorus.png",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba. Acá los datos de la obra
    // ORIGINAL (Broadway 1975, Pulitzer 1976) sí son reales — ya estaban
    // verificados en el comentario de esta pieza, más arriba — lo
    // inventado es solo la puesta local (compañía, cantidad de funciones).
    porQueDescubrir:
      "La premisa de 1975 ya era real —bailarines de Broadway contando sus propias historias—, así que esta versión no tuvo que inventar nada: solo cambió a quién se le pregunta. Son bailarines reales de la escena bogotana, sin vestuario ni escenografía, contando por qué necesitan ese trabajo.",
    ficha: {
      presentaciones: "6 funciones desde su estreno en 2025",
      festivales: "sin festivales todavía",
      premios: "Premio Pulitzer de Teatro 1976 (obra original de Broadway)",
      origen: "adaptación de \"A Chorus Line\" (Broadway, 1975, dirección de Michael Bennett)",
      idioma: "Español",
    },
    // 2026-09-04, a pedido de Ana: separar lugar de artista — ver
    // nota completa en "las-tetas-de-tiresias", primera de esta
    // ronda.
    artista: {
      nombre: "Compañía Contraluz",
      categoria: "Productora de teatro musical independiente",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/A%20chorus%20line.jpg",
      saludo:
        "Somos Compañía Contraluz. Trasladamos el mecanismo original de 'A Chorus Line' a bailarines reales de la escena bogotana — la dirige Felipe Nieto, que pasó meses entrevistando a los diecisiete intérpretes antes de escribir una sola línea.",
    },
    resenas: [
      {
        nombre: "Andrés L.",
        rating: "★ 9.3",
        fecha: "Hace 2 días",
        texto:
          "Compra con tiempo, se llena rápido los viernes — es de las funciones más pedidas del catálogo.",
      },
      {
        nombre: "Mariana K.",
        rating: "★ 8.8",
        fecha: "Hace 5 días",
        texto:
          "Fui sola y terminé llorando en la fila de salida, las historias son reales de verdad, no actuadas de más.",
      },
      {
        nombre: "Sebastián V.",
        rating: "★ 9.2",
        fecha: "Hace 2 semanas",
        texto:
          "No hay vestuario ni escenografía, todo pasa en un escenario vacío — al principio se siente raro, después es lo mejor que tiene.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 8.6",
        fecha: "Hace 4 semanas",
        texto:
          "Si te gustó esto, también me gustó Comité del Fracaso — otra pieza que se construye desde las historias reales del elenco.",
      },
      {
        nombre: "David A.",
        rating: "★ 9.4",
        fecha: "Hace 2 meses",
        texto:
          "Sabía la premisa del musical original y la versión local la respeta sin copiarla, se siente propia.",
      },
    ],
  },
  {
    // 2026-09-02: Ana pidió que "Uno a Uno" pasara a este riel — a cambio
    // de que "La casa de los silencios" pasara a Más reservados (ver esa
    // entrada más arriba). Contenido sin cambios, solo cambia `rail`.
    // Después, mismo día, Ana pidió intercambiar posición con "Clase de
    // improvisación del ritmo escénico" (ver esa entrada, abajo) — quedó
    // acá, segundo lugar.
    id: "uno-a-uno",
    title: "Uno a Uno: Función a Puerta Cerrada",
    tag: "Función unipersonal",
    category: "Performance",
    description:
      "Un actor actúa solo para una persona a la vez: sesiones de 8 minutos, la sala vacía excepto por esos dos. Sin público, sin repetición — cada función cambia según quién entra.",
    venue: "Cuarto 7",
    city: "Bogotá",
    venueCategoria: "Espacio íntimo",
    venueBarrio: "Chapinero Alto",
    // 2026-09-04: Ana subió "cuarto 7.jpg" para el venue.
    venueImageUrl: "/assets/images/cuarto%207.jpg",
    date: "Sábado 21 nov · 14:00–20:00 (sesiones cada 15 min)",
    price: "$60.000 COP",
    duracion: "Cada función dura 8 minutos — eres tú y el actor, nadie más en la sala.",
    restriccionEdad: "+18 años — es una función a puerta cerrada, un espectador a la vez.",
    direccionCompleta: "Calle 45 #14-10, Bogotá",
    curiosidadDelLugar: "Cuarto 7 no es un nombre curatorial — es literalmente el número de la habitación donde ocurre la función, en un edificio que antes fue residencia de huéspedes.",
    contextoBarrio: "Zona residencial discreta — conviene revisar bien la dirección antes de salir.",
    rating: "9.3",
    ratingCount: 38,
    rail: "descubrimientos",
    imageUrl: "/assets/images/voces%20del%20margen%202.jpg",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "Ocho minutos, una sola persona en la sala, sin repetición posible: cada función cambia según quién entra, así que nadie más va a ver exactamente lo que ve esa persona. Theaveling la eligió por llevar la intimidad al extremo, no como gimmick sino como estructura.",
    ficha: {
      presentaciones: "más de 40 sesiones individuales desde 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, creada específicamente para el formato uno a uno",
      idioma: "Español",
    },
    // 2026-09-04, a pedido de Ana: separar lugar de artista — ver
    // nota completa en "las-tetas-de-tiresias", primera de esta
    // ronda. Acá con más razón: la pieza es UN actor actuando solo
    // para una persona a la vez, así que el artista pasa de ser
    // "Estudio Cuarto 7" (nombre calcado del venue "Cuarto 7") a ser
    // esa persona, con nombre propio — no una compañía ni un espacio.
    // 2026-09-04, ajuste a pedido de Ana sobre el cambio anterior: le
    // gustó que el artista fuera una persona (Mateo) y no una
    // compañía calcada del venue, pero pidió sumar el grupo del que
    // hace parte — todos los implicados en montar la función, no solo
    // él en escena — y ponerle nombre. Se agrega "Ensayo Cero" como
    // el colectivo que dirige/produce/monta cada sesión con él.
    artista: {
      nombre: "Mateo Salcedo",
      categoria: "Actor — Ensayo Cero",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/uno%20a%20uno.jpg",
      saludo:
        "Soy Mateo Salcedo, actor. Hago esta función solo, ocho minutos a la vez, para una persona — pero no la armé solo: soy parte de Ensayo Cero, el colectivo que dirige, produce y monta cada sesión conmigo. Cada función depende completamente de quién se sienta frente a mí.",
    },
    resenas: [
      {
        nombre: "Paula H.",
        rating: "★ 9.5",
        fecha: "Hace 1 día",
        texto:
          "Llega con tiempo, las sesiones son cada 15 minutos y si te atrasas pierdes tu cupo, no hay reposición.",
      },
      {
        nombre: "Camilo W.",
        rating: "★ 9.0",
        fecha: "Hace 4 días",
        texto:
          "Es literalmente para ir sola/o — está pensada para una sola persona en la sala, no puedes llevar acompañante.",
      },
      {
        nombre: "Laura B.",
        rating: "★ 9.4",
        fecha: "Hace 2 semanas",
        texto:
          "Ocho minutos suenan a poco pero se sienten mucho más largos, en el buen sentido, no alcanza el tiempo para pensar en otra cosa.",
      },
      {
        nombre: "Julián T.",
        rating: "★ 8.8",
        fecha: "Hace 5 semanas",
        texto:
          "Si te gustó esto, también me gustó Comité del Fracaso — otra pieza que cambia según quién esté en la sala.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 9.6",
        fecha: "Hace 3 meses",
        texto:
          "No sabía qué esperar y esa fue la gracia, no leas mucho antes de ir, mejor entrar en blanco.",
      },
    ],
  },
  {
    // 2026-09-02: intercambió posición con "Uno a Uno" (arriba) — a
    // pedido de Ana, pasó de segundo a tercer lugar acá.
    id: "clase-improvisacion-ritmo",
    title: "Clase de improvisación del ritmo escénico",
    tag: "Laboratorio teatral",
    category: "Talleres",
    description:
      "Taller práctico de exploración corporal donde el ritmo, la escucha colectiva y el impulso guían la creación escénica en tiempo real. Sin guión, sin partitura: solo el cuerpo y el instante.",
    venue: "Centro Danza Canal",
    city: "Bogotá",
    venueCategoria: "Centro de danza",
    venueBarrio: "Usaquén",
    // 2026-09-04: Ana subió "danza canal.jpg" para el venue.
    venueImageUrl: "/assets/images/danza%20canal.jpg",
    date: "Viernes 27 nov · 18:00",
    price: "$30.000 COP",
    duracion: "2 horas, con una pausa a mitad de la sesión.",
    restriccionEdad: "+16 años — es un taller participativo pensado para adultos, con o sin experiencia previa en movimiento.",
    direccionCompleta: "Carrera 11 #93-20, Bogotá",
    // 2026-09-04, a pedido de Ana ("no le pongas la historia del radio,
    // solo pon que es una sala muy amplia, que es muy solicitada por la
    // comodidad de sus espacios, y resalta como las cualidades fisicas,
    // no pongas nada historico"): se quita por completo el origen de
    // galpón de radio (ya no aplica el criterio de "balance
    // historia/actualidad" acá — Ana pidió explícitamente solo lo
    // físico/actual, nada de historia).
    curiosidadDelLugar: "Centro Danza Canal tiene una de las salas más amplias de la ciudad para este tipo de trabajo — techos altos, piso flotante y buena ventilación natural. Es de los espacios más solicitados por compañías y talleristas, justamente por la comodidad de sus salas.",
    contextoBarrio: "Zona bien conectada, con varios estudios de danza y música cerca.",
    rating: "8.9",
    ratingCount: 63,
    rail: "descubrimientos",
    imageUrl:
      "/assets/images/Clase%20de%20improvisaci%C3%B3n%20del%20ritmo%20esc%C3%A9nico.png",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba. Es un taller, no una obra —
    // `ficha` usa N/A en los campos que no aplican (festivales/premios)
    // en vez de forzar un valor inventado que no tendría sentido.
    porQueDescubrir:
      "Sin guión ni partitura: el taller se arma con lo que el cuerpo y la escucha colectiva van proponiendo en el momento. Theaveling lo eligió para quienes quieren entender cómo se construye una escena antes de verla terminada, no solo consumirla ya resuelta.",
    ficha: {
      presentaciones: "clase abierta mensual, desde 2024",
      festivales: "N/A — es un taller, no una obra",
      premios: "N/A",
      origen: "formato propio del espacio, no es una reposición",
      idioma: "Español",
    },
    artista: {
      nombre: "Centro Danza Canal",
      categoria: "Espacio de formación",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/improvisacion.jpg",
      saludo:
        "Somos Centro Danza Canal, un espacio de formación en danza y teatro físico. Abrimos nuestras clases a quien quiera ver cómo se construye una escena, no solo el resultado final.",
    },
    resenas: [
      {
        nombre: "Carolina N.",
        rating: "★ 9.1",
        fecha: "Hace 6 días",
        texto:
          "Es una clase abierta, no una función — llega con ropa cómoda, se participa, no solo se mira.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.6",
        fecha: "Hace 2 semanas",
        texto:
          "Fui sola sin experiencia previa en danza y me sentí bienvenida todo el rato, no hace falta saber nada de antemano.",
      },
      {
        nombre: "Andrea M.",
        rating: "★ 9.0",
        fecha: "Hace 4 semanas",
        texto:
          "No hay dos clases iguales, se arma según quién llegue ese día, vale la pena repetir más de una vez.",
      },
      {
        nombre: "Santiago P.",
        rating: "★ 8.4",
        fecha: "Hace 6 semanas",
        texto:
          "Si te gustó esto, también me gustó Trance: Ritual Sonoro Colectivo — otro formato que se construye en tiempo real.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 9.2",
        fecha: "Hace 2 meses",
        texto:
          "Es mensual, revisa bien la fecha porque no hay sesión todas las semanas.",
      },
    ],
  },
  {
    id: "pelicula-archivo-22",
    title: "Película: Archivo 22, Función Nocturna",
    tag: "Cineclub",
    category: "Cineclub",
    description:
      "Proyecciones de cine experimental nocturno que cuestionan la narrativa lineal y redefinen la experiencia cinematográfica.",
    venue: "Cine Club El Muro",
    city: "Bogotá",
    venueCategoria: "Cineclub",
    venueBarrio: "Galerías",
    // 2026-09-04: Ana subió "el muro.jpg" para el venue (avisó que
    // reemplazó el archivo — mismo nombre, contenido actualizado).
    venueImageUrl: "/assets/images/el%20muro.jpg",
    date: "Jueves 3 dic · 21:00",
    price: "$25.000 COP",
    // Función de cineclub en sala — butacas numeradas típicas de este formato.
    asientoAsignado: true,
    duracion: "78 minutos de proyección, más una conversación breve al final con el cineclub.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 53 #22-11, Bogotá",
    curiosidadDelLugar: "Cine Club El Muro proyecta sobre una pared literal, sin telón — de ahí el nombre, según cuentan quienes lo fundaron.",
    contextoBarrio: "Barrio con vida nocturna activa, buena oferta de café y comida después de función.",
    rating: "8.7",
    ratingCount: 51,
    rail: "descubrimientos",
    // 2026-09-02: Ana reemplazó la imagen en su carpeta — el nombre real
    // del archivo nuevo es "Pelicula_ Archivo 22..jpg" (con el punto
    // final duplicado, no es un typo mío). Reemplaza al "archivo  22 2.jpg"
    // que se usaba antes.
    // 2026-09-04: la carpeta de assets de ESTE proyecto (no la de Ana)
    // estaba desactualizada y no tenía el .jpg real — se llegó a cambiar
    // esta referencia a un .png viejo por error. Ya está corregido: el
    // .jpg real (el que describe el comentario de arriba) se trajo de la
    // carpeta de Ana y vuelve a ser la referencia correcta.
    imageUrl: "/assets/images/Pelicula_%20Archivo%2022..jpg",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "Función nocturna, sin sinopsis ni tráiler previo — se entra sin saber bien qué se va a ver, a propósito. Theaveling la eligió por resistirse a la narrativa lineal, incluso en cómo se presenta antes de empezar.",
    ficha: {
      presentaciones: "función mensual, desde 2024",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "programación curada, películas de archivo (no es producción propia)",
      idioma: "Variable según la función",
    },
    artista: {
      nombre: "Cine Club El Muro — Curaduría",
      categoria: "Programa curatorial",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/archivos%2022%20funcion%20artistas.jpg",
      saludo:
        "Somos Cine Club El Muro. Programamos cine experimental una vez al mes, sin sinopsis previa — preferimos que entres sin saber bien qué vas a ver.",
    },
    resenas: [
      {
        nombre: "Felipe O.",
        rating: "★ 8.9",
        fecha: "Hace 3 días",
        texto:
          "No busques trailer ni sinopsis antes de ir, literalmente no existen a propósito, déjate sorprender.",
      },
      {
        nombre: "Valentina G.",
        rating: "★ 8.4",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola un viernes de noche, el ambiente del cineclub es muy tranquilo, nadie te mira raro por ir sin compañía.",
      },
      {
        nombre: "Esteban Z.",
        rating: "★ 8.8",
        fecha: "Hace 3 semanas",
        texto:
          "Es función mensual, no semanal — si te la pierdes tienes que esperar bastante para la próxima.",
      },
      {
        nombre: "Camila R.",
        rating: "★ 8.2",
        fecha: "Hace 5 semanas",
        texto:
          "Si te gustó esto, también me gustó Fronteras Difusas — otro programa que no te dice mucho antes de empezar.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 9.0",
        fecha: "Hace 3 meses",
        texto:
          "El formato nocturno le suma bastante, no sería lo mismo de día.",
      },
    ],
  },
  {
    id: "materia-y-memoria",
    title: "Materia y memoria: Lectura Táctil del Tiempo",
    tag: "Lectura dramática",
    category: "Lecturas dramáticas",
    description:
      "Instalación multisensorial que conecta materiales orgánicos con recuerdos colectivos. Una exploración táctil del tiempo.",
    venue: "La Casa Encendida",
    city: "Bogotá",
    venueCategoria: "Centro cultural",
    venueBarrio: "La Macarena",
    // 2026-09-04: Ana subió "la casa encendida.jpg" para el venue.
    venueImageUrl: "/assets/images/la%20casa%20encendida.jpg",
    date: "Miércoles 9 dic · 19:00",
    price: "Gratis",
    duracion: "55 minutos, sin intermedio.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Ronda del Río Arzobispo, Bogotá",
    // 2026-09-04, a pedido de Ana: balance historia/actualidad — ver
    // nota completa en "trance-ritual-sonoro".
    curiosidadDelLugar: "La Casa Encendida ocupa una casona restaurada que perteneció a una familia de artesanos — todavía se ven azulejos originales en el zaguán. Cada año agota localidades con su ciclo de piezas sobre memoria y cuerpo, uno de los más esperados de la temporada.",
    contextoBarrio: "Zona verde y tranquila, cerca de la Universidad Nacional.",
    rating: "8.9",
    ratingCount: 19,
    rail: "descubrimientos",
    imageUrl: "/assets/images/Materia%20y%20memoria.png",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "Es gratis y de entrada única: no hay funciones de reposición. Conecta materiales orgánicos —tierra, cera, fibra— con recuerdos colectivos a través del tacto, no de la vista. Theaveling la eligió por ser una de las pocas experiencias sensoriales del catálogo que no depende de mirar.",
    ficha: {
      presentaciones: "función única (evento especial)",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "instalación original, creada específicamente para La Casa Encendida",
      idioma: "Español",
    },
    // 2026-09-04, a pedido de Ana: separar lugar de artista — ver
    // nota completa en "las-tetas-de-tiresias", primera de esta
    // ronda. La instalación se creó específicamente para este espacio
    // (ver `ficha.origen`), pero eso no la vuelve "programación de La
    // Casa Encendida" — tiene autora propia.
    artista: {
      nombre: "Renata Duque",
      categoria: "Artista multisensorial",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx). Ana avisó que "no quedó" con el
      // archivo original: es una foto panorámica de concierto con mucho
      // espacio negro alrededor del grupo, y el avatar circular (96px,
      // object-cover) recortaba justo en ese vacío en vez de las caras.
      // Se generó un recorte cuadrado centrado en el grupo (mismo
      // archivo, sin alterar el original en la carpeta de Ana) para que
      // el avatar muestre las caras y no el fondo negro.
      imageUrl: "/assets/images/materia%20y%20memoria%20recorte.jpg",
      saludo:
        "Soy Renata Duque. Trabajo con materiales orgánicos —tierra, cera, fibra— como disparadores de memoria colectiva; esta instalación se recorre con las manos, no con los ojos.",
    },
    resenas: [
      {
        nombre: "Mariana K.",
        rating: "★ 9.1",
        fecha: "Hace 4 días",
        texto:
          "Es gratis y de entrada única, no hay repetición — si te interesa, no lo dejes para después.",
      },
      {
        nombre: "Andrés L.",
        rating: "★ 8.6",
        fecha: "Hace 1 semana",
        texto:
          "Fui sola y la experiencia es bastante táctil, te invitan a participar con las manos, ven con esa disposición.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 9.0",
        fecha: "Hace 2 semanas",
        texto:
          "No es una obra para sentarse a ver, hay que moverse por el espacio, avisa si tienes alguna limitación de movilidad.",
      },
      {
        nombre: "David A.",
        rating: "★ 8.4",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Uno a Uno — otra experiencia pensada para vivirse muy de cerca.",
      },
      {
        nombre: "Sebastián V.",
        rating: "★ 9.2",
        fecha: "Hace 2 meses",
        texto:
          "Al ser gratis pensé que iba a ser menor producción, y no, está muy bien cuidada.",
      },
    ],
  },
  // Las 2 siguientes son contenido inventado (no cosechado de Figma),
  // agregadas 2026-09-02 a pedido de Ana para ampliar el riel — mismo
  // criterio de invención que "Comité del Fracaso: Ensayo Abierto".
  {
    id: "noche-de-cortos-ciudad-invisible",
    title: "Noche de Cortos: Ciudad Invisible a 5 Km",
    tag: "Cine local",
    category: "Cine local",
    description:
      "Una selección de cortometrajes hechos por realizadores locales, todos rodados a menos de cinco kilómetros de la sala donde se proyectan.",
    venue: "Cinemateca del Parque",
    city: "Bogotá",
    venueCategoria: "Cinemateca",
    venueBarrio: "Teusaquillo",
    // 2026-09-04: Ana subió "del parque.jpg" para el venue.
    // 2026-09-04: Ana reemplazó el archivo — quedó como "del parque
    // (2).jpg" (el sistema le agregó el "(2)" al no sobrescribir el
    // anterior).
    venueImageUrl: "/assets/images/del%20parque%20(2).jpg",
    date: "Martes 15 dic · 19:30",
    price: "$20.000 COP",
    // Función de cortometrajes en sala — butacas numeradas típicas de este formato.
    asientoAsignado: true,
    duracion: "Programación de 85 minutos, con la presencia de algunos de los realizadores al final.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 6 #35-22, Bogotá",
    // 2026-09-04, a pedido de Ana: balance historia/actualidad — ver
    // nota completa en "trance-ritual-sonoro". Acá el dato actual es un
    // guiño meta: la propia serie de esta pieza ("Noche de Cortos")
    // lleva varias ediciones agotando boletería en este mismo lugar.
    // 2026-09-04, a pedido de Ana ("puedes poner que qued en un
    // circuito institucional de artes, de ahi sus espacios amplios y
    // perfectos para mezclar performance con audiovisual"): se agrega
    // ese dato como explicación de por qué el edificio tiene el
    // formato que tiene (espacios amplios y flexibles), entre la
    // historia del edificio y el dato actual de "Noche de Cortos".
    curiosidadDelLugar: "Cinemateca del Parque funciona en un edificio de los años 60 pensado originalmente como sala de exposiciones, no de cine. Queda dentro de un circuito institucional de artes, de ahí sus espacios tan amplios, perfectos para mezclar performance con formato audiovisual. \"Noche de Cortos\" — la serie de esta misma pieza — lleva varias ediciones agotando boletería acá, una tras otra.",
    contextoBarrio: "Zona universitaria, animada especialmente las noches de función.",
    rating: "8.6",
    ratingCount: 23,
    rail: "descubrimientos",
    imageUrl: "/assets/images/ciudad%20invisible.jpg",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba.
    porQueDescubrir:
      "El criterio de selección es literal: todo lo que se proyecta se rodó a menos de 5 km de la sala. Theaveling la eligió por ese recorte hiperlocal — una forma concreta, no abstracta, de mostrar lo que pasa en el barrio.",
    ficha: {
      presentaciones: "función única (evento especial)",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "selección curada de cortometrajes de realizadores locales",
      idioma: "Español",
    },
    artista: {
      nombre: "Cinemateca del Parque — Curaduría",
      categoria: "Programa curatorial",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/ciudad%20invisible2.jpg",
      saludo:
        "Somos la curaduría de Cinemateca del Parque. Programamos cine hecho por gente del barrio, sobre el barrio.",
    },
    resenas: [
      {
        nombre: "Laura B.",
        rating: "★ 8.8",
        fecha: "Hace 2 días",
        texto:
          "Función única, no hay repetición, revisa bien la fecha con anticipación.",
      },
      {
        nombre: "Camilo W.",
        rating: "★ 8.3",
        fecha: "Hace 6 días",
        texto:
          "Fui sola y me encantó reconocer lugares del barrio en los cortos, le da otra capa a la función.",
      },
      {
        nombre: "Paula H.",
        rating: "★ 8.7",
        fecha: "Hace 3 semanas",
        texto:
          "La calidad es variable entre corto y corto, son realizadores locales, no una selección internacional pulida, igual vale la pena.",
      },
      {
        nombre: "Julián T.",
        rating: "★ 8.1",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Fronteras Difusas — otro programa de cine curado con mirada bien local.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.9",
        fecha: "Hace 2 meses",
        texto:
          "Después de la función se queda un rato de conversación con los realizadores, no te vayas corriendo.",
      },
    ],
  },
  {
    id: "charla-dramaturgias-del-cuerpo",
    // Título cambiado 2026-09-02 a pedido de Ana: "cuerpo" ya se repetía
    // demasiado entre títulos (la que hoy es "Comité del Fracaso" se
    // llamaba "Cuerpo en Obra", Cuerpos en tránsito, la que hoy es
    // "Voces del margen" se llamaba Cuerpos de Agua, y este). Se tomó la
    // frase de cierre de la propia descripción ("cuando el lenguaje ya
    // no alcanza") para el nuevo
    // título, mismo tema, sin repetir la palabra.
    title: "Charla: Cuando el Lenguaje No Alcanza",
    tag: "Charla",
    category: "Charlas",
    description:
      "Una conversación abierta entre dramaturgas y coreógrafas sobre cómo el cuerpo se convierte en texto cuando el lenguaje ya no alcanza.",
    venue: "Teatro Ditirambo",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "Chapinero",
    // 2026-09-04: Ana reemplazó el archivo dos veces — ahora es
    // "ditirambo teatro.png" (antes "ditirambo.jpg").
    venueImageUrl: "/assets/images/ditirambo%20teatro.png",
    date: "Sábado 19 dic · 18:00",
    price: "Gratis",
    duracion: "75 minutos, incluye espacio de preguntas del público.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 59 #14-30, Bogotá",
    curiosidadDelLugar: "Teatro Ditirambo toma su nombre del canto ritual griego en honor a Dioniso — coherente con su programación centrada en cuerpo y ritual.",
    contextoBarrio: "Barrio tranquilo con buena oferta de librerías y cafés cerca del teatro.",
    rating: "8.5",
    ratingCount: 16,
    rail: "descubrimientos",
    imageUrl: "/assets/images/charla%20dramaturgia.jpg",
    // 2026-09-03: primera pasada de contenido — ver nota completa en
    // "la-consagracion-del-otono", arriba. Es una charla, no una obra —
    // mismo criterio de N/A que "clase-improvisacion-ritmo".
    porQueDescubrir:
      "Una conversación abierta, no una clase magistral: dramaturgas y coreógrafas piensan en voz alta, en tiempo real, sobre cuándo el cuerpo tiene que hacerse cargo de lo que la palabra ya no puede decir. Theaveling la eligió por ser gratis y por no venir con conclusiones cerradas de antemano.",
    ficha: {
      presentaciones: "charla única (evento especial)",
      festivales: "N/A — es una charla, no una obra",
      premios: "N/A",
      origen: "conversación original, no es una reposición",
      idioma: "Español",
    },
    artista: {
      nombre: "Teatro Ditirambo",
      categoria: "Espacio cultural",
      ciudad: "Bogotá, Colombia",
      // 2026-09-04: foto real subida por Ana a la carpeta de assets —
      // mismo criterio que "trance artistas.jpg" en Xolo Modular (ver
      // esa nota en ArtistSpaceCard.tsx).
      imageUrl: "/assets/images/charla%20cuando%20el%20lenguaje.jpg",
      saludo:
        "Somos Teatro Ditirambo. Abrimos nuestra sala a conversaciones abiertas entre artistas — no todas tienen que terminar en una conclusión cerrada.",
    },
    resenas: [
      {
        nombre: "Andrea M.",
        rating: "★ 8.7",
        fecha: "Hace 1 día",
        texto:
          "Es gratis pero llega con tiempo, se llena rápido y no hay mucho espacio en la sala.",
      },
      {
        nombre: "Santiago P.",
        rating: "★ 8.2",
        fecha: "Hace 5 días",
        texto:
          "Fui sola y se siente más un círculo de conversación que una charla magistral, se puede participar.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 8.6",
        fecha: "Hace 2 semanas",
        texto:
          "No busques conclusiones cerradas, es literalmente una conversación abierta, sale uno con más preguntas que respuestas, y está bien así.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.0",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Materia y memoria: Lectura Táctil del Tiempo — otra experiencia que piensa el cuerpo más allá de la palabra.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 8.8",
        fecha: "Hace 3 meses",
        texto:
          "Dura menos de lo que esperaba, como una hora, perfecta para ir después del trabajo.",
      },
    ],
  },

  /*
   * 2026-09-07, a pedido de Ana: 10 experiencias nuevas para sumar
   * contenido real a Danza (+3), Performance (+4) y Música (+3) dentro
   * de las secciones de Escena en Descubrir (ver SECCIONES_ESCENA más
   * abajo). Sin `rail` a propósito (ver nota en el tipo `Experience`
   * arriba) — no aparecen en la pestaña "Todo", solo en Escena al
   * filtrar por categoría. Sin `imageUrl`/`venueImageUrl` todavía: Ana
   * va a subir las fotos reales después de esta tanda ("ya en un rato
   * te pongo las img") — mientras tanto cada card cae al placeholder
   * gris (ver `ImagePlaceholder` en ExperienceCardDescubrimientos.tsx),
   * mismo comportamiento documentado para cuando falta imagen.
   * Contenido inventado siguiendo el mismo criterio que el resto del
   * catálogo (`porQueDescubrir`/`ficha`/`artista`/`resenas` de primera
   * pasada, pendiente de revisión de Ana) — venues, fechas (real día de
   * la semana calculado para 2026, dentro de oct-dic como pide la regla
   * general del archivo) y reseñas ficticias.
   */
  {
    id: "bloque-b-cifrado-urbano",
    title: "Bloque B: Cifrado Urbano",
    tag: "Danza urbana",
    category: "Danza",
    description:
      "Crew de breaking y house convierte el patio de una fábrica de cerámica en pista: batallas cortas, música en vivo de un DJ residente y público alrededor, sin escenario que separe.",
    venue: "Fábrica de Loza",
    city: "Bogotá",
    venueCategoria: "Antigua fábrica de cerámica reconvertida",
    venueBarrio: "Chapinero",
    // 2026-09-07: fotos reales subidas por Ana.
    venueImageUrl: "/assets/images/fabrica%20de%20loza.jpg",
    imageUrl: "/assets/images/danza%20urbana%202.jpg",
    date: "Sábado 3 oct · 19:00",
    price: "$20.000 COP",
    asientoAsignado: false,
    duracion: "2 horas, formato de batallas cortas — se puede entrar y salir del círculo en cualquier momento.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 13 #45-10, Bogotá",
    curiosidadDelLugar: "La fábrica dejó de producir loza en los años 80 — los hornos originales siguen en pie al fondo del patio, hoy parte del paisaje donde se para el público.",
    contextoBarrio: "Zona mixta de talleres y locales, con buena vida nocturna los fines de semana.",
    rating: "8.7",
    ratingCount: 64,
    porQueDescubrir:
      "No es una muestra coreografiada de antemano: son batallas reales entre crews, con jueces del público y un DJ que lee la sala. Theaveling la eligió por ese riesgo — nadie sabe cómo termina hasta que termina.",
    ficha: {
      presentaciones: "Evento mensual desde 2024",
      festivales: "Circuito independiente de breaking de Bogotá",
      premios: "sin premios formales — el formato es competitivo entre crews, no un certamen con jurado externo",
      origen: "formato de batalla, no una pieza cerrada",
      idioma: "Sin diálogo (música y movimiento)",
    },
    artista: {
      nombre: "Crew Bloque B",
      categoria: "Colectivo de danza urbana",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/artistas%20danza%20urbana.jpg",
      saludo:
        "Esto no se ensaya para el público, se ensaya para la batalla — lo que ves es lo que realmente compite ese día.",
    },
    resenas: [
      {
        nombre: "Felipe O.",
        rating: "★ 8.5",
        fecha: "Hace 6 días",
        texto:
          "Fui sin saber nada de breaking y en 10 minutos ya estaba entendiendo por qué gritaba la gente en cada ronda.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 9.0",
        fecha: "Hace 2 semanas",
        texto:
          "El patio de la fábrica le suma un montón, se siente crudo de verdad, no como un evento armado en un teatro.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.2",
        fecha: "Hace 1 mes",
        texto:
          "Llega temprano si quieres estar cerca del círculo, después de las 8pm ya no se ve nada desde atrás.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.8",
        fecha: "Hace 2 meses",
        texto:
          "Si te gustó esto, también me gustó Noche de Son — otra experiencia donde el baile pasa en el público, no en un escenario.",
      },
    ],
  },
  {
    id: "materia-en-suspension",
    title: "Materia en Suspensión",
    tag: "Danza contemporánea",
    category: "Danza",
    description:
      "Dos bailarines exploran el peso y la caída como lenguaje: coreografía lenta, casi arquitectónica, sobre una banda sonora de cuerdas grabada en vivo.",
    venue: "Estudio Barro",
    city: "Bogotá",
    venueCategoria: "Estudio de danza contemporánea",
    venueBarrio: "Teusaquillo",
    venueImageUrl: "/assets/images/estudio%20barro.jpg",
    imageUrl: "/assets/images/materia%20en%20suspension.jpg",
    date: "Viernes 9 oct · 20:00",
    price: "$38.000 COP",
    asientoAsignado: true,
    duracion: "50 minutos, sin intermedio.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 39 #24-08, Bogotá",
    curiosidadDelLugar: "El estudio funciona en una casa de los años 50 sin remodelar del todo — el piso de madera original, algo desnivelado, es parte deliberada de la propuesta de la pieza.",
    contextoBarrio: "Barrio universitario y residencial, tranquilo entre semana.",
    rating: "9.0",
    ratingCount: 41,
    porQueDescubrir:
      "Casi no hay salto ni virtuosismo visible acá — el trabajo está en cómo dos cuerpos negocian el peso del otro sin soltarlo. Theaveling la eligió por esa contención, poco común en la danza contemporánea local.",
    ficha: {
      presentaciones: "5 funciones desde su estreno en 2026",
      festivales: "sin festival todavía — estreno en temporada propia del estudio",
      premios: "sin premios todavía — producción reciente",
      origen: "pieza original, no reinterpretación",
      idioma: "Sin diálogo (pieza de danza)",
    },
    artista: {
      nombre: "Dos Cuerpos, Compañía",
      categoria: "Dúo de danza contemporánea",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/artista%20dos%20cuerpos.jpg",
      saludo:
        "Trabajamos con el peso real del otro cuerpo, no con una versión coreografiada de él — por eso cambia un poco cada función.",
    },
    resenas: [
      {
        nombre: "Carolina N.",
        rating: "★ 9.1",
        fecha: "Hace 5 días",
        texto:
          "Es lentísima y por momentos incómoda de ver, en el buen sentido — cuesta dejar de mirar aunque no pase 'nada'.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.6",
        fecha: "Hace 3 semanas",
        texto:
          "El estudio es chiquito, quedas a un par de metros de los bailarines, se nota cada respiración.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 9.3",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó La consagración del otoño — mismo criterio de cuerpo lento y sin adorno.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.9",
        fecha: "Hace 2 meses",
        texto:
          "No lleves tacones, es en el piso de la casa y hay que sentarse bastante cerca del suelo.",
      },
    ],
  },
  {
    id: "noche-de-son-salsa-en-vivo",
    title: "Noche de Son: Salsa en Vivo",
    tag: "Baile de salón",
    category: "Danza",
    description:
      "Orquesta en vivo y pista abierta en un salón social clásico — clase breve de introducción antes de que empiece el baile libre.",
    venue: "Salón Los Alpes",
    city: "Bogotá",
    venueCategoria: "Salón social de baile",
    venueBarrio: "Los Alcázares",
    venueImageUrl: "/assets/images/salon%20los%20alpes.jpg",
    imageUrl: "/assets/images/noche%20de%20son.jpg",
    date: "Sábado 17 oct · 21:00",
    price: "$25.000 COP",
    asientoAsignado: false,
    duracion: "4 horas — clase de 30 minutos al inicio, después pista abierta toda la noche.",
    restriccionEdad: "+18 años — es un salón con barra, funciona como evento social nocturno.",
    direccionCompleta: "Carrera 24 #63-15, Bogotá",
    curiosidadDelLugar: "El salón funciona desde los años 70 sin cambiar casi nada de su decoración original — el mismo piso de baldosa que pisaron generaciones de bailadores de salsa en Bogotá.",
    contextoBarrio: "Barrio tradicional del centro-oriente, con varios salones de baile históricos cerca.",
    rating: "8.9",
    ratingCount: 112,
    porQueDescubrir:
      "No es una presentación para mirar sentado: es pista abierta de verdad, con gente que lleva años bailando ahí y gente que llega por primera vez. Theaveling la eligió porque la salsa en Bogotá se vive bailando, no mirando.",
    ficha: {
      presentaciones: "Evento semanal desde hace más de 10 años",
      festivales: "no aplica — evento social recurrente, no de festival",
      premios: "no aplica",
      origen: "tradición de salón de baile, sin autoría de pieza individual",
      idioma: "Español",
    },
    artista: {
      nombre: "Orquesta La Referencia",
      categoria: "Orquesta de salsa en vivo",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/orquesta%20la%20referencia.jpg",
      saludo:
        "Tocamos para que la gente baile, no para que nos escuche sentada — si el salón está quieto, no estamos haciendo bien el trabajo.",
    },
    resenas: [
      {
        nombre: "Daniela C.",
        rating: "★ 9.0",
        fecha: "Hace 4 días",
        texto:
          "Fui sin pareja y nadie se quedó sentado mucho rato, la gente saca a bailar sin drama.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.4",
        fecha: "Hace 2 semanas",
        texto:
          "La clase de 30 minutos ayuda bastante si nunca bailaste salsa en pareja, no llegas perdido a la pista.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 9.2",
        fecha: "Hace 1 mes",
        texto:
          "La orquesta toca en vivo de verdad, se nota la diferencia con poner una playlist, el sonido llena todo el salón.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 8.7",
        fecha: "Hace 3 meses",
        texto:
          "Va gente de todas las edades, no es solo un espacio para gente joven, eso me gustó.",
      },
    ],
  },
  {
    id: "piel-en-blanco",
    title: "Piel en Blanco",
    tag: "Arte corporal",
    category: "Performance",
    description:
      "Una performer cubre lentamente su propio cuerpo con capas de yeso líquido hasta inmovilizarse por completo, en una galería pequeña donde el público rodea la acción de cerca.",
    venue: "Galería Cruda",
    city: "Bogotá",
    venueCategoria: "Galería de arte independiente",
    venueBarrio: "La Macarena",
    venueImageUrl: "/assets/images/galeria%20cruda.jpg",
    imageUrl: "/assets/images/piel%20en%20blanco.jpg",
    date: "Jueves 22 oct · 19:30",
    price: "$22.000 COP",
    asientoAsignado: false,
    duracion: "45 minutos — la acción se hace en tiempo real, sin cortes.",
    restriccionEdad: "+16 años — contenido con desnudez parcial y temas de vulnerabilidad corporal.",
    direccionCompleta: "Carrera 4 #26-30, Bogotá",
    curiosidadDelLugar: "La galería es una casa antigua dividida en salas pequeñas — el aforo de esta función es de apenas 25 personas, todas de pie alrededor de la acción.",
    contextoBarrio: "Zona de galerías y talleres de artistas, empinada y con vista al centro.",
    rating: "8.6",
    ratingCount: 37,
    porQueDescubrir:
      "El cuerpo como material, no como sujeto que actúa — acá la artista se convierte literalmente en objeto a medida que avanza la pieza. Theaveling la eligió por lo incómoda que se permite ser.",
    ficha: {
      presentaciones: "3 funciones desde su estreno en 2026",
      festivales: "sin festival todavía",
      premios: "sin premios todavía — producción reciente",
      origen: "pieza original",
      idioma: "Sin diálogo",
    },
    artista: {
      nombre: "Renata Sarmiento",
      categoria: "Artista de performance",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/renata%20sarmiento.jpg",
      saludo:
        "No actúo un personaje, dejo que el material me inmovilice de verdad — lo que ves es lo que me está pasando en ese momento.",
    },
    resenas: [
      {
        nombre: "Manuela S.",
        rating: "★ 8.5",
        fecha: "Hace 1 semana",
        texto:
          "Es fuerte de ver, sobre todo los últimos minutos cuando ya casi no se puede mover, avisan bien en la puerta antes de entrar.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.8",
        fecha: "Hace 3 semanas",
        texto:
          "El aforo tan chico hace que se sienta muy cerca, casi incómodo, pero justo por eso se queda pegada.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 8.3",
        fecha: "Hace 1 mes",
        texto:
          "Si te gustó esto, también me gustó Uno a Uno — otra pieza que se apoya en lo incómodo de estar tan cerca.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 8.9",
        fecha: "Hace 2 meses",
        texto:
          "Llega 15 minutos antes, el aforo es real y se llena, no es solo un decir.",
      },
    ],
  },
  {
    // 2026-09-08, a pedido de Ana ("cambia el concepto... no me gustó y
    // las fotos también, usa alguna que haya quedado"): reemplazo total
    // del concepto y las fotos, mismo id (lo referencia el lineup de
    // "festival-teatro-circo-bogota", ver FESTIVAL_LINEUP_IDS más abajo,
    // y 2 reseñas cruzadas de otras piezas — ambas actualizadas con el
    // título nuevo). Foto de la carpeta de stock "imagenes aleatorias
    // para ver mas" (antes tenía fotos propias de Ana de un mercado que
    // ya no aplican). Categoría cambia de Performance a Danza — la foto
    // es un ensamble de baile de verdad, no un happening participativo.
    id: "happening-mercado-vivo",
    title: "Vértigo de Tul: Coro Final",
    tag: "Danza de conjunto",
    category: "Danza",
    description:
      "Ocho bailarinas cierran una revista de cabaret con un número de conjunto tan rápido que el vestuario de tul se vuelve un solo borrón de luz — la coreografía está pensada para verse justo así, deshecha por el movimiento.",
    venue: "Teatro Cariátides",
    city: "Bogotá",
    venueCategoria: "Sala de teatro de revista",
    venueBarrio: "Chapinero",
    imageUrl:
      "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/reilly-cook-e50NiF4gBj4-unsplash.jpg",
    date: "Domingo 25 oct · 19:00",
    price: "$32.000 COP",
    asientoAsignado: true,
    duracion: "50 minutos, número de cierre de una revista más larga — se puede comprar boleta solo para este segmento final.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 63 #11-40, Bogotá",
    curiosidadDelLugar:
      "El teatro instaló luces especiales de contraste azul y rosa solo para este número — el resto de la revista usa iluminación blanca estándar. La compañía pidió el cambio después de ver cómo esos dos tonos se mezclaban en el tul durante los ensayos.",
    contextoBarrio: "Chapinero mezcla teatros de revista con vida nocturna variada, con buena oferta de transporte para salir tarde entre semana.",
    rating: "8.9",
    ratingCount: 67,
    porQueDescubrir:
      "No hay un solo cuerpo protagonista — el número está armado para que ninguna bailarina se distinga de las demás, todas parte del mismo borrón de tela. Theaveling lo eligió por esa apuesta de conjunto puro, poco común en un formato que suele buscar una figura central.",
    ficha: {
      presentaciones: "Número de cierre de temporada, funciones desde 2026",
      festivales: "circuito del Festival de Teatro y Circo de Bogotá",
      premios: "sin premios",
      origen: "coreografía original de conjunto",
      idioma: "Sin diálogo (pieza de danza)",
    },
    artista: {
      nombre: "Compañía Cariátides",
      categoria: "Compañía de danza de revista",
      ciudad: "Bogotá, Colombia",
      saludo:
        "Ensayamos meses para que no se note quién lleva el paso — cuando alguien nos dice que no pudo distinguir a nadie en particular, sabemos que salió bien.",
    },
    resenas: [
      {
        nombre: "Felipe O.",
        rating: "★ 8.7",
        fecha: "Hace 6 días",
        texto:
          "Se puede comprar boleta solo para el número final si no quieres ver la revista completa, buena opción si vas con poco tiempo.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 9.1",
        fecha: "Hace 2 semanas",
        texto:
          "El contraste de luces azul y rosa sobre el tul blanco se ve espectacular, mejor en vivo que en cualquier foto.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.5",
        fecha: "Hace 1 mes",
        texto:
          "Cincuenta minutos se sienten cortos, pero el nivel de sincronía de las ocho bailarinas no decae ni un segundo.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 9.0",
        fecha: "Hace 2 meses",
        texto:
          "Si te gustó Vals en Azul, este número también confía en el movimiento antes que en cualquier otra cosa, aunque acá sea de conjunto y no de una sola bailarina.",
      },
    ],
  },
  {
    id: "senal-en-bucle",
    title: "Señal en Bucle",
    tag: "Performance New Media",
    category: "Performance",
    description:
      "Integra tecnologías digitales, proyecciones interactivas, video y sonido en tiempo real: los movimientos del performer alteran en vivo las imágenes proyectadas a su alrededor.",
    venue: "Laboratorio Arte y Máquina",
    city: "Bogotá",
    venueCategoria: "Laboratorio de arte y tecnología",
    venueBarrio: "Chapinero Alto",
    venueImageUrl: "/assets/images/arte%20y%20maquina.jpg",
    imageUrl: "/assets/images/se%C3%B1al%20en%20bucle.jpg",
    date: "Viernes 30 oct · 20:00",
    price: "$35.000 COP",
    asientoAsignado: false,
    duracion: "40 minutos, seguidos de una charla breve opcional sobre el sistema técnico usado.",
    restriccionEdad: "Todo público — luces estroboscópicas puntuales, aviso en la entrada.",
    direccionCompleta: "Carrera 7 #54-20, Bogotá",
    curiosidadDelLugar: "El laboratorio ocupa lo que antes era un taller de electrónica — varios de los sensores que usa la pieza fueron construidos ahí mismo por el propio artista.",
    contextoBarrio: "Zona residencial en altura, con vistas a los cerros orientales.",
    rating: "8.9",
    ratingCount: 29,
    porQueDescubrir:
      "El sistema no está pregrabado: cada función responde en tiempo real al cuerpo del performer, así que ninguna proyección se repite igual dos veces. Theaveling la eligió por ese componente técnico genuinamente en vivo, no simulado.",
    ficha: {
      presentaciones: "6 funciones desde su estreno en 2025",
      festivales: "Muestra de Arte y Tecnología de Bogotá 2025",
      premios: "sin premios todavía",
      origen: "pieza original, sistema técnico desarrollado por el propio artista",
      idioma: "Sin diálogo",
    },
    artista: {
      nombre: "Juliana Roa",
      categoria: "Artista de new media",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/juliana%20Roa.jpg",
      saludo:
        "Construyo mis propios sensores porque necesito que respondan exactamente a lo que hago, no a una versión aproximada.",
    },
    resenas: [
      {
        nombre: "Juan David R.",
        rating: "★ 9.0",
        fecha: "Hace 5 días",
        texto:
          "La charla técnica después vale la pena, explica cómo arma todo eso y cambia cómo ves la pieza en retrospectiva.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 8.7",
        fecha: "Hace 3 semanas",
        texto:
          "Avisan lo de las luces pero igual son bastante intensas, si sos sensible a eso avisa antes de entrar.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 9.1",
        fecha: "Hace 1 mes",
        texto:
          "Nunca había visto algo así en vivo, la proyección reacciona de verdad al cuerpo, no es un video de fondo.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.5",
        fecha: "Hace 2 meses",
        texto:
          "El espacio es chico, conviene llegar temprano para quedar bien ubicado frente a la proyección.",
      },
    ],
  },
  {
    id: "gesto-sin-dueno",
    title: "Gesto sin Dueño",
    tag: "Fluxus",
    category: "Performance",
    description:
      "Acciones artísticas improvisadas que funcionan como \"arte-diversión\" y rechazan la comercialización tradicional de la obra: instrucciones simples que el público ejecuta junto a los artistas, sin escenario ni entrada fija.",
    venue: "Casa Republicana 47",
    city: "Bogotá",
    venueCategoria: "Casa republicana reconvertida en espacio de arte",
    venueBarrio: "La Candelaria",
    venueImageUrl: "/assets/images/casa%20republicana.jpg",
    imageUrl: "/assets/images/gesto%20sin%20due%C3%B1o.jpg",
    date: "Jueves 5 nov · 19:00",
    price: "$18.000 COP",
    asientoAsignado: false,
    duracion: "Duración variable, entre 1 y 2 horas según cuánto participe el público esa noche.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 12 #3-45, Bogotá",
    curiosidadDelLugar: "La casa conserva sus patios internos originales — las acciones se reparten por distintos cuartos y patios, no hay un único punto donde pararse a mirar.",
    contextoBarrio: "Centro histórico, muy cerca de la Plaza de Bolívar.",
    rating: "8.4",
    ratingCount: 22,
    porQueDescubrir:
      "No hay obra terminada que mirar, solo instrucciones (\"llena un vaso de agua y pásalo a alguien que no conozcas\") que cualquiera puede seguir. Theaveling la eligió por su rechazo genuino a la idea de espectáculo.",
    ficha: {
      presentaciones: "Encuentro mensual desde 2025",
      festivales: "sin festival — encuentro autogestionado",
      premios: "no aplica",
      origen: "inspirado en partituras de eventos de Fluxus histórico, ejecutadas de forma libre",
      idioma: "Español",
    },
    artista: {
      nombre: "Grupo Instrucción Abierta",
      categoria: "Colectivo de acción artística",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/grupo%20instruccion%20abierta.jpg",
      saludo:
        "No vendemos entradas a una obra, invitamos a alguien a hacer algo simple junto a nosotros por una noche.",
    },
    resenas: [
      {
        nombre: "Daniela C.",
        rating: "★ 8.2",
        fecha: "Hace 1 semana",
        texto:
          "No sabía qué esperar y esa es la gracia, mejor ir sin leer mucho antes.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.6",
        fecha: "Hace 3 semanas",
        texto:
          "Es raro al principio participar sin que nadie te explique bien qué hacer, después agarra el ritmo.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.0",
        fecha: "Hace 1 mes",
        texto:
          "Dura distinto cada vez según quién vaya, una noche duró casi 2 horas y otra menos de una.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.7",
        fecha: "Hace 2 meses",
        texto:
          "La casa sola ya vale la visita, los patios son hermosos incluso sin el evento.",
      },
    ],
  },
  {
    id: "sesion-de-camara-numero-3",
    title: "Sesión de Cámara N°3",
    tag: "Concierto íntimo",
    category: "Música",
    description:
      "Formato acústico de cámara orientado a la cercanía con el público: un cuarteto de cuerdas toca a pocos metros de la primera fila, con breves comentarios sobre cada pieza.",
    venue: "Estudio Sonoro Once",
    city: "Bogotá",
    venueCategoria: "Estudio de grabación y sala de cámara",
    venueBarrio: "La Soledad",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/sonoro.jpg",
    imageUrl: "/assets/images/sesion%20de%20camara.jpg",
    date: "Miércoles 11 nov · 19:30",
    price: "$40.000 COP",
    asientoAsignado: true,
    duracion: "75 minutos, con una breve pausa a mitad de programa.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 45 #20-12, Bogotá",
    curiosidadDelLugar: "El estudio se construyó originalmente para grabación, no para público en vivo — el aislamiento acústico pensado para microfonía hace que el sonido se sienta inusualmente cercano y seco, sin la reverberación de una sala de conciertos tradicional.",
    contextoBarrio: "Barrio universitario, tranquilo entre semana, con varios estudios y talleres pequeños.",
    rating: "9.1",
    ratingCount: 48,
    porQueDescubrir:
      "Sin escenario elevado ni distancia de auditorio: la primera fila queda a menos de dos metros del cuarteto. Theaveling la eligió por esa cercanía poco común en música de cámara en Bogotá.",
    ficha: {
      presentaciones: "Tercera edición de la serie, mensual desde 2026",
      festivales: "sin festival — serie propia del estudio",
      premios: "sin premios formales",
      origen: "programa propio, repertorio rotativo de cuerdas",
      idioma: "Sin diálogo (con comentarios breves en español entre piezas)",
    },
    artista: {
      nombre: "Cuarteto Once",
      categoria: "Cuarteto de cuerdas",
      ciudad: "Bogotá, Colombia",
      imageUrl: "/assets/images/cuarteto%20once.jpg",
      saludo:
        "Elegimos salas chicas a propósito — la música de cámara se pensó para distancias cortas, no para auditorios grandes.",
    },
    resenas: [
      {
        nombre: "Carolina N.",
        rating: "★ 9.3",
        fecha: "Hace 4 días",
        texto:
          "Se escucha increíble, el aislamiento del estudio hace que cada instrumento suene clarísimo, distinto a cualquier sala de conciertos.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.9",
        fecha: "Hace 2 semanas",
        texto:
          "Los comentarios entre piezas ayudan mucho si no sabes de música clásica, no se siente elitista para nada.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 9.2",
        fecha: "Hace 1 mes",
        texto:
          "Cupo chico, se agota rápido, compra con anticipación si te interesa esta serie.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.8",
        fecha: "Hace 3 meses",
        texto:
          "Si te gustó esto, también me gustó Trance: Ritual Sonoro Colectivo — otra experiencia sonora íntima, aunque muy distinta en estilo.",
      },
    ],
  },
  {
    id: "verde-y-sonido",
    title: "Verde y Sonido",
    tag: "Concierto al aire libre",
    category: "Música",
    description:
      "Concierto gratuito al atardecer en un parque público: banda local de jazz y público sentado en el pasto, sin cerco ni boletería.",
    venue: "Parque de los Novios",
    city: "Bogotá",
    venueCategoria: "Parque público",
    venueBarrio: "Paloquemao",
    venueImageUrl: "/assets/images/parque%20de%20los%20novios.jpeg",
    imageUrl: "/assets/images/verde%20y%20sonido.jpg",
    date: "Sábado 21 nov · 17:00",
    price: "Gratis",
    asientoAsignado: false,
    duracion: "2 horas, hasta el anochecer.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 22 con Carrera 32, Bogotá",
    curiosidadDelLugar: "El parque queda junto al antiguo Matadero Distrital, hoy convertido en centro cultural — parte del público llega caminando desde ahí después de otras actividades del día.",
    contextoBarrio: "Zona en transición, con varios espacios culturales nuevos alrededor del parque.",
    rating: "8.7",
    ratingCount: 76,
    porQueDescubrir:
      "Es gratis y sin producción compleja — solo una banda, un parque y quien quiera sentarse a escuchar. Theaveling la eligió por lo poco que necesita para funcionar.",
    ficha: {
      presentaciones: "Serie de conciertos de parque, mensual entre septiembre y diciembre",
      festivales: "no aplica",
      premios: "no aplica",
      origen: "programación cultural pública, repertorio rotativo",
      idioma: "Sin diálogo",
    },
    artista: {
      nombre: "Combo Paloquemao",
      categoria: "Banda de jazz",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08, a pedido de Ana ("pon la misma que la de card de
      // experiencia"): no hay foto propia de la banda, así que se
      // reusa la misma foto de la experiencia.
      imageUrl: "/assets/images/verde%20y%20sonido.jpg",
      saludo:
        "Tocamos igual para diez personas que para doscientas — el parque decide cuánta gente llega, no nosotros.",
    },
    resenas: [
      {
        nombre: "Manuela S.",
        rating: "★ 8.6",
        fecha: "Hace 6 días",
        texto:
          "Lleva algo para sentarte, el pasto se llena rápido apenas empieza a sonar la banda.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.9",
        fecha: "Hace 2 semanas",
        texto:
          "Fui con perro y niños y nadie dijo nada, se siente muy de barrio, en el buen sentido.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 8.4",
        fecha: "Hace 1 mes",
        texto:
          "Si llueve se cancela sin aviso previo muy claro, revisa el clima antes de ir.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 9.0",
        fecha: "Hace 2 meses",
        texto:
          "Buenísimo plan gratis para un sábado, la banda suena mejor de lo que esperaba para un concierto de parque.",
      },
    ],
  },
  {
    id: "recital-de-una-noche",
    title: "Recital de una Noche",
    /* 2026-09-08, a pedido de Ana ("cambiale el nombre a una chica y que
     * sea un evento intimo en un bar, no un recital pomposo"): esta
     * experiencia deja de ser un recital de piano formal en un auditorio
     * institucional y pasa a ser una noche de voz y piano en un bar
     * chico — cambian venue, categoría del venue, barrio, dirección,
     * tag, descripción, precio (deja de sentirse como boleta de
     * auditorio), asientoAsignado (ya no aplica en un bar), duración,
     * curiosidadDelLugar, contextoBarrio, porQueDescubrir, ficha y el
     * artista (ahora una cantautora, no un pianista solista). Se quita
     * `venueImageUrl` porque la foto anterior era del auditorio, que ya
     * no corresponde — queda sin foto de lugar hasta que Ana suba una
     * del bar. Las reseñas que mencionaban el auditorio también se
     * ajustan para no contradecir el nuevo venue. */
    tag: "Concierto íntimo en bar",
    category: "Música",
    description:
      "Un set de voz y piano en un rincón de bar, sin tarima ni luces de teatro: la gente queda sentada a centímetros del instrumento, entre tragos y conversación baja.",
    venue: "El Bar del Fondo",
    city: "Bogotá",
    venueCategoria: "Bar de música en vivo",
    venueBarrio: "La Macarena",
    imageUrl: "/assets/images/recital%20de%20una%20noche.jpg",
    date: "Viernes 4 dic · 20:00",
    price: "$22.000 COP",
    asientoAsignado: false,
    duracion: "50 minutos, sin pausas — pensado para no cortar el ambiente del bar.",
    restriccionEdad: "+18 años — el bar sigue con la barra abierta durante el show.",
    direccionCompleta: "Carrera 4A #26-53, Bogotá",
    curiosidadDelLugar: "El bar solo corre las mesas del fondo para estas noches — el resto de la semana funciona como bar normal, sin escenario fijo ni anuncio previo del repertorio.",
    contextoBarrio: "Zona de bares y galerías pequeñas, mezcla de vecinos del barrio y gente que viene de otras partes de la ciudad.",
    rating: "9.0",
    ratingCount: 34,
    porQueDescubrir:
      "Sin tarima ni distancia de auditorio: el piano queda al lado de la barra y las canciones se escuchan con el ruido de fondo normal de un bar, no en silencio de sala de concierto. Theaveling la eligió por esa cercanía cruda, sin la solemnidad de un recital formal.",
    ficha: {
      presentaciones: "Función única",
      festivales: "sin festival — show independiente",
      premios: "sin premios formales",
      origen: "repertorio propio, canciones para voz y piano",
      idioma: "Español, con partes instrumentales",
    },
    artista: {
      nombre: "Mariana Solórzano",
      categoria: "Cantautora y pianista",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08, a pedido de Ana ("pon la misma que la de card de
      // experiencia"): no hay foto propia de la artista, así que se
      // reusa la misma foto de la experiencia.
      imageUrl: "/assets/images/recital%20de%20una%20noche.jpg",
      saludo:
        "Prefiero un bar chico a un auditorio grande — se siente más parecido a cantarle a alguien que a actuar para un público.",
    },
    resenas: [
      {
        nombre: "Natalia Q.",
        rating: "★ 9.2",
        fecha: "Hace 5 días",
        texto:
          "Función única de verdad, no hay otra fecha, si te interesa compra apenas puedas.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 8.8",
        fecha: "Hace 3 semanas",
        texto:
          "Los 50 minutos se sienten cortos cuando el programa está bien armado, no sobra ni falta nada.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 9.1",
        fecha: "Hace 1 mes",
        texto:
          "El bar es chico de verdad, casi no hay espacio entre las mesas y el piano, pero esa cercanía es justamente la gracia.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.7",
        fecha: "Hace 2 meses",
        texto:
          "Si te gustó esto, también me gustó Sesión de Cámara N°3 — otra experiencia musical íntima, aunque esa es en un estudio formal y esta es puro bar.",
      },
    ],
  },

  /*
   * 2026-09-07, a pedido de Ana: 6 experiencias nuevas más, esta vez
   * para Cultura — 3 para "Cine que nace cerca" (una por cada categoría
   * que agrupa esa sección: Cine, Cine local, Cineclub) y 3 para
   * "Encuentros para crear y compartir" (una por Charlas, Talleres,
   * Lecturas dramáticas). Mismo criterio que la tanda de Escena de
   * arriba: sin `rail` (no aparecen en "Todo", solo filtradas por
   * categoría en Cultura). 2026-09-08: Ana ya subió las fotos reales
   * (imageUrl/venueImageUrl/artista.imageUrl) — ver cada experiencia
   * abajo. "pantalla-de-barrio" y "club-de-culto-medianoche" quedan sin
   * foto de artista propia (no se encontró un archivo para "Colectivo
   * Pantalla de Barrio" ni "Sala Oscura Cineclub" en la carpeta).
   */
  {
    id: "el-ultimo-carrete",
    title: "El Último Carrete: Cine en 16mm",
    tag: "Cine experimental",
    category: "Cine",
    description:
      "Proyección en formato analógico real de 16mm, con el proyeccionista operando a la vista del público — el ruido del carrete es parte de la experiencia, no un defecto a esconder.",
    venue: "Cine Embajador",
    city: "Bogotá",
    venueCategoria: "Sala de cine independiente",
    venueBarrio: "Chapinero",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/cine%20embajador.jpg",
    date: "Jueves 15 oct · 19:00",
    price: "$18.000 COP",
    asientoAsignado: true,
    duracion: "95 minutos, incluye una pieza corta antes del largometraje principal.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 14 #59-58, Bogotá",
    curiosidadDelLugar: "El Embajador es una de las pocas salas de Bogotá que conserva su proyector de 16mm original en uso — la mayoría de las copias que se muestran vienen de un archivo privado, no de distribución comercial.",
    contextoBarrio: "Zona comercial de Chapinero, con vida nocturna variada.",
    rating: "8.8",
    ratingCount: 45,
    // 2026-09-08: foto real subida por Ana.
    imageUrl: "/assets/images/el%20ultimo%20carrete.jpg",
    porQueDescubrir:
      "No es una proyección digital disfrazada de analógica: es el carrete real, con sus rayones y su sonido de proyector de fondo. Theaveling la eligió por sostener ese formato cuando ya casi nadie lo hace.",
    ficha: {
      presentaciones: "Función mensual desde 2025",
      festivales: "sin festival — programación propia de archivo",
      premios: "no aplica",
      origen: "programación de archivo, títulos rotativos",
      idioma: "Español y subtítulos según la película",
    },
    artista: {
      nombre: "Cineclub El Carrete",
      categoria: "Colectivo de exhibición de cine",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08: foto real subida por Ana.
      imageUrl: "/assets/images/cine%20club%20el%20carrete.jpg",
      saludo:
        "Cuidamos estas copias como se cuidan objetos frágiles — cada función es literalmente única, la cinta se desgasta un poco cada vez que pasa por el proyector.",
    },
    resenas: [
      {
        nombre: "Nicolás F.",
        rating: "★ 8.6",
        fecha: "Hace 1 semana",
        texto:
          "El sonido del proyector al fondo suena raro las primeras veces y después se vuelve parte de la película, muy particular.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 9.0",
        fecha: "Hace 3 semanas",
        texto:
          "No sabía que todavía existían copias de 16mm en circulación en Bogotá, la calidad de imagen es distinta a cualquier proyección digital.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.4",
        fecha: "Hace 1 mes",
        texto:
          "Llega con tiempo, el cupo es chico porque la sala reserva las mejores filas para no forzar la vista con el grano de la imagen.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 9.1",
        fecha: "Hace 2 meses",
        texto:
          "Si te gustó esto, también me gustó Fronteras Difusas — otra experiencia de cine pensada para gente que valora el formato, no solo el contenido.",
      },
    ],
  },
  {
    id: "pantalla-de-barrio",
    title: "Pantalla de Barrio: Selección Bogotana",
    tag: "Cine local",
    category: "Cine local",
    description:
      "Muestra de cortometrajes hechos por realizadores bogotanos independientes, seguida de una conversación breve con parte del equipo de alguna de las piezas.",
    venue: "Cinemateca Rojas",
    city: "Bogotá",
    venueCategoria: "Sala de proyección comunitaria",
    venueBarrio: "Restrepo",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/cinemateca%20rojas.jpg",
    date: "Sábado 24 oct · 18:00",
    price: "$12.000 COP",
    asientoAsignado: false,
    duracion: "2 horas — 6 cortometrajes seguidos de 20 minutos de conversación.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 19 #17-30 Sur, Bogotá",
    curiosidadDelLugar: "La sala funcionaba antes como salón comunal del barrio — sigue prestando ese uso entre semana, y los sábados se convierte en sala de cine improvisada.",
    contextoBarrio: "Barrio popular del sur, con fuerte identidad de producción audiovisual independiente.",
    rating: "8.6",
    ratingCount: 31,
    // 2026-09-08: foto real subida por Ana (archivo .avif).
    imageUrl: "/assets/images/pantalla%20de%20barrio.avif",
    porQueDescubrir:
      "Son piezas que casi no circulan fuera de festivales pequeños o del círculo de quienes las hicieron. Theaveling la eligió por sacar del cajón cine que se hace acá mismo, sobre acá mismo.",
    ficha: {
      presentaciones: "Edición bimestral desde 2025",
      festivales: "circuito de muestras barriales de Bogotá",
      premios: "no aplica",
      origen: "selección curada de cortometrajes independientes",
      idioma: "Español",
    },
    artista: {
      nombre: "Colectivo Pantalla de Barrio",
      categoria: "Colectivo de cine comunitario",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08: foto real subida por Ana.
      imageUrl: "/assets/images/pantalla.jpg",
      saludo:
        "No buscamos las películas más pulidas, buscamos las que cuentan algo real de estas calles.",
    },
    resenas: [
      {
        nombre: "Juan David R.",
        rating: "★ 8.3",
        fecha: "Hace 5 días",
        texto:
          "La conversación con el equipo al final le suma mucho, se entiende mejor el contexto de cómo se hicieron los cortos con tan poco presupuesto.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.8",
        fecha: "Hace 2 semanas",
        texto:
          "Calidad despareja entre los cortos, algo normal en una muestra independiente, pero los 2 mejores valen toda la entrada.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 8.5",
        fecha: "Hace 1 mes",
        texto:
          "El salón no es una sala de cine formal, las sillas son plásticas, pero el ambiente compensa esa parte.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.9",
        fecha: "Hace 2 meses",
        texto:
          "Muy barato para lo que ofrece, y queda bien conectado en transporte público desde el centro.",
      },
    ],
  },
  {
    id: "club-de-culto-medianoche",
    title: "Club de Culto: Función de Medianoche",
    tag: "Cineclub",
    category: "Cineclub",
    description:
      "Función de medianoche de cine de culto, con introducción del cineclub antes de la proyección y discusión abierta al salir.",
    venue: "Sala Oscura",
    city: "Bogotá",
    venueCategoria: "Cineclub independiente",
    venueBarrio: "Chapinero Alto",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/sala%20oscura.jpg",
    date: "Sábado 14 nov · 23:30",
    price: "$15.000 COP",
    asientoAsignado: false,
    duracion: "110 minutos, más 30 minutos de conversación abierta al final.",
    restriccionEdad: "+18 años — contenido de cine de culto con temáticas adultas.",
    direccionCompleta: "Calle 63 #9-40, Bogotá",
    curiosidadDelLugar: "Sala Oscura funciona en el sótano de un edificio residencial — el cineclub lleva más de 8 años pasando películas ahí sin cambiar de dirección, un dato que casi nadie fuera del círculo conoce.",
    contextoBarrio: "Zona residencial tranquila de día, con vida nocturna discreta.",
    rating: "8.9",
    ratingCount: 58,
    // 2026-09-08: foto real subida por Ana.
    imageUrl: "/assets/images/club%20de%20culto.jpg",
    porQueDescubrir:
      "El título de cada función se revela solo unos días antes, nunca con mucha anticipación — parte de la identidad del cineclub. Theaveling la eligió por sostener ese misterio en vez de anunciar cartelera fija.",
    ficha: {
      presentaciones: "Función semanal desde 2018",
      festivales: "no aplica",
      premios: "no aplica",
      origen: "programación rotativa de cine de culto",
      idioma: "Español y subtítulos según la película",
    },
    artista: {
      nombre: "Sala Oscura Cineclub",
      categoria: "Cineclub independiente",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08, a pedido de Ana ("ponle la misma foto que el
      // lugar"): el cineclub y el venue comparten nombre y foto.
      imageUrl: "/assets/images/sala%20oscura.jpg",
      saludo:
        "No avisamos qué vamos a pasar hasta último momento — así la gente llega a ver cine, no a ver un título.",
    },
    resenas: [
      {
        nombre: "Daniela C.",
        rating: "★ 9.0",
        fecha: "Hace 4 días",
        texto:
          "No saber qué vas a ver es parte de la gracia, llegué sin expectativas y salí queriendo volver el siguiente sábado.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.5",
        fecha: "Hace 2 semanas",
        texto:
          "La conversación al final se pone buena, hay gente que lleva años yendo y da contexto que uno solo no tendría.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 9.2",
        fecha: "Hace 1 mes",
        texto:
          "Es tarde, ojo si madrugas al otro día, termina pasada la 1am contando la charla.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 8.7",
        fecha: "Hace 3 meses",
        texto:
          "El sótano le suma ambiente, se siente clandestino en el buen sentido, no es una sala cualquiera.",
      },
    ],
  },
  {
    id: "charla-arte-y-ciudad",
    title: "Charla: El Arte que Habita la Calle",
    tag: "Charla",
    category: "Charlas",
    description:
      "Conversación abierta sobre arte urbano y espacio público, con un muralista invitado y espacio para preguntas del público.",
    venue: "Biblioteca Pública El Tunal",
    city: "Bogotá",
    venueCategoria: "Biblioteca pública",
    venueBarrio: "El Tunal",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/biblioteca%20el%20tunal.jpg",
    date: "Domingo 1 nov · 16:00",
    price: "Gratis",
    asientoAsignado: false,
    duracion: "90 minutos, incluye ronda de preguntas.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 48B Sur #21-13, Bogotá",
    curiosidadDelLugar: "La biblioteca tiene un auditorio pequeño poco conocido fuera del barrio — varias charlas culturales del sur de Bogotá pasan por ahí sin mucha promoción por fuera de la zona.",
    contextoBarrio: "Zona residencial del sur, con el parque El Tunal como referencia del sector.",
    rating: "8.5",
    ratingCount: 27,
    // 2026-09-08: foto real subida por Ana.
    imageUrl: "/assets/images/el%20arte%20que%20habita%20en%20la%20calle.jpg",
    porQueDescubrir:
      "No es una charla teórica sobre arte urbano desde afuera — quien habla pinta en la calle todas las semanas. Theaveling la eligió por esa voz de primera mano, no de comentarista.",
    ficha: {
      presentaciones: "Encuentro único",
      festivales: "no aplica",
      premios: "no aplica",
      origen: "programación cultural de biblioteca pública",
      idioma: "Español",
    },
    artista: {
      nombre: "David Peña",
      categoria: "Muralista",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08: foto real subida por Ana.
      imageUrl: "/assets/images/david%20pe%C3%B1a.jpg",
      saludo:
        "Pinto en la calle desde hace 12 años — esta charla es de las pocas veces que hablo del oficio en vez de solo hacerlo.",
    },
    resenas: [
      {
        nombre: "Natalia Q.",
        rating: "★ 8.4",
        fecha: "Hace 6 días",
        texto:
          "Es gratis y vale mucho la pena, el muralista cuenta anécdotas concretas, no solo teoría de arte urbano.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.7",
        fecha: "Hace 3 semanas",
        texto:
          "La biblioteca queda un poco lejos si vives al norte, pero el auditorio es cómodo y no estaba lleno.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 8.2",
        fecha: "Hace 1 mes",
        texto:
          "La ronda de preguntas se extendió más de lo previsto, en el buen sentido, había mucho interés del público.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 8.8",
        fecha: "Hace 2 meses",
        texto:
          "Si te gustó esto, también me gustó la Charla: Cuando el Lenguaje No Alcanza — mismo formato de conversación abierta y cercana.",
      },
    ],
  },
  {
    id: "taller-de-escritura-escenica",
    title: "Taller de Escritura Escénica",
    tag: "Taller",
    category: "Talleres",
    description:
      "Taller práctico de escritura para teatro: ejercicios cortos de diálogo y estructura dramática, pensado tanto para quienes ya escriben como para quienes nunca lo intentaron.",
    venue: "Casa de Poesía Silva",
    city: "Bogotá",
    venueCategoria: "Casa cultural",
    venueBarrio: "La Candelaria",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/casa%20poesia%20silva.jpg",
    date: "Domingo 8 nov · 10:00",
    price: "$28.000 COP",
    asientoAsignado: false,
    duracion: "3 horas, con una pausa a mitad de sesión.",
    restriccionEdad: "+16 años — taller participativo pensado para adultos y jóvenes.",
    direccionCompleta: "Calle 14 #3-41, Bogotá",
    curiosidadDelLugar: "La casa perteneció al poeta José Asunción Silva — hoy funciona como espacio cultural dedicado sobre todo a la palabra, aunque este taller es de las pocas actividades ahí enfocadas en teatro y no solo en poesía.",
    contextoBarrio: "Centro histórico, rodeado de casas coloniales convertidas en espacios culturales.",
    rating: "8.9",
    ratingCount: 24,
    // 2026-09-08: foto real subida por Ana.
    imageUrl: "/assets/images/escritura%20escenica.jpg",
    porQueDescubrir:
      "No hace falta experiencia previa ni saber de teatro — el taller arranca de cero con ejercicios cortos que cualquiera puede intentar. Theaveling la eligió por ser un punto de entrada real, no un espacio solo para quienes ya escriben.",
    ficha: {
      presentaciones: "Edición mensual desde 2026",
      festivales: "no aplica",
      premios: "no aplica",
      origen: "programa propio del taller, no adaptación de un método externo",
      idioma: "Español",
    },
    artista: {
      nombre: "Laura Espitia",
      categoria: "Dramaturga y tallerista",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08: foto real subida por Ana.
      imageUrl: "/assets/images/laura%20espitia.jpg",
      saludo:
        "No enseño a escribir 'bien', enseño a terminar un ejercicio corto y ver qué sale — de ahí sale todo lo demás.",
    },
    resenas: [
      {
        nombre: "Carolina N.",
        rating: "★ 9.0",
        fecha: "Hace 1 semana",
        texto:
          "Fui sin haber escrito nunca teatro y salí con 3 escenas cortas de verdad, no solo apuntes sueltos.",
      },
      {
        nombre: "Felipe O.",
        rating: "★ 8.6",
        fecha: "Hace 3 semanas",
        texto:
          "El grupo es chico, se nota que la tallerista alcanza a leer y comentar el ejercicio de cada quien.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 9.1",
        fecha: "Hace 1 mes",
        texto:
          "La casa en sí ya vale la visita, y saber que fue de Silva le suma un contexto lindo al ejercicio de escribir ahí.",
      },
      {
        nombre: "Natalia Q.",
        rating: "★ 8.5",
        fecha: "Hace 2 meses",
        texto:
          "3 horas se sienten largas si nunca escribiste, pero la pausa a mitad ayuda a recargar.",
      },
    ],
  },
  {
    id: "cartas-no-enviadas-lectura-dramatica",
    title: "Cartas No Enviadas: Lectura Dramática",
    tag: "Lectura dramática",
    category: "Lecturas dramáticas",
    description:
      "Lectura dramática de un texto original a partir de cartas nunca enviadas, interpretada por dos actores con atriles, sin puesta en escena.",
    venue: "Casa del Verso",
    city: "Bogotá",
    venueCategoria: "Casa cultural",
    venueBarrio: "La Perseverancia",
    // 2026-09-08: foto real del venue subida por Ana.
    venueImageUrl: "/assets/images/casa%20del%20verso.jpg",
    date: "Viernes 27 nov · 19:30",
    price: "$16.000 COP",
    asientoAsignado: false,
    duracion: "55 minutos, sin intermedio.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 5 #33-20, Bogotá",
    curiosidadDelLugar: "La casa funcionaba antes como imprenta de barrio — el patio donde se hace la lectura conserva parte del piso original de baldosa de la imprenta.",
    contextoBarrio: "Barrio tradicional de calles empinadas, cerca del centro.",
    rating: "8.7",
    ratingCount: 19,
    // 2026-09-08: foto real subida por Ana.
    imageUrl: "/assets/images/cartas%20no%20enviadas.jpg",
    porQueDescubrir:
      "Sin escenografía ni memorización — los actores leen de atril, apoyados solo en el texto y la voz. Theaveling la eligió por esa desnudez formal, donde todo depende de las palabras.",
    ficha: {
      presentaciones: "Función única",
      festivales: "no aplica",
      premios: "no aplica",
      origen: "texto original, escrito para esta lectura",
      idioma: "Español",
    },
    artista: {
      nombre: "Dos Voces, Lectura Escénica",
      categoria: "Dúo de lectura dramática",
      ciudad: "Bogotá, Colombia",
      // 2026-09-08: foto real subida por Ana.
      imageUrl: "/assets/images/duo%20dos%20voces.jpg",
      saludo:
        "No actuamos personajes completos, prestamos la voz al texto — la diferencia se nota apenas empieza la lectura.",
    },
    resenas: [
      {
        nombre: "Manuela S.",
        rating: "★ 8.5",
        fecha: "Hace 5 días",
        texto:
          "Sin escenografía de verdad, solo 2 atriles y una luz, y aun así se siente completo, no le falta nada.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 9.0",
        fecha: "Hace 2 semanas",
        texto:
          "Es función única, así que si te interesa no la dejes pasar, no hay reposición anunciada.",
      },
      {
        nombre: "Daniela C.",
        rating: "★ 8.3",
        fecha: "Hace 1 mes",
        texto:
          "El patio de la casa es chico, así que queda bastante íntimo, se escucha cada matiz de la voz de los actores.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 8.8",
        fecha: "Hace 2 meses",
        texto:
          "Si te gustó esto, también me gustó Materia y memoria — otra experiencia que se apoya solo en texto y voz, sin puesta en escena.",
      },
    ],
  },

  /*
   * 2026-09-07, a pedido de Ana: tratamiento especial para "El arte toma
   * la ciudad" (Festivales) — deja de ser un riel más y pasa a ser un
   * carrusel editorial (ver FestivalesCarousel.tsx), la primera sección
   * de Cultura, con cards grandes tipo Curado que avanzan solas. Estos 3
   * son festivales REALES de Bogotá (investigados por Ana, con fuentes)
   * en vez de piezas ficticias — mismo `Experience` para poder reusar
   * Detalle/Compra, pero pensados como contenido informativo/editorial,
   * no como una reserva puntual (por eso `asientoAsignado: false` en
   * los 3, entrada general).
   *
   * Fechas: ninguno de los 3 cae realmente en septiembre (fechas reales:
   * Festival de Teatro y Circo en agosto, FIAV marzo-abril, FESTA mayo,
   * Festival OFF oct-nov, Festivales al Parque repartidos en el año,
   * FiLBo abril-mayo) — a pedido de Ana ("especifica las fechas
   * ficticias igual, si quieres ya despues pones en curso"), se usan
   * fechas ficticias que sí caen ahora, con la etiqueta "En curso" para
   * que se sientan como que están pasando en la ciudad en este momento,
   * en vez de "próximas" como el resto del catálogo.
   *
   * Sin `rail` (mismo criterio que las tandas de Escena/Cultura
   * anteriores) — no aparecen en "Todo". No se filtran por
   * `getExperiencesByCategories` como el resto de Festivales
   * (Dramaturgias Nómadas sigue con `category: "Festivales"` y sigue
   * aaprecienado solo en Curado/Todo, sin tocarse) — este trío vive
   * aparte via `FESTIVALES_CIUDAD_IDS`/`getFestivalesCiudad()` más abajo,
   * para no mezclar "el festival en sí" con "una pieza que es parte de
   * un festival". Sin `imageUrl` todavía, mismo criterio que el resto:
   * cae al placeholder gris hasta que Ana suba fotos reales.
   */
  {
    id: "festival-teatro-circo-bogota",
    title: "Festival de Teatro y Circo de Bogotá",
    tag: "Festival de artes escénicas",
    category: "Festivales",
    description:
      "La ciudad se convierte en escenario: decenas de funciones de teatro, circo y narración oral en plazas y salas de toda Bogotá, muchas de entrada libre.",
    venue: "Plazas y escenarios de Bogotá",
    city: "Bogotá",
    venueCategoria: "Festival distrital, sedes múltiples",
    venueBarrio: "Toda la ciudad",
    // 2026-09-07: pieza gráfica oficial del festival, subida por Ana —
    // se usa como `imageUrl` (afiche real, no una foto de escena) para
    // la card grande del carrusel de FestivalesCarousel.
    // 2026-09-08: Ana volvió a subir el afiche, esta vez como
    // "festival teatro y circo.png" — se reemplaza acá.
    imageUrl: "/assets/images/festival%20teatro%20y%20circo.png",
    date: "En curso · hasta el 21 de septiembre",
    price: "Gratis",
    asientoAsignado: false,
    duracion: "Programación de varios días, con decenas de funciones simultáneas en distintos puntos de la ciudad.",
    restriccionEdad: "Todo público — algunas funciones nocturnas puntuales marcan restricción propia.",
    direccionCompleta: "Sedes distribuidas por toda Bogotá — cada función indica su propio punto de encuentro.",
    curiosidadDelLugar: "Organizado por Idartes (Instituto Distrital de las Artes), es la mayor fiesta de artes escénicas locales del año — nació como programación de salas y terminó tomando también plazas públicas, que hoy son buena parte de su identidad.",
    contextoBarrio: "Sin barrio único — la gracia es justamente que pasa en toda la ciudad al mismo tiempo.",
    rating: "9.2",
    ratingCount: 312,
    porQueDescubrir:
      "No es una sola función: es la ciudad entera funcionando como escenario durante varios días, con buena parte de la programación gratis en plazas públicas. Theaveling lo destaca como la puerta de entrada más grande — y más accesible — a las artes escénicas de Bogotá.",
    ficha: {
      presentaciones: "Programación de varios días, decenas de funciones simultáneas",
      festivales: "no aplica — este perfil es del festival en sí",
      premios: "no aplica",
      origen: "evento distrital propio, con ediciones anuales",
      idioma: "Español, con compañías internacionales invitadas según la edición",
    },
    artista: {
      nombre: "Idartes — Instituto Distrital de las Artes",
      categoria: "Organizador distrital",
      ciudad: "Bogotá, Colombia",
      saludo:
        "Abrimos la ciudad para que el teatro y el circo pasen en la calle, no solo en la sala.",
    },
    resenas: [
      {
        nombre: "Felipe O.",
        rating: "★ 9.0",
        fecha: "Hace 3 días",
        texto:
          "La programación en plazas es una locura de variada, revisa la agenda completa porque hay funciones que se cruzan en horario.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 9.4",
        fecha: "Hace 1 semana",
        texto:
          "Fui a una función gratuita en plaza y terminaba llena mucho antes de empezar, llega con tiempo si quieres buen lugar.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 9.1",
        fecha: "Hace 2 semanas",
        texto:
          "Aproveché para ver 3 funciones distintas en un solo fin de semana, moverse entre sedes es fácil si planeas la ruta.",
      },
    ],
  },
  {
    id: "jazz-al-parque",
    title: "Jazz al Parque",
    tag: "Festival de música",
    category: "Festivales",
    description:
      "Jazz en vivo y al aire libre, gratis, en el parque más grande de la ciudad — una de las citas musicales más esperadas del año.",
    venue: "Parque Metropolitano Simón Bolívar",
    city: "Bogotá",
    venueCategoria: "Parque público, festival al aire libre",
    venueBarrio: "Salitre",
    // 2026-09-07: pieza gráfica oficial de "Jazz al Parque", subida por
    // Ana — mismo criterio que el festival anterior.
    // 2026-09-08: Ana volvió a subir el afiche 2 veces más — esta versión
    // final ("festival jazz.png") es la que queda.
    imageUrl: "/assets/images/festival%20jazz.png",
    date: "Este fin de semana · 12 y 13 de septiembre",
    price: "Gratis",
    asientoAsignado: false,
    duracion: "2 días completos, con tarima principal y escenarios alternos.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Parque Metropolitano Simón Bolívar, Bogotá",
    curiosidadDelLugar: "Es parte de \"Festivales al Parque\", la serie de festivales gratuitos que el distrito organiza a lo largo del año en el Simón Bolívar (la misma familia de Rock al Parque, Salsa al Parque, Hip Hop al Parque y Colombia al Parque) — Jazz al Parque lleva más de dos décadas siendo uno de los más queridos, aunque nunca convoque tanta gente como Rock al Parque.",
    contextoBarrio: "El parque público más grande de Bogotá, con varios escenarios funcionando al mismo tiempo durante el festival.",
    rating: "9.4",
    ratingCount: 540,
    porQueDescubrir:
      "Más de dos décadas llevando jazz gratis al aire libre al parque más grande de la ciudad. Theaveling lo elige por ser, además de gratuito, uno de los pocos festivales de esta escala dedicados a un género que casi nunca llena estadios.",
    ficha: {
      presentaciones: "2 días, programación continua en varios escenarios",
      festivales: "parte de la serie \"Festivales al Parque\"",
      premios: "no aplica",
      origen: "programación cultural pública, con más de 20 ediciones",
      idioma: "Sin diálogo (música en vivo)",
    },
    artista: {
      nombre: "Festivales al Parque — Idartes",
      categoria: "Programación distrital de música",
      ciudad: "Bogotá, Colombia",
      saludo:
        "Llevamos jazz al parque hace más de dos décadas, gratis y al aire libre, para que no haga falta pagar entrada para escuchar buena música en vivo.",
    },
    resenas: [
      {
        nombre: "Natalia Q.",
        rating: "★ 9.5",
        fecha: "Hace 2 días",
        texto:
          "Lleva algo para sentarte y protector solar, se hacen largas las horas en el pasto pero vale cada una.",
      },
      {
        nombre: "Nicolás F.",
        rating: "★ 9.2",
        fecha: "Hace 1 semana",
        texto:
          "El escenario alterno tiene menos gente y se escucha igual de bien, buena opción si el principal está muy lleno.",
      },
      {
        nombre: "Carolina N.",
        rating: "★ 9.6",
        fecha: "Hace 3 semanas",
        texto:
          "Gratis y de nivel altísimo, cuesta creer que no hay que pagar entrada para ver esta calidad de artistas en vivo.",
      },
    ],
  },
  {
    id: "filbo-feria-del-libro",
    title: "FiLBo: Feria Internacional del Libro de Bogotá",
    tag: "Feria del libro",
    category: "Festivales",
    description:
      "Dos semanas donde la ciudad entera habla de libros: escritores, editoriales y lectores de toda la región reunidos en un mismo lugar.",
    venue: "Corferias",
    city: "Bogotá",
    venueCategoria: "Centro de convenciones y ferias",
    venueBarrio: "Salitre",
    // 2026-09-07: pieza gráfica oficial de FiLBo, subida por Ana — mismo
    // criterio que los otros dos festivales.
    // 2026-09-08: Ana volvió a subir el afiche como "filbo.png" — se
    // reemplaza acá (el archivo "filbo bogota.webp" anterior ya no
    // estaba en la carpeta).
    imageUrl: "/assets/images/filbo.png",
    // 2026-09-08, a pedido de Ana: el recorte centrado tapaba "15 de
    // Octubre" del lado derecho del afiche — se corre el encuadre hacia
    // la izquierda (mostrando más del lado derecho del afiche original)
    // para que el texto quede completo.
    imagePosition: "85% center",
    date: "En curso · hasta el 28 de septiembre",
    price: "$8.000 COP",
    asientoAsignado: false,
    duracion: "Dos semanas, con agenda propia cada día — conferencias, talleres y firmas de libros.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Av. Eldorado #52-43, Bogotá",
    curiosidadDelLugar: "Es el evento cultural literario más masivo de Colombia — cada edición invita a un país como protagonista, con su propia programación y pabellón dedicado dentro de la feria.",
    contextoBarrio: "Zona ferial y de negocios de Bogotá, con buena conexión de transporte público durante el evento.",
    rating: "9.0",
    ratingCount: 275,
    porQueDescubrir:
      "Dos semanas donde editoriales, escritores y lectores de toda la región se cruzan en un mismo lugar. Theaveling lo suma para no limitar 'Cultura' solo a experiencias en vivo — la lectura también es parte de la escena cultural de la ciudad.",
    ficha: {
      presentaciones: "Dos semanas, agenda diaria de conferencias y actividades",
      festivales: "no aplica — este perfil es del evento en sí",
      premios: "no aplica",
      origen: "feria anual, con país invitado de honor en cada edición",
      idioma: "Español, con invitados internacionales según el país de honor",
    },
    artista: {
      nombre: "Cámara Colombiana del Libro",
      categoria: "Organizador ferial",
      ciudad: "Bogotá, Colombia",
      saludo:
        "Dos semanas para que la ciudad entera hable de libros — desde las novedades editoriales hasta el país invitado de cada edición.",
    },
    resenas: [
      {
        nombre: "Daniela C.",
        rating: "★ 8.8",
        fecha: "Hace 4 días",
        texto:
          "Ve entre semana si puedes, los fines de semana se llena muchísimo y las filas para firmas se hacen eternas.",
      },
      {
        nombre: "Juan David R.",
        rating: "★ 9.1",
        fecha: "Hace 2 semanas",
        texto:
          "El pabellón del país invitado siempre vale la pena, este año tenía actividades que no esperaba encontrar en una feria de libros.",
      },
      {
        nombre: "Manuela S.",
        rating: "★ 8.9",
        fecha: "Hace 1 mes",
        texto:
          "Es grande de verdad, conviene planear qué charlas ver antes de llegar porque hay varias al mismo tiempo.",
      },
    ],
  },

  // 2026-09-08, a pedido de Ana: 15 experiencias nuevas para "Descubrimientos"
  // (venía con 7), usando fotos de la carpeta de stock "imagenes aleatorias
  // para ver mas" que subió para este fin específico. Selección hecha
  // "aleatoriamente y donde encuentre coherencia" — cada pieza se inventó
  // alrededor de lo que la foto sugiere visualmente, no al revés. Contenido
  // de primera pasada, mismo criterio que el resto del catálogo
  // (`porQueDescubrir`/`ficha`/`artista`/`resenas` inventados, pendientes de
  // revisión de Ana). 4 reseñas por pieza (no 5) — a pedido explícito de Ana
  // para esta tanda.
  //
  // `soloVerMas: true` en las 15 (ver esa nota en la interfaz `Experience`):
  // van a la pantalla "Ver más" de Descubrimientos, NO al scroll de la Home
  // — el riel de "Todo" sigue mostrando solo las 7 originales, la card
  // "+40" no se toca. El "+" de cada card de "Ver más" (acá, el fijo "+40")
  // es un número de primera pasada aparte, no tiene por qué coincidir con
  // cuántas piezas hay realmente en esa pantalla.
  {
    id: "trompeta-en-sombra",
    title: "Trompeta en Sombra: Sesión de Jazz Nocturno",
    tag: "Jazz nocturno",
    category: "Música",
    description:
      "Un trompetista improvisa a solas bajo un único foco, la sombra de su propio instrumento proyectada detrás como un segundo músico que nunca suena.",
    venue: "El Foso Jazz Bar",
    city: "Bogotá",
    venueCategoria: "Bar de jazz",
    venueBarrio: "Quinta Camacho",
    date: "Jueves 8 oct · 21:00",
    price: "$35.000 COP",
    duracion: "70 minutos, sin intermedio — set corrido de improvisación.",
    restriccionEdad: "+18 años — venue de bar, se sirve licor durante la función.",
    direccionCompleta: "Carrera 13 #67-22, Bogotá",
    curiosidadDelLugar:
      "El Foso funciona en el sótano de una casa republicana reformada — el nombre viene literalmente del foso original del edificio, hoy la pista donde toca la banda. Los jueves de trompeta solista llevan dos años llenando la barra completa.",
    contextoBarrio: "Zona residencial con varios bares pequeños de música en vivo, ambiente tranquilo entre semana.",
    rating: "9.0",
    ratingCount: 47,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/christian-agbede-wC1yNRJvq18-unsplash.jpg",
    porQueDescubrir:
      "Sin banda detrás, sin partitura fija: es un trompetista solo improvisando bajo un foco, nada más. Theaveling la eligió por reducir el jazz a su gesto más simple — una persona, un instrumento, una decisión por segundo.",
    ficha: {
      presentaciones: "sesión semanal, jueves, desde 2024",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "formato de improvisación libre, sin repertorio fijo",
      idioma: "Instrumental",
    },
    artista: {
      nombre: "Simón Rangel",
      categoria: "Trompetista solista",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Simón Rangel. No toco lo mismo dos jueves seguidos — llego con el foso vacío y dejo que la trompeta decida.",
    },
    resenas: [
      { nombre: "Camilo W.", rating: "★ 9.1", fecha: "Hace 3 días", texto: "Llega temprano, las mesas cerca de la tarima se llenan rápido entre semana." },
      { nombre: "Valentina G.", rating: "★ 8.8", fecha: "Hace 1 semana", texto: "Fui sola un jueves cualquiera y nadie te mira raro, el ambiente del bar ayuda." },
      { nombre: "Esteban Z.", rating: "★ 9.3", fecha: "Hace 3 semanas", texto: "No repite nada, cada sesión es distinta de verdad, vale la pena volver más de una vez." },
      { nombre: "Mariana K.", rating: "★ 8.6", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó Jazz al Parque — otra forma de ver improvisación en vivo, aunque acá es mucho más íntimo." },
    ],
  },
  {
    id: "voz-de-bolsillo",
    title: "Voz de Bolsillo: Sesión Acústica de Bar",
    tag: "Acústico íntimo",
    category: "Música",
    description:
      "Una cantautora hace su set sentada en un taburete, sin monitores ni banda, tan cerca del público que se escucha respirar entre canción y canción.",
    venue: "Café Rincón Once",
    city: "Bogotá",
    venueCategoria: "Café-bar con música en vivo",
    venueBarrio: "Palermo",
    date: "Viernes 16 oct · 20:00",
    price: "$20.000 COP",
    duracion: "50 minutos, repertorio propio sin covers.",
    restriccionEdad: "Todo público, aunque el ambiente es más de adultos por el horario.",
    direccionCompleta: "Calle 45A #17-08, Bogotá",
    curiosidadDelLugar:
      "Café Rincón Once cabe apenas veinte personas — las sillas se acomodan distinto cada noche según cuántos lleguen. No hay tarima, la cantautora se sienta al mismo nivel que el público.",
    contextoBarrio: "Barrio universitario con varios cafés pequeños, buen ambiente para llegar caminando de noche.",
    rating: "8.6",
    ratingCount: 29,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/fenghua--uqSsVEIT1Y-unsplash.jpg",
    porQueDescubrir:
      "No hay tarima ni monitores: la cantautora toca al mismo nivel que quien la escucha, tan cerca que se nota cuándo respira entre canciones. Theaveling la eligió por esa cercanía que ningún estadio puede ofrecer.",
    ficha: {
      presentaciones: "sesión mensual, desde 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "repertorio propio, canciones inéditas",
      idioma: "Español",
    },
    artista: {
      nombre: "Isabela Concha",
      categoria: "Cantautora",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Isabela Concha. Toco sentada, sin banda, para poder ver las caras de quienes escuchan — así compongo mejor la próxima canción.",
    },
    resenas: [
      { nombre: "Andrea M.", rating: "★ 8.9", fecha: "Hace 4 días", texto: "Reserva con tiempo, son pocas sillas y se llena rápido." },
      { nombre: "Julián T.", rating: "★ 8.3", fecha: "Hace 2 semanas", texto: "Fui solo un viernes y terminé hablando con la cantautora al final, el ambiente lo permite." },
      { nombre: "Paula H.", rating: "★ 8.7", fecha: "Hace 3 semanas", texto: "Canciones propias, nada de covers, se agradece que no sea la típica sesión de bar." },
      { nombre: "Santiago P.", rating: "★ 8.4", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó Recital de una Noche — otro formato pequeño y cercano." },
    ],
  },
  {
    id: "piano-al-aire",
    title: "Piano al Aire: Recital de Parque",
    tag: "Recital al aire libre",
    category: "Música",
    description:
      "Un piano de cola sale al parque un domingo en la mañana y una pianista toca para quien vaya pasando, sin escenario ni boletería de por medio.",
    venue: "Parque Nacional Enrique Olaya Herrera",
    city: "Bogotá",
    venueCategoria: "Parque público",
    venueBarrio: "Santa Teresita",
    date: "Domingo 11 oct · 11:00",
    price: "Gratis",
    duracion: "40 minutos de repertorio, se repite cada hora hasta el mediodía.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 7 con Calle 36, Bogotá",
    curiosidadDelLugar:
      "El piano se transporta hasta el parque en una camioneta adaptada y se afina en el sitio antes de cada función — quienes llegan temprano ven ese proceso también.",
    contextoBarrio: "Parque muy transitado los domingos, con ciclovía y varios puestos de comida cerca.",
    rating: "8.8",
    ratingCount: 64,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/maks_d-6qq2Xq-HFlk-unsplash.jpg",
    porQueDescubrir:
      "No hay boletería ni sillas asignadas: el piano sale al parque y toca para quien esté cerca, gente que iba de paso y se queda. Theaveling la eligió por sacar el recital de la sala y ponerlo donde nadie lo estaba buscando.",
    ficha: {
      presentaciones: "domingos alternos, desde 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "formato propio de piano itinerante",
      idioma: "Instrumental",
    },
    artista: {
      nombre: "Valeria Puentes",
      categoria: "Pianista",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Valeria Puentes. Prefiero tocar afuera, para gente que no compró boleta — a veces el mejor público es el que se detiene por accidente.",
    },
    resenas: [
      { nombre: "Daniela C.", rating: "★ 9.0", fecha: "Hace 5 días", texto: "Llega antes de las 11, se arma un círculo de gente y después cuesta acercarse bien." },
      { nombre: "Nicolás F.", rating: "★ 8.5", fecha: "Hace 2 semanas", texto: "Fui solo a caminar por el parque y terminé quedándome las tres tandas, ni lo tenía planeado." },
      { nombre: "Carolina N.", rating: "★ 8.9", fecha: "Hace 1 mes", texto: "No es todos los domingos, revisa bien la fecha antes de ir hasta allá." },
      { nombre: "David A.", rating: "★ 8.6", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Verde y Sonido — otra experiencia que saca la música del formato de sala." },
    ],
  },
  {
    id: "vals-en-azul",
    title: "Vals en Azul: Solo de Ballet",
    tag: "Ballet contemporáneo",
    category: "Danza",
    description:
      "Una bailarina sola en escena, iluminada apenas por un azul frío, repite el mismo giro hasta que deja de ser un paso de ballet y se vuelve otra cosa.",
    venue: "Teatro Astor",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "Rosales",
    date: "Sábado 24 oct · 19:00",
    price: "$45.000 COP",
    asientoAsignado: true,
    duracion: "35 minutos, pieza corta sin intermedio.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 85 #11-40, Bogotá",
    curiosidadDelLugar:
      "Teatro Astor tiene una sala pequeña pensada para piezas de un solo intérprete — el escenario mide apenas seis por seis metros, casi del tamaño de un estudio de ensayo.",
    contextoBarrio: "Zona residencial de estrato alto, buena oferta de restaurantes para ir antes o después de función.",
    rating: "9.2",
    ratingCount: 88,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/ariel-salgado-bp0fC50ExiY-unsplash.jpg",
    porQueDescubrir:
      "Es el mismo giro repetido durante media hora, hasta que el cuerpo se cansa y el movimiento cambia de sentido. Theaveling la eligió por convertir la repetición —lo más aburrido que puede pasar en un escenario— en el centro de la pieza.",
    ficha: {
      presentaciones: "temporada corta, 8 funciones",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, coreografía propia",
      idioma: "N/A — pieza sin texto",
    },
    artista: {
      nombre: "Antonia Reyes",
      categoria: "Bailarina de ballet contemporáneo",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Antonia Reyes. Repito el mismo giro treinta y cinco minutos porque me interesa el momento exacto en que deja de ser técnica y se vuelve cansancio.",
    },
    resenas: [
      { nombre: "Laura B.", rating: "★ 9.4", fecha: "Hace 2 días", texto: "Compra con tiempo, la sala es chiquita y se agota rápido para sábado." },
      { nombre: "Sebastián V.", rating: "★ 8.9", fecha: "Hace 1 semana", texto: "Fui solo y no dejé de mirar ni un segundo, la repetición hipnotiza más de lo que esperaba." },
      { nombre: "Andrés L.", rating: "★ 9.1", fecha: "Hace 3 semanas", texto: "Dura poco pero no le sobra nada, se siente completa igual." },
      { nombre: "Camila R.", rating: "★ 9.3", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó La consagración del otoño — otra pieza de danza que exige mirar con paciencia." },
    ],
  },
  {
    id: "piel-de-selva",
    title: "Piel de Selva: Danza Ritual Contemporánea",
    tag: "Danza ritual",
    category: "Danza",
    description:
      "Dos bailarinas cubiertas de pintura corporal se mueven entre proyecciones de selva, una coreografía que mezcla gesto ritual amazónico con vocabulario contemporáneo.",
    venue: "Nave Once",
    city: "Bogotá",
    venueCategoria: "Espacio escénico experimental",
    venueBarrio: "San Felipe",
    date: "Viernes 30 oct · 20:00",
    price: "$30.000 COP",
    duracion: "50 minutos, sin intermedio, aforo en el piso.",
    restriccionEdad: "+14 años — hay pintura corporal y vestuario mínimo.",
    direccionCompleta: "Calle 75 #20-15, Bogotá",
    curiosidadDelLugar:
      "Nave Once ocupa una antigua bodega textil — el piso de concreto pulido se dejó a propósito, sin tarima, para que la coreografía pueda usar todo el espacio disponible.",
    contextoBarrio: "Barrio de galerías y talleres de artistas, ambiente bohemio entre semana y fines de semana.",
    rating: "8.7",
    ratingCount: 33,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/bruno-dias-K-S1dt7V3NY-unsplash.jpg",
    porQueDescubrir:
      "Cruza gesto ritual amazónico con vocabulario de danza contemporánea, sin explicar cuál es cuál. Theaveling la eligió por no traducir del todo esa mezcla — deja que el cuerpo cargue con la ambigüedad.",
    ficha: {
      presentaciones: "6 funciones desde su estreno en 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, investigación de campo en el Amazonas colombiano",
      idioma: "N/A — pieza sin texto",
    },
    artista: {
      nombre: "Colectivo Raíz Doble",
      categoria: "Compañía de danza contemporánea",
      ciudad: "Bogotá, Colombia",
      saludo: "Somos Colectivo Raíz Doble. Investigamos gesto ritual amazónico durante casi un año antes de llevarlo a un vocabulario contemporáneo — no quisimos folclorizarlo ni quitarle el peso.",
    },
    resenas: [
      { nombre: "Manuela S.", rating: "★ 8.9", fecha: "Hace 6 días", texto: "Es en el piso, sin sillas — lleva algo para sentarte si te cuesta estar de pie tanto tiempo." },
      { nombre: "Juan David R.", rating: "★ 8.4", fecha: "Hace 2 semanas", texto: "Fui solo, el aforo es chico y se siente muy cerca de las bailarinas, casi incómodo de lo cerca." },
      { nombre: "Felipe O.", rating: "★ 8.8", fecha: "Hace 1 mes", texto: "No esperes que te expliquen nada, la pieza no traduce el ritual, hay que dejarse llevar." },
      { nombre: "Natalia Q.", rating: "★ 8.6", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Trance: Ritual Sonoro Colectivo — otra pieza que trabaja el ritual desde el cuerpo." },
    ],
  },
  {
    id: "el-payaso-de-la-plazoleta",
    title: "El Payaso de la Plazoleta",
    tag: "Clown callejero",
    category: "Performance",
    description:
      "Un payaso solitario recorre una plazoleta de noche, sin anunciarse ni pedir atención, hasta que alguien nota que sí está actuando y se detiene a mirar.",
    venue: "Plazoleta del Rosario",
    city: "Bogotá",
    venueCategoria: "Plaza pública",
    venueBarrio: "La Candelaria",
    date: "Sábado 7 nov · 20:00",
    price: "Gratis",
    duracion: "30 minutos, recorrido continuo sin horario fijo de inicio.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Plazoleta del Rosario, Bogotá",
    curiosidadDelLugar:
      "No hay marcación de dónde empieza ni termina la función — el payaso simplemente camina por la plazoleta como cualquier transeúnte hasta que algo en su gesto delata que está actuando.",
    contextoBarrio: "Zona histórica con mucho tránsito peatonal nocturno los fines de semana.",
    rating: "8.5",
    ratingCount: 52,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/alexiz-mora-803DZ7808YU-unsplash.jpg",
    porQueDescubrir:
      "No hay anuncio ni marco que separe la función de la calle real — el payaso camina como cualquier transeúnte hasta que un gesto lo delata. Theaveling la eligió por borrar esa línea a propósito, sin avisar cuándo empieza.",
    ficha: {
      presentaciones: "función semanal, sábados, desde 2024",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza de calle original, sin texto",
      idioma: "N/A — pieza sin diálogo",
    },
    artista: {
      nombre: "Tobías Lemos",
      categoria: "Payaso de calle",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Tobías Lemos. No aviso cuándo empiezo, camino como cualquiera hasta que alguien nota que algo no cuadra — ese momento es lo que busco.",
    },
    resenas: [
      { nombre: "Camilo W.", rating: "★ 8.6", fecha: "Hace 3 días", texto: "No hay hora exacta de inicio, llega con tiempo y camina por la plazoleta, ahí lo vas a encontrar." },
      { nombre: "Esteban Z.", rating: "★ 8.2", fecha: "Hace 1 semana", texto: "Fui solo de noche y al principio no sabía si era parte de la función o un transeúnte cualquiera, esa confusión es el punto." },
      { nombre: "Valentina G.", rating: "★ 8.7", fecha: "Hace 3 semanas", texto: "Es gratis y sin aviso previo, si pasas por la Candelaria un sábado de noche igual vale la pena buscarlo." },
      { nombre: "Mariana K.", rating: "★ 8.4", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó Comité del Fracaso: Ensayo Abierto — otra pieza de clown que juega con lo que el público espera." },
    ],
  },
  {
    id: "cuerpos-caidos",
    title: "Cuerpos Caídos: Intervención Urbana",
    tag: "Performance urbano",
    category: "Performance",
    description:
      "Un grupo grande de personas se deja caer al piso de una plaza al mismo tiempo, inmóviles, mientras la ciudad sigue caminando alrededor sin saber bien cómo reaccionar.",
    venue: "Plaza de Lourdes",
    city: "Bogotá",
    venueCategoria: "Plaza pública",
    venueBarrio: "La Esmeralda",
    date: "Domingo 15 nov · 16:00",
    price: "Gratis",
    duracion: "20 minutos de inmovilidad total, seguidos de una conversación abierta con el público.",
    restriccionEdad: "Todo público — se pide no interrumpir a quienes están en el piso.",
    direccionCompleta: "Plaza de Lourdes, Bogotá",
    curiosidadDelLugar:
      "El número de participantes cambia cada vez que se hace — a veces son cuarenta personas, a veces más de cien, dependiendo de quién se sume ese domingo.",
    contextoBarrio: "Plaza comercial muy transitada, con cafés y restaurantes alrededor.",
    rating: "8.9",
    ratingCount: 71,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/gary-parris-xzwP2N3pK7w-unsplash.jpg",
    porQueDescubrir:
      "El número de cuerpos en el piso cambia cada domingo según quién decida sumarse — no hay elenco fijo ni ensayo previo entre todos. Theaveling la eligió por convertir la plaza misma, con su gente de paso, en parte del elenco.",
    ficha: {
      presentaciones: "domingos alternos, desde 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza de participación abierta, sin elenco fijo",
      idioma: "N/A — pieza sin texto",
    },
    artista: {
      nombre: "Colectivo Aforo Cero",
      categoria: "Colectivo de arte de acción",
      ciudad: "Bogotá, Colombia",
      saludo: "Somos Colectivo Aforo Cero. No tenemos elenco fijo — cada domingo se suma quien quiera tirarse al piso con nosotros, eso es literalmente la pieza.",
    },
    resenas: [
      { nombre: "Andrés L.", rating: "★ 9.0", fecha: "Hace 4 días", texto: "Puedes sumarte tú también, no es solo para mirar, pregunta antes de empezar." },
      { nombre: "Julián T.", rating: "★ 8.5", fecha: "Hace 2 semanas", texto: "Fui solo a ver y terminé acostado en el piso con los demás, no lo tenía planeado." },
      { nombre: "Paula H.", rating: "★ 9.1", fecha: "Hace 3 semanas", texto: "La gente que pasa y no sabe qué es esto reacciona de formas muy distintas, eso también es parte de la gracia." },
      { nombre: "Santiago P.", rating: "★ 8.7", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó Vértigo de Tul: Coro Final — otra pieza que apuesta todo al conjunto antes que a una figura central." },
    ],
  },
  {
    id: "cuarto-propio-monologo",
    title: "Cuarto Propio: Monólogo entre Libros",
    tag: "Monólogo íntimo",
    category: "Teatro",
    description:
      "Una mujer se refugia entre pilas de libros regados por el piso de su cuarto, hablando sola hasta que queda claro que no está sola: nos habla a nosotros.",
    venue: "Sala Fenicia",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "Belén",
    date: "Jueves 12 nov · 19:30",
    price: "$28.000 COP",
    asientoAsignado: true,
    duracion: "60 minutos, sin intermedio.",
    restriccionEdad: "+14 años — temas de aislamiento y soledad tratados con crudeza.",
    direccionCompleta: "Calle 9 #4-51, Bogotá",
    curiosidadDelLugar:
      "Sala Fenicia monta la escenografía completa —cama, libros, cajones— sobre el mismo piso de madera original del edificio, sin tarima elevada, para que el público sienta que entra literalmente al cuarto.",
    contextoBarrio: "Barrio histórico del sur de La Candelaria, calles empedradas y poco tráfico de noche.",
    rating: "9.1",
    ratingCount: 24,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/fairuz-naufal-zaki-Fv6HWouf29k-unsplash.jpg",
    porQueDescubrir:
      "Empieza como un monólogo hablado a la nada y en algún punto, sin marcarlo, se vuelve una conversación directa con quien está mirando. Theaveling la eligió por ese quiebre que no se anuncia — hay que estar atento para notarlo.",
    ficha: {
      presentaciones: "temporada corta, 10 funciones",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, dramaturgia propia",
      idioma: "Español",
    },
    artista: {
      nombre: "Ámbar Cifuentes",
      categoria: "Actriz — pieza unipersonal",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Ámbar Cifuentes. Empiezo hablando sola, como si nadie me escuchara, y en algún momento —no aviso cuándo— empiezo a hablarle a quien está ahí sentado.",
    },
    resenas: [
      { nombre: "Daniela C.", rating: "★ 9.3", fecha: "Hace 2 días", texto: "La sala es pequeña, siéntate adelante si puedes, se pierde detalle desde el fondo." },
      { nombre: "David A.", rating: "★ 8.8", fecha: "Hace 1 semana", texto: "Fui solo y el quiebre hacia el público me tomó totalmente por sorpresa, no lo vi venir." },
      { nombre: "Nicolás F.", rating: "★ 9.0", fecha: "Hace 3 semanas", texto: "Los libros regados por el piso no son solo decoración, en un punto los usa, presta atención a los detalles." },
      { nombre: "Carolina N.", rating: "★ 9.2", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó Uno a Uno: Función a Puerta Cerrada — otra pieza que se siente hablada directo a vos." },
    ],
  },
  {
    id: "el-rostro-prestado",
    title: "El Rostro Prestado: Teatro de Máscara",
    tag: "Teatro de máscaras",
    category: "Teatro",
    description:
      "Un actor cambia de máscara cada pocos minutos y con ella cambia de personaje entero, sin salir nunca del mismo escenario vacío ni cambiarse de ropa.",
    venue: "Teatro del Tránsito",
    city: "Bogotá",
    venueCategoria: "Sala de teatro",
    venueBarrio: "Las Cruces",
    date: "Viernes 20 nov · 20:00",
    price: "$32.000 COP",
    asientoAsignado: true,
    duracion: "80 minutos, con siete cambios de máscara en escena.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 8 #4-30, Bogotá",
    curiosidadDelLugar:
      "Todas las máscaras de la función están talladas por el mismo actor —no las compra, las hace él— y se guardan a la vista del público en una mesa lateral del escenario durante toda la obra.",
    contextoBarrio: "Barrio tradicional del centro, calles angostas con historia, poco iluminado de noche.",
    rating: "8.8",
    ratingCount: 41,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/jayanth-muppaneni-9-g2xFGF3EA-unsplash.jpg",
    porQueDescubrir:
      "Las máscaras están a la vista todo el tiempo, sobre una mesa al lado del escenario — no hay truco ni cambio a escondidas, el público ve exactamente cuándo un personaje reemplaza a otro. Theaveling la eligió por hacer visible el mecanismo en vez de esconderlo.",
    ficha: {
      presentaciones: "8 funciones desde su estreno en 2025",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "pieza original, máscaras talladas por el propio actor",
      idioma: "Español",
    },
    artista: {
      nombre: "Horacio Bello",
      categoria: "Actor y tallador de máscaras",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Horacio Bello. Tallo cada máscara yo mismo antes de actuarla — cambiar de personaje siete veces en la misma obra no funciona si la máscara no pesa lo que tiene que pesar.",
    },
    resenas: [
      { nombre: "Camila R.", rating: "★ 9.0", fecha: "Hace 5 días", texto: "Siéntate cerca, los cambios de máscara son rápidos y desde el fondo se pierde el detalle de las manos." },
      { nombre: "Sebastián V.", rating: "★ 8.5", fecha: "Hace 2 semanas", texto: "Fui solo y conté los siete cambios, cada personaje tiene una voz distinta aunque sea el mismo actor." },
      { nombre: "Andrea M.", rating: "★ 8.9", fecha: "Hace 1 mes", texto: "Las máscaras quedan a la vista todo el rato, dan ganas de ir después a mirarlas de cerca." },
      { nombre: "Felipe O.", rating: "★ 8.6", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Sesión Subterránea: Ritual de Máscaras — otra pieza que trabaja con máscaras desde otro ángulo, más ritual." },
    ],
  },
  {
    id: "lectura-en-el-suelo",
    title: "Lectura en el Suelo: Voces entre Páginas",
    tag: "Lectura dramática",
    category: "Lecturas dramáticas",
    description:
      "Una lectora se sienta en el piso rodeada de libros abiertos y va leyendo fragmentos sueltos de cada uno, armando una historia nueva con pedazos de otras historias.",
    venue: "Casa Taller Egipto",
    city: "Bogotá",
    venueCategoria: "Casa cultural",
    venueBarrio: "Egipto",
    date: "Miércoles 25 nov · 19:00",
    price: "$18.000 COP",
    duracion: "45 minutos, sesión sentada en cojines en el piso.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Calle 6 #2-15, Bogotá",
    curiosidadDelLugar:
      "Casa Taller Egipto guarda cerca de dos mil libros donados por vecinos del barrio — la lectora elige los fragmentos de esa misma colección, nunca de libros propios.",
    contextoBarrio: "Barrio histórico de calles empinadas, vista privilegiada hacia el centro de la ciudad.",
    rating: "8.6",
    ratingCount: 18,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/fairuz-naufal-zaki-bvWcoZo6-jA-unsplash.jpg",
    porQueDescubrir:
      "Los fragmentos no son propios ni elegidos con anticipación por completo: salen de una biblioteca comunitaria armada por los vecinos del barrio. Theaveling la eligió por construir una historia nueva con lo que ya estaba ahí, donado por otros.",
    ficha: {
      presentaciones: "sesión mensual, desde 2024",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "selección de fragmentos de la biblioteca comunitaria del barrio",
      idioma: "Español",
    },
    artista: {
      nombre: "Rocío Vanegas",
      categoria: "Lectora escénica",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Rocío Vanegas. No leo libros míos — elijo entre los que la gente del barrio donó a la casa, así que la historia cambia según qué haya llegado ese mes.",
    },
    resenas: [
      { nombre: "Juan David R.", rating: "★ 8.8", fecha: "Hace 3 días", texto: "Es en el piso sobre cojines, lleva algo abrigado si vas de noche, la casa no tiene calefacción." },
      { nombre: "Manuela S.", rating: "★ 8.3", fecha: "Hace 1 semana", texto: "Fui sola y se siente muy hogareño, casi como estar en la sala de la casa de alguien." },
      { nombre: "Natalia Q.", rating: "★ 8.7", fecha: "Hace 3 semanas", texto: "Los libros cambian cada mes según lo que donen, así que no es la misma lectura dos veces." },
      { nombre: "Esteban Z.", rating: "★ 8.5", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Cartas No Enviadas: Lectura Dramática — otra lectura que arma su propia historia con fragmentos sueltos." },
    ],
  },
  {
    id: "la-sala-vacia",
    title: "La Sala Vacía: Ciclo de Cine Clásico",
    tag: "Cine clásico",
    category: "Cine",
    description:
      "Antes de cada función del ciclo, un actor sale a escena y le habla a la sala todavía vacía, como ensayando ante un público que llega diez minutos después a ocupar esos mismos asientos.",
    venue: "Teatro Colonial",
    city: "Bogotá",
    venueCategoria: "Sala de cine",
    venueBarrio: "Nicolás de Federmán",
    date: "Domingo 29 nov · 17:00",
    price: "$22.000 COP",
    asientoAsignado: true,
    duracion: "Introducción de 10 minutos más proyección de 100 minutos.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Avenida Caracas #45-12, Bogotá",
    curiosidadDelLugar:
      "Teatro Colonial fue sala de cine desde los años 50 y conserva casi todas sus butacas originales de madera — la introducción actuada nació porque a alguien le pareció una lástima que la sala se llenara solo diez minutos antes de apagar las luces.",
    contextoBarrio: "Zona con buen acceso en transporte público, cerca de varias universidades.",
    rating: "8.9",
    ratingCount: 56,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/jacob-mejicanos-dgMF8uWttkI-unsplash.jpg",
    porQueDescubrir:
      "Antes de la película hay una pieza corta actuada frente a una sala todavía vacía, como un ensayo que el público interrumpe al llegar. Theaveling la eligió por ese gesto extra que ningún cine convencional se molesta en dar.",
    ficha: {
      presentaciones: "ciclo mensual, desde 2023",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "programación curada de cine clásico restaurado, con introducción teatral propia",
      idioma: "Variable según la función",
    },
    artista: {
      nombre: "Teatro Colonial — Curaduría",
      categoria: "Programa curatorial",
      ciudad: "Bogotá, Colombia",
      saludo: "Somos la curaduría de Teatro Colonial. La introducción actuada nació de la lástima de ver la sala vacía diez minutos antes de cada función — ahora es parte fija del ciclo.",
    },
    resenas: [
      { nombre: "Laura B.", rating: "★ 9.0", fecha: "Hace 4 días", texto: "Llega temprano si quieres ver la introducción completa, mucha gente entra justo cuando empieza la película." },
      { nombre: "Andrés L.", rating: "★ 8.6", fecha: "Hace 1 semana", texto: "Fui solo un domingo y la sala tiene un encanto de cine viejo que ya no se ve mucho." },
      { nombre: "Camilo W.", rating: "★ 9.1", fecha: "Hace 3 semanas", texto: "Las butacas originales son de madera, no esperes la comodidad de un cine moderno." },
      { nombre: "Valentina G.", rating: "★ 8.7", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó El Último Carrete: Cine en 16mm — otro ciclo que cuida el formato clásico de proyección." },
    ],
  },
  {
    id: "pantalla-de-esquina",
    title: "Pantalla de Esquina: Noche de Cine Barrial",
    tag: "Cine de barrio",
    category: "Cine local",
    description:
      "Un bar de esquina cuelga una sábana blanca contra la pared del fondo y proyecta cine local una vez al mes, entre las mesas normales de cualquier noche de viernes.",
    venue: "Bar Proyector",
    city: "Bogotá",
    venueCategoria: "Bar-cine de barrio",
    venueBarrio: "Restrepo",
    date: "Sábado 5 dic · 21:00",
    price: "$15.000 COP",
    duracion: "Programación de 70 minutos, sin descanso entre cortos.",
    restriccionEdad: "+18 años — venue de bar, se sirve licor durante la función.",
    direccionCompleta: "Calle 19 Sur #16-04, Bogotá",
    curiosidadDelLugar:
      "La sábana que hace de pantalla es la misma desde que empezó la función, hace tres años — tiene manchas de proyector visibles que ya nadie se molesta en disimular.",
    contextoBarrio: "Barrio comercial y residencial, ambiente de barrio tradicional con mucha vida nocturna de fin de semana.",
    rating: "8.4",
    ratingCount: 22,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/asif-ul-haque-bxPEvaPudOA-unsplash.jpg",
    porQueDescubrir:
      "La pantalla es una sábana con manchas de tres años de uso, colgada contra la pared del fondo de un bar normal de barrio. Theaveling la eligió por no disfrazar de cine lo que en realidad es un bar que decidió proyectar películas.",
    ficha: {
      presentaciones: "función mensual, desde 2023",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "programación curada de cortometrajes bogotanos",
      idioma: "Español",
    },
    artista: {
      nombre: "Bar Proyector — Curaduría",
      categoria: "Programa curatorial",
      ciudad: "Bogotá, Colombia",
      saludo: "Somos la curaduría de Bar Proyector. No pretendemos ser un cine — somos un bar que un viernes al mes cuelga una sábana y proyecta lo que hacen los realizadores del barrio.",
    },
    resenas: [
      { nombre: "Mariana K.", rating: "★ 8.6", fecha: "Hace 6 días", texto: "Es un bar normal con proyección encima, no esperes silencio de sala de cine." },
      { nombre: "David A.", rating: "★ 8.1", fecha: "Hace 2 semanas", texto: "Fui solo y nadie se extraña, la mitad de la gente está ahí solo por el bar y descubre el cine de casualidad." },
      { nombre: "Paula H.", rating: "★ 8.5", fecha: "Hace 1 mes", texto: "La calidad de sonido no es la de un cine, pero el ambiente compensa." },
      { nombre: "Santiago P.", rating: "★ 8.3", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Noche de Cortos: Ciudad Invisible a 5 Km — otra muestra de cine hiperlocal, en formato más formal." },
    ],
  },
  {
    id: "sabanas-cineclub",
    title: "Sábanas: Cineclub de Cine Analógico",
    tag: "Cineclub experimental",
    category: "Cineclub",
    description:
      "Figuras cubiertas por completo con telas se mueven despacio entre proyecciones de películas rayadas y quemadas por el tiempo, borrando la línea entre lo que se proyecta y quién lo mira.",
    venue: "Cineclub Nictálope",
    city: "Bogotá",
    venueCategoria: "Cineclub",
    venueBarrio: "Santa Fe",
    date: "Jueves 10 dic · 22:00",
    price: "$25.000 COP",
    asientoAsignado: true,
    duracion: "65 minutos de proyección con intervención en vivo, sin intermedio.",
    restriccionEdad: "+18 años — función nocturna en zona de bares.",
    direccionCompleta: "Carrera 15 #33-08, Bogotá",
    curiosidadDelLugar:
      "Cineclub Nictálope solo proyecta material encontrado —cintas compradas en mercados de pulgas, rollos donados sin dueño conocido— nunca cine restaurado ni digitalizado en alta calidad.",
    contextoBarrio: "Zona de vida nocturna intensa, mejor moverse acompañado después de la función.",
    rating: "9.0",
    ratingCount: 39,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/hulki-okan-tabak-36nkusNL0mA-unsplash.jpg",
    porQueDescubrir:
      "Todo lo que se proyecta es material encontrado, sin restaurar — rayado, quemado, a veces casi ilegible. Theaveling la eligió por dejar que el deterioro mismo de la cinta sea parte del espectáculo, no un defecto que se disculpa.",
    ficha: {
      presentaciones: "función mensual, desde 2024",
      festivales: "sin festivales todavía",
      premios: "sin premios",
      origen: "programación de cine encontrado (found footage), con intervención en vivo",
      idioma: "Variable según la función",
    },
    artista: {
      nombre: "Cineclub Nictálope — Curaduría",
      categoria: "Programa curatorial",
      ciudad: "Bogotá, Colombia",
      saludo: "Somos Cineclub Nictálope. Buscamos cintas sin dueño en mercados de pulgas y las proyectamos tal como llegan, rayadas y quemadas — no restauramos nada.",
    },
    resenas: [
      { nombre: "Julián T.", rating: "★ 9.2", fecha: "Hace 3 días", texto: "Es nocturno de verdad, empieza tarde, no es plan para madrugar al otro día." },
      { nombre: "Camila R.", rating: "★ 8.7", fecha: "Hace 1 semana", texto: "Fui sola y el ambiente es más silencioso de lo que esperaba para ser cineclub, se respeta mucho la proyección." },
      { nombre: "Andrea M.", rating: "★ 9.1", fecha: "Hace 3 semanas", texto: "Las cintas se ven mal a propósito, si buscas alta definición este no es tu plan." },
      { nombre: "Nicolás F.", rating: "★ 8.8", fecha: "Hace 1 mes", texto: "Si te gustó esto, también me gustó Película: Archivo 22, Función Nocturna — otro programa de cine experimental nocturno." },
    ],
  },
  {
    id: "charla-oficio-de-la-mascara",
    title: "Charla: El Oficio Detrás de la Máscara",
    tag: "Charla de oficio",
    category: "Charlas",
    description:
      "Un tallador de máscaras muestra su taller completo mientras conversa sobre el oficio, con piezas terminadas y a medio hacer colgadas alrededor del público.",
    venue: "Taller de Máscaras Perseverancia",
    city: "Bogotá",
    venueCategoria: "Taller artesanal",
    venueBarrio: "La Perseverancia",
    date: "Sábado 12 dic · 17:00",
    price: "Gratis",
    duracion: "60 minutos, incluye espacio de preguntas del público.",
    restriccionEdad: "Todo público.",
    direccionCompleta: "Carrera 5 Este #26-14, Bogotá",
    curiosidadDelLugar:
      "El taller conserva máscaras de todas las obras en las que su dueño ha trabajado en los últimos veinte años, colgadas del techo y las paredes sin ningún orden aparente.",
    contextoBarrio: "Barrio tradicional de artesanos, calles angostas con historia obrera.",
    rating: "8.3",
    ratingCount: 14,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/c-k-DPeefAuAE0s-unsplash.jpg",
    porQueDescubrir:
      "No es una charla en auditorio: pasa dentro del taller real, entre máscaras de veinte años de trabajo colgadas sin ningún orden. Theaveling la eligió por dejar ver el desorden real de un oficio en vez de una versión limpia para exhibición.",
    ficha: {
      presentaciones: "charla única (evento especial)",
      festivales: "N/A — es una charla, no una obra",
      premios: "N/A",
      origen: "conversación original, no es una reposición",
      idioma: "Español",
    },
    artista: {
      nombre: "Wilson Quiroga",
      categoria: "Tallador de máscaras",
      ciudad: "Bogotá, Colombia",
      saludo: "Soy Wilson Quiroga. Llevo veinte años tallando máscaras para teatro — mi taller no está ordenado para visitas, así que quien venga lo va a ver tal cual es todos los días.",
    },
    resenas: [
      { nombre: "Esteban Z.", rating: "★ 8.5", fecha: "Hace 5 días", texto: "Es gratis pero el taller es chico, llega con tiempo para conseguir buen lugar." },
      { nombre: "Valentina G.", rating: "★ 8.0", fecha: "Hace 2 semanas", texto: "Fui sola y Wilson conversa muy fácil, no se siente una charla formal sino una visita a su taller." },
      { nombre: "Mariana K.", rating: "★ 8.4", fecha: "Hace 1 mes", texto: "Las máscaras cuelgan de todos lados, tómate tiempo para mirarlas antes de que empiece." },
      { nombre: "Camilo W.", rating: "★ 8.2", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Charla: El Arte que Habita la Calle — otra charla que prefiere mostrar el oficio real antes que una versión pulida." },
    ],
  },
  {
    id: "taller-abierto-cuerpo-en-escena",
    title: "Taller Abierto: Cuerpo en Escena",
    tag: "Laboratorio de movimiento",
    category: "Talleres",
    description:
      "Un taller de movimiento donde quienes no están bailando se sientan alrededor a mirar, y cada tanto cambian de lugar con quienes sí están en el centro.",
    venue: "Galpón 12",
    city: "Bogotá",
    venueCategoria: "Espacio de ensayo",
    venueBarrio: "Usaquén",
    date: "Domingo 20 dic · 15:00",
    price: "$26.000 COP",
    duracion: "2 horas, con rotación de grupos cada 20 minutos.",
    restriccionEdad: "+14 años — taller participativo con contacto físico moderado.",
    direccionCompleta: "Carrera 7 #119-30, Bogotá",
    curiosidadDelLugar:
      "Galpón 12 fue bodega de una fábrica de muebles — las sillas de madera que usa el taller para el público que observa son piezas descartadas de esa misma fábrica, restauradas por quienes dan la clase.",
    contextoBarrio: "Zona residencial tranquila, buena oferta de transporte los domingos.",
    rating: "8.7",
    ratingCount: 35,
    rail: "descubrimientos",
    soloVerMas: true,
    imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/anita-jankovic-UhVw9TMXxF8-unsplash.jpg",
    porQueDescubrir:
      "Nadie se queda solo mirando todo el taller: cada veinte minutos quienes observan desde las sillas cambian de lugar con quienes están moviéndose en el centro. Theaveling la eligió por no dejar a nadie del lado fijo de espectador.",
    ficha: {
      presentaciones: "clase abierta mensual, desde 2025",
      festivales: "N/A — es un taller, no una obra",
      premios: "N/A",
      origen: "formato propio del espacio, no es una reposición",
      idioma: "Español",
    },
    artista: {
      nombre: "Colectivo Galpón 12",
      categoria: "Espacio de formación en movimiento",
      ciudad: "Bogotá, Colombia",
      saludo: "Somos Colectivo Galpón 12. Nadie se queda fijo mirando toda la clase — cada veinte minutos rotamos, así que quien mira también termina moviéndose.",
    },
    resenas: [
      { nombre: "Felipe O.", rating: "★ 9.0", fecha: "Hace 4 días", texto: "Lleva ropa cómoda aunque pienses que solo vas a mirar, en algún momento te toca moverte." },
      { nombre: "Natalia Q.", rating: "★ 8.4", fecha: "Hace 2 semanas", texto: "Fui sola sin experiencia previa y la rotación ayuda mucho a perder la vergüenza inicial." },
      { nombre: "Juan David R.", rating: "★ 8.9", fecha: "Hace 1 mes", texto: "Las sillas restauradas de la fábrica de muebles son un detalle bonito, pregúntale a los profes por su historia." },
      { nombre: "Daniela C.", rating: "★ 8.5", fecha: "Hace 2 meses", texto: "Si te gustó esto, también me gustó Clase de improvisación del ritmo escénico — otro taller que se construye distinto cada vez según quién llegue." },
    ],
  },

  // 2026-09-08, a pedido de Ana ("las otras tienes que apelar al número
  // que ponga en la card de ver más"): 8 experiencias nuevas para "Más
  // reservados" (tenía 7, target histórico documentado como "+15" antes
  // de que ese número pasara a mostrar la cantidad real — ver nota vieja
  // en Descubrir.tsx). `soloVerMas: true` en las 8: van a la pantalla
  // "Ver más" de Más reservados, NO al scroll de la Home (mismo criterio
  // que las 15 de Descubrimientos). Fotos de la carpeta de stock
  // "imagenes aleatorias para ver mas", elegidas mirando cada imagen
  // primero e inventando la pieza alrededor de lo que sugiere. Contenido
  // de primera pasada, mismo criterio que el resto del catálogo. 4
  // reseñas por pieza.
{
  id: "cantaros-danza-de-patio",
  title: "Cántaros: Danza de Patio",
  tag: "Danza folclórica de patio",
  category: "Danza",
  description:
    "Seis bailarinas giran con faldas largas mientras equilibran vasijas de barro en la cabeza, acompañadas por músicos en vivo alrededor de un patio colonial. Una coreografía propia inspirada en danzas de cosecha y celebración de varias regiones de Latinoamérica, sin representar una tradición puntual.",
  venue: "El Patio de las Tinajas",
  city: "Bogotá",
  venueCategoria: "Casona con patio colonial",
  venueBarrio: "Usaquén",
  date: "Jueves 8 oct · 20:00",
  price: "$45.000 COP",
  asientoAsignado: false,
  duracion:
    "70 minutos sin intermedio, seguidos de un espacio corto para fotos con las bailarinas si el grupo alcanza a quedarse.",
  restriccionEdad: "Todo público. Los niños pequeños pueden sentarse en cojines de primera fila si llegan temprano.",
  direccionCompleta: "Calle 119 #6-14, Bogotá",
  curiosidadDelLugar:
    "Las tinajas de barro que las bailarinas llevan en la cabeza son las mismas que decoran el patio como maceteros el resto de la semana — las bajan y las lavan antes de cada función. La casona es una de las pocas construcciones de la zona que conserva su patio central original de finales del siglo XIX.",
  contextoBarrio:
    "Usaquén conserva su trazado de pueblo colonial entre restaurantes y galerías, con un mercado de pulgas los domingos que atrae tanto a vecinos como a visitantes de otras zonas de la ciudad.",
  rating: "9.1",
  ratingCount: 145,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/a-l-rs1SRVAqd6c-unsplash.jpg",
  porQueDescubrir:
    "No es un espectáculo de museo ni una clase para turistas: es una compañía que ensaya semana a semana y que arriesga caídas reales cada vez que gira con una vasija llena en la cabeza. Theaveling la eligió por esa tensión entre precisión técnica y riesgo visible, servida en un formato de cena que la hace sentir más celebración que función.",
  ficha: {
    presentaciones: "12 funciones desde su estreno en 2024",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen:
      "coreografía original inspirada en danzas de patio y cosecha de varias regiones de Latinoamérica, sin representar una tradición específica",
    idioma: "Sin diálogo (solo música en vivo)",
  },
  artista: {
    nombre: "Compañía Cántaro",
    categoria: "Compañía de danza folclórica",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Somos Compañía Cántaro. Empezamos ensayando en un garaje con vasijas plásticas antes de atrevernos con barro de verdad — cada función es, todavía, un poco un acto de fe.",
  },
  resenas: [
    {
      nombre: "Laura B.",
      rating: "★ 9.3",
      fecha: "Hace 4 días",
      texto:
        "Llega 20 minutos antes — te dan un vino de bienvenida en el patio y ver a las bailarinas calentar ya vale la entrada.",
    },
    {
      nombre: "Nicolás F.",
      rating: "★ 8.8",
      fecha: "Hace 1 semana",
      texto:
        "Fui solo y terminé sentado en la mesa de una familia que no conocía — el formato de patio compartido hace que no se sienta raro ir sin compañía.",
    },
    {
      nombre: "Camila R.",
      rating: "★ 9.0",
      fecha: "Hace 3 semanas",
      texto:
        "Si te gustó Vals en Azul, esta también confía en el cuerpo antes que en el discurso, aunque acá el riesgo es literal: una vasija que se cae rompe la ilusión al instante.",
    },
    {
      nombre: "Julián T.",
      rating: "★ 9.4",
      fecha: "Hace 2 meses",
      texto:
        "El patio en sí, de noche, con las tinajas iluminadas, ya justifica la visita antes de que empiece la música.",
    },
  ],
},
{
  id: "aire-en-vilo-sesion-de-vientos",
  title: "Aire en Vilo: Sesión de Vientos",
  tag: "Sesión acústica de vientos",
  category: "Música",
  description:
    "Un trío de flauta traversa, clarinete bajo y percusión menor toca a un metro del público, sin amplificación de más, en un bar diseñado para que se escuche hasta la respiración entre frases. Composiciones propias que tratan el aire como instrumento en sí mismo.",
  venue: "Casa del Fuelle",
  city: "Bogotá",
  venueCategoria: "Bar de conciertos íntimos",
  venueBarrio: "Chapinero",
  date: "Viernes 16 oct · 21:00",
  price: "$30.000 COP",
  asientoAsignado: false,
  duracion: "50 minutos sin intermedio — formato de sesión, no de concierto tradicional.",
  restriccionEdad: "Todo público, aunque el ambiente y el horario son más de adultos.",
  direccionCompleta: "Carrera 9 #63-21, Bogotá",
  curiosidadDelLugar:
    "El local fue una imprenta hasta los años 90 y todavía conserva parte del cableado eléctrico original visible en el techo, que los dueños decidieron dejar como parte de la decoración. El aislamiento acústico es artesanal —paneles de espuma cubiertos en tela— y por eso solo caben 35 personas por función.",
  contextoBarrio:
    "Chapinero mezcla edificios de apartamentos de mitad de siglo con bares pequeños escondidos en segundos pisos, muchos sin aviso visible desde la calle.",
  rating: "8.7",
  ratingCount: 88,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/akbar-nemati-hSYY_GFO-7A-unsplash.jpg",
  porQueDescubrir:
    "Sin batería ni bajo que llenen los silencios, cada respiración de los vientos queda expuesta — el trío compone pensando explícitamente en ese vacío. Theaveling la eligió por el aforo mínimo: a esa distancia, se escucha el aire entrando al instrumento antes que la nota misma.",
  ficha: {
    presentaciones: "9 sesiones desde 2025",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "composiciones originales para flauta traversa, clarinete bajo y percusión menor",
    idioma: "Instrumental",
  },
  artista: {
    nombre: "Trío Hondura",
    categoria: "Trío acústico experimental",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Somos Trío Hondura. Componemos pensando en lo que pasa entre las notas, no solo en las notas — por eso tocamos tan cerca del público, para que ese espacio también se escuche.",
  },
  resenas: [
    {
      nombre: "Mariana K.",
      rating: "★ 9.0",
      fecha: "Hace 6 días",
      texto: "Solo 35 cupos — se agota entre semana, no dejes la compra para el mismo día.",
    },
    {
      nombre: "Esteban Z.",
      rating: "★ 8.2",
      fecha: "Hace 2 semanas",
      texto:
        "Fui solo un jueves cualquiera y terminé conversando con el clarinetista al final — el formato invita a quedarse un rato después.",
    },
    {
      nombre: "Valentina G.",
      rating: "★ 8.9",
      fecha: "Hace 1 mes",
      texto:
        "Se nota el trabajo en la afinación entre los tres — nada suena improvisado aunque parezca informal.",
    },
    {
      nombre: "David A.",
      rating: "★ 8.6",
      fecha: "Hace 2 meses",
      texto:
        "Si te gustó Trompeta en Sombra, esta sesión comparte esa obsesión por el instrumento de viento como protagonista casi solitario.",
    },
  ],
},
{
  id: "luz-de-vitral-concierto-indie",
  title: "Luz de Vitral: Concierto Indie",
  tag: "Indie folk en sala pequeña",
  category: "Música",
  description:
    "Una banda de cuatro integrantes toca canciones propias bajo el techo pintado de un antiguo teatro de cine mudo, ahora reconvertido en sala de conciertos, con público de pie a pocos metros del escenario. Folk indie en español con guiños a la música andina.",
  venue: "Salón Renacimiento",
  city: "Bogotá",
  venueCategoria: "Teatro reconvertido en sala de conciertos",
  venueBarrio: "Santa Fe",
  date: "Sábado 24 oct · 20:30",
  price: "$35.000 COP",
  asientoAsignado: false,
  duracion:
    "80 minutos con un corto intermedio de 10 minutos para que la banda cambie de instrumentos entre sets.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Calle 19 #14-32, Bogotá",
  curiosidadDelLugar:
    "El techo pintado a mano data de cuando el edificio funcionaba como sala de cine mudo en los años 20, y sobrevivió intacto a tres cambios de dueño. Hoy la sala programa sobre todo bandas emergentes, con capacidad reducida a propósito para no perder la escala íntima del lugar.",
  contextoBarrio:
    "Santa Fe conserva varios teatros de principios del siglo XX en distintos estados de restauración, entre calles del centro que mezclan comercio antiguo con vida nocturna nueva.",
  rating: "8.5",
  ratingCount: 132,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/alex-g-CjOf2BC1Aw4-unsplash.jpg",
  porQueDescubrir:
    "La banda lleva tres años tocando en salas pequeñas antes de grabar nada, y se nota: las canciones están hechas para sonar en vivo primero. Theaveling la eligió por el contraste entre el escenario ornamentado y la informalidad casi de ensayo con la que tocan.",
  ficha: {
    presentaciones: "20 funciones desde 2023",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen:
      "canciones propias en español, con influencias del folk norteamericano y la música andina",
    idioma: "Español",
  },
  artista: {
    nombre: "Los Cristales",
    categoria: "Banda de folk indie",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Somos Los Cristales. Empezamos tocando en la sala de la casa de la baterista y todavía preferimos las salas pequeñas — se siente más parecido a eso.",
  },
  resenas: [
    {
      nombre: "Camilo W.",
      rating: "★ 8.9",
      fecha: "Hace 5 días",
      texto: "Llega temprano si quieres estar cerca del escenario — no hay asientos y se llena rápido en la mitad.",
    },
    {
      nombre: "Natalia Q.",
      rating: "★ 8.0",
      fecha: "Hace 2 semanas",
      texto: "Fui sola sin conocer la banda y salí con el nombre anotado en el celular — buena puerta de entrada.",
    },
    {
      nombre: "Sebastián V.",
      rating: "★ 8.4",
      fecha: "Hace 1 mes",
      texto: "El techo pintado se ve mejor de lo que esperaba en fotos — vale la pena mirar hacia arriba entre canciones.",
    },
    {
      nombre: "Andrea M.",
      rating: "★ 8.7",
      fecha: "Hace 2 meses",
      texto: "Si te gustó Recital de una Noche, este concierto tiene esa misma sensación de estar viendo algo antes de que se vuelva grande.",
    },
  ],
},
{
  id: "plumas-y-vals-cabaret-de-medianoche",
  title: "Plumas y Vals: Cabaret de Medianoche",
  tag: "Cabaret contemporáneo",
  category: "Performance",
  description:
    "Un número de cabaret contemporáneo —plumas, tacones y un salto de pierna que casi toca el techo— dentro de un salón de baile art-decó restaurado, con mesas altas alrededor del escenario en vez de butacas. Mezcla de cabaret clásico europeo y humor bogotano.",
  venue: "Salón Astoria",
  city: "Bogotá",
  venueCategoria: "Salón de eventos art-decó",
  venueBarrio: "Quinta Camacho",
  date: "Jueves 5 nov · 21:00",
  price: "$45.000 COP",
  asientoAsignado: false,
  duracion:
    "75 minutos sin intermedio — el formato de cabaret no lo permite, hay entradas y salidas de artistas constantes.",
  restriccionEdad: "+16 años — humor adulto y algo de piel, propios del formato.",
  direccionCompleta: "Carrera 13 #70-45, Bogotá",
  curiosidadDelLugar:
    "El salón fue la sala de baile de una casa republicana privada y conserva su piso de parqué original, pulido de nuevo hace apenas dos años. Los espejos biselados de las paredes son parte del diseño original de los años 40.",
  contextoBarrio:
    "Quinta Camacho es un barrio de casas republicanas de calles tranquilas, muchas convertidas en restaurantes y salones de eventos sin perder su fachada residencial.",
  rating: "9.3",
  ratingCount: 210,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/eryk-piotr-munk-cu7VNLe0ct0-unsplash.jpg",
  porQueDescubrir:
    "No es un show de imitación de cabaret europeo: el colectivo escribe sus propios números y los actualiza cada temporada con referencias locales. Theaveling la eligió por el nivel físico exigido —los saltos y giros no tienen doble ni truco de cámara— servido con la cercanía de un salón, no de un teatro grande.",
  ficha: {
    presentaciones: "15 funciones desde 2025",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "número original, mezcla de cabaret clásico europeo y humor bogotano",
    idioma: "Español (con partes sin diálogo)",
  },
  artista: {
    nombre: "La Compañía del Plumón",
    categoria: "Colectivo de cabaret",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Somos La Compañía del Plumón. Nos gusta que el público esté cerca, casi en la pista — el cabaret pierde algo esencial si se ve desde muy lejos.",
  },
  resenas: [
    {
      nombre: "Paula H.",
      rating: "★ 9.5",
      fecha: "Hace 3 días",
      texto: "Reserva mesa alta cerca del escenario si puedes — desde el fondo se pierde parte del trabajo de piernas.",
    },
    {
      nombre: "Felipe O.",
      rating: "★ 9.0",
      fecha: "Hace 1 semana",
      texto: "Fui solo un jueves y nadie te mira raro por venir sin pareja — el ambiente es más de amigos sueltos que de citas.",
    },
    {
      nombre: "Manuela S.",
      rating: "★ 9.4",
      fecha: "Hace 3 semanas",
      texto: "El humor es más filoso de lo que esperaba, en el buen sentido — no es solo estética, hay texto detrás.",
    },
    {
      nombre: "Santiago P.",
      rating: "★ 8.8",
      fecha: "Hace 2 meses",
      texto: "Si te gustó El Payaso de la Plazoleta, esta pieza también juega con el cuerpo como chiste, aunque acá todo esté mucho más pulido.",
    },
  ],
},
{
  id: "manos-que-hablan-taller-de-marionetas",
  title: "Manos que Hablan: Taller de Marionetas",
  tag: "Taller de títeres para adultos",
  category: "Talleres",
  description:
    "Un taller de tres horas para construir tu propia marioneta de hilo, rodeado de decenas de títeres antiguos colgados como referencia, y terminar la sesión haciéndola caminar por primera vez. Materiales incluidos, cupo reducido.",
  venue: "Taller El Hilo Suelto",
  city: "Bogotá",
  venueCategoria: "Taller-galería de títeres",
  venueBarrio: "La Candelaria",
  date: "Sábado 14 nov · 15:00",
  price: "$40.000 COP",
  duracion: "3 horas, con un descanso corto de 15 minutos a la mitad.",
  restriccionEdad: "+12 años — requiere destreza manual con herramientas pequeñas (agujas, alicates finos).",
  direccionCompleta: "Calle 9 #2-14, Bogotá",
  curiosidadDelLugar:
    "Los títeres que cuelgan de las paredes son parte de la colección personal del fundador, reunida durante más de veinte años en mercados y talleres de otros países. Algunos tienen más de cuarenta años y todavía se usan como modelo de articulación para los talleres.",
  contextoBarrio:
    "La Candelaria conserva calles empedradas y casas coloniales convertidas en talleres de oficio, entre el flujo constante de turistas y la vida de barrio que sigue funcionando detrás de las fachadas.",
  rating: "8.9",
  ratingCount: 64,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/beth-macdonald-CWrqG5xsk6c-unsplash.jpg",
  porQueDescubrir:
    "No es una manualidad rápida: cada marioneta requiere entender de dónde cuelga el peso del cuerpo para que camine sin enredarse. Theaveling lo eligió porque el taller no se queda en la teoría — todos salen con un títere propio, torpe o no, que efectivamente camina.",
  ficha: {
    presentaciones: "30 talleres dictados desde 2024",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "técnica de construcción de marionetas de hilo con materiales reciclados",
    idioma: "Español",
  },
  artista: {
    nombre: "Taller El Hilo Suelto",
    categoria: "Taller de construcción de títeres",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Somos El Hilo Suelto. Llevamos años coleccionando títeres antes de decidirnos a enseñar a hacerlos — creemos que entender el peso de un cuerpo de madera cambia cómo uno mira cualquier función de títeres después.",
  },
  resenas: [
    {
      nombre: "Daniela C.",
      rating: "★ 9.1",
      fecha: "Hace 1 semana",
      texto: "Cupo de 10 personas, se llena rápido — resérvalo con al menos dos semanas de anticipación.",
    },
    {
      nombre: "Andrés L.",
      rating: "★ 8.5",
      fecha: "Hace 3 semanas",
      texto: "Fui solo sin saber nada de manualidades y terminé con una marioneta que camina de verdad — el instructor no deja a nadie atrás.",
    },
    {
      nombre: "Carolina N.",
      rating: "★ 9.0",
      fecha: "Hace 1 mes",
      texto: "Las tres horas se sienten cortas cuando ya llevas la marioneta armada y estás ajustando los hilos.",
    },
    {
      nombre: "Nicolás F.",
      rating: "★ 8.7",
      fecha: "Hace 2 meses",
      texto: "Si te gustó el Taller de Escritura Escénica, este comparte esa lógica de terminar con algo propio en la mano, no solo con apuntes.",
    },
  ],
},
{
  id: "cuarto-deshecho-lectura-en-escena",
  title: "Cuarto Deshecho: Lectura en Escena",
  tag: "Lectura dramatizada íntima",
  category: "Lecturas dramáticas",
  description:
    "Una actriz sola, arrodillada entre libros regados por el piso de un cuarto a medio armar, lee en voz alta cartas y diarios encontrados en mercados de pulgas de Bogotá. Una sala pequeña, sin escenografía más allá de lo estrictamente necesario.",
  venue: "Biblioteca Errante",
  city: "Bogotá",
  venueCategoria: "Sala de lectura escénica",
  venueBarrio: "Teusaquillo",
  date: "Viernes 20 nov · 20:00",
  price: "$25.000 COP",
  asientoAsignado: false,
  duracion: "55 minutos sin intermedio.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 24 #39-51, Bogotá",
  curiosidadDelLugar:
    "Los libros regados por el piso durante la función son donados por vecinos del barrio y cambian ligeramente de una temporada a otra. Antes y después de la función, el público puede quedarse a hojearlos en la sala, que funciona también como pequeña biblioteca de intercambio.",
  contextoBarrio:
    "Teusaquillo es un barrio arbolado de casas republicanas cerca de universidades, con cafés literarios y una vida de barrio pausada frente al ritmo del centro.",
  rating: "8.6",
  ratingCount: 57,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/fairuz-naufal-zaki-qh92IB0-ZjY-unsplash.jpg",
  porQueDescubrir:
    "El texto no es ficción inventada desde cero: parte de cartas y diarios reales que nadie reclamó, leídos con la distancia justa para no volverlos morbosos. Theaveling la eligió por esa tensión entre lo íntimo del material y lo pública que se vuelve la voz que lo lee en voz alta.",
  ficha: {
    presentaciones: "7 funciones desde 2025",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "texto original basado en cartas y diarios encontrados en mercados de pulgas de Bogotá",
    idioma: "Español",
  },
  artista: {
    nombre: "Mónica Reyes",
    categoria: "Actriz y lectora escénica",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Soy Mónica Reyes. Llevo años comprando cajas de cartas viejas en mercados de pulgas sin saber bien para qué — esta lectura es lo que finalmente encontré que hacer con ellas.",
  },
  resenas: [
    {
      nombre: "Esteban Z.",
      rating: "★ 8.8",
      fecha: "Hace 4 días",
      texto: "Sala muy pequeña — si te sientas en la primera fila, la actriz prácticamente lee mirándote a los ojos.",
    },
    {
      nombre: "Andrea M.",
      rating: "★ 8.3",
      fecha: "Hace 2 semanas",
      texto: "Fui sola y me quedé después a hojear los libros del piso — nadie apura a nadie para salir.",
    },
    {
      nombre: "David A.",
      rating: "★ 8.9",
      fecha: "Hace 1 mes",
      texto: "Si te gustó Cartas No Enviadas, esta lectura toca una fibra parecida, aunque acá el material es encontrado, no escrito para la obra.",
    },
    {
      nombre: "Carolina N.",
      rating: "★ 8.5",
      fecha: "Hace 2 meses",
      texto: "Corta pero densa — no es una obra para llegar cansado, hay que poder concentrarse en el texto.",
    },
  ],
},
{
  id: "la-comadre-del-burro-comedia-de-calle",
  title: "La Comadre del Burro: Comedia de Calle",
  tag: "Performance folclórico y humor",
  category: "Performance",
  description:
    "Un personaje folclórico con falda de colores y un burro de peluche que ella misma maneja como si hablara, hace reír a todo un salón comunal con chistes de doble sentido y burlas cariñosas al público. Un personaje inventado a partir del carnaval y las fiestas de barrio bogotanas.",
  venue: "Casa Cultural La Perse",
  city: "Bogotá",
  venueCategoria: "Casa cultural de barrio",
  venueBarrio: "La Perseverancia",
  date: "Jueves 3 dic · 21:00",
  price: "Gratis",
  asientoAsignado: false,
  duracion: "40 minutos, formato de calle — el público puede moverse y no hay asientos fijos.",
  restriccionEdad: "Todo público — pensado también para asistir en familia.",
  direccionCompleta: "Carrera 5 Este #26-10, Bogotá",
  curiosidadDelLugar:
    "El burro de peluche tiene nombre propio —Efraín— y ya lleva más de una década apareciendo en las fiestas del barrio, remendado varias veces. La casa cultural funciona en lo que antes fue una fábrica de tejidos pequeña, reconvertida por la comunidad en los años 90.",
  contextoBarrio:
    "La Perseverancia es un barrio histórico y pequeño cerca del centro, conocido por su vida comunitaria estrecha y sus fiestas de barrio, que resisten pese a la transformación de las zonas que lo rodean.",
  rating: "9.4",
  ratingCount: 301,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/anton-acosta-AkGg3pr1bSs-unsplash.jpg",
  porQueDescubrir:
    "No es un acto for turistas: es un personaje que existía en las fiestas del barrio mucho antes de que Theaveling lo programara, y sigue improvisando según quién esté en la sala esa noche. Theaveling lo eligió por esa vigencia real —el humor no está guionado del todo, cambia con el público.",
  ficha: {
    presentaciones: "más de 60 presentaciones en fiestas de barrio desde 2015",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "personaje inventado a partir de figuras del carnaval y las fiestas de barrio bogotanas",
    idioma: "Español",
  },
  artista: {
    nombre: "Doña Reyes y su Burro Parlante",
    categoria: "Performer de comedia folclórica",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Soy Doña Reyes, y este es Efraín, mi burro. Llevamos años haciendo reír al barrio antes de que a alguien se le ocurriera ponerlo en una plataforma — para nosotros esto sigue siendo, sobre todo, una fiesta.",
  },
  resenas: [
    {
      nombre: "Manuela S.",
      rating: "★ 9.6",
      fecha: "Hace 2 días",
      texto: "Gratis pero llega temprano — el salón es chico y se llena de gente del barrio que ya la conoce.",
    },
    {
      nombre: "Felipe O.",
      rating: "★ 9.2",
      fecha: "Hace 1 semana",
      texto: "Fui solo sin conocer a nadie y en diez minutos ya me tenía metido en un chiste con todo el público — imposible quedarse por fuera.",
    },
    {
      nombre: "Camilo W.",
      rating: "★ 9.5",
      fecha: "Hace 3 semanas",
      texto: "Si te gustó El Payaso de la Plazoleta, esta comparte ese humor de calle, pero acá se siente más de barrio que de plaza turística.",
    },
    {
      nombre: "Natalia Q.",
      rating: "★ 9.0",
      fecha: "Hace 1 mes",
      texto: "Llevé a mis papás y se rieron más que yo — el humor cruza generaciones sin esfuerzo.",
    },
  ],
},
{
  id: "antes-del-silencio-orquesta-de-camara",
  title: "Antes del Silencio: Orquesta de Cámara",
  tag: "Concierto de cámara en sala grande",
  category: "Música",
  description:
    "Un ensamble de cámara para cuerdas y vientos toca repertorio propio inspirado en músicas populares colombianas, en un auditorio formal donde las luces cruzan la neblina del escenario minutos antes de que empiece el concierto. Boletería por zonas.",
  venue: "Auditorio Fontanar",
  city: "Bogotá",
  venueCategoria: "Auditorio de conciertos",
  venueBarrio: "Rosales",
  date: "Sábado 12 dic · 19:30",
  price: "$40.000 COP",
  mostrarDesde: true,
  asientoAsignado: true,
  duracion: "65 minutos con un intermedio de 10 minutos.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 11 #85-20, Bogotá",
  curiosidadDelLugar:
    "La neblina que se ve antes de cada función es intencional — el director de iluminación la usa para que los primeros compases se vean tanto como se escuchan. El auditorio conserva un órgano de tubos de la remodelación original, poco usado pero todavía funcional.",
  contextoBarrio:
    "Rosales es un barrio residencial tranquilo cerca de parques y sedes diplomáticas, con calles arboladas y poco tráfico incluso en horas pico.",
  rating: "9.0",
  ratingCount: 178,
  rail: "mas-reservados",
  soloVerMas: true,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/joakim-kingstrom-Is6c8E2Ghzg-unsplash.jpg",
  porQueDescubrir:
    "El ensamble compone su propio repertorio en vez de tocar solo el canon de cámara europeo, cruzando esa formación clásica con motivos de música popular colombiana. Theaveling lo eligió por ese cruce poco común y por la sala misma: suficientemente grande para sentirse una ocasión, suficientemente cuidada para no perder la intimidad del formato de cámara.",
  ficha: {
    presentaciones: "18 funciones desde 2022",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "repertorio propio para cuerdas y vientos, inspirado en músicas populares colombianas",
    idioma: "Instrumental",
  },
  artista: {
    nombre: "Ensamble Nueve Cuerdas",
    categoria: "Ensamble de cámara",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Somos Ensamble Nueve Cuerdas. Nos formamos en el conservatorio, pero decidimos escribir lo nuestro en vez de tocar solo el repertorio de siempre — esta sala nos deja hacerlo a una escala que se siente seria sin dejar de ser cercana.",
  },
  resenas: [
    {
      nombre: "Sebastián V.",
      rating: "★ 9.2",
      fecha: "Hace 3 días",
      texto: "La boletería es por zonas, como en las salas formales — llega con tiempo si quieres elegir bien el puesto.",
    },
    {
      nombre: "Paula H.",
      rating: "★ 8.7",
      fecha: "Hace 2 semanas",
      texto: "Fui sola una noche de sábado y no desentoné para nada — hay bastante público que viene solo, sobre todo en la zona alta.",
    },
    {
      nombre: "Andrés L.",
      rating: "★ 9.1",
      fecha: "Hace 1 mes",
      texto: "Si te gustó Sesión de Cámara Número 3, este ensamble comparte esa seriedad técnica, aunque acá la sala es mucho más grande y formal.",
    },
    {
      nombre: "Mariana K.",
      rating: "★ 8.9",
      fecha: "Hace 2 meses",
      texto: "El momento antes de que empiece, con la neblina y las luces cruzadas, ya es parte del espectáculo — no llegues tarde.",
    },
  ],
},

  // 2026-09-08, a pedido de Ana (mismo criterio de arriba): 16
  // experiencias nuevas para las secciones de Escena/Cultura, una por
  // categoría hasta acercarse al `verMasCount` histórico de cada
  // sección (Escena teatral, Hablan los cuerpos, El arte fuera de
  // formato, Cine que nace cerca, Encuentros para crear y compartir —
  // "Música para vivirla de cerca" no suma acá porque ya había llegado
  // a su target de 7 con la tanda anterior de Descubrimientos). SIN
  // `rail` (como las 10 de Danza/Performance/Música de 2026-09-07):
  // solo se ven filtradas por categoría, en el scroll de su sección Y en
  // su "Ver más" — Ana confirmó que ese solapamiento está bien acá.
  // Mismas fotos de stock, mismo criterio de primera pasada, 4 reseñas
  // por pieza.
{
  id: "la-que-grita-en-rojo",
  title: "La Que Grita en Rojo",
  tag: "Monólogo con cante",
  category: "Teatro",
  description:
    "Una mujer envuelta en un mantón rojo recita fragmentos de una carta que nunca mandó, a medio camino entre el teatro y el cante — la sala queda tan cerca que se escucha la respiración entre frase y frase.",
  venue: "Teatro El Rincón del Cante",
  city: "Bogotá",
  date: "Viernes 9 oct · 20:00",
  price: "$32.000 COP",
  rating: "9.1",
  ratingCount: 58,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/maryam-tello-XeAiD4OJMp8-unsplash.jpg",
  asientoAsignado: true,
  duracion: "60 minutos, sin intermedio — la actriz pidió que no haya cortes de luz ni aplausos a mitad de función.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Calle 3 Este #2-18, Bogotá",
  curiosidadDelLugar:
    "El teatro funciona en una casa republicana de dos pisos en Egipto — la sala de función era antes el patio cubierto de la casa, y todavía se nota el desnivel del piso original bajo las sillas.",
  contextoBarrio:
    "Barrio histórico de calles empinadas junto a La Candelaria, con vida cultural discreta y poco turismo comparado con el centro.",
  venueCategoria: "Sala de teatro íntima",
  venueBarrio: "Egipto",
  porQueDescubrir:
    "No hay banda ni coro detrás, solo la voz de la actriz sosteniendo sola toda la tensión de la sala. Theaveling la eligió por esa desnudez — nada que esconder un mal momento de la función.",
  ficha: {
    presentaciones: "Temporada de 6 funciones, estrenada en 2026",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "texto original de la compañía",
    idioma: "Español",
  },
  artista: {
    nombre: "Mantón Rojo, Compañía",
    categoria: "Compañía de teatro-canción",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Esta pieza se ensayó gritando bajito, en un apartamento — por eso funciona mejor en salas chicas como esta.",
  },
  resenas: [
    {
      nombre: "Andrea M.",
      rating: "★ 9.0",
      fecha: "Hace 4 días",
      texto: "Fui sola un viernes y no me arrepiento nada, la sala es tan chica que se siente una función privada.",
    },
    {
      nombre: "Camilo W.",
      rating: "★ 9.3",
      fecha: "Hace 2 semanas",
      texto: "La voz de la actriz aguanta toda la hora sin apoyo de música, impresionante de cerca.",
    },
    {
      nombre: "Paula H.",
      rating: "★ 8.7",
      fecha: "Hace 1 mes",
      texto: "Llega temprano, las sillas de adelante son incómodas para la espalda pero valen la pena por la cercanía.",
    },
    {
      nombre: "Santiago P.",
      rating: "★ 9.2",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó La Casa de los Silencios — mismo tipo de silencio incómodo bien usado.",
    },
  ],
},
{
  id: "cuerpo-en-guardia",
  title: "Cuerpo en Guardia",
  tag: "Teatro físico",
  category: "Teatro",
  description:
    "Un solo intérprete en negro construye, sin decir una palabra, la coreografía de alguien que se defiende de algo que nunca se nombra — cada gesto es una frase completa.",
  venue: "Estudio Los Cuervos",
  city: "Bogotá",
  date: "Miércoles 14 oct · 20:00",
  price: "$28.000 COP",
  rating: "8.8",
  ratingCount: 37,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/nicola-dowie-txNf7WFFDiM-unsplash.jpg",
  asientoAsignado: true,
  duracion: "45 minutos, sin intermedio — formato corto e intenso, pensado para no perder tensión.",
  restriccionEdad: "+14 años — temática de tensión y confrontación, sin lenguaje explícito.",
  direccionCompleta: "Carrera 4A #26-15, Bogotá",
  curiosidadDelLugar:
    "El estudio ocupa el garaje reconvertido de una casa de La Macarena — el intérprete eligió el lugar porque el techo bajo obliga a un tipo de movimiento más cerrado, casi de jaula.",
  contextoBarrio:
    "Barrio de calles empinadas y casas de artistas, cerca del Parque Nacional, con ambiente tranquilo entre semana.",
  venueCategoria: "Estudio de teatro físico",
  venueBarrio: "La Macarena",
  porQueDescubrir:
    "Es teatro físico sin red de diálogo que lo explique — el cuerpo tiene que sostener sola toda la historia. Theaveling la eligió por atreverse a no aclarar nada con palabras.",
  ficha: {
    presentaciones: "8 funciones desde su estreno en 2026",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "pieza original de creación colectiva",
    idioma: "Sin diálogo (teatro físico)",
  },
  artista: {
    nombre: "Julián Duarte",
    categoria: "Actor de teatro físico",
    ciudad: "Bogotá, Colombia",
    saludo:
      "No hay texto que aprenderse acá, hay una coreografía de defensa que cambia un poco según cómo llegue ese día.",
  },
  resenas: [
    {
      nombre: "Mariana K.",
      rating: "★ 8.5",
      fecha: "Hace 6 días",
      texto: "Cuarenta y cinco minutos se sienten larguísimos en el buen sentido, no hay un segundo de relajo.",
    },
    {
      nombre: "Esteban Z.",
      rating: "★ 9.0",
      fecha: "Hace 3 semanas",
      texto: "El techo bajo del estudio no es casualidad, se siente literalmente encerrado viendo la función.",
    },
    {
      nombre: "Valentina G.",
      rating: "★ 8.4",
      fecha: "Hace 1 mes",
      texto: "Fui sin saber nada del formato y al principio cuesta entrar, pero engancha rápido.",
    },
    {
      nombre: "David A.",
      rating: "★ 9.1",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Comité del Fracaso — mismo tipo de cuerpo solo sosteniendo toda la función.",
    },
  ],
},
{
  id: "vestuario-de-estrellas",
  title: "Vestuario de Estrellas",
  tag: "Musical de culto",
  category: "Teatro",
  description:
    "Revival casero de un musical de ciencia ficción colombiano de los 80 que casi nadie recuerda — vestuario de lentejuelas hecho a mano, coreografía de salón y un synth en vivo sonando desde bambalinas.",
  venue: "Teatro Galaxia",
  city: "Bogotá",
  date: "Viernes 30 oct · 20:00",
  price: "$35.000 COP",
  rating: "8.6",
  ratingCount: 49,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/nicola-dowie--oEf-Xd70I8-unsplash.jpg",
  asientoAsignado: true,
  duracion: "100 minutos, con un intermedio de 15 minutos.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Avenida Carrera 24 #39-52, Bogotá",
  curiosidadDelLugar:
    "El teatro guarda en un cuarto trasero el vestuario original de la producción de 1986 que este musical revive — parte de las lentejuelas de esta función son literalmente esas mismas piezas restauradas.",
  contextoBarrio:
    "Barrio universitario y de oficinas, con varios teatros pequeños repartidos entre las mismas cuadras.",
  venueCategoria: "Sala de teatro musical",
  venueBarrio: "Teusaquillo",
  porQueDescubrir:
    "Nadie en la producción pretende que esto sea de buen gusto — es campy a propósito, con el orgullo de un musical de culto que se resiste a desaparecer. Theaveling la eligió por esa fidelidad sin vergüenza a lo cursi original.",
  ficha: {
    presentaciones: "Revival de temporada, funciones desde 2026",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "revival de un musical colombiano original de 1986",
    idioma: "Español",
  },
  artista: {
    nombre: "Compañía Órbita 86",
    categoria: "Compañía de teatro musical",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Esto no se está actualizando ni se está bajando el nivel de cursilería — se está honrando tal cual era, sombreros de estrellas incluidos.",
  },
  resenas: [
    {
      nombre: "Laura B.",
      rating: "★ 8.3",
      fecha: "Hace 5 días",
      texto: "Es absurdo y lo sabe, me reí mucho más de lo que esperaba.",
    },
    {
      nombre: "Sebastián V.",
      rating: "★ 8.9",
      fecha: "Hace 2 semanas",
      texto: "El synth en vivo detrás del telón le suma un montón, se siente de verdad ochentero.",
    },
    {
      nombre: "Camila R.",
      rating: "★ 8.2",
      fecha: "Hace 1 mes",
      texto: "Llevé a mis papás y también se divirtieron, es un show familiar sin ser aburrido.",
    },
    {
      nombre: "Andrés L.",
      rating: "★ 9.0",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó A Chorus Line — mismo espíritu de musical hecho con cariño y pocos recursos.",
    },
  ],
},
{
  id: "los-sombreros-del-rio",
  title: "Los Sombreros del Río",
  tag: "Drama rural",
  category: "Teatro",
  description:
    "Drama de época sobre una familia campesina que decide, de un día para otro, dejarlo todo — dos hombres de sombrero sostienen a una mujer que se derrumba en el umbral de la única puerta que queda en pie.",
  venue: "Teatro La Otra Orilla",
  city: "Bogotá",
  date: "Domingo 22 nov · 18:00",
  price: "$30.000 COP",
  rating: "9.0",
  ratingCount: 71,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/nicolas-ladino-silva-jnl7U7n6UP0-unsplash.jpg",
  asientoAsignado: true,
  duracion: "85 minutos, sin intermedio.",
  restriccionEdad: "+14 años — temática de desplazamiento y pérdida.",
  direccionCompleta: "Calle 10 #6-24, Bogotá",
  curiosidadDelLugar:
    "La puerta roja que aparece en la escenografía es una puerta real, rescatada de una casa demolida en el centro — la producción la mantuvo sin restaurar a propósito, con los golpes que ya traía.",
  contextoBarrio:
    "Zona del centro con casas antiguas convertidas en oficinas y espacios culturales, tranquila de noche los domingos.",
  venueCategoria: "Sala de teatro dramático",
  venueBarrio: "Santa Fe",
  porQueDescubrir:
    "No es un drama de época decorativo — la puerta gastada y los sombreros reales le dan un peso concreto a una historia que en otras manos podría sentirse genérica. Theaveling la eligió por esa atención al objeto real, no al símbolo bonito.",
  ficha: {
    presentaciones: "Temporada de 10 funciones desde 2026",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "texto original de dramaturgia colombiana",
    idioma: "Español",
  },
  artista: {
    nombre: "La Otra Orilla, Compañía",
    categoria: "Compañía de teatro dramático",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Usamos objetos reales, no réplicas — esa puerta pesa lo que pesa una puerta real, y eso se nota en cómo la cargamos en escena.",
  },
  resenas: [
    {
      nombre: "Manuela S.",
      rating: "★ 9.1",
      fecha: "Hace 1 semana",
      texto: "Lloré sin esperarlo, la escena final con la puerta es durísima.",
    },
    {
      nombre: "Nicolás F.",
      rating: "★ 8.8",
      fecha: "Hace 3 semanas",
      texto: "Los domingos a las 6pm es un buen horario, sales y todavía hay luz para caminar por el centro.",
    },
    {
      nombre: "Natalia Q.",
      rating: "★ 9.3",
      fecha: "Hace 1 mes",
      texto: "Se nota la investigación detrás, no se siente un drama rural genérico.",
    },
    {
      nombre: "Felipe O.",
      rating: "★ 8.7",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Antígona Ahora — mismo tipo de peso dramático sin exagerar el montaje.",
    },
  ],
},
{
  id: "cuerpo-en-sombra",
  title: "Cuerpo en Sombra",
  tag: "Danza contemporánea",
  category: "Danza",
  description:
    "Una bailarina se mueve entre franjas de luz proyectada en el piso, como si cada sombra le impusiera una regla distinta de movimiento — sola, lenta, sin música que la guíe hasta el final.",
  venue: "Estudio Cal y Canto",
  city: "Bogotá",
  date: "Sábado 10 oct · 20:00",
  price: "$38.000 COP",
  rating: "9.0",
  ratingCount: 44,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/kazuo-ota-qxzfRL5gtC4-unsplash.jpg",
  asientoAsignado: true,
  duracion: "40 minutos, sin intermedio.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Calle 45 #13-20, Bogotá",
  curiosidadDelLugar:
    "El diseño de luces del estudio usa una malla metálica vieja, encontrada en la misma bodega, para proyectar las sombras que la bailarina sigue en el piso — no es un gobo comprado, es literalmente el techo del lugar.",
  contextoBarrio:
    "Barrio residencial y universitario, con estudios de danza y música repartidos en casas antiguas.",
  venueCategoria: "Estudio de danza contemporánea",
  venueBarrio: "La Soledad",
  porQueDescubrir:
    "Casi no hay música, solo el sonido de los pies sobre la madera y la respiración — Theaveling la eligió por esa valentía de sostener el silencio en vez de llenarlo.",
  ficha: {
    presentaciones: "4 funciones desde su estreno en 2026",
    festivales: "sin festival todavía — estreno en temporada propia del estudio",
    premios: "sin premios todavía",
    origen: "pieza original, no reinterpretación",
    idioma: "Sin diálogo (pieza de danza)",
  },
  artista: {
    nombre: "Marcela Duque",
    categoria: "Bailarina y coreógrafa",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Trabajo con la sombra real del lugar, no con una proyectada aparte — por eso la pieza solo existe tal cual en este estudio.",
  },
  resenas: [
    {
      nombre: "Carolina N.",
      rating: "★ 9.2",
      fecha: "Hace 4 días",
      texto: "Es hipnótica, cuesta creer que 40 minutos pasen tan rápido viendo solo sombras y un cuerpo.",
    },
    {
      nombre: "Julián T.",
      rating: "★ 8.6",
      fecha: "Hace 2 semanas",
      texto: "El estudio es pequeño, se ve perfecto desde cualquier silla.",
    },
    {
      nombre: "Daniela C.",
      rating: "★ 9.1",
      fecha: "Hace 1 mes",
      texto: "No lleves perfume fuerte, la sala es chica y cerrada, se nota mucho.",
    },
    {
      nombre: "Andrés L.",
      rating: "★ 8.9",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Materia en Suspensión — mismo tipo de danza lenta y contenida.",
    },
  ],
},
{
  id: "pequenos-pasos-gran-escenario",
  title: "Pequeños Pasos, Gran Escenario",
  tag: "Ballet clásico (función de escuela)",
  category: "Danza",
  description:
    "Función anual de una academia de ballet: las alumnas más chicas comparten escenario con las bailarinas mayores en una puesta clásica completa, vestuario de época incluido.",
  venue: "Academia de Ballet Vaganova Bogotá",
  city: "Bogotá",
  date: "Domingo 18 oct · 16:00",
  price: "$20.000 COP",
  rating: "8.5",
  ratingCount: 63,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/kazuo-ota-ZKzbicK3EyA-unsplash.jpg",
  asientoAsignado: true,
  duracion: "2 horas, con un intermedio de 20 minutos.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 7 #119-30, Bogotá",
  curiosidadDelLugar:
    "La academia guarda vestuario de sus funciones desde hace más de 20 años — algunas de las faldas que usan las alumnas más chicas las usaron antes bailarinas que hoy son profesoras ahí mismo.",
  contextoBarrio:
    "Zona residencial del norte, con varios colegios y academias de artes cerca.",
  venueCategoria: "Academia de ballet",
  venueBarrio: "Usaquén",
  porQueDescubrir:
    "No es una función profesional pulida a la perfección — es una función real de academia, con nervios de verdad detrás de cada niña en escena. Theaveling la eligió por esa honestidad de recital escolar, sin pretender ser otra cosa.",
  ficha: {
    presentaciones: "Función anual desde hace más de 15 años",
    festivales: "no aplica — función de academia, no de festival",
    premios: "no aplica",
    origen: "puesta clásica adaptada por la academia",
    idioma: "Sin diálogo (pieza de danza)",
  },
  artista: {
    nombre: "Academia de Ballet Vaganova Bogotá",
    categoria: "Academia de ballet",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Cada alumna sale a bailar lo que le toca según su nivel — la función crece con ellas año a año, literalmente.",
  },
  resenas: [
    {
      nombre: "Paula H.",
      rating: "★ 8.2",
      fecha: "Hace 6 días",
      texto: "Fui a ver a mi sobrina y terminé emocionada con todo el programa, no solo con su parte.",
    },
    {
      nombre: "Camilo W.",
      rating: "★ 8.7",
      fecha: "Hace 3 semanas",
      texto: "Se siente genuinamente una función de academia, no esperes nivel de compañía profesional y la disfrutas mucho más.",
    },
    {
      nombre: "Mariana K.",
      rating: "★ 8.4",
      fecha: "Hace 1 mes",
      texto: "El domingo en la tarde es buena hora para ir con niños, no se hace tan larga la espera de la función.",
    },
    {
      nombre: "Esteban Z.",
      rating: "★ 8.8",
      fecha: "Hace 2 meses",
      texto: "Las boletas se agotan rápido entre familias de las alumnas, compra con anticipación.",
    },
  ],
},
{
  id: "la-esquina-que-baila",
  title: "La Esquina que Baila",
  tag: "Danza urbana teatral",
  category: "Danza",
  description:
    "Dúo de danza contemporánea con raíces afro que usa una fachada pintada de calle vieja como único decorado — el baile ocurre literalmente en el umbral entre la casa y la calle.",
  venue: "Set Escenográfico San Felipe",
  city: "Bogotá",
  date: "Viernes 6 nov · 19:00",
  price: "Gratis",
  rating: "8.7",
  ratingCount: 52,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/moon-bouy-SF0IY5CLe34-unsplash.jpg",
  asientoAsignado: false,
  duracion: "35 minutos, formato de calle — el público puede moverse alrededor del set durante la función.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Calle 76 #20-33, Bogotá",
  curiosidadDelLugar:
    "El set es una fachada real construida por la compañía para otra producción, guardada en la bodega del barrio — decidieron reusarla para esta pieza en vez de construir un decorado nuevo.",
  contextoBarrio:
    "San Felipe, zona de galerías y talleres de artistas, con calles cerradas al tráfico algunos fines de semana.",
  venueCategoria: "Set escenográfico al aire libre",
  venueBarrio: "San Felipe",
  porQueDescubrir:
    "No hay tarima ni butacas, el público rodea a los bailarines como si estuviera en la esquina real que representa el decorado. Theaveling la eligió por sacar la danza contemporánea del cubo negro tradicional.",
  ficha: {
    presentaciones: "Función mensual desde 2026",
    festivales: "circuito independiente de danza urbana de Bogotá",
    premios: "sin premios",
    origen: "pieza original de la compañía",
    idioma: "Sin diálogo (pieza de danza)",
  },
  artista: {
    nombre: "Compañía Umbral Afro",
    categoria: "Compañía de danza contemporánea",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Bailamos sobre una fachada que no es de verdad, pero el umbral que cruzan los cuerpos sí representa algo real para nosotros.",
  },
  resenas: [
    {
      nombre: "Santiago P.",
      rating: "★ 8.5",
      fecha: "Hace 5 días",
      texto: "Es gratis y la calidad sorprende, no esperaba tanto nivel en un formato tan informal.",
    },
    {
      nombre: "Valentina G.",
      rating: "★ 9.0",
      fecha: "Hace 2 semanas",
      texto: "El decorado de fachada es un detalle genial, parece una calle de verdad de noche.",
    },
    {
      nombre: "David A.",
      rating: "★ 8.3",
      fecha: "Hace 1 mes",
      texto: "Llega temprano si quieres estar cerca, el círculo de gente crece rápido.",
    },
    {
      nombre: "Laura B.",
      rating: "★ 8.9",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Bloque B: Cifrado Urbano — mismo espíritu de danza sin escenario tradicional.",
    },
  ],
},
{
  id: "papel-en-caida",
  title: "Papel en Caída",
  tag: "Performance de objeto",
  category: "Performance",
  description:
    "Una intérprete suspendida y envuelta en un vestido hecho enteramente de papel se deja caer, girar y desarmar poco a poco frente al público — el papel se rasga un poco más en cada función.",
  venue: "Bodega Blanca",
  city: "Bogotá",
  date: "Martes 13 oct · 20:00",
  price: "$25.000 COP",
  rating: "8.9",
  ratingCount: 33,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/kazuo-ota-vxNG68ITf7I-unsplash.jpg",
  asientoAsignado: false,
  duracion: "30 minutos, formato único e irrepetible — el vestido de papel no se repara entre funciones.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 24 #56-11, Bogotá",
  curiosidadDelLugar:
    "Bodega Blanca fue antes un depósito de textiles — quedan estanterías metálicas vacías en las paredes, que la producción decidió dejar a la vista en vez de esconder con telón.",
  contextoBarrio:
    "Zona industrial reconvertida en espacios de arte, con poca vida nocturna fuera de eventos puntuales.",
  venueCategoria: "Bodega de arte reconvertida",
  venueBarrio: "Chapinero Alto",
  porQueDescubrir:
    "El vestido de papel se va rompiendo un poco más cada función y nunca se repara del todo — quien va temprano en la temporada ve una pieza distinta de quien va al final. Theaveling la eligió por ese deterioro real, no simulado.",
  ficha: {
    presentaciones: "6 funciones, cada una con el mismo vestido sin reparar",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "pieza original de performance",
    idioma: "Sin diálogo (performance)",
  },
  artista: {
    nombre: "Ana Sofía Reyes",
    categoria: "Artista de performance",
    ciudad: "Bogotá, Colombia",
    saludo:
      "El vestido no se arregla entre función y función a propósito — quiero que se vea el desgaste real del papel, no una versión nueva cada vez.",
  },
  resenas: [
    {
      nombre: "Camila R.",
      rating: "★ 8.7",
      fecha: "Hace 6 días",
      texto: "Fui a la cuarta función y el vestido ya estaba bastante roto, me imagino que la primera se ve distinto.",
    },
    {
      nombre: "Nicolás F.",
      rating: "★ 9.0",
      fecha: "Hace 3 semanas",
      texto: "Es incómodo de ver a ratos, en el buen sentido, no es una performance fácil de digerir.",
    },
    {
      nombre: "Andrea M.",
      rating: "★ 8.5",
      fecha: "Hace 1 mes",
      texto: "La bodega hace frío, lleva chaqueta aunque sea de noche entre semana.",
    },
    {
      nombre: "Sebastián V.",
      rating: "★ 9.1",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Cuerpos en Tránsito — mismo tipo de performance que se apoya en un objeto que se va deteriorando.",
    },
  ],
},
{
  id: "ritual-en-el-potrero",
  title: "Ritual en el Potrero",
  tag: "Performance sitio-específico",
  category: "Performance",
  description:
    "Performance nocturna al aire libre en una cancha de barrio: una intérprete atraviesa nubes de humo bajo luz roja, en una coreografía que se lee más cerca del ritual que de la danza convencional.",
  venue: "Cancha Los Molinos",
  city: "Bogotá",
  date: "Domingo 25 oct · 19:00",
  price: "Gratis",
  rating: "8.4",
  ratingCount: 29,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/marcos-soares-WSe_N6CFfDw-unsplash.jpg",
  asientoAsignado: false,
  duracion: "25 minutos, al aire libre — se recomienda llegar antes del anochecer para ubicarse bien.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 9 Bis #64-40, Bogotá",
  curiosidadDelLugar:
    "La cancha sigue siendo cancha de fútbol de barrio entre semana — la producción solo pide el espacio prestado los domingos en la noche, sin modificar nada de la estructura.",
  contextoBarrio:
    "Zona residencial de Chapinero con vida barrial fuerte, canchas y parques usados a toda hora.",
  venueCategoria: "Cancha de barrio (sitio específico)",
  venueBarrio: "Chapinero",
  porQueDescubrir:
    "No hay escenario ni luces de teatro, solo una máquina de humo y una intérprete usando el espacio tal cual es, arco de fútbol incluido. Theaveling la eligió por llevar el performance a un lugar que no fue pensado para el arte.",
  ficha: {
    presentaciones: "Función mensual desde 2026, sujeta al clima",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "pieza original de sitio específico",
    idioma: "Sin diálogo (performance)",
  },
  artista: {
    nombre: "Tatiana Roa",
    categoria: "Artista de performance",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Elegí esta cancha porque tiene su propia historia de barrio — no quiero un espacio en blanco, quiero que se note dónde estoy parada.",
  },
  resenas: [
    {
      nombre: "Felipe O.",
      rating: "★ 8.0",
      fecha: "Hace 5 días",
      texto: "Es gratis y vale la pena, aunque si llueve la cancelan sin previo aviso, revisa redes antes de ir.",
    },
    {
      nombre: "Manuela S.",
      rating: "★ 8.6",
      fecha: "Hace 2 semanas",
      texto: "El humo con la luz roja se ve espectacular en video, aunque en persona es más sutil de lo que esperaba.",
    },
    {
      nombre: "Natalia Q.",
      rating: "★ 8.3",
      fecha: "Hace 1 mes",
      texto: "Lleva algo para sentarte, no hay dónde sentarse en la cancha.",
    },
    {
      nombre: "Julián T.",
      rating: "★ 8.7",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó La Esquina que Baila — mismo espíritu de performance en un espacio no pensado para eso.",
    },
  ],
},
{
  id: "la-banda-de-los-pajaros",
  title: "La Banda de los Pájaros",
  tag: "Performance-concierto",
  category: "Performance",
  description:
    "Banda de calle con vestuario de pájaros de carnaval invade una bodega convertida en sala — más un happening colectivo que un concierto formal, con el público mezclado entre los músicos disfrazados.",
  venue: "Nave 7",
  city: "Bogotá",
  date: "Viernes 13 nov · 21:00",
  price: "$18.000 COP",
  rating: "8.8",
  ratingCount: 47,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/pierre-goiffon-k4y8zA76TpM-unsplash.jpg",
  asientoAsignado: false,
  duracion: "1 hora y media, sin pausas — la banda entra y sale tocando entre el público.",
  restriccionEdad: "+18 años — evento nocturno con barra.",
  direccionCompleta: "Calle 13 #32-50, Bogotá",
  curiosidadDelLugar:
    "Nave 7 fue una bodega de repuestos hasta hace pocos años — todavía tiene el letrero metálico original oxidándose sobre la puerta principal, que nadie ha querido quitar.",
  contextoBarrio:
    "Zona industrial de Puente Aranda, con poca vida nocturna fuera de este tipo de eventos puntuales.",
  venueCategoria: "Bodega reconvertida en sala",
  venueBarrio: "Puente Aranda",
  porQueDescubrir:
    "Los vestuarios de pájaro no son solo estética de carnaval, cada personaje tiene su propio instrumento y su propia coreografía de entrada. Theaveling la eligió por ese nivel de detalle detrás de algo que a primera vista parece puro caos festivo.",
  ficha: {
    presentaciones: "Gira de funciones puntuales desde 2025",
    festivales: "circuito independiente de bandas de calle",
    premios: "sin premios",
    origen: "colectivo de performance-concierto",
    idioma: "Sin diálogo (música y performance)",
  },
  artista: {
    nombre: "Banda de los Pájaros",
    categoria: "Colectivo de performance-concierto",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Cada pájaro del colectivo se inventó su propio personaje — no hay guion fijo de quién entra primero, cambia según la energía de la noche.",
  },
  resenas: [
    {
      nombre: "Daniela C.",
      rating: "★ 8.9",
      fecha: "Hace 4 días",
      texto: "Nunca supe bien cuándo era música y cuándo era teatro, y esa mezcla es justo lo bueno.",
    },
    {
      nombre: "Esteban Z.",
      rating: "★ 8.5",
      fecha: "Hace 3 semanas",
      texto: "La bodega se llena rápido, llega antes de las 9pm si quieres estar cerca de la banda.",
    },
    {
      nombre: "Carolina N.",
      rating: "★ 9.0",
      fecha: "Hace 1 mes",
      texto: "Vestuario increíble, se nota el trabajo detrás de cada disfraz de pájaro.",
    },
    {
      nombre: "Andrés L.",
      rating: "★ 8.6",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Bloque B: Cifrado Urbano — mismo tipo de energía de calle metida en un espacio cerrado.",
    },
  ],
},
{
  id: "compania-en-fuga",
  title: "Compañía en Fuga: Documental Restaurado",
  tag: "Cine documental",
  category: "Cine",
  description:
    "Documental restaurado sobre una compañía de ballet bogotana que desapareció en los años 90 — el material original en blanco y negro, rescatado de cintas dañadas, se proyecta con el grano y los saltos intactos.",
  venue: "Sala Ancha",
  city: "Bogotá",
  date: "Jueves 22 oct · 19:30",
  price: "$22.000 COP",
  rating: "8.7",
  ratingCount: 38,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/kazuo-ota-TKmK9YyKQGI-unsplash.jpg",
  asientoAsignado: true,
  duracion: "78 minutos, incluye una charla breve al final con el equipo de restauración.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 13 #52-08, Bogotá",
  curiosidadDelLugar:
    "La sala instaló hace poco un proyector capaz de manejar archivo digitalizado de baja resolución sin sobre-nitidizarlo — decisión tomada justamente pensando en documentales de archivo como este.",
  contextoBarrio:
    "Zona comercial de Chapinero con oferta cultural variada, cines pequeños y librerías de segunda.",
  venueCategoria: "Sala de cine independiente",
  venueBarrio: "Chapinero",
  porQueDescubrir:
    "No se limpió el material para que se vea como nuevo — se conservó el grano y los saltos de la cinta original dañada, como parte de la historia que cuenta. Theaveling la eligió por respetar el estado real del archivo en vez de maquillarlo.",
  ficha: {
    presentaciones: "Función especial, proyecciones limitadas",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "documental de archivo, material original de los años 90",
    idioma: "Español",
  },
  artista: {
    nombre: "Colectivo Archivo en Movimiento",
    categoria: "Colectivo de restauración audiovisual",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Encontramos estas cintas casi por accidente en una bodega — restaurarlas fue más rescatar memoria que hacer cine.",
  },
  resenas: [
    {
      nombre: "Mariana K.",
      rating: "★ 8.4",
      fecha: "Hace 1 semana",
      texto: "El grano de la imagen al principio distrae, pero después se vuelve parte de lo que estás viendo.",
    },
    {
      nombre: "Santiago P.",
      rating: "★ 9.0",
      fecha: "Hace 3 semanas",
      texto: "La charla final con el equipo de restauración le suma mucho contexto técnico interesante.",
    },
    {
      nombre: "Paula H.",
      rating: "★ 8.6",
      fecha: "Hace 1 mes",
      texto: "No sabía que esa compañía de ballet existió, es un pedazo de historia bogotana que se estaba perdiendo.",
    },
    {
      nombre: "Camilo W.",
      rating: "★ 8.8",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó El Último Carrete — mismo cuidado por el material original sin digitalizar de más.",
    },
  ],
},
{
  id: "bastidores-estreno-nacional",
  title: "Bastidores: Estreno Nacional",
  tag: "Cine colombiano",
  category: "Cine",
  description:
    "Estreno de una película colombiana filmada casi enteramente entre bambalinas de un teatro, siguiendo a un grupo de bailarines jóvenes la noche antes de su función más importante.",
  venue: "Cine Delfos",
  city: "Bogotá",
  date: "Miércoles 9 dic · 20:00",
  price: "$30.000 COP",
  rating: "8.9",
  ratingCount: 66,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/kazuo-ota-CHcOmg14rk4-unsplash.jpg",
  asientoAsignado: true,
  duracion: "108 minutos, con conversatorio con la directora al finalizar la función de estreno.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 24 #39-91, Bogotá",
  curiosidadDelLugar:
    "Cine Delfos reserva desde hace años su sala principal para estrenos nacionales de bajo presupuesto que no consiguen cupo en las cadenas grandes — este estreno llena justo ese espacio.",
  contextoBarrio:
    "Barrio universitario y de oficinas, con oferta variada de teatros y salas independientes cerca.",
  venueCategoria: "Sala de cine independiente",
  venueBarrio: "Teusaquillo",
  porQueDescubrir:
    "Es una película pequeña, filmada casi toda en un solo teatro real, sin actores conocidos — y aun así logra que el nerviosismo de una función se sienta genuino en pantalla. Theaveling la eligió por ese realismo de bastidores, sin glamour de industria.",
  ficha: {
    presentaciones: "Estreno único, luego funciones limitadas",
    festivales: "sin festivales todavía",
    premios: "sin premios",
    origen: "producción independiente colombiana",
    idioma: "Español",
  },
  artista: {
    nombre: "Camila Ossa",
    categoria: "Directora de cine",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Filmamos con el teatro real todavía funcionando de día — la película se hizo literalmente entre función y función de otra obra.",
  },
  resenas: [
    {
      nombre: "Valentina G.",
      rating: "★ 9.1",
      fecha: "Hace 5 días",
      texto: "El conversatorio con la directora después del estreno se sintió especial, contó anécdotas del rodaje muy concretas.",
    },
    {
      nombre: "David A.",
      rating: "★ 8.7",
      fecha: "Hace 2 semanas",
      texto: "Se nota el presupuesto chico en algunas escenas, pero la actuación compensa esa parte.",
    },
    {
      nombre: "Laura B.",
      rating: "★ 8.9",
      fecha: "Hace 1 mes",
      texto: "Buena opción para quien le gusta el mundo del teatro visto desde adentro, sin ser un documental.",
    },
    {
      nombre: "Nicolás F.",
      rating: "★ 9.0",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Fronteras Difusas — mismo tipo de cine colombiano pequeño y bien hecho.",
    },
  ],
},
{
  id: "funcion-y-banda",
  title: "Función y Banda: Cortos + Concierto",
  tag: "Cine local + música en vivo",
  category: "Cine local",
  description:
    "Bar de barrio que combina tanda de cortometrajes bogotanos con un set en vivo de una banda emergente entre película y película — nadie se queda sentado todo el rato.",
  venue: "Bar El Trébol",
  city: "Bogotá",
  date: "Miércoles 21 oct · 21:00",
  price: "$15.000 COP",
  rating: "8.3",
  ratingCount: 41,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/les-taylor-ZlMxJQ_H_nw-unsplash.jpg",
  asientoAsignado: false,
  duracion: "3 horas — 4 cortometrajes intercalados con 2 sets cortos de banda en vivo.",
  restriccionEdad: "+18 años — funciona como bar con barra activa toda la noche.",
  direccionCompleta: "Carrera 13 #63-22, Bogotá",
  curiosidadDelLugar:
    "El bar proyecta los cortos sobre una pared pintada de blanco, no sobre una pantalla — decisión original del dueño, que nunca instaló una pantalla de verdad porque 'la pared ya funcionaba bien'.",
  contextoBarrio:
    "Zona comercial de Chapinero con buena vida nocturna entre semana, varios bares con programación cultural puntual.",
  venueCategoria: "Bar con programación cultural",
  venueBarrio: "Chapinero",
  porQueDescubrir:
    "No es ni una sala de cine ni un bar de conciertos puros, es las dos cosas mezcladas sin que ninguna domine sobre la otra. Theaveling la eligió por esa mezcla informal que en Bogotá no abunda tanto.",
  ficha: {
    presentaciones: "Evento mensual desde 2025",
    festivales: "no aplica",
    premios: "no aplica",
    origen: "programación curada por el bar, cortometrajes rotativos",
    idioma: "Español",
  },
  artista: {
    nombre: "El Trébol Presenta",
    categoria: "Programación cultural de bar",
    ciudad: "Bogotá, Colombia",
    saludo:
      "No queremos que la gente se siente a ver cine en silencio total — por eso metemos banda en vivo entre corto y corto, para que se sienta como una noche de barrio.",
  },
  resenas: [
    {
      nombre: "Andrea M.",
      rating: "★ 8.0",
      fecha: "Hace 6 días",
      texto: "Ambiente muy relajado, se puede hablar entre cortos sin sentir que estás interrumpiendo algo solemne.",
    },
    {
      nombre: "Sebastián V.",
      rating: "★ 8.6",
      fecha: "Hace 3 semanas",
      texto: "La calidad de los cortos varía bastante, pero la banda en vivo siempre sube el ánimo de la noche.",
    },
    {
      nombre: "Camila R.",
      rating: "★ 8.1",
      fecha: "Hace 1 mes",
      texto: "Va lleno entre semana, llega temprano si quieres mesa cerca de la pared donde proyectan.",
    },
    {
      nombre: "Julián T.",
      rating: "★ 8.5",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Pantalla de Barrio — mismo espíritu de cine local hecho sin pretensiones.",
    },
  ],
},
{
  id: "maraton-fan-cortos-y-cosplay",
  title: "Maratón Fan: Cortos y Cosplay",
  tag: "Cine local (fandom)",
  category: "Cine local",
  description:
    "Maratón de cortometrajes hechos por fans bogotanos, con concurso de disfraces entre función y función y el público grabando todo con el celular en alto — más fiesta de fandom que sala de cine tradicional.",
  venue: "Centro Cultural Aluna",
  city: "Bogotá",
  date: "Domingo 6 dic · 15:00",
  price: "$20.000 COP",
  rating: "8.5",
  ratingCount: 58,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/les-taylor-TcRvqdgLZsQ-unsplash.jpg",
  asientoAsignado: false,
  duracion: "4 horas — 8 cortometrajes cortos intercalados con el concurso de disfraces.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 19 #45-30, Bogotá",
  curiosidadDelLugar:
    "El centro cultural presta su auditorio los domingos para eventos de fans desde hace 3 años — empezó como un grupo pequeño de aficionados al anime y hoy convoca cientos de personas cada edición.",
  contextoBarrio:
    "Barrio de Teusaquillo, con varios centros culturales y casas convertidas en espacios comunitarios.",
  venueCategoria: "Centro cultural comunitario",
  venueBarrio: "Teusaquillo",
  porQueDescubrir:
    "Los cortos no siempre son perfectos técnicamente, pero el nivel de compromiso del público — disfraces hechos a mano, coreografías aprendidas de memoria — es lo que realmente vale la entrada. Theaveling la eligió por esa energía de comunidad, no por el pulido del contenido.",
  ficha: {
    presentaciones: "Edición trimestral desde 2023",
    festivales: "circuito de convenciones fan de Bogotá",
    premios: "sin premios formales — el concurso de disfraces es interno del evento",
    origen: "selección curada de cortometrajes hechos por fans",
    idioma: "Español",
  },
  artista: {
    nombre: "Colectivo Fandom Bogotá",
    categoria: "Colectivo de cine y cultura fan",
    ciudad: "Bogotá, Colombia",
    saludo:
      "No filtramos por calidad técnica, filtramos por si el corto se nota hecho con ganas — de ahí sale todo lo demás.",
  },
  resenas: [
    {
      nombre: "Manuela S.",
      rating: "★ 8.2",
      fecha: "Hace 4 días",
      texto: "El concurso de disfraces roba la función, la gente se toma muy en serio los personajes.",
    },
    {
      nombre: "Felipe O.",
      rating: "★ 8.8",
      fecha: "Hace 2 semanas",
      texto: "Va con niños y adultos por igual, ambiente muy familiar a pesar del tema nicho.",
    },
    {
      nombre: "Natalia Q.",
      rating: "★ 8.4",
      fecha: "Hace 1 mes",
      texto: "4 horas se sienten largas si no eres fan de nada en particular, pero el ambiente compensa.",
    },
    {
      nombre: "Esteban Z.",
      rating: "★ 8.7",
      fecha: "Hace 2 meses",
      texto: "Compra la boleta con anticipación, las últimas dos ediciones se agotaron.",
    },
  ],
},
{
  id: "cine-mudo-set-en-vivo",
  title: "Cine Mudo + Set en Vivo",
  tag: "Cineclub con banda sonora en vivo",
  category: "Cineclub",
  description:
    "Proyección de cine mudo de archivo con un productor improvisando en vivo la banda sonora completa desde una mesa de mezcla — cada función suena distinto, aunque la película sea la misma.",
  venue: "Sótano 8",
  city: "Bogotá",
  date: "Viernes 11 dic · 23:00",
  price: "$25.000 COP",
  rating: "8.9",
  ratingCount: 52,
  imageUrl: "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/matt-palmer-XLAeDbI52Ek-unsplash.jpg",
  asientoAsignado: false,
  duracion: "100 minutos — 70 de película muda y 30 de set extendido después de los créditos.",
  restriccionEdad: "+18 años — función de medianoche, funciona como club con barra.",
  direccionCompleta: "Calle 63 #9-12, Bogotá",
  curiosidadDelLugar:
    "Sótano 8 comparte edificio con Sala Oscura, el cineclub de medianoche del mismo bloque — ambos empezaron como el mismo proyecto antes de dividirse en dos programaciones distintas.",
  contextoBarrio:
    "Zona residencial de Chapinero Alto, con vida nocturna discreta concentrada en pocos puntos.",
  venueCategoria: "Cineclub independiente",
  venueBarrio: "Chapinero Alto",
  porQueDescubrir:
    "No hay partitura fija ni banda pregrabada, el productor improvisa en el momento leyendo la reacción de la sala — Theaveling la eligió porque cada función es literalmente irrepetible, aunque la película en pantalla no cambie.",
  ficha: {
    presentaciones: "Función mensual desde 2025",
    festivales: "no aplica",
    premios: "no aplica",
    origen: "programación de archivo de cine mudo, títulos rotativos",
    idioma: "Sin diálogo (cine mudo con música en vivo)",
  },
  artista: {
    nombre: "Sótano 8 Cineclub",
    categoria: "Cineclub independiente",
    ciudad: "Bogotá, Colombia",
    saludo:
      "No repito nunca el mismo set para la misma película — si ya la viste con nosotros antes, la vas a escuchar distinta esta vez.",
  },
  resenas: [
    {
      nombre: "Carolina N.",
      rating: "★ 9.0",
      fecha: "Hace 5 días",
      texto: "La combinación de cine mudo con set electrónico en vivo suena rara en el papel y funciona increíble en la sala.",
    },
    {
      nombre: "Andrés L.",
      rating: "★ 8.6",
      fecha: "Hace 3 semanas",
      texto: "Es tarde, empieza casi a medianoche, no es plan para madrugar al otro día.",
    },
    {
      nombre: "Daniela C.",
      rating: "★ 9.2",
      fecha: "Hace 1 mes",
      texto: "El set después de los créditos se extiende y la gente se queda bailando, termina siendo más fiesta que función de cine.",
    },
    {
      nombre: "Santiago P.",
      rating: "★ 8.7",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Club de Culto: Función de Medianoche — mismo tipo de misterio y horario nocturno.",
    },
  ],
},
{
  id: "charla-la-voz-que-tambien-se-mueve",
  title: "Charla: La Voz que También se Mueve",
  tag: "Charla-demostración",
  category: "Charlas",
  description:
    "Una bailarina y narradora oral combina charla con demostración en vivo — habla de dónde viene cada gesto de danza tradicional que usa y, a mitad de frase, lo hace con el cuerpo en vez de solo describirlo con palabras.",
  venue: "Casa de la Cultura La Soledad",
  city: "Bogotá",
  date: "Miércoles 16 dic · 18:00",
  price: "Gratis",
  rating: "8.7",
  ratingCount: 26,
  imageUrl:
    "/assets/images/imagenes%20aleatorias%20para%20ver%20mas/redd-francisco-X9sR5_9w0xE-unsplash.jpg",
  asientoAsignado: false,
  duracion: "70 minutos, con demostraciones cortas de movimiento intercaladas en la charla.",
  restriccionEdad: "Todo público.",
  direccionCompleta: "Carrera 24 #45-12, Bogotá",
  curiosidadDelLugar:
    "La casa cultural tiene un auditorio pequeño con tarima baja, casi al nivel del público — la artista pidió justo ese formato para poder moverse entre las filas sin necesitar un escenario alto.",
  contextoBarrio:
    "Barrio universitario y residencial, con oferta cultural gratuita repartida en casas culturales pequeñas.",
  venueCategoria: "Casa cultural",
  venueBarrio: "La Soledad",
  porQueDescubrir:
    "No es una charla teórica sobre danza, es alguien que se para a mitad de una frase y responde con el cuerpo en vez de terminarla con palabras — Theaveling la eligió por esa honestidad de mostrar en vez de solo explicar.",
  ficha: {
    presentaciones: "Encuentro único",
    festivales: "no aplica",
    premios: "no aplica",
    origen: "programación cultural de casa cultural barrial",
    idioma: "Español",
  },
  artista: {
    nombre: "Yolanda Prieto",
    categoria: "Bailarina y narradora oral",
    ciudad: "Bogotá, Colombia",
    saludo:
      "Llevo años tratando de explicar con palabras algo que en realidad vive en el cuerpo — esta charla es donde finalmente dejo de intentarlo y simplemente lo muestro.",
  },
  resenas: [
    {
      nombre: "Mariana K.",
      rating: "★ 8.5",
      fecha: "Hace 4 días",
      texto: "Es gratis y el formato de charla con demostración se siente mucho más vivo que una charla normal sentada.",
    },
    {
      nombre: "Paula H.",
      rating: "★ 8.9",
      fecha: "Hace 2 semanas",
      texto: "Fui sola y terminé participando en un ejercicio corto que propuso al final — no es solo escuchar sentado.",
    },
    {
      nombre: "Camilo W.",
      rating: "★ 8.4",
      fecha: "Hace 1 mes",
      texto: "El auditorio es chico, se ve perfecto desde cualquier silla y se escucha bien sin micrófono.",
    },
    {
      nombre: "Valentina G.",
      rating: "★ 9.0",
      fecha: "Hace 2 meses",
      texto: "Si te gustó esto, también me gustó Vals en Azul — la misma idea de que el cuerpo puede decir lo que las palabras no alcanzan.",
    },
  ],
},
];

/*
 * 2026-09-07, a pedido de Ana: ids fijos de los 3 festivales que
 * aparecen en el carrusel editorial de "El arte toma la ciudad" (ver
 * nota grande arriba de estos 3, y FestivalesCarousel.tsx). Deliberado
 * a mano (no un filtro por categoría) para que este trío no se mezcle
 * con otras piezas que también usan `category: "Festivales"` (como
 * "Dramaturgias Nómadas", que sigue viviendo solo en Curado/Todo).
 */
export const FESTIVALES_CIUDAD_IDS: string[] = [
  "festival-teatro-circo-bogota",
  "jazz-al-parque",
  "filbo-feria-del-libro",
];

export function getFestivalesCiudad(): Experience[] {
  return FESTIVALES_CIUDAD_IDS.map((id) => getExperienceById(id)).filter(
    (e): e is Experience => Boolean(e),
  );
}

/*
 * 2026-09-08, a pedido de Ana: rediseño del Detalle de estos 3 festivales
 * ("la pantalla es igual, pero solo con... los descubrimientos que hacen
 * parte de este festival") — mandó un mockup completo con la sección
 * "Explora la programación": las experiencias individuales que son parte
 * de cada festival, mostradas con las Experience Card normales de Thea
 * ("una obra del festival sigue siendo una experiencia individual y debe
 * mantener su misma lógica visual. Festival = contenedor, Experiencias =
 * contenido individual").
 *
 * Ninguna experiencia del catálogo estaba marcada como "parte de" un
 * festival todavía, así que esta es la primera pasada de esa relación
 * (mismo criterio de "primera pasada inventada" que el resto del
 * catálogo) — se arma tomando experiencias reales que ya existen y
 * calzan por disciplina con cada festival, en vez de inventar piezas
 * nuevas de cero:
 * - Festival de Teatro y Circo → multidisciplinario de verdad (Teatro,
 *   Danza, Performance), se arma con una mezcla de las 3.
 * - Jazz al Parque → todas las piezas de Música del catálogo.
 * - FiLBo → no hay categoría de "libros" en el catálogo; se usan las
 *   piezas de Charlas/Talleres/Lecturas dramáticas (temática afín a una
 *   feria del libro: charlas, taller de escritura, lecturas).
 *
 * `getFestivalLineup` filtra ids inexistentes con el mismo patrón que
 * `getFestivalesCiudad` de arriba, por robustez.
 */
export const FESTIVAL_LINEUP_IDS: Record<string, string[]> = {
  "festival-teatro-circo-bogota": [
    "comite-del-fracaso",
    "las-tetas-de-tiresias",
    "a-chorus-line",
    "la-consagracion-del-otono",
    "bloque-b-cifrado-urbano",
    "cuerpos-en-transito",
    "happening-mercado-vivo",
  ],
  "jazz-al-parque": [
    "trance-ritual-sonoro",
    "sesion-de-camara-numero-3",
    "verde-y-sonido",
    "recital-de-una-noche",
  ],
  "filbo-feria-del-libro": [
    "materia-y-memoria",
    "charla-dramaturgias-del-cuerpo",
    "charla-arte-y-ciudad",
    "taller-de-escritura-escenica",
    "cartas-no-enviadas-lectura-dramatica",
  ],
};

export function getFestivalLineup(id: string | undefined): Experience[] {
  if (!id) return [];
  const ids = FESTIVAL_LINEUP_IDS[id] ?? [];
  return ids.map((lid) => getExperienceById(lid)).filter((e): e is Experience => Boolean(e));
}

export function getExperienceById(id: string | undefined): Experience | undefined {
  return experiences.find((e) => e.id === id);
}

export function getExperiencesByRail(rail: Experience["rail"]): Experience[] {
  return experiences.filter((e) => e.rail === rail);
}

/*
 * 2026-09-07, a pedido de Ana: estructura de categorías ESCENA/CULTURA
 * — Descubrir agrupa las `Category` de acá arriba en 7 secciones con
 * nombre curatorial propio (sin emoji, a pedido explícito), repartidas
 * en 2 grupos:
 *
 *   ESCENA
 *   - "Escena teatral" → Teatro
 *   - "Hablan los cuerpos" → Danza
 *   - "El arte fuera de formato" → Performance
 *   - "Música para vivirla de cerca" → Música
 *
 *   CULTURA
 *   - "Cine que nace cerca" → Cine, Cine local, Cineclub
 *   - "Encuentros para crear y compartir" → Charlas, Talleres, Lecturas dramáticas
 *   - "El arte toma la ciudad" → Festivales (ver nota de abajo, 2026-09-07:
 *     ya NO vive acá)
 *
 * Esto vive como dato (la lista de secciones + a qué categorías
 * corresponde cada una), no hardcodeado en Descubrir.tsx, para que el
 * componente solo tenga que recorrer la lista y no repetir esta lógica.
 *
 * 2026-09-07, a pedido de Ana: "El arte toma la ciudad" SALE de esta
 * lista genérica — pasa a ser un carrusel editorial especial (3
 * festivales reales de Bogotá, no un riel filtrado por categoría, ver
 * `FESTIVALES_CIUDAD_IDS`/`getFestivalesCiudad()` más arriba y
 * FestivalesCarousel.tsx) y Descubrir.tsx lo renderiza a mano, primero,
 * antes de recorrer esta lista — por eso `SECCIONES_CULTURA` de acá
 * abajo ahora solo tiene las otras 2 secciones (Cine, Encuentros). La
 * categoría `Festivales` sigue existiendo en el tipo (la sigue usando
 * "Dramaturgias Nómadas", que no se toca) — lo que cambió es que esta
 * sección puntual del catálogo dejó de armarse con un filtro genérico.
 */
export interface SeccionCategoria {
  titulo: string;
  /** 2026-09-08: identificador estable para la ruta `/ver-mas/:slug` (ver
   * VerMas.tsx) — no se deriva de `titulo` al vuelo porque `titulo` puede
   * cambiar de texto (Ana ya lo hizo varias veces) sin que eso deba
   * romper el link ya generado en Descubrir.tsx. */
  slug: string;
  categorias: Category[];
  /** 2026-09-07, a pedido de Ana: "pon las de ver mas al final de cada
   * scroll, con la card pertinente" — mismo patrón visual que
   * "Más reservados"/"Descubrimientos" en Todo (`VerMasCard`, número +
   * "Ver más"). Igual que esos 2 rieles (`+15`/`+40`, ver Descubrir.tsx),
   * es un número de PRIMERA PASADA inventado — mismo criterio que
   * `rating`/`ficha`/`porQueDescubrir` en cada experiencia, no hay
   * conteo real de "cuántas más hay" todavía. Opcional con default 10
   * (ver Descubrir.tsx) por si se agrega una sección nueva sin pensarlo. */
  verMasCount?: number;
  /** 2026-09-07: foto para la card de "Ver más" al final del riel — Ana
   * subió una imagen genérica por sección ("ver mas danza.jpg", etc.)
   * para Danza/Performance/Música. 2026-09-08: Ana sumó también
   * "ver mas teatro.jpg" y "ver mas cine.jpg" — sigue faltando solo la
   * de "Encuentros para crear y compartir" (Cultura), que ya tiene su
   * propia foto desde 2026-09-08. */
  verMasImageUrl?: string;
}

export const SECCIONES_ESCENA: SeccionCategoria[] = [
  {
    titulo: "Escena teatral",
    slug: "escena-teatral",
    categorias: ["Teatro"],
    verMasCount: 12,
    verMasImageUrl: "/assets/images/ver%20mas%20teatro.jpg",
  },
  {
    titulo: "Hablan los cuerpos",
    slug: "hablan-los-cuerpos",
    categorias: ["Danza"],
    verMasCount: 9,
    verMasImageUrl: "/assets/images/ver%20mas%20danza.jpg",
  },
  {
    titulo: "El arte fuera de formato",
    slug: "el-arte-fuera-de-formato",
    categorias: ["Performance"],
    verMasCount: 11,
    verMasImageUrl: "/assets/images/ver%20mas%20performance.jpg",
  },
  {
    titulo: "Música para vivirla de cerca",
    slug: "musica-para-vivirla-de-cerca",
    categorias: ["Música"],
    verMasCount: 7,
    verMasImageUrl: "/assets/images/ver%20mas%20musica.jpg",
  },
];

export const SECCIONES_CULTURA: SeccionCategoria[] = [
  {
    titulo: "Cine que nace cerca",
    slug: "cine-que-nace-cerca",
    categorias: ["Cine", "Cine local", "Cineclub"],
    verMasCount: 14,
    verMasImageUrl: "/assets/images/ver%20mas%20cine.jpg",
  },
  {
    titulo: "Encuentros para crear y compartir",
    slug: "encuentros-para-crear-y-compartir",
    categorias: ["Charlas", "Talleres", "Lecturas dramáticas"],
    verMasCount: 10,
    // 2026-09-08: foto real subida por Ana.
    verMasImageUrl: "/assets/images/ver%20mas%20encuentros.jpg",
  },
];

export function getExperiencesByCategories(
  categorias: Category[],
): Experience[] {
  return experiences.filter((e) => categorias.includes(e.category));
}

/*
 * 2026-09-08, a pedido de Ana ("la pantalla de ver mas, la armamos con
 * el contenido ya de cada sección"): lookup único para la pantalla
 * VerMas.tsx, que recibe un `slug` por ruta (`/ver-mas/:slug`) y necesita
 * resolver a qué contenido corresponde sin que Descubrir.tsx y VerMas.tsx
 * dupliquen la misma lógica de filtrado cada uno por su lado. Cubre los
 * 2 rieles fijos de la pestaña "Todo" (identificados por su propio
 * `rail`, ver `getExperiencesByRail` arriba) y las 6 secciones de
 * Escena/Cultura (identificadas por `slug`, ver `SeccionCategoria`).
 * `cardVariant` le dice a VerMas.tsx qué card reusar — mismo criterio
 * "con lo que hay": ninguna card ni grilla nueva, se reusa la MISMA
 * card que ya se ve en el riel de origen (`ExperienceCardMasReservados`
 * para "Más reservados", `ExperienceCardDescubrimientos` para el resto).
 *
 * 2026-09-08, a pedido de Ana ("resuélvelo" — "Más Curados" y
 * "Festivales → Próximos" eran botones que no llevaban a ningún lado):
 * se suman los slugs "curado" y "festivales-ciudad", mismo criterio de
 * reusar la card ya existente — acá `ExperienceCardCurado`, la misma
 * que ya usan el riel de Curado y `FestivalesCarousel`. `cardVariant`
 * gana un tercer valor, "curado".
 */
export interface VerMasContent {
  titulo: string;
  experiencias: Experience[];
  cardVariant: "reservados" | "descubrimientos" | "curado";
}

const SECCIONES_TODAS: SeccionCategoria[] = [...SECCIONES_ESCENA, ...SECCIONES_CULTURA];

export function getVerMasContent(slug: string | undefined): VerMasContent | undefined {
  if (!slug) return undefined;
  if (slug === "mas-reservados") {
    return {
      titulo: "Más reservados",
      experiencias: getExperiencesByRail("mas-reservados"),
      cardVariant: "reservados",
    };
  }
  if (slug === "descubrimientos") {
    return {
      titulo: "Descubrimientos",
      experiencias: getExperiencesByRail("descubrimientos"),
      cardVariant: "descubrimientos",
    };
  }
  if (slug === "curado") {
    return {
      titulo: "Curados por Theaveling",
      experiencias: getExperiencesByRail("curado"),
      cardVariant: "curado",
    };
  }
  if (slug === "festivales-ciudad") {
    return {
      titulo: "Festivales",
      experiencias: getFestivalesCiudad(),
      cardVariant: "curado",
    };
  }
  const seccion = SECCIONES_TODAS.find((s) => s.slug === slug);
  if (!seccion) return undefined;
  return {
    titulo: seccion.titulo,
    experiencias: getExperiencesByCategories(seccion.categorias),
    cardVariant: "descubrimientos",
  };
}

/**
 * "Contenido similar" (Detalle, sección 6) — 2026-09-03. Prioriza otras
 * experiencias de la misma `category` (excluyéndose a sí misma); si no
 * hay suficientes, completa con cualquier otra. No hay lógica real de
 * recomendación todavía (no hay backend) — es la aproximación más honesta
 * disponible con los datos mock actuales.
 */
export function getRelatedExperiences(id: string, count = 4): Experience[] {
  const current = getExperienceById(id);
  const rest = experiences.filter((e) => e.id !== id);
  if (!current) return rest.slice(0, count);

  const sameCategory = rest.filter((e) => e.category === current.category);
  const others = rest.filter((e) => e.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}
