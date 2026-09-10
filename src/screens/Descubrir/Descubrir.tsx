import { useState } from "react";
import { Link } from "react-router-dom";
import MobileTopBar from "../../components/MobileTopBar";
import CategoryTabs, { type CategoryTab } from "../../components/CategoryTabs";
import DesktopNavbar from "../../components/DesktopNavbar";
import LocationSheet from "../../components/LocationSheet";
import MobileBottomNav from "../../components/MobileBottomNav";
import ExperienceCardCurado from "../../components/cards/ExperienceCardCurado";
import ExperienceCardMasReservados from "../../components/cards/ExperienceCardMasReservados";
import ExperienceCardDescubrimientos from "../../components/cards/ExperienceCardDescubrimientos";
import ExperienceCardCuradoDesktop from "../../components/cards/ExperienceCardCuradoDesktop";
import ExperienceCardGridDesktop from "../../components/cards/ExperienceCardGridDesktop";
import VerMasCard from "../../components/cards/VerMasCard";
import FestivalesCarousel from "../../components/FestivalesCarousel";
import { IconCaretRight } from "../../components/icons";
import {
  getExperiencesByRail,
  getExperiencesByCategories,
  getFestivalesCiudad,
  SECCIONES_ESCENA,
  SECCIONES_CULTURA,
} from "../../data/experiences";

/*
 * Descubrir (mobile) — reconstruido el 2026-08-31 a partir de la Home
 * REAL ya ensamblada en Figma (`home-mobile`, `2122:960`), no de la
 * descripción de ARCHITECTURE.md. Orden real, de arriba a abajo:
 * Mobile Top Bar → Category Tabs → encabezado "Curado por Theaveling" →
 * card Curado (hero a sangre) → riel "Más reservados" → riel
 * "Descubrimientos" → Bottom Navigation.
 *
 * Las Sub-category Tabs (debajo de Category Tabs) se sacaron de acá:
 * no existen construidas en Figma (buscado a fondo, ver PENDIENTES.md) y
 * la versión inventada en código no llevaba a ningún lado. El componente
 * queda guardado en SubCategoryTabs.tsx para retomar cuando haya spec
 * real. Contenido de ejemplo: Bogotá (STACK.md, ciudad de referencia).
 *
 * Data-driven — 2026-09-02: las 3 secciones ahora leen de
 * `data/experiences.ts` (12 experiencias reales, inconsistencias de
 * Figma resueltas con Ana) en vez de placeholders/loops genéricos, y
 * cada card navega a `/experiencia/:id` (react-router `Link`) — antes
 * tocar una card no hacía nada.
 *
 * 2026-09-04, a pedido de Ana: se sacó la fila de Ubicación (ícono +
 * "Bogotá" subrayado, antes debajo de Category Tabs) — "no lo quiero
 * ahi, quiero SOLO el icono al lado de la lupa". El ícono pasó al Top
 * Bar (ver MobileTopBar.tsx) y ahora abre `LocationSheet`, un bottom
 * sheet parecido a la referencia que mandó (selector de ubicación de
 * Uber) pero adaptado a lo que la app realmente tiene y a cómo opera:
 * Theaveling es curaduría de nicho a nivel CIUDAD, no un servicio de
 * cercanía por barrio (Ana: "thea actua en la ciudad completa y ya"),
 * así que el sheet es un selector de ciudad (hoy solo Bogotá es real,
 * el resto aparece como "Próximamente" — ver esa nota grande en
 * LocationSheet.tsx).
 */

// 2026-09-07, a pedido de Ana: "el back de cada tab tiene que quedarse
// dentro de esa tab, si entro a una exp de Escena y vuelvo del detalle,
// el back tiene que ser dentro de esa sección, no devolverme a Todo".
// Bug real: `activeCategory` era `useState("Todo")` sin persistir, y
// DetalleExperiencia vuelve con `navigate(-1)` (ver ese archivo) — eso
// desmonta Descubrir, así que al volver se creaba una instancia NUEVA
// del componente, siempre arrancando en "Todo" sin importar desde qué
// tab se había entrado. Se guarda la pestaña activa en localStorage
// (mismo patrón que CiudadContext/FavoritesContext/ReservationsContext)
// y se lee de ahí al montar, así el back respeta la tab de antes sin
// importar cómo se vuelva (browser back, `navigate(-1)`, o un link
// directo a "/").
const TAB_STORAGE_KEY = "theaveling:descubrir-tab";

