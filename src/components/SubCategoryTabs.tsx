/*
 * "Sub-category Tabs" (nivel 2) — NO existe construido en Figma todavía
 * (buscado a fondo en toda la página el 2026-08-31, incluyendo "02.1 —
 * Navigation" y "02.2 — Category Tabs" completos: no está). Solo existe
 * como idea, en una frase suelta dentro de la descripción del componente
 * "Category Tabs": "Determina qué Sub-category Tabs se muestran debajo".
 *
 * Este componente es un primer intento en código, no un calco de Figma —
 * usa el mismo criterio visual que sí está confirmado (chip con borde,
 * scroll horizontal, mismo patrón que STACK.md describe para navegación:
 * "scroll horizontal con indicador de contenido adicional"). Ajustar/
 * formalizar en Figma cuando Ana lo diseñe ahí.
 */
export default function SubCategoryTabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (item: string) => void;
}) {
  return (
    <nav className="flex gap-2 overflow-x-auto px-5 pt-3 pb-1 scrollbar-none">
      {items.map((item) => {
        const isActive = item === active;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-body transition-colors ${
              isActive
                ? "border-thea-mint text-thea-mint"
                : "border-white-20 text-white-80"
            }`}
          >
            {item}
          </button>
        );
      })}
    </nav>
  );
}
