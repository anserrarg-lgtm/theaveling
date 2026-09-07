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
  rail: "curado" | "mas-reservados" | "descubrimientos";
  imageUrl?: string;
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
];

export function getExperienceById(id: string | undefined): Experience | undefined {
  return experiences.find((e) => e.id === id);
}

export function getExperiencesByRail(rail: Experience["rail"]): Experience[] {
  return experiences.filter((e) => e.rail === rail);
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
