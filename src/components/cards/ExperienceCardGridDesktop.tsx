/*
 * "Experience Card" (Desktop, variantes Más reservados / Descubrimientos)
 * — nodos reales de Figma "Tarjeta de Experiencia" dentro de
 * `categoría-theaveling-cards desktop` (`1405:100` para Más reservados,
 * `1420:8` para Descubrimientos), traídos vía get_design_context
 * 2026-09-08. Estructuralmente son la MISMA card (imagen + tag +
 * título + descripción + metadata + divider + rating/precio) a 2
 * tamaños distintos — mismo criterio que documenta el propio sistema de
 * diseño ("Cinco variantes que comparten estructura", 01 — Foundations)
 * — así que acá viven como un solo componente con un prop `size`, en vez
 * de 2 archivos casi idénticos.
 *
 * Grilla, no rieles — a diferencia de mobile (scroll horizontal), estas
 * 2 secciones son grillas de columnas en Desktop (spec real del nodo:
 * "Contenedor Escritorio", `display: flex` con estas cards a ancho
 * fijo/flexible según la sección) — `Descubrir.tsx` las arma con CSS
 * grid, esta card solo necesita `w-full` para llenar su columna.
 *
 * Fondo/borde — el nodo de Figma usa rgba(251,251,251,0.06)/rgba(...,0.15),
 * que no son exactamente los tokens `white-6`/`white-12` del proyecto
 * (6%/12%) pero están MUY cerca (6%/15% vs 6%/12%) — se usan los tokens
 * reales en vez de los valores sueltos de Figma, mismo criterio de "no
 * inventar un rgba() suelto si ya existe un token equivalente" que rige
 * todo el proyecto (ver index.css).
 *
 * Botón de favorito — `FavoritoButton` reusado tal cual (drop-shadow,
 * sin chip), mismo motivo que en `ExperienceCardCuradoDesktop.tsx`.
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

type Size = "reservados" | "descubrimientos";

const IMAGE_HEIGHT: Record<Size, string> = {
  reservados: "h-[280px]",
  descubrimientos: "h-[240px]",
};

const TITLE_SIZE: Record<Size, string> = {
  reservados: "text-2xl",
  descubrimientos: "text-xl",
};

export default function ExperienceCardGridDesktop({
  id,
  tag,
  title,
  description,
  venue,
  city,
  date,
  rating,
  price,
  imageUrl,
  mostrarDesde,
  size,
}: {
  id: string;
  tag: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  date: string;
  rating: string;
  price: string;
  imageUrl?: string;
  mostrarDesde?: boolean;
  size: Size;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-xl border border-white-12 bg-white-6 p-4">
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-white-8 ${IMAGE_HEIGHT[size]}`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
        <FavoritoButton id={id} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.7px] text-thea-mint">
            {tag}
          </span>
          <h3 className={`font-display ${TITLE_SIZE[size]} tracking-[-0.3px] text-white-100`}>
            {title}
          </h3>
        </div>
        {/* rgba(251,251,251,.7)/.5 — mismos valores sueltos que ya usan
            las cards de esta familia en mobile, ver ExperienceCardMasReservados.tsx. */}
        <p
          className="line-clamp-2 font-body text-sm"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          {description}
        </p>
        <p
          className="font-body text-[13px]"
          style={{ color: "rgba(251,251,251,0.5)" }}
        >
          {venue} · {city} — {date}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white-12 pt-3">
          <span className="font-body text-[13px] font-semibold whitespace-nowrap">
            <span className="text-thea-mint">★</span>{" "}
            <span className="text-white-100">{rating}</span>
          </span>
          <span className="font-body text-right whitespace-nowrap">
            {mostrarDesde && (
              <span className="text-[13px] font-semibold text-white-100">Desde </span>
            )}
            <span className="text-[17px] font-semibold text-white-100">{price}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
