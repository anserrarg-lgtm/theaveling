/*
 * "Experience Card — Curado" (Desktop) — nodo real de Figma "Tarjeta de
 * Experiencia Curada" dentro de `categoría-theaveling-cards desktop`
 * (`1407:14`), traído vía get_design_context 2026-09-08 (primera
 * pantalla de Theaveling Desktop). A sangre horizontal (w-full, 310px de
 * alto fijo) con degradado inferior únicamente — a diferencia de la
 * versión mobile (`ExperienceCardCurado.tsx`), que además de ser vertical
 * trae degradado arriba Y abajo; acá el nodo real de Figma solo trae el
 * de abajo, se respeta esa diferencia real en vez de calcar mobile.
 *
 * Categoría — el nodo de Figma sí trae un eyebrow de categoría encima
 * del título ("DANZA CONTEMPORÁNEA"), que la card de Curado de mobile no
 * muestra. Se usa `exp.category` (ya existe en el catálogo real,
 * `data/experiences.ts`) para ese eyebrow.
 *
 * Botón de favorito — se reusa `FavoritoButton` tal cual (drop-shadow,
 * sin chip circular), NO el chip circular blanco que trae el nodo de
 * Figma: Ana ya probó y descartó el chip 2 veces para esta misma familia
 * de cards (ver nota grande en FavoritoButton.tsx) — se prioriza esa
 * decisión ya tomada sobre calcar un nodo de Figma que es anterior a
 * ella.
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

export default function ExperienceCardCuradoDesktop({
  id,
  category,
  title,
  description,
  imageUrl,
  imagePosition,
}: {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
}) {
  return (
    <div className="relative h-[310px] w-full overflow-hidden rounded-xl bg-white-8">
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

      {/* Degradado inferior únicamente — spec real del nodo Desktop. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <FavoritoButton id={id} className="absolute top-4 right-4" />

      <div className="absolute bottom-5 left-5 right-24 flex flex-col gap-2">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[1.5px] text-white-80">
          {category}
        </span>
        <h3 className="font-display text-[26px] tracking-[-0.3px] text-white-100">
          {title}
        </h3>
        {/* rgba(251,251,251,.7) — mismo valor suelto (no coincide con
            ningún escalón de white-*) que ya usan las otras cards de
            esta familia para su descripción, ver ExperienceCardCurado.tsx. */}
        <p
          className="truncate font-body text-[13px]"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
