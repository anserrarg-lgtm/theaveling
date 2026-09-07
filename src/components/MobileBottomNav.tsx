import { Link, useLocation } from "react-router-dom";
import { IconCompass, IconTicket, IconUser } from "./icons";

/*
 * "Mobile Bottom Navigation — Fondo verde" — master `1582:294`
 * (variantes `1582:295/309/323`). Spec verificado en vivo en Figma
 * (2026-08-31): 390×72, 3 tabs iguales, ícono 24px, label Instrument Sans
 * 11px (Medium si activo, Regular si no — SIN atenuar opacidad, a
 * diferencia de otros patrones del archivo), punto de 4px debajo del
 * label solo en el tab activo. En la instancia real de Home el fondo es
 * rgba(1,20,20,0.95) y no lleva el borde superior de 1px que sí tiene
 * el master aislado.
 *
 * 2026-09-02: valor registrado como token `thea-deep` en index.css (antes
 * repetido "a mano" acá y en MobileTopBar.tsx/CategoryTabs.tsx).
 *
 * 2026-09-03: variante "light" agregada — el nodo real de Perfil en
 * Figma (`1557:460`, traído vía get_design_context) usa esta misma nav
 * pero en versión clara (fondo off-white, íconos/labels en thea-green al
 * 40%/100% en vez de blanco) porque Perfil es la única pantalla con
 * fondo claro; el resto (Descubrir, Detalle) sigue con la variante
 * "dark" de siempre, que queda como default para no tocar nada ahí.
 */
const TABS = [
  { key: "descubrir", label: "Descubrir", to: "/", Icon: IconCompass },
  { key: "reservas", label: "Reservas", to: "/reservas", Icon: IconTicket },
  { key: "perfil", label: "Perfil", to: "/perfil", Icon: IconUser },
] as const;

export default function MobileBottomNav({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const location = useLocation();
  const isLight = variant === "light";

  return (
    <nav
      className={`h-[72px] flex items-center justify-center ${
        isLight ? "bg-white-100" : "bg-thea-deep"
      }`}
    >
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.to;
        // text-[rgba(17,44,44,.4)] — valor suelto en Figma para el estado
        // inactivo de la variante light, no coincide con ningún escalón
        // documentado en STACK.md. Se usa como clase arbitraria de
        // Tailwind (no inline style) porque los íconos solo aceptan
        // `className`, no `style` (ver icons.tsx).
        const lightColor = isActive ? "text-thea-green" : "text-[rgba(17,44,44,0.4)]";
        const iconColor = isLight ? lightColor : "text-white-100";
        return (
          <Link
            key={tab.key}
            to={tab.to}
            className="flex-1 h-14 flex flex-col items-center justify-center gap-1"
          >
            <tab.Icon className={iconColor} />
            <span
              className={`font-body text-[11px] leading-[14px] tracking-[0.3px] text-center ${
                isActive ? "font-medium" : "font-normal"
              } ${isLight ? lightColor : "text-white-100"}`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span
                className={`h-1 w-1 rounded-full ${isLight ? "bg-thea-green" : "bg-white-100"}`}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
