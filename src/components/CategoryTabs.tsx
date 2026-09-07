/*
 * "Category Tabs" — master `1552:214` (claro) / `1582:355` (verde).
 * Spec verificado en vivo en Figma (2026-08-31): 390×40, flex justify-center
 * items-center gap-32, px-20 pt-12. Cada chip: flex-col items-start gap-10,
 * texto Instrument Sans 13px (activo SemiBold, inactivo Medium), barra de
 * 2px debajo (solo visible en el chip activo).
 *
 * Variante verde (la que usa Home, fondo oscuro): texto activo E inactivo
 * en #fbfbfb (blanco) al 100% — la única diferencia es el peso de fuente,
 * no la opacidad (distinto a la variante clara, que sí baja opacidad en
 * inactivo). No confundir los dos criterios.
 *
 * Fondo — corregido 2026-09-02: la instancia real en Figma usa `#011414`
 * sólido (100% opaco), distinto del `rgba(1,20,20,0.95)` de Top Bar/Bottom
 * Nav — mismo tono base, pero sin el 95% de opacidad. A pedido de Ana se
 * unifica acá a `rgba(1,20,20,0.95)` para que el bloque Top Bar + Category
 * Tabs (ahora fijos juntos arriba) se vea como una sola superficie
 * consistente con el Bottom Nav. Pendiente corregir en Figma también.
 *
 * 2026-09-02: valor registrado como token `thea-deep` en index.css (antes
 * repetido "a mano" acá y en MobileTopBar.tsx/MobileBottomNav.tsx).
 */

const TABS = ["Todo", "Escena", "Cultura"] as const;
export type CategoryTab = (typeof TABS)[number];

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: CategoryTab;
  onChange: (tab: CategoryTab) => void;
}) {
  return (
    <nav className="h-10 flex items-center justify-center gap-8 px-5 pt-3 bg-thea-deep">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="flex flex-col items-start gap-2.5 text-white-100"
          >
            <span
              className={`font-body text-[13px] ${
                isActive ? "font-semibold" : "font-medium"
              }`}
            >
              {tab}
            </span>
            <span
              className="h-0.5 w-full"
              style={{ background: isActive ? "#fbfbfb" : "transparent" }}
            />
          </button>
        );
      })}
    </nav>
  );
}
