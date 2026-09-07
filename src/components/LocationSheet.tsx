import { useEffect, useRef, useState } from "react";
import { IconCaretRight, IconClock, IconMapPin, IconSearch } from "./icons";
import { determinarUbicacion, type Region } from "../utils/geolocation";
import { useCiudad, type OrigenCiudad } from "../context/CiudadContext";

/*
 * LocationSheet — 2026-09-04, a pedido de Ana: reemplaza la fila de
 * Ubicación de Descubrir (ver nota en MobileTopBar.tsx) por un bottom
 * sheet que se abre al tocar el ícono nuevo, "algo como" la referencia
 * que mandó (selector de ubicación de Uber: buscador arriba, fila de
 * accesos rápidos, "Ubicación actual", lista de lugares guardados).
 *
 * CIUDAD, no barrio — 2026-09-04, corrección importante de Ana: la
 * primera versión de este sheet era un selector de ZONA/barrio de
 * Bogotá (Chapinero, La Candelaria, etc., con un "Cerca de ti" armado
 * a partir de la ubicación real). Ana lo corrigió de raíz: "yo
 * realmente no quiero la zona, thea no es eso, thea actua en la ciudad
 * completa y ya, lo curado es asi, lo de nicho es asi, lo mas probable
 * es que no aparezca nada por tu zona, vas a tener que desplazarte. lo
 * que si es que te va a pedir ubicacion para saber en que ciudad estar
 * basicamente". Theaveling es curaduría de nicho, no un servicio de
 * cercanía tipo delivery — filtrar por barrio esconde justo lo que
 * vale la pena ver. Por eso ya no existe ningún selector de zona acá:
 * la geolocalización solo sirve para confirmar la CIUDAD (hoy, si el
 * usuario está o no en el radio de Bogotá). El barrio de cada venue
 * (`venueBarrio`/`contextoBarrio` en experiences.ts) se queda donde ya
 * estaba — como dato descriptivo dentro de cada experiencia ("cómo
 * llegar"), nunca como filtro de entrada.
 *
 * Ciudades sugeridas — 2026-09-04: curadas a mano con Ana, con su
 * propio criterio de qué ciudades tienen "nicho cultural real"
 * ("si esta por latinoamerica... argentina, chile, brazil, uruguay...
 * si esta en europa... roma, madrid, londres, paris, praga"). No son
 * seleccionables todavía (respuesta explícita de Ana: "Próximamente")
 * — el catálogo real sigue siendo solo Bogotá, así que se muestran como
 * aspiracional/roadmap. La región que se sugiere depende de dónde esté
 * el usuario (`regionDesde()` en utils/geolocation.ts — un cajón de
 * lat/long muy aproximado, no un geocoder real); sin geolocalización
 * todavía se asume Latinoamérica, mismo criterio que el "Bogotá,
 * Colombia" de abajo, que también es un valor por defecto, no uno
 * detectado. Fuera de esas dos regiones no se sugiere nada — Ana fue
 * explícita en que Theaveling "no operaria en todo lado, porque no en
 * todo lado hay bueno cultura o nicho".
 *
 * Geolocalización — 2026-09-04, a pedido de Ana ("hay que pedirle la
 * ubicacion, si no la quiere dar... lo puede saltar"): NO es una
 * pantalla de onboarding nueva (eso sigue pospuesto), es el permiso
 * nativo del navegador. La fila "Ciudad actual" es el disparador —
 * tocarla pide el permiso directo, sin chip aparte (versiones
 * anteriores tuvieron un chip "Usar mi ubicación" y después un texto
 * en mint "Usar ubicación actual" adentro de la fila; a Ana no le
 * gustó ninguno de los dos — "no me gusto lo de usar mi ubicacion",
 * "que es eso en mint... quitalo" — así que ya no hay ningún texto de
 * acción visible, solo el nombre de la ciudad). Rechazar el permiso YA
 * es el "saltar". Si el permiso se concede pero las coordenadas caen
 * fuera del radio de Bogotá, se avisa que todavía no operamos ahí en
 * vez de fingir cobertura — no cambia la selección, sigue siendo
 * Bogotá por ser lo único real que existe hoy.
 *
 * Recientes — mismo patrón de persistencia que Favoritos
 * (FavoritesContext.tsx): localStorage, sin backend. Vive acá adentro
 * en vez de un Context propio porque, a diferencia de favoritos, solo
 * este componente lo lee. Guarda ciudades (no zonas) — hoy en la
 * práctica solo puede llenarse con "Bogotá", pero el mecanismo ya
 * queda listo para cuando haya más de una ciudad real.
 *
 * La ciudad elegida queda en memoria (estado local de Descubrir, ver
 * ese archivo) pero todavía no filtra nada — no hay otro lugar en la
 * app que lea "la ciudad elegida" todavía. Es la base para un futuro
 * "el catálogo que ves depende de tu ciudad", no una feature completa
 * hoy — mismo criterio honesto que "Reservas: pendiente de construir".
 *
 * CiudadContext, no estado local — 2026-09-06, parte del Onboarding: la
 * ciudad ahora se determina UNA vez en Onboarding.tsx (antes de llegar a
 * Home) y debe sobrevivir a que este sheet se cierre/abra de nuevo, y a
 * recargar la página. Se saca `ciudad`/`origen`/`region` del estado local
 * de este componente y se leen/escriben desde `CiudadContext` (mismo
 * patrón que FavoritesContext) — Onboarding.tsx y este sheet ahora
 * comparten el mismo dato en vez de tener cada uno su copia. La prop
 * `onSelect` que existía antes se elimina: ya no hace falta, el
 * componente que abre este sheet (Descubrir, o el paso de ciudad del
 * Onboarding) no necesita enterarse por prop, puede leer `useCiudad()`
 * directo si le hace falta.
 */

