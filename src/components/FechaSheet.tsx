import { useState } from "react";
import { IconCaretRight } from "./icons";

/*
 * FechaSheet — 2026-09-04, a pedido de Ana: "por fechas deberia poder
 * clickearse y aparecer un calendario" (la fila "Por fecha" de
 * Busqueda.tsx era no interactiva hasta ahora — ver esa nota, que
 * citaba PENDIENTES.md: "no hay ningún componente de calendario real,
 * solo el ícono... queda como pendiente de definición de producto").
 * Ana lo resolvió pidiéndolo directo, así que se construye de verdad.
 *
 * Sí existe un componente real de Figma para esto — no estaba en
 * "05 — Búsqueda" (por eso no había aparecido antes) sino en
 * "02 — Components": "Date Selector" (`2150:992`), con descripción
 * propia en Figma: "Selector de fecha tipo mini-calendario para filtrar
 * búsquedas por fecha" — exactamente este caso de uso. Traído vía
 * get_design_context 2026-09-04.
 *
 * El master de Figma es un símbolo que muestra UNA sola semana de
 * ejemplo (Marzo 2025, días 10–16, con el 15 seleccionado) — no un mes
 * completo armado a mano. Acá se generaliza esa fila a una grilla real
 * de mes completo (semana L-D, mes/año navegables con los mismos
 * carets), calculado con `Date` nativo, no hardcodeado — el componente
 * de Figma es la referencia de layout/tipografía/spacing, no un mes
 * fijo para calcar literal.
 *
 * Colores invertidos a tema oscuro — 2026-09-04, mismo criterio que el
 * resto de pantallas que llegan de un mockup claro (Perfil,
 * Notificaciones, Datos de cuenta, ver esas notas): Figma trae este
 * componente en `bg-[#fbfbfb]` con texto `#112c2c` y el día
 * seleccionado en un pill sólido `#112c2c`/texto blanco. Sobre
 * `thea-deep` (el sheet) eso se invierte: día seleccionado en
 * `thea-mint` (el mismo tono que ya usa el resto de la app para
 * "estado de interacción chico/activo" — ver el punto de
 * PreferenceSheet.tsx y el Switch en estado On — no un color nuevo)
 * con texto `thea-green` encima para que siga siendo legible.
 *
 * Chrome del sheet (backdrop, rounded-t-28, drag handle, back+título)
 * reutilizado tal cual de LocationSheet/PreferenceSheet — mismo patrón
 * ya establecido para cualquier selector que se abre desde Búsqueda o
 * Perfil. El título "Elegir fecha" del sheet reemplaza al texto
 * "Seleccionar fecha" que Figma pone DENTRO del componente aislado —
 * acá sería redundante repetirlo, el sheet ya trae su propio título en
 * el mismo lugar visual (mismo criterio que "Elegir ciudad" en
 * LocationSheet).
 *
 * Selección — tocar un día elige la fecha y cierra el sheet de una,
 * mismo criterio de PreferenceSheet (sin botón "Confirmar" aparte,
 * Figma tampoco lo trae). Sin mínimo/máximo de fecha: Figma no define
 * ninguna restricción y no se inventa una (ej. "no dejar elegir fechas
 * pasadas") sin que Ana lo pida — queda pendiente de definir con ella
 * si hace falta.
 *
 * Chips rápidos "Hoy" / "Mañana" / "Este fin de semana" — 2026-09-04, a
 * pedido de Ana ("arriba como unos tipo tabs o clickeables que digan
 * hoy mañana este fin de semana"), arriba del mes/calendario. No
 * existen en el componente "Date Selector" de Figma — no hay ningún
 * nodo que calcar acá, es puramente funcional.
 *
 * Forma — 2026-09-04, segunda vuelta: la primera versión los puso en
 * `rounded-full` (píldora), calcando el chip "Recientes" de
 * LocationSheet.tsx. Ana notó, viendo la pantalla, que acá se sentían
 * solos ("si quedan bien tipo pildoras cuando no tenemos nada mas tipo
 * asi... como todo los inputs son como tipo rectangulares bordeados") —
 * y tenía razón: ese chip vive en OTRA pantalla, no se lee como "el
 * lenguaje de chips de la app" parada en Búsqueda, y la regla que el
 * resto del código ya sigue es justo la contraria: `rounded-full` para
 * círculos (íconos, avatares, los días del calendario de acá abajo),
 * `rounded-xl` para cajas de opción/campo — que es lo que son estos 3
 * chips, ni más ni menos, igual que la barra de búsqueda y las filas de
 * Ubicación/Por fecha de esta misma pantalla. Pasan a `rounded-xl`.
 *
 * "Este fin de semana" obliga a que la selección sea un RANGO (sábado +
 * domingo), no un solo día — por eso `selected`/`onSelect` pasan de
 * `Date` a `{ desde, hasta, etiqueta? }`: un día suelto es un rango de
 * un solo día (`desde === hasta`), el fin de semana es un rango de dos.
 * `etiqueta` es opcional: se guarda solo cuando la selección vino de un
 * chip ("Hoy"/"Mañana"/"Este fin de semana"), para que la fila en
 * Busqueda.tsx muestre ese texto en vez de calcular "{día} de {mes}" —
 * tocar un día suelto en la grilla no trae etiqueta, se calcula la
 * fecha como antes.
 *
 * Si hoy es domingo, "Este fin de semana" no incluye el sábado que ya
 * pasó — queda como un rango de un solo día (hoy). Si hoy ya es sábado,
 * el rango es hoy + mañana. Cualquier otro día, el próximo sábado y
 * domingo.
 *
 * Límite conocido, no resuelto: si el fin de semana calculado cae a
 * caballo entre dos meses (ej. sábado 31 de un mes + domingo 1 del
 * siguiente), la grilla de un solo mes visible solo resalta el día que
 * cae dentro del mes que se está mostrando — no arma una vista de 2
 * meses para ese caso borde. Pasa pocas veces al año; no se resuelve
 * acá para no sumar complejidad sin que Ana lo haya pedido.
 */

