import { useEffect, useRef, useState } from "react";
import {
  IconSearch,
  IconMapPin,
  IconGlobe,
  IconChevronDown,
  IconGrid,
  IconSpotlight,
  IconClapperboard,
} from "./icons";
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
 * 2026-10-07, a pedido de Ana ("quiero que quitemos todo escena y
 * cultura... curado mas reservados descu esta en descubrir y categorias
 * o sea escena y cultura en categorias"): en Desktop (SOLO acá — mobile
 * se queda exactamente igual, con sus 3 tabs de siempre, ver
 * CategoryTabs.tsx) los 3 botones sueltos pasan a ser 2: "Descubrir"
 * (antes "Todo", mismo destino — `onChange("Todo")`, mismo contenido de
 * Curado/Más reservados/Descubrimientos) y "Categorías", un desplegable
 * que al abrirse lista Escena/Cultura (mandó de referencia una captura de
 * otra app con ese mismo patrón — un ítem simple + un ítem con flechita
 * que despliega opciones; la referencia es solo para la ESTRUCTURA, el
 * look sigue siendo 100% Theaveling: `bg-thea-green`, mint para lo
 * seleccionado, mismos íconos ya existentes en el proyecto, `IconGrid`/
 * `IconChevronDown`, que no se usaban en ningún otro lado). No se toca
 * `CategoryTab` ni `activeCategory` — siguen siendo exactamente los
 * mismos 3 valores de siempre ("Todo"/"Escena"/"Cultura"), ni el
 * contenido condicional de `Descubrir.tsx` que depende de ellos (eso ya
 * funcionaba bien) — lo único que cambia es CÓMO se elige Escena/Cultura
 * en Desktop, no QUÉ pasa después de elegirlas. Mismo patrón
 * panel-flotante-con-`panelRef`-y-listener-de-clic-afuera que ya usan
 * Ubicación/Búsqueda/Perfil de acá mismo (ver la nota grande de más abajo
 * sobre el bug real del "doble clic" que ese patrón corrige) — se suma
 * "categorias" como cuarto valor posible de `panelAbierto`, nada de un
 * backdrop físico nuevo.
 *
 * 2026-10-07 (segunda vuelta, mismo día), a pedido de Ana: "quita
 * descubrir. ya se sabe que estamos posicionados ahi. dejemos solo
 * categorias y no en el medio, mas hacia la izq". El botón "Descubrir" de
 * la versión de arriba sobraba — el wordmark de la esquina ya cumple esa
 * función (tocarlo vuelve a "Todo", ver más arriba), así que tener
 * ADEMÁS un botón que dice lo mismo era redundante. Se saca "Descubrir" y
 * el `<nav>` que lo envolvía junto con "Categorías" (quedaba centrado
 * entre Ubicación y Búsqueda); "Categorías" se muda al grupo de la
 * izquierda, pegado a Ubicación, en vez de quedar solo en medio de la
 * barra. Sin el otro tab al lado para contrastar, el tratamiento
 * "subrayado si está activo" (`border-b-2`) ya no tenía sentido ahí —
 * pasa a ser solo cambio de color de texto (blanco si Escena/Cultura está
 * activo, 60% si no), mismo criterio que ya usa "Bogotá" al lado para
 * señalar que es clickeable sin ser literalmente un tab.
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
 * a vivir en el perfil"): "ingrese" acá quería decir "cuando inicie
 * sesión" — mientras NO hay sesión, el ícono de globo se queda en la
 * barra como siempre; solo cuando hay sesión iniciada se muda adentro del
 * panel de perfil. `IdiomaMonedaModal` sigue montado ACÁ (no se mueve a
 * DesktopPerfilDropdown) porque si viviera dentro del panel de perfil se
 * desmontaría junto con él apenas se cierra el panel para abrir el modal
 * (mismo `perfilAbierto` controlando ambos) — en vez de eso, se le pasa a
 * `DesktopPerfilDropdown` el callback `onAbrirIdiomaMoneda`
 * (`handleAbrirIdiomaMoneda` acá abajo), que cierra el panel de perfil Y
 * abre el modal en un solo paso, ambos con estado que vive acá.
 *
 * 2026-09-15, corrección a pedido de Ana ("vi que quitaste lo del
 * lenguaje y moneda de la nav, la idea era que mientras no se inicia
 * sesion este y cuando se inicia queda dentro de perfil"): la vez pasada
 * se sacó el ícono de globo de la barra SIEMPRE, sin importar si había
 * sesión o no — se leyó mal el pedido original. Ahora el botón de globo
 * vuelve a la barra (mismo lugar de antes: entre la lupa y el separador),
 * pero solo se muestra cuando `!loggedIn`; con sesión iniciada sigue sin
 * aparecer acá — se abre desde "Idioma y moneda" dentro del panel de
 * perfil, como ya quedó el 2026-09-14.
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
/*
 * CATEGORIAS_DESKTOP — 2026-10-07, a pedido de Ana ("quiero algo asi
 * cuando se abra categorias... y quiero que des una breve intro ahi en
 * cada card"): mandó de referencia una captura de otra app (2 cards con
 * degradado morado, ícono circular + título + bajada corta) pidiendo ESE
 * formato — tarjeta, no lista de texto — para Escena/Cultura dentro del
 * desplegable. El color (ver nota grande de DesktopNavbar más abajo)
 * cambia a los verdes reales de Theaveling, pero la bajada de cada card
 * SÍ es contenido real: resume las categorías de verdad que agrupa cada
 * una (`SECCIONES_ESCENA`/`SECCIONES_CULTURA`, ver data/experiences.ts),
 * no una frase inventada.
 *
 * 2026-10-08, a pedido de Ana ("encuentra iconos mejores"): los íconos de
 * entrada (`IconTicket`/`IconBookOpen`, reciclados de otro lado) no
 * leían bien. Pasan a `IconSpotlight`/`IconClapperboard` — 2 íconos
 * nuevos dibujados específicamente para esto, ver la nota grande en
 * icons.tsx para el detalle completo.
 */
const CATEGORIAS_DESKTOP: {
  tab: CategoryTab;
  Icon: typeof IconSpotlight;
  descripcion: string;
}[] = [
  {
    tab: "Escena",
    Icon: IconSpotlight,
    descripcion: "Teatro, danza, performance y música en vivo.",
  },
  {
    tab: "Cultura",
    Icon: IconClapperboard,
    descripcion: "Cine, charlas, talleres y festivales de la ciudad.",
  },
];

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
  // 2026-10-07, corrección a pedido de Ana: "le doy al panel de ubicación
  // y después le doy al panel de búsqueda... se cierra el de ubicación,
  // pero le tengo que dar otro clic más... necesito que sea instantáneo".
  // Ubicación/Búsqueda/Perfil vivían como 3 `useState<boolean>`
  // independientes, cada uno togleado con `(v) => !v)`. Cada panel monta
  // su propio backdrop invisible (`fixed inset-0`, ver
  // DesktopLocationDropdown.tsx/DesktopSearchDropdown.tsx/
  // DesktopPerfilDropdown.tsx) que cierra SU panel al detectar un clic
  // afuera — con 3 estados sueltos, clickear el ícono de Búsqueda
  // mientras Ubicación está abierto primero le pega al backdrop de
  // Ubicación (lo cierra) sin que ese mismo clic le llegue al botón de
  // Búsqueda, así que hace falta un segundo clic para que de verdad abra.
  // Se unifican los 3 en un solo estado exclusivo (cuál de los 3 paneles
  // está abierto, o ninguno): cada botón dispara `setPanelAbierto` con SU
  // propio id directamente (no un toggle sobre su propia variable), así
  // que un clic en Búsqueda siempre deja `panelAbierto === "busqueda"`
  // sin importar qué hubiera antes — cierra el que estuviera abierto y
  // abre el nuevo en el mismo clic. Clickear el mismo ícono 2 veces
  // seguidas sigue cerrando ese panel (se compara contra el valor actual).
  // Idioma/moneda (`prefsAbierto`) se deja aparte: es un modal centrado,
  // no un dropdown anclado con este mismo patrón de backdrop/toggle.
  const [panelAbierto, setPanelAbierto] = useState<
    "ubicacion" | "busqueda" | "perfil" | "categorias" | null
  >(null);

  // 2026-10-07: panel de "Categorías" (Escena/Cultura) — mismo patrón de
  // clic-afuera (listener de `mousedown` contra un `panelRef`, sin
  // backdrop físico) que ya usan los paneles de Ubicación/Búsqueda/Perfil.
  // Esos 3 viven cada uno en su propio componente, donde el efecto se
  // monta/desmonta junto con el panel (solo existe en pantalla mientras
  // está abierto). Este panel es chico (2 filas) y se arma acá mismo en
  // vez de un archivo aparte, así que se replica esa misma vida útil "a
  // mano": el efecto solo agrega el listener mientras `panelAbierto ===
  // "categorias"` (dependencia en el array de abajo), igual que si fuera
  // un componente propio que se monta y desmonta con el panel.
  const categoriasPanelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (panelAbierto !== "categorias") return;
    function handlePointerDown(e: MouseEvent) {
      if (
        categoriasPanelRef.current &&
        !categoriasPanelRef.current.contains(e.target as Node)
      ) {
        setPanelAbierto(null);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [panelAbierto]);

  // 2026-09-14, a pedido de Ana: idioma/moneda pasa a vivir dentro del
  // panel de perfil — ver la nota grande de acá arriba sobre por qué el
  // modal se queda montado acá en vez de mudarse a DesktopPerfilDropdown.
  const handleAbrirIdiomaMoneda = () => {
    setPanelAbierto(null);
    setPrefsAbierto(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white-12 bg-[rgb(1,20,20)] px-10">
      {/* 2026-10-08, a pedido de Ana ("todo este bloque correlo mas a la
          derecha"): el grupo Wordmark+Ubicación+Categorías vivía pegado
          al borde izquierdo (el `px-10` del header de arriba). Se le suma
          `ml-10` acá (otros 40px) SOLO a este grupo, no al header entero
          — así el lado derecho (búsqueda/perfil) no se mueve, solo este
          bloque se corre hacia el centro. */}
      <div className="ml-10 flex shrink-0 items-center gap-3">
        {/* 2026-09-14, a pedido de Ana ("quiero q cuando se toque
            theaveling lleve a la pantalla de todo"): mismo criterio que
            se agregó en MobileTopBar.tsx — el wordmark era solo texto
            suelto, ahora tocarlo vuelve a la pestaña "Todo" via el mismo
            `onChange` que ya usan "Categorías" de al lado. */}
        {/* 2026-10-08, a pedido de Ana ("chorre un poquito el theaveling a
            la izq"): `-translate-x-1` en vez de agrandar el `-ml-2` que ya
            tenía — un margen negativo más grande acá empujaría también a
            Ubicación/Categorías (están en el mismo flex, gap-3), que Ana
            ya había pedido separar del wordmark (ver nota de acá abajo,
            "separa un poquito a la derecha"). `translate` corre el
            wordmark nomás, visualmente, sin mover nada más de la fila. */}
        <button
          onClick={() => onChange("Todo")}
          aria-label="Ir a Todo"
          className="-translate-x-1"
        >
          <Wordmark size={38} className="-ml-2" />
        </button>
        {/* 2026-10-08, a pedido de Ana ("separa un poquito a la derecha
            bogota y categorias, o sea ese bloque, de theaveling"): Ubicación
            y Categorías vivían como hijos sueltos de este mismo flex, con el
            `gap-3` del contenedor de arriba aplicando la MISMA separación
            entre wordmark→Bogotá que entre Bogotá→Categorías. Se agrupan acá
            en su propio wrapper (mismo `gap-3` interno, para que Bogotá y
            Categorías queden exactamente como antes entre sí) con un
            `ml-3` extra — así el único espacio que crece es el de
            wordmark→bloque, sin tocar la separación entre Bogotá y
            Categorías ni mover nada del lado derecho de la barra. */}
        <div className="ml-3 flex items-center gap-3">
        {ciudad && (
          <div className="relative">
            {/* 2026-10-08, a pedido de Ana ("cuando se tocan categorias y
                ubicacion. deben verse mas blanquitos en selected"): antes
                el botón se veía EXACTAMENTE igual abierto que cerrado
                (siempre `text-white-100`, sin ninguna señal de "este es
                el que está activo ahora mismo"). Como el texto ya estaba
                en blanco al 100% (no hay un blanco "más blanco" que ese),
                la señal de seleccionado pasa a ser una píldora de fondo
                clarito detrás del ícono+texto (mismo `bg-white-12` que ya
                usan otros estados "activo" de la app) + el texto en
                semibold en vez de normal — mismo criterio en el botón de
                Categorías de al lado.
                2026-10-08 (segunda vuelta), a pedido de Ana ("que el
                selected de bogota y categorias no sea pildota si no
                recttancular rendondeado"): `rounded-full` hacía que ese
                fondo se viera como píldora (extremos 100% redondeados,
                altura chica → semicírculos a los lados). Pasa a
                `rounded-lg` — rectangular con esquinas redondeadas, mismo
                radio que ya usa el botón "Iniciar sesión" de la derecha
                (ver más abajo), en vez de la forma de píldora. */}
            <button
              onClick={() =>
                setPanelAbierto((p) => (p === "ubicacion" ? null : "ubicacion"))
              }
              className={`-mx-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-white-100 transition-colors ${
                panelAbierto === "ubicacion" ? "bg-white-12" : "hover:bg-white-8"
              }`}
            >
              <IconMapPin className="h-6 w-6" />
              {/* 2026-10-08, a pedido de Ana ("quitale el subrayado a
                  bogota"): sin `underline` — con la píldora de fondo
                  (ver nota de arriba) ya queda claro que es clickeable,
                  no hace falta el subrayado de encima. */}
              <span
                className={`font-body text-lg ${
                  panelAbierto === "ubicacion" ? "font-semibold" : "font-normal"
                }`}
              >
                {ciudad}
              </span>
            </button>
            {panelAbierto === "ubicacion" && (
              <DesktopLocationDropdown onClose={() => setPanelAbierto(null)} />
            )}
          </div>
        )}

        {/* 2026-10-07 (segunda vuelta), a pedido de Ana: "quita descubrir.
            ya se sabe que estamos posicionados ahi. dejemos solo
            categorias y no en el medio, mas hacia la izq". Primero se
            había armado como 2 botones ("Descubrir" + "Categorías") en un
            `<nav>` centrado entre Ubicación y Búsqueda (ver más abajo para
            el pedido original completo) — Ana lo simplificó: el wordmark
            ya hace de "volver a Descubrir" (ver el botón de acá arriba),
            así que ese botón sobraba. Queda SOLO "Categorías", movido del
            `<nav>` central a este mismo grupo de la izquierda (junto a
            Ubicación) en vez de quedar suelto en el medio de la barra. */}
        <div className="relative flex h-full items-center">
          {/* 2026-10-08, a pedido de Ana ("fijate en los todos de blanco
              que estas usando porque no se ven iguales. bogota con
              categorias se ve la dif"): "Categorías" bajaba a
              `text-white-60` (60% opacidad) cuando no había Escena/
              Cultura activa, mientras que "Bogotá" de al lado SIEMPRE es
              `text-white-100` — con la pestaña por defecto siendo "Todo",
              en el 99% de los casos reales se veían uno blanco pleno y el
              otro apagado, uno al lado del otro. Pasa a `text-white-100`
              fijo, igual que Ubicación — la señal de "Escena/Cultura
              activa" se mueve a un puntito mint al lado del texto (mismo
              recurso que ya usa cada card de adentro para marcar cuál
              está seleccionada) en vez de cambiar el brillo del texto.
              2026-10-08 (segunda vuelta), a pedido de Ana ("cuando se
              tocan categorias y ubicacion. deben verse mas blanquitos en
              selected"): mismo arreglo que Ubicación de al lado —
              píldora `bg-white-12` + texto semibold mientras el panel
              está abierto, en vez de verse exactamente igual abierto que
              cerrado.
              2026-10-08 (tercera vuelta), a pedido de Ana ("que el
              selected de bogota y categorias no sea pildota si no
              recttancular rendondeado"): mismo cambio que Ubicación —
              `rounded-full` → `rounded-lg`, deja de verse como píldora. */}
          <button
            onClick={() =>
              setPanelAbierto((p) => (p === "categorias" ? null : "categorias"))
            }
            className={`-mx-2 flex items-center gap-1.5 rounded-lg px-2 py-1 font-body text-lg tracking-wide text-white-100 transition-colors ${
              panelAbierto === "categorias" ? "bg-white-12" : "hover:bg-white-8"
            }`}
          >
            <IconGrid className="h-4 w-4" />
            <span
              className={
                panelAbierto === "categorias" ? "font-semibold" : "font-normal"
              }
            >
              Categorías
            </span>
            {(active === "Escena" || active === "Cultura") && (
              <span className="h-1.5 w-1.5 rounded-full bg-thea-mint" />
            )}
            <IconChevronDown
              className={`h-3 w-3 transition-transform ${
                panelAbierto === "categorias" ? "rotate-180" : ""
              }`}
            />
          </button>
          {panelAbierto === "categorias" && (
            <div
              ref={categoriasPanelRef}
              className="desktop-panel-slide-down absolute left-0 top-[calc(100%+12px)] z-50 flex gap-3"
            >
              {/* 2026-10-07: cards en vez de lista de texto — ver la nota
                  grande de `CATEGORIAS_DESKTOP` arriba del archivo para el
                  pedido completo y de dónde sale cada bajada. Fondo
                  `bg-thea-green` — el verde CLARO de los 2 verdes
                  estructurales de Theaveling (Thea Green #112c2c, más
                  claro que Verde Deep #011414 que usa el resto del chrome
                  de Desktop acá — ver STACK.md, "02 — Interaction" /
                  "Thea Green" vs "Verde Deep" para la jerarquía completa
                  de los 2). El acento mint queda SOLO en el círculo del
                  ícono (del tamaño de un "estado de interacción chico",
                  el único uso aprobado de mint para fondos — nunca la
                  card completa, ver la nota de Mint en STACK.md) — mismo
                  tratamiento mint ya usado en el avatar de las reseñas
                  (ver DetalleExperiencia.tsx). Sin stroke en la card
                  (mismo criterio ya aplicado al resto de estos paneles —
                  Ana lo pidió explícitamente para Ubicación/Búsqueda).
                  2026-10-08, a pedido de Ana ("quiero los bloques... un
                  poquito mas rectangualesy grandes, y la letra mas
                  grande"): de 210px a 260px de ancho con más padding
                  (p-5→p-6), que junto con el contenido (ícono 12/título
                  grande/descripción de 2 líneas) las deja más rectangulares
                  y grandes que la versión chica de antes, sin pasarse del
                  tamaño que pidió originalmente ("un poquito"). Título
                  text-lg→text-xl, descripción 13px→14px (`text-sm`),
                  círculo del ícono 10→12 (ícono adentro 5→6). */}
              {CATEGORIAS_DESKTOP.map(({ tab, Icon, descripcion }) => (
                <button
                  key={tab}
                  onClick={() => {
                    onChange(tab);
                    setPanelAbierto(null);
                  }}
                  className="flex w-[260px] flex-col items-start gap-4 rounded-2xl bg-thea-green p-6 text-left shadow-2xl hover:bg-white-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-thea-mint/30 bg-thea-mint/15 text-thea-mint">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span
                      className={`flex items-center gap-2 font-body text-xl font-semibold ${
                        active === tab ? "text-thea-mint" : "text-white-100"
                      }`}
                    >
                      {tab}
                      {active === tab && (
                        <span className="h-1.5 w-1.5 rounded-full bg-thea-mint" />
                      )}
                    </span>
                    {/* 2026-10-08, a pedido de Ana ("quiero que la desc de
                        las cards de categoria estan igual de grade al
                        titulo de cada card pero en thin"): la bajada pasa
                        de `text-sm` (14px) a `text-xl` (mismo tamaño que el
                        título de arriba, `font-semibold` ese) pero con
                        `font-thin` en vez de semibold — mismo tamaño,
                        mucho más liviano, para que siga leyéndose como
                        texto secundario sin ser literalmente más chico. */}
                    <span className="font-body text-xl font-thin text-white-60">
                      {descripcion}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* 2026-10-08, a pedido de Ana ("tira busqueda y foto de usuario un
          poquito a la derecha" → corrección inmediata, "PERDON, ME
          EQUIVOQUE, ERA HACIA LA IZQ"): mismo recurso que el wordmark de
          arriba (`translate-x`, no margin) — nudge chico de todo el grupo
          derecho (búsqueda/globo/separador/perfil) hacia el centro, sin
          tocar el `gap-6` interno entre ellos ni la posición del bloque
          izquierdo. Mover solo búsqueda y la foto (salteando globo/
          separador) habría dejado los espacios entre los 4 disparejos.
          `translate-x-1` (derecha) → `-translate-x-1` (izquierda). */}
      <div className="flex shrink-0 -translate-x-1 items-center gap-6">
        <div className="relative">
          <button
            onClick={() =>
              setPanelAbierto((p) => (p === "busqueda" ? null : "busqueda"))
            }
            aria-label="Buscar experiencia"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
          >
            <IconSearch className="h-5 w-5" />
          </button>
          {panelAbierto === "busqueda" && (
            <DesktopSearchDropdown onClose={() => setPanelAbierto(null)} />
          )}
        </div>

        {/* Idioma/moneda — 2026-09-15, ver la nota grande de arriba: solo
            visible sin sesión iniciada. Con sesión, este mismo modal se
            abre desde "Idioma y moneda" en el panel de perfil. */}
        {!loggedIn && (
          <button
            onClick={() => setPrefsAbierto(true)}
            aria-label="Idioma y moneda"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
          >
            <IconGlobe className="h-5 w-5" />
          </button>
        )}

        <div className="h-5 w-px bg-white-20" />

        {loggedIn ? (
          <div className="relative">
            <button
              onClick={() =>
                setPanelAbierto((p) => (p === "perfil" ? null : "perfil"))
              }
              className="flex items-center"
            >
              {/* 2026-10-08, a pedido de Ana ("a la foto circular del
                  perfil no le pongas bordem solo la foto"): sin
                  `border border-white-100` — queda solo la foto recortada
                  en círculo, sin aro blanco alrededor.
                  2026-10-08 (segunda vuelta), a pedido de Ana ("quita el
                  elena voss y pon el circulo de perfil la foto un pelin
                  mas grande"): se saca el nombre de al lado — queda solo
                  la foto (mismo criterio minimalista que ya se usó para
                  sacar "Descubrir" de la navbar, el ícono solo ya
                  identifica la acción). El `gap-2.5` del botón también se
                  saca porque ya no hay un segundo elemento con el que
                  dejar espacio. Foto: h-8 w-8 (32px) → h-9 w-9 (36px), un
                  escalón nomás ("un pelin"), mismo criterio de ajustes
                  chicos ya usado en Ubicación ("un poco mas grande, un
                  poco no mas"). */}
              <img
                src="/assets/images/elena-avatar.jpg"
                alt="Elena Voss"
                className="h-9 w-9 rounded-full object-cover"
              />
            </button>
            {panelAbierto === "perfil" && (
              <DesktopPerfilDropdown
                onClose={() => setPanelAbierto(null)}
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
