/*
 * MapaButacas — 2026-09-05, a pedido de Ana: el acordeón "Ver mapa de
 * butacas" de Compra.tsx (ver punto 3 del comentario grande de ese
 * archivo) mostraba hasta ahora el `MapPreview` real del VENUE (mapa de
 * ubicación/calles) como compromiso honesto, porque el catálogo no
 * modela un mapa de asientos. Ana lo rechazó explícitamente: "el mapa
 * de butacas debe ser real no un mapa de ubicacion" — un link que dice
 * "mapa de butacas" tiene que mostrar butacas, no dónde queda el lugar.
 *
 * El catálogo (`experiences.ts`) sigue sin modelar butacas/asientos
 * reales — no hay ningún dato real de qué butacas existen ni cuáles
 * están vendidas para ninguna pieza. En vez de dejar el pedido sin
 * resolver otra vez, se arma acá un plano de butacas con pinta de plano
 * real (escenario arriba + filas de asientos abajo), con ocupación
 * DECORATIVA pero determinística por experiencia — mismo criterio que
 * `lugaresDisponibles` en utils/price.ts: un hash estable sobre
 * `experienciaId + fila + número` para que la misma pieza siempre
 * muestre el mismo plano (no cambia solo entre renders/refresh), pero
 * distinto de una experiencia a otra.
 *
 * DECISIÓN CERRADA — 2026-09-05, Ana comparó esta versión con la del
 * bottom-sheet real de Figma ("Pattern / Compra — 2. Selección de
 * asientos", nodo `1848:681`: escenario + grilla + leyenda Disponible/
 * Seleccionado/Ocupado + resumen de selección + CTA, como pantalla
 * aparte) y eligió quedarse con ESTA versión, la que ya estaba armada
 * acá adentro del acordeón de Compra.tsx: "ME GUSTA LA QUE ARMASTE, HAZ
 * QUE FUNCIONE, Y REGISTRA QUE QUEDO ESTA". No se construye el bottom
 * sheet separado de Figma — queda registrado que esta card inline es la
 * versión definitiva de "Ver mapa de butacas".
 *
 * COMPONENTE CONTROLADO — 2026-09-05, segunda vuelta, a pedido de Ana:
 * "LA CANTIDAD DE PERSONAS DEBE ESTAR RELACIONADO CON EL MAPA DE
 * BUTACAS, O SEA SUBIR CUANDO SE ELIGEN". La primera versión de "que
 * funcione" dejaba la selección de butacas VIVIENDO ACÁ ADENTRO
 * (estado propio) y la topeaba contra `cantidad` (no dejaba elegir más
 * butacas que entradas). Ana pidió la relación inversa: elegir una
 * butaca es lo que define cuántas personas hay, no al revés. Por eso
 * `seleccionadas` pasa a ser prop controlada desde Compra.tsx (no hay
 * `useState` acá adentro) — Compra.tsx es quien calcula `cantidad =
 * seleccionadas.length` y quien decide, según
 * `experiencia.asientoAsignado`, si este componente aparece siquiera.
 * Ya no hay tope propio contra `cantidad` — no tendría sentido: acá ya
 * NO existe un `cantidad` previo contra el que topear, es al revés.
 *
 * "En alguno simplemente el mapa de butacas no va a ser clickeable
 * porque no lo necesita" — ver `asientoAsignado` en experiences.ts y su
 * uso en Compra.tsx: este componente solo se renderiza para
 * experiencias con butaca asignada (sala con filas fijas). Las que no
 * la tienen (talleres, charlas, recorridos, festivales, funciones
 * íntimas/a puerta cerrada, rituales inmersivos) ni siquiera muestran
 * "Ver mapa de butacas" — vuelven al stepper +/- manual de "Cantidad de
 * personas" de siempre, porque no hay butacas que elegir.
 *
 * Sigue sin conectarse a ningún backend real de inventario de asientos
 * (no existe tal cosa en el catálogo) — la interacción es demostrativa/
 * decorativa pero FUNCIONAL (se puede tocar, se marca, se puede
 * destocar), no pretende ser un sistema de venta de butacas operativo.
 * Mismo espíritu "primera pasada, documentado como tal" que el resto
 * del contenido inventado del proyecto — ver `lugaresDisponibles` en
 * utils/price.ts.
 *
 * Filas A-D x 8 butacas = 32 — tamaño chico a propósito, acorde a las
 * piezas boutique del catálogo (teatro/experiencias íntimas, no un
 * estadio), mismo espíritu que el rango 1-12 de `lugaresDisponibles`.
 *
 * Paleta oscura (`white-*` en vez de `green-*`/`text-thea-green`) —
 * 2026-09-05, junto con el experimento de la BookingSelectorCard
 * transparente en Compra.tsx (ver punto 8 de su comentario grande):
 * este componente se armó primero pensado para la card BLANCA original
 * (fondo claro, texto oscuro). Al pasar esa card a transparente sobre
 * el fondo oscuro de la pantalla, se flipean acá los mismos tokens al
 * equivalente oscuro para que siga siendo legible. Si Ana vuelve la
 * card a blanco, esto se revierte junto con ese cambio.
 */

