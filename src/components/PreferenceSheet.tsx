import { IconCaretRight } from "./icons";

/*
 * PreferenceSheet — 2026-09-04, a pedido de Ana: "idioma y moneda deben
 * ser clickeables tambien y cambiables". Antes eran solo texto plano en
 * Preferencias (ver Perfil.tsx) — ahora abren este sheet genérico de
 * "elegir una opción de una lista corta", reutilizado para Idioma y
 * Moneda (mismo componente, distintas opciones).
 *
 * Qué tan "real" es el cambio — decisión explícita de Ana vía pregunta
 * directa: la selección se guarda de verdad (localStorage, mismo patrón
 * que "recientes" en LocationSheet.tsx) y el chip de Preferencias se
 * actualiza, PERO no hay traducción real de la interfaz ni conversión
 * real de precios todavía — inventar eso sería fingir una función que
 * no existe (mismo criterio honesto que ya se usó en toda la app: no
 * tasa de cambio real, no sistema de traducción real). El día que
 * existan de verdad, esta selección guardada es la base para
 * conectarlos.
 *
 * Chrome visual reutilizado de LocationSheet.tsx (mismo bottom sheet:
 * backdrop, `rounded-t-[28px]`, `bg-thea-deep`, animación de entrada) —
 * pero mucho más simple: sin buscador, sin geolocalización, solo una
 * lista corta de opciones con la actual marcada.
 */
export type PreferenceOption = { value: string; label: string };

export default function PreferenceSheet({
  open,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  open: boolean;
  title: string;
  options: PreferenceOption[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div className="relative bg-thea-deep rounded-t-[28px] flex flex-col pb-8 sheet-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white-20" />
        </div>
        <div className="flex items-center gap-2 px-5 pt-2 pb-2">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="h-10 w-10 -ml-2 flex items-center justify-center shrink-0 text-white-100"
          >
            <IconCaretRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="font-display text-xl text-white-100">{title}</h2>
        </div>

        <div className="flex flex-col px-5 pt-2">
          {options.map((opt, i) => {
            const activo = opt.value === selected;
            return (
              <div key={opt.value}>
                <button
                  onClick={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span
                    className={`font-body text-sm ${activo ? "font-semibold text-white-100" : "text-white-80"}`}
                  >
                    {opt.label}
                  </span>
                  {/* Punto mint en vez de un ícono de check aparte — el
                      set de íconos del proyecto no tiene uno, y un
                      punto de color ya usa el mismo lenguaje que el
                      resto de la app para "esto está activo/seleccionado"
                      (mismo tono thea-mint que otros estados de
                      interacción, ver index.css "02 — Interaction"). */}
                  {activo && (
                    <span className="h-2 w-2 rounded-full bg-thea-mint shrink-0" />
                  )}
                </button>
                {i < options.length - 1 && (
                  <div className="h-px w-full bg-white-8" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
