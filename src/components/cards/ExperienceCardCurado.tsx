/*
 * "Experience Card — Curado" — master `1753:518` (400×520 en el catálogo,
 * usada a 390×520 en Home). Spec verificado en vivo en Figma (2026-08-31):
 * el master tiene 12px de radio, pero acá se usa full-bleed (a sangre, de
 * punta a punta del frame) — sin bordes redondeados, a pedido de Ana, para
 * que quede realmente a sangre y no como una card con margen invisible.
 * 2 degradados de legibilidad (arriba y abajo, hex crudos, no variables),
 * texto superpuesto alineado abajo, botón de favorito.
 *
 * 2026-09-02: esta card es full-bleed (w-full, ocupa TODO el ancho de
 * pantalla) — por eso, igual que se corrigió en el Hero de Detalle, la
 * altura no puede ir fija en px (`h-[520px]`), porque en un celular de
 * ancho distinto a 390px la imagen se deforma o se come pantalla de más.
 * Se pasó a `aspect-ratio` (390:520, la proporción real de Figma) para
 * que escale con el ancho real de cada dispositivo. Los degradados
 * también se pasaron de px fijos a % (120/520≈23%, 208/520=40%) para que
 * escalen junto con la altura real de la zona.
 *
 * También: título con regla de partido en 2 líneas ("Prefijo: Resto") —
 * ver src/utils/splitTitle.tsx, misma regla que en el Hero de Detalle.
 *
 * 2026-09-02: se probó agregar soporte de video acá (autoplay, mismo
 * criterio que el Hero de Detalle), pero Ana pidió revertirlo — en Home
 * siempre va la foto estática, el video se reserva para Detalle. `data/
 * experiences.ts` sigue guardando `videoUrl` cuando existe (lo usa
 * DetalleExperiencia.tsx), esta card simplemente no lo recibe ni lo usa.
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";
import { splitTitleForDisplay } from "../../utils/splitTitle";

export default function ExperienceCardCurado({
  id,
  title,
  description,
  imageUrl,
  imagePosition,
}: {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  /* 2026-09-08: object-position CSS opcional para el recorte de
     `imageUrl` — ver la nota grande en `Experience.imagePosition`
     (data/experiences.ts). Sin este prop, se mantiene "center" (mismo
     comportamiento de siempre en el resto de las cards). */
  imagePosition?: string;
}) {
  return (
    <div className="relative w-full aspect-[390/520] overflow-hidden bg-white-8">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: imagePosition ?? "center" }}
        />
      ) : (
        <ImagePlaceholder />
      )}

      {/* Degradado superior: rgba(17,44,44,.65) → transparente, ~23% (120/520) */}
      <div
        className="absolute top-0 left-0 right-0 h-[23%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17,44,44,0.65), rgba(17,44,44,0))",
        }}
      />
      {/* Degradado inferior: transparente → rgba(17,44,44,.65), 40% (208/520) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17,44,44,0), rgba(17,44,44,0.65))",
        }}
      />

      <FavoritoButton id={id} className="absolute top-4 right-4" />

      {/* Texto superpuesto, inset 16px, alineado abajo */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <h2 className="font-display text-2xl text-white-100">
          {splitTitleForDisplay(title)}
        </h2>
        {/* rgba(251,251,251,.7) es un valor suelto en Figma, no coincide con
            ningún escalón documentado en STACK.md (80/60/...) — se usa tal
            cual, no se redondea a un token cercano. Mismo tipo de
            inconsistencia que se viene encontrando y arreglando en Figma. */}
        <p
          className="font-body text-[13px]"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
