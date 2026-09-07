/*
 * "Supporting Card" — nodo real de Figma `1499:116` ("Default", 165px,
 * usado en la grilla de 2 columnas de Favoritos en Perfil) y `1885:606`
 * ("Compact", 220px, usado en el riel "Contenido similar" de Detalle —
 * ver DetalleExperiencia.tsx, traído del nodo `detalle-mobile` 1867:654,
 * 2026-09-03). Misma tarjeta, 2 tamaños confirmados en Figma para 2
 * contextos distintos — no una sola talla forzada a los dos lugares.
 *
 * Sin precio/rating/tag de "Etiqueta curatorial" — spec real de Figma
 * solo trae: imagen, categoría (campo `tag` de experiences.ts, ej.
 * "Cine documental"), título y "Venue, Ciudad". Sin botón de favorito
 * en la variante Default (no lo tiene el diseño real); la variante
 * Compact SÍ trae favorito (ver `showFavorito`).
 *
 * Favorito — 2026-09-03, corregido: el nodo real de Figma para la
 * variante Compact trae su PROPIO botón de favorito, con el tratamiento
 * viejo (chip circular blanco 80% + ícono thea-green) — es el mismo
 * patrón que ya se había descartado en toda la app a favor de
 * FavoritoButton (sin círculo, halo con drop-shadow, thea-mint/thea-red
 * según estado, ver esa nota). Lo había implementado literal como en
 * Figma sin darme cuenta de la inconsistencia — Ana lo notó ("las
 * tarjetas de contenido similar están con el corazón antiguo"). Se
 * reemplaza acá por el mismo `FavoritoButton` que usan las demás cards,
 * para que el corazón se vea y se comporte igual en toda la app,
 * priorizando consistencia sobre el trazo literal de este nodo puntual.
 *
 * Colores — 2026-09-03, CORREGIDO: esta card había pasado a un tema
 * oscuro (bg-white-6, tag mint, texto blanco) al arreglar el fondo de
 * Perfil a thea-green, asumiendo que la card debía "seguir" al fondo de
 * la página. Al traer el nodo real `detalle-mobile` para terminar
 * Detalle, se confirmó que esto estaba MAL: ahí la misma Supporting
 * Card (variante Compact) flota sobre un fondo thea-green sólido y
 * sigue siendo blanca/clara (`bg-[#fbfbfb]`, texto thea-green, tag
 * thea-green) — es una card clara por diseño, no un componente que se
 * adapta al fondo. Se revierte acá al tratamiento claro original,
 * correcto para los dos usos (Perfil Y Detalle).
 *
 * Colores, 2da vuelta — 2026-09-04, a pedido de Ana: quiere que la
 * variante Compact (Contenido similar, Detalle) tenga "la misma
 * transparencia en los mismos valores que las de exp" — mismo pedido ya
 * aplicado a Artist/Space Card (ver esa nota en ArtistSpaceCard.tsx).
 * A diferencia de la corrección de arriba (que igualaba Compact y
 * Default), acá SÍ se separaron los 2 tamaños en su tratamiento de
 * color — `compact` pasó a `bg-white-6` + texto blanco (tag
 * `text-thea-mint`, título `text-white-100`, venue
 * `rgba(251,251,251,0.5)`), los MISMOS 3 valores que ya usa Experience
 * Card (ver ExperienceCardMasReservados.tsx) — no valores nuevos. En ese
 * momento la variante `default` (grilla de Favoritos en Perfil) se dejó
 * afuera a propósito — Ana lo había pedido específicamente para "las de
 * contenido similar", no para Favoritos.
 *
 * Colores, 3ra vuelta — 2026-09-04: Ana volvió sobre esto ("poner la
 * card de fav en perfil en transparencia") y esta vez sí pidió el mismo
 * tratamiento para `default` — mismos 3 valores de arriba (`bg-white-6`,
 * tag mint, texto blanco), ya no queda ninguna variante clara/opaca de
 * esta card en toda la app.
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

export default function SupportingCard({
  id,
  tag,
  title,
  venue,
  city,
  imageUrl,
  size = "default",
  showFavorito = false,
}: {
  id: string;
  tag: string;
  title: string;
  venue: string;
  city: string;
  imageUrl?: string;
  size?: "default" | "compact";
  /** Muestra el botón de favorito — solo la variante Compact lo trae en
   * el diseño real (riel de Contenido similar). */
  showFavorito?: boolean;
}) {
  const compact = size === "compact";

  return (
    <div
      className={`rounded-2xl p-3 flex flex-col gap-3 shrink-0 overflow-hidden bg-white-6 ${
        compact ? "w-[220px]" : "w-[165px] h-72"
      }`}
    >
      <div
        className={`relative shrink-0 rounded-xl overflow-hidden bg-white-8 ${
          compact ? "h-[120px]" : "h-40"
        }`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
        {showFavorito && (
          <FavoritoButton id={id} className="absolute top-2 right-2" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-body font-semibold text-[10px] uppercase truncate text-thea-mint">
          {tag}
        </span>
        <h3
          className={`font-display text-lg leading-[1.3] tracking-[-0.1px] text-white-100 ${
            compact ? "truncate" : "line-clamp-2"
          }`}
        >
          {title}
        </h3>
        {/* rgba(251,251,255,.5) — mismo valor suelto que ya usa
            Experience Card para venue/metadata (no coincide con ningún
            escalón documentado en STACK.md, se usa tal cual). */}
        <p
          className="font-body text-xs truncate"
          style={{ color: "rgba(251,251,251,0.5)" }}
        >
          {venue}, {city}
        </p>
      </div>
    </div>
  );
}
