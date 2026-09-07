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
 */
export default function Wordmark({
  className = "",
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`font-wordmark text-thea-red leading-none ${className}`}
      style={{ fontSize: size }}
    >
      Theaveling
    </span>
  );
}
