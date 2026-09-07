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
 */

export type EstadoReserva = "proxima" | "pasada";

export interface Reserva {
  experienciaId: string;
  fechaHora: string;
  estado: EstadoReserva;
}

const STORAGE_KEY = "theaveling:reservas";

interface ReservationsContextValue {
  reservas: Reserva[];
  agregarReserva: (reserva: Reserva) => void;
  cancelarReserva: (experienciaId: string) => void;
}

const ReservationsContext = createContext<ReservationsContextValue | undefined>(
  undefined,
);

function readInitial(): Reserva[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
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
  const agregarReserva = (reserva: Reserva) =>
    setReservas((prev) => [reserva, ...prev]);

  const cancelarReserva = (experienciaId: string) =>
    setReservas((prev) => prev.filter((r) => r.experienciaId !== experienciaId));

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
