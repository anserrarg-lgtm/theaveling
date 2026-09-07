import { useEffect, useState } from "react";
import Wordmark from "../../components/Wordmark";
import { IconArrowRight } from "../../components/icons";
import splashBg from "../../assets/splash-bg.png";

/*
 * Bienvenida — 2026-09-06, propuesta de valor del Onboarding, "01 —
 * Bienvenida / propuesta de valor" del spec original.
 *
 * CTA "Empezar a descubrir" — avanza al siguiente paso del Onboarding
 * (intento de geolocalización, ver Onboarding.tsx).
 *
 * 2026-09-07, FUSIÓN con Splash.tsx — a pedido de Ana: "quiero que
 * theaveling se vaya hacia arriba y sobre la misma foto aparezca el
 * texto de descubre la escena, tiene que aparecer lento y el boton
 * tambien". Hasta acá, Splash (telón + wordmark sobre la foto de
 * butacas) y Bienvenida (fondo verde sólido, titular + botón) eran 2
 * pantallas separadas con un corte entre medio. Ana las quiere como
 * UNA sola escena continua sobre la misma foto — así que Splash.tsx
 * dejó de existir como archivo aparte y toda su mecánica (telón +
 * wordmark, ver `.splash-curtain*`/`.splash-wordmark` en index.css) se
 * trajo para acá. Onboarding.tsx ya no tiene un paso "splash" propio,
 * arranca directo en "bienvenida".
 *
 * Se agregó además un degradado oscuro sobre la mitad inferior de la
 * foto — sin él, el blanco del titular/botón compite con la textura de
 * las butacas; el degradado es sutil (no tapa la foto) pero asegura
 * contraste, mismo criterio de legibilidad que ya usa el resto de la
 * app sobre fotos (ver headers fijos de Perfil/DatosDeCuenta).
 *
 * 2026-09-07 (más tarde), REEMPLAZO del contenido por un carrusel de 3
 * mensajes — a pedido de Ana, que cambió de opinión sobre qué debía
 * decir el texto: en vez de un solo titular+subtítulo fijo (con una
 * palabra de categoría deslizándose dentro de la frase, mecánica
 * `.word-cycle` que queda sin uso — se deja definida en index.css por si
 * hace falta más adelante), ahora son 3 mensajes que se suceden
 * deslizándose hacia la izquierda, con 3 puntos de paginación abajo (el
 * punto activo se ve "ligeramente expandido", patrón estándar de
 * carrusel de onboarding). Copy exacto pedido:
 *   1) "Hay más por descubrir de lo que aparece en las guías." (solo
 *      esta frase, sin subtítulo — es el gancho inicial).
 *   2) Título "No te mostramos simplemente qué hay." / subtítulo "Te
 *      ayudamos a encontrar una parte más interesante y local de la
 *      ciudad."
 *   3) Título "Descubre la escena artística de una ciudad." / subtítulo
 *      "Encuentra teatro, danza, performance, música y experiencias
 *      culturales cuidadosamente seleccionadas." (mismo titular que ya
 *      existía, ahora como cierre del carrusel en vez de único mensaje;
 *      el subtítulo ya no cicla una palabra a la vez — lista completa,
 *      fija).
 *
 * 2026-09-07 (última pasada), navegación 100% MANUAL — Ana probó la
 * versión con avance automático por tiempo (`DURACION_SLIDE_MS`, varias
 * vueltas: 1500 → 2400 → 3200ms) y pidió sacarlo del todo: "NO HAY QUE
 * PONERLE EL TIEMPO NOSOTROS, QUE NO SEA AUTOMATICO". El pedido exacto:
 * a un lado un botón para "Saltar" (se va directo al paso siguiente del
 * Onboarding) y al otro lado una flecha dentro de un círculo para
 * avanzar un mensaje a la vez ("seguir el solo", es decir, el usuario
 * decide cuándo pasar al próximo). Al llegar al último mensaje, esa fila
 * de Saltar/flecha se reemplaza por el botón ancho "Empezar a
 * descubrir", tal cual ya estaba funcionando ("al final ya aparece el
 * boton como ya esta").
 *
 * 2026-09-07 (una pasada más), MENSAJE 1 con auto-avance — Ana pidió una
 * excepción puntual: "que la primera si se pase sola ya en la segunda
 * aparese saltar y la flechita". O sea, el gancho inicial (mensaje 1, la
 * frase corta sin subtítulo) se sigue pasando solo con un `setTimeout`
 * corto (ver `DURACION_MENSAJE_1_MS`) — sin ningún control visible
 * todavía, ni "Saltar" ni la flecha — y recién a partir del mensaje 2 en
 * adelante aparecen esos controles y la navegación pasa a ser manual del
 * todo (igual que se armó en la pasada anterior). Los puntos de
 * paginación siguen tappables en todo momento. También se cambió el
 * ícono de la flecha circular: antes era `IconCaretRight` (una "cuña" `>`
 * sin línea), ahora es `IconArrowRight` (línea + punta, "flechita con
 * palito", pedido explícito).
 *
 * La escena completa, ahora en 5 etapas:
 *   1) el telón se abre y el wordmark aparece centrado sobre la foto
 *      (puro CSS, se dispara solo con el montaje);
 *   2) el wordmark SUBE a un lugar fijo arriba (`.wordmark-slot`);
 *   3) aparece el bloque de texto con un fade lento (`.bienvenida-copy`)
 *      mostrando el mensaje 1 del carrusel, sin controles visibles;
 *   4) el mensaje 1 se pasa solo al mensaje 2 después de
 *      `DURACION_MENSAJE_1_MS` — ahí aparecen "Saltar" y la flecha
 *      circular, y de ahí en más el usuario avanza a su propio ritmo
 *      (flecha o puntos de paginación), sin más avances automáticos. En
 *      cualquier momento puede tocar "Saltar" para ir directo al
 *      siguiente paso del Onboarding sin terminar de leer los mensajes
 *      que falten;
 *   5) al llegar al 3er mensaje, la fila de Saltar/flecha se reemplaza
 *      por el botón "Empezar a descubrir" (mismo fade sutil que ya
 *      tenía, `.bienvenida-boton-visible` — "que ese boton no sea
 *      invasivo").
 * Los pasos 1-4 siguen necesitando JS (`setTimeout` encadenados) porque
 * dependen unas de otras — no alcanza con `animation-delay` fijo en CSS.
 * Del paso 4 en adelante (mensaje 2+) todo es a demanda del usuario
 * (`onClick`), sin más timers.
 */

