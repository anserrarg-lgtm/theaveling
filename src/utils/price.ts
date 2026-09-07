/*
 * Utilidades de precio — nuevas 2026-09-04 para Compra.tsx (frame
 * `compra-mobile`, ver Compra.tsx). No existía ningún parser de precio
 * en el proyecto todavía (se buscó explícitamente antes de escribir
 * esto: no hay coincidencias reales en `src` para "COP"/"toLocaleString"/
 * "parseInt"/"parsePrice" salvo un texto suelto sin relación en
 * Perfil.tsx).
 *
 * `experience.price` en experiences.ts es un string ya formateado para
 * mostrar tal cual en Detalle: "Gratis" o algo tipo "$35.000 COP" (punto
 * como separador de miles, formato colombiano). Acá solo se necesita
 * parsear ESE string a un número para poder multiplicar por la cantidad
 * de entradas y volver a formatear el total — no se inventa ninguna
 * fuente de precio nueva.
 */

/** Convierte "$35.000 COP" → 35000. "Gratis" (o cualquier variante sin
 * dígitos) → 0. */
export function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}

/** true si el precio del catálogo es "Gratis" (sin monto, no un caso de
 * 0 pesos disfrazado — se compara contra el string tal cual, no contra
 * `parsePriceToNumber() === 0`, para no confundir un precio mal
 * formateado con una pieza realmente gratuita). */
export function esGratis(price: string): boolean {
  return price.trim().toLowerCase() === "gratis";
}

/** Formatea un monto en pesos colombianos con el mismo criterio visual
 * que ya usa el catálogo (punto de miles, sin decimales, sufijo " COP"):
 * 85000 → "$85.000 COP". */
export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

/** Separa el campo `date` del catálogo (ej. "Viernes 21 mar · 21:00")
 * en fecha y hora para las filas separadas del resumen de Compra. Si no
 * trae el separador " · " (no debería pasar con los datos reales, pero
 * por si acaso), devuelve todo como fecha y hora vacía en vez de
 * inventar una hora. */
export function splitFechaHora(date: string): { fecha: string; hora: string } {
  const partes = date.split(" · ");
  if (partes.length < 2) return { fecha: date, hora: "" };
  return { fecha: partes[0], hora: partes.slice(1).join(" · ") };
}

/*
 * 2026-09-05 — bug real encontrado probando "Uno a Uno" (`uno-a-uno`,
 * único caso del catálogo con horario no estándar: "14:00–20:00
 * (sesiones cada 15 min)" en vez de "HH:MM"). Los chips de fecha/hora de
 * Compra.tsx y las cards de TodasFechasSheet.tsx están pensados para una
 * hora corta ("20:00") — con este texto largo el chip se estiraba mucho
 * más ancho que el resto, rompiendo la fila de 2 chips centrados
 * (ver captura). `horaCompacta` saca solo el "HH:MM" inicial para estos
 * usos chicos — no se pierde el detalle real: `experiencia.duracion` en
 * la ficha de Detalle sigue explicando las sesiones de 8 minutos y el
 * rango horario completo, esto es solo para que el chip/card no se
 * rompa visualmente.
 */
export function horaCompacta(hora: string): string {
  const match = hora.match(/^\d{1,2}:\d{2}/);
  return match ? match[0] : hora;
}

