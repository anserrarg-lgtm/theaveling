import { googleMapsSearchUrl } from "../utils/maps";

/*
 * MapPreview — 2026-09-04, a pedido de Ana: el mapa de "Sobre el lugar"
 * (DetalleExperiencia) y el acordeón "Mapa de ubicación" (Compra) eran
 * una caja plana de un solo color con un ícono de pin centrado y nada
 * más — "ponlo bien estetico y funcional".
 *
 * Sigue habiendo un límite real: no hay lat/long ni dirección exacta
 * cargada para los venues del catálogo, y varios son ficticios (ver
 * nota en utils/maps.ts), así que un mapa estático de verdad (imagen de
 * Google/Mapbox con el pin en el lugar correcto) queda descartado —
 * mostraría una ubicación inventada o, peor, la incorrecta. La solución
 * acá es una ilustración de mapa (calles + manzanas estilizadas, sin
 * pretender ser un lugar real) con el pin y su halo como punto focal,
 * en vez de un rectángulo vacío. Es la misma idea que ya usa el resto
 * de la app para "no inventar dato que no tenemos, pero tampoco dejar
 * el espacio muerto".
 *
 * "Funcional" se resuelve haciendo TODA la tarjeta un link real a la
 * búsqueda de Google Maps por nombre (antes ese comportamiento solo
 * vivía en el texto de abajo) — más área de toque, y el chip
 * "Ver en Google Maps" dentro de la tarjeta deja claro que es
 * accionable antes de que el usuario la toque.
 */

const VARIANT_STYLES = {
  dark: {
    bg: "rgb(251 251 251 / 6%)",
    border: "rgb(251 251 251 / 10%)",
    line: "rgb(251 251 251 / 14%)",
    lineStrong: "rgb(251 251 251 / 22%)",
    pin: "#fbfbfb",
    pinCore: "#112c2c",
    pulse: "#2ecca6",
    chipBg: "rgb(17 44 44 / 70%)",
    chipText: "#fbfbfb",
  },
  light: {
    bg: "rgb(17 44 44 / 6%)",
    border: "rgb(17 44 44 / 12%)",
    line: "rgb(17 44 44 / 12%)",
    lineStrong: "rgb(17 44 44 / 20%)",
    pin: "#112c2c",
    pinCore: "#fbfbfb",
    pulse: "#2ecca6",
    chipBg: "rgb(251 251 251 / 92%)",
    chipText: "#112c2c",
  },
} as const;

export function MapPreview({
  venue,
  city,
  variant,
  className = "",
}: {
  venue: string;
  city: string;
  variant: "dark" | "light";
  className?: string;
}) {
  const c = VARIANT_STYLES[variant];

  return (
    <a
      href={googleMapsSearchUrl(`${venue}, ${city}`)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Ver ${venue} en Google Maps`}
      className={`group relative block w-full overflow-hidden rounded-xl border transition-transform duration-200 active:scale-[0.99] ${className}`}
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <svg
        viewBox="0 0 300 150"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g stroke={c.line} strokeWidth="1.5" fill="none">
          <path d="M0 42 H300" />
          <path d="M0 100 H300" />
          <path d="M52 0 V150" />
          <path d="M128 0 V150" />
          <path d="M212 0 V150" />
          <path d="M266 0 V150" />
        </g>
        <path d="M-10 12 L310 138" stroke={c.lineStrong} strokeWidth="1.5" fill="none" />

        <circle
          cx="150"
          cy="68"
          r="26"
          fill={c.pulse}
          opacity="0.22"
          className="motion-safe:animate-pulse"
        />
        <circle cx="150" cy="68" r="13" fill={c.pulse} opacity="0.32" />

        <g transform="translate(138,45)">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 9 12 23 12 23s12-14 12-23c0-6.6-5.4-12-12-12z"
            fill={c.pin}
          />
          <circle cx="12" cy="12" r="4.5" fill={c.pinCore} />
        </g>
      </svg>

      <span
        className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full px-2.5 py-1 font-body text-[11px] font-semibold transition-opacity group-hover:opacity-90"
        style={{ backgroundColor: c.chipBg, color: c.chipText }}
      >
        Ver en Google Maps
      </span>
    </a>
  );
}
