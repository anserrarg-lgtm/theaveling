import { Link, useNavigate, useParams } from "react-router-dom";
import { getVerMasContent } from "../../data/experiences";
import ExperienceCardMasReservados from "../../components/cards/ExperienceCardMasReservados";
import ExperienceCardDescubrimientos from "../../components/cards/ExperienceCardDescubrimientos";
import ExperienceCardCurado from "../../components/cards/ExperienceCardCurado";
import { IconCaretRight } from "../../components/icons";

/*
 * VerMas — 2026-09-08, a pedido de Ana ("la pantalla de ver mas, la
 * armamos con el contenido ya de cada sección? y ya miramos si
 * agregamos un par mas?"). Hasta acá las cards `VerMasCard` al final de
 * cada riel de Descubrir.tsx eran solo visuales, sin ningún lugar al
 * que llevar (ver esa nota en VerMasCard.tsx) — esta es esa pantalla,
 * ruta `/ver-mas/:slug`.
 *
 * Con lo que hay, no una grilla nueva: no existe en el proyecto ningún
 * patrón de grilla de cards (ver Perfil.tsx, favoritos también quedó
 * pendiente de eso) y las cards de estos rieles tienen ancho fijo
 * (268px/300px) pensado para scroll horizontal, no para una grilla de
 * columnas en una pantalla de 390px. En vez de diseñar un componente
 * nuevo sin pedido explícito de Ana, esta pantalla apila la MISMA card
 * que ya se ve en el riel de origen, centrada, en una sola columna —
 * "más de lo mismo" en el sentido literal, no una superficie nueva.
 * `getVerMasContent` (data/experiences.ts) resuelve qué contenido y qué
 * card corresponde a cada `slug`.
 *
 * El número que antes prometía cada `VerMasCard` (+12, +40, etc.) era
 * "primera pasada inventada" (ver esa nota en `SeccionCategoria`) y no
 * coincidía con lo que hay de verdad — acá se cuenta lo real
 * (`experiencias.length`) en vez de repetir el número inventado, para no
 * prometer más de lo que esta pantalla puede mostrar. Ver conversación
 * con Ana: falta sumar más experiencias reales a varias de estas
 * secciones — cuando eso pase, esta pantalla ya lo refleja sola, sin
 * tocar código.
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
            {contenido.experiencias.map((exp) => {
              if (contenido.cardVariant === "reservados") {
                return (
                  <Link key={exp.id} to={`/experiencia/${exp.id}`} className="px-5">
                    <ExperienceCardMasReservados
                      id={exp.id}
                      tag={exp.tag}
                      title={exp.title}
                      description={exp.description}
                      venue={exp.venue}
                      city={exp.city}
                      rating={exp.rating}
                      price={exp.price}
                      imageUrl={exp.imageUrl}
                      mostrarDesde={exp.mostrarDesde}
                    />
                  </Link>
                );
              }
              if (contenido.cardVariant === "curado") {
                // Sin `px-5` a propósito — esta card va a sangre (mismo
                // criterio que el riel de Curado y FestivalesCarousel en
                // Descubrir.tsx), no con margen como las otras 2 cards.
                return (
                  <Link key={exp.id} to={`/experiencia/${exp.id}`} className="w-full">
                    <ExperienceCardCurado
                      id={exp.id}
                      title={exp.title}
                      description={exp.description}
                      imageUrl={exp.imageUrl}
                      imagePosition={exp.imagePosition}
                    />
                  </Link>
                );
              }
              return (
                <Link key={exp.id} to={`/experiencia/${exp.id}`} className="px-5">
                  <ExperienceCardDescubrimientos
                    id={exp.id}
                    tag={exp.tag}
                    title={exp.title}
                    venue={exp.venue}
                    city={exp.city}
                    imageUrl={exp.imageUrl}
                  />
                </Link>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
