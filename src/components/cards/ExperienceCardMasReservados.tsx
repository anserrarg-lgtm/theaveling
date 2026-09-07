/*
 * "Experience Card — Más reservados" — master `2130:945`.
 * Spec verificado en vivo en Figma (2026-08-31): 268×368, rounded-12,
 * p-16, fill White/6 (token real, no manual — mismo que usan las cards
 * de Búsqueda). Sin degradado: título/metadata van abajo de la imagen,
 * en bloque aparte, no superpuestos.
 *
 * Campo mint renombrado 2026-09-01: la capa se llamaba "Categoria" en
 * Figma pero el contenido real que lleva es una etiqueta curatorial
 * específica (ej. "Teatro de máscaras"), no la categoría oficial de la
 * taxonomía (Teatro/Danza/Performance/etc.) — renombrado a "Etiqueta"
 * en Figma y a `tag` acá para que coincida.
 *
 * Puntuación — 2026-09-02, a pedido de Ana: `rating` va en escala de 10
 * (ej. "9.0"), NO en porcentaje ("90%"). El componente solo muestra el
 * string tal cual (★ {rating}), así que quien arme los datos mock debe
 * pasar el valor ya en ese formato.
 *
 * Props corregidas — 2026-09-02: la capa que Figma llama "Descripcion
 * Editorial" (`2130:954`) es una oración descriptiva, no un nombre de
 * venue — antes se le pasaba `place` y perdía el venue real (la línea de
 * metadata solo mostraba ciudad—fecha). Ahora: `description` para esa
 * oración, `venue` nuevo para el lugar real.
 *
 * Fecha/hora quitadas de la metadata — 2026-09-02, a pedido de Ana: la
 * línea "Venue, Ciudad — Fecha" se volvía muy larga con venues largos y
 * hacía wrap a 2 líneas, lo que empujaba y encogía el área de imagen
 * (altura de card fija, imagen en flex-1). Ahora metadata es solo
 * "Venue, Ciudad" — corto y de una sola línea siempre. `date` sigue en
 * `experiences.ts` por si Detalle de experiencia lo necesita mostrar.
 *
 * Título 24→20px + line-clamp — 2026-09-02, a pedido de Ana: con títulos
 * largos ("Sesión Subterránea: Ritual de Máscaras" — título actualizado
 * 2026-09-03, ver experiences.ts; el problema de longitud es el mismo)
 * a 24px + descripción
 * completa, el bloque de texto crecía tanto que la imagen quedaba
 * reducida a una franja de ~30px (altura de card fija, imagen en
 * flex-1) — el mismo problema de fondo que la fecha, pero por título +
 * descripción en vez de metadata.
 *
 * Rediseño a tamaños fijos — 2026-09-02, regla explícita de Ana: "no
 * puede pasar que los tamaños de la imagen o de la card cambien según
 * el contenido". El line-clamp de arriba topaba el MÁXIMO, pero no fija
 * un mínimo — un título de 1 línea seguía dejando la imagen (flex-1)
 * con una altura distinta a la de un título de 2 líneas. Ahora: título
 * bajado a 18px (igual que Descubrimientos, sugerencia de Ana) con
 * altura fija `h-12` (2 líneas, tenga 1 o 2), descripción con altura
 * fija `h-10` (2 líneas), tag y "Venue, Ciudad" con `truncate` (1 línea
 * fija siempre), e imagen con altura fija `h-[132px]` (ya no `flex-1`).
 * Con las 4 piezas de texto a altura fija, la imagen es exactamente la
 * misma en las 7 cards del riel, corto o larguísimo que sea el título.
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

export default function ExperienceCardMasReservados({
  id,
  tag,
  title,
  description,
  venue,
  city,
  rating,
  price,
  imageUrl,
  mostrarDesde,
}: {
  id: string;
  tag: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  rating: string;
  price: string;
  imageUrl?: string;
  /** "Desde $X" solo para teatros formales de verdad — ver nota en
   * experiences.ts. Por defecto (undefined/false) se muestra solo "$X". */
  mostrarDesde?: boolean;
}) {
  return (
    <div className="w-[268px] h-[368px] rounded-xl p-4 flex flex-col gap-4 bg-white-6 shrink-0 overflow-hidden">
      <div className="relative h-[132px] shrink-0 rounded-lg overflow-hidden bg-white-8">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
        <FavoritoButton id={id} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <span className="font-body font-semibold text-[11px] uppercase text-thea-mint truncate">
          {tag}
        </span>
        <h3 className="font-display text-lg leading-6 tracking-[-0.3px] text-white-100 h-12 line-clamp-2">
          {title}
        </h3>
        {/* rgba(251,251,251,.7)/.5 — valores sueltos en Figma para
            descripción/metadata, no coinciden con escalones de STACK.md */}
        <p
          className="font-body text-sm h-10 line-clamp-2"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          {description}
        </p>
        <p
          className="font-body text-[13px] truncate"
          style={{ color: "rgba(251,251,251,0.5)" }}
        >
          {venue}, {city}
        </p>
      </div>

      <div className="border-t border-white-12 pt-2 flex items-center justify-between shrink-0">
        {/* 2026-09-02, a pedido de Ana: estrella en thea-mint, puntaje de
            vuelta a blanco (white-100) — se probó thea-deep pero Ana pidió
            revertir solo el número. */}
        <span className="font-body font-semibold text-[13px] whitespace-nowrap">
          <span className="text-thea-mint">★</span>{" "}
          <span className="text-white-100">{rating}</span>
        </span>
        {/* "Desde" solo si mostrarDesde=true (teatros formales) — a
            pedido de Ana 2026-09-02. Ver misma nota en
            DetalleExperiencia.tsx y en el campo en experiences.ts. */}
        <span className="font-body text-right whitespace-nowrap">
          {mostrarDesde && (
            <span className="text-[13px] font-semibold text-white-100">Desde </span>
          )}
          <span className="text-[17px] font-semibold text-white-100">{price}</span>
        </span>
      </div>
    </div>
  );
}
