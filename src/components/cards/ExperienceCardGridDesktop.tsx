/*
 * "Experience Card" (Desktop, variantes Más reservados / Descubrimientos)
 * — nodos reales de Figma "Tarjeta de Experiencia" dentro de
 * `categoría-theaveling-cards desktop` (`1405:100` para Más reservados,
 * `1420:8` para Descubrimientos), traídos vía get_design_context
 * 2026-09-08. Estructuralmente son la MISMA card (imagen + tag +
 * título + descripción + metadata + divider + rating/precio) a 2
 * tamaños distintos — mismo criterio que documenta el propio sistema de
 * diseño ("Cinco variantes que comparten estructura", 01 — Foundations)
 * — así que acá viven como un solo componente con un prop `size`, en vez
 * de 2 archivos casi idénticos.
 *
 * Grilla → riel de scroll — spec original del nodo de Figma era grilla
 * de columnas fija ("Contenedor Escritorio", `display: flex` con estas
 * cards a ancho fijo/flexible según la sección). 2026-09-10, a pedido de
 * Ana ("utiliza las expe que tambien salen en mobile pero utiliza
 * scroll"): `Descubrir.tsx` ahora arma estas 2 secciones como riel de
 * scroll horizontal (mismo criterio que mobile), no grilla — esta card
 * sigue sirviendo igual con `w-full h-full`, ahora dentro de un
 * contenedor de ancho fijo + `shrink-0` en vez de una columna de grid.
 *
 * Fondo — el nodo de Figma usa rgba(251,251,251,0.06) — arrancó como
 * `bg-white-6` (el token real más cercano, 6%), pero Ana encontró el
 * problema real de tener un fondo semitransparente en una card que se
 * agranda y se superpone a otras al hacer hover ("se ve todo por debajo
 * por lo que es transparente" — con 6% de blanco, lo que hay detrás
 * — otra card, la imagen de al lado — se transparentaba). 2026-09-11:
 * pasa a `bg-thea-green` (`#112c2c`, sólido, mismo token que ya usan
 * LoginSheet/ConfirmarPagoSheet/etc.) — no se inventa un color nuevo,
 * es el verde base de Theaveling, un toque más claro que el
 * `bg-[rgb(1,20,20)]` sólido del fondo de esta pantalla de Desktop
 * (Descubrir.tsx), así que la card se sigue distinguiendo del fondo
 * pero ahora es 100% opaca. El nodo de Figma también traía un borde
 * (`rgba(...,0.15)`), pero se sacó — 2026-09-11, a pedido de Ana ("no
 * quiero border en las cards").
 *
 * Botón de favorito — `FavoritoButton` reusado tal cual (drop-shadow,
 * sin chip), mismo motivo que en `ExperienceCardCuradoDesktop.tsx`.
 *
 * Hover-expand tipo Netflix/Teatrix (las 2 variantes) — 2026-09-10/11, a
 * pedido de Ana (mandó 2 capturas de Teatrix: al hacer hover la card se
 * agranda y se superpone a las vecinas SIN moverlas, mostrando el texto
 * COMPLETO). Aplica a "reservados" Y "descubrimientos" por igual (Ana:
 * "pedi que cuando en hover AMBAS se muestren completas").
 *
 * Por qué `onMouseEnter`/`onMouseLeave` y no `hover:`/`group-hover:` de
 * Tailwind — primer y segundo intento (mismo día) usaban las variantes
 * CSS de Tailwind. Функcionaban perfecto acá (verificado con Playwright),
 * pero Ana seguía sin ver NADA en su máquina incluso después de reiniciar
 * el servidor de cero. Causa real: desde Tailwind 3.4, `hover:` compila
 * a `@media (hover: hover) { &:hover }` — en cualquier pantalla que el
 * navegador reporte SIN capacidad de hover "real" (típico en laptops con
 * pantalla táctil, o ciertas configuraciones), esa regla nunca se activa
 * aunque el mouse esté literalmente encima. Por eso reiniciar el server
 * no cambiaba nada: no era caché ni build viejo, era esto. Solución:
 * estado de React (`useState` + `onMouseEnter`/`onMouseLeave`) en vez de
 * CSS puro — reacciona al mouse de verdad sin depender de esa detección.
 *
 * Mecánica — el `<Link>` que envuelve esta card en `Descubrir.tsx` tiene
 * tamaño FIJO (`relative` + alto fijo), y esta card vive `absolute`
 * adentro, anclada por `top-0`/`left-0`/`right-0` (no por los 4 lados).
 * En reposo tiene `h-full` (llena ese alto fijo, igual que toda card
 * normal). Al hacer hover se le saca el `h-full` — la altura pasa a ser
 * la que necesite su contenido (imagen + texto revelado), así que el
 * fondo/panel de la card CRECE de verdad para cubrir el texto completo,
 * en vez de quedarse del tamaño de antes con el texto desbordando por
 * fuera (bug real que reportó Ana: "no esta abarcando el texto, se
 * sale"). Como sigue siendo `position: absolute`, ese crecimiento no
 * empuja nada de la fila.
 *
 * Ancho real en hover — 2026-09-11, dos pedidos seguidos de Ana:
 * (1) "no se despliegue solo hacia abajo... que se haga mas grandecita...
 * no se vea todo super embutido" — se probó `scale-110` (transform)
 * encima del alto real, y agrandaba ancho Y alto, pero (2) "no me gusta
 * que se vea mas larga que ancha" — con la descripción completa (hasta
 * ~390 caracteres) en un ancho angosto, salía una card muy alta y flaca,
 * proporción fea. Se saca el `scale` y en su lugar el ancho también
 * crece DE VERDAD (no por transform, vía `style={{ width }}`): en
 * reposo `left-0 right-0` (ancho = el del `<Link>`, 280px), en hover
 * pasa a un ancho fijo de 420px — bastante más ancha de verdad, para
 * que el texto envuelva en menos líneas y la proporción quede más
 * pareja. Sigue siendo `position: absolute` con altura real (no fija)
 * como ya se explicó arriba, así que el fondo sigue cubriendo todo el
 * texto. También sube de `z-index` para pintarse por encima de las
 * vecinas.
 *
 * Centrada, no anclada a un lado — 2026-09-11, a pedido de Ana ("dejala
 * centrada, noto que como que cambia de puesto, sobre todo las dos
 * centrales"): un primer intento anclaba `left-0` (crecía solo hacia la
 * derecha) o `right-0` (solo hacia la izquierda) según hiciera falta —
 * funcionaba sin cortarse, pero se sentía como que la card "saltaba" de
 * lugar en vez de agrandarse en el mismo sitio. Ahora `left` es un
 * número en px (`corrimientoIzquierda`, por `style`, no una clase fija)
 * calculado para que el ancho nuevo quede CENTRADO sobre el mismo punto
 * medio de la card en reposo — la mitad del crecimiento para cada lado.
 * Únicamente si esa posición centrada se saldría del riel (cards de la
 * punta izquierda o derecha) se corrige lo mínimo necesario para quedar
 * pegada a ese borde en vez de cortarse — la gran mayoría de las cards
 * (las del medio del riel) quedan perfectamente centradas. Chequeado
 * con Playwright en las 2 puntas del riel, no se corta en ninguna.
 *
 * 2026-09-11, a pedido de Ana ("solo las que se vean enteras se van a
 * agrandar"): el riel (`Descubrir.tsx`) marca su contenedor de scroll
 * con `data-scroll-rail`. Al entrar el mouse, se compara el borde
 * izquierdo/derecho de ESTA card contra el de ese contenedor — si la
 * card está parcialmente tapada (asomando apenas en el borde del riel),
 * no se agranda. Solo agrandan las que se ven completas.
 *
 * Alto en hover — se probó un alto FIJO por tipo de card (`ALTO_HOVER`),
 * a pedido de Ana ("en la expansion tambien todas deben medir lo mismo").
 * Pero un alto fijo mayor al que pide el contenido real, combinado con
 * `mt-auto` en la fila de rating/precio (ver nota de abajo), dejaba un
 * hueco vacío ENTRE el texto y esa fila — justo lo que Ana señaló como
 * "espacios innecesarios" en las cards expandidas. 2026-09-12: se saca
 * `ALTO_HOVER`, el alto en hover vuelve a ser el que pida el contenido
 * (intrínseco).
 *
 * 2026-09-12 (más tarde, mismo día) — Ana mandó un video de Teatrix
 * ("tan fluido y pausado a la vez, simplemente hermoso") y notó que las
 * cards chicas de Curado (`ExperienceCardCuradoGridDesktop`, alto FIJO)
 * no tienen ese problema, a diferencia de estas: "por alguna razon las
 * de curado no quedaron con ese bug, tal vez podrias copiar lo que
 * hiciste ahi?". Causa real: con alto INTRÍNSECO, cada card crece una
 * cantidad DISTINTA según cuánto texto tenga de verdad (medido con
 * Playwright: 399-427px en "reservados", 344-369px en
 * "descubrimientos") — al mover el mouse rápido entre varias, cada una
 * "salta" a un alto distinto, se ve irregular/poco prolijo comparado con
 * Curado, donde todas crecen SIEMPRE lo mismo (190→300, un número fijo).
 * Ahora que ya no existe el `mt-auto` que causaba el hueco vacío (ver
 * nota de la fila de rating/precio, más abajo), volver a un alto FIJO
 * es seguro: cualquier aire de sobra que quede en una card con menos
 * texto cae DESPUÉS de la fila de rating/precio (el contenido se apila
 * arriba con `gap-3`, sin `mt-auto` que empuje nada al fondo) — el mismo
 * lugar "seguro" ya usado para el alto normal (348px). `ALTO_HOVER` (uno
 * por tamaño, medido con margen sobre el máximo real de cada uno) vuelve
 * a existir, y con el alto ya conocido de antemano el centrado vertical
 * se vuelve a calcular directo en el propio `onMouseEnter` — igual que
 * el horizontal, y mismo criterio que ya usa
 * `ExperienceCardCuradoGridDesktop` — sin necesitar la corrección
 * imperativa post-render que tenía esta card con alto intrínseco. Lo que
 * ya mantenía las cards parejas en ANCHO de contenido (no en alto) sigue
 * siendo el `line-clamp-3` de la descripción — Ana ya había sido clara
 * con esto ("para que sean parejas tenemos lo de las 3 lineas que te
 * dije, no seas ridiculo").
 *
 * Rating/precio — 2026-09-11, a pedido de Ana ("en el estado normal la
 * puntuacion y precio... esta muy al raz del borde interior de la card,
 * centrala bien"): esta fila tenía `mt-auto` para pegarse al fondo de un
 * contenedor `flex-1`, más un `pb-*` propio (`pb-3` en estado normal,
 * `pb-1` en hover) para no quedar pegada al borde.
 *
 * 2026-09-12, a pedido de Ana ("esa linea puede estar mas arriba y la
 * card incluso ser mas chica" en normal; "espacios innecesarios" en
 * expandida): ese `mt-auto` era el problema — pegaba la fila al fondo de
 * un contenedor más alto de lo que el contenido necesitaba, dejando un
 * hueco vacío ANTES de la línea divisoria (en vez de después, que se ve
 * bien). Se saca `mt-auto`: la fila de rating/precio ahora queda
 * pegada al contenido de arriba con el mismo `gap-3` que ya separa el
 * resto de los bloques — cualquier aire que sobre por el alto fijo de la
 * card (ver `Descubrir.tsx`) queda DESPUÉS del precio, no antes, que es
 * donde se nota mucho menos.
 *
 * 2026-09-12 (tercera vuelta), a pedido de Ana ("quitale un tris, nada
 * practicamente" al espacio debajo del precio/puntuación): medido con
 * Playwright, el alto fijo de la card (348px, ver Descubrir.tsx) ya
 * dejaba solo ~1px de sobra sobre el contenido real (347px) — el
 * comentario de arriba sobre "~17px de aire" quedó desactualizado por
 * cambios posteriores de tamaño. Es decir, ya no había casi nada para
 * sacarle achicando el alto fijo (bajarlo de más recorta contenido de
 * verdad, se probó y corta ~7px del precio en TODAS las cards por
 * igual). El recorte real que pidió Ana sale de acá: el padding inferior
 * de este contenedor de texto baja de `pb-4` (16px) a `pb-3` (12px) — 4px
 * menos, "un tris" — y el alto fijo de la card se ajusta en
 * `Descubrir.tsx` a la nueva medida real (343px) para que seguir sin
 * cortar nada.
 */