export type FechaSeleccionada = {
  desde: Date;
  hasta: Date;
  /** Solo presente si la selección vino de un chip rápido ("Hoy" /
   * "Mañana" / "Este fin de semana") — ver nota grande arriba. */
  etiqueta?: string;
};

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

// Lunes-Domingo (spec real de Figma: header "L M X J V S D") — JS
// Date.getDay() da 0=Domingo, así que se corre 1 lugar.
const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"] as const;

function diasDelMes(anio: number, mes: number) {
  return new Date(anio, mes + 1, 0).getDate();
}

function primerDiaSemana(anio: number, mes: number) {
  const dia = new Date(anio, mes, 1).getDay();
  return (dia + 6) % 7;
}

function inicioDelDia(fecha: Date) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function sumarDias(fecha: Date, n: number) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + n);
}

function mismoRango(a: FechaSeleccionada | null, b: FechaSeleccionada): boolean {
  if (!a) return false;
  return (
    inicioDelDia(a.desde).getTime() === inicioDelDia(b.desde).getTime() &&
    inicioDelDia(a.hasta).getTime() === inicioDelDia(b.hasta).getTime()
  );
}

/* Calcula el rango real de "este fin de semana" a partir de una fecha
 * base — ver nota grande arriba sobre el caso de hoy siendo domingo. */
function calcularFinDeSemana(base: Date): { desde: Date; hasta: Date } {
  const diaSemana = base.getDay(); // 0=domingo ... 6=sábado
  const hoy0 = inicioDelDia(base);
  if (diaSemana === 0) return { desde: hoy0, hasta: hoy0 };
  const diasHastaSabado = diaSemana === 6 ? 0 : 6 - diaSemana;
  const sabado = sumarDias(hoy0, diasHastaSabado);
  return { desde: sabado, hasta: sumarDias(sabado, 1) };
}

