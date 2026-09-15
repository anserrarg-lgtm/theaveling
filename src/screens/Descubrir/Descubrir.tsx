import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import MobileTopBar from "../../components/MobileTopBar";
import CategoryTabs from "../../components/CategoryTabs";
import { useDescubrirTab } from "../../context/DescubrirTabContext";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import LocationSheet from "../../components/LocationSheet";
import MobileBottomNav from "../../components/MobileBottomNav";
import ExperienceCardCurado from "../../components/cards/ExperienceCardCurado";
import ExperienceCardMasReservados from "../../components/cards/ExperienceCardMasReservados";
import ExperienceCardDescubrimientos from "../../components/cards/ExperienceCardDescubrimientos";
import ExperienceCardCuradoDesktop from "../../components/cards/ExperienceCardCuradoDesktop";
import ExperienceCardCuradoGridDesktop from "../../components/cards/ExperienceCardCuradoGridDesktop";
import ExperienceCardGridDesktop from "../../components/cards/ExperienceCardGridDesktop";
import ExperienceCardDescubrimientosDesktop from "../../components/cards/ExperienceCardDescubrimientosDesktop";
import VerMasCard from "../../components/cards/VerMasCard";
import FestivalesCarousel from "../../components/FestivalesCarousel";
import { IconCaretRight } from "../../components/icons";
import {
  getExperiencesByRail,
  getExperiencesByCategories,
  getExperienceById,
  getFestivalesCiudad,
  SECCIONES_ESCENA,
  SECCIONES_CULTURA,
} from "../../data/experiences";
import type { Experience } from "../../data/experiences";

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
// tab se había entrado.
//
// 2026-09-10, corrección real a pedido de Ana ("porque la app se abre en
// Escena o Cultura?? se tiene que abrir en Todo"): la solución de acá
// arriba pasó por `localStorage`, que además de sobrevivir a la
// navegación interna (lo que se necesitaba) también sobrevive a un
// reload/apertura de cero de la app — con eso, la app arrancaba en la
// última pestaña usada en cualquier visita anterior, no en "Todo". Se
// reemplaza por `DescubrirTabContext` (ver ese archivo): vive en
// `Layout`, que no se desmonta al navegar a Detalle y volver, así que
// sigue resolviendo el caso original — pero si se recarga la página, todo
// React arranca de cero y el valor por defecto ("Todo") gana, sin
// depender de nada guardado.

// 2026-09-10, a pedido de Ana ("en escena teatral tienes todo el
// contenido [en el scroll], y cuando uno va a la pantalla de ver más,
// aparece todo el contenido del scroll" / "en escena y cultura sí tiene
// que ser específico de cada sección" / "reparte bien [las 40 fotos]"):
// bug real — cada sección de Escena/Cultura (SECCIONES_ESCENA/
// SECCIONES_CULTURA, ver data/experiences.ts) mostraba en el riel de
// Home la lista COMPLETA sin recortar, y `getVerMasContent` resuelve esa
// misma sección con el mismo filtro sin excluir nada — dos pantallas
// mostrando exactamente lo mismo. Cada pieza que debe quedar exclusiva
// del "Ver más" de su sección queda marcada `ocultoEnCategoria: true`
// (ver la nota grande de ese campo en data/experiences.ts — es un campo
// aparte de `soloVerMas`, que es del riel de "Todo") y el riel de Home
// muestra el resto. El reparto de cuántas quedan en el scroll vs.
// exclusivas de Ver Más es distinto por sección (ver esa misma nota),
// no un número fijo igual para todas. Ver más sigue resolviendo la lista
// completa real (todas, sin filtrar) tal cual ya lo hacía.

/*
 * RailNavButtons — 2026-09-10, a pedido de Ana ("necesito que el scroll
 * horizontal tenga flechita dentro de circulito hacia la derecha e izq,
 * puede estar centrada a los extremos del contenedor donde van las
 * cards"): 2 botones circulares superpuestos en los bordes del riel de
 * scroll (Desktop), que avanzan/retroceden el riel con `scrollBy`. Se
 * reutiliza el mismo ícono `IconCaretRight` para ambos, el de la
 * izquierda solo va rotado 180° — no hace falta un ícono nuevo. Alcance:
 * únicamente los 2 rieles de Desktop que ya existen ("Más reservados" /
 * "Descubrimientos", con `ExperienceCardGridDesktop`) — la conversación
 * con Ana viene siendo específicamente sobre Desktop ("BIEN SEGUIMOS CON
 * DESKTOP" / "en desk"), los rieles de mobile ya scrollean con el dedo y
 * no llevan flechas.
 *
 * 2026-09-11, a pedido de Ana ("solo se va a poder hacer scroll
 * horizontal si se toca en las flechas, que solo va a hacer el scroll
 * de a uno"): el riel pasa de `overflow-x-auto` a `overflow-x-hidden`
 * (ver los 2 usos de este componente en Descubrir.tsx) — con `hidden`
 * ya no se puede arrastrar/scrollear con el mouse o el trackpad, pero
 * `scrollBy` desde JS sigue funcionando igual (`overflow: hidden` solo
 * saca la interacción manual, no el scroll por código). El paso de cada
 * click ya no es "80% del ancho visible" sino el ancho real de UNA card
 * (mide la primera, `+ gap-8`), así que cada flecha avanza exactamente
 * una tarjeta.
 */
