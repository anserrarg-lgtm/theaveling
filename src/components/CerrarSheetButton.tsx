import { IconCaretRight } from "./icons";

/*
 * Botón de "cerrar" (flecha hacia atrás, mismo trazo que Volver) arriba a
 * la izquierda de los bottom sheets que se deslizan desde abajo —
 * 2026-10-12, unificado a pedido de Ana (ver nota en VolverButton.tsx).
 * Era literalmente idéntico, byte a byte, en 7 archivos (LocationSheet,
 * NotificacionesSheet, BandejaSheet, FechaSheet, BookingSelectorSheet,
 * PreferenceSheet, TodasFechasSheet) — no cambia nada visual, solo deja
 * de estar copiado 7 veces. El botón de fondo invisible ("tap afuera
 * para cerrar") de cada sheet NO se tocó, sigue igual en cada archivo —
 * esto es solo el ícono visible de cerrar.
 */
export default function CerrarSheetButton({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <button
      onClick={onClose}
      aria-label="Cerrar"
      className="h-10 w-10 -ml-2 flex items-center justify-center shrink-0 text-white-100 outline-none focus-visible:[box-shadow:0_0_0_2px_#fbfbfb,0_0_0_6px_rgba(46,204,166,0.45)]"
    >
      <IconCaretRight className="w-5 h-5 rotate-180" />
    </button>
  );
}
