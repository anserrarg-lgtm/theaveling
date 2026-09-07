import { IconCaretRight, IconMinus, IconPlus } from "./icons";
import type { Experience } from "../data/experiences";
import type { OpcionFechaHora } from "../utils/price";

/*
 * BookingSelectorSheet — 2026-09-04, a pedido de Ana: "ENTONCES VAMOS A
 * CONVERTIR A BOOKING SELECTION EN BOTTON SHEET OK?". Antes vivía
 * siempre visible, inline, en el paso "seleccion" de Compra.tsx (ver
 * el comentario grande de ese archivo para el historial completo del
 * nodo real de Figma `1861:554`/`Booking Selector Card`). Se saca de
 * ahí y se mueve acá, a un sheet real, mismo cascarón (backdrop,
 * `rounded-t-[28px]`, drag handle, `sheet-slide-up`) que ya usan
 * LocationSheet/FechaSheet/PreferenceSheet/NotificacionesSheet/
 * BandejaSheet — no un patrón nuevo.
 *
 * Compra.tsx ahora solo muestra un resumen chico y tappable ("Tu
 * selección") en el paso "seleccion" que abre este sheet para editar —
 * mismo criterio que "Ubicación"/"Por fecha" en Busqueda.tsx, que abren
 * LocationSheet/FechaSheet desde una fila, no desde contenido siempre
 * expandido.
 *
 * A diferencia de FechaSheet (elegir un día cierra el sheet de una,
 * porque ahí es una sola decisión), acá hay 3 controles independientes
 * (fecha/hora, tipo de entrada, cantidad) — no tiene sentido cerrar el
 * sheet al tocar el primero. Por eso sí lleva un botón "Listo" fijo
 * abajo (coincide además con que el frame real de Figma trae un
 * `Button` en `bottom-cta-container` a continuación del contenido) que
 * simplemente cierra — la selección ya se aplicó en vivo a cada tap
 * (mismo criterio de "sin paso de confirmación aparte" que el resto de
 * sheets, el botón acá es solo para volver, no dispara ninguna acción
 * adicional).
 *
 * Card interior clara (`bg-white-100`) sobre el sheet oscuro
 * (`thea-deep`) — se mantiene el mismo tratamiento que ya tenía este
 * contenido cuando vivía inline sobre `thea-green` (ver historial en
 * Compra.tsx: "Card clara sobre el fondo... de la pantalla"), ahora
 * sobre el fondo oscuro del sheet en vez del verde de la pantalla. No
 * se invierte a tema oscuro como sí se hizo con Perfil/Notificaciones/
 * FechaSheet — ese criterio aplica cuando TODO un mockup claro se
 * convierte a pantalla oscura; acá la card clara ya era, desde su
 * primera versión, una decisión deliberada de "card clara flotando
 * sobre fondo oscuro" (mismo lenguaje visual que usa Figma en el propio
 * nodo: `Booking Selector Card` es `bg-[#fbfbfb]` con esquinas
 * redondeadas, pensada como superficie propia, no como pantalla
 * completa a invertir).
 *
 * Fecha y hora — 2026-09-04, a pedido de Ana: "COPIA BIEN LO DE LAS
 * FECHAS Y HORAS COMO ESTA EN FIGMA". El nodo real trae 3 chips
 * horizontales scrolleables (`scrollable-chips`, `1837:551`), uno ya
 * seleccionado (`chip-selected`, fondo sólido oscuro) y 2 sin
 * seleccionar (fondo claro, mismo que la card) — ver
 * `generarOpcionesFechaHora` en `utils/price.ts` para de dónde salen
 * las 2 opciones extra (el catálogo real solo tiene 1 función). Colores
 * de los chips tal cual el nodo real: seleccionado `bg-thea-green`
 * (equivalente al `#112c2c` de Figma) + texto blanco, sin seleccionar
 * mismo fondo que la card (`bg-white-100`, se distingue por el borde) +
 * texto `thea-green`.
 *
 * Ancho de chip — el nodo real trae un ancho FIJO de 110px, pensado para
 * el texto abreviado del mock de Figma ("Vie 20 mar"). El dato real del
 * catálogo (`experiencia.date`) usa nombre de día completo ("Viernes 21
 * mar") — mismo formato que ya usa el resto de la app (Reservas.tsx,
 * etc.), no se abrevia acá solo para este selector. Un ancho fijo de
 * 110px con ese texto más largo cortaba la última letra ("Viernes 21
 * ma"). Se pasa a `min-w-[110px]` + `w-fit` (mismo criterio que ya usaba
 * este chip cuando vivía inline en Compra.tsx antes de esta vuelta):
 * mantiene el ancho mínimo real del nodo pero deja crecer cuando el
 * texto real lo necesita, en vez de truncar contenido real por calcar
 * un ancho pensado para texto de ejemplo más corto.
 *
 * Tipo de entrada / Entradas — sin cambios de fondo respecto a como
 * vivían inline: el catálogo sigue sin tener una segunda categoría de
 * precio real (ver punto 2 del historial en Compra.tsx), así que se
 * sigue mostrando 1 sola fila de "General" con el precio real, no las
 * 2 filas de ejemplo del mock de Figma ("General"/"Preferencial") — acá
 * sí Ana no pidió inventar un segundo precio, a diferencia de fecha/
 * hora donde pidió explícitamente calcar el selector real.
 */

