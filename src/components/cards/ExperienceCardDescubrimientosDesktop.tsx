/*
 * "Experience Card — Descubrimientos" (Desktop) — 2026-09-12, segunda
 * vuelta. La primera versión (misma fecha, ver historial) copiaba una
 * referencia estilo GetYourGuide/Airbnb con precio y un ícono de lugar;
 * Ana la rechazó ("es horrible lo que hiciste") y se volvió a la card
 * compartida con "Más reservados" (`ExperienceCardGridDesktop`, con
 * hover-expand).
 *
 * Pedido real, más preciso esta vez: "ya no quiero que las de descu
 * lleven la card tradicional, quiero que sea la foto y contenido de
 * texto abajo, desc corta de 2 lineas mas puntos suspensivos y el lugar,
 * adicional a lo que ya tiene" — o sea, se SUMAN 2 cosas a lo que la
 * card ya mostraba en reposo (etiqueta mint + título): una descripción
 * corta (2 líneas, con "…" si no entra) y el lugar. Nada de precio esta
 * vez — no lo pidió, y la vez pasada agregarlo de más fue parte de lo
 * que no le gustó.
 *
 * Sin hover-expand — Ana lo confirmó ella misma en el mismo mensaje:
 * "esto que quiere decir? si, que ya no va a tener el efecto expandido
 * porque es insostenible no?" — con toda esta información ya visible
 * siempre (no revelada recién en hover), no tiene sentido que la card
 * además se agrande: ya no queda texto "extra" escondido que revelar.
 * Por eso esta card vuelve a ser estática — mismo motivo que en el
 * intento anterior, pero ahora confirmado explícitamente por Ana en vez
 * de ser una inferencia mía.
 *
 * Zoom en la foto al hover — pedido explícito de Ana como reemplazo del
 * efecto de expandir: "en lugar de eso cuando se toque la foto puede
 * hacer como un zoom". Es sólo la imagen la que crece (`scale`), dentro
 * de su propio marco con `overflow-hidden` — el resto de la card no se
 * mueve ni cambia de tamaño.
 *
 * `onMouseEnter`/`onMouseLeave` en vez de `hover:` de Tailwind — MISMO
 * motivo ya documentado a fondo en `ExperienceCardGridDesktop.tsx`
 * ("Por qué onMouseEnter/onMouseLeave y no hover:/group-hover:"): desde
 * Tailwind 3.4, `hover:` compila a `@media (hover: hover) { &:hover }`,
 * que nunca se activa en ciertas pantallas/configuraciones aunque el
 * mouse esté encima — ya le pasó a Ana con la card vieja. Se evita ese
 * riesgo de entrada usando estado de React para el zoom también.
 *
 * Sin alto fijo, sin `absolute` — no hay animación de layout (la única
 * animación es un `scale` de la imagen, contenido en su propio marco),
 * así que no hace falta nada de la mecánica FLIP/posición absoluta que
 * tenía la card vieja para el hover-expand. La card mide lo que su
 * contenido pida.
 *
 * Sin contenedor — 2026-09-12, tercera vuelta, a pedido de Ana: "sacala
 * del contenedor verde claro de thea... es la [foto] sola mas el texto
 * abajo, sin contenedor". La primera versión de esta card nueva
 * heredaba el mismo panel `bg-thea-green rounded-xl` que usan el resto
 * de las cards de esta familia (Curado/Más reservados) — Ana no lo
 * quiere acá: nada de fondo de color ni de caja alrededor de la
 * imagen+texto, solo la imagen (con su propio radio) y el bloque de
 * texto debajo, sueltos sobre el fondo oscuro de la pantalla. Se saca
 * el `<div>` exterior con `bg-thea-green`/`rounded-xl`/`overflow-hidden`
 * y el `mx-4 mt-4`/`px-4 pb-4` que existían para dejar un margen entre
 * el contenido y las paredes de ESE panel — sin panel, no hace falta
 * ningún margen: la imagen ocupa el ancho completo de la card y el
 * texto queda pegado a ese mismo ancho, sin indentado propio.
 */
import { useState } from "react";
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

export default function ExperienceCardDescubrimientosDesktop({
  id,
  tag,
  title,
  description,
  venue,
  city,
  imageUrl,
}: {
  id: string;
  tag: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  imageUrl?: string;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="relative h-[160px] w-full shrink-0 overflow-hidden rounded-lg bg-white-8"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out"
            style={{ transform: zoomed ? "scale(1.08)" : "scale(1)" }}
          />
        ) : (
          <ImagePlaceholder />
        )}
        <FavoritoButton id={id} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.7px] text-thea-mint">
          {tag}
        </span>

        <h3 className="font-display line-clamp-2 text-lg tracking-[-0.3px] text-white-100">
          {title}
        </h3>

        <p
          className="font-body line-clamp-2 text-sm"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          {description}
        </p>

        <p
          className="font-body line-clamp-1 text-[13px]"
          style={{ color: "rgba(251,251,251,0.5)" }}
        >
          {venue} · {city}
        </p>
      </div>
    </div>
  );
}
