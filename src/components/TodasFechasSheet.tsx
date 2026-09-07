import { IconCalendar, IconCaretRight } from "./icons";
import type { Experience } from "../data/experiences";
import type { OpcionFechaHora } from "../utils/price";
import {
  esGratis,
  fechaCompletaDesdeChip,
  horaCompacta,
  lugaresDisponibles,
  mesAbrevDesdeChip,
  mesCompletoDesdeAbrev,
} from "../utils/price";

/*
 * TodasFechasSheet — 2026-09-04, a pedido de Ana: mandó una captura de
 * referencia (otra app, fondo claro) de una pantalla de "elegir fecha y
 * hora" con los días agrupados bajo un encabezado de mes, cada uno con
 * una card propia (horario + precio + disponibilidad). Pedido textual:
 * "CUANDO SE LE DE AHI EN VER TODAS TIENE QUE SALIR UNA PANTALLA (EN
 * BOTTON SHEET) COMO LA DE LA REF, PERO CON TODAS LAS CARACTERISTICAS
 * QUE YA HEMOS ARMADO, OBVIAMENTE TIENE QUE SALIR EN FONDO VERDE CON
 * LAS CARAC DE THEA".
 *
 * "Con todas las características que ya hemos armado" — se calca la
 * ESTRUCTURA de la referencia (agrupado por mes, card por día con
 * horario y precio), pero con datos que el proyecto realmente tiene:
 *  - Las 2-3 opciones de fecha/hora son las mismas que ya genera
 *    `generarOpcionesFechaHora` (ver utils/price.ts) para los chips de
 *    Compra.tsx — no se inventan fechas nuevas acá, es la misma fuente.
 *  - El precio es el mismo real de "Tipo de entrada" (`experiencia.price`),
 *    no un precio nuevo.
 *  - La referencia trae "N lugares disponibles" — 2026-09-05, a pedido
 *    de Ana ("QUE PONGAS CUANTAS QUEDAN EN CADA OPCION"): el catálogo no
 *    modela cupo/aforo por función (no hay ningún dato real de
 *    disponibilidad), así que se genera un número determinístico y
 *    plausible por opción — ver `lugaresDisponibles` en utils/price.ts,
 *    documentado ahí como estimado/decorativo, no inventario real. Va
 *    en el mismo lugar que en la referencia (a la derecha de la card),
 *    en vez del indicador de selección (radio) de la primera versión —
 *    la selección sigue siendo visible por el resaltado de la card
 *    (borde/fondo distinto cuando está elegida), no hacía falta el
 *    radio aparte.
 *
 * Fondo — "OBVIAMENTE TIENE QUE SALIR EN FONDO VERDE CON LAS CARAC DE
 * THEA": mismo cascarón oscuro (`bg-thea-deep`, `rounded-t-[28px]`,
 * drag handle, header con back) que ya usan TODOS los sheets de la app
 * (LocationSheet/FechaSheet/PreferenceSheet/NotificacionesSheet/
 * BandejaSheet) — es la forma en que "las características de Thea" ya
 * están resueltas en el proyecto para cualquier pantalla en sheet, no
 * un tratamiento nuevo. Las cards de cada opción usan el mismo
 * "transparente típico" que ya se usa para cards sobre fondo oscuro en
 * el resto de la app (`bg-white-6 border border-white-12`, igual que el
 * acordeón de "Ver ticket" en ReservationCard.tsx) — pedido explícito
 * de Ana el mismo día: "LA CARD EN EL TIPICO TRANSPARENTE QUE HEMOS
 * USANDO PARA LAS CARDS".
 *
 * Día completo, no abreviado — "NO COLOQUE EN LAS 3 OPCIONES PRIMERAS
 * EL DIA COMPLETO VIE MAR MIER ETC": los chips CHICOS de Compra.tsx se
 * quedan abreviados tal cual están (eso no cambia); ACÁ, en la pantalla
 * de "ver todas", sí va el día completo en minúscula ("viernes, 21 de
 * marzo"), igual que la referencia ("domingo, 6 de septiembre") — ver
 * `fechaCompletaDesdeChip` en utils/price.ts, que transforma el mismo
 * string abreviado sin duplicar la generación de opciones.
 *
 * Año del encabezado de mes ("{mes} de {año}") — el catálogo no modela
 * año en `date` (solo "Viernes 21 mar"). Se usa el año actual real
 * (`new Date().getFullYear()`), no uno inventado al azar — mismo
 * criterio de "no fabricar un dato menos honesto que la alternativa
 * obvia" que ya se usa en el resto del proyecto.
 *
 * "Muchas más opciones" — 2026-09-05, a pedido de Ana. Este componente
 * no genera nada: lista lo que le llega en `opciones` (ver
 * `generarOpcionesFechaHora` en utils/price.ts, ahora 6 en vez de 3) —
 * el sheet crece solo con más filas, por eso tiene `overflow-y-auto`
 * desde la primera versión.
 *
 * `indiceInicio` — 2026-09-05, a pedido de Ana: "LOS HORRIOS DE VER
 * TODOS DEBEN SER DESPUES DEL 14 Y 15 QUE YA APARECEN COMO LOS MAS
 * CERCANOS ANTES" (las opciones 0 y 1, ya visibles como chips
 * compactos en Compra.tsx). Antes este sheet repetía esas 2 primeras
 * opciones arriba de la lista; ahora Compra.tsx pasa `indiceInicio={2}`
 * y acá se arranca a listar desde ese índice — sin repetir lo que el
 * usuario ya ve en la card, pero sin perder el mapeo al índice REAL del
 * array (`i = idx + indiceInicio`) para que `onSeleccionar`/el
 * resaltado sigan apuntando a la opción correcta.
 *
 * Sin checkbox, selección solo por stroke mint — 2026-09-05, a pedido
 * de Ana: "NO QUIERO QUE LAS OPCIONES DE FECHA Y HORA TENGAS UN CHECK
 * BOX, SE VAN A SELECCIONAR CON STROKE mint Y AHORA MISMO COMO TIENEN
 * STROKE propio, NO DEBEN IR ASI SINO SIN". Nunca hubo checkbox acá
 * (la selección ya se mostraba resaltando la card, ver nota de arriba),
 * pero la card SIN seleccionar sí tenía su propio borde
 * (`border-white-12`) — eso es lo que había que sacar. Ahora el borde
 * es transparente por defecto (mismo grosor que el seleccionado, para
 * que no salte el layout al elegir) y solo se pinta mint cuando
 * `i === indiceSeleccionado`.
 *
 * `indiceSeleccionado: number | null` — 2026-09-05, a pedido de Ana:
 * "NO DEBE APARECER EN VERDE (COMO CLICKEADO) NINGUN HORARIO" por
 * defecto. Compra.tsx ahora arranca su selección en `null` (ver punto 6
 * del comentario grande de Compra.tsx) — acá alcanza con que el tipo
 * acepte `null`, porque `i === null` nunca es cierto para ningún índice
 * real, así que ninguna card sale marcada hasta que se toque una.
 */

