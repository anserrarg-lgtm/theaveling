import { useState } from "react";
import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import Descubrir from "./screens/Descubrir/Descubrir";
import Onboarding from "./screens/Onboarding/Onboarding";
import DetalleExperiencia from "./screens/DetalleExperiencia/DetalleExperiencia";
import Compra from "./screens/Compra/Compra";
import Confirmacion from "./screens/Confirmacion/Confirmacion";
import Reservas from "./screens/Reservas/Reservas";
import Perfil from "./screens/Perfil/Perfil";
import Notificaciones from "./screens/Perfil/Notificaciones";
import DatosDeCuenta from "./screens/Perfil/DatosDeCuenta";
import Ayuda from "./screens/Perfil/Ayuda";
import Busqueda from "./screens/Busqueda/Busqueda";

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
    <>
      <ScrollRestoration />
      <Outlet />
    </>
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

function Root() {
  const [onboarded, setOnboarded] = useState(leerOnboarded);

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
      { path: "/busqueda", element: <Busqueda /> },
    ],
  },
]);
