/*
 * Switch — nodo real de Figma `2051:739`, usado en notificaciones-screen
 * (`2051:746`, traído vía get_design_context 2026-09-03). Figma solo
 * tenía el estado "On" exportado como asset (PNG/SVG estático, no
 * reusable) — acá se reconstruye como componente real, controlado
 * (checked/onChange), con los 2 estados.
 *
 * Colores adaptados al tema oscuro — 2026-09-03, a pedido de Ana ("esta
 * pantalla debe ir en verde"): Figma mockeaba esta pantalla (y el resto
 * de Perfil) sobre fondo claro, con el track "On" en thea-green sólido.
 * Pasado a fondo thea-green, ON usa thea-mint (Interaction Accent del
 * design system, STACK.md — este es exactamente ese caso de uso) en vez
 * de thea-green, que ahí se perdería contra el fondo. OFF usa white-20
 * (track) — no hay trazo real de Figma para ese estado, es una
 * aproximación razonable siguiendo la escala de blancos ya establecida.
 *
 * BUG corregido — 2026-09-04, a pedido de Ana ("los toggles... no estan
 * bien hechos"): el thumb se salía del track en el estado "On" (se veía
 * flotando fuera del pill, mitad afuera). Causa real: el thumb no tenía
 * ningún `left` explícito, solo `top-0.5` — con `left`/`right` en auto,
 * el navegador resuelve la posición estática de un jeito que NO caía a
 * la izquierda como se esperaba (terminaba corriéndose casi al borde
 * derecho antes de aplicar la traslación), así que el `translate-x`
 * pensado para moverlo 22px desde la izquierda en realidad lo empujaba
 * 22px MÁS allá de esa posición ya corrida — de ahí que quedara fuera
 * del track. Fix: fijar `left-0.5` explícito (posición base
 * determinística, sin depender de cómo el navegador resuelva "auto"),
 * y recalcular el traslado ON para que quede a 2px del borde derecho
 * del track (44px de ancho − 20px de thumb − 2px de margen = 22px desde
 * la izquierda; con `left-0.5` ya puesto en 2px, falta trasladar los
 * 20px restantes → `translate-x-5`).
 */
export default function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-thea-mint" : "bg-white-20"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white-100 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