/*
 * Ciudades sugeridas por región — curadas a mano con Ana (no viene de
 * ningún dato del catálogo, es una lista de "hacia dónde podría crecer
 * Theaveling"). Un nombre por país de los que ella nombró, el más
 * reconocido como nicho cultural/teatral de cada uno.
 */
const CIUDADES_SUGERIDAS: Record<Region, string[]> = {
  latam: ["Buenos Aires, Argentina", "Santiago, Chile", "São Paulo, Brasil", "Montevideo, Uruguay"],
  europa: ["Roma, Italia", "Madrid, España", "Londres, Reino Unido", "París, Francia", "Praga, Chequia"],
};

// Todas las ciudades sugeridas juntas, para cuando el usuario busca —
// buscar debería encontrar cualquiera de ellas, no solo las de su
// región por defecto.
const TODAS_LAS_SUGERIDAS = [...CIUDADES_SUGERIDAS.latam, ...CIUDADES_SUGERIDAS.europa];

const RECIENTES_KEY = "theaveling:ciudades-recientes";
const MAX_RECIENTES = 5;

function leerRecientes(): string[] {
  try {
    const raw = window.localStorage.getItem(RECIENTES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LocationSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { ciudad, origen, setCiudad, region, setRegion } = useCiudad();
  const [query, setQuery] = useState("");
  const [recientes, setRecientes] = useState<string[]>(leerRecientes);
  const [geoEstado, setGeoEstado] = useState<
    "idle" | "buscando" | "sin-permiso" | "fuera-de-cobertura"
  >("idle");
  // Origen del intento MÁS RECIENTE que terminó en "fuera de cobertura" —
  // distinto del `origen` persistido en CiudadContext (que solo cambia
  // cuando SÍ se confirma una ciudad). Se usa nada más para el texto
  // transitorio de ese estado, ver más abajo.
  const [geoOrigenIntento, setGeoOrigenIntento] = useState<
    OrigenCiudad | undefined
  >(undefined);
  const recientesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECIENTES_KEY, JSON.stringify(recientes));
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe la app.
    }
  }, [recientes]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  // Región para "Ciudades sugeridas" — usa la última región conocida en
  // CiudadContext; si todavía no se detectó ninguna (p. ej., se abrió
  // este sheet sin haber pasado nunca por Onboarding), asume "latam"
  // mismo criterio de siempre.
  const sugeridasFiltradas = q
    ? TODAS_LAS_SUGERIDAS.filter((c) => c.toLowerCase().includes(q))
    : CIUDADES_SUGERIDAS[region ?? "latam"];
  const bogotaCoincide = !q || "bogotá, colombia".includes(q) || "bogota, colombia".includes(q);

  function elegir(ciudadElegida: string, origenElegido: OrigenCiudad = "manual") {
    setCiudad(ciudadElegida, origenElegido);
    setRecientes((prev) =>
      [ciudadElegida, ...prev.filter((c) => c !== ciudadElegida)].slice(0, MAX_RECIENTES),
    );
    setQuery("");
    setGeoEstado("idle");
    onClose();
  }

  async function usarMiUbicacion() {
    setGeoEstado("buscando");
    const resultado = await determinarUbicacion();
    if (resultado.status === "ok") {
      setRegion(resultado.region);
      elegir(resultado.ciudad, resultado.origen ?? "gps");
    } else if (resultado.status === "fuera-de-cobertura") {
      // Sí sabemos dónde está, simplemente no operamos ahí todavía —
      // distinto de "denied": no se le echa la culpa al permiso.
      setRegion(resultado.region);
      setGeoOrigenIntento(resultado.origen);
      setGeoEstado("fuera-de-cobertura");
    } else {
      // GPS e IP fallaron los dos (`determinarUbicacion` ya intentó
      // ambos internamente) — mostrar "sin-permiso".
      setGeoEstado("sin-permiso");
      setGeoOrigenIntento(undefined);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop — cierra al tocar afuera, mismo criterio que cualquier
          overlay estándar. */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      {/* 2026-09-04, a pedido de Ana: "el botton sheet debe cubrir hasta
          arriba" — primero a `h-[92vh]`, pidió que llegara todavía más
          arriba → `h-[97vh]`, dejando solo el margen mínimo para que se
          note que sigue siendo un sheet (esquinas redondeadas + agarre)
          y no una pantalla nueva. `bg-thea-deep` es el mismo verde más
          oscuro del Top Bar/Category Tabs/Bottom Nav — el más oscuro
          que existe como token en la app, más oscuro que `thea-green`
          (el fondo base de la pantalla). */}
      <div className="relative bg-thea-deep rounded-t-[28px] h-[97vh] flex flex-col pb-6 sheet-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white-20" />
        </div>
        <div className="flex items-center gap-2 px-5 pt-2 pb-4">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="h-10 w-10 -ml-2 flex items-center justify-center shrink-0 text-white-100"
          >
            <IconCaretRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="font-display text-xl text-white-100">Elegir ciudad</h2>
        </div>

        {/* 2026-09-04, a pedido de Ana: "esta redondeado, asi no los
            estamos usando" — el buscador estaba en rounded-full (pill).
            El resto de la app reserva rounded-full para círculos
            (botones de ícono, avatares) y usa rounded-xl para cajas
            tipo campo/input — ver el comentario del botón CTA en
            DetalleExperiencia.tsx ("rounded-xl, 12px, NO rounded-full").
            Sin borde — Ana avisó que ya los habíamos sacado
            explícitamente. Placeholder — 2026-09-04: pasó de "Busca una
            ubicación" a "Busca una ciudad" al convertir el sheet de
            selector de zona a selector de ciudad, mismo cambio de
            vocabulario que el título de arriba. */}
        <div className="px-5 pb-3">
          <label className="flex items-center gap-2.5 h-11 rounded-xl bg-white-8 px-4">
            <IconSearch className="w-4 h-4 text-white-40 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca una ciudad"
              className="flex-1 bg-transparent font-body text-sm text-white-100 placeholder:text-white-40 outline-none"
            />
          </label>
        </div>

        <div className="overflow-y-auto flex-1 px-5 flex flex-col">
          {/* Ciudad actual + Recientes, una al lado de la otra —
              mismo patrón de fila que ya había, ahora hablando de
              ciudad en vez de ubicación/zona. Tocar la fila pide el
              permiso nativo de geolocalización para CONFIRMAR la
              ciudad — no acerca a ningún barrio (ver nota grande
              arriba). */}
          <div className="flex items-center gap-2 py-1">
            <button
              onClick={usarMiUbicacion}
              disabled={geoEstado === "buscando"}
              className="flex-1 min-w-0 flex items-center gap-3 py-2 text-left disabled:opacity-60"
            >
              <span className="h-9 w-9 rounded-full bg-white-8 flex items-center justify-center shrink-0">
                <IconMapPin className="w-4 h-4 text-thea-mint" />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-body font-semibold text-sm text-white-100">
                  Ciudad actual
                </span>
                <span className="font-body text-[13px] text-white-60 truncate">
                  {geoEstado === "buscando"
                    ? "Confirmando tu ciudad..."
                    : geoEstado === "sin-permiso"
                      ? "No se pudo confirmar — Bogotá por defecto"
                      : geoEstado === "fuera-de-cobertura"
                        ? `Todavía no operamos donde estás — Bogotá${geoOrigenIntento === "ip" ? " (aproximada)" : ""} por defecto`
                        : ciudad
                          ? `${ciudad}, Colombia${origen === "ip" ? " (aproximada)" : ""}`
                          : "Bogotá, Colombia"}
                </span>
              </span>
            </button>
            {recientes.length > 0 && (
              <button
                onClick={() =>
                  recientesRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="flex items-center gap-2 h-9 rounded-full bg-white-8 pl-3 pr-4 shrink-0"
              >
                <IconClock className="w-4 h-4 text-white-60" />
                <span className="font-body text-[13px] font-medium text-white-100 whitespace-nowrap">
                  Recientes
                </span>
              </button>
            )}
          </div>

          <div className="h-px w-full bg-white-12 my-1" />

          {/* Recientes — 2026-09-04, oculto mientras hay una búsqueda
              activa (la lista de abajo ya está filtrando, mezclar los
              dos modos confunde). Solo aparece si hay historial. */}
          {!query && recientes.length > 0 && (
            <>
              <div ref={recientesRef} className="pt-3 pb-1">
                <p className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide">
                  Recientes
                </p>
              </div>
              {recientes.map((ciudad) => (
                <button
                  key={`reciente-${ciudad}`}
                  onClick={() => elegir(ciudad)}
                  className="flex items-center gap-3 py-3 text-left border-b border-white-8"
                >
                  <span className="h-9 w-9 rounded-full bg-white-8 flex items-center justify-center shrink-0">
                    <IconClock className="w-4 h-4 text-white-40" />
                  </span>
                  <span className="font-body text-sm text-white-100">{ciudad}</span>
                </button>
              ))}
            </>
          )}

          {/* Bogotá — la única ciudad con catálogo real. Solo aparece
              acá abajo cuando hay una búsqueda que la encuentra; sin
              búsqueda no se repite, porque ya está mostrada arriba en
              "Ciudad actual" — duplicarla ahí se veía raro. Sin
              encabezado propio: con un solo resultado, un título tipo
              "Ciudades disponibles" se sentía forzado. */}
          {q && bogotaCoincide && (
            <button
              onClick={() => elegir("Bogotá")}
              className="flex items-center gap-3 py-3 text-left border-b border-white-8"
            >
              <span className="h-9 w-9 rounded-full bg-white-8 flex items-center justify-center shrink-0">
                <IconMapPin className="w-4 h-4 text-white-40" />
              </span>
              <span className="font-body text-sm text-white-100">Bogotá, Colombia</span>
            </button>
          )}

          {/* Ciudades sugeridas — curadas por región (ver
              CIUDADES_SUGERIDAS y la nota grande al principio del
              archivo), NO seleccionables todavía — respuesta explícita
              de Ana cuando se le preguntó qué debía pasar al tocarlas:
              "Próximamente". Con búsqueda activa se buscan entre TODAS
              (no solo las de la región por defecto); sin búsqueda,
              solo las de la región sugerida. */}
          {sugeridasFiltradas.length > 0 && (
            <>
              <div className="pt-3 pb-1">
                <p className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide">
                  Ciudades sugeridas
                </p>
              </div>
              {sugeridasFiltradas.map((ciudad) => (
                <div
                  key={ciudad}
                  aria-disabled="true"
                  className="flex items-center gap-3 py-3 text-left border-b border-white-8 last:border-b-0 opacity-50"
                >
                  <span className="h-9 w-9 rounded-full bg-white-8 flex items-center justify-center shrink-0">
                    <IconMapPin className="w-4 h-4 text-white-40" />
                  </span>
                  <span className="font-body text-sm text-white-100 flex-1">{ciudad}</span>
                  <span className="font-body text-[11px] font-semibold text-white-40 uppercase tracking-wide shrink-0">
                    Próximamente
                  </span>
                </div>
              ))}
            </>
          )}

          {/* 2026-09-04, a pedido de Ana: si buscan una ciudad que no es
              Bogotá ni ninguna de las sugeridas, no mostrar un simple
              "sin resultados" — mostrar el mismo anuncio honesto de
              "todavía no llegamos ahí", coherente con el resto del
              sheet (nada de fingir cobertura que no existe). */}
          {!bogotaCoincide && sugeridasFiltradas.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
              <span className="h-11 w-11 rounded-full bg-white-8 flex items-center justify-center">
                <IconMapPin className="w-5 h-5 text-white-40" />
              </span>
              <p className="font-body font-semibold text-sm text-white-100">
                Todavía no llegamos a "{query}"
              </p>
              <p className="font-body text-[13px] text-white-40 max-w-[260px]">
                Theaveling por ahora solo opera en Bogotá — vamos sumando
                ciudades de a poco.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
