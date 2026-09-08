import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/*
 * Reservas (context) — 2026-09-07, a pedido de Ana: "no quiero que
 * aparezcan reservas si el usuario que va a testear no las ha hecho".
 * Hasta acá, Reservas.tsx mostraba 4 reservas de ejemplo
 * (`RESERVAS_INICIALES`) para CUALQUIERA que entrara a la pestaña, sin
 * importar si esa persona en verdad reservó algo — quedaban ahí desde
 * que la pantalla era solo un mock visual, y nunca se conectó al flujo
 * real de compra.
 *
 * Mismo patrón que FavoritesContext.tsx: Context + localStorage (no hay
 * backend, ver ese archivo). Arranca VACÍO — nada de datos de ejemplo.
 * `agregarReserva` es quien de verdad llena esto, llamado desde
 * Compra.tsx cuando alguien completa "Confirmar y pagar" (ver
 * ConfirmarPagoSheet.tsx → `onConfirmar` en Compra.tsx), con la
 * experiencia/fecha/hora que esa persona eligió de verdad — ya no es
 * contenido decorativo. Reservas.tsx lee de acá en vez de la constante
 * fija; si alguien no reservó nada, la lista sale vacía de verdad.
 *
 * 2026-09-08, a pedido de Ana ("resuelvelo y sin romper nada") — bug
 * real de auditoría: `cancelarReserva` filtraba por `experienciaId`, así
 * que si alguien reservaba la MISMA experiencia dos veces (dos fechas
 * distintas), cancelar una cancelaba las dos de un tirón (y
 * Reservas.tsx usaba ese mismo `experienciaId` como `key` de React, la
 * misma colisión). Cada `Reserva` ahora tiene un `id` propio
 * (`generarId()`, ver abajo — se arma acá adentro, quien llama a
 * `agregarReserva` sigue pasando lo mismo de siempre, sin el id) y
 * `cancelarReserva`/la `key` de la lista usan ESE id, no el de la
 * experiencia. `normalizarReserva` le da un id de respaldo a cualquier
 * reserva que ya estuviera guardada en localStorage de antes de este
 * cambio, para no romper una sesión de prueba vieja.
 */

export type EstadoReserva = "proxima" | "pasada";

export interface Reserva {
  id: string;
  experienciaId: string;
  fechaHora: string;
  estado: EstadoReserva;
}

const STORAGE_KEY = "theaveling:reservas";

interface ReservationsContextValue {
  reservas: Reserva[];
  agregarReserva: (reserva: Omit<Reserva, "id">) => void;
  cancelarReserva: (id: string) => void;
}

const ReservationsContext = createContext<ReservationsContextValue | undefined>(
  undefined,
);

function generarId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback si `crypto.randomUUID` no está disponible en el
    // navegador — igual de único para este uso (distinguir una reserva
    // dentro de una lista local), no hace falta la garantía criptográfica
    // real de randomUUID acá.
    return `reserva-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

// Reservas guardadas ANTES de este cambio no tienen `id` — se les asigna
// uno de respaldo al leerlas, así una sesión de prueba vieja sigue
// andando (cancelar y la key de React quedan con un id nuevo en vez de
// quedar sin ninguno).
function normalizarReserva(r: unknown, indice: number): Reserva | null {
  if (typeof r !== "object" || r === null) return null;
  const obj = r as Record<string, unknown>;
  if (typeof obj.experienciaId !== "string" || typeof obj.fechaHora !== "string") {
    return null;
  }
  return {
    id: typeof obj.id === "string" ? obj.id : `legacy-${indice}-${generarId()}`,
    experienciaId: obj.experienciaId,
    fechaHora: obj.fechaHora,
    estado: obj.estado === "pasada" ? "pasada" : "proxima",
  };
}

function readInitial(): Reserva[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((r, i) => normalizarReserva(r, i))
      .filter((r): r is Reserva => r !== null);
  } catch {
    // localStorage puede fallar (modo privado, cuota) — arranca vacío en
    // vez de romper la app.
    return [];
  }
}

export function ReservationsProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<Reserva[]>(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    } catch {
      // idem — no rompe la app si no se puede persistir.
    }
  }, [reservas]);

  // Nueva reserva va primero (más reciente arriba) — mismo criterio que
  // el orden con el que se leían las de ejemplo antes.
  const agregarReserva = (reserva: Omit<Reserva, "id">) =>
    setReservas((prev) => [{ ...reserva, id: generarId() }, ...prev]);

  const cancelarReserva = (id: string) =>
    setReservas((prev) => prev.filter((r) => r.id !== id));

  return (
    <ReservationsContext.Provider
      value={{ reservas, agregarReserva, cancelarReserva }}
    >
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  if (!ctx) {
    throw new Error(
      "useReservations debe usarse dentro de <ReservationsProvider>",
    );
  }
  return ctx;
}
