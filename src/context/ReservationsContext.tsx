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
 * experiencia.
 *
 * 2026-10-08, a pedido de Ana ("quiero que sea lo más fiel a la
 * realidad... si no hiciste ninguna reserva, no va a aparecer ninguna
 * reserva") — se revierte el criterio de arriba: `normalizarReserva`
 * YA NO le inventa un id de respaldo a una reserva sin `id`, la
 * descarta. Esas reservas sin `id` son justo las de ANTES de este
 * archivo (las 4 de ejemplo fijas, `RESERVAS_INICIALES`, alguna
 * "pasada" incluida) — si en algún momento terminaron guardadas en el
 * `localStorage` de alguien (quedan entre recargas/reinicios), antes se
 * "adoptaban" con un id nuevo y reaparecían solas, aunque esa persona no
 * hubiera reservado nada en la app actual. Eso fue justo el bug real
 * que reportó Ana: una reserva "pasada" fantasma en su pantalla, sin
 * haber tocado nada. Ahora cualquier entrada sin `id` se tira — solo
 * sobreviven reservas creadas de verdad por `agregarReserva` (que
 * siempre pone `id`, ver más abajo).
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

// 2026-10-08, a pedido de Ana ("quiero que sea lo más fiel a la
// realidad... si no hiciste ninguna reserva, no va a aparecer ninguna
// reserva"): hasta hoy, una reserva sin `id` (guardada en localStorage
// ANTES de que `id` existiera como campo — ver fecha de arriba) se
// conservaba igual, con un id de respaldo inventado acá mismo. Eso es
// justo lo que causó el bug que reportó: en su navegador quedaban
// reservas viejas (de antes de este cambio, de cuando Reservas.tsx
// mostraba `RESERVAS_INICIALES` fija, con una "pasada" incluida)
// resucitando solas en cada carga, sin que ella hubiera tocado nada en
// la app actual. Ahora se descartan en vez de conservarse: una reserva
// real, hecha desde Compra.tsx con `agregarReserva`, SIEMPRE tiene `id`
// (lo pone `agregarReserva` mismo, ver más abajo) — cualquier entrada
// sin `id` no pudo haberse creado por ese camino, así que no es una
// reserva real de esta persona y no debe mostrarse.
function normalizarReserva(r: unknown): Reserva | null {
  if (typeof r !== "object" || r === null) return null;
  const obj = r as Record<string, unknown>;
  if (
    typeof obj.id !== "string" ||
    typeof obj.experienciaId !== "string" ||
    typeof obj.fechaHora !== "string"
  ) {
    return null;
  }
  return {
    id: obj.id,
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
      .map((r) => normalizarReserva(r))
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
