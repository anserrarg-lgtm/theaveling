import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CiudadProvider } from "./context/CiudadContext";
import { AuthProvider } from "./context/AuthContext";
import { ReservationsProvider } from "./context/ReservationsContext";
import InstalarApp from "./screens/InstalarApp/InstalarApp";

/*
 * Corregido 2026-08-31 (segunda vuelta): sin tope de ancho. Las pantallas
 * están armadas mobile-first con clases fluidas (w-full, px-5, flex) — no
 * hay ningún ancho fijo en píxeles en los contenedores reales (ver
 * Descubrir.tsx, MobileTopBar.tsx, etc: todo es w-full/flex, "390" solo
 * aparece en comentarios como referencia del valor verificado en Figma).
 * Por eso el wrapper ya no necesita — ni debe — poner un `max-w`: en un
 * celular real de cualquier ancho (360, 390, 428, 500+) el layout debe
 * llenar la pantalla completa, igual que una app nativa. Un `max-w-[390px]`
 * dejaba franjas vacías (letterbox) en celulares más anchos que 390px, que
 * es exactamente lo que no se quería.
 *
 * En escritorio (donde no hay "ancho de celular real"), esto ahora estira
 * el contenido a todo el ancho de la ventana — visualmente distinto a un
 * marco de teléfono centrado, pero es el comportamiento correcto para un
 * producto mobile-only: usar el modo celular de Chrome (DevTools →
 * Toggle device toolbar) para verlo como se vería en un teléfono real.
 * Sacar este wrapper cuando se arme la versión responsive/desktop real.
 *
 * Corregido 2026-09-01: se sacó `transform: translateZ(0)` de acá. Ese
 * truco existía para que los elementos `fixed` (headers, bottom nav)
 * quedaran anclados al ancho del marco de teléfono en vez del ancho
 * real del navegador — pero un `transform` en un ancestro también
 * cambia el comportamiento de `position: fixed` en sus hijos: en vez de
 * anclarse a la pantalla visible (viewport), se ancla al alto TOTAL de
 * ese contenedor transformado — que, al ser más alto que la pantalla en
 * cuanto la página tiene scroll, hacía que el Bottom Nav quedara pegado
 * al final de todo el contenido en vez de quedarse fijo abajo mientras
 * se scrollea (había que scrollear hasta el final para verlo). Ahora
 * que ya no hay marco de ancho fijo (ver corrección de arriba), no hace
 * falta ese contenedor especial: `fixed` vuelve a anclarse al viewport
 * real del navegador/celular, que es el comportamiento correcto.
 */
export default function App() {
  // 2026-09-07: pantalla previa "Descargar / Ver en línea" — ver
  // InstalarApp.tsx para el detalle completo. Se salta directo si la
  // app ya se abrió instalada (`display-mode: standalone`): a alguien
  // que ya la instaló no tiene sentido pedirle instalarla de nuevo.
  const [mostrarInstalar, setMostrarInstalar] = useState(
    () => !window.matchMedia("(display-mode: standalone)").matches,
  );

  if (mostrarInstalar) {
    return <InstalarApp onContinuar={() => setMostrarInstalar(false)} />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* 2026-09-03: FavoritesProvider acá arriba, sobre el router — así
          Descubrir, Detalle y Perfil comparten el mismo estado de
          favoritos sin importar por qué ruta se entre. Ver
          context/FavoritesContext.tsx.

          2026-09-06: se suman CiudadProvider (ciudad detectada/elegida,
          compartida entre Onboarding y LocationSheet) y AuthProvider
          (login falso + LoginSheet montado una sola vez acá arriba, ver
          ese archivo). CiudadProvider va ANTES que el router porque
          Onboarding.tsx —que vive dentro del router, ver Root en
          router.tsx— necesita leer/escribir esa ciudad. AuthProvider
          puede ir en cualquier orden relativo a los otros 2 (no depende
          de ninguno), se deja afuera de todo por prolijidad. */}
      <AuthProvider>
        <CiudadProvider>
          <FavoritesProvider>
            {/* 2026-09-07: ReservationsProvider — mismo criterio que
                Favorites/Ciudad, ver context/ReservationsContext.tsx.
                Reservas.tsx ya no arranca con datos de ejemplo, lee de
                acá; Compra.tsx escribe acá cuando se confirma un pago
                real. */}
            <ReservationsProvider>
              <RouterProvider router={router} />
            </ReservationsProvider>
          </FavoritesProvider>
        </CiudadProvider>
      </AuthProvider>
    </div>
  );
}