export default function TodasFechasSheet({
  open,
  experiencia,
  opciones,
  indiceSeleccionado,
  indiceInicio = 0,
  onSeleccionar,
  onClose,
}: {
  open: boolean;
  experiencia: Experience;
  opciones: OpcionFechaHora[];
  indiceSeleccionado: number | null;
  indiceInicio?: number;
  onSeleccionar: (indice: number) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const gratis = esGratis(experiencia.price);
  const precioLabel = gratis
    ? "Gratis"
    : `${experiencia.mostrarDesde ? "Desde " : ""}${experiencia.price}`;

  const opcionesMostradas = opciones.slice(indiceInicio);
  // Mes del encabezado — se toma de la primera opción REALMENTE
  // mostrada (no siempre `opciones[0]`, ver `indiceInicio` arriba), para
  // que el mes del header coincida con lo que se ve en pantalla.
  const mesAbrev = mesAbrevDesdeChip(opcionesMostradas[0]?.fecha ?? "");
  const mesCompleto = mesAbrev ? mesCompletoDesdeAbrev(mesAbrev) : "";
  const anioActual = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div className="relative bg-thea-deep rounded-t-[28px] flex flex-col sheet-slide-up max-h-[85vh] overflow-y-auto">
        {/* Cabecera sticky — 2026-09-05, a pedido de Ana ("EN EL BOTTON
            SHEET TIENE QUE QUEDAR ESTABLE HASTA DONDE DICE OCTUBRE CON
            EL ICONO DEL CALENDARIO"): drag handle + back/título + mes y
            calendario quedan fijos arriba (`sticky top-0`) mientras la
            lista de opciones de abajo es lo único que scrollea — mismo
            `bg-thea-deep` que el resto del sheet para que no se
            transparente contenido por detrás al hacer scroll. */}
        {/* `bg-[rgb(1,20,20)]` sólido en vez de `bg-thea-deep` acá — se
            encontró viendo el resultado que `--color-thea-deep` es
            `rgb(1 20 20 / 95%)` (95% opaco, no 100%): con la lista
            scrolleando DEBAJO de esta cabecera sticky, ese 5% de
            transparencia dejaba pasar un "fantasma" visible del texto
            blanco de las cards al pasar por detrás (imperceptible en el
            resto de los sheets de la app porque ninguno tiene contenido
            scrolleando por detrás de una parte fija propia). Mismo tono
            que ya usa el header de Compra.tsx (`bg-[rgb(1,20,20)]`),
            ahora sí 100% opaco. */}
        <div className="sticky top-0 z-10 bg-[rgb(1,20,20)] flex flex-col shrink-0">
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
            <h2 className="font-display text-xl text-white-100">Elegir fecha y hora</h2>
          </div>

          {mesCompleto && (
            <div className="flex flex-col gap-3 px-5 pt-2 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-body font-semibold text-base text-white-100">
                  {mesCompleto} de {anioActual}
                </span>
                <IconCalendar className="w-5 h-5 text-white-60" />
              </div>
              <div className="h-px w-full bg-white-12" />
            </div>
          )}
        </div>

        <div className="px-5 pt-5 pb-8">
          <div className="flex flex-col gap-5">
            {opcionesMostradas.map((opcion, idx) => {
              const i = idx + indiceInicio;
              const seleccionado = i === indiceSeleccionado;
              const disponibles = lugaresDisponibles(experiencia.id, opcion);
              return (
                <div key={`${opcion.fecha}-${opcion.hora}`} className="flex flex-col gap-2">
                  <span className="font-body text-[15px] text-white-100 lowercase">
                    {fechaCompletaDesdeChip(opcion.fecha)}
                  </span>
                  <button
                    onClick={() => {
                      onSeleccionar(i);
                      onClose();
                    }}
                    className={`rounded-2xl border-2 px-5 py-4 flex items-center justify-between gap-4 text-left ${
                      seleccionado
                        ? "bg-white-12 border-thea-mint"
                        : "bg-white-6 border-transparent"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      {opcion.hora && (
                        <span className="font-body text-sm text-white-100">
                          {horaCompacta(opcion.hora)} h
                        </span>
                      )}
                      <span className="font-body text-sm">
                        <span className="font-semibold text-white-100">{precioLabel}</span>
                        {!gratis && <span className="text-white-40"> por persona</span>}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 text-right">
                      <span className="font-body font-semibold text-sm text-white-100">
                        {disponibles} {disponibles === 1 ? "lugar" : "lugares"}
                      </span>
                      <span className="font-body text-xs text-white-40">
                        disponible{disponibles === 1 ? "" : "s"}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
