import { useEffect, useRef, useState } from "react";
import { IconMapPin, IconSearch, IconX } from "./icons";
import { determinarUbicacion, type Region } from "../utils/geolocation";
import { useCiudad, type OrigenCiudad } from "../context/CiudadContext";

/*
 * DesktopLocationDropdown — 2026-09-11, a pedido de Ana: en la navbar de
 * Desktop, "Ubicación — Bogotá" no tenía ningún `onClick` (quedó como
 * texto suelto cuando se armó `DesktopNavbar.tsx` — ver ese archivo,
 * nunca se conectó a nada). Ana lo notó ("la ubicacion no es
 * clickeable") y pidió el mismo tratamiento que se le acaba de dar a la
 * lupa de búsqueda: "vamos con esa extension, tiene que ser algo asi, un
 * panel flotante" (mandó de referencia una captura de otra app: un
 * modal centrado, buscador arriba, "Ciudades cercanas"/"Ciudades
 * sugeridas" debajo) — "guiate de lo que tenemos en la de mobile, porque
 * es practicamente igual": el contenido real es el mismo que ya existe
 * en `LocationSheet.tsx` (buscador de ciudad, Ciudad actual/Recientes,
 * Ciudades sugeridas por región, aviso de "todavía no llegamos ahí") —
 * no se inventa "Ciudades cercanas" como concepto nuevo (esa app de
 * referencia sí lo tiene, la nuestra no — Ana pidió guiarse por el
 * layout/idea de panel flotante, no calcar esa sección puntual que no
 * existe en Theaveling). Fondo oscuro, no blanco — mismo criterio que ya
 * se corrigió para el buscador ("no fondo blanco nooo, verde"), la
 * referencia de Ana es solo para la FORMA (panel flotante compacto, no
 * pantalla completa), no para el color.
 *
 * Por qué NO se reusa `LocationSheet.tsx` tal cual — ese componente es
 * un bottom sheet pensado para mobile (`fixed inset-0`, `h-[97vh]`,
 * agarre para deslizar, animación de entrada desde abajo) — exactamente
 * el tipo de "pantalla aparte" que Ana ya rechazó para búsqueda ("no
 * puede ser una pantalla aparte, tiene que ser una extension"). Mismo
 * criterio que `DesktopSearchDropdown.tsx`: este componente tiene su
 * PROPIA copia de la lógica de ciudad (ciudades sugeridas, recientes,
 * geolocalización) en vez de importarla de `LocationSheet.tsx` — Ana fue
 * explícita en no tocar/mover nada de mobile ("no se te ocurra mover
 * allgo de mobile si no es que yo te lo digo"). Lo que SÍ se importa
 * (`useCiudad`, `determinarUbicacion`) son utilidades/Context ya
 * compartidos por toda la app, no código de la pantalla de mobile.
 *
 * Disparador — vive en `DesktopNavbar.tsx`: "Ubicación — Bogotá" pasa de
 * `<span>` estático a un botón que togglea un estado local
 * (`ubicacionAbierta`) y monta este panel, anclado debajo de esa fila
 * (mismo patrón `relative`/`absolute` que ya usa el botón de búsqueda de
 * al lado).
 *
 * Animación de entrada — 2026-09-11, a pedido de Ana: "quiero que se
 * deslice suave y sutilmente desde la izq" — clase `desktop-panel-slide-
 * left` (ver index.css), un desplazamiento chico desde la izquierda +
 * fade, 180ms. Entra desde la izquierda porque este panel vive del lado
 * izquierdo de la navbar (mismo criterio que `desktop-panel-slide-right`
 * en `DesktopSearchDropdown.tsx`, que vive del lado derecho).
 *
 * Sin borde — 2026-09-12, a pedido de Ana ("el panel de ubicación
 * todavía conserva stroke, te dije q lo sacáramos"): este panel se había
 * quedado con `border border-white-12` en el panel principal cuando se
 * sacó ese mismo borde de `DesktopSearchDropdown.tsx` e
 * `IdiomaMonedaModal.tsx` — quedó separado del fondo solo por
 * `shadow-2xl`, mismo criterio que esos otros 2 paneles. Los `border-b`
 * finitos entre filas de la lista (Recientes/Sugeridas) no son el
 * "stroke" del que habla Ana — son separadores internos de lista, no el
 * borde del panel — se dejan como están.
 *
 * Sin barra de scroll visible — 2026-10-07, a pedido de Ana ("no se
 * puede hacer scroll sin que se vea esa barra que es fea"): la lista
 * (Recientes/Ciudades sugeridas) sigue scrolleando igual, solo se oculta
 * la barra visual con la utilidad `scrollbar-none` ya definida en
 * index.css (mismo criterio que los rieles horizontales de
 * Descubrir.tsx). Mismo problema en los 3 bloques con scroll de
 * `DesktopSearchDropdown.tsx` (Tendencias/Resultados/sin-resultados) —
 * se corrige ahí también.
 */

