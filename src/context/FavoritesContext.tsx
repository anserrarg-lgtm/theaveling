import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/*
 * Favoritos — 2026-09-03, a pedido de Ana: "quiero que los corazones
 * empiecen a ser clickeables y que empiecen a aparecer en favs".
 *
 * No hay backend todavía (todo el dataset es mock, ver experiences.ts),
 * así que el estado de favoritos vive en el cliente: Context para que
 * cualquier corazón (cards de Descubrir, hero de Detalle) y la pantalla
 * de Perfil lean/escriban el mismo estado sin prop-drilling, +
 * localStorage para que no se pierda al recargar la página. Cuando haya
 * cuenta de usuario real, esto se reemplaza por una llamada al backend —
 * la superficie del hook (`isFavorito`/`toggleFavorito`) no debería tener
 * que cambiar del lado de los componentes que ya lo consumen.
 */

const STORAGE_KEY = "theaveling:favoritos";

interface FavoritesContextValue {
  favoritos: string[];
  isFavorito: (id: string) => boolean;
  toggleFavorito: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

function readInitial(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // localStorage puede fallar (modo privado, cuota, SSR) — arranca vacío
    // en vez de romper la app.
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch {
      // idem — no rompe la app si no se puede persistir.
    }
  }, [favoritos]);

  const isFavorito = (id: string) => favoritos.includes(id);

  const toggleFavorito = (id: string) =>
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );

  return (
    <FavoritesContext.Provider value={{ favoritos, isFavorito, toggleFavorito }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  }
  return ctx;
}
