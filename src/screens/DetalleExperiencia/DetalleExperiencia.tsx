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
  IconCreditCard,
  IconFlag,
  IconGlobe,
  IconMap,
  IconMapPin,
  IconMinus,
  IconPlus,
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
import ExperienceCardDescubrimientosDesktop from "../../components/cards/ExperienceCardDescubrimientosDesktop";
import { MapPreview } from "../../components/MapPreview";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import GaleriaFotosDesktop from "../../components/GaleriaFotosDesktop";
import CalendarioFechaHora from "../../components/CalendarioFechaHora";
import MapaButacas from "../../components/MapaButacas";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import { useDescubrirTab } from "../../context/DescubrirTabContext";
import {
  esGratis,
  formatCOP,
  generarFechasReales,
  generarOpcionesFechaHora,
  horaCompacta,
  parsePriceToNumber,
} from "../../utils/price";
import { useReservations } from "../../context/ReservationsContext";
import { useAuth } from "../../context/AuthContext";

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
  // DesktopNavbar — 2026-09-14, a pedido de Ana: "en todas las pantallas
  // acompana la navbar". Esta pantalla no la tenía (era "de profundidad",
  // con su propio botón de volver — decisión vieja documentada en
  // VerMas.tsx) pero Ana ahora la pide en todas. Se reusa el MISMO
  // Context que ya comparten Descubrir.tsx/DesktopNavbar (`activeCategory`)
  // en vez de un estado propio — así, si se toca un tab o el wordmark
  // desde acá, se vuelve a Descubrir con esa pestaña ya activa.
  const { activeCategory, setActiveCategory } = useDescubrirTab();
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

  /*
   * Reserva en Desktop — 2026-09-14, a pedido de Ana: mandó 3 referencias
   * de Fever y pidió que el Detalle de Desktop "vaya en 1 con la de
   * booking" — o sea, fusionar Detalle + Compra en UNA sola pantalla acá
   * (nada de esto toca mobile, que sigue yendo a `/experiencia/:id/compra`
   * como siempre, ver el CTA fijo más abajo dentro del bloque `lg:hidden`).
   * Todo este estado es exclusivo del bloque Desktop de más abajo — se
   * declara acá arriba (no adentro del JSX condicional) porque son Hooks
   * de React, tienen que llamarse siempre en el mismo orden sin importar
   * qué bloque (mobile/desktop) termine visible, mismo criterio que ya
   * usa `Descubrir.tsx` para su estado compartido entre las 2 versiones.
   *
   * Se declara un `useState` propio en vez de reusar/mover el de
   * Compra.tsx — son 2 pantallas distintas (mobile sigue navegando a su
   * propia ruta), no tiene sentido acoplar sus estados.
   */
  const [pasoDesktop, setPasoDesktop] = useState<"detalle" | "pago">("detalle");
  const [fechaHoraIndiceDesktop, setFechaHoraIndiceDesktop] = useState<number | null>(null);
  const [cantidadDesktop, setCantidadDesktop] = useState(1);
  const [butacasElegidasDesktop, setButacasElegidasDesktop] = useState<string[]>([]);
  const [mapaAbiertoDesktop, setMapaAbiertoDesktop] = useState(false);
  // "agregale la opcion para calendario" / respuesta de Ana sobre cómo
  // debía verse: "ícono que cambia la vista" — ver CalendarioFechaHora.tsx.
  const [vistaCalendarioDesktop, setVistaCalendarioDesktop] = useState(false);
  const [procesandoPagoDesktop, setProcesandoPagoDesktop] = useState(false);
  // "Comunidad" en Desktop — 2026-09-14, a pedido de Ana con una
  // referencia de Airbnb (encabezado con puntaje grande + link "Cómo
  // funcionan las evaluaciones", reseñas más grandes). Se toma la
  // ESTRUCTURA, NO los datos que no tenemos: la referencia trae un
  // desglose por categoría (Limpieza 4.8, Veracidad 4.9...) y etiquetas
  // con conteo (Ubicación 86, Playa 6...) que no existen en el catálogo
  // por experiencia — Ana confirmó explícitamente no inventar esos
  // números, así que esas 2 piezas NO se agregan acá.
  //
  // 2026-09-14, misma tarde: pasó de grid vertical de 2 columnas a riel
  // horizontal centrado ("deja de acompanar hasta que empiezan los
  // comentarios qeu tambien tiene que estar centrados y con scroll
  // horizontal") — mismo mecanismo que "Contenido similar" más abajo.
  // Con scroll horizontal + card de alto fijo ya no hace falta guardar
  // qué reseña está expandida (el "Mostrar más" por reseña se saca,
  // el texto trunca a `line-clamp` fijo).
  const { agregarReserva } = useReservations();
  const { requireAuth } = useAuth();

  const opcionesFechaHoraDesktop = experiencia
    ? generarOpcionesFechaHora(experiencia.date)
    : [];
  const fechasRealesDesktop = experiencia ? generarFechasReales(experiencia.date) : [];
  const tieneMapaButacasDesktop = experiencia?.asientoAsignado ?? false;
  const cantidadEfectivaDesktop = tieneMapaButacasDesktop
    ? butacasElegidasDesktop.length
    : cantidadDesktop;
  const toggleButacaDesktop = (clave: string) => {
    setButacasElegidasDesktop((prev) =>
      prev.includes(clave) ? prev.filter((k) => k !== clave) : [...prev, clave],
    );
  };
  const gratisDesktop = experiencia ? esGratis(experiencia.price) : false;
  const unitarioDesktop = experiencia ? parsePriceToNumber(experiencia.price) : 0;
  const totalDesktop = gratisDesktop ? 0 : unitarioDesktop * cantidadEfectivaDesktop;
  const totalLabelDesktop = gratisDesktop
    ? "Gratis"
    : `${experiencia?.mostrarDesde ? "Desde " : ""}${formatCOP(totalDesktop)}`;
  const { fecha: fechaElegidaDesktop, hora: horaElegidaDesktop } =
    opcionesFechaHoraDesktop[fechaHoraIndiceDesktop ?? 0] ?? { fecha: "", hora: "" };
  const fechaCompletaDesktop = fechaElegidaDesktop
    ? `${fechaElegidaDesktop}${horaElegidaDesktop ? ` · ${horaElegidaDesktop}` : ""}`
    : "";

  const confirmarPagoDesktop = () => {
    requireAuth("Inicia sesión para continuar con tu reserva.", () => {
      setProcesandoPagoDesktop(true);
      window.setTimeout(() => {
        setProcesandoPagoDesktop(false);
        if (id) {
          agregarReserva({
            experienciaId: id,
            fechaHora: fechaCompletaDesktop,
            estado: "proxima",
          });
        }
        // `state` — 2026-09-14, a pedido de Ana: la versión Desktop de
        // Confirmacion.tsx (nueva, ver ese archivo) muestra una tarjeta
        // de resumen con fecha/hora/entradas/total, igual a la que ya se
        // ve acá en el paso "pago". Ese detalle NO se guarda en
        // `Reserva` (solo guarda `fechaHora` como texto, ver
        // ReservationsContext.tsx) — pasarlo por `state` de la
        // navegación evita agrandar ese modelo compartido con mobile
        // solo para esto. Si Confirmacion.tsx se abre sin este `state`
        // (ej. alguien recarga la página en esa URL), cae a un resumen
        // más simple — ver ese archivo.
        navigate(`/experiencia/${id}/confirmacion`, {
          state: {
            fecha: fechaElegidaDesktop,
            hora: horaElegidaDesktop,
            cantidad: cantidadEfectivaDesktop,
            totalLabel: totalLabelDesktop,
          },
        });
      }, 1500);
    });
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
    <>
    {/* Mobile — todo el contenido de siempre, sin tocar, solo envuelto en
        `lg:hidden` para convivir con el bloque Desktop de más abajo
        (mismo criterio que Descubrir.tsx/VerMas.tsx). */}
    <div
      className={`min-h-screen bg-thea-green text-white-100 font-body lg:hidden ${
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

    {/* Desktop — 2026-09-14, a pedido de Ana: mandó 3 referencias de
        Fever (tour de Zipaquirá) y pidió, en sus propias palabras:
        "vamos para la pantalla de detalle... la pantalla tiene que tener
        toda la info que hoy tenemos, pero las fotos deben estar en este
        formato, van a ser 3... y esta pantalla debe ir en 1 con la de
        booking, como en la otra ref, pero ahí ya sabes que no va
        calendario sino como en la card de booking que creamos para
        mobile... y también agrégale la opción para calendario".

        3 decisiones que resolvió Ana en el camino (ver AskUserQuestion
        de esta entrega):
        1. Galería de 3 fotos (1ra ref) — solo hay 1 foto real por pieza
           (`imageUrl`), las otras 2 quedan vacías. Ver
           GaleriaFotosDesktop.tsx.
        2. Detalle + Booking fusionados en una sola pantalla (2da ref) —
           NO una pantalla nueva ni una ruta nueva: columna de contenido
           a la izquierda + sidebar de reserva STICKY a la derecha, todo
           en este mismo componente. Mobile sigue exactamente igual,
           navegando a `/experiencia/:id/compra` (bloque de arriba,
           intacto).
        3. El sidebar de reserva NO calca el calendario de Fever — calca
           la card de booking real que ya existe en Compra.tsx (chips de
           fecha/hora, tipo de entrada, cantidad/mapa de butacas), PERO
           con un ícono de calendario al lado de "Fecha y hora próximas"
           que cambia esa sección a un calendario real (Ana: "ícono que
           cambia la vista") — ver CalendarioFechaHora.tsx. Todo el
           estado de esta reserva (fecha/hora/cantidad/butacas/vista) es
           NUEVO y propio de este bloque (`...Desktop`, ver el comentario
           grande junto a esos `useState`, más arriba en este archivo) —
           no se toca ni se reusa el de Compra.tsx, son 2 pantallas
           distintas.
        4. "Siguiente" en el sidebar no navega a ninguna ruta nueva —
           cambia `pasoDesktop` a "pago" y ESTA MISMA pantalla se
           convierte en el paso de "Confirmar y pagar" (3ra ref, Ana:
           "debe pasar exactamente lo de la ref que te voy a pasar"): 2
           columnas, izquierda con lo que el proyecto SÍ tiene real
           (forma de pago demo, cupones, cancelación, aviso legal — el
           mismo contenido que ya vive en ConfirmarPagoSheet.tsx para
           mobile, no se duplica su redacción, se reflowa a 2 columnas)
           y derecha con la card de resumen sticky (foto, título, lugar,
           fecha, entradas, precio) — igual que el resumen que ya arma
           ConfirmarPagoSheet.tsx, no una card nueva inventada. No se
           calcan los campos de Fever sin dato real detrás ("Select your
           guide", nombres de titulares de boleto) — mismo criterio de
           "no inventar sin base real" de todo el proyecto.

        Festivales (`esFestivalCiudad`) — estas 3 refs son sobre el flujo
        de UNA pieza reservable; los 3 festivales de la ciudad no se
        reservan como tal (ver nota grande arriba de
        DetalleExperiencia()). Para no dejarlos sin nada en Desktop, se
        arma una versión de una sola columna (sin sidebar de reserva,
        mismo criterio que mobile no le pone el CTA fijo) con el mismo
        contenido simplificado que ya tiene mobile para festivales.

        Fondo — 2026-09-14, a pedido de Ana: este wrapper había quedado en
        `bg-thea-green` (#112c2c, el verde "claro"/normal del body), pero
        el resto del chrome de Desktop sin foto detrás (Descubrir.tsx,
        VerMas.tsx) usa el verde bien oscuro `rgb(1,20,20)` ("verde deep")
        — mismo criterio documentado en Descubrir.tsx. Se corrige acá para
        que las pantallas de Desktop no queden desparejas entre sí. No
        toca la versión mobile (`lg:hidden` más arriba), que sigue en
        `bg-thea-green` como siempre. */}
    <div className="hidden bg-[rgb(1,20,20)] text-white-100 font-body lg:block">
      {/* DesktopNavbar — 2026-09-14, a pedido de Ana: "en todas las
          pantallas acompana la navbar". El componente ya es `sticky
          top-0` por su cuenta (ver DesktopNavbar.tsx) — acá solo hace
          falta montarlo. `onChange` no solo cambia la pestaña del
          Context compartido: además vuelve a Descubrir (`navigate("/")`),
          porque desde acá no hay ningún listado de categorías que
          mostrar — tocar un tab o el wordmark lleva a Descubrir ya con
          esa pestaña activa. */}
      <DesktopNavbar
        active={activeCategory}
        onChange={(tab) => {
          setActiveCategory(tab);
          navigate("/");
        }}
      />
      {mensajeCompartir && (
        <span
          className="fixed top-6 right-10 z-30 whitespace-nowrap rounded-full bg-thea-deep px-4 py-2 font-body text-sm text-white-100 shadow-lg"
          role="status"
        >
          {mensajeCompartir}
        </span>
      )}

      {pasoDesktop === "detalle" ? (
        <div className="mx-auto max-w-[1200px] px-20 pb-24 pt-10">
          {/* "Volver" — 2026-09-14, a pedido de Ana: "quita el volver de
              esta pantalla, en desk no lo necesitamos" (Desktop no
              depende de un botón de volver como mobile, hay navbar +
              historial del navegador). Compartir/Favorito se mudan junto
              al título de la experiencia, más abajo — ver ese comentario
              en cada rama (festival/regular). */}
          <GaleriaFotosDesktop imageUrl={experiencia?.imageUrl} />

          {esFestivalCiudad ? (
            <div className="mx-auto mt-10 flex max-w-[800px] flex-col gap-16">
              <div className="flex flex-col gap-3">
                <span className="font-body font-semibold text-xs uppercase tracking-[0.5px] text-thea-mint">
                  Festival
                </span>
                {/* Compartir/Favorito al lado del título — 2026-09-14, a
                    pedido de Ana (ver nota grande junto al "Volver" que
                    se sacó más arriba): "pon compartir y corazon al lado
                    del titulo de la ex". */}
                <div className="flex items-start justify-between gap-6">
                  <h1 className="font-display text-4xl font-thin tracking-[-1px] text-white-100">
                    {experiencia?.title}
                  </h1>
                  <div className="flex shrink-0 items-center gap-5 pt-2">
                    <button
                      onClick={compartir}
                      aria-label="Compartir"
                      className="flex items-center gap-2 font-body text-sm text-white-60 transition-colors hover:text-white-100"
                    >
                      <IconShare className="h-4 w-4" />
                      Compartir
                    </button>
                    {id && <FavoritoButton id={id} />}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-body font-semibold text-sm text-white-100">
                  <span className="flex items-center gap-1.5">
                    <IconMapPin className="h-4 w-4 opacity-60" />
                    {experiencia?.city}
                  </span>
                  <span className="text-white-40">·</span>
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="h-4 w-4 opacity-60" />
                    {experiencia?.date}
                  </span>
                </div>
                <p className="font-body text-base leading-relaxed text-white-70">
                  {experiencia?.description}
                </p>
                {lineupFestival.length > 0 && (
                  <p className="font-body text-sm text-white-50">
                    {categoriasLineup.join(" · ")} · {lineupFestival.length}{" "}
                    {lineupFestival.length === 1 ? "experiencia" : "experiencias"}
                  </p>
                )}
              </div>

              <section className="flex flex-col gap-5">
                <h2 className="font-display text-2xl text-white-100">
                  Explora la programación
                </h2>
                {lineupFestival.length > 0 ? (
                  <>
                    {categoriasLineup.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {(["Todo", ...categoriasLineup] as const).map((cat) => {
                          const activa = cat === categoriaLineupActiva;
                          return (
                            <button
                              key={cat}
                              onClick={() => setCategoriaLineupActiva(cat)}
                              className={`shrink-0 rounded-full px-4 py-2 font-body font-semibold text-[13px] ${
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
                    <div className="grid grid-cols-3 gap-4">
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
                  <p className="text-sm text-white-80">
                    Programación pendiente de confirmar.
                  </p>
                )}
              </section>

              {venuesLineup.length > 1 && (
                <section className="flex flex-col gap-5">
                  <h2 className="font-display text-2xl text-white-100">Dónde sucede</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {venuesLineup.map((v) => (
                      <div key={v.venue} className="flex flex-col gap-1.5 rounded-xl bg-white-8 p-4">
                        <p className="font-display text-base text-white-100">{v.venue}</p>
                        <span className="flex items-center gap-1.5 font-body text-xs text-white-60">
                          <IconMapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          {v.venueBarrio ? `${v.venueBarrio} · ${v.city}` : v.city}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-col gap-3">
                <h2 className="font-display text-2xl text-white-100">Sobre el festival</h2>
                <p className="font-body text-[15px] leading-normal text-white-70">
                  {experiencia?.curiosidadDelLugar}
                </p>
                {experiencia?.artista && (
                  <p className="font-body text-sm text-white-60">
                    Organiza: {experiencia.artista.nombre}
                  </p>
                )}
              </section>

              {experiencia && (
                <a
                  href={googleSearchUrl(`${experiencia.title} sitio oficial`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 self-start font-body font-semibold text-[15px] text-white-100 underline"
                >
                  <IconTicket className="h-4 w-4" />
                  Visitar sitio oficial
                </a>
              )}
            </div>
          ) : (
            <>
            <div className="mt-10 grid grid-cols-[1fr_400px] items-start gap-16">
              {/* Columna de contenido — mismo texto/data que mobile arriba
                  en este archivo (¡NO tocado!), solo reflowado a una
                  columna más ancha en vez de todo el viewport. */}
              <div className="flex min-w-0 flex-col gap-16">
                <div className="flex flex-col gap-4">
                  {/* Compartir/Favorito al lado del título — 2026-09-14,
                      a pedido de Ana ("pon compartir y corazon al lado
                      del titulo de la ex"), en vez del header de arriba
                      con "Volver" que se sacó (ver esa nota). */}
                  <div className="flex items-start justify-between gap-6">
                    <h1 className="font-display text-4xl font-thin tracking-[-1px] text-white-100">
                      {experiencia?.title}
                    </h1>
                    <div className="flex shrink-0 items-center gap-5 pt-2">
                      <button
                        onClick={compartir}
                        aria-label="Compartir"
                        className="flex items-center gap-2 font-body text-sm text-white-60 transition-colors hover:text-white-100"
                      >
                        <IconShare className="h-4 w-4" />
                        Compartir
                      </button>
                      {id && <FavoritoButton id={id} />}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-body font-semibold text-sm">
                      <span className="text-thea-mint">★</span>{" "}
                      <span className="text-white-100">
                        {experiencia ? experiencia.rating : "—"}
                      </span>{" "}
                      {experiencia && (
                        <span className="font-normal text-white-50">
                          ({experiencia.ratingCount})
                        </span>
                      )}
                    </span>
                    <span className="text-white-30">·</span>
                    <span className="flex items-center gap-1.5 font-body text-sm text-white-60">
                      <IconMapPin className="h-4 w-4 opacity-60" />
                      {experiencia?.venue}, {experiencia?.city}
                    </span>
                  </div>
                  <p className="max-w-[640px] font-body text-base leading-relaxed text-white-70">
                    {experiencia?.description ??
                      "Descripción corta pendiente de contenido real."}
                  </p>
                </div>

                <section className="flex flex-col gap-4">
                  <h2 className="font-display text-2xl text-white-100">
                    Por qué descubrir esto
                  </h2>
                  <p className="max-w-[720px] font-body text-[15px] leading-normal text-white-70">
                    {experiencia?.porQueDescubrir ??
                      "Argumento curatorial de Theaveling — pendiente de contenido real."}
                  </p>
                </section>

                <section className="flex flex-col gap-4">
                  <h2 className="font-display text-2xl text-white-100">
                    Ficha del descubrimiento
                  </h2>
                  {experiencia?.ficha ? (
                    (() => {
                      // Dos columnas INDEPENDIENTES (flex), no un
                      // `grid-cols-2` — 2026-09-14, corregido a pedido de
                      // Ana ("la ficha del descubrimiento tiene lo de
                      // restriccion muy abajo" / "corrigelo para que se
                      // vea el espaciado homogeneo"). Con `grid`, cada
                      // FILA fuerza a las 2 celdas de esa fila a la misma
                      // altura — cuando "Duración" (derecha) es un texto
                      // largo de 3 líneas e "Idioma" (izquierda, misma
                      // fila) es corto ("Español"), la fila entera se
                      // estira a la altura de "Duración" y deja un hueco
                      // vacío enorme debajo de "Idioma" antes de que
                      // "Restricción de edad" pueda empezar — eso es lo
                      // que se veía "muy abajo". El intento anterior
                      // (`col-span-2` en el último ítem) no alcanzaba
                      // porque el hueco aparecía ANTES, dentro de esa
                      // misma fila. Con 2 columnas de `flex flex-col`
                      // separadas, cada una apila sus propios ítems con
                      // el mismo gap fijo, sin que la altura de un ítem
                      // de una columna empuje nada en la otra — mismo
                      // criterio ya usado en otras partes de la app para
                      // evitar este problema de `grid`.
                      const items = [
                        [IconRepeat, "Presentaciones", experiencia.ficha.presentaciones],
                        [IconFlag, "Festivales", experiencia.ficha.festivales],
                        [IconAward, "Premios", experiencia.ficha.premios],
                        [IconBookOpen, "Origen", experiencia.ficha.origen],
                        [IconGlobe, "Idioma", experiencia.ficha.idioma],
                        [IconClock, "Duración", experiencia.duracion ?? "Pendiente de confirmar."],
                        [
                          IconShieldCheck,
                          "Restricción de edad",
                          experiencia.restriccionEdad ?? "Todo público.",
                        ],
                      ] as const;
                      const columnaIzquierda = items.filter((_, i) => i % 2 === 0);
                      const columnaDerecha = items.filter((_, i) => i % 2 === 1);
                      const renderItem = ([Icon, label, value]: (typeof items)[number]) => (
                        <div key={label} className="flex items-start gap-3">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white-100 opacity-50" />
                          <div className="flex flex-1 flex-col gap-0.5">
                            <span className="font-body text-sm text-white-70">{label}</span>
                            <span className="font-body text-sm leading-[1.4] text-white-100">
                              {value}
                            </span>
                          </div>
                        </div>
                      );
                      return (
                        <div className="flex max-w-[720px] gap-8">
                          <div className="flex flex-1 flex-col gap-4">
                            {columnaIzquierda.map(renderItem)}
                          </div>
                          <div className="flex flex-1 flex-col gap-4">
                            {columnaDerecha.map(renderItem)}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-sm text-white-80">
                      Duración, restricción de edad, presentaciones, festivales,
                      premios, origen, idioma — pendiente de contenido real.
                    </p>
                  )}
                </section>

                <section className="flex flex-col items-start gap-4">
                  <h2 className="font-display text-2xl text-white-100">Quiénes hacen parte</h2>
                  {experiencia?.artista ? (
                    <div className="flex w-full flex-col gap-4">
                      {/* orientacion="horizontal" — 2026-09-14, a pedido de
                          Ana: "la card de quienes hacen parte esta muy
                          alta, debe ser mas cuadrada o rectangular". Ver
                          nota grande en ArtistSpaceCard.tsx — no cambia
                          nada en mobile/Compra.tsx. */}
                      <ArtistSpaceCard
                        nombre={experiencia.artista.nombre}
                        categoria={experiencia.artista.categoria}
                        ciudad={experiencia.artista.ciudad}
                        imageUrl={experiencia.artista.imageUrl}
                        orientacion="horizontal"
                      />
                      {experiencia.artista.saludo && (
                        <p className="font-body text-sm leading-[1.5] text-white-80">
                          {experiencia.artista.saludo}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-white-80">
                      Quiénes hacen parte — pendiente de contenido real.
                    </p>
                  )}
                </section>
              </div>

              {/* Sidebar de reserva — sticky, ver comentario grande de
                  arriba (punto 3). `top-10` deja el mismo aire que el
                  padding superior de la columna de al lado.

                  Deja de acompañar antes de "Comunidad" — 2026-09-14,
                  corregido dos veces a pedido de Ana. Primero pidió "cuando
                  se llegue al mapa, ahi para de acompanar la card para
                  fecha y hora" (el grid terminaba después de "Sobre el
                  lugar"), pero después aclaró que el punto real es antes:
                  "deja de acomnar hasta que empiezan los comentarios" /
                  "o sea el selector deja de acompanar hasta las reseñas".
                  Por eso el grid de 2 columnas ahora TERMINA justo después
                  de "Quiénes hacen parte" — "Comunidad", "Sobre el lugar",
                  Información adicional y Contenido similar se movieron
                  abajo, fuera del grid (ver esas secciones más abajo). Como
                  `sticky` se resuelve contra la altura de su propio
                  contenedor, al terminar el grid ahí la card deja de tener
                  más scroll del que acompañar, en vez de seguir hasta el
                  final de la pantalla.

                  Fondo blanco — 2026-09-14, a pedido de Ana: primero
                  pidió el texto "Total" en blanco, pero al ver que no
                  cambiaba nada visible aclaró que el pedido era "el
                  fondo de toda la tarjeta". Se convierte toda la card a
                  superficie clara — mismo criterio de paleta ya usado en
                  LoginSheet.tsx y en la Booking Summary Card de
                  ConfirmarPagoSheet.tsx (`bg-white-100 border
                  border-green-12`, texto `thea-green`/`green-70`/
                  `green-50`, superficies `green-12`/`green-8`, botón
                  primario invertido a `bg-thea-green text-white-100`
                  porque un botón blanco ya no resalta sobre una card
                  blanca). `CalendarioFechaHora` se actualizó junto con
                  esto (es exclusivo de esta card). `MapaButacas` es
                  compartido con mobile (Compra.tsx) — ahí se agregó un
                  `variant="light"` en vez de tocar su paleta por
                  defecto, así mobile no cambia en nada.

                  `top-24` (antes `top-10`) — 2026-09-14, a pedido de Ana:
                  "el scroll hacia abajo el selector, toda la card se vea
                  completa, ahora mismo esta como comiendoce un pedazo de
                  arriba". Al agregar `DesktopNavbar` (también `sticky`,
                  h-20/80px) arriba de esta pantalla, un `top-10` (40px) en
                  la card quedaba por DEBAJO del borde inferior del navbar
                  — la tarjeta se pegaba a 40px del viewport, pero el
                  navbar (que ocupa hasta los 80px y va encima en el
                  stacking) le tapaba ese pedazo de arriba. `top-24`
                  (96px) dejá a la card pegarse justo debajo del navbar,
                  con un poco de aire (16px). */}
              {experiencia && (
                <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-green-12 bg-white-100 p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="font-body font-semibold text-sm text-thea-green">
                        Fecha y hora próximas
                      </p>
                      <button
                        onClick={() => setVistaCalendarioDesktop((v) => !v)}
                        aria-label="Ver calendario"
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          vistaCalendarioDesktop ? "bg-thea-mint text-thea-green" : "text-green-50 hover:bg-green-8"
                        }`}
                      >
                        <IconCalendar className="h-4 w-4" />
                      </button>
                    </div>

                    {vistaCalendarioDesktop ? (
                      <CalendarioFechaHora
                        opciones={opcionesFechaHoraDesktop}
                        fechasReales={fechasRealesDesktop}
                        indiceSeleccionado={fechaHoraIndiceDesktop}
                        onSeleccionar={setFechaHoraIndiceDesktop}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {opcionesFechaHoraDesktop.slice(0, 4).map((opcion, i) => {
                          const seleccionado = i === fechaHoraIndiceDesktop;
                          return (
                            <button
                              key={`${opcion.fecha}-${opcion.hora}`}
                              onClick={() => setFechaHoraIndiceDesktop(i)}
                              className={`flex w-full flex-col gap-0.5 rounded-xl border-2 px-4 py-3 ${
                                seleccionado
                                  ? "border-thea-mint bg-green-12"
                                  : "border-transparent bg-green-8"
                              }`}
                            >
                              <span className="whitespace-nowrap font-body font-semibold text-sm text-thea-green">
                                {opcion.fecha}
                              </span>
                              {opcion.hora && (
                                <span className="font-body text-xs text-green-50">
                                  {horaCompacta(opcion.hora)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="font-body font-semibold text-sm text-thea-green">Tipo de entrada</p>
                    <div className="flex w-full items-center justify-between rounded-xl bg-green-12 px-4 py-3.5">
                      <span className="font-body font-semibold text-sm text-thea-green">General</span>
                      <span className="font-body font-semibold text-sm text-thea-green">
                        {gratisDesktop
                          ? "Gratis"
                          : `${experiencia.mostrarDesde ? "Desde " : ""}${experiencia.price}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="font-body font-semibold text-sm text-thea-green">Entradas</p>
                      {tieneMapaButacasDesktop && (
                        <button
                          onClick={() => setMapaAbiertoDesktop((v) => !v)}
                          className="flex items-center gap-1"
                        >
                          <IconMap className="h-4 w-4 text-thea-green opacity-70" />
                          <span className="font-body text-[13px] text-thea-green underline underline-offset-2 opacity-70">
                            Ver mapa de butacas
                          </span>
                        </button>
                      )}
                    </div>
                    {tieneMapaButacasDesktop && mapaAbiertoDesktop && (
                      <MapaButacas
                        experienciaId={experiencia.id}
                        seleccionadas={butacasElegidasDesktop}
                        onToggle={toggleButacaDesktop}
                        variant="light"
                      />
                    )}
                    <div className="flex items-center justify-between rounded-xl border border-green-12 bg-green-8 px-4 py-3.5">
                      <span className="font-body text-sm text-thea-green">Cantidad de personas</span>
                      {tieneMapaButacasDesktop ? (
                        <span className="font-body font-semibold text-sm text-thea-green [font-variant-numeric:tabular-nums]">
                          {cantidadEfectivaDesktop}
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCantidadDesktop((c) => Math.max(1, c - 1))}
                            disabled={cantidadDesktop <= 1}
                            aria-label="Menos personas"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-12 text-thea-green disabled:opacity-30"
                          >
                            <IconMinus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-4 text-center font-body font-semibold text-sm text-thea-green [font-variant-numeric:tabular-nums]">
                            {cantidadDesktop}
                          </span>
                          <button
                            onClick={() => setCantidadDesktop((c) => Math.min(6, c + 1))}
                            disabled={cantidadDesktop >= 6}
                            aria-label="Más personas"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-12 text-thea-green disabled:opacity-30"
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-px w-full bg-green-12" />

                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-green-50">Total</span>
                    <span className="font-display font-semibold text-xl text-thea-green">
                      {totalLabelDesktop}
                    </span>
                  </div>

                  <button
                    onClick={() => setPasoDesktop("pago")}
                    disabled={fechaHoraIndiceDesktop === null || cantidadEfectivaDesktop === 0}
                    className="h-12 w-full rounded-xl bg-thea-green font-body font-semibold text-[15px] leading-5 tracking-[0.3px] text-white-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            {/* Comunidad — 2026-09-14, sale del grid de 2 columnas (ver
                nota grande junto al sidebar) porque el selector de fecha
                deja de acompañar justo acá: "deja de acomnar hasta que
                empiezan los comentarios qeu tambien tiene que estar
                centrados y con scroll horizontal". Pasa de grid vertical
                de 2 columnas a riel horizontal a lo ancho completo de la
                pantalla — mismo mecanismo que "Contenido similar" más
                abajo (`flex gap-X overflow-x-auto scrollbar-none`, cards
                `shrink-0` de ancho fijo) — y por eso queda "centrada"
                dentro del mismo contenedor `max-w-[1200px]` de toda la
                pantalla, en vez de acotada al ancho angosto de la
                columna de contenido de antes.

                Jerarquía visual de las cards — 2026-09-14, a pedido de
                Ana ("dale mas jerarquia visual a las cards de
                valoraciones"): avatar más grande con acento en
                `thea-mint` (color de marca, en vez del círculo gris
                plano de antes), nombre en tamaño mayor, la calificación
                pasa a su propia fila destacada en mint (antes iba
                apretada junto a la fecha en texto chico), y el texto de
                la reseña sube un escalón de tamaño. Se saca el botón
                "Mostrar más" por reseña (venía de la referencia de
                Airbnb en grid vertical): con card de alto fijo en un
                riel horizontal, un `line-clamp` fijo alcanza — no hay
                más estado que guardar por reseña. */}
            <section className="mt-16 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-body font-semibold text-2xl text-white-100">
                  <span className="text-thea-mint">★</span>{" "}
                  {experiencia ? experiencia.rating : "—"}
                  {experiencia && (
                    <span className="text-white-60"> · {experiencia.ratingCount} evaluaciones</span>
                  )}
                </p>
                <button
                  type="button"
                  className="self-start font-body text-sm text-white-100 underline underline-offset-2"
                >
                  Cómo funcionan las evaluaciones
                </button>
              </div>

              <p className="font-body text-sm text-white-60">Personas que estuvieron aquí</p>

              {/* Ancho 240px + gap-6 — 2026-09-14: mismo cálculo que
                  "Contenido similar" más abajo (4 cards de 240px caben en
                  los ~1040px de esta columna con gap-6/24px), para que se
                  vean 4 reseñas de entrada y el resto corra el riel hacia
                  la derecha, mismo criterio que pidió Ana para ese otro
                  riel. */}
              <div className="flex gap-6 overflow-x-auto scrollbar-none">
                {(experiencia?.resenas ?? []).slice(0, 6).map((reseña, i) => (
                  <div
                    key={`${reseña.nombre}-${i}`}
                    className="flex h-[260px] w-[240px] shrink-0 flex-col gap-4 rounded-2xl bg-white-8 p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-thea-mint/30 bg-thea-mint/15">
                        <span className="font-display text-base text-thea-mint">
                          {reseña.nombre.charAt(0)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body font-semibold text-base text-white-100">
                          {reseña.nombre}
                        </span>
                        <span className="font-body text-xs text-white-50">{reseña.fecha}</span>
                      </div>
                    </div>
                    <span className="font-body font-semibold text-sm text-thea-mint">
                      ★ {reseña.rating}
                    </span>
                    <p className="line-clamp-4 flex-1 font-body text-[15px] leading-[1.5] text-white-80">
                      {reseña.texto}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="self-start rounded-lg bg-white-8 px-5 py-2.5 font-body font-medium text-sm text-white-100"
              >
                Mostrar todo{experiencia ? `: ${experiencia.ratingCount} evaluaciones` : ""}
              </button>
            </section>

            {/* Sobre el lugar — 2026-09-14, sale del grid junto con
                "Comunidad" (ver nota grande de acá arriba) por el mismo
                motivo: el selector de fecha ya dejó de acompañar antes de
                llegar acá.

                Foto+datos del lugar — 2026-09-14, corregido a pedido de
                Ana: la primera versión le puso el mismo `max-w-[720px]
                mx-auto` que "Por qué descubrir esto"/"Ficha del
                descubrimiento", pero acá se veía mal porque el título
                "Sobre el lugar" queda pegado a la izquierda (como el
                resto de los títulos de la pantalla) mientras que este
                bloque quedaba centrado/angosto por debajo — "esta parte
                el lugar tiene que quedar hacia izq, pero con el alcance
                del texto mas hacia la derecha". Se saca el `mx-auto
                max-w-[720px]` de la foto+texto (y del divisor de abajo):
                quedan pegados a la izquierda, igual que el título, y el
                texto (`flex-1`) se estira hasta el ancho completo de la
                sección en vez de cortarse a los 720px.

                El mapa mantiene su propio tratamiento "centrado y más
                grande" (`mx-auto max-w-[480px]` en MapPreview, pedido
                original de Ana, reconfirmado acá) — ese bloque (mapa +
                dirección + contexto de barrio) sí se deja en su columna
                de `max-w-[720px] mx-auto` propia, para que el mapa se
                siga viendo como un bloque centrado y no una franja de
                punta a punta. */}
            {experiencia && (
              <section className="mt-16 flex flex-col gap-6">
                <h2 className="font-display text-2xl text-white-100">Sobre el lugar</h2>
                <div className="flex w-full gap-6">
                  {experiencia.venueImageUrl ? (
                    <img
                      src={experiencia.venueImageUrl}
                      alt=""
                      className="h-56 w-[280px] shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-56 w-[280px] shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        background: "linear-gradient(to right, #ebe9e6, #dcdad6, #cfcdc9)",
                      }}
                    >
                      <IconBuilding className="h-8 w-8 text-thea-green opacity-40" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <p className="font-display text-xl tracking-[-0.1px] text-white-100">
                        {experiencia.venue}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-white-12 px-2 py-1 font-body text-[10px] font-semibold uppercase text-white-100">
                          {experiencia.venueCategoria ?? "Espacio cultural"}
                        </span>
                        <span className="font-body text-xs text-white-50">
                          {experiencia.venueBarrio
                            ? `${experiencia.venueBarrio} • ${experiencia.city}`
                            : experiencia.city}
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-sm leading-[1.4] text-white-100">
                      {experiencia.curiosidadDelLugar ??
                        "Curiosidad del lugar — pendiente de contenido real."}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-white-12" />

                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
                  {/* Un poco más grande — 2026-09-14, a pedido de Ana
                      ("pon el mapa mas grandecito"): sube de 320×480 a
                      400×600, sigue centrado (`mx-auto`) dentro de esta
                      misma columna de 720px. */}
                  <MapPreview
                    venue={experiencia.venue}
                    city={experiencia.city}
                    variant="dark"
                    className="mx-auto h-[400px] max-w-[600px]"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-body text-[13px] text-white-60">
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
                  <p className="font-body text-sm leading-[1.4] text-white-100">
                    {experiencia.contextoBarrio ??
                      "Contexto del barrio — pendiente de contenido real."}
                  </p>
                </div>
              </section>
            )}

            {/* Información adicional + Contenido similar — 2026-09-14, a
                pedido de Ana: "conteneido similar va mas abajo" +
                "cuando se llegue al mapa, ahi para de acompanar la card
                para fecha y hora". Ambas secciones salen del grid de 2
                columnas (ver nota grande junto al sidebar) y pasan a
                vivir acá, a lo ancho completo de la pantalla, debajo de
                todo el bloque columna+sidebar — ya no hay una columna de
                400px restándoles espacio. */}
            {experiencia && (
              <section className="mt-16 flex flex-col gap-4">
                <h2 className="font-display text-2xl text-white-100">Información adicional</h2>
                <div className="grid max-w-[720px] grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-white-100 opacity-50" />
                    <p className="flex-1 font-body text-sm leading-[1.4] text-white-100">
                      Se recomienda llegar 20 minutos antes — el ingreso se
                      cierra al iniciar la función.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconCameraOff className="mt-0.5 h-4 w-4 shrink-0 text-white-100 opacity-50" />
                    <p className="flex-1 font-body text-sm leading-[1.4] text-white-100">
                      No se permite grabar ni fotografiar durante la función,
                      por respeto a los artistas y al resto del público.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconCalendarX className="mt-0.5 h-4 w-4 shrink-0 text-white-100 opacity-50" />
                    <p className="flex-1 font-body text-sm leading-[1.4] text-white-100">
                      Cancelación gratuita hasta 24 horas antes de la función
                      — después de ese plazo no hay reembolso.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Contenido similar — 2026-09-14, corregido dos veces a
                pedido de Ana sobre qué card usar. Primero pidió "las
                cards de este deben ser como las de descubrimiento" y se
                usó `ExperienceCardGridDesktop` con `size="reservados"`
                — esa es la card de "Más reservados" (con hover-expand
                tipo Netflix y footer de rating/precio), NO la de
                "Descubrimientos". Ana corrigió: "las cards de contenido
                similar tienen que ser las mismas cards para
                descubrimientos" — la card real de esa sección es
                `ExperienceCardDescubrimientosDesktop` (ver la nota
                grande en ese archivo): sin hover-expand, sin precio/
                rating, solo zoom en la foto + tag/título/descripción de
                2 líneas/lugar debajo, SUELTA sin contenedor. Se reemplaza
                acá 1 a 1 — mismo componente, mismo ancho de card (280px)
                y mismo `gap-8` que usa ESE riel en Descubrir.tsx (antes
                240px/gap-6, un ancho inventado para esta pantalla que ya
                no aplica: esta card no tiene alto fijo ni necesita
                `relative`, así que se la deja calcular su propio alto
                igual que en Descubrir). Sigue con scroll horizontal
                (`overflow-x-auto`, sin flechas — `RailNavButtons` de
                Descubrir.tsx no se trajo acá, no lo pidió). */}
            <section className="mt-16 flex flex-col gap-4">
              <h2 className="font-display text-2xl text-white-100">Contenido similar</h2>
              <div className="flex gap-8 overflow-x-auto scrollbar-none">
                {id &&
                  getRelatedExperiences(id, 6).map((relacionada) => (
                    <Link
                      key={relacionada.id}
                      to={`/experiencia/${relacionada.id}`}
                      className="w-[280px] shrink-0"
                    >
                      <ExperienceCardDescubrimientosDesktop
                        id={relacionada.id}
                        tag={relacionada.tag}
                        title={relacionada.title}
                        description={relacionada.description}
                        venue={relacionada.venue}
                        city={relacionada.city}
                        imageUrl={relacionada.imageUrl}
                      />
                    </Link>
                  ))}
              </div>
            </section>
            </>
          )}
        </div>
      ) : experiencia ? (
        /* Paso "pago" — 2026-09-14, calca la 3ra referencia de Fever
           ("Confirmar y pagar"): 2 columnas, izquierda con lo que el
           proyecto ya tiene real (mismo contenido de
           ConfirmarPagoSheet.tsx, ver comentario grande de arriba),
           derecha con la card de resumen sticky. Sin ruta nueva — sigue
           siendo este mismo componente, `pasoDesktop` vuelve a
           "detalle" con "Modificar". */
        <div className="mx-auto max-w-[1200px] px-20 pb-40 pt-10">
          <button
            onClick={() => setPasoDesktop("detalle")}
            className="mb-8 flex items-center gap-2 font-body text-sm text-white-60 transition-colors hover:text-white-100"
          >
            <IconCaretRight className="h-4 w-4 rotate-180" />
            Confirmar y pagar
          </button>

          {procesandoPagoDesktop ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32">
              <div
                className="h-10 w-10 animate-spin rounded-full border-4"
                style={{ borderColor: "rgba(251,251,251,0.12)", borderTopColor: "#FBFBFB" }}
                role="status"
                aria-label="Procesando pago"
              />
              <p className="font-body text-sm text-white-70">Procesando tu pago…</p>
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_400px] items-start gap-16">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <p className="font-body font-semibold text-sm text-white-100">Forma de pago</p>
                  <div className="flex flex-col gap-2">
                    {[{ terminacion: "4242" }, { terminacion: "0002" }].map((tarjeta) => (
                      <div
                        key={tarjeta.terminacion}
                        className="flex items-center gap-3 rounded-2xl border border-white-12 px-4 py-3.5"
                      >
                        <IconCreditCard className="h-5 w-5 text-white-100 opacity-70" />
                        <span className="flex-1 font-body text-sm text-white-100">
                          Tarjeta terminada en {tarjeta.terminacion}
                        </span>
                        <span className="font-body text-[11px] uppercase tracking-[1px] text-white-40">
                          Demo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-body font-semibold text-sm text-white-100">Cupones</p>
                  <div className="flex items-center justify-between rounded-2xl border border-white-12 px-4 py-3.5">
                    <span className="font-body text-sm text-white-50">Ingresa un cupón</span>
                    <IconCaretRight className="h-4 w-4 text-white-40" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-body font-semibold text-sm text-white-100">Cancelación gratuita</p>
                  <div className="rounded-2xl border border-white-12 px-4 py-3.5">
                    <p className="font-body text-sm text-white-70">
                      Puedes cancelar sin costo hasta 24 horas antes de la
                      función y recibes un reembolso completo.
                    </p>
                  </div>
                </div>

                <p className="font-body text-xs text-white-50">
                  Al tocar "Confirmar y pagar" aceptas los términos de la
                  reserva de Theaveling. Esta es una demo — no se procesa
                  ningún pago real.
                </p>

                <button
                  onClick={confirmarPagoDesktop}
                  className="h-12 w-full max-w-[320px] rounded-xl bg-white-100 font-body font-semibold text-[15px] leading-5 tracking-[0.3px] text-thea-green"
                >
                  Confirmar y pagar
                </button>
              </div>

              {/* Card de resumen — mismo contenido que la Booking Summary
                  Card de ConfirmarPagoSheet.tsx (foto, título, Fecha/
                  Hora/Lugar/Entradas, Total), acá sticky en vez de
                  arriba de un sheet que scrollea.

                  `top-24` (antes `top-10`) — mismo ajuste que la card del
                  paso "detalle" (ver esa nota grande): con `DesktopNavbar`
                  ahora sticky arriba de toda la pantalla, `top-10` dejaba
                  el navbar tapando un pedazo de arriba de esta card. */}
              <div className="sticky top-24 flex flex-col overflow-hidden rounded-2xl border border-white-12 bg-white-6">
                <div className="relative h-40 bg-white-8">
                  {experiencia.imageUrl ? (
                    <img
                      src={experiencia.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-body font-semibold text-[11px] uppercase tracking-[1.5px] text-thea-mint">
                      {experiencia.category}
                    </span>
                    <h3 className="font-display text-xl tracking-[-0.1px] text-white-100">
                      {experiencia.title}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: "Fecha", value: fechaElegidaDesktop },
                      ...(horaElegidaDesktop ? [{ label: "Hora", value: `${horaElegidaDesktop} h` }] : []),
                      { label: "Lugar", value: `${experiencia.venue}, ${experiencia.city}` },
                      {
                        label: "Entradas",
                        value: `${cantidadEfectivaDesktop} ${cantidadEfectivaDesktop === 1 ? "persona" : "personas"}`,
                      },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white-20" />
                        <p className="font-body text-sm text-white-70">
                          <span className="font-semibold text-white-100">{row.label}: </span>
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="h-px w-full bg-white-12" />
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-white-50">Total</span>
                    <span className="font-display font-semibold text-xl text-white-100">
                      {totalLabelDesktop}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {/* DesktopFooter — 2026-09-14, a pedido de Ana: "en todas las
          pantallas acompana la parte de abajo donde dice sobre la
          politica etc" (antes solo vivía en Descubrir.tsx). */}
      <DesktopFooter />
    </div>
    </>
  );
}
