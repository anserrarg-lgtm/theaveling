import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FESTIVALES_CIUDAD_IDS,
  getExperienceById,
  getFestivalLineup,
  getRelatedExperiences,
  type Category,
} from "../../data/experiences";
import {
  IconAlertCircle,
  IconAward,
  IconBookOpen,
  IconBuilding,
  IconCalendar,
  IconCalendarX,
  IconCameraOff,
  IconCaretRight,
  IconClock,
  IconFlag,
  IconGlobe,
  IconMapPin,
  IconRepeat,
  IconShare,
  IconShieldCheck,
  IconTicket,
} from "../../components/icons";
import { splitTitleForDisplay } from "../../utils/splitTitle";
import { googleMapsSearchUrl, googleSearchUrl } from "../../utils/maps";
import FavoritoButton from "../../components/FavoritoButton";
import ArtistSpaceCard from "../../components/cards/ArtistSpaceCard";
import SupportingCard from "../../components/cards/SupportingCard";
import { MapPreview } from "../../components/MapPreview";

/*
 * Reseñas de "Comunidad" — 2026-09-04, a pedido de Ana: antes eran 2
 * reseñas mock UNIVERSALES (mismas para las 17 piezas, ver historial de
 * este comentario en versiones anteriores del archivo). Ana pidió
 * explícitamente que fueran distintas por experiencia y al menos 5 en el
 * riel — ahora cada `Experience` trae su propio `resenas` (ver
 * experiences.ts), y esta pantalla solo las lee de ahí. Ya no hay mock acá.
 */

/*
 * Detalle de experiencia — scroll simple (no es flujo de pasos).
 * Ver knowledge/ARCHITECTURE.md, "Detalle de experiencia y Compra —
 * arquitectura definida":
 * 1. Piece Info Hero (imagen a sangre, back, share+favorito, título,
 *    precio en USD, descripción corta).
 * 2. Por qué descubrir esto (argumento curatorial de Thea).
 * 3. Ficha de la pieza (presentaciones, festivales, premios, idioma).
 * 4. Artista / compañía (Artist/Space Card).
 * 5. Comunidad (reseñas) — va después de la info, no antes (ver VOICE.md).
 * 6. Contenido similar (riel Featured + Rail).
 * CTA "Ver opciones" fijo abajo, siempre activo (texto actualizado
 * 2026-09-03 — ver nota junto al botón, más abajo).
 *
 * 2026-09-02: Piece Info Hero reconstruido para matchear el componente
 * real `1520:127`, verificado en vivo en Figma — la primera versión
 * (h-[52vh], todo superpuesto, degradado en toda la altura) no
 * coincidía. Spec real:
 * - Zona de imagen/video: proporción 390:400 (aspect-ratio, NO h-[400px]
 *   fijo — un alto fijo en px no se adapta al ancho real de cada
 *   celular; ver App.tsx, este proyecto es mobile-first fluido sin
 *   anchos/altos fijos en ningún contenedor real).
 * - Degradado SOLO en el 40% inferior de esa zona (equivalente a los
 *   160/400 del diseño, expresado en % para que escale con la zona), no
 *   en toda la sección.
 * - Título: si trae "Prefijo: Resto" se parte en 2 líneas (prefijo+':'
 *   arriba, resto abajo) — pedido explícito de Ana 2026-09-02.
 * - Título (Archivo Thin 32px/40px, tracking -1px) va DENTRO de la zona
 *   de imagen, anclado abajo, sobre el degradado.
 * - Precio, rating y descripción NO van superpuestos — van en un bloque
 *   aparte debajo, con fondo sólido thea-green (`Content`, p-24, gap-12).
 * - Rating pasado a escala de 10 (Figma tenía ★93%, regla estándar del
 *   proyecto desde 2026-09-02).
 * - Volver/Compartir/Favorito (18px, área táctil 36px), mismo lenguaje
 *   visual que FavoritoButton, no los círculos vacíos que había antes.
 *   Volver usa IconCaretRight rotado 180° (mismo trazo, geometría
 *   exacta). Share usa un ícono placeholder — no tengo el trazo real de
 *   Figma todavía.
 * - 2026-09-03, varias pruebas seguidas de Ana sobre estos 3 íconos:
 *   chip circular thea-deep+blanco (revertido) → chip circular blanco
 *   sólido+thea-deep (revertido) → círculo más chico + íconos más
 *   grandes → SIN círculo, estilo Fever/Airbnb: los íconos flotan
 *   directo sobre la imagen, en blanco, con sombra/halo oscuro para
 *   legibilidad en vez de un chip de fondo. Ver nota completa en
 *   FavoritoButton.tsx.
 * - 2026-09-03: Ana señaló que estos 3 íconos se veían diminutos —
 *   subidos de 18px a 24px (`w-6 h-6`), área táctil de 36px a 40px,
 *   mismo tamaño nuevo que FavoritoButton en las Experience Cards (ver
 *   esa nota para el fix real de posicionamiento que se hizo junto con
 *   este cambio de tamaño).
 *
 * Secciones 2-6 — 2026-09-03, construidas a partir del nodo real de
 * Figma `detalle-mobile` (1867:654), a pedido de Ana ("hay que dejar
 * hecha bien la pantalla del piece"). Contenido real solo existe hoy
 * para "comite-del-fracaso" (ver experiencia.porQueDescubrir/ficha/
 * artista en experiences.ts) — es, de hecho, el mismo contenido que ese
 * nodo de Figma trae bajo el hero de "Dramaturgias Nómadas": ambas
 * piezas estaban mezcladas en un solo frame de Figma y ya se habían
 * separado en 2 experiencias distintas (ver el comentario de cabecera de
 * experiences.ts) — de ahí el pedido explícito de Ana de que el HERO acá
 * muestre "Dramaturgias Nómadas" arriba (ya lo hacía) y el contenido de
 * abajo (por qué/ficha/artista) sea el de la pieza que de verdad describe.
 * 2026-09-04: las 16 experiencias restantes ya recibieron su propio
 * contenido también (primera pasada, ver notas en experiences.ts) — ya no
 * hay pieza sin porQueDescubrir/ficha/artista. "Comunidad" ahora lee
 * `experiencia.resenas`, propias por pieza (ver esa nota más abajo, junto
 * a la sección). "Contenido similar" ya es real: tira otras experiencias
 * de `experiences.ts` (misma categoría primero) vía `getRelatedExperiences`.
 */
