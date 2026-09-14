import { useMemo, useState } from "react";
import { IconCaretRight } from "./icons";
import { experiences } from "../data/experiences";
import { generarFechasReales } from "../utils/price";
import { MESES, type FechaSeleccionada } from "./FechaSheet";

/*
 * DesktopFechaDropdown — 2026-09-11, a pedido de Ana: "lo quee abre por
 * fechas en busqueda debe ser algo asi, o sea mejor dicho debe mostrar
 * el calendario, fijate de como lo tenemos en mobile, pero debe ser un
 * panel flotante" (mandó de referencia una captura de otra app: un
 * calendario de 2 meses lado a lado, con toggle "Fechas/Flexible" y
 * chips "± N días" — layout que Theaveling no tiene). Mismo criterio que
 * ya se usó para Ubicación (ver DesktopLocationDropdown.tsx) y para el
 * buscador (DesktopSearchDropdown.tsx): se toma de la referencia la
 * FORMA (panel flotante compacto, no pantalla completa) y el CONTENIDO
 * sale de lo que ya existe en mobile (`FechaSheet.tsx`: chips rápidos
 * Hoy/Mañana/Este fin de semana + un mes calendario con el punto de "hay
 * experiencias este día") — no se arma el calendario de 2 meses ni el
 * toggle Fechas/Flexible de la referencia, eso no existe en la app y Ana
 * pidió guiarse por mobile, no calcar esa captura al pixel.
 *
 * Por qué no se reusa `FechaSheet.tsx` tal cual — es un bottom sheet
 * (`fixed inset-0`, agarre para deslizar, entra desde abajo), el mismo
 * patrón de "pantalla aparte" que Ana ya rechazó para Desktop. Este
 * componente tiene su PROPIA copia de la lógica del calendario (cálculo
 * de mes/semana, "este fin de semana", día con experiencias) — mismo
 * criterio que el resto de componentes Desktop de esta tanda: no se
 * toca/mueve nada de mobile. SÍ se importa `MESES`/`FechaSeleccionada`
 * de FechaSheet.tsx porque son solo un array de nombres y un tipo (ya
 * exportados para reuso, sin ningún comportamiento de mobile adentro) —
 * mismo criterio que ya usaba `Busqueda.tsx` y `DesktopSearchDropdown.tsx`.
 *
 * Disparador — vive en `DesktopSearchDropdown.tsx`: la fila "Por fecha"
 * pasa de abrir `<FechaSheet>` (bottom sheet) a togglear este panel,
 * anclado debajo de esa fila (mismo patrón `relative`/`absolute` que ya
 * usa el ícono de lupa en la navbar).
 */

function claveDia(fecha: Date): string {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

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

function calcularFinDeSemana(base: Date): { desde: Date; hasta: Date } {
  const diaSemana = base.getDay();
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

export default function DesktopFechaDropdown({
  selected,
  onSelect,
  onClose,
}: {
  selected: FechaSeleccionada | null;
  onSelect: (fecha: FechaSeleccionada) => void;
  onClose: () => void;
}) {
  const hoy = new Date();
  const [vista, setVista] = useState(() => ({
    anio: (selected?.desde ?? hoy).getFullYear(),
    mes: (selected?.desde ?? hoy).getMonth(),
  }));

  const diasConExperiencias = useMemo(() => {
    const set = new Set<string>();
    for (const exp of experiences) {
      for (const fecha of generarFechasReales(exp.date)) {
        set.add(claveDia(fecha));
      }
    }
    return set;
  }, []);

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
    <>
      <button
        aria-label="Cerrar selector de fecha"
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      <div className="absolute left-0 top-[calc(100%+12px)] z-50 flex w-[360px] flex-col gap-4 rounded-2xl border border-white-12 bg-thea-green p-4 shadow-2xl">
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
            const fechaDeLaCelda = new Date(vista.anio, vista.mes, dia);
            const fechaCelda = fechaDeLaCelda.getTime();
            const enRango =
              !!selected &&
              fechaCelda >= inicioDelDia(selected.desde).getTime() &&
              fechaCelda <= inicioDelDia(selected.hasta).getTime();
            const tieneExperiencias = diasConExperiencias.has(claveDia(fechaDeLaCelda));
            return (
              <button
                key={dia}
                onClick={() => elegirDia(dia)}
                className={`relative h-9 w-9 mx-auto rounded-full flex items-center justify-center font-body text-sm ${
                  enRango ? "bg-thea-mint font-semibold text-thea-green" : "text-white-100"
                }`}
              >
                {dia}
                {tieneExperiencias && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${
                      enRango ? "bg-thea-green" : "bg-thea-mint"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