const FILAS = ["A", "B", "C", "D"] as const;
const BUTACAS_POR_FILA = 8;

function hashButaca(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export default function MapaButacas({
  experienciaId,
  seleccionadas,
  onToggle,
}: {
  experienciaId: string;
  /** Claves "fila-numero" (ej. "A-3") de las butacas ya elegidas —
   * controlado desde Compra.tsx, ver nota grande arriba. */
  seleccionadas: string[];
  onToggle: (clave: string) => void;
}) {
  return (
    <div className="rounded-xl bg-white-8 border border-white-12 px-4 py-4 flex flex-col items-center gap-4">
      {/* Escenario */}
      <div className="w-full flex flex-col items-center gap-1.5">
        <div className="w-3/4 h-1.5 rounded-full bg-white-60" />
        <span className="font-body text-[10px] uppercase tracking-[1.5px] text-white-100 opacity-60">
          Escenario
        </span>
      </div>

      {/* Filas de butacas */}
      <div className="flex flex-col gap-1.5">
        {FILAS.map((fila) => (
          <div key={fila} className="flex items-center gap-1.5">
            <span className="font-body text-[10px] font-semibold text-white-100 opacity-50 w-3 text-center">
              {fila}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: BUTACAS_POR_FILA }, (_, i) => {
                const numero = i + 1;
                const clave = `${fila}-${numero}`;
                const ocupada = hashButaca(`${experienciaId}-${clave}`) % 10 < 3;
                const elegida = seleccionadas.includes(clave);
                return (
                  <button
                    key={numero}
                    type="button"
                    disabled={ocupada}
                    onClick={() => onToggle(clave)}
                    aria-label={`Butaca ${fila}${numero}${ocupada ? " (ocupada)" : elegida ? " (elegida)" : " (disponible)"}`}
                    aria-pressed={elegida}
                    className={`w-3.5 h-3.5 rounded-[3px] ${
                      ocupada
                        ? "bg-white-40 cursor-not-allowed"
                        : elegida
                          ? "bg-thea-mint"
                          : "border border-white-20"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contador — 2026-09-05: ya no dice "N de M" (ese tope venía de
          `cantidad`, que ahora es al revés: lo define esta selección).
          Solo informa cuántas butacas hay elegidas hasta ahora. */}
      <span className="font-body text-[11px] text-white-100 opacity-70">
        {seleccionadas.length === 0
          ? "Elige tus butacas"
          : `${seleccionadas.length} ${seleccionadas.length === 1 ? "butaca elegida" : "butacas elegidas"}`}
      </span>

      {/* Referencia — mismos 3 estados que trae el bottom-sheet real de
          Figma (Disponible/Seleccionado/Ocupado, nodo 1848:681), aunque
          acá se resuelvan en esta card inline y no en un sheet aparte
          (ver "DECISIÓN CERRADA" arriba). */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[3px] border border-white-20" />
          <span className="font-body text-[11px] text-white-100 opacity-70">
            Disponible
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[3px] bg-thea-mint" />
          <span className="font-body text-[11px] text-white-100 opacity-70">
            Seleccionado
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[3px] bg-white-40" />
          <span className="font-body text-[11px] text-white-100 opacity-70">
            Ocupado
          </span>
        </div>
      </div>
    </div>
  );
}