/*
 * Detalle de FESTIVAL — 2026-09-08, a pedido de Ana: para los 3
 * festivales reales de Bogotá (Festival de Teatro y Circo, Jazz al
 * Parque, FiLBo — ver FESTIVALES_CIUDAD_IDS en data/experiences.ts) esta
 * misma pantalla se simplifica bastante. Mandó un mockup completo
 * (adaptado de una referencia que tenía para Buenos Aires, "todo lo que
 * diga Buenos Aires pásalo a Bogotá" — ya está todo en Bogotá acá, no
 * queda ninguna referencia a Buenos Aires):
 *
 *   1. Hero — igual que siempre (foto, header fijo volver/compartir/
 *      favorito), pero con eyebrow "FESTIVAL" arriba del título.
 *   2. Debajo del hero: 📍 ciudad · 📅 fechas (en vez de rating/precio),
 *      la descripción corta como bajada editorial, y una fila de
 *      metadata rápida (categorías del lineup + cantidad de
 *      experiencias).
 *   3. "Explora la programación" — el corazón de la pantalla: chips de
 *      categoría (Todo + las categorías reales del lineup) y debajo las
 *      Experience Card de las experiencias que son parte del festival.
 *      Ana fue explícita: "una obra del festival sigue siendo una
 *      experiencia individual y debe mantener su misma lógica visual" —
 *      2026-09-08: empezó con la Experience Card de los rieles de
 *      Descubrir (300px), pero Ana pidió una card más chica "con tal de
 *      que se vea a medias el contenido siguiente" — se cambia a
 *      Supporting Card Compact (220px), la misma que ya usa "Contenido
 *      similar" más abajo en esta pantalla (ver esa nota puntual más
 *      abajo, junto al código).
 *      por eso NO se usa un card distinto para esto.
 *   4. "Dónde sucede" — solo si el lineup pasa en más de un venue
 *      distinto (Ana: "no sé si lo pondría siempre; depende de cada
 *      festival"). Se calcula de los venues reales de las piezas del
 *      lineup, no de una lista aparte.
 *   5. "Sobre el festival" — la bajada larga (reusa
 *      `curiosidadDelLugar`, que ya traía justo este tipo de contenido:
 *      quién organiza, qué es, contexto) + quién organiza.
 *   6. "Visitar sitio oficial" — link de cierre. No hay URL oficial
 *      verificada cargada (cambia de edición a edición) así que usa
 *      `googleSearchUrl` (mismo criterio que `googleMapsSearchUrl`: una
 *      búsqueda real en vez de un link inventado que podría romperse).
 *
 * Se sacan por completo: Ficha del descubrimiento, Quiénes hacen parte,
 * Comunidad y Información adicional — ninguna aplica bien a un festival
 * de varios días con múltiples artistas (son secciones pensadas para UNA
 * pieza con SU propia ficha/artista/reseñas). El CTA fijo "Ver opciones"
 * de abajo tampoco aplica (no se "reserva" un festival completo, cada
 * pieza de la programación se reserva por separado desde su propio
 * Detalle) — se oculta para estos 3.
 *
 * Ningún dato de las experiencias existentes se modifica para esto — el
 * lineup se arma leyendo `getFestivalLineup(id)` (ver esa función y su
 * nota grande en data/experiences.ts).
 */
const CATEGORIAS_LINEUP_ORDEN: Category[] = [
  "Teatro",
  "Danza",
  "Performance",
  "Música",
  "Cine",
  "Cine local",
  "Cineclub",
  "Charlas",
  "Talleres",
  "Lecturas dramáticas",
];

