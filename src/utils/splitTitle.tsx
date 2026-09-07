import type { ReactNode } from "react";

/*
 * Regla pedida por Ana (2026-09-02): en los títulos grandes superpuestos
 * sobre imagen (Piece Info Hero, Experience Card — Curado), si el título
 * trae el patrón "Prefijo: Resto" —se repite en varias piezas: "Cuerpo en
 * Obra: Ensayo Abierto", "Fronteras Difusas: Retrospectiva Analógica",
 * "Materia y memoria: Taller de técnica mixta", "Charla: Dramaturgias del
 * Cuerpo"— se parte SIEMPRE en 2 líneas: el prefijo con los dos puntos
 * arriba, el resto abajo. No es específico de una pieza, es la regla
 * general para cualquier título con ":". Si no hay ":", se devuelve tal
 * cual y que envuelva solo si hace falta.
 *
 * Centralizado acá (en vez de repetir la lógica en cada card) porque el
 * mismo título puede aparecer en más de un lugar (la card de Curado en
 * Descubrir y el Hero de Detalle son la misma pieza).
 *
 * Prefijo largo — 2026-09-03, bug real encontrado por Ana en el Piece
 * Info Hero: "Dramaturgias Nómadas:" (21 caracteres) no entraba en una
 * sola línea al tamaño fijo de 32px — se cortaba solo en 2 líneas, y el
 * título completo terminaba en 3 líneas en vez de las 2 que pide la
 * regla de arriba. Si el caller pasa `compact` (tamaño más chico para
 * este caso puntual), se aplica cuando el prefijo supera 20 caracteres.
 * Se aplica con `style` inline, NO con una className de Tailwind
 * (`text-[26px]` compitiendo con el `text-[32px]` del caller): 2 clases
 * de arbitrary-value para el mismo `font-size` se resuelven por orden de
 * generación en la hoja de estilos, no por orden en el string de
 * className — el mismo tipo de bug de cascada que ya mordió una vez en
 * FavoritoButton.tsx (`relative` vs `absolute`). Un style inline
 * siempre gana, sin ese riesgo. Sin `compact`, el título se comporta
 * exactamente igual que antes (ej. Experience Card — Curado, donde el
 * mismo prefijo largo sí entra en una línea al tamaño más chico de la
 * card — probado, no hace falta compactar ahí).
 */
export function splitTitleForDisplay(
  title: string,
  compact?: { fontSize: number; lineHeight: number },
): ReactNode {
  const colonIndex = title.indexOf(":");
  if (colonIndex === -1) return title;
  const top = title.slice(0, colonIndex + 1);
  const bottom = title.slice(colonIndex + 1).trim();
  const isLongPrefix = top.length > 20;
  const style =
    isLongPrefix && compact
      ? { fontSize: compact.fontSize, lineHeight: `${compact.lineHeight}px` }
      : undefined;
  return (
    <span style={style}>
      {top}
      <br />
      {bottom}
    </span>
  );
}