function RailNavButtons({
  railRef,
}: {
  railRef: { current: HTMLDivElement | null };
}) {
  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const primeraCard = el.firstElementChild as HTMLElement | null;
    const GAP_PX = 32; // gap-8
    const paso = primeraCard
      ? primeraCard.getBoundingClientRect().width + GAP_PX
      : el.clientWidth;
    el.scrollBy({ left: dir * paso, behavior: "smooth" });
  };

  const buttonClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white-12 bg-thea-deep/90 text-white-100 shadow-lg transition-colors hover:bg-white-8";

  return (
    <>
      <button
        type="button"
        aria-label="Ver anteriores"
        onClick={() => scroll(-1)}
        className={`${buttonClass} left-2`}
      >
        <IconCaretRight className="h-5 w-5 rotate-180" />
      </button>
      <button
        type="button"
        aria-label="Ver siguientes"
        onClick={() => scroll(1)}
        className={`${buttonClass} right-2`}
      >
        <IconCaretRight className="h-5 w-5" />
      </button>
    </>
  );
}

/*
 * RielConFlechas — 2026-09-12, a pedido de Ana: extiende a Escena/Cultura
 * en Desktop el mismo patrón de riel + flechas que ya usan Curado/Más
 * reservados/Descubrimientos en "Todo" (`RailNavButtons`, arriba). Ahí
 * cada riel tiene su PROPIO `useRef` escrito a mano en `Descubrir()`
 * porque son 3 rieles fijos, conocidos de antemano. Acá el número de
 * rieles sale de recorrer `SECCIONES_ESCENA`/`SECCIONES_CULTURA` con
 * `.map()` (4 y 2 secciones respectivamente) — no se puede declarar un
 * `useRef` fijo por sección de antemano sin repetirlo a mano una vez por
 * cada una. Este wrapper resuelve eso: crea su propio `useRef` interno,
 * uno por cada instancia que React monta (una por sección al iterar), así
 * cada riel de este bloque tiene su propia ref real e independiente sin
 * tocar el mecanismo ya armado de los otros 3 rieles de "Todo".
 */
function RielConFlechas({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative">
      <div
        ref={railRef}
        data-scroll-rail
        className="flex gap-8 overflow-x-hidden scrollbar-none"
      >
        {children}
      </div>
      <RailNavButtons railRef={railRef} />
    </div>
  );
}

