import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationSheet from "../../components/LocationSheet";
import { useCiudad } from "../../context/CiudadContext";
import FechaSheet, { MESES, type FechaSeleccionada } from "../../components/FechaSheet";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { IconCalendar, IconCaretRight, IconMapPin, IconSearch } from "../../components/icons";
import { experiences, getExperienceById, type Experience } from "../../data/experiences";
import { generarFechasReales } from "../../utils/price";

/*
 * Búsqueda — nodo real de Figma `search-screen` (`2034:702`), dentro de
 * "05 — Búsqueda" del archivo Prototipo final (`Bas9SSdMLitN1S37kjFeOy`),
 * traído vía get_design_context 2026-09-04, a pedido de Ana ("hagamos la
 * pantalla de busqueda, como la tenemos en figma, en verde... siendo fiel
 * a lo que tenemos ahi, y a los estandares que tenemos ya en el diseno de
 * codigo"). Se abre desde el ícono de lupa del Mobile Top Bar (antes sin
 * onClick — ver MobileTopBar.tsx), ruta `/busqueda`.
 *
 * Ya verde en el propio Figma (`bg-[#112c2c]` = `thea-green`, ya
 * tokenizado en index.css) — a diferencia de Perfil/Notificaciones/Datos
 * de cuenta, acá no hubo que convertir un mockup claro: esta pantalla se
 * diseñó directo sobre fondo oscuro. Cards (`filtros-card`,
 * `tendencias-card`) en `bg-white-6`, Input en `bg-white-8` — mismos 2
 * tokens de superficie que ya usa el resto de la app sobre fondo oscuro
 * (ver SupportingCard.tsx, DatosDeCuenta.tsx), sin valores sueltos.
 *
 * 2026-09-07: el fondo quedó con el verde más claro (`thea-green`) y Ana
 * pidió pasarlo al verde deep. Se usa `bg-[rgb(1,20,20)]` (mismo RGB que
 * `thea-deep` pero sólido al 100%) en vez de `bg-thea-deep` directo —
 * mismo motivo que Perfil.tsx/DatosDeCuenta.tsx/Notificaciones.tsx:
 * `thea-deep` es 95% opaco (pensado para ir sobre una foto), y acá cubre
 * texto plano sin foto detrás, así que el 5% restante dejaría ver un
 * "fantasma" del contenido al scrollear.
 *
 * Header fijo (back + campo de búsqueda) — mismo criterio ya establecido
 * en toda la app ("toda pantalla con back se mantiene visible al
 * scrollear", ver Perfil.tsx/DatosDeCuenta.tsx/Notificaciones.tsx), mismo
 * fondo deep que el resto de la pantalla — Figma tampoco separa el
 * header del resto con otro fondo o borde, así que queda fiel a eso: sin
 * línea divisoria.
 *
 * Campo de búsqueda — input real y controlado (autoFocus, mismo patrón
 * que el buscador de ciudad en LocationSheet.tsx), no un cascarón
 * decorativo. El placeholder "Buscar experiencia..." en Figma se ve en
 * blanco pleno (#fbfbfb, el mismo tono que un texto ya escrito) porque
 * es una captura estática que no distingue vacío/con texto — acá se usa
 * el criterio real ya establecido en LocationSheet (`placeholder:
 * text-white-40`, atenuado), porque acá sí hay un input funcional que
 * necesita diferenciar ambos estados. Sin lógica de resultados todavía:
 * ni Figma ni PENDIENTES.md definen una pantalla de "resultados de
 * búsqueda" — no se inventa, queda pendiente de definir con Ana (ver
 * nota de Tendencias más abajo).
 *
 * Tamaño del campo — 2026-09-04, corregido a pedido de Ana ("el
 * buscador de ubicacion y el de busqueda tienen el mismo tamano? no
 * parece, ponle al de busqueda el mismo tamano que el de ubicacion").
 * La primera versión calcó el spec literal de Figma para este campo
 * (`Input, Type=Search, Surface=Green`, 48px de alto, ícono 20px) — pero
 * al lado del buscador de LocationSheet.tsx (44px, ícono 16px, mismo
 * `rounded-xl bg-white-8`) se notaba la diferencia. Ana pidió igualarlo
 * al de LocationSheet, no al revés, así que este campo pasa a esa
 * medida (h-11, ícono w-4 h-4, text-sm) — deja de calcar el nodo de
 * Figma al pixel para en cambio hacer juego con el otro buscador real
 * de la app, que es lo que se ve/compara en uso.
 *
 * "Ubicación — Bogotá" — clickeable de verdad: abre el mismo
 * `LocationSheet` que ya usa el pin del Top Bar en Descubrir (mismo
 * componente, no uno nuevo). El subrayado es spec real de Figma
 * (`text-decoration: underline`), no un agregado — encaja con que sea
 * un link real. `onSelect` es un no-op por ahora: Búsqueda todavía no
 * filtra nada por ciudad (igual que Descubrir, ver esa nota en
 * LocationSheet.tsx).
 *
 * "Por fecha" — 2026-09-04, resuelto a pedido de Ana ("por fechas
 * deberia poder clckearse y aparecer un calendario"): ahora abre
 * `FechaSheet`, un calendario real (no un cascarón) — ver esa nota para
 * de dónde sale el componente real de Figma que lo respalda ("Date
 * Selector", `2150:992`, en "02 — Components", con descripción propia
 * "Selector de fecha... para filtrar búsquedas por fecha"). Una vez
 * elegida una fecha, la fila muestra el valor elegido en vez de "Por
 * fecha" — mismo criterio que "Ubicación — Bogotá" (el texto de la fila
 * ES el valor actual, no una etiqueta fija separada del valor).
 * Subrayado — 2026-09-04, agregado a pedido de Ana ("subraya por fecha
 * para que se vea clickeable"): mismo tratamiento que ya tenía
 * "Ubicación — Bogotá", ahora las 2 filas de `filtros-card` se ven
 * igual de clickeables entre sí.
 *
 * Chips "Hoy"/"Mañana"/"Este fin de semana" — 2026-09-04, agregados
 * arriba del calendario a pedido de Ana. "Este fin de semana" es un
 * RANGO (sábado+domingo), no un día — por eso `fecha` es
 * `FechaSeleccionada | null` (`{ desde, hasta, etiqueta? }`) en vez de
 * `Date | null` (ver esa nota grande en FechaSheet.tsx). `formatearFecha`
 * de abajo prioriza `etiqueta` cuando la selección vino de un chip;
 * si vino de tocar un día suelto en la grilla, calcula "{día} de {mes}".
 *
 * "Tendencias" — 2026-09-04, resuelto a pedido de Ana ("hazzla toda
 * clickeable y pon las mismas fotos que se utlizan para experiencias en
 * la miniatura"): los 5 ítems son ahora experiencias reales de
 * `experiences.ts`, no el copy suelto de Figma. De los 5 originales de
 * Figma, 2 coincidían con experiencias reales (truncados/con nombre
 * distinto ahí — "Cuerpos en tránsito" y "Fronteras Difusas:
 * Retrospectiva") y se mantienen, con su título REAL completo ahora
 * ("...Función Íntima" / "...Retrospectiva Analógica" — mostrar el
 * título corto de Figma llevaría a un Detalle con un título distinto al
 * que se acaba de leer, eso sí se sentiría roto). Los otros 3 no tenían
 * ninguna experiencia asociada — se reemplazan por 3 experiencias
 * reales más (`antigona-ahora`, `trance-ritual-sonoro`,
 * `noche-de-cortos-ciudad-invisible`), elegidas por variedad de
 * categoría/tag, no hay ningún criterio real de "tendencia" todavía
 * (mismo pendiente que ya señalaba PENDIENTES.md: "orden por puntuación
 * de Descubrimientos... sin definir" — acá el orden es solo el elegido
 * a mano). Cada fila es un `Link` real a `/experiencia/:id` (mismo
 * patrón que Descubrir.tsx) y la miniatura usa `exp.imageUrl`, la misma
 * foto que ya usan esas experiencias en sus cards — reemplaza el
 * `ImagePlaceholder` de antes (que a su vez ya había reemplazado el
 * color plano suelto `#d9d1c7` de Figma, ver versión anterior de esta
 * nota). `ImagePlaceholder` se mantiene solo como fallback defensivo
 * si alguna experiencia no tuviera `imageUrl` (no pasa hoy con estas 5,
 * mismo criterio defensivo que ya usa SupportingCard.tsx).
 *
 * RESULTADOS DE BÚSQUEDA — 2026-09-05, a pedido de Ana, resolviendo el
 * pendiente de arriba ("Sin lógica de resultados todavía"): "SI ES
 * CONSECUENTE CON LA INFO Y FECHAS QUE TENEMOS PREVISTAS ENTONCES QUE
 * APAREZCA LA INFO, SINO PUES SE LE DICE LO DE O NO ESTAMOS TODAVIA EN
 * ESTA CIUDAD O NO HAY RESULTADOS PARA TU BUSQUEDA PERO TENEMOS". Se
 * modelan 4 estados posibles de esta pantalla, mutuamente excluyentes:
 *
 * 1. Sin búsqueda activa (sin texto y sin fecha elegida) — el estado de
 *    entrada de siempre, sin cambios: se ve "Tendencias".
 * 2. Búsqueda activa pero la ciudad elegida no es real (`ciudad` ya no es
 *    un no-op, ver `onSelect` de `LocationSheet` más abajo) — se avisa
 *    honestamente que Theaveling todavía no opera ahí, mismo criterio que
 *    ya usa `LocationSheet.tsx` para el mismo caso dentro del selector de
 *    ciudad. Hoy es difícil de disparar en la práctica (el propio
 *    `LocationSheet` no deja elegir ninguna ciudad que no sea Bogotá
 *    todavía — ver ese archivo), pero la lógica queda lista para cuando
 *    haya más de una ciudad real, en vez de asumir para siempre que
 *    `ciudad` es Bogotá.
 * 3. Búsqueda activa, ciudad real, y `coincideConBusqueda` encuentra al
 *    menos una experiencia — se muestra la lista de RESULTADOS reales
 *    (mismas experiencias de `experiences.ts`, no inventadas).
 * 4. Búsqueda activa, ciudad real, cero coincidencias — "no hay
 *    resultados para tu búsqueda, pero tenemos" + la misma lista curada
 *    de `TENDENCIAS_IDS` de siempre, como sugerencia (no se deja a la
 *    persona en un callejón sin salida).
 *
 * Coincidencia de TEXTO — contra `title`/`tag`/`category`/`venue` de cada
 * experiencia, sin distinguir mayúsculas ni tildes (`normalizar`, para
 * que "teatro" encuentre "Teatro" y "escenico" encuentre "escénico") —
 * mismo criterio de búsqueda tolerante que cualquier buscador esperable,
 * no una coincidencia exacta frágil.
 *
 * Coincidencia de FECHA — "consecuente con las fechas que tenemos
 * previstas" se resuelve comparando contra las fechas REALES generadas
 * por `generarFechasReales` (utils/price.ts, mismo generador que ya usa
 * Compra.tsx para sus chips de fecha/hora) — no contra el string plano
 * de `date`. Si el catálogo dice que una experiencia tiene función un
 * viernes y el usuario busca "este fin de semana", tiene que coincidir
 * de verdad con una fecha de calendario real de esa experiencia, no con
 * una comparación de texto superficial.
 */

