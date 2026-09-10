import { Link, useNavigate, useParams } from "react-router-dom";
import { getVerMasContent } from "../../data/experiences";
import ExperienceCardContenidoCompleto from "../../components/cards/ExperienceCardContenidoCompleto";
import { IconCaretRight } from "../../components/icons";

/*
 * VerMas — 2026-09-08, a pedido de Ana ("la pantalla de ver mas, la
 * armamos con el contenido ya de cada sección? y ya miramos si
 * agregamos un par mas?"). Hasta acá las cards `VerMasCard` al final de
 * cada riel de Descubrir.tsx eran solo visuales, sin ningún lugar al
 * que llevar (ver esa nota en VerMasCard.tsx) — esta es esa pantalla,
 * ruta `/ver-mas/:slug`. `getVerMasContent` (data/experiences.ts)
 * resuelve qué contenido corresponde a cada `slug`.
 *
 * 2026-09-10, corrección real a pedido de Ana ("no la calcaste, esa
 * card era específica" / "la pantalla de ver mas es igual para todas
 * las experiencias"): la primera versión de esta pantalla apilaba la
 * MISMA card del riel de origen (Más reservados/Curado/Descubrimientos),
 * asumiendo sin comprobar que no había una card real para esto — error.
 * Sí existe: "Experience Card — Contenido completo de sección" (nodo de
 * Figma `1704:389`, ver esa card para el detalle completo), la 5ta
 * variante de la familia Experience Card, específica para esta pantalla
 * — LA MISMA para cualquier sección de origen, no una distinta por cada
 * una. Ver ExperienceCardContenidoCompleto.tsx.
 */
export default function VerMas() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const contenido = getVerMasContent(slug);

  return (
    <div className="min-h-screen bg-[rgb(1,20,20)] text-white-100">
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center gap-3 px-5 pt-[calc(20px_+_var(--safe-top))] pb-3 bg-[rgb(1,20,20)]">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="h-5 w-5 shrink-0 flex items-center justify-center"
        >
          <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
        </button>
        <h1 className="font-display text-lg text-white-100 truncate">
          {contenido?.titulo ?? "Ver más"}
        </h1>
      </header>

      <div className="flex flex-col items-center gap-4 pt-[calc(80px_+_var(--safe-top))] pb-10">
        {!contenido || contenido.experiencias.length === 0 ? (
          <p className="font-body text-sm text-white-60 text-center pt-10 px-5">
            No hay experiencias para mostrar acá todavía.
          </p>
        ) : (
          <>
            <p className="font-body text-[13px] text-white-60 self-start px-5">
              {contenido.experiencias.length}{" "}
              {contenido.experiencias.length === 1 ? "experiencia" : "experiencias"}
            </p>
            {contenido.experiencias.map((exp) => (
              <Link key={exp.id} to={`/experiencia/${exp.id}`} className="w-full px-5">
                <ExperienceCardContenidoCompleto
                  id={exp.id}
                  title={exp.title}
                  tag={exp.tag}
                  imageUrl={exp.imageUrl}
                  imagePosition={exp.imagePosition}
                />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
