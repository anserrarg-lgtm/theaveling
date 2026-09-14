import { useState } from "react";
import { IconSearch, IconMapPin } from "./icons";
import Wordmark from "./Wordmark";
import IdiomaMonedaModal from "./IdiomaMonedaModal";
import DesktopSearchDropdown from "./DesktopSearchDropdown";
import DesktopLocationDropdown from "./DesktopLocationDropdown";
import DesktopPerfilDropdown from "./DesktopPerfilDropdown";
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
 * Fondo sólido — 2026-09-11, a pedido de Ana ("el header, donde está
 * todo eso, búsqueda, ubicación, lo del lenguaje, el iniciar sesión...
 * ahí eso está transparente, lo quiero en sólido"): pasa de `bg-thea-deep`
 * (95% opaco) a `bg-[rgb(1,20,20)]` sólido — mismo criterio que ya se usa
 * en el resto del chrome sin foto detrás (Reservas.tsx/Perfil.tsx/
 * Busqueda.tsx/el fondo de este mismo Desktop más abajo).
 *
 * 2026-09-11, a pedido de Ana ("la ubicacion no es clickeable"): esta
 * fila quedó como texto suelto cuando se armó la navbar — nunca se
 * conectó a nada. Pasa a ser un botón que abre `DesktopLocationDropdown`
 * (panel flotante, mismo criterio que la lupa de al lado — "vamos con
 * esa extension"). Ícono y texto también suben un toque de tamaño acá
 * (a pedido de Ana: "un poco mas grande, un poco no mas") — h-5→h-6 y
 * text-base→text-lg, un solo escalón cada uno, no un cambio grande.
 *
 * Búsqueda — el input de Figma es visual (`Buscar experiencia...`,
 * `Input Field` sin lógica propia); acá es un `<Link>` real a
 * `/busqueda` (la misma pantalla de mobile, que ya funciona) en vez de
 * un input que no hace nada — mismo criterio de "no dejar espacio
 * muerto" que ya se aplicó a los demás botones sin destino de esta
 * sesión (Compartir, Más Curados, Festivales).
 *
 * 2026-09-10, a pedido de Ana ("que no le pongamos barra visible a la
 * búsqueda, que sea el ícono"): se quita la barra completa (fondo,
 * ancho fijo, texto placeholder) y queda solo el ícono de lupa, mismo
 * tratamiento que el botón de idioma/moneda de al lado (círculo
 * h-10 w-10, sin fondo hasta hacer hover). En ese momento seguía siendo
 * un `<Link>` real a `/busqueda` (pantalla completa) — ver la nota de
 * abajo, 2026-09-11, sobre por qué eso cambió.
 *
 * 2026-09-11, a pedido de Ana: la búsqueda de Desktop se había armado
 * como pantalla propia (`/busqueda` con `hidden lg:block`, ver
 * Busqueda.tsx) y Ana la rechazó — "no pero no puede ser una pantalla
 * aparte, tiene que ser una extencion". El ícono de lupa deja de ser un
 * `<Link>` (ya no navega a ningún lado) y pasa a ser un botón que abre
 * `DesktopSearchDropdown` — un panel flotante anclado acá mismo, debajo
 * del ícono, sin salir de la pantalla en la que se está. Ver la nota
 * grande de ese componente para el detalle completo (por qué tiene su
 * propia copia de la lógica de búsqueda en vez de reusar Busqueda.tsx —
 * Ana fue explícita en no tocar nada de mobile).
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
 *
 * 2026-09-14, a pedido de Ana ("ahora vamos a lo de perfil, debe ser
 * tambien un bloque flotante... y devemos agregar favoritos y el bloque
 * de reservas"): el avatar+nombre deja de ser un `<Link to="/perfil">`
 * directo y pasa a abrir `DesktopPerfilDropdown` — mismo patrón
 * toggle+panel que ya usan ubicación/búsqueda de acá arriba (variante
 * `desktop-panel-slide-right` porque este trigger es el más a la derecha
 * de la navbar). Ver ese componente para el detalle completo del
 * contenido nuevo (Favoritos/Mis reservas/Salir).
 *
 * 2026-09-14 (segunda vuelta), a pedido de Ana ("cuando el usuario
 * ingrese la opcion de moneda y lenguaje que esta en la barra debe pasar
 * a vivir en el perfil"): el ícono de globo suelto (entre la lupa y el
 * separador) se saca de acá — ya no vive como botón propio de la navbar.
 * `IdiomaMonedaModal` sigue montado ACÁ (no se mueve a
 * DesktopPerfilDropdown) porque si viviera dentro del panel de perfil se
 * desmontaría junto con él apenas se cierra el panel para abrir el modal
 * (mismo `perfilAbierto` controlando ambos) — en vez de eso, se le pasa a
 * `DesktopPerfilDropdown` el callback `onAbrirIdiomaMoneda`
 * (`handleAbrirIdiomaMoneda` acá abajo), que cierra el panel de perfil Y
 * abre el modal en un solo paso, ambos con estado que vive acá.
 *
 * z-index del header: 2026-09-14 (quinta vuelta), Ana reportó con captura
 * que al abrir el panel de perfil, la flechita circular del riel de
 * "Más reservados"/"Descubrimientos" (`RailNavButtons` en Descubrir.tsx)
 * se veía ENCIMA del panel en vez de quedar tapada. Causa: `<header>` es
 * `sticky` + tenía `z-10` — eso crea su propio contexto de apilamiento, así
 * que TODO lo de adentro (incluido el panel flotante con `z-50`) queda
 * "encapsulado" a nivel z-10 hacia afuera. Como esas flechas (y el hover
 * de las cards de los rieles, `ExperienceCardGridDesktop`/
 * `ExperienceCardCuradoGridDesktop`) también usan z-10/z-20 pero viven
 * FUERA de este header, en un empate de z-index gana el que aparece
 * después en el HTML — el contenido de la página, no la navbar. Se sube
 * el header a `z-30` (por encima de cualquier z-index que ya use el resto
 * del contenido de la página, que no pasa de z-20) para que el header Y
 * todo lo que abre desde él (búsqueda/ubicación/perfil) queden siempre por
 * encima, sin tocar los z-index de esos otros elementos.
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
  // 2026-09-11, a pedido de Ana: el panel de búsqueda de Desktop —
  // ver DesktopSearchDropdown.tsx y la nota grande de acá arriba.
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  // 2026-09-11, a pedido de Ana: el panel de ciudad de Desktop — ver
  // DesktopLocationDropdown.tsx y la nota grande de acá arriba.
  const [ubicacionAbierta, setUbicacionAbierta] = useState(false);
  // 2026-09-14, a pedido de Ana: el panel de perfil de Desktop — ver
  // DesktopPerfilDropdown.tsx y la nota grande de acá arriba.
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  const tabs: CategoryTab[] = ["Todo", "Escena", "Cultura"];

  // 2026-09-14, a pedido de Ana: idioma/moneda pasa a vivir dentro del
  // panel de perfil — ver la nota grande de acá arriba sobre por qué el
  // modal se queda montado acá en vez de mudarse a DesktopPerfilDropdown.
  const handleAbrirIdiomaMoneda = () => {
    setPerfilAbierto(false);
    setPrefsAbierto(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white-12 bg-[rgb(1,20,20)] px-10">
      <div className="flex shrink-0 items-center gap-3">
        {/* 2026-09-14, a pedido de Ana ("quiero q cuando se toque
            theaveling lleve a la pantalla de todo"): mismo criterio que
            se agregó en MobileTopBar.tsx — el wordmark era solo texto
            suelto, ahora tocarlo vuelve a la pestaña "Todo" via el mismo
            `onChange` que ya usan los tabs de al lado. */}
        <button onClick={() => onChange("Todo")} aria-label="Ir a Todo">
          <Wordmark size={38} className="-ml-2" />
        </button>
        {ciudad && (
          <div className="relative">
            <button
              onClick={() => setUbicacionAbierta((v) => !v)}
              className="flex items-center gap-1.5 text-white-100"
            >
              <IconMapPin className="h-6 w-6" />
              <span className="font-body text-lg underline">{ciudad}</span>
            </button>
            {ubicacionAbierta && (
              <DesktopLocationDropdown onClose={() => setUbicacionAbierta(false)} />
            )}
          </div>
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
        <div className="relative">
          <button
            onClick={() => setBusquedaAbierta((v) => !v)}
            aria-label="Buscar experiencia"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
          >
            <IconSearch className="h-5 w-5" />
          </button>
          {busquedaAbierta && (
            <DesktopSearchDropdown onClose={() => setBusquedaAbierta(false)} />
          )}
        </div>

        <div className="h-5 w-px bg-white-20" />

        {loggedIn ? (
          <div className="relative">
            <button
              onClick={() => setPerfilAbierto((v) => !v)}
              className="flex items-center gap-2.5"
            >
              <span className="font-body text-[13px] font-medium text-white-100">
                Elena Voss
              </span>
              <img
                src="/assets/images/elena-avatar.jpg"
                alt="Elena Voss"
                className="h-8 w-8 rounded-full border border-white-100 object-cover"
              />
            </button>
            {perfilAbierto && (
              <DesktopPerfilDropdown
                onClose={() => setPerfilAbierto(false)}
                onAbrirIdiomaMoneda={handleAbrirIdiomaMoneda}
              />
            )}
          </div>
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
