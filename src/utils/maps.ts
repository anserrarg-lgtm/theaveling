/*
 * Link de búsqueda de Google Maps por nombre — 2026-09-04. Mismo enfoque
 * que ya se usó primero en Compra.tsx (acordeón "Mapa de ubicación") y
 * ahora también en la sección "Información adicional" de Detalle: no
 * hay dirección/lat-long real cargada para los venues del catálogo
 * (varios son ficticios), así que en vez de inventar coordenadas o un
 * mapa estático falso, se arma una búsqueda real de Google Maps por
 * nombre — funciona igual de bien para un venue real (lo encuentra) que
 * para uno ficticio del catálogo (no rompe nada, solo no encuentra
 * resultado exacto). Se extrae acá como utilidad compartida en vez de
 * duplicar la misma línea de `encodeURIComponent` en cada pantalla.
 */
export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
