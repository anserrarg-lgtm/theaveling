import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

/*
 * "Experience Card — Contenido completo de sección" — 5ta variante real
 * de la familia Experience Card (documentada en Figma como "Cinco
 * variantes que comparten estructura y propósito", 02 — Components →
 * Cards: Más reservados / Descubrimientos / Curado / Contenido completo
 * de sección / Ver más). Nodo real `1704:389`, traído vía
 * get_design_context 2026-09-10. Es la card específica para la pantalla
 * "ver todo" (`VerMas.tsx`) — 320×200, imagen a sangre con degradado
 * inferior, título y subtítulo superpuestos.
 *
 * 2026-09-10, corrección real a pedido de Ana ("no la calcaste, esa card
 * era específica" / "la pantalla de ver mas es igual para todas las
 * experiencias"): antes `VerMas.tsx` reusaba las 3 cards de los rieles
 * de origen (`ExperienceCardMasReservados`/`Curado`/`Descubrimientos`,
 * elegida según la sección) en vez de esta card real. Se reemplaza por
 * ESTA — la MISMA para cualquier "Ver más", sin importar de qué sección
 * venga (mismo criterio que documenta el propio sistema de diseño: esta
 * variante existe específicamente para esta pantalla, no una por
 * sección).
 *
 * Subtítulo — el nodo real trae "Artista o compañía" en la segunda
 * línea, pero `Experience` (data/experiences.ts) no tiene un campo de
 * artista/compañía todavía. A pedido explícito de Ana ("hoy la podemos
 * dejar en título y etiqueta"), esa segunda línea usa `tag` (la misma
 * etiqueta de categoría que ya muestran el resto de las cards) en vez de
 * inventar un campo que no existe.
 *
 * Botón de favorito — se reusa `FavoritoButton` tal cual (drop-shadow,
 * sin el chip circular blanco que trae el nodo de Figma): Ana ya probó y
 * descartó el chip 2 veces para esta familia de cards (ver nota grande
 * en FavoritoButton.tsx) — se prioriza esa decisión ya tomada sobre
 * calcar un nodo que es anterior a ella.
 *
 * Degradado — el nodo real usa Thea Green (rgba(17,44,44,X)), no negro —
 * se respeta ese matiz exacto en vez de un gradiente gris genérico.
 */
export default function ExperienceCardContenidoCompleto({
  id,
  title,
  tag,
  imageUrl,
  imagePosition,
}: {
  id: string;
  title: string;
  tag: string;
  imageUrl?: string;
  imagePosition?: string;
}) {
  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imagePosition ?? "center" }}
        />
      ) : (
        <ImagePlaceholder />
      )}

      {/* Degradado inferior, Thea Green — spec real del nodo (rgba(17,44,44,0)
          a rgba(17,44,44,0.65), 80px de alto sobre 200px totales). */}
      <div
        className="absolute inset-x-0 bottom-0 h-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17,44,44,0) 0%, rgba(17,44,44,0.65) 100%)",
        }}
      />

      <FavoritoButton id={id} className="absolute top-3 right-3" />

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <p className="font-display text-2xl text-white-100">{title}</p>
        {/* rgba(251,251,251,.7) — mismo valor suelto que ya usan las otras
            cards de esta familia para su descripción/subtítulo. */}
        <p
          className="truncate font-body text-[13px]"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          {tag}
        </p>
      </div>
    </div>
  );
}
