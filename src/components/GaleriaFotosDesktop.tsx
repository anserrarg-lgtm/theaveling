import ImagePlaceholder from "./ImagePlaceholder";

/*
 * GaleriaFotosDesktop — 2026-09-14, a pedido de Ana para el Detalle de
 * experiencia en Desktop: mandó una referencia de Fever (bloque de fotos
 * arriba del título) y pidió calcar ESE formato — "las fotos deben estar
 * en este formato, van a ser 3". El catálogo (`experiences.ts`) solo trae
 * `imageUrl` (una sola foto por pieza) — "se que no tenemos las otras
 * dos, no importa, dejalo con las otras dos vacias pero la que tenemos
 * ahora debe ser la grande": no se inventan 2 fotos de más, quedan como
 * placeholder (mismo `ImagePlaceholder` que ya usa el resto del proyecto
 * para huecos de foto reales) hasta que Ana suba contenido real.
 *
 * Layout — foto grande a la izquierda (ocupa 2 columnas de un grid de 3,
 * alto completo del bloque) + 2 fotos chicas apiladas a la derecha (1
 * columna, la mitad de la altura cada una) — mismo proporción que la
 * referencia. Esquinas redondeadas SOLO en el contorno exterior del
 * bloque completo (no en cada foto individual) — `overflow-hidden` en el
 * contenedor grid + radios puntuales en cada foto para que el conjunto
 * se sienta una sola pieza, igual que en Fever.
 *
 * 2026-09-14 (mismo día): Ana pidió sacar el botón "Galería" que estaba
 * superpuesto — "quita lo de galeria, solo las 3 fotos y ya". No
 * quedaba ninguna pantalla de galería ampliada detrás de ese botón de
 * todos modos, así que se retira junto con el ícono `IconGrid` que solo
 * se usaba acá.
 */
export default function GaleriaFotosDesktop({
  imageUrl,
}: {
  imageUrl?: string;
}) {
  return (
    <div className="relative grid h-[420px] w-full grid-cols-3 gap-2 overflow-hidden rounded-2xl">
      <div className="relative col-span-2 h-full bg-white-6">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="flex h-full flex-col gap-2">
        <div className="relative flex-1 bg-white-6">
          <ImagePlaceholder />
        </div>
        <div className="relative flex-1 bg-white-6">
          <ImagePlaceholder />
        </div>
      </div>
    </div>
  );
}