const CIUDADES_SUGERIDAS: Record<Region, string[]> = {
  latam: ["Buenos Aires, Argentina", "Santiago, Chile", "São Paulo, Brasil", "Montevideo, Uruguay"],
  europa: ["Roma, Italia", "Madrid, España", "Londres, Reino Unido", "París, Francia", "Praga, Chequia"],
};

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

export default function DesktopLocationDropdown({ onClose }: { onClose: () => void }) {
  const { ciudad, origen, setCiudad, region, setRegion } = useCiudad();
  const [query, setQuery] = useState("");
  const [recientes, setRecientes] = useState<string[]>(leerRecientes);
  const [geoEstado, setGeoEstado] = useState<
    "idle" | "buscando" | "sin-permiso" | "fuera-de-cobertura"
  >("idle");
  const [geoOrigenIntento, setGeoOrigenIntento] = useState<OrigenCiudad | undefined>(undefined);
  // 2026-10-07, corrección a pedido de Ana (ver la nota grande de abajo,
  // "Cerrar al tocar afuera"): ref del panel, usado por el listener de
  // clic-afuera para saber si el clic cayó DENTRO de este panel o no.
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECIENTES_KEY, JSON.stringify(recientes));
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe nada.
    }
  }, [recientes]);

  const q = query.trim().toLowerCase();
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
      setRegion(resultado.region);
      setGeoOrigenIntento(resultado.origen);
      setGeoEstado("fuera-de-cobertura");
    } else {
      setGeoEstado("sin-permiso");
      setGeoOrigenIntento(undefined);
    }
  }

  // Cerrar al tocar afuera — 2026-10-07, corrección a pedido de Ana: "le
  // doy al panel de ubicación y después le doy al panel de búsqueda...
  // se cierra el de ubicación, pero le tengo que dar otro clic más...
  // necesito que sea instantáneo". Antes esto se resolvía con un
  // `<button>` invisible `fixed inset-0 z-40` que cubría TODA la
  // pantalla (ver la nota vieja que describía este mismo patrón) — eso
  // sí cerraba el panel, pero por estar encima de todo también se comía
  // el clic antes de que le llegara al ícono de Búsqueda/Usuario de al
  // lado, así que ese primer clic solo cerraba, sin abrir el otro panel
  // (de ahí el "doble clic"). Se reemplaza por un listener de
  // `mousedown` en `document` que compara contra `panelRef`: si el clic
  // cae afuera del panel, cierra — pero al no ser un elemento físico
  // tapando la pantalla, no bloquea que ESE MISMO clic le siga llegando
  // también al botón que se haya tocado (otro ícono de la navbar), que
  // dispara su propio `onClick` normalmente. Mismo criterio aplicado en
  // DesktopSearchDropdown.tsx/DesktopPerfilDropdown.tsx.
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="desktop-panel-slide-left absolute left-0 top-[calc(100%+12px)] z-50 flex w-[400px] flex-col gap-3 rounded-2xl bg-thea-green p-4 shadow-2xl"
    >
        <div className="flex items-center justify-between">
          <h2 className="font-body font-semibold text-sm text-white-100">Elegir ciudad</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center text-white-60"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <label className="flex h-11 items-center gap-2.5 rounded-xl bg-white-8 px-4">
          <IconSearch className="w-4 h-4 text-white-40 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca una ciudad"
            className="flex-1 bg-transparent font-body text-sm text-white-100 placeholder:text-white-40 outline-none"
          />
        </label>

        <div className="flex max-h-[380px] flex-col overflow-y-auto scrollbar-none">
          {/* 2026-10-12, a pedido de Ana: se quita el botón "Recientes"
              que iba al lado de "Ciudad actual" (hacía scroll hasta la
              sección Recientes de más abajo). Hoy esa sección queda
              pegada justo debajo, separada solo por la línea divisoria,
              y el catálogo real solo tiene una ciudad (Bogotá) — un
              atajo para saltar a algo que ya está a la vista no suma
              nada. Se vuelve a considerar cuando haya más ciudades
              reales y la lista sea larga de verdad. (El arreglo de
              forma del 8 de octubre, rounded-full → rounded-lg, queda
              sin efecto porque el botón mismo se elimina.) */}
          <div className="flex items-center py-1">
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
                      ? "No se pudo confirmar: Bogotá por defecto"
                      : geoEstado === "fuera-de-cobertura"
                        ? `Todavía no operamos donde estás: Bogotá${geoOrigenIntento === "ip" ? " (aproximada)" : ""} por defecto`
                        : ciudad
                          ? `${ciudad}, Colombia${origen === "ip" ? " (aproximada)" : ""}`
                          : "Bogotá, Colombia"}
                </span>
              </span>
            </button>
          </div>

          <div className="h-px w-full bg-white-12 my-1" />

          {/* Recientes — 2026-10-12, a pedido de Ana: se deja de MOSTRAR
              esta sección (mismo criterio aplicado en LocationSheet.tsx,
              mobile). Hoy el catálogo real solo tiene una ciudad
              (Bogotá), así que acá solo podía repetirse "Bogotá" otra
              vez, la misma que ya dice "Ciudad actual" arriba. El
              mecanismo (`recientes`, localStorage) sigue funcionando
              por detrás para cuando haya más ciudades reales. */}

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

          {sugeridasFiltradas.length > 0 && (
            <>
              <div className="pt-3 pb-1">
                <p className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide">
                  Ciudades sugeridas
                </p>
              </div>
              {sugeridasFiltradas.map((c) => (
                <div
                  key={c}
                  aria-disabled="true"
                  className="flex items-center gap-3 py-3 text-left border-b border-white-8 last:border-b-0 opacity-50"
                >
                  <span className="h-9 w-9 rounded-full bg-white-8 flex items-center justify-center shrink-0">
                    <IconMapPin className="w-4 h-4 text-white-40" />
                  </span>
                  <span className="font-body text-sm text-white-100 flex-1">{c}</span>
                  <span className="font-body text-[11px] font-semibold text-white-40 uppercase tracking-wide shrink-0">
                    Próximamente
                  </span>
                </div>
              ))}
            </>
          )}

          {!bogotaCoincide && sugeridasFiltradas.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
              <span className="h-11 w-11 rounded-full bg-white-8 flex items-center justify-center">
                <IconMapPin className="w-5 h-5 text-white-40" />
              </span>
              <p className="font-body font-semibold text-sm text-white-100">
                Todavía no llegamos a "{query}"
              </p>
              <p className="font-body text-[13px] text-white-40 max-w-[260px]">
                Theaveling por ahora solo opera en Bogotá. Vamos sumando
                ciudades de a poco.
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
