import { useState } from "react";
import type { OpcionFechaHora } from "../utils/price";
import { horaCompacta } from "../utils/price";

/*
 * CalendarioFechaHora — 2026-09-14, a pedido de Ana para el sidebar de
 * reserva del Detalle en Desktop: "no va calendario sino como en la
 * card de booking que creamos para mobile... y también agrégale la
 * opción para calendario". Respuesta de Ana a la pregunta de cómo debía
 * verse esa opción: "ícono que cambia la vista" — un ícono de calendario
 * al lado de "Fecha y hora próximas" que cambia ESA MISMA sección de los
 * chips de mobile a un calendario real (meses + días), sin agregar una
 * pantalla ni un panel aparte. Ver el toggle `vistaCalendario` en el
 * lugar donde se usa este componente.
 *
 * No existía ningún calendario real en el proyecto (`TodasFechasSheet.tsx`
 * solo pone un ícono de calendario decorativo al lado del nombre del mes,
 * no una grilla) — este si es un calendario real, con navegación de mes y
 * grilla de días, calcado en estructura de la referencia de Fever que
 * mandó Ana (pestañas de mes arriba, fila de días de la semana L M X J V
 * S D, grilla de números).
 *
 * De dónde salen los días reales — el catálogo (`experiences.ts`) no
 * modela un calendario de funciones real, solo UNA fecha por experiencia
 * (`date`). Mismo criterio que ya usa el resto del selector de fecha/hora
 * (`generarOpcionesFechaHora`/`generarFechasReales` en utils/price.ts):
 * NO se inventan días sueltos sin relación — este calendario solo marca
 * como elegibles los días que YA existen como opción real generada (los
 * mismos que aparecen como chips), el resto del mes se ve gris y no se
 * puede tocar. Por eso este componente recibe `opciones` +
 * `fechasReales` (mismo índice, mismo orden) en vez de generar nada
 * propio — una sola fuente de verdad para chips y calendario.
 *
 * Semana empieza en lunes (L M X J V S D, igual que la referencia) — el
 * resto del proyecto no tenía todavía una grilla de calendario real
 * donde esto importara.
 *
 * Paleta clara — 2026-09-14, mismo día, a pedido de Ana: la tarjeta de
 * reserva que contiene este calendario pasó de fondo oscuro a fondo
 * blanco ("el fondo de toda la tarjeta"). Este componente es exclusivo
 * de esa tarjeta (no se usa en mobile), así que se convierte directo a
 * la escala `green-*`/`text-thea-green` en vez de agregar una variante
 * — mismo criterio de paleta clara ya usado en LoginSheet.tsx y en la
 * Booking Summary Card de ConfirmarPagoSheet.tsx (texto principal
 * `thea-green`, secundario `green-70`/`green-50`, superficies sutiles
 * `green-12`/`green-8`).
 */

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function claveMes(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export default function CalendarioFechaHora({
  opciones,
  fechasReales,
  indiceSeleccionado,
  onSeleccionar,
}: {
  opciones: OpcionFechaHora[];
  fechasReales: Date[];
  indiceSeleccionado: number | null;
  onSeleccionar: (indice: number) => void;
}) {
  // Meses distintos presentes entre las opciones reales (normalmente 1,
  // a veces 2 si las ~10 opciones generadas cruzan fin de mes — ver nota
  // grande en generarOpcionesFechaHora, utils/price.ts). Se arman las
  // pestañas solo con esos meses, no un rango fijo de 3 como en la
  // referencia de Fever — acá no hay datos más allá de las opciones
  // reales de esta pieza.
  const meses: { clave: string; fecha: Date }[] = [];
  fechasReales.forEach((d) => {
    const clave = claveMes(d);
    if (!meses.some((m) => m.clave === clave)) meses.push({ clave, fecha: d });
  });

  const [mesActivo, setMesActivo] = useState(0);
  const mesActual = meses[Math.min(mesActivo, meses.length - 1)]?.fecha ?? new Date();
  const anio = mesActual.getFullYear();
  const mes = mesActual.getMonth();

  // Mapa día-del-mes → índice de la opción real (solo para el mes activo).
  const indicePorDia = new Map<number, number>();
  fechasReales.forEach((d, i) => {
    if (d.getFullYear() === anio && d.getMonth() === mes) {
      indicePorDia.set(d.getDate(), i);
    }
  });

  const primerDiaSemana = new Date(anio, mes, 1).getDay(); // 0=domingo
  // Offset para que la semana empiece en lunes: domingo (0) pasa a la
  // última columna (6), el resto se corre 1 atrás.
  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  const celdas: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  const opcionSeleccionada =
    indiceSeleccionado !== null ? opciones[indiceSeleccionado] : undefined;

  return (
    <div className="flex flex-col gap-3">
      {meses.length > 1 && (
        <div className="flex gap-2">
          {meses.map((m, i) => (
            <button
              key={m.clave}
              onClick={() => setMesActivo(i)}
              className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold capitalize ${
                i === mesActivo
                  ? "bg-thea-green text-white-100"
                  : "bg-green-8 text-thea-green"
              }`}
            >
              {MESES[m.fecha.getMonth()]} {m.fecha.getFullYear()}
            </button>
          ))}
        </div>
      )}
      {meses.length <= 1 && (
        <p className="font-body text-xs font-semibold capitalize text-green-50">
          {MESES[mes]} {anio}
        </p>
      )}

      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((d) => (
          <span
            key={d}
            className="flex h-6 items-center justify-center font-body text-[11px] font-semibold text-green-50"
          >
            {d}
          </span>
        ))}
        {celdas.map((dia, i) => {
          if (dia === null) return <span key={`vacio-${i}`} />;
          const indiceOpcion = indicePorDia.get(dia);
          const disponible = indiceOpcion !== undefined;
          const seleccionado = indiceOpcion !== undefined && indiceOpcion === indiceSeleccionado;
          return (
            <button
              key={dia}
              type="button"
              disabled={!disponible}
              onClick={() => indiceOpcion !== undefined && onSeleccionar(indiceOpcion)}
              className={`flex h-8 w-8 items-center justify-center rounded-full font-body text-[13px] [font-variant-numeric:tabular-nums] ${
                seleccionado
                  ? "bg-thea-mint font-semibold text-thea-green"
                  : disponible
                    ? "text-thea-green hover:bg-green-8"
                    : "text-green-20"
              }`}
            >
              {dia}
            </button>
          );
        })}
      </div>

      {/* Hora de la opción elegida — el calendario solo elige el DÍA (un
          día puede tener una sola función/hora en este catálogo, ver
          `generarOpcionesFechaHora`), así que apenas se toca un día
          disponible ya queda resuelta también la hora — se muestra acá
          para que quede claro qué se está reservando, mismo criterio
          que ya usan los chips de al lado. */}
      {opcionSeleccionada?.hora && (
        <p className="font-body text-[13px] text-green-50">
          Hora: <span className="font-semibold text-thea-green">{horaCompacta(opcionSeleccionada.hora)}</span>
        </p>
      )}
    </div>
  );
}