/** Sin distinguir mayúsculas ni tildes — para que la búsqueda encuentre
 * "Teatro"/"teatro"/"téatro" por igual. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Compara solo año/mes/día (ignora horas) — `fecha` es uno de los `Date`
 * reales de `generarFechasReales`, `desde`/`hasta` vienen de FechaSheet. */
function fechaDentroDelRango(fecha: Date, desde: Date, hasta: Date): boolean {
  const t = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime();
  const d = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate()).getTime();
  const h = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate()).getTime();
  return t >= d && t <= h;
}

/** true si `exp` coincide con el texto buscado (si hay) Y con la fecha
 * elegida (si hay) — ver nota grande arriba, "RESULTADOS DE BÚSQUEDA". */
function coincideConBusqueda(
  exp: Experience,
  queryNormalizada: string,
  fecha: FechaSeleccionada | null,
): boolean {
  if (queryNormalizada) {
    const haystack = normalizar(`${exp.title} ${exp.tag} ${exp.category} ${exp.venue}`);
    if (!haystack.includes(queryNormalizada)) return false;
  }
  if (fecha) {
    const fechasReales = generarFechasReales(exp.date);
    const algunaCoincide = fechasReales.some((f) => fechaDentroDelRango(f, fecha.desde, fecha.hasta));
    if (!algunaCoincide) return false;
  }
  return true;
}

