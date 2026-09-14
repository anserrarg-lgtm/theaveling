import { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import Descubrir from "./screens/Descubrir/Descubrir";
import Onboarding from "./screens/Onboarding/Onboarding";
import { useCiudad } from "./context/CiudadContext";
import DetalleExperiencia from "./screens/DetalleExperiencia/DetalleExperiencia";
import Compra from "./screens/Compra/Compra";
import Confirmacion from "./screens/Confirmacion/Confirmacion";
import Reservas from "./screens/Reservas/Reservas";
import Perfil from "./screens/Perfil/Perfil";
import Notificaciones from "./screens/Perfil/Notificaciones";
import DatosDeCuenta from "./screens/Perfil/DatosDeCuenta";
import Ayuda from "./screens/Perfil/Ayuda";
import Favoritos from "./screens/Favoritos/Favoritos";
import Busqueda from "./screens/Busqueda/Busqueda";
import VerMas from "./screens/VerMas/VerMas";
import Legal from "./screens/Legal/Legal";
import { DescubrirTabProvider } from "./context/DescubrirTabContext";

/*
 * Layout raíz — 2026-09-03, a pedido de Ana: al entrar a Detalle (o
 * cualquier pantalla) desde otra, el scroll heredaba la posición de la
 * pantalla anterior en vez de arrancar arriba (`createBrowserRouter` no
 * resetea el scroll solo). `<ScrollRestoration />` es el componente
 * oficial de react-router para esto — pero solo funciona si vive DENTRO
 * del árbol enrutado, así que las rutas ahora cuelgan de este layout raíz
 * en vez de ser todas de primer nivel. No cambia nada visual: `Layout`
 * es invisible, solo envuelve con `<Outlet />` donde antes iba cada
 * pantalla directo.
 */
function Layout() {
  return (
    <DescubrirTabProvider>
      <ScrollRestoration />
      <Outlet />
    </DescubrirTabProvider>
  );
}

/*
 * Root — 2026-09-06: gate de Onboarding en "/". No es una ruta nueva
 * (no hay "/onboarding" en la URL) — Onboarding.tsx es un flujo lineal
 * de una sola vez que vive dentro de este mismo componente raíz, mismo
 * criterio de "estado, no ruta" que se explica en la nota grande de
 * Onboarding.tsx. `localStorage("theaveling:onboarded")` decide qué
 * mostrar: la primera vez que alguien entra ve Splash → Bienvenida →
 * geo → Home; después de eso (o si recarga la página a mitad de sesión)
 * entra directo a Descubrir, sin repetir el flujo.
 *
 * El flag se escribe recién cuando `Onboarding` llama a `onFinish` (es
 * decir, cuando `CiudadContext` ya tiene una ciudad real) — si alguien
 * cierra la pestaña a la mitad del Onboarding, la próxima vez lo retoma
 * desde el principio en vez de quedar en un estado a medias.
 */
const ONBOARDED_KEY = "theaveling:onboarded";

function leerOnboarded(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDED_KEY) === "true";
  } catch {
    return false;
  }
}

// 2026-09-11, a pedido de Ana ("en desktop esta apareciendo el
// onboarding, no deberia ser asi"): Onboarding (Splash → Bienvenida →
// pedir ubicación → elegir ciudad a mano) es un flujo pensado para
// celular — en Desktop no tiene sentido, mismo criterio que ya se usa en
// App.tsx para saltar la pantalla de "Descargar / Ver en línea"
// (`esDesktop`, mismo breakpoint `lg` de 1024px que usa Descubrir.tsx).
function esDesktop(): boolean {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function Root() {
  // En Desktop arranca directo como si ya estuviera onboarded — se
  // calcula UNA vez acá (no en un useEffect) para que no llegue a
  // pintarse ni un frame de Onboarding antes de saltarlo.
  const [onboarded, setOnboarded] = useState(() => leerOnboarded() || esDesktop());
  const { ciudad, setCiudad } = useCiudad();

  useEffect(() => {
    // Si el salto fue por Desktop (no porque ya viniera onboarded de
    // antes), dejamos todo consistente: se guarda el flag para que no
    // vuelva a evaluarse, y si todavía no hay ciudad elegida (nadie pasó
    // por "elegir ciudad a mano") se le pone "Bogotá"/manual como default
    // razonable — mismo default que ya usa Busqueda.tsx cuando `ciudad`
    // es null, para que el selector de ciudad de DesktopNavbar no quede
    // vacío.
    if (!leerOnboarded() && esDesktop()) {
      if (!ciudad) setCiudad("Bogotá", "manual");
      try {
        window.localStorage.setItem(ONBOARDED_KEY, "true");
      } catch {
        // localStorage puede fallar (modo privado, cuota) — no rompe nada,
        // ya arrancamos con `onboarded=true` en memoria para esta sesión.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!onboarded) {
    return (
      <Onboarding
        onFinish={() => {
          try {
            window.localStorage.setItem(ONBOARDED_KEY, "true");
          } catch {
            // localStorage puede fallar (modo privado, cuota) — igual
            // avanzamos a Home con el estado en memoria de este render.
          }
          setOnboarded(true);
        }}
      />
    );
  }

  return <Descubrir />;
}

/*
 * Rutas del flujo principal (orden de construcción elegido con Ana,
 * 2026-08-31): Descubrir → Detalle de experiencia → Compra → Confirmación.
 * Reservas/Perfil son placeholders mínimos, agregados porque el Bottom
 * Nav de Descubrir ya enlaza a ellos. Onboarding — ver `Root` arriba y
 * Onboarding.tsx. Login — ver AuthContext.tsx (contextual, sin ruta
 * propia, ver ese archivo para el porqué).
 */
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Root /> },
      { path: "/experiencia/:id", element: <DetalleExperiencia /> },
      { path: "/experiencia/:id/compra", element: <Compra /> },
      { path: "/experiencia/:id/confirmacion", element: <Confirmacion /> },
      { path: "/reservas", element: <Reservas /> },
      { path: "/perfil", element: <Perfil /> },
      { path: "/perfil/notificaciones", element: <Notificaciones /> },
      { path: "/perfil/datos-de-cuenta", element: <DatosDeCuenta /> },
      { path: "/perfil/ayuda", element: <Ayuda /> },
      // 2026-09-14, a pedido de Ana: pantalla propia de Favoritos para
      // Desktop (ref real de Fever) — ver Favoritos.tsx.
      { path: "/favoritos", element: <Favoritos /> },
      { path: "/busqueda", element: <Busqueda /> },
      { path: "/ver-mas/:slug", element: <VerMas /> },
      // 2026-09-11, a pedido de Ana: destinos del footer de Desktop (ver
      // DesktopFooter.tsx/Legal.tsx para el detalle completo).
      { path: "/terminos", element: <Legal /> },
      { path: "/privacidad", element: <Legal /> },
      { path: "/cookies", element: <Legal /> },
    ],
  },
]);