/*
 * 2026-09-04, a pedido de Ana: "PON LAS OTRAS DOS FECHAS Y HORAS, SON 3
 * LAS QUE ESTAN EN FIGMA Y CON LA ABREVIACION DEL DIA O SEA VIE MAR
 * MIER ETC". El nodo real de Compra (`section-datetime`, `1837:549`)
 * trae 3 chips de fecha/hora entre los que elegir, uno ya seleccionado
 * — no 1 solo chip fijo. El catálogo real (`experiences.ts`) solo
 * modela UNA función por experiencia (`date`), así que las otras son
 * "primera pasada" derivadas de la real (mismo criterio que ya usa
 * Reservas.tsx para sus fechas de ejemplo: inventado pero plausible, no
 * suelto) — la fecha real del catálogo nunca se pisa, queda siempre
 * como opción 0.
 *
 * Día de la semana ABREVIADO ("Vie"/"Sáb"/"Dom") — pedido explícito de
 * Ana, coincide además con el texto literal del nodo real de Figma
 * ("Vie 20 mar", no "Viernes 20 mar"). El resto de la app (Reservas.tsx,
 * etc.) sí usa el nombre completo del día — esa convención no cambia acá,
 * esto es específico del selector de Compra por pedido puntual de Ana.
 *
 * 2 chips visibles, no 3 — mismo día, a pedido de Ana: "AH OK NO CABEN
 * LAS 3 BUENO PON DOS ENTONCES" (con el ancho real de la card en el
 * viewport mobile, 3 chips de `min-w-[110px]` no entraban en una sola
 * fila sin cortarse — ver el chat). En vez de sacar la 3ra opción del
 * todo, se la deja generada acá y Compra.tsx muestra 2 nomás, el resto
 * detrás de un link ("Ver otras" → después "Ver todas", ver Compra.tsx
 * y TodasFechasSheet.tsx).
 *
 * 2026-09-05, a pedido de Ana: "NECESITAMOS MUCHAS MAS OPCIONES Y QUE
 * PONGAS CUANTAS QUEDAN EN CADA OPCION". Se pasa de 3 a
 * `NUM_OPCIONES_FECHA_HORA` (6) opciones — la real (opción 0) + 5
 * derivadas, alternando la hora cada 2 días (mismo criterio que ya
 * usaba la hora alterna de antes, generalizado). Siguen siendo
 * "primera pasada" derivadas de la fecha real del catálogo, mismo
 * criterio que Reservas.tsx.
 *
 * "Cuántas quedan" — el catálogo no modela cupo/aforo por función (no
 * hay ningún dato real de disponibilidad). En vez de dejarlo sin
 * construir por eso, se genera un número determinístico y plausible
 * por opción — ver `lugaresDisponibles` más abajo — documentado como
 * estimado/decorativo, igual criterio que el resto del contenido
 * "primera pasada" del proyecto (no pretende ser inventario real).
 *
 * 2026-09-05, a pedido de Ana: con la card mostrando 4 chips visibles
 * (ver `NUM_CHIPS_VISIBLE` en Compra.tsx), pidió que "Ver todas" tenga
 * "por lo menos 6" opciones más allá de esas 4 ("SI YA HAY 4 HORARIOS
 * LOS QUE ESTAN VER TODOS DEBEN SER POR LO MENOS 6"). Se sube
 * `NUM_OPCIONES_FECHA_HORA` de 6 a 10 (4 visibles + 6 en el sheet).
 *
 * Día/mes con `Date` real, ya no con offset ingenuo — antes el día se
 * incrementaba a mano (`diaNum + i`) sin validar cuántos días tiene el
 * mes real, documentado como "límite conocido, no resuelto". Con 10
 * opciones (hasta +9 días) ese límite dejaba de ser un detalle menor:
 * varias experiencias del catálogo (ej. "Viernes 30 oct", "Viernes 27
 * nov") ya pasan de fin de mes antes de llegar a la opción 10, y sin
 * arreglarlo iban a salir fechas inválidas tipo "Vie 39 oct". Se
 * reemplaza el cálculo por aritmética real de `Date` (mismo criterio de
 * exactitud de calendario ya usado para los días de la semana reales de
 * `experiences.ts`): `new Date(2026, mesIndice, diaNum + i)` hace el
 * "carry" de mes (y de año, si hiciera falta) solo, y de ahí se leen
 * el día, el mes y el día de la semana ya corregidos — no hay más
 * límite conocido que documentar acá.
 */

const DIAS_SEMANA_COMPRA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

const DIA_ABREVIADO_COMPRA: Record<string, string> = {
  domingo: "Dom",
  lunes: "Lun",
  martes: "Mar",
  "miércoles": "Mié",
  jueves: "Jue",
  viernes: "Vie",
  "sábado": "Sáb",
};

export type OpcionFechaHora = { fecha: string; hora: string };

const NUM_OPCIONES_FECHA_HORA = 10;

// Orden real de los meses (índice 0-11, para `Date`) — mismas
// abreviaturas de 3 letras que ya usa el catálogo en `date` ("oct",
// "nov", etc.) y `MES_ABREV_A_COMPLETO` más abajo.
const MES_ABREV_ORDEN = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
] as const;

// Año fijo del catálogo — mismo que usa `TodasFechasSheet.tsx` para su
// encabezado de mes (`new Date().getFullYear()`, hoy 2026). Se fija acá
// en vez de tomarlo dinámico porque `generarOpcionesFechaHora` necesita
// construir un `Date` real ya, no solo mostrar el año.
const ANIO_CATALOGO = 2026;