function formatearFecha(sel: FechaSeleccionada | null): string {
  if (!sel) return "Por fecha";
  if (sel.etiqueta) return sel.etiqueta;
  const desde = `${sel.desde.getDate()} de ${MESES[sel.desde.getMonth()].toLowerCase()}`;
  if (sel.desde.toDateString() === sel.hasta.toDateString()) return desde;
  const hasta = `${sel.hasta.getDate()} de ${MESES[sel.hasta.getMonth()].toLowerCase()}`;
  return `${desde} – ${hasta}`;
}

const TENDENCIAS_IDS = [
  "cuerpos-en-transito",
  "fronteras-difusas",
  "antigona-ahora",
  "trance-ritual-sonoro",
  "noche-de-cortos-ciudad-invisible",
] as const;

/** Fila de una experiencia dentro de una lista de Búsqueda (Tendencias,
 * Resultados o la sugerencia de "no hay resultados, pero tenemos") —
 * mismo trazo en los 3 casos, para que la pantalla se sienta un solo
 * lenguaje visual y no 3 componentes distintos. `subtitulo` es opcional:
 * Tendencias no lo usa (mismo look de siempre), Resultados sí lo pasa
 * (categoría + venue) porque ahí sí importa mostrar POR QUÉ coincidió. */
function FilaExperiencia({ exp, subtitulo }: { exp: Experience; subtitulo?: string }) {
  return (
    <Link to={`/experiencia/${exp.id}`} className="flex items-center gap-4 py-4">
      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-white-8 shrink-0">
        {exp.imageUrl ? (
          <img src={exp.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-body text-sm text-white-100 truncate">{exp.title}</span>
        {subtitulo && (
          <span className="font-body text-[13px] text-white-60 truncate">{subtitulo}</span>
        )}
      </div>
    </Link>
  );
}

export default function Busqueda() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [fechaSheetOpen, setFechaSheetOpen] = useState(false);
  const [fecha, setFecha] = useState<FechaSeleccionada | null>(null);
  // 2026-09-07, bug real de build: esto era antes `useState("Bogotá")`
  // actualizado a mano vía un `onSelect` que se le pasaba a
  // `LocationSheet`. Ese prop se eliminó de `LocationSheet.tsx` cuando
  // pasó a leer/escribir la ciudad directo del `CiudadContext`
  // compartido (ver la nota grande de ese archivo) — pero acá nunca se
  // actualizó el consumidor, así que quedó pasando un `onSelect` que ya
  // no existe en el componente (error de TypeScript: "Property
  // 'onSelect' does not exist"), invisible en local porque `vite dev` no
  // tipa-chequea, pero rompía el build real (`tsc -b && vite build`) en
  // Vercel. Se lee la ciudad del mismo `CiudadContext` que ya usa
  // `LocationSheet` — ahora si el usuario cambia de ciudad ahí, esta
  // pantalla lo refleja solo, sin necesitar ningún callback.
  const { ciudad: ciudadCompartida } = useCiudad();
  const ciudad = ciudadCompartida ?? "Bogotá";

  const tendencias = TENDENCIAS_IDS.map((id) => getExperienceById(id)).filter(
    (exp): exp is NonNullable<typeof exp> => exp !== undefined,
  );

  const ciudadEsReal = ciudad === "Bogotá";
  const hayBusquedaActiva = query.trim() !== "" || fecha !== null;
  const queryNormalizada = normalizar(query);
  const resultados =
    hayBusquedaActiva && ciudadEsReal
      ? experiences.filter((exp) => coincideConBusqueda(exp, queryNormalizada, fecha))
      : [];

  return (
    <div className="min-h-screen bg-[rgb(1,20,20)] text-white-100">
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center gap-3 px-5 pt-[calc(20px_+_var(--safe-top))] pb-3 bg-[rgb(1,20,20)]">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="h-5 w-5 shrink-0 flex items-center justify-center"
        >
          <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
        </button>
        <label className="flex items-center gap-2.5 h-11 rounded-xl bg-white-8 px-4 flex-1">
          <IconSearch className="w-4 h-4 text-white-100 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar experiencia..."
            className="flex-1 bg-transparent font-body text-sm text-white-100 placeholder:text-white-40 outline-none min-w-0"
          />
        </label>
      </header>

      <div className="flex flex-col gap-3 px-5 pt-[calc(80px_+_var(--safe-top))] pb-10">
        <div className="rounded-xl bg-white-6 px-4 py-1">
          <button
            onClick={() => setLocationSheetOpen(true)}
            className="flex items-center gap-2 py-3 w-full text-left"
          >
            <IconMapPin className="w-4 h-4 text-white-100 shrink-0" />
            <span className="font-body text-sm text-white-100 underline underline-offset-2">
              Ubicación — {ciudad}
            </span>
          </button>
          <button
            onClick={() => setFechaSheetOpen(true)}
            className="flex items-center gap-2 py-3 w-full text-left"
          >
            <IconCalendar className="w-4 h-4 text-white-100 shrink-0" />
            <span className="font-body text-sm text-white-100 underline underline-offset-2">
              {formatearFecha(fecha)}
            </span>
          </button>
        </div>

        {!hayBusquedaActiva ? (
          <div className="rounded-xl bg-white-6 p-4 flex flex-col">
            <h2 className="font-body font-semibold text-sm text-white-100">TENDENCIAS</h2>
            {tendencias.map((exp) => (
              <FilaExperiencia key={exp.id} exp={exp} />
            ))}
          </div>
        ) : !ciudadEsReal ? (
          // Punto 2 de la nota grande arriba: mismo criterio honesto que
          // ya usa LocationSheet.tsx para el mismo caso.
          <div className="rounded-xl bg-white-6 p-4 flex flex-col items-center gap-2 py-10 text-center">
            <span className="h-11 w-11 rounded-full bg-white-8 flex items-center justify-center">
              <IconMapPin className="w-5 h-5 text-white-40" />
            </span>
            <p className="font-body font-semibold text-sm text-white-100">
              Todavía no estamos en {ciudad}
            </p>
            <p className="font-body text-[13px] text-white-40 max-w-[260px]">
              Theaveling por ahora solo opera en Bogotá — vamos sumando ciudades de a poco.
            </p>
          </div>
        ) : resultados.length > 0 ? (
          // Punto 3: coincide de verdad (texto y/o fecha real) — ver
          // `coincideConBusqueda` arriba.
          <div className="rounded-xl bg-white-6 p-4 flex flex-col">
            <h2 className="font-body font-semibold text-sm text-white-100">
              RESULTADOS ({resultados.length})
            </h2>
            {resultados.map((exp) => (
              <FilaExperiencia key={exp.id} exp={exp} subtitulo={`${exp.category} · ${exp.venue}`} />
            ))}
          </div>
        ) : (
          // Punto 4: cero coincidencias — se avisa y se sugiere la misma
          // lista curada de Tendencias, en vez de dejar la pantalla vacía.
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-white-6 p-4 flex flex-col items-center gap-2 py-10 text-center">
              <span className="h-11 w-11 rounded-full bg-white-8 flex items-center justify-center">
                <IconSearch className="w-5 h-5 text-white-40" />
              </span>
              <p className="font-body font-semibold text-sm text-white-100">
                No hay resultados para tu búsqueda
              </p>
              <p className="font-body text-[13px] text-white-40 max-w-[260px]">
                Pero tenemos estas experiencias que podrían interesarte.
              </p>
            </div>
            <div className="rounded-xl bg-white-6 p-4 flex flex-col">
              {tendencias.map((exp) => (
                <FilaExperiencia key={exp.id} exp={exp} />
              ))}
            </div>
          </div>
        )}
      </div>

      <LocationSheet
        open={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
      />
      <FechaSheet
        open={fechaSheetOpen}
        selected={fecha}
        onSelect={setFecha}
        onClose={() => setFechaSheetOpen(false)}
      />
    </div>
  );
}
