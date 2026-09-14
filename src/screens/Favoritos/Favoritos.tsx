import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import SupportingCard from "../../components/cards/SupportingCard";
import { IconHeart } from "../../components/icons";
import { useFavorites } from "../../context/FavoritesContext";
import { useDescubrirTab } from "../../context/DescubrirTabContext";
import { getExperienceById } from "../../data/experiences";

/*
 * Favoritos (Desktop) — 2026-09-14, a pedido de Ana: mandó una referencia
 * real (Fever, "feverup.com/es/favorites") pidiendo "ref de como tiene
 * que ser la pantalla de fav, vamos". Hasta acá "Favoritos" en el panel
 * de perfil de Desktop (`DesktopPerfilDropdown.tsx`) enlazaba a `/perfil`
 * (la pantalla de mobile, que sí tiene una sección Favoritos, un riel
 * horizontal) — con esta referencia, Ana pide una pantalla PROPIA de
 * Desktop, no seguir reusando la de mobile. Esta es esa pantalla nueva,
 * ruta `/favoritos`.
 *
 * Estructura tomada de la referencia: breadcrumb "< Favoritos" (caret +
 * título en una sola línea, no un `<h1>` grande aparte) y, si no hay
 * favoritos, un estado vacío con ícono + título + texto + botón para
 * seguir explorando. La referencia usa una ilustración propia de Fever
 * (una persona con un corazón) — no se recrea ese dibujo (no hay ese
 * asset en Theaveling y sería inventar una pieza de marca que no existe);
 * en su lugar, mismo criterio ya usado en los estados vacíos de
 * Perfil.tsx/Reservas.tsx: un círculo con el ícono correspondiente
 * (`IconHeart` acá).
 *
 * Con favoritos — la referencia no muestra ese estado (solo el vacío),
 * así que se arma con el mismo criterio del resto de la app: la MISMA
 * card que ya usa Favoritos en mobile (`SupportingCard`, variante
 * default — ver Perfil.tsx) en una grilla, no una card nueva ni la
 * grilla de "Ver más" (`ExperienceCardContenidoCompleto`, pensada para
 * el catálogo completo de una sección, no para "lo que guardaste").
 *
 * Sin versión mobile — no se construye una pantalla de mobile para esta
 * ruta (Favoritos en mobile sigue viviendo dentro de Perfil.tsx, sin
 * tocar). Si alguien llega a `/favoritos` en mobile (por ejemplo,
 * escribiendo la URL a mano), se redirige a `/perfil` en vez de mostrar
 * una pantalla en blanco.
 *
 * Login — esta ruta solo es alcanzable desde el panel de perfil de
 * Desktop, que ya está detrás de sesión iniciada (el panel no aparece
 * sin `loggedIn`, ver DesktopNavbar.tsx) — no hace falta un gate propio
 * acá.
 */
export default function Favoritos() {
  const navigate = useNavigate();
  const { favoritos } = useFavorites();
  const { activeCategory, setActiveCategory } = useDescubrirTab();

  const experienciasFavoritas = favoritos
    .map((id) => getExperienceById(id))
    .filter((exp): exp is NonNullable<typeof exp> => exp !== undefined);

  return (
    <>
      {/* Sin pantalla de mobile para esta ruta — ver nota grande arriba.
          Redirige a /perfil, donde mobile sí tiene Favoritos. */}
      <MobileRedirect />

      <div className="hidden bg-[rgb(1,20,20)] text-white-100 font-body lg:block">
        <DesktopNavbar
          active={activeCategory}
          onChange={(tab) => {
            setActiveCategory(tab);
            navigate("/");
          }}
        />

        <div className="mx-auto max-w-[1440px] px-20 pt-16 pb-20">
          {/* 2026-09-14 (sexta vuelta), a pedido de Ana: en Desktop el
              título ya NO es un botón de "volver" con flecha — "no es
              necesario en desktop" (la navbar siempre está arriba para ir
              a cualquier lado, a diferencia de mobile que sí depende del
              back). Queda como texto plano, mismo criterio aplicado acá y
              en Reservas.tsx/DatosDeCuenta.tsx. */}
          <h1 className="mb-10 font-display text-3xl text-white-100">
            Favoritos
          </h1>

          {experienciasFavoritas.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white-8">
                <IconHeart className="h-7 w-7 text-white-60" />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl text-white-100">
                  Guarda las experiencias que más te gustan en un solo lugar.
                </h2>
                <p className="mx-auto max-w-[420px] font-body text-[15px] text-white-60">
                  Explora el catálogo y toca el corazón de cualquier
                  experiencia para guardarla acá.
                </p>
              </div>
              <Link
                to="/"
                className="rounded-xl bg-thea-mint px-6 py-3 font-display text-sm font-semibold text-thea-green"
              >
                Seguir descubriendo
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 font-body text-[13px] text-white-60">
                {experienciasFavoritas.length}{" "}
                {experienciasFavoritas.length === 1 ? "experiencia" : "experiencias"}
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,165px)] gap-6">
                {experienciasFavoritas.map((exp) => (
                  <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                    <SupportingCard
                      id={exp.id}
                      tag={exp.tag}
                      title={exp.title}
                      venue={exp.venue}
                      city={exp.city}
                      imageUrl={exp.imageUrl}
                    />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <DesktopFooter />
      </div>
    </>
  );
}

// Componente separado (no un simple `<Navigate>`) para no redirigir en
// Desktop: revisa el mismo breakpoint `lg` (1024px) que ya usa el resto
// de la app (ver esDesktop() en router.tsx) ANTES de navegar, y lo hace
// dentro de un efecto (nunca durante el render) para no disparar un
// "Cannot update a component while rendering a different component".
function MobileRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    navigate("/perfil", { replace: true });
  }, [navigate]);
  return null;
}