import { useLayoutEffect, useRef, useState } from "react";
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

type Size = "reservados" | "descubrimientos";

// 2026-09-11, a pedido de Ana ("hagamos mas pequeñas las cards, todas
// van a tener el mismo tamaño ahora excepto las de curado"): "reservados"
// y "descubrimientos" pasan a medir exactamente lo mismo (antes 280px/
// 240px de imagen y text-2xl/text-xl de título) — se achican las 2 al
// tamaño que antes tenía la más chica, no un tamaño nuevo intermedio. El
// prop `size` se deja tal cual (por si el día de mañana vuelven a
// diferenciarse), pero hoy los 2 valores del record son iguales a
// propósito. Curado no usa este componente (usa
// ExperienceCardCuradoDesktop), así que no le afecta este cambio.
const IMAGE_HEIGHT: Record<Size, string> = {
  reservados: "h-[160px]",
  descubrimientos: "h-[160px]",
};

const TITLE_SIZE: Record<Size, string> = {
  reservados: "text-lg",
  descubrimientos: "text-lg",
};

export default function ExperienceCardGridDesktop({
  id,
  tag,
  title,
  description,
  venue,
  city,
  rating,
  price,
  imageUrl,
  mostrarDesde,
  size,
}: {
  id: string;
  tag: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  rating: string;
  price: string;
  imageUrl?: string;
  mostrarDesde?: boolean;
  size: Size;
}) {
  const [hovered, setHovered] = useState(false);
  // 2026-09-11, a pedido de Ana ("dejala centrada, noto que como que
  // cambia de puesto, sobre todo las dos centrales") — ver nota grande
  // "Ancho real en hover" más abajo para el motivo completo. Guarda
  // cuánto hay que correr el borde izquierdo (en px, relativo a su
  // posición normal) para que el ancho nuevo quede centrado sobre el
  // mismo punto medio de siempre, en vez de crecer solo para un lado.
  const [corrimientoIzquierda, setCorrimientoIzquierda] = useState(0);
  // 2026-09-12 (segunda vuelta, ver nota grande "Alto en hover" arriba):
  // vuelve a existir un alto fijo en hover, así que el corrimiento
  // vertical vuelve a calcularse de antemano en el propio `onMouseEnter`,
  // igual que `corrimientoIzquierda` — ya no hace falta la corrección
  // imperativa post-render que tenía esta card con alto intrínseco.
  const [corrimientoArriba, setCorrimientoArriba] = useState(0);
  const ANCHO_HOVER = 420;
  // Medido con Playwright sobre el contenido real de todas las cards de
  // cada sección (máximo real: 427px en "reservados" — la única con fila
  // de rating/precio —, 369px en "descubrimientos"), con un margen chico
  // de sobra para no cortar por redondeo de píxeles.
  const ALTO_HOVER: Record<Size, number> = {
    reservados: 430,
    descubrimientos: 372,
  };

  // 2026-09-11/12, a pedido de Ana varias veces seguidas ("una animación
  // horrible, se ve como si corriera", después "quiero que el
  // movimiento se dé de lo pequeño hacia lo grande, no como si entrara
  // deslizándose"): los intentos anteriores animaban `left`/`width`/alto
  // como propiedades de layout (números en px que van cambiando de a
  // poco). Es correcto en teoría, pero a simple vista se lee como que la
  // card se CORRE de lugar mientras crece, no como que "crece desde
  // chiquita" — porque el borde izquierdo literalmente se está
  // trasladando por la pantalla al mismo tiempo que el ancho cambia.
  //
  // La técnica correcta acá (la misma que usan Netflix/YouTube para
  // este efecto) se llama FLIP: la card salta DE UNA al tamaño y
  // posición final (sin transición en left/width/alto — son valores
  // fijos, no se animan), pero en ese mismo instante, antes de que el
  // navegador pinte nada, se le aplica un `transform: translate(...)
  // scale(...)` calculado para que se vea EXACTAMENTE en el lugar y
  // tamaño de antes. Recién en el frame siguiente ese transform se
  // anima de vuelta a "nada" (identity). Como lo único que se anima es
  // un `transform` anclado en su propio centro, el ojo lo lee como
  // "crece desde chiquita hacia grande, en el mismo lugar" — no como
  // que se desliza para un lado.
  const cardRef = useRef<HTMLDivElement>(null);
  const rectAntesRef = useRef<DOMRect | null>(null);

  // Guarda cómo se ve la card AHORA, justo antes de cambiarle
  // hovered/posición — se llama tanto al entrar como al salir el mouse.
  const guardarRectAntes = () => {
    if (cardRef.current) {
      rectAntesRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  // 2026-09-12, a pedido de Ana ("hay algo raro cuando esta expandida y
  // uno toca tantito entre afuera y adentro de los bordes... se buguea
  // raro"): al estar expandida, la card ocupa más espacio del que tenía
  // el mouse originalmente encima — si el cursor queda justo en el
  // borde de esa card grande, cualquier temblor mínimo del mouse (un
  // pixel para un lado o el otro) hace que el navegador dispare
  // mouseLeave y mouseEnter en cadena sin parar: sale → la card se
  // achica → como se achicó, el cursor puede volver a quedar "adentro"
  // → entra de nuevo → se agranda → vuelve a quedar en el borde... así
  // en loop, se ve como un parpadeo/bug. La solución estándar para esto
  // es NO achicarla de una al salir: se espera un instante corto (80ms)
  // por si el mouse vuelve a entrar (temblor) antes de recién ahí
  // achicarla de verdad. Si en ese instante entra de nuevo, se cancela
  // el achique y no pasa nada — ahí no hay ningún parpadeo.
  const leaveTimeoutRef = useRef<number | null>(null);

  const cancelarSalidaPendiente = () => {
    if (leaveTimeoutRef.current !== null) {
      window.clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  useLayoutEffect(() => {
    return () => cancelarSalidaPendiente();
  }, []);

  // 2026-09-12, bug real que mandó Ana en video: al mover el mouse rápido
  // de esta card a la de al lado (dentro del mismo riel), durante un
  // instante se veían las DOS agrandadas y superpuestas — una encima de
  // la otra, feo. Causa: cada card maneja su propio hover de forma
  // aislada, así que al entrar a la vecina, esta card recién se entera
  // de que "salió" el mouse (su propio `onMouseLeave`) y se achica con SU
  // animación normal (80ms de espera + 300ms de transición) mientras la
  // vecina ya está agrandándose con la suya — dos animaciones de 300ms+
  // corriendo al mismo tiempo, superpuestas en pantalla.
  //
  // Arreglo: cuando una card empieza a agrandarse de verdad, avisa por un
  // evento en el propio riel ("solo esta card creció, las demás
  // achíquense YA"). Cualquier otra card de ESE riel que esté expandida
  // en ese momento se achica DE UNA, sin animación — tiene sentido: el
  // mouse ya se fue de ahí, nadie la está mirando en su forma grande, así
  // que no hace falta la transición suave que sí tiene sentido cuando el
  // achique lo dispara el propio mouse saliendo.
  //
  // 2026-09-12 (segunda vuelta) — Ana lo siguió viendo pasar en su uso
  // real (mandó una captura: 2 cards bien agrandadas y superpuestas, con
  // el mismo fondo así que se leía como una sola card rarísima de ancha)
  // aunque en Playwright, con hovers simulados, nunca se pudo reproducir.
  // La causa real es una condición de carrera: `hoveredRef` se
  // actualizaba en un `useLayoutEffect` — es decir, un instante DESPUÉS
  // de que React procese el cambio de estado, no en el mismo instante en
  // que pasa. Si el mouse se mueve MUY rápido (entra a esta card y de
  // ahí a la de al lado, todo antes de que ese efecto llegue a correr),
  // la vecina consulta `hoveredRef.current` de esta card y todavía lo ve
  // en `false` (desactualizado) — cree que esta card no está expandida y
  // no la resetea, aunque en los hechos SÍ lo está. Con el mouse real
  // (no con `.hover()` de Playwright, que salta directo sin pasar por
  // los eventos intermedios de un movimiento de verdad) esto sí llega a
  // pasar. Arreglo: además de este efecto (que queda de respaldo),
  // `hoveredRef.current` también se actualiza de forma directa e
  // INMEDIATA en el propio `onMouseEnter`/`onMouseLeave` de más abajo, en
  // el mismo momento en que se decide expandir o achicar — sin esperar
  // ninguna vuelta de React de por medio, así que no queda ninguna
  // ventana de tiempo en la que otra card pueda leer un valor viejo.
  const hoveredRef = useRef(hovered);
  useLayoutEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  const EVENTO_HOVER = "theaveling:hover-card";

  useLayoutEffect(() => {
    const el = cardRef.current;
    const rail = el?.closest("[data-scroll-rail]") as HTMLElement | null;
    if (!rail) return;
    const alEmpezarOtraCard = (evento: Event) => {
      const otroId = (evento as CustomEvent<{ id: string }>).detail?.id;
      if (otroId === id || !hoveredRef.current) return;
      cancelarSalidaPendiente();
      const elActual = cardRef.current;
      if (elActual) {
        // Sin transición: esta card ya no tiene el mouse encima, se saltea
        // el FLIP (no hace falta animar algo que nadie está mirando).
        elActual.style.transition = "none";
        elActual.style.transform = "";
      }
      rectAntesRef.current = null;
      // También inmediato — ver nota grande "condición de carrera" más
      // arriba: si esta card fuera la que resetea a una TERCERA que se
      // agranda enseguida después, esa tercera tiene que ver este cambio
      // ya mismo, no recién en la próxima vuelta de React.
      hoveredRef.current = false;
      setHovered(false);
    };
    rail.addEventListener(EVENTO_HOVER, alEmpezarOtraCard);
    return () => rail.removeEventListener(EVENTO_HOVER, alEmpezarOtraCard);
  }, [id]);

  useLayoutEffect(() => {
    const el = cardRef.current;
    const antes = rectAntesRef.current;
    if (!el || !antes) return;
    rectAntesRef.current = null;

    const despues = el.getBoundingClientRect();
    // 2026-09-12, a pedido de Ana ("veo que se corta la foto, mira la
    // forma de que crezca sin que se vea afectada la visualización de
    // la foto"): acá usaba una escala DISTINTA en X y en Y (una por
    // ancho, otra por alto) — matemáticamente daba el tamaño exacto de
    // "antes", pero al ser distintas, deformaba TODO lo que hay adentro
    // de la card mientras crecía, la foto incluida (se veía estirada/
    // recortada de forma rara). Ahora se usa UNA sola escala (la del
    // ancho, que es siempre la misma para todas las cards) para los 2
    // ejes — la foto crece pareja, sin deformarse en ningún momento de
    // la animación.
    //
    // 2026-09-12 (más tarde) — bug real que Ana mandó en video: al salir
    // rápido del mouse y volver a entrar, la card se veía momentáneamente
    // ESTIRADA hacia abajo (más alta de lo normal) y sin la descripción,
    // como si la imagen "creciera de más". Causa real, encontrada
    // reproduciendo el movimiento de mouse con Playwright: la card
    // expandida (420×430, con descripción) y la card en reposo (280×343,
    // sin descripción) NO tienen la misma proporción ancho/alto — usar
    // SIEMPRE la escala del ancho para los 2 ejes (como se explica arriba)
    // solo da un resultado correcto cuando se está CRECIENDO (achica el
    // alto un poco de más, algo casi imperceptible). Al ACHICARSE
    // (`hovered` pasa a `false`, la descripción ya se sacó del DOM), esa
    // misma escala de ancho aplicada al alto real ya achicado se pasa de
    // largo — literalmente estira la card más alta que su propio máximo
    // (430px) durante la animación, con la parte de más quedando vacía
    // porque el contenido (la descripción) ya no está. Reproducido con
    // Playwright moviendo el mouse fuera y adentro rápido: la caja real
    // durante la animación llegaba a medir 443px de alto (por encima del
    // máximo real, 430px).
    // Arreglo: al CRECER se sigue usando la escala del ancho (sin eso,
    // Ana ya había reportado la foto deformada). Al ACHICARSE se usa la
    // escala del ALTO en su lugar — ahí no hay foto de por medio
    // deformándose de forma notoria (la imagen dentro achica un poco menos
    // de ancho de lo ideal por un instante, invisible en la práctica), y
    // se evita por completo el estirado de más que causaba el bug.
    const escala = hovered
      ? antes.width / despues.width
      : antes.height / despues.height;
    const trasladoX =
      antes.left + antes.width / 2 - (despues.left + despues.width / 2);
    const trasladoY =
      antes.top + antes.height / 2 - (despues.top + despues.height / 2);
    // Paso 1 ("Invert"): salto instantáneo, disfrazado con un transform
    // para que siga viéndose como antes.
    el.style.transition = "none";
    el.style.transform = `translate(${trasladoX}px, ${trasladoY}px) scale(${escala})`;
    // Fuerza al navegador a aplicar ese estilo ya mismo (si no, podría
    // saltar directo al paso 2 y no habría nada que animar).
    void el.getBoundingClientRect();
    // Paso 2 ("Play"): en el frame siguiente, se anima de vuelta a su
    // tamaño/posición real (transform vacío).
    const id = requestAnimationFrame(() => {
      el.style.transition = "transform 300ms ease-out";
      el.style.transform = "";
    });
    return () => cancelAnimationFrame(id);
  }, [hovered, corrimientoIzquierda, corrimientoArriba]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={(e) => {
        // Si había una salida pendiente (ver nota grande "hay algo raro
        // cuando esta expandida" más arriba), se cancela: el mouse
        // volvió antes de que llegara a achicarse. Como ya está
        // expandida con los valores correctos, no hace falta recalcular
        // nada de nuevo.
        cancelarSalidaPendiente();
        if (hovered) return;
        // 2026-09-11, a pedido de Ana ("solo las que se vean enteras se
        // van a agrandar") — ver nota grande arriba.
        const rail = e.currentTarget.closest(
          "[data-scroll-rail]",
        ) as HTMLElement | null;
        const cardRect = e.currentTarget.getBoundingClientRect();
        const extra = ANCHO_HOVER - cardRect.width;
        // Por default, centrada: mitad del crecimiento para cada lado.
        let corrimiento = -extra / 2;
        if (rail) {
          const railRect = rail.getBoundingClientRect();
          const completa =
            cardRect.left >= railRect.left - 0.5 &&
            cardRect.right <= railRect.right + 0.5;
          if (!completa) return;
          // Si centrada se corta contra un borde del riel (recorta de
          // verdad en el eje horizontal), se corrige lo mínimo para que
          // quede pegada a ESE borde en vez de cortarse — solo las
          // cards de la punta del riel caen acá, las del medio quedan
          // centradas de verdad.
          const nuevaIzquierda = cardRect.left + corrimiento;
          const nuevaDerecha = nuevaIzquierda + ANCHO_HOVER;
          if (nuevaIzquierda < railRect.left) {
            corrimiento = railRect.left - cardRect.left;
          } else if (nuevaDerecha > railRect.right) {
            corrimiento = railRect.right - ANCHO_HOVER - cardRect.left;
          }
        }
        // Vertical: mismo criterio que el horizontal — con el alto en
        // hover ya fijo y conocido de antemano (ver nota grande "Alto en
        // hover" arriba), el centrado (mitad del crecimiento para
        // arriba, mitad para abajo) se calcula directo acá, sin esperar
        // a que se renderice. El riel tiene un `pt`/`-mt` de sobra (ver
        // Descubrir.tsx) para que ese crecimiento hacia arriba no se
        // corte.
        const corrimientoVertical = -(ALTO_HOVER[size] - cardRect.height) / 2;
        //
        // Avisa a las demás cards de este riel que ESTA es la que se está
        // agrandando ahora — ver nota grande "bug real que mandó Ana en
        // video" más arriba: así cualquier otra que haya quedado
        // expandida se achica de una, sin pisarse con esta.
        if (rail) {
          rail.dispatchEvent(
            new CustomEvent(EVENTO_HOVER, { detail: { id } }),
          );
        }
        guardarRectAntes();
        setCorrimientoIzquierda(corrimiento);
        setCorrimientoArriba(corrimientoVertical);
        // Directo e inmediato (no vía el `useLayoutEffect` de arriba) —
        // ver nota grande "condición de carrera" más arriba: así ninguna
        // vecina que se agrande justo después puede leer un valor viejo.
        hoveredRef.current = true;
        setHovered(true);
      }}
      onMouseLeave={() => {
        // No se achica de una — ver nota grande "hay algo raro cuando
        // esta expandida" más arriba. Se espera un instante corto por si
        // el mouse vuelve a entrar (temblor justo en el borde).
        leaveTimeoutRef.current = window.setTimeout(() => {
          leaveTimeoutRef.current = null;
          guardarRectAntes();
          hoveredRef.current = false;
          setHovered(false);
        }, 80);
      }}
      className={`absolute flex flex-col gap-4 overflow-hidden rounded-xl bg-thea-green transition-shadow duration-300 ${
        hovered ? "z-20 shadow-2xl" : "top-0 left-0 right-0 h-full"
      }`}
      style={
        hovered
          ? {
              // Alto fijo (`ALTO_HOVER`) y `top` ya calculado en
              // `onMouseEnter` para quedar centrada — ver nota grande
              // "Alto en hover" arriba.
              top: corrimientoArriba,
              left: corrimientoIzquierda,
              width: ANCHO_HOVER,
              height: ALTO_HOVER[size],
            }
          : undefined
      }
    >
      {/* 2026-09-12, a pedido de Ana ("que la img se tome toda la parte
          de arriba de la card, que se vuelva sus bordes de arriba"):
          antes la imagen SIEMPRE tenía el mismo inset de 16px por los 4
          lados que el resto de la card (venía del `p-4` del contenedor
          padre). En hover, ahora, la imagen va pegada a los bordes de
          arriba/izquierda/derecha (sin margen) — el propio
          `overflow-hidden rounded-xl` de la card (el div de más arriba)
          se encarga de redondearle solo las 2 esquinas de arriba, sin
          que la imagen necesite su propio radio. En estado normal sigue
          exactamente igual que antes (con su margen e inset propio). El
          padding que antes ponía el contenedor padre para los otros
          lados (izquierda/derecha/abajo) ahora lo pone directamente el
          bloque de texto de más abajo. */}
      <div
        className={`relative shrink-0 overflow-hidden bg-white-8 ${IMAGE_HEIGHT[size]} ${
          hovered ? "" : "mx-4 mt-4 rounded-lg"
        }`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
        <FavoritoButton id={id} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-3">
        <div className="flex flex-col gap-1">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.7px] text-thea-mint">
            {tag}
          </span>
          {/* 2026-09-12, a pedido de Ana ("lo mismo el titulo, si es muy
              largo, entonces suspensivos"): mismo criterio que la línea
              de venue/ciudad de acá abajo — un tope para que un título
              excepcionalmente largo no rompa la homogeneidad entre
              cards. En la práctica casi todos los títulos ya entran en 2
              líneas (el patrón "Título: Subtítulo" que usan la mayoría),
              así que este `line-clamp-2` rara vez llega a cortar algo de
              verdad — es más un techo de seguridad que un cambio visible
              hoy. */}
          <h3
            className={`font-display line-clamp-2 ${TITLE_SIZE[size]} tracking-[-0.3px] text-white-100`}
          >
            {title}
          </h3>
        </div>
        {/* rgba(251,251,251,.7)/.5 — mismos valores sueltos que ya usan
            las cards de esta familia en mobile, ver ExperienceCardMasReservados.tsx.

            2026-09-11, a pedido de Ana ("pedi que cuando en hoover ambas
            se muestren completas"): en estado normal, ninguna de las 2
            variantes muestra descripción ni venue/fecha — solo tag,
            título y rating/precio. En hover aparecen los 2 párrafos.
            Se usa `hovered` (estado de React, ver nota grande arriba) en
            vez de `group-hover` de Tailwind.

            2026-09-11 (más tarde, mismo día), a pedido de Ana
            ("estandariza, que crezca máximo tres líneas... hay que poner
            puntos suspensivos y ya en detalle se expande"): la
            descripción SÍ se corta ahora a 3 líneas (`line-clamp-3`),
            con "…" si no entra completa — el texto completo sigue
            estando en la pantalla de Detalle de la experiencia. Esto
            además de responder al pedido, deja el alto de la card en
            hover mucho más parejo entre todas (ya no depende de si la
            descripción real tiene 2 o 10 líneas).

            2026-09-12, mismo criterio para la línea de venue/ciudad, dos
            vueltas seguidas a pedido de Ana:
            (1) "sacale la hora a todas" — se le sacó el horario, después
            (2) "quita las fechas de ambas, para eso hay varias fechas
            como para poner ahi solo una, solo el lugar y la ciudad" — la
            fecha (no solo la hora) se saca del todo: esta card es de una
            experiencia que puede tener VARIAS funciones/fechas (se
            eligen en el flujo de compra), mostrar una sola acá era
            engañoso. Queda solo `{venue} · {city}`.
            Ana también pidió que esta línea sea pareja entre todas las
            cards ("para hacer que se vean homogeneas"): tiene que ser
            UNA sola línea — si el nombre del lugar es tan largo que
            necesitaría una segunda, ahí se corta con puntos suspensivos
            en vez de pasar a esa segunda línea (`line-clamp-1`, no
            `line-clamp-2`). */}
        {hovered && (
          <>
            <p
              className="font-body line-clamp-3 text-sm"
              style={{ color: "rgba(251,251,251,0.7)" }}
            >
              {description}
            </p>
            <p
              className="font-body line-clamp-1 text-[13px]"
              style={{ color: "rgba(251,251,251,0.5)" }}
            >
              {venue} · {city}
            </p>
          </>
        )}

        {/* 2026-09-11, a pedido de Ana ("en las de descubrimiento
            quitales la puntuacion y el precio, en ningun momento dije
            que eso iba a aparecer ahi"): esta card venía mostrando
            rating/precio en las 2 variantes, pero el spec real de
            "Descubrimientos" (ver ExperienceCardDescubrimientos.tsx,
            la versión mobile) nunca los tuvo — "sin precio, a propósito,
            según la descripción real del componente en Figma". Se
            corrige: el footer de rating/precio queda solo para
            "reservados". */}
        {size === "reservados" && (
          <div
            className={`flex items-center justify-between border-t border-white-12 pt-3 ${
              hovered ? "pb-1" : "pb-3"
            }`}
          >
            <span className="font-body text-[13px] font-semibold whitespace-nowrap">
              <span className="text-thea-mint">★</span>{" "}
              <span className="text-white-100">{rating}</span>
            </span>
            <span className="font-body text-right whitespace-nowrap">
              {mostrarDesde && (
                <span className="text-[13px] font-semibold text-white-100">Desde </span>
              )}
              <span className="text-[17px] font-semibold text-white-100">{price}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
