import { Link, useParams } from "react-router-dom";
import { getExperienceById } from "../../data/experiences";

/*
 * Confirmación de reserva — último paso del flujo feliz
 * (ver knowledge/ARCHITECTURE.md, User Flow).
 * Thea Mint (#2ECCA6) es el único acento reservado para "Pago exitoso"
 * (ver knowledge/STACK.md) — el ícono de check acá es el uso puntual.
 * Placeholder estructural.
 *
 * 2026-09-05, a pedido de Ana: "QUIERO QUE EL CHECK NO SEA MARCADO POR UN
 * CIRCULO, QUIERO UN CHECK EN MINT NORMAL" — se saca el círculo de fondo
 * (`bg-thea-mint` + `rounded-full`) que traía el ícono; queda el trazo
 * del check solo, en mint (`text-thea-mint` + `stroke="currentColor"`,
 * mismo patrón que el resto de los íconos de la app, ver icons.tsx), más
 * grande que antes (antes 28px adentro de un círculo de 64px, ahora 56px
 * él solo) para que siga teniendo presencia como elemento principal de la
 * pantalla.
 *
 * "EL BOTON DE DESCUBRIR MAS QUE NO SEA UNA PILDORA" — "Volver a
 * Descubrir" pasa de `rounded-full` (píldora) a `rounded-xl`, mismo
 * lenguaje de esquinas que el resto de los botones de la app (Siguiente,
 * Confirmar y pagar, etc. — ninguno de esos es píldora).
 *
 * 2026-09-07, bug real — a pedido de Ana: "el feedback no esta tirando
 * bien el nombre del descubrimiento, lo tira como con#". El texto
 * mostraba literalmente "la experiencia #{id}" usando el slug de la URL
 * (ej. "#sesion-subterranea") en vez del nombre real de la experiencia —
 * quedó así desde que esta pantalla era un placeholder estructural sin
 * conectar al catálogo. Ahora busca la experiencia con
 * `getExperienceById` (mismo helper que usa el resto de la app, ver
 * DetalleExperiencia.tsx/Compra.tsx) y muestra su `title` real; si por
 * algún motivo el id no matchea ninguna experiencia del catálogo, cae a
 * un texto genérico en vez de mostrar el slug crudo.
 */
export default function Confirmacion() {
  const { id } = useParams();
  const experiencia = id ? getExperienceById(id) : undefined;

  return (
    <div className="min-h-screen bg-thea-green text-white-100 font-body flex flex-col items-center justify-center px-6 text-center gap-4">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-thea-mint"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <h1 className="font-display font-thin text-3xl">¡Reserva confirmada!</h1>
      <p className="text-white-80 text-sm max-w-xs">
        Ya tienes tu lugar para{" "}
        {experiencia ? (
          <span className="text-white-100 font-medium">{experiencia.title}</span>
        ) : (
          "esta experiencia"
        )}
        . El ticket queda disponible en Reservas.
      </p>
      <Link
        to="/"
        className="mt-4 rounded-xl bg-white-12 px-6 py-3 font-display text-sm"
      >
        Volver a Descubrir
      </Link>
    </div>
  );
}
