import { useEffect, useRef, useState } from "react";
import { IconClock, IconMapPin, IconSearch, IconX } from "./icons";
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
  const recientesRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Fondo invisible — cierra al tocar afuera, mismo patrón que
          DesktopSearchDropdown.tsx (dropdown liviano, sin oscurecer la
          pantalla). */}
      <button
        aria-label="Cerrar selector de ciudad"
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      <div className="desktop-panel-slide-left absolute left-0 top-[calc(100%+12px)] z-50 flex w-[400px] flex-col gap-3 rounded-2xl bg-thea-green p-4 shadow-2xl">
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

        <div className="flex max-h-[380px] flex-col overflow-y-auto">
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

          {!query && recientes.length > 0 && (
            <>
              <div ref={recientesRef} className="pt-3 pb-1">
                <p className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide">
                  Recientes
                </p>
              </div>
              {recientes.map((c) => (
                <button
                  key={`reciente-${c}`}
                  onClick={() => elegir(c)}
                  className="flex items-center gap-3 py-3 text-left border-b border-white-8"
                >
                  <span className="h-9 w-9 rounded-full bg-white-8 flex items-center justify-center shrink-0">
                    <IconClock className="w-4 h-4 text-white-40" />
                  </span>
                  <span className="font-body text-sm text-white-100">{c}</span>
                </button>
              ))}
            </>
          )}

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
                Theaveling por ahora solo opera en Bogotá — vamos sumando
                ciudades de a poco.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