/** Genera las opciones de fecha/hora del selector de Compra (chips
 * "Fecha y hora" del Booking Selector Card + TodasFechasSheet) a partir
 * de la fecha real del catálogo — ver nota grande arriba.
 * Compra.tsx solo muestra las 4 primeras de entrada; el resto queda
 * detrás de "Ver todas". Si `date` no matchea el formato esperado
 * ("Día DD mes"), se devuelve solo la opción real (abreviada), sin
 * inventar variaciones sin estructura confiable de la que partir.
 *
 * Día/mes/día-de-semana de cada opción se calculan con un `Date` real
 * (`new Date(ANIO_CATALOGO, mesIndice, diaNum + i)`) en vez de sumar el
 * offset a mano — así el "carry" de fin de mes (y de año) lo resuelve
 * el motor de fechas, no un cálculo propio. Ver nota grande arriba. */
export function generarOpcionesFechaHora(date: string): OpcionFechaHora[] {
  const { fecha, hora } = splitFechaHora(date);
  const match = fecha.match(/^(\p{L}+)\s+(\d{1,2})\s+(\p{L}+)$/u);
  if (!match) return [{ fecha, hora }];

  // El día de semana literal del catálogo (`match[1]`) no hace falta
  // para generar las opciones — se recalcula desde el `Date` real de
  // cada una, así queda siempre correcto aunque la opción caiga en otro
  // mes. Se ignora acá (no se destructura) para no dejar una variable
  // sin usar.
  const [, , diaNumStr, mesAbrev] = match;
  const diaNum = parseInt(diaNumStr, 10);
  const mesIndice = MES_ABREV_ORDEN.indexOf(mesAbrev.toLowerCase() as (typeof MES_ABREV_ORDEN)[number]);
  if (mesIndice === -1 || Number.isNaN(diaNum)) return [{ fecha, hora }];

  // Hora alterna, igual criterio que el ejemplo real de Figma
  // (20:30 → 18:00): un horario distinto, no una hora inventada sin
  // relación con la real. Se alterna día sí, día no.
  const horaAlterna = hora === "18:00" ? "20:00" : "18:00";

  return Array.from({ length: NUM_OPCIONES_FECHA_HORA }, (_, i) => {
    const d = new Date(ANIO_CATALOGO, mesIndice, diaNum + i);
    const diaSemanaAbrev = DIA_ABREVIADO_COMPRA[DIAS_SEMANA_COMPRA[d.getDay()].toLowerCase()];
    const mesAbrevResultado = MES_ABREV_ORDEN[d.getMonth()];
    return {
      fecha: `${diaSemanaAbrev} ${d.getDate()} ${mesAbrevResultado}`,
      hora: i % 2 === 0 ? hora : horaAlterna,
    };
  });
}

/** Igual parseo que `generarOpcionesFechaHora`, pero devuelve los `Date`
 * reales de cada opción generada en vez del string abreviado — 2026-09-05,
 * a pedido de Ana para la pantalla de Resultados de Búsqueda ("SI ES
 * CONSECUENTE CON LA INFO Y FECHAS QUE TENEMOS PREVISTAS ENTONCES QUE
 * APAREZCA LA INFO"): para saber si una fecha elegida en el buscador
 * coincide de verdad con alguna función real de una experiencia hace
 * falta comparar fechas de calendario, no los strings ya formateados de
 * `generarOpcionesFechaHora` (ver Busqueda.tsx). Mismo límite conocido
 * que esa función — si `date` no matchea el formato esperado, devuelve
 * un array vacío en vez de inventar una fecha para comparar. */
export function generarFechasReales(date: string): Date[] {
  const { fecha } = splitFechaHora(date);
  const match = fecha.match(/^(\p{L}+)\s+(\d{1,2})\s+(\p{L}+)$/u);
  if (!match) return [];
  const [, , diaNumStr, mesAbrev] = match;
  const diaNum = parseInt(diaNumStr, 10);
  const mesIndice = MES_ABREV_ORDEN.indexOf(mesAbrev.toLowerCase() as (typeof MES_ABREV_ORDEN)[number]);
  if (mesIndice === -1 || Number.isNaN(diaNum)) return [];
  return Array.from(
    { length: NUM_OPCIONES_FECHA_HORA },
    (_, i) => new Date(ANIO_CATALOGO, mesIndice, diaNum + i),
  );
}

