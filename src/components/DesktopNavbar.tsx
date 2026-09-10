import { useState } from "react";
import { Link } from "react-router-dom";
import { IconSearch, IconMapPin, IconGlobe } from "./icons";
import Wordmark from "./Wordmark";
import IdiomaMonedaModal from "./IdiomaMonedaModal";
import { useCiudad } from "../context/CiudadContext";
import { useAuth } from "../context/AuthContext";
import type { CategoryTab } from "./CategoryTabs";

/*
 * DesktopNavbar — 2026-09-08, primer componente de Theaveling Desktop.
 * Nodo real de Figma `desktop-navbar` (`1546:147`), dentro de "02 —
 * Components" del archivo Prototipo final, traído vía get_design_context
 * a pedido de Ana ("empezamos con lo mismo que empezamos mobile thea" —
 * o sea, calcar el diseño real, no inventar la barra).
 *
 * Fondo — 2026-09-08, a pedido de Ana ("no debe ir en blanco"): el nodo
 * de Figma traía esta navbar con fondo claro (`off-white`), pero contra
 * el resto de Theaveling (mobile pasó TODO su chrome a fondo oscuro
 * `thea-deep`/`thea-green`, ver Reservas.tsx/MobileTopBar.tsx) se veía
 * como una pantalla en blanco/sin terminar. Se cambia a `bg-thea-deep`
 * (mismo tono que `MobileTopBar`/`MobileBottomNav`) y los textos/íconos
 * pasan de la escala `green-*` (pensada para texto sobre fondo claro) a
 * `white-*`, mismo criterio ya usado en Reservas.tsx para su botón
 * "Iniciar sesión" sobre fondo oscuro (`bg-white-100 text-thea-green`).
 *
 * Wordmark — 2026-09-08, a pedido de Ana ("theaveling debe estar mas
 * grande"): sube de 22px (default de `Wordmark`, pensado para la Top Bar
 * angosta de mobile) a 30px, proporcional a esta barra mucho más alta
 * (h-20/80px vs 56px en mobile).
 *
 * Ciudad — reusa `CiudadContext` (mismo que `LocationIndicator`en
 * mobile), no un texto fijo "Bogotá": si el día de mañana la ciudad
 * cambia, la navbar la sigue.
 *
 * Búsqueda — el input de Figma es visual (`Buscar experiencia...`,
 * `Input Field` sin lógica propia); acá es un `<Link>` real a
 * `/busqueda` (la misma pantalla de mobile, que ya funciona) en vez de
 * un input que no hace nada — mismo criterio de "no dejar espacio
 * muerto" que ya se aplicó a los demás botones sin destino de esta
 * sesión (Compartir, Más Curados, Festivales).
 *
 * Tabs Todo/Escena/Cultura — mismas 3 categorías que `CategoryTabs.tsx`
 * (mobile), pasadas como prop desde `Descubrir.tsx` para que ambas
 * versiones (mobile y desktop) compartan el mismo estado `activeCategory`
 * en vez de tener cada una la suya.
 *
 * Usuario — mismo contenido "primera pasada" ya establecido en
 * Perfil.tsx: nombre "Elena Voss" + `/assets/images/elena-avatar.jpg`
 * cuando hay sesión (no se inventa un usuario nuevo para Desktop), botón
 * "Iniciar sesión" real (`requireAuth`) cuando no la hay.
 */
export default function DesktopNavbar({
  active,
  onChange,
}: {
  active: CategoryTab;
  onChange: (tab: CategoryTab) => void;
}) {
  const { ciudad } = useCiudad();
  const { loggedIn, requireAuth } = useAuth();
  // 2026-09-09, a pedido de Ana: ícono de idioma/moneda — ver
  // IdiomaMonedaModal.tsx para el detalle completo (comparte datos y
  // storage con Perfil.tsx, no es una preferencia aparte).
  const [prefsAbierto, setPrefsAbierto] = useState(false);

  const tabs: CategoryTab[] = ["Todo", "Escena", "Cultura"];

  return (
    <>
      <header className="sticky top-0 z-10 flex h-20 w-full items-center justify-between border-b border-white-12 bg-thea-deep px-10">
      <div className="flex shrink-0 items-center gap-3">
        <Wordmark size={38} className="-ml-2" />
        {ciudad && (
          <span className="flex items-center gap-1.5 text-white-100">
            <IconMapPin className="h-5 w-5" />
            <span className="font-body text-base underline">{ciudad}</span>
          </span>
        )}
      </div>

      <nav className="flex h-full shrink-0 items-center gap-12">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`flex h-full items-center px-1 font-body text-lg tracking-wide ${
              active === tab
                ? "border-b-2 border-white-100 font-normal text-white-100"
                : "font-normal text-white-60"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-6">
        <Link
          to="/busqueda"
          className="flex h-10 w-[200px] items-center gap-2 rounded-xl bg-white-8 px-4"
        >
          <IconSearch className="h-4 w-4 text-white-60" />
          <span className="font-body text-[15px] text-white-60">
            Buscar experiencia...
          </span>
        </Link>

        <button
          onClick={() => setPrefsAbierto(true)}
          aria-label="Idioma y moneda"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
        >
          <IconGlobe className="h-5 w-5" />
        </button>

        <div className="h-5 w-px bg-white-20" />

        {loggedIn ? (
          <Link to="/perfil" className="flex items-center gap-2.5">
            <span className="font-body text-[13px] font-medium text-white-100">
              Elena Voss
            </span>
            <img
              src="/assets/images/elena-avatar.jpg"
              alt="Elena Voss"
              className="h-8 w-8 rounded-full border border-white-100 object-cover"
            />
          </Link>
        ) : (
          <button
            onClick={() =>
              requireAuth("Inicia sesión para reservar y guardar favoritos.", () => {})
            }
            className="rounded-lg bg-white-100 px-5 py-2.5 font-body text-base font-semibold text-thea-green"
          >
            Iniciar sesión
          </button>
        )}
      </div>
      </header>

      <IdiomaMonedaModal
        open={prefsAbierto}
        onClose={() => setPrefsAbierto(false)}
      />
    </>
  );
}