function leerTabGuardada(): CategoryTab {
  try {
    const guardada = window.localStorage.getItem(TAB_STORAGE_KEY);
    if (guardada === "Todo" || guardada === "Escena" || guardada === "Cultura") {
      return guardada;
    }
  } catch {
    // localStorage puede fallar (modo privado, cuota) — cae a "Todo".
  }
  return "Todo";
}

export default function Descubrir() {
  const [activeCategory, setActiveCategoryState] =
    useState<CategoryTab>(leerTabGuardada);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);

  function setActiveCategory(tab: CategoryTab) {
    setActiveCategoryState(tab);
    try {
      window.localStorage.setItem(TAB_STORAGE_KEY, tab);
    } catch {
      // Igual que arriba: si falla, la tab solo no persiste, no rompe nada.
    }
  }

  const curado = getExperiencesByRail("curado");
  // 2026-09-08, a pedido de Ana ("las img que te di van para sumarle a
  // los contenidos en ver mas, no para poner en el scroll"): estos 2
  // rieles de la Home excluyen las piezas marcadas `soloVerMas` — esas
  // solo se ven en sus pantallas `/ver-mas/...` respectivas (ver
  // `getVerMasContent` en data/experiences.ts), no acá. `masReservadosTodos`
  // (sin filtrar) alimenta el número real de la card "Ver más" — Ana
  // pidió que ese número sí sea el total real (7 + 8 nuevas = 15), a
  // diferencia de Descubrimientos, donde el "+40" se deja fijo a propósito.
  const masReservadosTodos = getExperiencesByRail("mas-reservados");
  const masReservados = masReservadosTodos.filter((exp) => !exp.soloVerMas);
  const descubrimientos = getExperiencesByRail("descubrimientos").filter(
    (exp) => !exp.soloVerMas,
  );
  const festivalesCiudad = getFestivalesCiudad();

  return (
    <>
      {/* Mobile — todo el markup de siempre, sin tocar, solo envuelto en
          `lg:hidden` para convivir con el bloque Desktop de abajo. */}
      <div className="min-h-screen bg-thea-green pb-[72px] lg:hidden">
      {/* Top Bar + Category Tabs suspendidas (fixed) arriba, como un solo
          bloque de header — 2026-09-02, a pedido de Ana: Category Tabs es
          navegación que se usa en cualquier momento, no contenido de una
          sola lectura, mismo criterio que el Bottom Nav. pt-[96px] en el
          contenedor de abajo compensa su alto combinado (56+40px). */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <MobileTopBar onLocationClick={() => setLocationSheetOpen(true)} />
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>
      <LocationSheet
        open={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
      />
      <div className="pt-[calc(96px_+_var(--safe-top))]">
        <main className="flex flex-col gap-8 pt-6 pb-8">
          {activeCategory === "Todo" && (
            <>
              <section className="flex flex-col gap-4">
                {/* 2026-09-07, copy editorial pedido por Ana, mismo
                    patrón que se armó para "El arte se toma la ciudad"
                    (Festivales) en Cultura: eyebrow + título + bajada
                    descriptiva. "Curado por Theaveling" pasa de título
                    grande a eyebrow (ya es un nombre reconocible de
                    marca, no hace falta que sea lo más grande de la
                    sección); "Elegimos lo que vale la pena descubrir."
                    pasa a ser el título real. Se saca la flechita que
                    tenía al lado — el botón "Más Curados" de abajo ya
                    cumple ese rol, mismo criterio que se usó en
                    Festivales (ahí tampoco quedó flechita en el
                    encabezado, la señal de "hay más" vive en el aviso
                    de abajo). */}
                <div className="flex flex-col gap-2 px-5">
                  <span className="font-body font-semibold text-[11px] uppercase text-thea-mint">
                    Curado por Theaveling
                  </span>
                  <h2 className="font-display text-lg text-white-100">
                    Elegimos lo que vale la pena descubrir.
                  </h2>
                  <p className="font-body text-[13px] text-white-60">
                    Una selección de experiencias que destacan por su
                    propuesta y merecen un lugar en tu recorrido.
                  </p>
                </div>
                {/* Sin padding acá a propósito: las cards Curado van a sangre
                    (edge-to-edge), spec real de Figma (`1753:518`) — a
                    diferencia de los rieles de abajo, que sí tienen margen.
                    2026-09-02: son 3 cards apiladas (no 1), con un +20 debajo
                    indicando que hay más picks curados que no se muestran acá. */}
                <div className="flex flex-col gap-6">
                  {curado.map((exp) => (
                    <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                      <ExperienceCardCurado
                        id={exp.id}
                        title={exp.title}
                        description={exp.description}
                        imageUrl={exp.imageUrl}
                        imagePosition={exp.imagePosition}
                      />
                    </Link>
                  ))}
                </div>
                {/* Alineado a la derecha (no centrado) y en blanco (no mint) —
                    2026-09-02, a pedido de Ana. Dos líneas: "+10" grande y en
                    light (font-display, mismo criterio que el comentario de
                    index.html — Thin/Light reservado a Display en tamaños
                    grandes) arriba, "Más Curados" chico y subrayado abajo
                    (única señal de que es clickeable, sin flechita).
                    2026-09-08, a pedido de Ana ("resuélvelo" — este botón no
                    llevaba a ningún lado): ahora es un <Link> real a
                    `/ver-mas/curado`.
                    2026-09-10: se había cambiado el "+10" fijo por la
                    cantidad real del riel (`curado.length`, hoy 3 —
                    quedaba en "+3") sin que Ana lo pidiera — revertido a
                    "+10" fijo, como estaba. Ana señaló que si acá dice
                    "+10", la pantalla de Ver más de Curados debería tener
                    de verdad 10 experiencias — hoy solo hay 3 reales
                    (`curado.length`), así que el número queda fijo por
                    ahora hasta que se sumen más piezas curadas reales. */}
                <Link
                  to="/ver-mas/curado"
                  className="flex flex-col items-end gap-0 py-1 pr-5"
                >
                  <span className="font-display font-light text-2xl leading-none text-white-100">
                    +10
                  </span>
                  <span className="font-body font-semibold text-[11px] text-white-100 underline">
                    Más Curados
                  </span>
                </Link>
              </section>

              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-5">
                  <h2 className="font-display text-lg text-white-100">
                    Más reservados
                  </h2>
                  <IconCaretRight className="text-white-60" />
                </div>
                <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
                  {masReservados.map((exp) => (
                    <Link key={exp.id} to={`/experiencia/${exp.id}`}>
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
                  ))}
                  {/* 2026-09-08, a pedido de Ana: la card "Ver más" ahora
                      lleva de verdad a `/ver-mas/mas-reservados` (ver
                      VerMas.tsx) — antes no navegaba a ningún lado (ver
                      nota vieja en VerMasCard.tsx). El número es la
                      cantidad real total del riel (`masReservadosTodos`,
                      SIN filtrar `soloVerMas`) — con las 8 piezas nuevas
                      de esta tanda, 15 en total, así que el número de la
                      card ahora coincide con lo que de verdad hay en su
                      pantalla de "Ver más". */}
                  <Link to="/ver-mas/mas-reservados">
                    <VerMasCard
                      width={268}
                      height={368}
                      count={masReservadosTodos.length}
                      imageUrl="/assets/images/ver%20mas%20-%20reservados.jpg"
                    />
                  </Link>
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-5">
                  <h2 className="font-display text-lg text-white-100">
                    Descubrimientos
                  </h2>
                  <IconCaretRight className="text-white-60" />
                </div>
                <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
                  {descubrimientos.map((exp) => (
                    <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                      <ExperienceCardDescubrimientos
                        id={exp.id}
                        tag={exp.tag}
                        title={exp.title}
                        venue={exp.venue}
                        city={exp.city}
                        imageUrl={exp.imageUrl}
                      />
                    </Link>
                  ))}
                  {/* 2026-09-08, a pedido de Ana: el "+40" de esta card
                      queda fijo, no es la cantidad real. El número de la
                      card no tiene por qué coincidir con cuántas
                      experiencias hay hoy en la pantalla de "Ver más" —
                      esa pantalla muestra lo que ya está en el scroll más
                      lo nuevo que se va sumando de a poco (acá, 15), sin
                      que eso obligue a que el "+40" cambie. */}
                  <Link to="/ver-mas/descubrimientos">
                    <VerMasCard
                      width={300}
                      height={310}
                      count={40}
                      imageUrl="/assets/images/ver%20mas-descubrimientos.png"
                    />
                  </Link>
                </div>
              </section>
            </>
          )}

          {/* 2026-09-07, a pedido de Ana: "El arte toma la ciudad"
              (Festivales) es la PRIMERA sección de Cultura y tiene
              tratamiento especial — carrusel editorial con 3 festivales
              reales de Bogotá (ver FestivalesCarousel.tsx y la nota
              grande de FESTIVALES_CIUDAD_IDS en data/experiences.ts),
              no un riel filtrado por categoría como el resto. Por eso
              se renderiza a mano acá, ANTES del bloque que recorre
              SECCIONES_CULTURA (que ya no incluye esta sección, ver esa
              constante). El "aviso pequeño" de abajo ("Ver festivales
              próximos en la ciudad") es la misma idea que "Más
              Curados"/las flechitas de cada encabezado — todavía no
              lleva a ningún lado (no existe esa pantalla de "ver más"
              todavía, ver conversación con Ana), es solo la señal
              visual de que hay más para explorar. */}
          {activeCategory === "Cultura" && (
            <section className="flex flex-col gap-4">
              {/* 2026-09-07, copy editorial exacto pedido por Ana para
                  esta sección ("es una sección informativa editorial
                  dentro de thea"): eyebrow "Festivales" + título "El
                  arte se toma la ciudad." + bajada descriptiva — mismo
                  patrón que un eyebrow+título+descripción de portada,
                  no el título suelto que tenía antes. */}
              <div className="flex flex-col gap-2 px-5">
                <span className="font-body font-semibold text-[11px] uppercase text-thea-mint">
                  Festivales
                </span>
                <h2 className="font-display text-lg text-white-100">
                  El arte se toma la ciudad.
                </h2>
                <p className="font-body text-[13px] text-white-60">
                  Encuentra los festivales que reúnen a artistas,
                  propuestas y experiencias para vivir la ciudad de otra
                  manera.
                </p>
              </div>
              <FestivalesCarousel experiencias={festivalesCiudad} />
              {/* 2026-09-07, a pedido de Ana: "no les pongas flecha, solo
                  pon arriba Festivales y abajo proximos y subrayado, con
                  la misma estetica del +10 curados" — mismo botón
                  (alineado a la derecha, sin flechita) que "Más Curados"
                  de la sección de arriba, cambiando el número por la
                  palabra "Festivales" arriba y "Más Curados" por
                  "Próximos" abajo.
                  2026-09-08, a pedido de Ana ("resuélvelo" — este botón
                  tampoco llevaba a ningún lado): ahora es un <Link> real
                  a `/ver-mas/festivales-ciudad`, mismo slug nuevo que
                  getVerMasContent resuelve con `getFestivalesCiudad()` —
                  los mismos 3 festivales del carrusel de arriba, con la
                  card ExperienceCardCurado (mismo criterio "con lo que
                  hay"). La palabra "Festivales" arriba no es un número
                  inventado, así que no hace falta cambiarla. */}
              <Link
                to="/ver-mas/festivales-ciudad"
                className="flex flex-col items-end gap-0 py-1 pr-5"
              >
                {/* 2026-09-07: más chico que el "+10" de Más Curados —
                    a pedido de Ana, "como es una palabra si pueda ir un
                    poco mas chica" (un número corto y una palabra de 10
                    letras no pesan igual al ojo al mismo tamaño). */}
                <span className="font-display font-light text-lg leading-none text-white-100">
                  Festivales
                </span>
                <span className="font-body font-semibold text-[11px] text-white-100 underline">
                  Próximos
                </span>
              </Link>
            </section>
          )}

          {/* 2026-09-07, a pedido de Ana: "Escena" y "Cultura" ahora
              filtran de verdad — antes eran solo visuales (tocarlos no
              cambiaba nada abajo). Cada uno muestra sus propias
              secciones (rieles), no las 3 de "Todo" — mismo patrón
              visual (título + riel horizontal), pero agrupando las
              `Category` reales de experiences.ts según la estructura
              que armó Ana (ver SECCIONES_ESCENA/SECCIONES_CULTURA en
              ese archivo). Si alguna sección quedara sin ninguna
              experiencia real, no se renderiza (no tiene sentido un
              título sin nada debajo). "El arte toma la ciudad"
              (Festivales) SALIÓ de SECCIONES_CULTURA, se renderiza
              aparte arriba — ver nota de esa constante.

              2026-09-07 (más tarde), a pedido de Ana: "pon las de ver
              mas al final de cada scroll, con la card pertinente" — se
              agrega `VerMasCard` al final de cada riel, mismo tamaño
              300×310 que ya usan estas cards (ExperienceCardDescubrimientos),
              con el número de `seccion.verMasCount` (ver esa constante en
              data/experiences.ts — primera pasada inventada, mismo
              criterio que el "+15"/"+40" de Más reservados/Descubrimientos
              en Todo). */}
          {(activeCategory === "Escena" || activeCategory === "Cultura") &&
            (activeCategory === "Escena" ? SECCIONES_ESCENA : SECCIONES_CULTURA).map(
              (seccion) => {
                const items = getExperiencesByCategories(seccion.categorias);
                if (items.length === 0) return null;
                return (
                  <section key={seccion.titulo} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-5">
                      <h2 className="font-display text-lg text-white-100">
                        {seccion.titulo}
                      </h2>
                      <IconCaretRight className="text-white-60" />
                    </div>
                    <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
                      {items.map((exp) => (
                        <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                          <ExperienceCardDescubrimientos
                            id={exp.id}
                            tag={exp.tag}
                            title={exp.title}
                            venue={exp.venue}
                            city={exp.city}
                            imageUrl={exp.imageUrl}
                            centerTitle
                          />
                        </Link>
                      ))}
                      {/* 2026-09-08, a pedido de Ana: ahora lleva de
                          verdad a `/ver-mas/:slug` (ver VerMas.tsx), y el
                          número pasa a ser la cantidad real de la
                          sección (`items.length`) en vez del
                          `verMasCount` inventado — ver nota grande en
                          `SeccionCategoria`, data/experiences.ts. */}
                      <Link to={`/ver-mas/${seccion.slug}`}>
                        <VerMasCard
                          width={300}
                          height={310}
                          count={items.length}
                          imageUrl={seccion.verMasImageUrl}
                        />
                      </Link>
                    </div>
                  </section>
                );
              },
            )}
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <MobileBottomNav />
      </div>
      </div>

      {/* Desktop — 2026-09-08, primera pantalla de Theaveling Desktop
          ("empezamos con lo mismo que empezamos mobile thea", a pedido
          de Ana): nodo real de Figma `categoría-theaveling-cards
          desktop` (`1405:90`), calcado igual que se hizo con
          `home-mobile` para armar todo lo de arriba. Convive en el
          MISMO componente y la MISMA ruta que mobile (`hidden lg:block`
          vs `lg:hidden` arriba) — mismo criterio acordado con Ana de
          "un solo proyecto, no una carpeta aparte": los datos
          (`curado`/`masReservados`/`descubrimientos`) y el estado
          (`activeCategory`) ya calculados arriba se reusan tal cual, sin
          duplicar lógica.

          El nodo de Figma solo cubre la vista "Todo" (su propio texto
          interno dice "Categorías Todo - Desktop") — Escena/Cultura en
          Desktop todavía no tienen diseño real que calcar, así que por
          ahora muestran un aviso honesto en vez de inventar un layout
          sin spec (mismo criterio de todo este proyecto: no inventar
          sin base real). Los tabs de `DesktopNavbar` ya cambian
          `activeCategory` de verdad — cuando esas 2 vistas tengan diseño,
          esta sección las arma sin tocar el navbar. */}
      {/* 2026-09-08, prueba a pedido de Ana: fondo del Desktop pasa de
          `thea-green` (#112c2c) al verde más oscuro. Se usa
          `bg-[rgb(1,20,20)]` (sólido) en vez de `bg-thea-deep` — mismo
          criterio que Reservas.tsx/Perfil.tsx/Busqueda.tsx: thea-deep es
          95% opaco (pensado para ir sobre foto), acá no hay foto detrás
          así que va sólido. */}
      <div className="hidden min-h-screen bg-[rgb(1,20,20)] lg:block">
        <DesktopNavbar active={activeCategory} onChange={setActiveCategory} />

        {activeCategory === "Todo" && (
          <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-20 py-20">
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-white-100">
                  Selección exclusiva
                </span>
                {/* 2026-09-10: se probó poner "Theaveling" en Sansita/
                    thea-red acá (a partir de un comentario de Ana sobre
                    Sansita) pero Ana aclaró que ESTE título va normal —
                    vuelve a font-display parejo, sin tratamiento de
                    wordmark. */}
                <h2 className="font-display text-5xl font-thin tracking-[-1px] text-white-100">
                  Curado por Theaveling
                </h2>
                <p
                  className="max-w-[800px] font-body text-base"
                  style={{ color: "rgba(251,251,251,0.7)" }}
                >
                  Nuestra selección de experiencias alternativas más
                  rigurosa. Encuentros íntimos, estéticas radicales y
                  manifestaciones artísticas al margen del circuito
                  comercial habitual.
                </p>
              </div>
              <div className="h-px w-full bg-white-12" />
              <div className="flex flex-col gap-6">
                {curado.map((exp) => (
                  <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                    <ExperienceCardCuradoDesktop
                      id={exp.id}
                      category={exp.category}
                      title={exp.title}
                      description={exp.description}
                      imageUrl={exp.imageUrl}
                      imagePosition={exp.imagePosition}
                    />
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-5xl font-thin tracking-[-1px] text-white-100">
                  Más reservados
                </h2>
                <p
                  className="max-w-[800px] font-body text-base"
                  style={{ color: "rgba(251,251,251,0.7)" }}
                >
                  Experiencias exclusivas para quienes buscan lo discreto
                  y singular. Espacios reservados, acceso limitado y
                  propuestas culturales que solo se descubren por
                  invitación.
                </p>
              </div>
              <div className="h-px w-full bg-white-12" />
              <div className="grid grid-cols-3 gap-8">
                {masReservados.map((exp) => (
                  <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                    <ExperienceCardGridDesktop
                      id={exp.id}
                      tag={exp.tag}
                      title={exp.title}
                      description={exp.description}
                      venue={exp.venue}
                      city={exp.city}
                      date={exp.date}
                      rating={exp.rating}
                      price={exp.price}
                      imageUrl={exp.imageUrl}
                      mostrarDesde={exp.mostrarDesde}
                      size="reservados"
                    />
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-5xl font-thin tracking-[-1px] text-white-100">
                  Descubrimientos
                </h2>
                <p
                  className="max-w-[800px] font-body text-base"
                  style={{ color: "rgba(251,251,251,0.7)" }}
                >
                  Propuestas que acaban de llegar a Theaveling:
                  experiencias, espacios y artistas para descubrir.
                </p>
              </div>
              <div className="h-px w-full bg-white-12" />
              <div className="grid grid-cols-3 gap-8">
                {descubrimientos.map((exp) => (
                  <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                    <ExperienceCardGridDesktop
                      id={exp.id}
                      tag={exp.tag}
                      title={exp.title}
                      description={exp.description}
                      venue={exp.venue}
                      city={exp.city}
                      date={exp.date}
                      rating={exp.rating}
                      price={exp.price}
                      imageUrl={exp.imageUrl}
                      mostrarDesde={exp.mostrarDesde}
                      size="descubrimientos"
                    />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}

        {(activeCategory === "Escena" || activeCategory === "Cultura") && (
          <div className="flex flex-col items-center gap-2 px-20 py-24 text-center">
            <p className="font-display text-2xl text-white-100">
              Todavía estamos construyendo esta sección para Desktop
            </p>
            <p className="font-body text-sm text-white-60">
              Por ahora podés verla completa en la versión mobile.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
