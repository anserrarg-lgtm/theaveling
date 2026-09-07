import { useEffect } from "react";
import Wordmark from "../../components/Wordmark";
import splashBg from "../../assets/splash-bg.png";

/*
 * Splash — 2026-09-06, primer paso del Onboarding, a pedido explícito:
 * "RECUERDA Q PRIMERO DEBE APARECER LA PANTALLA EN VERDE CON THEABELING
 * EN MEDIO, YA DESPUES LA PANTALLA DE LA INTRO". Originalmente fondo
 * Thea Green sólido — ver más abajo el cambio a foto de fondo.
 *
 * Animación "telón" — 2026-09-07, a pedido de Ana: quería "alguna
 * animación cool" para este wordmark y no sabía cuál; se le propusieron
 * 4 opciones (telón / foco de luz / marquesina / fade+escala) y eligió
 * "telón que se abre" — dos paneles cubren la pantalla al montar y se
 * abren hacia los costados, revelando lo que hay debajo, como un telón
 * de teatro real. Toda la mecánica de la animación vive en index.css
 * (`.splash-curtain*` / `.splash-wordmark`) — acá solo se montan los 2
 * divs decorativos. Hubo una prueba A/B breve con "fade + escala suave"
 * (`.splash-wordmark-fade-scale`, sigue en index.css sin usarse) — a
 * pedido de Ana ("volvamos al anterior") quedó el telón como definitivo.
 *
 * Foto de fondo — 2026-09-07, a pedido de Ana, que pasó de referencia en
 * el chat una foto de butacas de teatro (verde/teal oscuro) de cómo
 * quiere que se vea esta pantalla. Esa imagen del chat venía en baja
 * resolución y ya traía "Theaveling" escrito encima en una tipografía
 * genérica (no Sansita) — combinada con el `<Wordmark>` real quedaban 2
 * textos superpuestos, y se probó primero tapando esa franja a mano.
 * Resuelto del todo cuando apareció el archivo real: Ana ya tenía esta
 * misma foto guardada en su proyecto, en alta resolución (848×1264) y
 * SIN texto encima — `public/assets/images/splash theaveling.png` — que
 * es justo el origen de la que mandó por chat. Esa es la que se usa
 * acá (copiada a `src/assets/splash-bg.png`); no hace falta ningún
 * retoque porque esta versión ya viene limpia.
 *
 * `object-cover` llena la pantalla recortando en vez de deformar la
 * imagen, igual que cualquier foto de fondo mobile. `-z-10` la manda
 * detrás del telón y el wordmark (que no llevan position explícito,
 * pero al ser hijos posteriores en el flujo/flex ya pintan encima; el
 * z-index acá es solo para que quede explícito y no dependa del orden).
 *
 * `object-bottom`: en una ventana de escritorio normal (esta app es
 * mobile-only por diseño, sin tope de ancho en escritorio — ver nota
 * grande en App.tsx) `object-cover` recorta mucho más verticalmente que
 * en un celular real; anclar el recorte abajo prioriza las butacas
 * (bien llenas de foto) por sobre el techo oscuro vacío de arriba. En
 * el celular real no cambia nada — ahí siempre se ve la foto completa
 * de alto, el recorte de `cover` es solo lateral. Para previsualizar
 * esta pantalla como se ve en un celular real conviene usar el modo
 * celular de Chrome (DevTools → Toggle device toolbar) en vez de una
 * ventana de escritorio normal — mismo consejo que ya deja App.tsx para
 * el resto de la app.
 *
 * Sigue sin interacción — no es una pantalla que el usuario deba leer o
 * decidir algo, es puramente la marca presentándose antes de la
 * propuesta de valor real (Bienvenida.tsx).
 *
 * DURACION_MS en 1600ms (subido de los 1300ms originales) para darle
 * aire a la secuencia de telón + revelación, sin sentirse una demora
 * artificial — sigue siendo más corto que el spinner de pago de
 * ConfirmarPagoSheet, que sí simula un proceso real de 3s.
 */
const DURACION_MS = 1600;

export default function Splash({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onFinish, DURACION_MS);
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-thea-green overflow-hidden">
      <img
        src={splashBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-bottom -z-10"
      />
      <Wordmark size={44} className="splash-wordmark" />
      <div className="splash-curtain splash-curtain-left" aria-hidden="true" />
      <div className="splash-curtain splash-curtain-right" aria-hidden="true" />
    </div>
  );
}