const SLIDES = [
  {
    titulo: "Hay más por descubrir de lo que aparece en las guías.",
    subtitulo: null,
  },
  {
    titulo: "No te mostramos simplemente qué hay.",
    subtitulo: "Te ayudamos a encontrar una parte más interesante y local de la ciudad.",
  },
  {
    // 2026-09-07: "En el tercer texto mejor pon Descubre su escena
    // artistica" — más corto y directo que la versión anterior ("...de
    // una ciudad").
    titulo: "Descubre su escena artística.",
    subtitulo:
      "Encuentra teatro, danza, performance, música y experiencias culturales cuidadosamente seleccionadas.",
  },
] as const;

// Tiempos acumulados desde el montaje (ms) — ver nota grande de arriba.
// El telón + wordmark centrado terminan de aparecer solos (CSS) a los
// ~950ms; MOSTRAR_ARRIBA_MS deja una pausa corta después de eso para
// que la marca se alcance a leer antes de empezar a moverse.
const MOSTRAR_ARRIBA_MS = 1450;
const MOSTRAR_CONTENIDO_MS = 1850; // arranca mientras el wordmark todavía está subiendo
// Cuánto se queda el mensaje 1 (el gancho corto, sin subtítulo) antes de
// pasar solo al mensaje 2 — única excepción de auto-avance, ver nota
// grande de arriba ("MENSAJE 1 con auto-avance"). Empezó en 2000ms; Ana
// pidió "dejala un tiempo en la primera" (dejarle más margen de lectura
// antes del pase automático), así que quedó en 3000ms.
const DURACION_MENSAJE_1_MS = 3000;
// Duración de la animación de deslizamiento del carrusel en sí (CSS, ver
// el `style` del track más abajo) — esto NO es un tiempo de espera, solo
// cuánto tarda la transición visual cuando cambia `slideIndice` (a
// diferencia del viejo `DURACION_SLIDE_MS`, que sí era un tiempo de
// espera para los 3 mensajes y se sacó del todo: ver nota grande de
// arriba, "navegación 100% MANUAL").
const DURACION_TRANSICION_SLIDE_MS = 450;

