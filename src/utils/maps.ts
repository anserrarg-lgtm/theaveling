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

/*
 * 2026-09-08, a pedido de Ana: Detalle de festival (ver DetalleExperiencia.tsx)
 * necesita un link "Visitar sitio oficial" para los 3 festivales reales de
 * Bogotá. No hay URL oficial verificada cargada para ninguno de los 3 (y
 * las que existen cambian de edición a edición) — mismo criterio que
 * `googleMapsSearchUrl` arriba: en vez de inventar/adivinar una URL que
 * podría estar rota o ser la de otra edición, se arma una búsqueda real de
 * Google por nombre. Siempre funciona y siempre lleva a información
 * legítima, sin el riesgo de mandar a alguien a un dominio incorrecto.
 */
export function googleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
