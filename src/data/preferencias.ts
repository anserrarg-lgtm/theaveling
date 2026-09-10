/*
 * Idioma / Moneda — fuente única, compartida entre `Perfil.tsx` (mobile,
 * abre `PreferenceSheet`) e `IdiomaMonedaModal.tsx` (Desktop, nuevo
 * 2026-09-09 a pedido de Ana: ícono de globo en `DesktopNavbar`). Antes
 * `IDIOMAS`/`MONEDAS`/las keys de localStorage/`leerPreferencia` vivían
 * definidos a mano dentro de Perfil.tsx — con una segunda pantalla
 * (Desktop) necesitando exactamente los mismos datos y el mismo storage,
 * se centralizan acá en vez de repetir la definición (mismo criterio de
 * "no duplicar lógica" que ya se usó para compartir `activeCategory`
 * entre mobile/desktop en Descubrir.tsx).
 *
 * Se mantiene el MISMO shape `{ value, label }` que ya usaba Perfil.tsx
 * (`label` en formato "CÓDIGO símbolo — Nombre" para moneda) para no
 * tener que tocar su lógica de armado del chip (`label.split(" — ")[0]`,
 * ver Perfil.tsx) — solo se centraliza y, en el caso de moneda, se
 * amplía la lista.
 *
 * Idioma — se queda en 2 opciones a propósito, a pedido de Ana ("ingles
 * y espanol por ahora").
 *
 * Moneda — 2026-09-09, a pedido de Ana ("las moneda si varias"): pasa de
 * 3 opciones (COP/USD/EUR) a un catálogo más real de monedas del mundo,
 * mismo criterio que un selector de monedas real (ver referencia que
 * Ana pasó). Igual que el resto de "preferencias" de la app (ver nota
 * grande en PreferenceSheet.tsx): la selección se guarda de verdad, pero
 * no hay conversión real de precios todavía — inventar eso sería fingir
 * una función que no existe.
 */
export type PreferenceOption = { value: string; label: string };

export const IDIOMAS: PreferenceOption[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
];

export const MONEDAS: PreferenceOption[] = [
  { value: "COP", label: "COP $ — Peso colombiano" },
  { value: "USD", label: "USD $ — Dólar estadounidense" },
  { value: "EUR", label: "EUR € — Euro" },
  { value: "MXN", label: "MXN $ — Peso mexicano" },
  { value: "CLP", label: "CLP $ — Peso chileno" },
  { value: "ARS", label: "ARS $ — Peso argentino" },
  { value: "BRL", label: "BRL R$ — Real brasileño" },
  { value: "UYU", label: "UYU $U — Peso uruguayo" },
  { value: "PEN", label: "PEN S/ — Sol peruano" },
  { value: "GBP", label: "GBP £ — Libra esterlina" },
  { value: "CAD", label: "CAD $ — Dólar canadiense" },
  { value: "CHF", label: "CHF — Franco suizo" },
  { value: "JPY", label: "JPY ¥ — Yen japonés" },
  { value: "CNY", label: "CNY ¥ — Yuan chino" },
  { value: "AUD", label: "AUD $ — Dólar australiano" },
  { value: "NZD", label: "NZD $ — Dólar neozelandés" },
  { value: "SEK", label: "SEK kr — Corona sueca" },
  { value: "NOK", label: "NOK kr — Corona noruega" },
  { value: "DKK", label: "DKK kr — Corona danesa" },
  { value: "PLN", label: "PLN zł — Esloti polaco" },
  { value: "TRY", label: "TRY ₺ — Lira turca" },
  { value: "ZAR", label: "ZAR R — Rand sudafricano" },
  { value: "AED", label: "AED د.إ — Dírham de los Emiratos" },
  { value: "HKD", label: "HKD $ — Dólar de Hong Kong" },
  { value: "SGD", label: "SGD $ — Dólar de Singapur" },
  { value: "THB", label: "THB ฿ — Baht tailandés" },
  { value: "PHP", label: "PHP ₱ — Peso filipino" },
  { value: "ILS", label: "ILS ₪ — Nuevo séquel israelí" },
  { value: "VND", label: "VND ₫ — Dong vietnamita" },
  { value: "MYR", label: "MYR RM — Ringgit malayo" },
];

export const IDIOMA_KEY = "theaveling:idioma";
export const MONEDA_KEY = "theaveling:moneda";

export function leerPreferencia(key: string, porDefecto: string): string {
  try {
    return window.localStorage.getItem(key) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}