function opcionesRapidas(): { etiqueta: string; rango: { desde: Date; hasta: Date } }[] {
  const hoy0 = inicioDelDia(new Date());
  return [
    { etiqueta: "Hoy", rango: { desde: hoy0, hasta: hoy0 } },
    { etiqueta: "Mañana", rango: { desde: sumarDias(hoy0, 1), hasta: sumarDias(hoy0, 1) } },
    { etiqueta: "Este fin de semana", rango: calcularFinDeSemana(hoy0) },
  ];
}

export default function FechaSheet({
  open,
  selected,
  onSelect,
  onClose,
}: {
  open: boolean;
  selected: FechaSeleccionada | null;
  onSelect: (fecha: FechaSeleccionada) => void;
  onClose: () => void;
}) {
  const hoy = new Date();
  const [vista, setVista] = useState(() => ({
    anio: (selected?.desde ?? hoy).getFullYear(),
    mes: (selected?.desde ?? hoy).getMonth(),
  }));

  if (!open) return null;

  const totalDias = diasDelMes(vista.anio, vista.mes);
  const offset = primerDiaSemana(vista.anio, vista.mes);
  const celdas: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  function cambiarMes(delta: number) {
    setVista((v) => {
      const fecha = new Date(v.anio, v.mes + delta, 1);
      return { anio: fecha.getFullYear(), mes: fecha.getMonth() };
    });
  }

  function elegirDia(dia: number) {
    const fecha = new Date(vista.anio, vista.mes, dia);
    onSelect({ desde: fecha, hasta: fecha });
    onClose();
  }

  function elegirRapida(rango: { desde: Date; hasta: Date }, etiqueta: string) {
    onSelect({ ...rango, etiqueta });
    onClose();
  }

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
          <h2 className="font-display text-xl text-white-100">Elegir fecha</h2>
        </div>

        <div className="flex flex-col gap-4 px-5 pt-2">
          <div className="flex flex-wrap gap-2">
            {opcionesRapidas().map(({ etiqueta, rango }) => {
              const activo = mismoRango(selected, { ...rango, etiqueta });
              return (
                <button
                  key={etiqueta}
                  onClick={() => elegirRapida(rango, etiqueta)}
                  className={`h-9 rounded-xl px-4 font-body text-[13px] font-medium whitespace-nowrap ${
                    activo ? "bg-thea-mint text-thea-green" : "bg-white-8 text-white-100"
                  }`}
                >
                  {etiqueta}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior"
              className="h-8 w-8 flex items-center justify-center text-white-100"
            >
              <IconCaretRight className="w-4 h-4 rotate-180" />
            </button>
            <span className="font-body font-medium text-sm text-white-100">
              {MESES[vista.mes]} {vista.anio}
            </span>
            <button
              onClick={() => cambiarMes(1)}
              aria-label="Mes siguiente"
              className="h-8 w-8 flex items-center justify-center text-white-100"
            >
              <IconCaretRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7">
            {DIAS_SEMANA.map((d, i) => (
              <span
                key={`${d}-${i}`}
                className="font-body text-xs font-medium text-white-40 text-center"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {celdas.map((dia, i) => {
              if (dia === null) return <div key={`vacio-${i}`} className="h-9" />;
              const fechaCelda = new Date(vista.anio, vista.mes, dia).getTime();
              const enRango =
                !!selected &&
                fechaCelda >= inicioDelDia(selected.desde).getTime() &&
                fechaCelda <= inicioDelDia(selected.hasta).getTime();
              return (
                <button
                  key={dia}
                  onClick={() => elegirDia(dia)}
                  className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center font-body text-sm ${
                    enRango
                      ? "bg-thea-mint font-semibold text-thea-green"
                      : "text-white-100"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
