import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Region } from "../utils/geolocation";

/*
 * Ciudad compartida — 2026-09-06, parte del flujo de Onboarding: antes
 * de esto, "la ciudad elegida" vivía como estado local efímero de
 * Descubrir.tsx (`ciudadSeleccionada`, nunca leído por nadie más — ver
 * nota vieja en ese archivo) y se perdía al recargar la página. Ahora
 * que Onboarding.tsx determina la ciudad UNA vez (por GPS, por IP, o a
 * mano si el usuario la elige) y Home debe reflejar ese estado en el
 * selector de ciudad, hace falta un lugar compartido — mismo patrón que
 * FavoritesContext/AuthContext: Context + localStorage, sin backend.
 *
 * "origen" distingue cómo se llegó a esa ciudad — importante para poder
 * mostrar "(aproximada)" cuando corresponde (ver LocationSheet.tsx):
 * "gps" (permiso nativo real), "ip" (aproximación por IP, ver
 * utils/geolocation.ts), o "manual" (el usuario la buscó/tocó a mano en
 * el selector — ahí sí es exacta, es una elección, no una adivinanza).
 *
 * Por defecto arranca en null/null (todavía no se determinó nada) —
 * Onboarding.tsx es quien la fija la primera vez, siempre antes de que
 * el usuario llegue a Home (ver ese archivo). Si por algún motivo se
 * accede a Home sin haber pasado por Onboarding (recarga, URL directa
 * mientras se desarrolla), el resto de la app ya sabe tratar "Bogotá"
 * como default razonable — mismo criterio que siempre.
 */

const CIUDAD_KEY = "theaveling:ciudad";
const ORIGEN_KEY = "theaveling:ciudad-origen";

export type OrigenCiudad = "gps" | "ip" | "manual";

interface CiudadContextValue {
  ciudad: string | null;
  origen: OrigenCiudad | null;
  setCiudad: (ciudad: string | null, origen: OrigenCiudad) => void;
  // Región aproximada más reciente conocida (para las "Ciudades sugeridas"
  // de LocationSheet) — puede quedar seteada aunque `ciudad` sea null
  // (p. ej., el usuario está fuera de cobertura pero sabemos que es LatAm).
  region: Region | null;
  setRegion: (region: Region | null) => void;
}

const CiudadContext = createContext<CiudadContextValue | undefined>(
  undefined,
);

function leerCiudad(): string | null {
  try {
    return window.localStorage.getItem(CIUDAD_KEY);
  } catch {
    return null;
  }
}

function leerOrigen(): OrigenCiudad | null {
  try {
    const raw = window.localStorage.getItem(ORIGEN_KEY);
    return raw === "gps" || raw === "ip" || raw === "manual" ? raw : null;
  } catch {
    return null;
  }
}

export function CiudadProvider({ children }: { children: ReactNode }) {
  const [ciudad, setCiudadState] = useState<string | null>(leerCiudad);
  const [origen, setOrigenState] = useState<OrigenCiudad | null>(leerOrigen);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    try {
      if (ciudad) {
        window.localStorage.setItem(CIUDAD_KEY, ciudad);
      } else {
        window.localStorage.removeItem(CIUDAD_KEY);
      }
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe la app.
    }
  }, [ciudad]);

  useEffect(() => {
    try {
      if (origen) {
        window.localStorage.setItem(ORIGEN_KEY, origen);
      } else {
        window.localStorage.removeItem(ORIGEN_KEY);
      }
    } catch {
      // idem.
    }
  }, [origen]);

  function setCiudad(nuevaCiudad: string | null, nuevoOrigen: OrigenCiudad) {
    setCiudadState(nuevaCiudad);
    setOrigenState(nuevoOrigen);
  }

  return (
    <CiudadContext.Provider
      value={{ ciudad, origen, setCiudad, region, setRegion }}
    >
      {children}
    </CiudadContext.Provider>
  );
}

export function useCiudad() {
  const ctx = useContext(CiudadContext);
  if (!ctx) {
    throw new Error("useCiudad debe usarse dentro de <CiudadProvider>");
  }
  return ctx;
}