export default function BookingSelectorSheet({
  open,
  experiencia,
  opciones,
  indiceSeleccionado,
  onSeleccionarFechaHora,
  cantidad,
  onCantidadChange,
  onClose,
}: {
  open: boolean;
  experiencia: Experience;
  opciones: OpcionFechaHora[];
  indiceSeleccionado: number;
  onSeleccionarFechaHora: (indice: number) => void;
  cantidad: number;
  onCantidadChange: (cantidad: number) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const gratisLabel = experiencia.price.trim().toLowerCase() === "gratis";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div className="relative bg-thea-deep rounded-t-[28px] flex flex-col pb-8 sheet-slide-up max-h-[85vh] overflow-y-auto">
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
          <h2 className="font-display text-xl text-white-100">Editar selección</h2>
        </div>

        <div className="px-5 pt-2">
          <div className="bg-white-100 border border-green-12 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-body font-semibold text-sm text-thea-green">
                Selecciona fecha y hora
              </p>
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {opciones.map((opcion, i) => {
                  const seleccionado = i === indiceSeleccionado;
                  return (
                    <button
                      key={`${opcion.fecha}-${opcion.hora}`}
                      onClick={() => onSeleccionarFechaHora(i)}
                      className={`w-fit min-w-[110px] shrink-0 rounded-xl px-3 py-3 flex flex-col items-center gap-0.5 ${
                        seleccionado
                          ? "bg-thea-green text-white-100"
                          : "bg-white-100 border border-green-12 text-thea-green"
                      }`}
                    >
                      <span className="font-body font-semibold text-sm whitespace-nowrap">
                        {opcion.fecha}
                      </span>
                      {opcion.hora && (
                        <span
                          className={`font-body text-xs ${
                            seleccionado ? "opacity-70" : "opacity-60"
                          }`}
                        >
                          {opcion.hora}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-body font-semibold text-sm text-thea-green">
                Tipo de entrada
              </p>
              <div className="w-full rounded-xl bg-thea-green px-4 py-3.5 flex items-center justify-between">
                <span className="font-body font-semibold text-sm text-white-100">
                  General
                </span>
                <span className="font-body font-semibold text-sm text-white-100">
                  {gratisLabel
                    ? "Gratis"
                    : `${experiencia.mostrarDesde ? "Desde " : ""}${experiencia.price}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-body font-semibold text-sm text-thea-green">
                Entradas
              </p>
              <div className="rounded-xl bg-green-8 border border-green-12 px-4 py-3.5 flex items-center justify-between">
                <span className="font-body text-sm text-thea-green">
                  Cantidad de personas
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onCantidadChange(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                    aria-label="Menos personas"
                    className="h-8 w-8 rounded-full flex items-center justify-center bg-green-12 text-thea-green disabled:opacity-30"
                  >
                    <IconMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-body font-semibold text-sm text-thea-green w-4 text-center [font-variant-numeric:tabular-nums]">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => onCantidadChange(Math.min(6, cantidad + 1))}
                    disabled={cantidad >= 6}
                    aria-label="Más personas"
                    className="h-8 w-8 rounded-full flex items-center justify-center bg-green-12 text-thea-green disabled:opacity-30"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-6">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-white-100 text-thea-green font-body font-semibold text-[15px] leading-5 tracking-[0.3px]"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