export default function Bienvenida({ onContinuar }: { onContinuar: () => void }) {
  const [slideIndice, setSlideIndice] = useState(0);
  const [wordmarkArriba, setWordmarkArriba] = useState(false);
  const [contenidoVisible, setContenidoVisible] = useState(false);
  // Controla si el deslizamiento del carrusel se anima o no (ver el
  // `className` del track, más abajo) — mismo criterio que el resto de
  // la pantalla.
  const [reducirMovimiento, setReducirMovimiento] = useState(false);

  const enUltimoMensaje = slideIndice === SLIDES.length - 1;

  useEffect(() => {
    const prefiereMenosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducirMovimiento(prefiereMenosMovimiento);
    if (prefiereMenosMovimiento) {
      // Con reducción de movimiento, saltar directo a mostrar el bloque
      // de texto (sin esperar la subida del wordmark) Y directo al
      // mensaje 2 — el único paso automático que queda es justamente el
      // que salta este `if` (ver el efecto de abajo), así que hay que
      // reproducir su resultado acá a mano para no dejar a este usuario
      // esperando un timer que nunca va a disparar.
      setWordmarkArriba(true);
      setContenidoVisible(true);
      setSlideIndice(1);
      return;
    }

    const t1 = setTimeout(() => setWordmarkArriba(true), MOSTRAR_ARRIBA_MS);
    const t2 = setTimeout(() => setContenidoVisible(true), MOSTRAR_CONTENIDO_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Único paso con avance automático — el mensaje 1 se pasa solo al
  // mensaje 2 después de `DURACION_MENSAJE_1_MS` (ver nota grande de
  // arriba, "MENSAJE 1 con auto-avance"). Se re-arma cada vez que
  // `slideIndice` vuelve a 0 (por ejemplo si el usuario toca el punto de
  // paginación del mensaje 1 para releerlo) — mismo comportamiento,
  // vuelve a pasar solo. Del mensaje 2 en adelante no hace falta ningún
  // timer más: la navegación es 100% a demanda (flecha o puntos).
  useEffect(() => {
    if (!contenidoVisible || reducirMovimiento || slideIndice !== 0) return;
    const t = setTimeout(() => setSlideIndice(1), DURACION_MENSAJE_1_MS);
    return () => clearTimeout(t);
  }, [contenidoVisible, slideIndice, reducirMovimiento]);

  const irAlSiguienteMensaje = () =>
    setSlideIndice((i) => Math.min(i + 1, SLIDES.length - 1));

  return (
    <div className="fixed inset-0 overflow-hidden bg-thea-green">
      <img
        src={splashBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-bottom -z-10"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgb(1 20 20 / 90%), rgb(1 20 20 / 45%) 55%, transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className={`wordmark-slot ${wordmarkArriba ? "wordmark-slot-arriba" : ""}`}
      >
        <Wordmark size={44} className="splash-wordmark" />
      </div>
      <div className="splash-curtain splash-curtain-left" aria-hidden="true" />
      <div className="splash-curtain splash-curtain-right" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-6 pb-8">
        <div
          className={`bienvenida-copy ${contenidoVisible ? "bienvenida-copy-visible" : ""} flex flex-col gap-5`}
        >
          {/* Carrusel de 3 mensajes — ver la nota grande de arriba
              ("REEMPLAZO"). `overflow-hidden` recorta los 2 mensajes que
              no están activos; el track de adentro es un flex row con 3
              slots de `w-full shrink-0`, uno por mensaje, desplazado con
              `translateX` según `slideIndice`. */}
          <div className="overflow-hidden">
            <div
              className={`flex ${reducirMovimiento ? "" : "transition-transform ease-out"}`}
              style={{
                transform: `translateX(-${slideIndice * 100}%)`,
                transitionDuration: reducirMovimiento
                  ? undefined
                  : `${DURACION_TRANSICION_SLIDE_MS}ms`,
              }}
            >
              {SLIDES.map((slide, i) => (
                <div key={i} className="w-full shrink-0 flex flex-col gap-3 pr-1">
                  <h1 className="font-display font-light text-3xl leading-tight text-white-100 text-balance">
                    {slide.titulo}
                  </h1>
                  {slide.subtitulo && (
                    <p className="font-body text-base leading-relaxed text-white-80">
                      {slide.subtitulo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Paginación — 3 puntos, el del mensaje activo se ve
              "ligeramente expandido" (pedido explícito), el resto queda
              chico. Tappables: cada punto salta directo a ese mensaje
              (adelante o atrás) sin pasar por los intermedios. Área de
              toque ampliada con padding invisible (el punto visual sigue
              siendo chico) para que sea fácil de tocar en mobile sin
              agrandar el punto en sí. */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndice(i)}
                aria-label={`Ir al mensaje ${i + 1} de ${SLIDES.length}`}
                aria-current={i === slideIndice}
                className="p-1.5 -m-1.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === slideIndice ? "w-5 bg-white-100" : "w-1.5 bg-white-20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 2026-09-07, navegación 100% manual desde el mensaje 2 — a
            pedido de Ana (ver nota grande de arriba). En el mensaje 1
            (`slideIndice === 0`) no se muestra ningún control todavía,
            se pasa solo. Desde el mensaje 2 y mientras no sea el último:
            a un lado "Saltar" (va directo al siguiente paso del
            Onboarding, sin pasar por el resto del carrusel) y al otro
            una flecha en círculo para avanzar un mensaje a la vez. En el
            último mensaje esta fila se reemplaza por el botón ancho de
            siempre.

            2026-09-07 (más tarde), `h-12` fijo en el contenedor — Ana
            notó que los puntos de paginación (arriba) "subían y bajaban"
            de posición al pasar del mensaje 1 (sin esta fila, antes no
            se renderizaba nada acá) al mensaje 2 (con la fila
            Saltar/flecha). Como todo este bloque está anclado al fondo
            de la pantalla (`bottom-0` más arriba), sacar la fila por
            completo encogía la altura total y corría todo hacia abajo.
            Fijar la altura acá (mismos 48px que ya tenían tanto el botón
            circular como el CTA ancho) hace que el mensaje 1 reserve el
            mismo espacio aunque no muestre nada adentro, así los puntos
            quedan siempre en la misma línea. */}
        <div className="h-12">
          {slideIndice === 0 ? null : enUltimoMensaje ? (
            <button
              onClick={onContinuar}
              className="bienvenida-boton bienvenida-boton-visible w-full h-12 rounded-xl bg-white-100 text-thea-green font-body font-semibold text-[15px] leading-5 tracking-[0.3px]"
            >
              Empezar a descubrir
            </button>
          ) : (
            <div className="h-12 flex items-center justify-between">
              <button
                onClick={onContinuar}
                className="font-body font-medium text-[15px] leading-5 text-white-80 py-3 pr-3 -my-3 -ml-1"
              >
                Saltar
              </button>
              <button
                onClick={irAlSiguienteMensaje}
                aria-label="Siguiente mensaje"
                className="w-12 h-12 rounded-full bg-white-100 text-thea-green flex items-center justify-center"
              >
                <IconArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