export default function DetalleExperiencia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const experiencia = getExperienceById(id);
  const esFestivalCiudad = Boolean(id && FESTIVALES_CIUDAD_IDS.includes(id));
  const lineupFestival = esFestivalCiudad ? getFestivalLineup(id) : [];
  // Categorías reales presentes en el lineup, en un orden fijo (no el
  // orden de inserción, que dependería de cómo se listaron los ids en
  // FESTIVAL_LINEUP_IDS) — así los chips salen siempre en el mismo orden
  // sin importar cómo se arme el lineup.
  const categoriasLineup = CATEGORIAS_LINEUP_ORDEN.filter((cat) =>
    lineupFestival.some((exp) => exp.category === cat),
  );
  const [categoriaLineupActiva, setCategoriaLineupActiva] = useState<
    Category | "Todo"
  >("Todo");
  // 2026-09-08, a pedido de Ana ("resuélvelo" — el botón "Compartir" no
  // hacía nada): usa la Web Share API real cuando el navegador la trae
  // (celulares, la mayoría de PWAs instaladas) y si no existe (la mayoría
  // de navegadores de escritorio), copia el link al portapapeles y lo
  // avisa con un mensaje breve que se esconde solo. `navigator.share`
  // puede rechazar la promesa si la persona cierra la hoja de compartir
  // sin elegir nada (AbortError) — eso no es un error real, no hay que
  // mostrar nada en ese caso.
  const [mensajeCompartir, setMensajeCompartir] = useState<string | null>(
    null,
  );
  const compartir = async () => {
    if (!experiencia) return;
    const url = `${window.location.origin}/experiencia/${experiencia.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: experiencia.title, url });
      } catch {
        // Cancelado por la persona o no soportado a mitad de camino — no
        // hay nada que mostrar, no fue un error real de la app.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setMensajeCompartir("Enlace copiado");
    } catch {
      setMensajeCompartir("No se pudo copiar el enlace");
    }
    window.setTimeout(() => setMensajeCompartir(null), 2000);
  };
  const lineupFiltrado =
    categoriaLineupActiva === "Todo"
      ? lineupFestival
      : lineupFestival.filter((exp) => exp.category === categoriaLineupActiva);
  // "Dónde sucede" — venues distintos entre las piezas del lineup (dedup
  // por nombre de venue). Si todo el lineup pasa en el mismo lugar, no
  // aporta nada mostrar esta sección (ver nota grande arriba).
  const venuesLineup = Array.from(
    new Map(
      lineupFestival.map((exp) => [
        exp.venue,
        { venue: exp.venue, venueBarrio: exp.venueBarrio, city: exp.city },
      ]),
    ).values(),
  );

  /*
   * Header fijo con volver/compartir/favorito — 2026-09-03, a pedido de
   * Ana: "la sección de arriba de piece... tiene que quedarse cuando se
   * scrollea hacia abajo". Antes este trío vivía DENTRO del hero
   * (`position: absolute`, ver más abajo lo que quedó) — al hacer scroll
   * se iba con la foto, así que perdías volver/favorito apenas pasabas
   * la imagen. Ahora es un bar `fixed` a nivel de pantalla, siempre
   * arriba.
   *
   * Fundido gradual, no un toggle — 2026-09-03, corrección de Ana: la
   * primera versión era un booleano (`scrolled`) que pasaba de
   * transparente a sólido de golpe al cruzar un umbral fijo en px. Ana
   * pidió que fuera transitorio, y sugirió algo específico: que el fondo
   * vaya apareciendo a medida que el degradado que YA tiene la propia
   * imagen (la franja oscura del 40% inferior, ver más abajo) va
   * llegando arriba — en vez de un valor inventado sin relación con la
   * imagen real. Se implementa así: `heroImgRef` mide la zona de imagen
   * en cada scroll (`getBoundingClientRect`), y la opacidad del header
   * (`headerOpacity`, 0→1) se calcula como el progreso entre 2 momentos
   * reales de esa imagen — no un número fijo en px que se rompería en
   * pantallas de otro alto:
   *   - 0 mientras el techo del degradado (60% de la altura de la
   *     imagen, el mismo 40% de la nota de abajo) todavía no llegó a la
   *     altura del propio header (56px, `h-14`) — ahí el header sigue
   *     transparente, tal como ya se leía bien gracias al drop-shadow.
   *   - 1 apenas el borde INFERIOR de la imagen (su punto más oscuro)
   *     pasa por completo debajo del header — ahí ya es 100% sólido.
   * Entre esos 2 puntos interpola en línea recta, así que el fondo se va
   * "llenando" del mismo oscurecimiento que la imagen ya trae, en vez de
   * aparecer de golpe en un punto arbitrario.
   */
  const heroImgRef = useRef<HTMLDivElement>(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  useEffect(() => {
    const HEADER_HEIGHT = 56; // px — alto real del header, h-14
    const GRADIENT_START_RATIO = 0.6; // 60% de la imagen = donde arranca su degradado (ver "h-[40%]" más abajo)

    const onScroll = () => {
      const rect = heroImgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const gradientTopY = rect.top + rect.height * GRADIENT_START_RATIO;
      const heroBottomY = rect.bottom;
      // Denominador = 40% de la altura de la imagen, siempre positivo y
      // constante para un mismo dispositivo (no cambia con el scroll) —
      // es la distancia real, en px, entre el techo del degradado y el
      // borde inferior de la imagen.
      const raw =
        (HEADER_HEIGHT - gradientTopY) / (heroBottomY - gradientTopY);
      setHeaderOpacity(Math.min(1, Math.max(0, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`min-h-screen bg-thea-green text-white-100 font-body ${
        esFestivalCiudad ? "pb-8" : "pb-24"
      }`}
    >
      {/* Color — 2026-09-03, Ana cambió de opinión: no thea-deep (el tono
          reservado para chrome de navegación fija, Top Bar/Category
          Tabs/Bottom Nav) sino el verde thea normal (`--color-thea-green`,
          #112c2c, el mismo fondo de toda la pantalla) — para que el header
          se sienta parte de la propia pantalla en vez de un chrome de
          navegación superpuesto. 100% opaco recién en headerOpacity=1
          (nunca antes): con el fix de ghosting que ya se hizo en
          Perfil/Notificaciones/Datos de cuenta, cualquier opacidad final
          menor a 100% deja pasar contenido de abajo — acá el valor final
          SÍ tiene que llegar a 1 exacto, no un 95% fijo como thea-deep.
          El borde inferior (white-12 = 12% opacidad) se desvanece con el
          mismo `headerOpacity`, en vez de aparecer de golpe junto con el
          fondo. */}
      <div
        className="fixed top-0 left-0 right-0 z-20 pt-[var(--safe-top)]"
        style={{
          backgroundColor: `rgba(17,44,44,${headerOpacity})`,
          borderBottom: `1px solid rgba(255,255,255,${0.12 * headerOpacity})`,
        }}
      >
        <div className="h-14 px-5 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="h-10 w-10 flex items-center justify-center shrink-0"
          >
            <IconCaretRight className="w-6 h-6 text-white-100 rotate-180 drop-shadow-[0_1px_4px_rgba(1,20,20,0.6)]" />
          </button>
          {/* Título de la pieza en la barra — 2026-09-04, a pedido de Ana:
              quería que el nombre de la experiencia apareciera acá, con
              "tres puntos suspensivos" si no cabe (`truncate` de Tailwind
              hace exactamente eso: 1 línea, overflow-ellipsis). Opacidad
              atada al mismo `headerOpacity` que ya maneja el fondo — no
              aparece de golpe: al tope de la pantalla el título grande del
              Hero (más abajo) ya lo muestra, así que acá arranca invisible
              y se desvanece IN a la par que la barra se vuelve sólida,
              como si "reemplazara" al título del Hero al salir de vista. */}
          <p
            className="flex-1 min-w-0 truncate text-center font-display text-base text-white-100 drop-shadow-[0_1px_4px_rgba(1,20,20,0.6)]"
            style={{ opacity: headerOpacity }}
          >
            {experiencia?.title}
          </p>
          <div className="relative flex items-center gap-2 shrink-0">
            <button
              onClick={compartir}
              aria-label="Compartir"
              className="h-10 w-10 flex items-center justify-center"
            >
              <IconShare className="w-6 h-6 text-white-100 drop-shadow-[0_1px_4px_rgba(1,20,20,0.6)]" />
            </button>
            {mensajeCompartir && (
              <span
                className="absolute top-11 right-0 whitespace-nowrap rounded-full bg-thea-deep px-3 py-1.5 font-body text-xs text-white-100 shadow-lg"
                role="status"
              >
                {mensajeCompartir}
              </span>
            )}
            {/* 2026-09-03: ahora es el FavoritoButton real (antes era un
                <button> mudo, solo visual) — mismo componente que usan
                las 3 cards de Descubrir. Ver nota en FavoritoButton.tsx:
                sin círculo de fondo, estilo Fever/Airbnb. Volver y
                Compartir no tienen versión "sólida" del ícono (a
                diferencia del corazón), así que en vez del halo de doble
                silueta usan `drop-shadow` — mismo objetivo (legibilidad
                sobre cualquier imagen) con la herramienta que sí
                aplica acá. */}
            {id && <FavoritoButton id={id} />}
          </div>
        </div>
      </div>

      {/* 1. Piece Info Hero */}
      <section className="relative w-full">
        {/* Zona de imagen/video — proporción 390:400 de Figma (no altura
            fija en px): así la altura se calcula según el ANCHO real de
            la pantalla del usuario y la foto nunca se deforma ni se come
            pantalla de más en celulares muy angostos o muy bajitos. Mismo
            criterio "fluido, sin anchos/altos fijos" que ya rige el resto
            del layout (ver App.tsx). */}
        <div
          ref={heroImgRef}
          className="relative aspect-[390/400] w-full overflow-hidden bg-white-6"
        >
          {experiencia?.videoUrl ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={experiencia.videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : experiencia?.imageUrl ? (
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={experiencia.imageUrl}
              alt=""
            />
          ) : null}
          {/* Degradado de legibilidad — solo el 40% inferior de la zona
              (160/400 en el diseño), expresado en % en vez de px fijos
              para que escale junto con la altura real de la zona. */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[40%]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(17,44,44,0), rgba(17,44,44,0.65))",
            }}
          />
          {/* El trío volver/compartir/favorito ya NO vive acá — 2026-09-03,
              se movió a un header `fixed` a nivel de pantalla para que se
              mantenga visible al hacer scroll (ver esa nota arriba, antes
              del return). */}
          <div className="absolute inset-x-6 bottom-6 flex flex-col gap-1.5">
            {/* Eyebrow "FESTIVAL" — solo para los 3 festivales reales de
                Bogotá, ver nota grande arriba de DetalleExperiencia(). */}
            {esFestivalCiudad && (
              <span className="font-body font-semibold text-xs uppercase tracking-[0.5px] text-thea-mint drop-shadow-[0_1px_4px_rgba(1,20,20,0.6)]">
                Festival
              </span>
            )}
            <h1 className="font-display font-thin text-[32px] leading-[40px] tracking-[-1px] text-white-100">
              {splitTitleForDisplay(experiencia?.title ?? `Experiencia #${id}`, {
                fontSize: 26,
                lineHeight: 32,
              })}
            </h1>
          </div>
        </div>

        {/* Bloque de contenido — fondo sólido, aparte de la imagen.
            2026-09-08: para los 3 festivales reales, este bloque cambia
            por completo (ver nota grande arriba) — en vez de
            rating/precio muestra ciudad+fechas y una fila de metadata
            rápida (categorías del lineup + cantidad de experiencias). */}
        {esFestivalCiudad ? (
          <div className="bg-thea-green flex flex-col gap-3 p-6">
            <div className="flex items-center gap-2 font-body font-semibold text-[13px] text-white-100">
              <span className="flex items-center gap-1.5">
                <IconMapPin className="w-4 h-4 opacity-60" />
                {experiencia?.city}
              </span>
              <span style={{ color: "rgba(251,251,251,0.4)" }}>·</span>
              <span className="flex items-center gap-1.5">
                <IconCalendar className="w-4 h-4 opacity-60" />
                {experiencia?.date}
              </span>
            </div>
            <p
              className="font-body text-[15px] leading-[22px] w-full"
              style={{ color: "rgba(251,251,251,0.7)" }}
            >
              {experiencia?.description}
            </p>
            {/* Metadata rápida — categorías reales del lineup + cantidad,
                pedido explícito de Ana ("Teatro · Performance · Música" o
                "📅.../📍.../🎭 32 experiencias"). Se combinan las 2 ideas
                en una sola línea. */}
            {lineupFestival.length > 0 && (
              <p
                className="font-body text-[13px]"
                style={{ color: "rgba(251,251,251,0.5)" }}
              >
                {categoriasLineup.join(" · ")}
                {" · "}
                {lineupFestival.length}{" "}
                {lineupFestival.length === 1 ? "experiencia" : "experiencias"}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-thea-green flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between w-full">
              {/* 2026-09-02, a pedido de Ana: mismo criterio que
                  ExperienceCardMasReservados.tsx — estrella thea-mint,
                  puntaje de vuelta a blanco (white-100).
                  2026-09-04, a pedido de Ana: se agrega la cantidad de
                  calificaciones al lado del puntaje ("(214)") — mismo
                  patrón que apps de reseñas (Airbnb, Google), en gris
                  secundario para no competir con el puntaje. Ver
                  `ratingCount` en experiences.ts (primera pasada, número
                  inventado). */}
              <span className="font-body font-semibold text-[13px]">
                <span className="text-thea-mint">★</span>{" "}
                <span className="text-white-100">
                  {experiencia ? experiencia.rating : "—"}
                </span>{" "}
                {experiencia && (
                  <span
                    className="font-normal"
                    style={{ color: "rgba(251,251,251,0.5)" }}
                  >
                    ({experiencia.ratingCount})
                  </span>
                )}
              </span>
              {/* "Desde" solo si mostrarDesde=true (teatros formales de
                  verdad, ej. Teatro Mayor) — a pedido de Ana 2026-09-02. */}
              <p className="font-body font-semibold text-white-100">
                {experiencia?.mostrarDesde && (
                  <span className="text-[14px] leading-[26px]">Desde </span>
                )}
                <span className="text-[20px] leading-[26px]">
                  {experiencia?.price ?? "—"}
                </span>
              </p>
            </div>
            <p
              className="font-body text-[15px] leading-[22px] w-full"
              style={{ color: "rgba(251,251,251,0.7)" }}
            >
              {experiencia?.description ??
                "Descripción corta pendiente de contenido real."}
            </p>
          </div>
        )}
      </section>

      {/* 2026-09-08: para los 3 festivales reales, todo el bloque de
          secciones 2-6 de abajo se reemplaza por el set simplificado que
          pidió Ana (ver nota grande arriba de DetalleExperiencia()) — el
          resto del archivo (contenedor `else`) sigue exactamente igual
          para las demás 20+ experiencias, sin tocar nada ahí. */}
      {esFestivalCiudad ? (
        <div className="flex flex-col gap-16 px-6 py-8">
          {/* "Explora la programación" — el corazón de la pantalla, ver
              nota grande arriba. Chips de categoría (Todo + categorías
              reales del lineup) + Supporting Card Compact (220px, misma
              que "Contenido similar"). */}
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl text-white-100">
              Explora la programación
            </h2>
            {lineupFestival.length > 0 ? (
              <>
                {categoriasLineup.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {(["Todo", ...categoriasLineup] as const).map((cat) => {
                      const activa = cat === categoriaLineupActiva;
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategoriaLineupActiva(cat)}
                          className={`shrink-0 px-4 py-2 rounded-full font-body font-semibold text-[13px] ${
                            activa
                              ? "bg-white-100 text-thea-green"
                              : "bg-white-8 text-white-100"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* 2026-09-08, a pedido de Ana: "la programación debe ser
                    una card más chica, con tal de que se vea a medias el
                    contenido siguiente" — la Experience Card normal
                    (300×310) casi no dejaba asomar la siguiente. Se
                    cambia a Supporting Card variante Compact (220px),
                    la MISMA card y tamaño que ya usa "Contenido similar"
                    más abajo en esta misma pantalla — no una talla nueva
                    inventada, sino la que ya está resuelta y aprobada
                    para este mismo tipo de riel en Detalle. */}
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {lineupFiltrado.map((exp) => (
                    <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                      <SupportingCard
                        id={exp.id}
                        tag={exp.tag}
                        title={exp.title}
                        venue={exp.venue}
                        city={exp.city}
                        imageUrl={exp.imageUrl}
                        size="compact"
                        showFavorito
                      />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-white-80 text-sm">
                Programación pendiente de confirmar.
              </p>
            )}
          </section>

          {/* "Dónde sucede" — solo si el lineup pasa en más de 1 venue
              distinto, ver nota grande arriba. */}
          {venuesLineup.length > 1 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-2xl text-white-100">
                Dónde sucede
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {venuesLineup.map((v) => (
                  <div
                    key={v.venue}
                    className="flex flex-col gap-1.5 p-4 rounded-xl bg-white-8 w-[220px] shrink-0"
                  >
                    <p className="font-display text-base text-white-100">
                      {v.venue}
                    </p>
                    <span
                      className="flex items-center gap-1.5 font-body text-xs"
                      style={{ color: "rgba(251,251,251,0.6)" }}
                    >
                      <IconMapPin className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      {v.venueBarrio ? `${v.venueBarrio} · ${v.city}` : v.city}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* "Sobre el festival" — bajada larga, reusa `curiosidadDelLugar`
              (ya traía justo este tipo de contenido: quién organiza, qué
              es, contexto — ver esa nota en experiences.ts para cada
              festival) + quién organiza, tomado de `artista`. */}
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-2xl text-white-100">
              Sobre el festival
            </h2>
            <p
              className="font-body text-[15px] leading-normal"
              style={{ color: "rgba(251,251,251,0.7)" }}
            >
              {experiencia?.curiosidadDelLugar}
            </p>
            {experiencia?.artista && (
              <p
                className="font-body text-sm"
                style={{ color: "rgba(251,251,251,0.6)" }}
              >
                Organiza: {experiencia.artista.nombre}
              </p>
            )}
          </section>

          {/* "Visitar sitio oficial" — link de cierre, ver nota grande
              arriba sobre por qué usa `googleSearchUrl` en vez de una URL
              fija. */}
          {experiencia && (
            <a
              href={googleSearchUrl(`${experiencia.title} sitio oficial`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-body font-semibold text-[15px] text-white-100 underline self-start"
            >
              <IconTicket className="w-4 h-4" />
              Visitar sitio oficial
            </a>
          )}
        </div>
      ) : (
      /* Secciones 2-6 — nodo real de Figma `detalle-mobile` (1867:654),
          traído vía get_design_context 2026-09-03. Contenedor único con
          gap-16 (64px) entre secciones, px-6 py-8 (24/32px) — no son 5
          bloques con borde separador como el placeholder anterior; el
          nodo real no lleva bordes entre secciones, solo el espaciado
          generoso. `porQueDescubrir`/`ficha`/`artista` son opcionales en
          `Experience` (ver esa nota en experiences.ts) — donde faltan,
          cada sección cae a un mensaje "pendiente" en vez de inventar
          contenido específico por pieza. */
      <div className="flex flex-col gap-16 px-6 py-8">
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-white-100">
            Por qué descubrir esto
          </h2>
          <p
            className="font-body text-[15px] leading-normal"
            style={{ color: "rgba(251,251,251,0.7)" }}
          >
            {experiencia?.porQueDescubrir ??
              "Argumento curatorial de Theaveling — pendiente de contenido real."}
          </p>
        </section>

        {/* 2026-09-04: por un momento este título pasó a "Información
            adicional" (mal entendido de mi parte — Ana pidió esa
            etiqueta para OTRA sección, más abajo, no para reemplazar
            esta). Corregido: "Ficha del descubrimiento" queda como
            estaba ("no cambiar ficha del descubrimiento, es abajo donde
            te digo que pongas información adicional"). El título
            "Información adicional" real es el de la sección de
            practical-info-list, ver esa nota más abajo.

            2026-09-04, segundo cambio de Ana sobre esta misma sección:
            "en vez de separarlo por lineas le agreguemos iconos como en
            info adicional" — se cambia el layout de filas
            label/valor + línea divisoria (`border-b`/`bg-white-12`) por
            filas ícono + label/valor, gap-4 entre filas, sin
            divisores — mismo lenguaje visual que "Información
            adicional" más abajo en esta pantalla. Un ícono por campo:
            Duración reusa `IconClock` e Idioma reusa `IconGlobe` (ya
            existían — `IconClock` había quedado sin uso en este archivo
            al recortar "Información adicional" a 3 filas, y `IconGlobe`
            venía de esa misma sección); Presentaciones/Festivales/
            Premios/Origen/Restricción de edad usan íconos nuevos
            (repeat/flag/award/book-open/shield-check, ver esa nota en
            icons.tsx). El orden de los campos NO cambia — Duración y
            Restricción de edad siguen al final de la lista, como pidió
            Ana en la corrección anterior ("colocalas abajo, no
            arriba"). */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-white-100">
            Ficha del descubrimiento
          </h2>
          {experiencia?.ficha ? (
            <div className="flex flex-col gap-4 w-full">
              {(
                [
                  [IconRepeat, "Presentaciones", experiencia.ficha.presentaciones],
                  [IconFlag, "Festivales", experiencia.ficha.festivales],
                  [IconAward, "Premios", experiencia.ficha.premios],
                  [IconBookOpen, "Origen", experiencia.ficha.origen],
                  [IconGlobe, "Idioma", experiencia.ficha.idioma],
                  /* "Duración" y "Restricción de edad" — 2026-09-04, a
                     pedido de Ana: vivían como acordeones propios en
                     Compra.tsx ("Información adicional"), pero son
                     datos de la FICHA de la pieza, no algo que dependa
                     del paso de compra — Ana pidió moverlos acá y
                     sacarlos de Compra, primero Duración y después,
                     mismo criterio ("y si tiene restricción de edad
                     también"), Restricción de edad (ver esa nota en
                     Compra.tsx). Van AL FINAL de la lista (no al
                     principio) — 2026-09-04, corrección de Ana ("la
                     duracion y la restriccion colocalas abajo, no
                     arriba"): la primera versión las había puesto
                     primero, antes de Presentaciones. Usan los campos
                     top-level `experiencia.duracion`/
                     `experiencia.restriccionEdad` (no son parte de
                     `ficha` en experiences.ts, pero se muestran en esta
                     misma lista por ser el mismo tipo de dato de ficha)
                     — con fallback por si alguna pieza no los tuviera. */
                  [IconClock, "Duración", experiencia.duracion ?? "Pendiente de confirmar."],
                  [
                    IconShieldCheck,
                    "Restricción de edad",
                    experiencia.restriccionEdad ?? "Todo público.",
                  ],
                ] as const
              ).map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-white-100 opacity-50 shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span
                      className="font-body text-sm"
                      style={{ color: "rgba(251,251,251,0.7)" }}
                    >
                      {label}
                    </span>
                    <span className="font-body text-sm leading-[1.4] text-white-100">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white-80 text-sm">
              Duración, restricción de edad, presentaciones, festivales,
              premios, origen, idioma — pendiente de contenido real.
            </p>
          )}
        </section>

        {/* Título "Quiénes hacen parte" — 2026-09-04, pedido de Ana
            ("y artista/compañía cambialo, quienes hacen parte"), mismo
            criterio que el cambio de "Información adicional" a "Dónde
            es" en la sección de abajo: título más preciso/conversacional
            para lo que realmente muestra esta sección (Artist/Space
            Card + saludo del artista o compañía). El nombre interno
            (comentarios, `experiencia.artista`) sigue diciendo "artista"
            por herencia del modelo de datos — solo cambió el texto
            visible. */}
        <section className="flex flex-col items-center gap-4 w-full">
          <h2 className="font-display text-2xl text-white-100 text-center">
            Quiénes hacen parte
          </h2>
          {experiencia?.artista ? (
            <>
              <ArtistSpaceCard
                nombre={experiencia.artista.nombre}
                categoria={experiencia.artista.categoria}
                ciudad={experiencia.artista.ciudad}
                imageUrl={experiencia.artista.imageUrl}
              />
              {/* Saludo — 2026-09-04, a pedido de Ana: un breve saludo del
                  artista/compañía hacia quien está mirando la pieza,
                  debajo de la card. Ancho acotado (w-[280px], mismo que
                  la card) y centrado, para que no se vea como un párrafo
                  suelto de ancho completo — se lee como algo que "dice"
                  la card de arriba, no como una sección nueva. No es la
                  voz de Thea (ver esa nota en experiences.ts) — es la voz
                  del artista/compañía. */}
              {experiencia.artista.saludo && (
                <p
                  className="font-body text-sm leading-[1.5] text-center w-[280px]"
                  style={{ color: "rgba(251,251,251,0.8)" }}
                >
                  {experiencia.artista.saludo}
                </p>
              )}
            </>
          ) : (
            <p className="text-white-80 text-sm text-center">
              Quiénes hacen parte — pendiente de contenido real.
            </p>
          )}
        </section>

        {/* Comunidad — 2026-09-04, reestructurada a pedido de Ana a
            partir de una referencia de Airbnb que mandó (captura de una
            pantalla de detalle de tour, sección de reseñas). Se toma la
            ESTRUCTURA (puntaje+cantidad como encabezado, reseñas en riel
            horizontal con avatar, "Mostrar todas" al final) pero NO la
            superficie clara de la referencia — Ana fue explícita
            ("obvio con el fondo en verde"): sigue siendo thea-green +
            cards bg-white-8, mismo lenguaje visual que el resto de
            Detalle, no un fragmento de Airbnb pegado encima.

            Reseñas por pieza + "Personas que estuvieron aquí" — 2026-09-04,
            mismo día, segundo pedido de Ana: las reseñas eran un mock
            UNIVERSAL (RESEÑAS_MOCK, ver historial de este archivo),
            idéntico en las 17 pantallas de Detalle — pidió que fueran
            "distintas" por experiencia y al menos 5 en el riel. Ahora se
            leen de `experiencia.resenas` (ver esa nota en experiences.ts),
            cada pieza con su propio set de 5, escritas específicas a esa
            pieza (tip de logística, experiencia yendo solo/a, reacción al
            contenido, recomendación cruzada a otra pieza real del
            catálogo — mismo estilo de mensaje que pidió Ana). Se agrega
            "Personas que estuvieron aquí" como bajada de la sección, frase
            que Ana dio como ejemplo del tono que quería para esta parte. */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-white-100">Comunidad</h2>
          <p
            className="font-body text-sm -mt-2"
            style={{ color: "rgba(251,251,251,0.6)" }}
          >
            Personas que estuvieron aquí
          </p>
          {/* Puntaje + cantidad — mismo par rating/ratingCount que ya se
              muestra arriba en el Piece Info Hero (ver esa nota), acá
              repetido como encabezado de la sección, igual que en la
              referencia. */}
          <p className="font-body font-semibold text-lg text-white-100">
            <span className="text-thea-mint">★</span>{" "}
            {experiencia ? experiencia.rating : "—"}
            {experiencia && (
              <span style={{ color: "rgba(251,251,251,0.6)" }}>
                {" "}
                · {experiencia.ratingCount} calificaciones
              </span>
            )}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {(experiencia?.resenas ?? []).map((reseña, i) => (
              <div
                key={`${reseña.nombre}-${i}`}
                className="flex flex-col gap-3 p-4 rounded-xl bg-white-8 w-[260px] shrink-0"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar de inicial — 2026-09-04: la referencia trae
                      foto real por reviewer; acá no hay fotos de
                      usuarios mock, así que se usa un círculo con la
                      inicial del nombre en vez de inventar una foto de
                      una persona real que no existe. */}
                  <div className="h-10 w-10 rounded-full bg-white-12 flex items-center justify-center shrink-0">
                    <span className="font-body font-semibold text-sm text-white-100">
                      {reseña.nombre.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body font-semibold text-sm text-white-100">
                      {reseña.nombre}
                    </span>
                    <span
                      className="font-body text-xs"
                      style={{ color: "rgba(251,251,251,0.6)" }}
                    >
                      {reseña.rating} · {reseña.fecha}
                    </span>
                  </div>
                </div>
                <p
                  className="font-body text-sm leading-[1.4]"
                  style={{ color: "rgba(251,251,251,0.8)" }}
                >
                  {reseña.texto}
                </p>
              </div>
            ))}
          </div>
          {/* "Mostrar todas" — 2026-09-04, visual únicamente: no hay
              pantalla de listado completo de reseñas todavía (ni backend
              de reseñas real), mismo criterio que "Cerrar sesión"/
              "Eliminar cuenta" en DatosDeCuenta.tsx — se construye la UI
              del diseño aunque la función de atrás no exista aún.

              2026-09-07: era una píldora (`rounded-full`). A pedido de
              Ana pasó primero a rectangular CON borde, pero aclaró
              después "no te dije que le cambiaras como estaba, solo que
              no fuera píldora" — así que se deja todo lo demás igual al
              original (mismo fondo sólido `bg-white-8`, sin borde) y
              único cambio real es la forma: `rounded-lg` en vez de
              `rounded-full`. */}
          <button
            type="button"
            className="self-center px-5 py-2.5 rounded-lg bg-white-8 font-body font-medium text-sm text-white-100"
          >
            Mostrar todas las calificaciones
          </button>
        </section>

        {/* Información adicional — 2026-09-04, a pedido de Ana: calco
            literal del nodo real de Figma `informacion-adicional-bottom-sheet`
            (`1950:670`, dentro de "Pattern / Compra — 1. Selección",
            traído vía get_design_context el mismo día). Ana pidió
            específicamente CALCAR el frame ("calca bien... lo que está
            en ese frame en Figma"), con la salvedad de que el contenido
            puede ser inventado por ahora ("con la info falsa por ahora
            después la corregimos") — ver esa nota en experiences.ts
            para los 3 campos nuevos (`direccionCompleta`/
            `curiosidadDelLugar`/`contextoBarrio`).

            El nombre "bottom-sheet" es el de Figma (pensado originalmente
            para abrirse como sheet dentro del flujo de Compra, ver esa
            nota en Compra.tsx), pero el trazo real es un bloque de fondo
            oscuro (`#112c2c`, el mismo verde de esta pantalla) — encaja
            igual de bien como sección inline de scroll acá en Detalle,
            mismo lenguaje visual que el resto de la pantalla (card clara
            de Artist/Space Card sobre fondo oscuro, texto blanco/rgba),
            así que no hace falta un modal/sheet real para esta ubicación.

            Va ANTES de "Contenido similar" — ubicación exacta que pidió
            Ana.

            OJO — esto pisa contenido que ya vive en otras 2 secciones de
            esta misma pantalla: "Ficha del descubrimiento" ya muestra
            Duración e Idioma, y "Artista / compañía" ya muestra el
            mismo Artist/Space Card + Restricción de edad (agregada ahí
            recién, en el pedido anterior de Ana). No se tocaron esas 2
            secciones en este cambio — Ana pidió específicamente calcar
            el frame tal cual, no until que decida si hay que consolidar
            (le queda flagueado en el mensaje de esta entrega).

            venue-section, SEGUNDA VUELTA — 2026-09-04, mismo día: Ana
            pidió cambiar el avatar circular de Artist/Space Card acá por
            una foto ("quiero que sea una foto y abajo lo de la ref").
            Aclaró después que el mockup que mandó no era literal — lo
            usó solo para señalar la zona — pero que hay un patrón real
            en el catálogo de cards de Figma que conviene reciclar: el
            documento del sistema de cards (nodo `1502:126`) dice
            explícitamente que 10 de las 11 cards reales de Theaveling
            usan layout "imagen sobre contenido" (Supporting Card,
            Experience Card, Booking Summary Card, etc.) — Artist/Space
            Card es la ÚNICA excepción, con su avatar circular centrado,
            pensada para referenciar una entidad (compañía/venue) como
            tal. Foto con bordes redondeados y bien encuadrada
            (`object-cover` — "obviamente la imagen con bordes y bien
            acomodada"), texto de nombre/categoría/ciudad abajo, ya no
            dentro de una card blanca.

            venue-section, TERCERA VUELTA — mismo día, corrección de Ana
            sobre la vuelta anterior: esa versión usaba
            `experiencia.artista` (nombre/categoría/ciudad/foto) para
            esta ficha — pero esta sección habla del LUGAR, no de la
            compañía ("ahí no se va a hablar de la compañía, se va a
            hablar del lugar"). Son 2 entidades distintas con su propia
            sección ya en Detalle (Artista/compañía, más arriba) que no
            deben mezclarse acá. Se cambia a `experiencia.venue`/`city`
            (datos reales) + `venueCategoria`/`venueBarrio` (ver esas
            notas en experiences.ts — primera pasada inventada, mismo
            criterio de "info falsa por ahora" que el resto). La foto
            usa `venueImageUrl`, NO `artista.imageUrl` — Ana todavía no
            subió fotos de lugares (solo de artistas/compañías hasta
            ahora), así que por ahora cae al mismo placeholder
            (degradado + ícono de edificio) que ya usaba Artist/Space
            Card — no se reusa la foto del artista para no repetir la
            misma confusión de entidades que Ana pidió corregir.

            venue-section, CUARTA VUELTA — mismo día, Ana precisó la
            lista exacta de esta ficha ("cómo se llama el lugar y qué es
            y el barrio y pues en qué ciudad y abajo la desc con datos
            curiosos sobre el lugar"): foto, nombre, qué-es (categoría),
            barrio, ciudad, y UNA sola descripción con datos curiosos
            debajo — no una lista de párrafos sueltos. Se agrega
            `venueBarrio` a la línea de identidad (categoría · barrio ·
            ciudad, mismo formato "Barrio • Ciudad" que ya traía el
            trazo real de Figma para esta card) y se sacan de acá
            `direccionCompleta`/`restriccionEdad` — no estaban en la
            lista que dio Ana. `direccionCompleta` sigue usándose más
            abajo, en map-section (la dirección como label del mapa
            sigue teniendo sentido ahí); `restriccionEdad` queda solo en
            "Ficha del descubrimiento" (evita, de paso, la duplicación
            que le había flagueado a Ana en la entrega anterior). */}
        {experiencia && (
          <section className="flex flex-col gap-6">
            {/* Título "Sobre el lugar" — 2026-09-04, tercera vuelta sobre
                este título: "Dónde es" → "Dónde verás tu descubrimiento"
                → esto. Ana pidió opciones ("no me gusta donde veras tu
                descubrimiento, que puede ser en vez de eso?"), le tiré
                varias ("El lugar"/"Sobre el lugar"/"El espacio"/"Así es
                el lugar"/"Dónde queda") y eligió "Sobre el lugar" ("ok
                usemos sobre el lugar"). El nombre interno de la sección
                (comentarios, ids) sigue diciendo "Información adicional"
                por herencia del nodo de Figma
                `informacion-adicional-bottom-sheet` — solo cambió el
                texto visible del título. */}
            <h2 className="font-display text-2xl text-white-100">
              Sobre el lugar
            </h2>

            {/* venue-section */}
            <div className="flex flex-col gap-3">
              {experiencia.venueImageUrl ? (
                <img
                  src={experiencia.venueImageUrl}
                  alt=""
                  className="w-full h-56 rounded-2xl object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-full h-56 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "linear-gradient(to right, #ebe9e6, #dcdad6, #cfcdc9)",
                  }}
                >
                  <IconBuilding className="w-8 h-8 text-thea-green opacity-40" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <p className="font-display text-xl tracking-[-0.1px] text-white-100">
                  {experiencia.venue}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold text-[10px] uppercase px-2 py-1 rounded bg-white-12 text-white-100">
                    {experiencia.venueCategoria ?? "Espacio cultural"}
                  </span>
                  <span
                    className="font-body text-xs"
                    style={{ color: "rgba(251,251,251,0.5)" }}
                  >
                    {experiencia.venueBarrio
                      ? `${experiencia.venueBarrio} • ${experiencia.city}`
                      : experiencia.city}
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-white-100 w-full leading-[1.4]">
                {experiencia.curiosidadDelLugar ??
                  "Curiosidad del lugar — pendiente de contenido real."}
              </p>
            </div>

            <div className="h-px w-full bg-white-12" />

            {/* map-section — 2026-09-04, a pedido de Ana ("ponlo bien
                estetico y funcional"): el placeholder plano (bg-white-8 +
                IconMapPin centrado) se reemplazó por <MapPreview>, una
                ilustración de mapa (calles + pin con halo) que además es
                un link real y de área completa a la búsqueda de Google
                Maps — ver el comentario largo en
                components/MapPreview.tsx sobre por qué no es un mapa
                estático real (no hay lat/long cargada, varios venues del
                catálogo son ficticios). "Ampliar"/"Ir a Google Maps"
                siguen abajo apuntando al mismo link de búsqueda por
                nombre — no hay mapa interactivo real todavía, así que
                "Ampliar" no tiene una acción distinta que ofrecer por
                ahora; ahora son una forma alterna (a propósito
                redundante) de llegar al mismo lugar, además de tocar la
                tarjeta del mapa. */}
            <div className="flex flex-col gap-3">
              <MapPreview
                venue={experiencia.venue}
                city={experiencia.city}
                variant="dark"
                className="h-[180px]"
              />
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p
                  className="font-body text-[13px]"
                  style={{ color: "rgba(251,251,251,0.6)" }}
                >
                  {experiencia.direccionCompleta ?? `${experiencia.venue}, ${experiencia.city}`}
                </p>
                <div className="flex items-center gap-3 font-body font-semibold text-[13px] text-white-100">
                  <a
                    href={googleMapsSearchUrl(`${experiencia.venue}, ${experiencia.city}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Ampliar
                  </a>
                  <a
                    href={googleMapsSearchUrl(`${experiencia.venue}, ${experiencia.city}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Ir a Google Maps
                  </a>
                </div>
              </div>
              <p className="font-body text-sm text-white-100 leading-[1.4] w-full">
                {experiencia.contextoBarrio ??
                  "Contexto del barrio — pendiente de contenido real."}
              </p>
            </div>
          </section>
        )}

        {/* Información adicional — 2026-09-04. Originalmente este
            practical-info-list vivía DENTRO de "Sobre el lugar" (ver esa
            sección arriba), como parte del mismo calco del nodo de
            Figma `informacion-adicional-bottom-sheet`. Ana pidió
            separarlo en su propia sección ("no cambiar ficha del
            descubrimiento, es abajo donde te digo que pongas
            información adicional").

            Recorte a 2 filas + 1 nueva — mismo día, pedido de Ana con
            una captura de referencia de Airbnb (pantalla de detalle de
            tour, sección de política/requisitos): "de info adicional
            vas a dejar solo lo de no se permite grabar y la
            recomendacion y vas a agregar politica de cancelacion, algo
            como lo que dice en la ref sobre la politica". Se sacan
            Duración e Idioma de acá — no se pierden, ya viven en "Ficha
            del descubrimiento" (evita, de paso, la duplicación que
            había quedado pendiente de una entrega anterior) — y quedan
            Puntualidad + No grabar + la nueva Política de cancelación.
            Cancelación es texto genérico compartido, mismo criterio que
            puntualidad/grabación (política operativa, no un dato
            curatorial por pieza) — contenido de la política tomado como
            referencia de tono de la captura de Airbnb, no copiado
            literal (esta app no tiene el mismo plazo/condición real
            todavía, es primera pasada). */}
        {experiencia && (
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl text-white-100">
              Información adicional
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <IconAlertCircle className="w-4 h-4 text-white-100 opacity-50 shrink-0 mt-0.5" />
                <p className="flex-1 font-body text-sm text-white-100 leading-[1.4]">
                  Se recomienda llegar 20 minutos antes — el ingreso se
                  cierra al iniciar la función.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <IconCameraOff className="w-4 h-4 text-white-100 opacity-50 shrink-0 mt-0.5" />
                <p className="flex-1 font-body text-sm text-white-100 leading-[1.4]">
                  No se permite grabar ni fotografiar durante la función,
                  por respeto a los artistas y al resto del público.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <IconCalendarX className="w-4 h-4 text-white-100 opacity-50 shrink-0 mt-0.5" />
                <p className="flex-1 font-body text-sm text-white-100 leading-[1.4]">
                  Cancelación gratuita hasta 24 horas antes de la
                  función — después de ese plazo no hay reembolso.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-white-100">
            Contenido similar
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {id &&
              getRelatedExperiences(id, 4).map((relacionada) => (
                <Link key={relacionada.id} to={`/experiencia/${relacionada.id}`}>
                  <SupportingCard
                    id={relacionada.id}
                    tag={relacionada.tag}
                    title={relacionada.title}
                    venue={relacionada.venue}
                    city={relacionada.city}
                    imageUrl={relacionada.imageUrl}
                    size="compact"
                    showFavorito
                  />
                </Link>
              ))}
          </div>
        </section>
      </div>
      )}

      {/* CTA fijo — Button real, verificado en vivo en Figma 2026-09-02.
          Ojo: el catálogo de Button tiene DOS variantes de Primary —
          Surface=Light (fondo off-white, fill Green/100, texto blanco) y
          Surface=Green (`1879:639`, para pantallas oscuras como esta:
          fondo off-white #fbfbfb, texto Green/100). Detalle es
          bg-thea-green, así que corresponde Surface=Green: fondo
          white-100, texto thea-green, h-48px, rounded-xl (12px, NO
          rounded-full), Instrument Sans SemiBold 15px tracking 0.3px
          (NO font-display). La primera corrección que hice (fill
          thea-green) estaba mal — con el fondo del footer también
          thea-green el botón quedaba invisible.

          Texto "Ver opciones" en vez de "Reservar" — 2026-09-03, a
          pedido de Ana. ARCHITECTURE.md (17/08) definía este CTA como
          "Reservar", pero tocarlo hoy no reserva nada todavía: lleva a
          Compra, donde recién ahí se elige fecha/hora/asiento — "Reservar"
          prometía más de lo que el botón hace en el momento de tocarlo.
          "Ver opciones" cubre las 3 cosas que se eligen ahí (fecha, hora
          Y asiento), no solo fecha — por eso se prefirió sobre "Ver
          fechas"/"Ver disponibilidad" (alternativas evaluadas con Ana).
          Solo cambia el copy — mismo componente Button, mismo estilo.

          2026-09-07 — hubo por un rato una versión deshabilitada de este
          botón para un estado "sin disponibilidad" (`experiencia.agotada`).
          Ana decidió que Theaveling no debe mostrar contenido sin
          disponibilidad ("esa opcion la podemos quitar") — se revirtió
          del todo, el botón vuelve a estar siempre activo, como decía
          el comentario grande de arriba antes de este cambio.

          2026-09-08: oculto para los 3 festivales — no se "reserva" un
          festival completo, cada pieza de su programación se reserva
          por separado desde su propio Detalle (ver nota grande arriba
          de DetalleExperiencia()). "Visitar sitio oficial" ya cumple el
          rol de acción de cierre para estos 3, inline en el contenido
          en vez de fijo abajo. */}
      {!esFestivalCiudad && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-thea-green border-t border-white-12">
          <button
            onClick={() => navigate(`/experiencia/${id}/compra`)}
            className="w-full h-12 rounded-xl bg-white-100 text-thea-green font-body font-semibold text-[15px] leading-5 tracking-[0.3px]"
          >
            Ver opciones
          </button>
        </div>
      )}
    </div>
  );
}