export default function Descubrir() {
  const { activeCategory, setActiveCategory } = useDescubrirTab();
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const railMasReservadosRef = useRef<HTMLDivElement | null>(null);
  const railDescubrimientosRef = useRef<HTMLDivElement | null>(null);
  const railCuradoRef = useRef<HTMLDivElement | null>(null);

  // 2026-09-10, a pedido de Ana: mismo criterio que masReservados/
  // descubrimientos de abajo — Curado también suma piezas `soloVerMas`
  // (10 experiencias de Escena reutilizadas como picks curados, ver esa
  // nota grande en data/experiences.ts) para completar el "+10" de la
  // pantalla de Ver más sin que aparezcan en el riel de Home.
  const curado = getExperiencesByRail("curado").filter((exp) => !exp.soloVerMas);
  // 2026-09-12, a pedido de Ana ("quiero que una quede grande nada mas
  // ... la que quiero que quede es la de clons"): la sección Desktop de
  // Curado deja de mostrar las 3 cards grandes apiladas. Queda UNA sola
  // destacada ("Comité del Fracaso: Ensayo Abierto" — la de los payasos,
  // confirmado con Ana: "clowns") en el mismo lugar de siempre, debajo
  // de la descripción de la sección. Las otras 2 que estaban ahí
  // ("Dramaturgias Nómadas: Muestra Estival" y "La consagración del
  // otoño") pasan a un riel chico debajo (ver `curadoRiel`). Ana
  // autorizó completar ese riel con piezas que hoy solo se ven en el
  // "Ver más" de mobile ("para rellenar elige expes que estaban en ver
  // mas de mobile si quieres") — se suman 5 más para que el riel no se
  // sienta corto.
  //
  // 2026-09-12 — hoy esta elección es manual (se cambia el id acá a
  // mano) y el criterio es simplemente "cuál le gustó más a Ana/al
  // equipo de curaduría" — válido, es lo que significa "curado". Pero
  // charlando con Ana surgió una POSIBLE política a futuro para el día
  // que esto deje de ser manual o para tener un criterio más claro al
  // elegir: que la destacada sea, primero, la que tenga urgencia real
  // (últimas funciones, cierra pronto, recién estrenó) — le da al
  // usuario una razón real para mirarla YA, no solo "nos gustó". Si
  // ninguna curada tiene urgencia esa semana, ahí sí se elige por
  // criterio interno/editorial como plan B (el de hoy). Queda anotado
  // como posible, no implementado — no hay ninguna lógica automática de
  // urgencia todavía, solo esta nota para cuando se retome el tema.
  const curadoDestacado = getExperienceById("comite-del-fracaso");
  const curadoRiel = [
    "dramaturgias-nomadas",
    "la-consagracion-del-otono",
    "la-que-grita-en-rojo",
    "cuerpo-en-guardia",
    "pequenos-pasos-gran-escenario",
    "la-esquina-que-baila",
    "papel-en-caida",
  ]
    .map((id) => getExperienceById(id))
    .filter((exp): exp is Experience => exp !== undefined);
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
        {/* 2026-09-14, a pedido de Ana ("quiero q cuando se toque
            theaveling lleve a la pantalla de todo"): tocar el wordmark
            vuelve a la pestaña "Todo" — mismo `setActiveCategory` que ya
            usan CategoryTabs acá abajo y DesktopNavbar en el bloque
            Desktop, no un estado nuevo. */}
        <MobileTopBar
          onLocationClick={() => setLocationSheetOpen(true)}
          onWordmarkClick={() => setActiveCategory("Todo")}
        />
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
                {/* 2026-09-15, corrección a pedido de Ana ("en mobile
                    tambien podriamos hacer lo de 'seleccion exclusiva' en
                    verde como esta ahora curado por.. y luego abajo si
                    poner como titulo de seccion curado por theaveling, con
                    su respectiva flechita como las demas y que obviamente
                    te lleve a la paantalla de ver mas"): reemplaza el
                    criterio anterior (2026-09-07, ver historial) que había
                    convertido "Curado por Theaveling" en el eyebrow y
                    puesto un título aparte inventado. Ahora el eyebrow es
                    "Selección exclusiva" (mismo texto que ya usa el
                    bloque Desktop de este mismo archivo para esta
                    sección, aunque ahí va en blanco — acá se mantiene en
                    mint, tratamiento ya establecido en mobile) y "Curado
                    por Theaveling" vuelve a ser el título real de la
                    sección, ahora como
                    encabezado clickeable con su flechita — mismo patrón
                    que "Más reservados"/"Descubrimientos" de acá abajo
                    (`<h2>` + `IconCaretRight`, todo el bloque un `<Link>`
                    real a `/ver-mas/curado`, misma ruta que ya usaba "Más
                    Curados"). El texto de abajo pasa a ser EXACTAMENTE el
                    mismo que ya usa Desktop para esta sección (antes
                    mobile tenía una bajada distinta, más corta) — a
                    pedido explícito de Ana ("que sea la misma que tenemos
                    ene desk para curado"). */}
                <div className="flex flex-col gap-2 px-5">
                  <span className="font-body font-semibold text-[11px] uppercase text-thea-mint">
                    Selección exclusiva
                  </span>
                  <Link
                    to="/ver-mas/curado"
                    className="flex items-center justify-between"
                  >
                    <h2 className="font-display text-lg text-white-100">
                      Curado por Theaveling
                    </h2>
                    <IconCaretRight className="text-white-60" />
                  </Link>
                  <p className="font-body text-[13px] text-white-60">
                    Nuestra selección de experiencias alternativas más
                    rigurosa. Encuentros íntimos, estéticas radicales y
                    manifestaciones artísticas al margen del circuito
                    comercial habitual.
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
                    de verdad 13 experiencias (3 del riel + 10 más) — ya
                    resuelto: se sumaron 10 piezas reales de Escena como
                    picks `soloVerMas` de Curado (ver nota grande en
                    data/experiences.ts), así que el "+10" ahora sí es
                    real. Se deja como texto fijo de todas formas, mismo
                    criterio que "Más Curados" de abajo: es una etiqueta
                    editorial, no necesita recalcularse sola. */}
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
                {/* 2026-09-10, a pedido de Ana ("la flecha de cada sección
                    no sirve, tiene que dirigir a la pantalla de ver
                    más"): antes era puramente decorativa — todo el
                    encabezado pasa a ser un <Link> real a la misma ruta
                    que ya usa la card "Ver más" del final del riel. */}
                <Link
                  to="/ver-mas/mas-reservados"
                  className="flex items-center justify-between px-5"
                >
                  <h2 className="font-display text-lg text-white-100">
                    Más reservados
                  </h2>
                  <IconCaretRight className="text-white-60" />
                </Link>
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
                {/* 2026-09-10, mismo criterio que "Más reservados" arriba:
                    encabezado clickeable a `/ver-mas/descubrimientos`. */}
                <Link
                  to="/ver-mas/descubrimientos"
                  className="flex items-center justify-between px-5"
                >
                  <h2 className="font-display text-lg text-white-100">
                    Descubrimientos
                  </h2>
                  <IconCaretRight className="text-white-60" />
                </Link>
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
                // 2026-09-10, a pedido de Ana: `ocultoEnCategoria` (no
                // `soloVerMas` — ese es del riel de "Todo", ver la nota
                // grande de ese campo en data/experiences.ts) decide qué
                // queda fuera del scroll de Home de ESTA sección. Cada
                // sección tiene su propio reparto de cuántas fotos nuevas
                // quedan en el scroll vs. exclusivas de
                // `/ver-mas/${seccion.slug}` — no es un número fijo igual
                // para todas.
                const itemsVisibles = items.filter((exp) => !exp.ocultoEnCategoria);
                // 2026-09-10, corrección a pedido de Ana ("si le agregaste
                // a Escena Teatro 6, tiene que decir 6, no doce"): el
                // número de la card no es el total de la sección
                // (`items.length`) sino la cantidad AGREGADA que no se ve
                // en el scroll — mismo criterio que "+10" de Curado (ese
                // número tampoco es el total de 13, es lo que se suma a
                // lo que ya está en el riel).
                const cantidadAdicional = items.length - itemsVisibles.length;
                return (
                  <section key={seccion.titulo} className="flex flex-col gap-4">
                    {/* 2026-09-10, a pedido de Ana ("la flecha de cada
                        sección no sirve, tiene que dirigir a la pantalla
                        de ver más"): antes era decorativa. */}
                    <Link
                      to={`/ver-mas/${seccion.slug}`}
                      className="flex items-center justify-between px-5"
                    >
                      <h2 className="font-display text-lg text-white-100">
                        {seccion.titulo}
                      </h2>
                      <IconCaretRight className="text-white-60" />
                    </Link>
                    <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
                      {itemsVisibles.map((exp) => (
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
                      {/* 2026-09-08, a pedido de Ana: lleva de verdad a
                          `/ver-mas/:slug` (ver VerMas.tsx). El número es
                          `cantidadAdicional` (ver nota arriba), no el
                          total de la sección. */}
                      {cantidadAdicional > 0 && (
                        <Link to={`/ver-mas/${seccion.slug}`}>
                          <VerMasCard
                            width={300}
                            height={310}
                            count={cantidadAdicional}
                            imageUrl={seccion.verMasImageUrl}
                          />
                        </Link>
                      )}
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
      {/* 2026-09-11 — se probó `lg:flex lg:flex-col` + `min-h-screen` con
          `mt-auto` en el footer, para que en pestañas con poco contenido
          (Escena/Cultura) el footer quedara pegado al fondo real de la
          pantalla en vez de flotar donde termina el contenido. Ana
          reportó después un bloque vacío oscuro apareciendo DEBAJO del
          footer (con scroll de más para llegar al final) — exactamente
          el mismo tipo de hueco que este mecanismo buscaba evitar, ahora
          del otro lado. En vez de seguir ajustando ese cálculo de
          "espacio sobrante", se saca el mecanismo entero: vuelve a
          `lg:block` simple, sin `min-h-screen`. Así la altura de la
          página es siempre exactamente la del contenido real, sin
          ningún colchón artificial que pueda calcularse mal — no puede
          aparecer hueco ni arriba ni abajo del footer bajo ninguna
          circunstancia. Se pierde el detalle cosmético de que el footer
          quede pegado al borde de pantalla en pestañas muy cortas
          (Escena/Cultura); ese costo es preferible a este bug. */}
      <div className="hidden bg-[rgb(1,20,20)] lg:block">
        <DesktopNavbar active={activeCategory} onChange={setActiveCategory} />

        {/* `py-20` (80px arriba Y abajo) pasó por varias vueltas el mismo
            día — 2026-09-11: primero a `pt-20 pb-10` (Ana: "hay mucho
            espacio" entre las últimas experiencias y el footer nuevo),
            después a `pb-0` (Ana: "no lo quiero, quitalo" — pero eso
            dejaba el footer pegado de golpe, sin nada de aire) y Ana
            señaló que así quedaba "muy arriba" — pide de vuelta algo de
            espacio, ni el original (80px, doble colchón con el padding
            del footer) ni cero. Se probó `pb-16` (64px), pero eso fue
            ANTES de que el footer tuviera su propio fondo de color
            (bg-thea-green). Con el footer ya siendo un bloque de color
            distinto, ese `pb-16` quedó como una franja oscura suelta
            entre las cards y el footer — Ana: "hay un espacio abajo de
            color mas oscuro que es eso?". Volvió a `pb-0` en ese
            momento, PERO esa misma franja oscura terminó siendo, en
            realidad, el bug real (ver la nota grande del riel de
            "Descubrimientos" más abajo: el `-mb-[420px]` que dejaba un
            resto sin cubrir). Con ESE bug ya arreglado de raíz (el
            riel ya no se pasa de la cuenta), un `pb-16` acá ya no tiene
            nada raro que revelar — es simplemente aire normal antes del
            footer. Ana pidió ese aire de vuelta ("dale espacio a
            Descubrimientos, eso esta pegado ahi"): vuelve a `pb-16`,
            después a `pb-24` (96px) — Ana: "dale un poco mas de
            espacio" — después a `pb-32` (128px) — Ana: "mas" — y
            después a `pb-40` (160px) — Ana: "mas" otra vez. Mismo
            ajuste en el placeholder de Escena/Cultura de abajo. */}
        {activeCategory === "Todo" && (
          <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-20 pt-20 pb-40">
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-white-100">
                  Selección exclusiva
                </span>
                {/* 2026-09-10: se probó poner "Theaveling" en Sansita/
                    thea-red acá (a partir de un comentario de Ana sobre
                    Sansita) pero Ana aclaró que ESTE título va normal —
                    vuelve a font-display parejo, sin tratamiento de
                    wordmark.
                    2026-09-11, a pedido de Ana ("en el titulo de las
                    secciones tienen que ir" las flechitas y la barrita
                    mint, para Desktop — mismo pedido que ya se hizo en
                    mobile, ver Descubrir.tsx mobile más arriba): el
                    título pasa a ser un <Link> real a `/ver-mas/curado`
                    (misma ruta que ya usa "Más Curados" más abajo), con
                    la barrita mint al lado del texto y la flechita al
                    final.
                    2026-09-11, a pedido de Ana ("centra la flechita en la
                    mitad del alto del titulo"): centrar la flechita con
                    `items-center` contra la CAJA del título (line-height)
                    no alcanza acá — a este tamaño (`text-5xl`, 48px) la
                    fuente Archivo Thin queda con más "peso" visual hacia
                    abajo (por la descendente de la "p" de "por" y cómo
                    reparte su propio alto la fuente), así que centrada
                    por caja la flecha se ve corrida hacia arriba. Medido
                    con la fuente real (Archivo, métricas de su archivo
                    .woff2: ascent 878/descent 210 sobre 1000 unidades):
                    el centro visual real del título completo (de la
                    punta más alta a la "p" de "por") queda ~2.5px más
                    abajo que el centro de la caja — se corrige con un
                    `translate-y-[2.5px]` en la flecha, verificado
                    renderizando la fuente real: con ese ajuste el centro
                    de la flecha (66.0px) cae exactamente sobre el centro
                    visual del título (66.0px). Mismo ajuste en los otros
                    2 títulos de Desktop de abajo (mismo tamaño de
                    fuente). */}
                <Link to="/ver-mas/curado" className="flex items-center gap-4">
                  <h2 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
                    <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
                    Curado por Theaveling
                  </h2>
                  <IconCaretRight className="h-7 w-7 shrink-0 translate-y-[2.5px] text-white-60" />
                </Link>
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
              {/* 2026-09-12: card destacada + riel chico (ver nota grande
                  arriba, junto a `curadoDestacado`/`curadoRiel`, con la
                  cita completa del pedido de Ana). La destacada queda en
                  el mismo lugar de siempre; el riel de abajo reusa el
                  mismo patrón de scroll horizontal + hover-expand que
                  "Más reservados"/"Descubrimientos" (ver esas notas
                  grandes más abajo para el detalle de cada truco), pero
                  con `ExperienceCardCuradoGridDesktop` — texto adentro de
                  la imagen, no en un bloque aparte abajo. */}
              {curadoDestacado && (
                <Link to={`/experiencia/${curadoDestacado.id}`}>
                  <ExperienceCardCuradoDesktop
                    id={curadoDestacado.id}
                    category={curadoDestacado.category}
                    title={curadoDestacado.title}
                    description={curadoDestacado.description}
                    imageUrl={curadoDestacado.imageUrl}
                    imagePosition={curadoDestacado.imagePosition}
                    destacado
                    // 2026-09-12, a pedido de Ana: título de "Comité del
                    // Fracaso" (la pieza de clown) en amarillo mostaza y
                    // en "Carnivalee Freakshow" — puntual a esta card, ver
                    // la nota grande en ExperienceCardCuradoDesktop.tsx.
                    tituloColor="#E1AD01"
                    tituloFontFamily="var(--font-carnivalee)"
                    // Mismo día, a pedido de Ana ("el titulo mucho mas
                    // grande... la letra de la desc mas grande y hacia
                    // la izq, dos o 3 lineas"): título de 26px a 44px,
                    // descripción de 13px a 16px, pasa de 1 línea
                    // truncada a varias líneas con un ancho propio más
                    // angosto (en vez de compartir el ancho completo del
                    // título) para que quede pegada a la izquierda en
                    // vez de estirarse por toda la card.
                    tituloTamano="44px"
                    descripcionTamano="16px"
                    // Ronda de ajuste fino, mismo día ("la desc llegando
                    // mas hacia la derecha, no 3 lineas solo dos... baja
                    // un poco el titulo hacia la desc"): 480px→640px de
                    // ancho, 3→2 líneas, y un margen propio más chico
                    // entre título y descripción (8px de siempre→4px).
                    descripcionLineas={2}
                    descripcionAncho="640px"
                    tituloMargenInferior="4px"
                  />
                </Link>
              )}
              <div className="relative">
                <div
                  ref={railCuradoRef}
                  data-scroll-rail
                  className="flex gap-8 overflow-x-hidden pt-[120px] -mt-[96px] pb-[420px] -mb-[420px] scrollbar-none"
                >
                  {curadoRiel.map((exp) => (
                    <Link
                      key={exp.id}
                      to={`/experiencia/${exp.id}`}
                      className="relative h-[190px] w-[280px] shrink-0"
                    >
                      <ExperienceCardCuradoGridDesktop
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
                <RailNavButtons railRef={railCuradoRef} />
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* 2026-09-11, a pedido de Ana: mismo tratamiento que
                    "Curado por Theaveling" arriba — Link a
                    `/ver-mas/mas-reservados` + barrita mint + flechita.
                    `translate-y-[2.5px]` en la flecha — mismo ajuste de
                    centrado óptico que "Curado por Theaveling" arriba
                    (ver esa nota grande para el detalle completo). */}
                <Link
                  to="/ver-mas/mas-reservados"
                  className="flex items-center gap-4"
                >
                  <h2 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
                    <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
                    Más reservados
                  </h2>
                  <IconCaretRight className="h-7 w-7 shrink-0 translate-y-[2.5px] text-white-60" />
                </Link>
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
              {/* 2026-09-10, a pedido de Ana ("utiliza las expe que
                  tambien salen en mobile pero utiliza scroll"): esta
                  sección pasa de grilla fija (`grid grid-cols-3`, spec
                  original de Figma — ver nota vieja en
                  ExperienceCardGridDesktop.tsx) a riel de scroll
                  horizontal, mismo criterio que mobile (mismas
                  experiencias de `masReservados`, ya reusado tal cual).
                  Las cards pasan a ancho fijo + `shrink-0` para poder
                  vivir en una fila que scrollea en vez de una columna de
                  grilla que se estira. */}
              <div className="relative">
                {/* 2026-09-10/11, a pedido de Ana (hover-expand tipo
                    Netflix/Teatrix, texto COMPLETO en hover — ver nota
                    grande en ExperienceCardGridDesktop.tsx): este
                    `<Link>` pasa a tener tamaño FIJO (`relative` + alto
                    fijo) porque ahora es ÉL quien define cuánto mide la
                    fila — la card de adentro vive `absolute inset-0` y
                    al hacer hover escala hacia arriba sin que la fila se
                    entere (si el `<Link>` no tuviera alto fijo,
                    colapsaría a 0 porque su único hijo dejó de estar en
                    el flujo).

                    2026-09-11, a pedido de Ana ("hagamos mas pequeñas
                    las cards, todas van a tener el mismo tamaño ahora
                    excepto las de curado... necesito que quepan por lo
                    menos 4"): 380×480 baja a 280×320 — mismo tamaño que
                    "Descubrimientos" (ver ese riel abajo). Con
                    `max-w-[1440px] px-20` (1280px de ancho útil) y
                    `gap-8`, 4 cards de 280px entran con margen de sobra
                    (4×280 + 3×32 = 1216px), asomando un poco de la 5ta.

                    2026-09-11 — Ana: "el espacio entre mas reservados y
                    descubrimientos es absurdo". El `pb-[420px]` (aire
                    para que la descripción completa en hover no se
                    corte contra el borde del `overflow-x-auto`, la más
                    larga del catálogo son ~390 caracteres — ver conteo
                    en data/experiences.ts) empujaba la sección de abajo
                    ese mismo espacio en el estado NORMAL, sin hover, que
                    es donde se ve casi siempre. Se le suma `-mb-[420px]`
                    al mismo elemento: el padding-bottom sigue estando
                    (el recorte por overflow lo sigue considerando, así
                    que el hover no se corta) pero el margen negativo
                    cancela ese espacio de cara a la sección de abajo, que
                    vuelve a quedar pegada como antes.

                    2026-09-12, a pedido de Ana (mandó una captura de
                    Netflix): las cards chicas de al lado de la que crece
                    tienen que quedar centradas contra la grande, no
                    pegadas por arriba — es decir, la card en hover no
                    solo crece para abajo, también un poco para arriba
                    (ver `corrimientoArriba` en ExperienceCardGridDesktop.tsx).
                    Mismo truco que el `pb-[420px]/-mb-[420px]` de arriba
                    pero para el lado de ARRIBA: `pt-[120px]` da aire para
                    que ese crecimiento hacia arriba no se corte contra el
                    borde del riel, y `-mt-[96px]` cancela la mayor parte
                    de ese padding para que el espacio normal (sin hover)
                    quede igual que antes (`pt-6`, 24px: 120-96=24).

                    2026-09-12: 320px de alto se quedaba CORTO para el
                    contenido real de esta card (imagen + tag/título +
                    rating/precio) — el contenido necesitaba ~15-30px más
                    de los que había, y como la card tiene `overflow-
                    hidden`, ese excedente se recortaba de la parte de
                    abajo SIN avisar: por más que se subiera el padding
                    del precio, no se veía ningún cambio, porque ese aire
                    de más quedaba cortado, no visible (Ana: "no se ve
                    nada los cambios, no se ven"). Sube a 370px — ahora
                    entra todo con aire de sobra real y visible abajo del
                    precio. "Descubrimientos" (sin footer de precio) NO
                    sube — ver ese riel más abajo, a Ana le sobraba
                    espacio ahí, es el caso contrario.

                    2026-09-12 (más tarde, mismo día): ese "aire de sobra"
                    resultó ser DEMASIADO — la fila de rating/precio tenía
                    `mt-auto` (se pegaba siempre al fondo de la card), así
                    que con 370px de alto quedaba un hueco vacío ENTRE el
                    título y la línea divisoria de arriba del precio (a
                    pedido de Ana: "esa linea puede estar mas arriba y la
                    card incluso ser mas chica"). Se saca el `mt-auto` en
                    `ExperienceCardGridDesktop.tsx` (ver nota grande ahí)
                    — la fila ahora queda pegada al contenido de arriba
                    con el mismo espaciado que el resto. Medido con
                    Playwright: sin `mt-auto`, el contenido real (imagen +
                    título de 2 líneas + rating/precio) ocupa 331.5px, sin
                    recortarse en ningún momento. Se baja el alto de esta
                    card de 370px a 348px — deja ~17px de aire real y
                    visible DESPUÉS del precio (no antes, que es donde se
                    notaba el hueco), la card queda más chica como pidió
                    Ana, sin volver a cortar nada.

                    2026-09-12 (tercera vuelta): Ana pidió sacarle "un
                    tris, nada prácticamente" a ese aire de después del
                    precio. Medido con Playwright, el contenido real de
                    esta card hoy es 347px (no 331.5px como decía la nota
                    de arriba — quedó desactualizada por cambios
                    posteriores), así que 348px ya casi no tenía sobra
                    real para sacarle — se probó bajar a 340px y SÍ
                    recortaba, se veía el precio cortado en todas las
                    cards por igual. El recorte real sale de
                    `ExperienceCardGridDesktop.tsx` (el padding inferior
                    del bloque de texto, `pb-4`→`pb-3`, 4px menos): con
                    eso el contenido real baja a 343px, y acá el alto se
                    ajusta a esa medida — sin cortar nada, con un poco
                    menos de aire suelto abajo del precio. */}
                <div
                  ref={railMasReservadosRef}
                  data-scroll-rail
                  className="flex gap-8 overflow-x-hidden pt-[120px] -mt-[96px] pb-[420px] -mb-[420px] scrollbar-none"
                >
                  {masReservados.map((exp) => (
                    <Link
                      key={exp.id}
                      to={`/experiencia/${exp.id}`}
                      className="relative h-[343px] w-[280px] shrink-0"
                    >
                      <ExperienceCardGridDesktop
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
                        size="reservados"
                      />
                    </Link>
                  ))}
                </div>
                <RailNavButtons railRef={railMasReservadosRef} />
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* 2026-09-11, a pedido de Ana: mismo tratamiento que las
                    2 secciones de arriba — Link a
                    `/ver-mas/descubrimientos` + barrita mint + flechita.
                    `translate-y-[2.5px]` en la flecha — mismo ajuste de
                    centrado óptico que "Curado por Theaveling" arriba
                    (ver esa nota grande para el detalle completo). */}
                <Link
                  to="/ver-mas/descubrimientos"
                  className="flex items-center gap-4"
                >
                  <h2 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
                    <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
                    Descubrimientos
                  </h2>
                  <IconCaretRight className="h-7 w-7 shrink-0 translate-y-[2.5px] text-white-60" />
                </Link>
                <p
                  className="max-w-[800px] font-body text-base"
                  style={{ color: "rgba(251,251,251,0.7)" }}
                >
                  Propuestas que acaban de llegar a Theaveling:
                  experiencias, espacios y artistas para descubrir.
                </p>
              </div>
              <div className="h-px w-full bg-white-12" />
              {/* 2026-09-12, segunda vuelta — Ana: "ya no quiero que las
                  de descu lleven la card tradicional, quiero que sea la
                  foto y contenido de texto abajo, desc corta de 2 lineas
                  mas puntos suspensivos y el lugar, adicional a lo que ya
                  tiene" + confirmó que ya no lleva el efecto expandido
                  ("es insostenible") y pidió zoom en la foto en su lugar.
                  Este riel deja de usar `ExperienceCardGridDesktop`
                  (compartida con "Más reservados", con hover-expand tipo
                  Netflix) y pasa a `ExperienceCardDescubrimientosDesktop`
                  — ver la nota grande en ese archivo para el detalle
                  completo. Solo se toca ESTE riel — "Curado" y "Más
                  reservados" siguen exactos, con su mismo hover-expand.

                  Como esta card ya no se agranda en hover, tampoco hace
                  falta el aire reservado (`pt-[120px] -mt-[96px]
                  pb-[100px] -mb-[100px]`) que sólo existía para que ese
                  crecimiento no se cortara contra el riel — dejarlo
                  hubiera abierto el mismo tipo de hueco vacío que causó
                  el bug del "bloque oscuro" reportado antes (espacio
                  reservado que ya no cubre ninguna animación real). Se
                  saca del todo. Por el mismo motivo, el `<Link>` de cada
                  card ya no necesita `relative` ni un alto en píxeles
                  fijo (`h-[290px]`) — esa card vieja vivía `absolute`
                  adentro de ese alto fijo para poder animarse; la nueva
                  no es `absolute`, mide lo que su contenido pida. */}
              <div className="relative">
                <div
                  ref={railDescubrimientosRef}
                  data-scroll-rail
                  className="flex gap-8 overflow-x-hidden scrollbar-none"
                >
                  {descubrimientos.map((exp) => (
                    <Link key={exp.id} to={`/experiencia/${exp.id}`} className="w-[280px] shrink-0">
                      <ExperienceCardDescubrimientosDesktop
                        id={exp.id}
                        tag={exp.tag}
                        title={exp.title}
                        description={exp.description}
                        venue={exp.venue}
                        city={exp.city}
                        imageUrl={exp.imageUrl}
                      />
                    </Link>
                  ))}
                </div>
                <RailNavButtons railRef={railDescubrimientosRef} />
              </div>
            </section>
          </div>
        )}

        {/* 2026-09-12, a pedido de Ana ("vamos mejor a escena y cultura...
            el contenido de mobile es el mismo aca en desk"): reemplaza el
            aviso de "todavía estamos construyendo esta sección" — Escena y
            Cultura en Desktop pasan a mostrar las mismas secciones/
            experiencias reales que ya arma mobile (`SECCIONES_ESCENA`/
            `SECCIONES_CULTURA`, `getExperiencesByCategories`, mismo campo
            `ocultoEnCategoria` para lo exclusivo de "Ver más" — ver las
            notas grandes de esos 2 en la versión mobile más arriba, la
            lógica de qué mostrar es la misma, solo cambia el layout).

            Títulos — mismo tratamiento ya usado en los 3 encabezados de
            "Todo" (barrita mint + `<Link>` a `/ver-mas/:slug` + flechita
            con el ajuste óptico `translate-y-[2.5px]`, ver la nota grande
            de "Curado por Theaveling" más arriba para el detalle completo
            de por qué ese offset puntual). A diferencia de esos 3, estas
            secciones no traen bajada descriptiva propia — mobile tampoco
            la tiene para estas secciones (solo Festivales, más abajo, sí
            trae una), así que no se inventa una acá.

            Tarjetas — a pedido explícito de Ana ("las expe van como estan
            las de descu"): mismo componente que "Descubrimientos" de
            "Todo" (`ExperienceCardDescubrimientosDesktop`, sin
            hover-expand, zoom de foto solamente) en vez de la card con
            hover-expand tipo Netflix de "Más reservados"/"Curado" — sin
            precio ni rating en los datos de estas secciones, esa card es
            la que mejor encaja.

            Riel + flechas — usa el nuevo `RielConFlechas` (ver su nota
            grande arriba) en vez de un `useRef` a mano por sección, porque
            acá el número de rieles sale de recorrer una lista, no es fijo
            de antemano.

            Card "Ver más" al final de cada riel — a pedido de Ana ("agrega
            la card de ver mas al final del scroll de cada seccion"): mismo
            patrón que ya usa mobile para estas mismas secciones
            (`VerMasCard` + `cantidadAdicional`, ver esa cuenta en la
            versión mobile de arriba — no es el total de la sección, es lo
            que queda fuera del scroll). 280×328: mismo ancho que las cards
            del riel (280px) y el alto medido con Playwright contra el
            contenido real de `ExperienceCardDescubrimientosDesktop` a ese
            ancho, para que la card de cierre quede exactamente de la misma
            altura que sus hermanas en la fila.

            Festivales — a pedido de Ana ("festivales ponlo como creas y te
            corrijo si algo"): decisión propia, no hay pedido puntual de
            layout. En mobile es un carrusel de a una porque el ancho de
            pantalla solo entra una card por vez (`FestivalesCarousel`,
            reusa `ExperienceCardCurado`); en Desktop hay ancho de sobra
            para mostrar las 3 (`FESTIVALES_CIUDAD_IDS` siempre trae 3) de
            una sola vez, así que no hace falta autoplay ni puntos de
            paginación — se arma una grilla de 3 columnas con
            `ExperienceCardCuradoDesktop` (la misma card grande a sangre
            que ya usa la destacada de Curado arriba, sin el prop
            `destacado`), mismo lenguaje visual que el resto de Desktop en
            vez de inventar una card nueva. Si a Ana no le cierra este
            tratamiento, es el punto más fácil de cambiar de todo este
            bloque. */}
        {activeCategory === "Escena" && (
          <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-20 pt-20 pb-40">
            {SECCIONES_ESCENA.map((seccion) => {
              const items = getExperiencesByCategories(seccion.categorias);
              if (items.length === 0) return null;
              const itemsVisibles = items.filter(
                (exp) => !exp.ocultoEnCategoria,
              );
              const cantidadAdicional = items.length - itemsVisibles.length;
              return (
                <section key={seccion.slug} className="flex flex-col gap-6">
                  <Link
                    to={`/ver-mas/${seccion.slug}`}
                    className="flex items-center gap-4"
                  >
                    <h2 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
                      <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
                      {seccion.titulo}
                    </h2>
                    <IconCaretRight className="h-7 w-7 shrink-0 translate-y-[2.5px] text-white-60" />
                  </Link>
                  <div className="h-px w-full bg-white-12" />
                  <RielConFlechas>
                    {itemsVisibles.map((exp) => (
                      <Link
                        key={exp.id}
                        to={`/experiencia/${exp.id}`}
                        className="w-[280px] shrink-0"
                      >
                        <ExperienceCardDescubrimientosDesktop
                          id={exp.id}
                          tag={exp.tag}
                          title={exp.title}
                          description={exp.description}
                          venue={exp.venue}
                          city={exp.city}
                          imageUrl={exp.imageUrl}
                        />
                      </Link>
                    ))}
                    {cantidadAdicional > 0 && (
                      <Link
                        to={`/ver-mas/${seccion.slug}`}
                        className="w-[280px] shrink-0"
                      >
                        <VerMasCard
                          width={280}
                          height={328}
                          count={cantidadAdicional}
                          imageUrl={seccion.verMasImageUrl}
                        />
                      </Link>
                    )}
                  </RielConFlechas>
                </section>
              );
            })}
          </div>
        )}

        {activeCategory === "Cultura" && (
          <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-20 pt-20 pb-40">
            {festivalesCiudad.length > 0 && (
              <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Link
                    to="/ver-mas/festivales-ciudad"
                    className="flex items-center gap-4"
                  >
                    <h2 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
                      <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
                      El arte se toma la ciudad
                    </h2>
                    <IconCaretRight className="h-7 w-7 shrink-0 translate-y-[2.5px] text-white-60" />
                  </Link>
                  <p
                    className="max-w-[800px] font-body text-base"
                    style={{ color: "rgba(251,251,251,0.7)" }}
                  >
                    Encuentra los festivales que reúnen a artistas,
                    propuestas y experiencias para vivir la ciudad de otra
                    manera.
                  </p>
                </div>
                <div className="h-px w-full bg-white-12" />
                <div className="grid grid-cols-3 gap-8">
                  {festivalesCiudad.map((exp) => (
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
            )}

            {SECCIONES_CULTURA.map((seccion) => {
              const items = getExperiencesByCategories(seccion.categorias);
              if (items.length === 0) return null;
              const itemsVisibles = items.filter(
                (exp) => !exp.ocultoEnCategoria,
              );
              const cantidadAdicional = items.length - itemsVisibles.length;
              return (
                <section key={seccion.slug} className="flex flex-col gap-6">
                  <Link
                    to={`/ver-mas/${seccion.slug}`}
                    className="flex items-center gap-4"
                  >
                    <h2 className="flex items-center gap-3 font-display text-5xl font-thin tracking-[-1px] text-white-100">
                      <span className="h-8 w-1.5 shrink-0 rounded-full bg-thea-mint" />
                      {seccion.titulo}
                    </h2>
                    <IconCaretRight className="h-7 w-7 shrink-0 translate-y-[2.5px] text-white-60" />
                  </Link>
                  <div className="h-px w-full bg-white-12" />
                  <RielConFlechas>
                    {itemsVisibles.map((exp) => (
                      <Link
                        key={exp.id}
                        to={`/experiencia/${exp.id}`}
                        className="w-[280px] shrink-0"
                      >
                        <ExperienceCardDescubrimientosDesktop
                          id={exp.id}
                          tag={exp.tag}
                          title={exp.title}
                          description={exp.description}
                          venue={exp.venue}
                          city={exp.city}
                          imageUrl={exp.imageUrl}
                        />
                      </Link>
                    ))}
                    {cantidadAdicional > 0 && (
                      <Link
                        to={`/ver-mas/${seccion.slug}`}
                        className="w-[280px] shrink-0"
                      >
                        <VerMasCard
                          width={280}
                          height={328}
                          count={cantidadAdicional}
                          imageUrl={seccion.verMasImageUrl}
                        />
                      </Link>
                    )}
                  </RielConFlechas>
                </section>
              );
            })}
          </div>
        )}

        {/* 2026-09-11, a pedido de Ana ("vamos" con la propuesta de footer
            chico estilo MUBI — ver la nota grande de DesktopFooter.tsx
            para el detalle completo): vive acá afuera del `if` de
            "Todo"/"Escena"/"Cultura" para que se vea siempre, sin
            importar el tab activo. */}
        <DesktopFooter />
      </div>
    </>
  );
}
