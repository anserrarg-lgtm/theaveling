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
 *
 * 2026-10-07, a pedido de Ana ("el color del header y nav en mobile...
 * ahora creo q estan en 95 lo quiero al 100"): pasa de `bg-thea-deep`
 * (95% opaco) a `bg-[rgb(1,20,20)]` sólido. El TOKEN `thea-deep` no se
 * toca en index.css (sigue usándose al 95% en hojas/badges flotantes
 * sobre foto) — mismo cambio en paralelo en MobileTopBar.tsx y en la
 * variante oscura de MobileBottomNav.tsx, mismo patrón ya usado en
 * Perfil.tsx/DatosDeCuenta.tsx/Busqueda.tsx para pantallas sin foto debajo.
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
    <nav className="h-10 flex items-center justify-center gap-8 px-5 pt-3 bg-[rgb(1,20,20)]">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="flex flex-col items-start gap-2.5 text-white-100 outline-none focus-visible:[box-shadow:0_0_0_2px_#fbfbfb,0_0_0_6px_rgba(46,204,166,0.45)]"
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
