import { Link, useNavigate, useParams } from "react-router-dom";
import { getVerMasContent } from "../../data/experiences";
import ExperienceCardContenidoCompleto from "../../components/cards/ExperienceCardContenidoCompleto";
import { IconCaretRight } from "../../components/icons";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import { useDescubrirTab } from "../../context/DescubrirTabContext";

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
  // DesktopNavbar/DesktopFooter — 2026-09-14, a pedido de Ana: "en todas
  // las pantallas acompana la navbar" / "...la parte de abajo donde dice
  // sobre la politica etc". Esto reemplaza la decisión vieja de acá abajo
  // ("Sin DesktopNavbar: esta pantalla es una sub-pantalla...") — Ana la
  // pide ahora en TODAS las pantallas, esta incluida. El botón "Volver"
  // propio se mantiene tal cual (sigue siendo útil para volver al riel
  // exacto de origen, cosa que la navbar no resuelve).
  const { activeCategory, setActiveCategory } = useDescubrirTab();
  const contenido = getVerMasContent(slug);

  return (
    <>
      {/* Mobile — sin cambios, ver nota grande arriba. `lg:hidden` para
          convivir con el bloque Desktop de abajo (mismo criterio que
          Descubrir.tsx). */}
      <div className="min-h-screen bg-[rgb(1,20,20)] text-white-100 lg:hidden">
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

      {/* Desktop — 2026-09-12, a pedido de Ana ("la pantalla de ver mas asi
          con la misma card pero en cuadricula"): MISMA card que mobile
          (`ExperienceCardContenidoCompleto`, sin variante propia — Ana ya
          había sido explícita en esa card de que es una sola para
          cualquier "Ver más", ver nota grande ahí) en una cuadrícula en
          vez de la columna apilada de mobile. No hay nodo de Figma para
          esta vista todavía, así que el resto (header, ancho, columnas)
          sigue el mismo lenguaje ya usado en Descubrir.tsx Desktop:
          fondo `bg-[rgb(1,20,20)]`, contenedor `max-w-[1440px]` con
          `px-20`, y el título con la barrita mint (sin flecha esta vez —
          acá ya se llegó, no hay a dónde más navegar).

          4 columnas: con `max-w-[1440px]` y `px-20` quedan 1280px de
          ancho útil; con `gap-8` (32px) cada card queda en ~296px de
          ancho — muy cerca del 320×200 real de la card (mismo alto fijo
          de 200px que ya trae el componente), así que el recorte de la
          imagen no se nota distinto al de mobile.

          Navbar/Footer — 2026-09-14, a pedido de Ana ("en todas las
          pantallas acompana la navbar" / "...la parte de abajo donde
          dice sobre la politica etc"): se agregan acá igual que en
          Descubrir.tsx/DetalleExperiencia.tsx — ver esas notas para el
          detalle de `onChange` (vuelve a Descubrir con la pestaña
          elegida) y por qué el footer no vivía antes en más de una
          pantalla. */}
      <div className="hidden min-h-screen bg-[rgb(1,20,20)] text-white-100 lg:block">
        <DesktopNavbar
          active={activeCategory}
          onChange={(tab) => {
            setActiveCategory(tab);
            navigate("/");
          }}
        />
        <div className="mx-auto max-w-[1440px] px-20 pt-16 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-10 flex items-center gap-2 font-body text-sm text-white-60 transition-colors hover:text-white-100"
          >
            <IconCaretRight className="h-4 w-4 rotate-180" />
            Volver
          </button>
          <h1 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
            <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
            {contenido?.titulo ?? "Ver más"}
          </h1>
          {contenido && contenido.experiencias.length > 0 && (
            <p className="mt-3 font-body text-[13px] text-white-60">
              {contenido.experiencias.length}{" "}
              {contenido.experiencias.length === 1 ? "experiencia" : "experiencias"}
            </p>
          )}
        </div>
        <div className="mx-auto h-px w-full max-w-[1440px] bg-white-12" />

        {!contenido || contenido.experiencias.length === 0 ? (
          <p className="font-body text-sm text-white-60 px-20 pt-10">
            No hay experiencias para mostrar acá todavía.
          </p>
        ) : (
          <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-8 px-20 pt-12 pb-40">
            {contenido.experiencias.map((exp) => (
              <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                <ExperienceCardContenidoCompleto
                  id={exp.id}
                  title={exp.title}
                  tag={exp.tag}
                  imageUrl={exp.imageUrl}
                  imagePosition={exp.imagePosition}
                />
              </Link>
            ))}
          </div>
        )}
        <DesktopFooter />
      </div>
    </>
  );
}
