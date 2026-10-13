import { useNavigate } from "react-router-dom";
import { IconCaretRight } from "./icons";

/*
 * Botón de "volver" (flecha hacia atrás) — 2026-10-12, unificado a pedido
 * de Ana ("unifica los botones en componentes reutilizables, que no
 * cambie nada visual"). Antes estaba copiado a mano en 8 pantallas
 * (Notificaciones, DatosDeCuenta, Ayuda, Postular, Legal, Compra,
 * Busqueda, VerMas) — mismo ícono y mismo comportamiento (navigate(-1))
 * en las 8, pero con 3 tamaños de área táctil distintos según el header
 * de cada pantalla. Se preservan los 3 tamaños EXACTOS que ya existían
 * (ninguno se tocó ni se unificó a la fuerza) — solo se centraliza el
 * markup repetido.
 */
const SIZES = {
  // Notificaciones.tsx, DatosDeCuenta.tsx, Ayuda.tsx
  compact: "p-1 -m-1",
  // Postular.tsx, Legal.tsx, Busqueda.tsx, VerMas.tsx
  tight: "h-5 w-5 shrink-0 flex items-center justify-center",
  // Compra.tsx
  padded: "h-10 w-10 -ml-2 flex items-center justify-center shrink-0",
} as const;

// 2026-10-12, a pedido de Ana: anillo de foco de teclado (2px blanco +
// 4px verde, documentado en Figma para Buttons/Navigation) — faltaba en
// casi todos los componentes interactivos. Solo aparece al navegar con
// teclado (`:focus-visible`), así que no cambia nada para quien usa el
// dedo o el mouse. Se usa thea-mint en vez del "verde Thea" (thea-green,
// #112c2c) que dice el texto de Figma literal: ese verde es casi negro,
// invisible sobre los fondos oscuros que usa casi toda la app — thea-mint
// es el color que el propio sistema ya reserva para "estados de
// interacción" (ver nota en index.css), y sí se ve.
const FOCUS_RING =
  "outline-none focus-visible:[box-shadow:0_0_0_2px_#fbfbfb,0_0_0_6px_rgba(46,204,166,0.45)]";

export default function VolverButton({
  size = "tight",
  onClick,
}: {
  size?: keyof typeof SIZES;
  /** Por defecto navega hacia atrás — algunas pantallas podrían querer
   * un comportamiento distinto en el futuro, de ahí el override opcional. */
  onClick?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={onClick ?? (() => navigate(-1))}
      aria-label="Volver"
      className={`${SIZES[size]} ${FOCUS_RING}`}
    >
      <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
    </button>
  );
}
