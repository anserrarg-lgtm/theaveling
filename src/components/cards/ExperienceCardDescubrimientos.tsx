/*
 * "Experience Card — Descubrimientos" — master `1912:616`.
 * Spec verificado en vivo en Figma (2026-08-31): 300×240, rounded-12,
 * p-16, fill White/6. Sin eyebrow, sin descripción, sin precio — a
 * propósito, según la descripción real del componente en Figma.
 *
 * Actualizado 2026-09-01: se agregó el campo mint "Etiqueta" (mismo
 * estilo que en Más reservados) y la altura subió a 300×310 para
 * acomodarlo — verificado en vivo en Figma después del cambio.
 *
 * Props corregidas — 2026-09-02: la única línea de metadata representa
 * "Venue, Ciudad" (sin descripción, a propósito, spec real). Antes
 * recibía un `place` genérico; ahora `venue`, `city` explícitos para
 * que coincida 1:1 con el resto de las cards y con `experiences.ts`.
 *
 * Fecha/hora quitadas — 2026-09-02, a pedido de Ana (mismo motivo que
 * en ExperienceCardMasReservados: evitar que la línea haga wrap y
 * encoja el área de imagen). `date` sigue en `experiences.ts`.
 *
 * Tamaños fijos — 2026-09-02, misma regla explícita de Ana aplicada acá
 * (esta card tenía el mismo patrón de riesgo, imagen en `flex-1`,
 * aunque no se había manifestado todavía con el contenido actual):
 * título con altura fija `h-12` (2 líneas, tenga 1 o 2) + line-clamp-2,
 * tag y "Venue, Ciudad" con `truncate` (1 línea fija), e imagen con
 * altura fija `h-[172px]` (ya no `flex-1`). Así la imagen es siempre la
 * misma sin importar qué tan largo sea el título.
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

export default function ExperienceCardDescubrimientos({
  id,
  tag,
  title,
  venue,
  city,
  imageUrl,
  centerTitle = false,
}: {
  id: string;
  tag: string;
  title: string;
  venue: string;
  city: string;
  imageUrl?: string;
  /** 2026-09-08, a pedido de Ana ("las cards de escena y cultura, sin
   * las de los festivales, que utilicen dos líneas de título, no me
   * gusta como queda una"): cuando el título real ocupa solo 1 línea,
   * quedaba pegado arriba del bloque de 2 líneas reservado (`h-12`),
   * dejando un vacío abajo que se ve incompleto al lado de títulos que
   * sí llenan las 2 líneas. Con `centerTitle` el título se centra
   * verticalmente en ese espacio en vez de quedar pegado arriba — se
   * sigue permitiendo hasta 2 líneas (`line-clamp-2`), solo cambia
   * cómo se ve un título corto de 1 línea. Opt-in explícito, default
   * `false`: el riel "Descubrimientos" de la pestaña Todo no pidió este
   * cambio, sigue como estaba. */
  centerTitle?: boolean;
}) {
  return (
    <div className="w-[300px] h-[310px] rounded-xl p-4 flex flex-col gap-4 bg-white-6 shrink-0 overflow-hidden">
      <div className="relative h-[172px] shrink-0 rounded-lg overflow-hidden bg-white-8">
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
        <div className={`h-12 ${centerTitle ? "flex flex-col justify-center" : ""}`}>
          <h3 className="font-display text-lg leading-6 tracking-[-0.3px] text-white-100 line-clamp-2">
            {title}
          </h3>
        </div>
        <p
          className="font-body text-[13px] truncate"
          style={{ color: "rgba(251,251,251,0.5)" }}
        >
          {venue}, {city}
        </p>
      </div>
    </div>
  );
}