/*
 * `lugaresDisponibles` — ver nota grande arriba ("cuántas quedan"). Hash
 * determinístico (mismo patrón que `codigoReserva` en
 * ReservationCard.tsx) sobre `${experienciaId}-${fecha}-${hora}`, para
 * que el número sea estable entre renders/refresh de la MISMA opción de
 * la MISMA pieza (no cambie solo, no se sienta al azar cada vez que se
 * abre el sheet) pero varíe entre opciones y entre experiencias.
 * Rango 1–12: plausible para el cupo chico de las piezas boutique del
 * catálogo (teatro/experiencias íntimas, no estadios) — nunca 0, para no
 * mostrar una opción como agotada cuando en Compra.tsx sigue siendo
 * seleccionable (no hay lógica de "agotado" en el proyecto todavía).
 */
export function lugaresDisponibles(experienciaId: string, opcion: OpcionFechaHora): number {
  const seed = `${experienciaId}-${opcion.fecha}-${opcion.hora}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 12) + 1;
}

/*
 * 2026-09-04, a pedido de Ana (mandó captura de referencia de otra app):
 * "CUANDO SE LE DE AHI EN VER TODAS TIENE QUE SALIR UNA PANTALLA (EN
 * BOTTON SHEET) COMO LA DE LA REF... NO COLOQUE EN LAS 3 OPCIONES
 * PRIMERAS EL DIA COMPLETO VIE MAR MIER ETC" — o sea: los chips
 * chiquitos de Compra.tsx se quedan con el día ABREVIADO (eso ya está
 * bien, no se toca), pero la pantalla nueva de "Ver todas" (ver
 * `TodasFechasSheet.tsx`) tiene que mostrar el día completo, como en la
 * referencia ("domingo, 6 de septiembre").
 *
 * En vez de tocar `generarOpcionesFechaHora`/`OpcionFechaHora` (usado ya
 * en varios lugares de Compra.tsx, probado y sincronizado) para que
 * cargue un día completo que no hace falta ahí, se arma esta función
 * chica que TRANSFORMA el string abreviado que ya generamos ("Vie 21
 * mar") al formato completo que pide la referencia ("viernes, 21 de
 * marzo") — mismo dato, otra presentación, sin duplicar la lógica de
 * generación de opciones ni arriesgar romper los chips que ya
 * funcionan.
 */

const DIA_ABREV_A_COMPLETO: Record<string, string> = {
  dom: "domingo",
  lun: "lunes",
  mar: "martes",
  "mié": "miércoles",
  jue: "jueves",
  vie: "viernes",
  "sáb": "sábado",
};

const MES_ABREV_A_COMPLETO: Record<string, string> = {
  ene: "enero",
  feb: "febrero",
  mar: "marzo",
  abr: "abril",
  may: "mayo",
  jun: "junio",
  jul: "julio",
  ago: "agosto",
  sep: "septiembre",
  oct: "octubre",
  nov: "noviembre",
  dic: "diciembre",
};

/** Convierte el `fecha` abreviado de una `OpcionFechaHora` ("Vie 21
 * mar") al formato completo tipo "viernes, 21 de marzo" — usado solo en
 * TodasFechasSheet.tsx, ver nota grande arriba. Si no matchea el
 * formato esperado, devuelve el string tal cual en vez de inventar una
 * fecha. */
export function fechaCompletaDesdeChip(fechaAbreviada: string): string {
  const match = fechaAbreviada.match(/^(\p{L}+)\s+(\d{1,2})\s+(\p{L}+)$/u);
  if (!match) return fechaAbreviada;
  const [, diaAbrev, diaNum, mesAbrev] = match;
  const dia = DIA_ABREV_A_COMPLETO[diaAbrev.toLowerCase()] ?? diaAbrev.toLowerCase();
  const mes = MES_ABREV_A_COMPLETO[mesAbrev.toLowerCase()] ?? mesAbrev.toLowerCase();
  return `${dia}, ${diaNum} de ${mes}`;
}

/** Nombre completo del mes a partir de su abreviatura de catálogo
 * ("mar" → "marzo") — usado en el encabezado de mes de
 * TodasFechasSheet.tsx. Devuelve la abreviatura tal cual si no la
 * reconoce, en vez de inventar un mes. */
export function mesCompletoDesdeAbrev(mesAbrev: string): string {
  return MES_ABREV_A_COMPLETO[mesAbrev.toLowerCase()] ?? mesAbrev;
}

/** Saca solo la abreviatura del mes de un `fecha` de chip ("Vie 21
 * mar" → "mar") para el encabezado de mes de TodasFechasSheet.tsx.
 * Devuelve "" si no matchea (mismo criterio de no inventar dato). */
export function mesAbrevDesdeChip(fechaAbreviada: string): string {
  const match = fechaAbreviada.match(/^(\p{L}+)\s+(\d{1,2})\s+(\p{L}+)$/u);
  return match ? match[3] : "";
}
