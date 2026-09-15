/*
 * "Theaveling" en Sansita, Thea Red — exclusivo del wordmark.
 * Ver knowledge/STACK.md: el rojo nunca se usa como acento genérico de UI,
 * y Sansita nunca se usa fuera de este wordmark.
 *
 * 2026-09-04, a pedido de Ana: "que el theaveling sea un pelito mas
 * grande" — de text-xl (20px) a 22px, un aumento chico a propósito
 * ("un pelito"), no un salto al siguiente escalón de la escala
 * (text-2xl/24px se sentía demasiado). Ese 22px sigue siendo el default
 * de este componente — no se toca, sigue siendo lo correcto para la
 * barra superior de Home y el sheet de login.
 *
 * `size` — 2026-09-07, a pedido de Ana: "quiero que el theaveling sea
 * mas grande", específicamente en el Splash del Onboarding (pantalla
 * completa, mucho espacio vacío alrededor — 22px se veía chico ahí).
 * En vez de competir con un `className` externo (2 utilities de
 * Tailwind con el mismo peso no tienen un ganador garantizado), el
 * tamaño se resuelve con `style` inline, que sí gana siempre sobre
 * cualquier clase — así cada lugar que usa este componente puede pedir
 * su propio tamaño sin arriesgar romper a los otros 2.
 *
 * `color` — 2026-09-11, a pedido de Ana para el wordmark dentro de
 * DesktopFooter.tsx (fondo `bg-thea-green`, verde claro): "puedes poner
 * el theaveling de este bloque en el verde mas oscuro?". Mismo motivo
 * que `size`: una clase `text-[...]` pasada por `className` no le gana
 * de forma confiable a `text-thea-red` (misma especificidad, orden de
 * Tailwind decide, no algo para depender). Se resuelve igual, con
 * `style` inline — opcional, sin valor por defecto, así que Home/Splash/
 * LoginSheet (los otros 3 usos) siguen exactamente igual, en rojo.
 *
 * Suavizado — 2026-09-15, a pedido de Ana ("Theaveling el de la barra
 * esta como pixelado... se ve como de mala calidad"): esto NO es una
 * imagen (no tiene "resolución" que subir) — es texto real en la
 * tipografía Sansita, cargada como web font real (ver index.html). Lo
 * que sí puede pasar es que una tipografía decorativa con trazos finos
 * se vea un poco áspera sin suavizado explícito, según el navegador/
 * sistema operativo. Se agrega `-webkit-font-smoothing: antialiased` +
 * `text-rendering: optimizeLegibility` acá (solo en el wordmark, no en
 * el resto del body) para que el navegador la dibuje lo más suave
 * posible. No hay garantía de que sea EXACTAMENTE lo que Ana está viendo
 * (podría ser también el zoom del navegador u otra cosa puntual de su
 * pantalla) — si sigue viéndose igual después de esto, hace falta una
 * captura de pantalla real para diagnosticar mejor.
 *
 * Peso más grueso — 2026-09-15 (segunda vuelta), PRUEBA a pedido de Ana
 * ("hagamoslo para probar no mas, si no me gusta te pido volver atras"):
 * se probó `font-weight: 700` en las 4 pantallas que usan este
 * componente. Ana no lo quiso ("no, vamos atras") — se revierte a como
 * estaba: sin `fontWeight` explícito, el navegador vuelve a dibujarlo en
 * su peso normal (400), tal como estuvo desde el principio.
 */
export default function Wordmark({
  className = "",
  size = 22,
  color,
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <span
      className={`font-wordmark text-thea-red leading-none ${className}`}
      style={{
        fontSize: size,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
        ...(color ? { color } : {}),
      }}
    >
      Theaveling
    </span>
  );
}
