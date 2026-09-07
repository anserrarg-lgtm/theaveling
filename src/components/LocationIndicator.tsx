/*
 * "Location Indicator" — `2268:1139` (claro) / `2268:1143` (verde).
 * Spec verificado en vivo en Figma (2026-08-31): gap-4 entre ícono y texto,
 * ícono 14×14, texto Instrument Sans Regular 13px subrayado, color
 * #112c2c en claro / #fbfbfb en verde (opacidad completa, no atenuado).
 * Puramente informativo, sin fondo ni borde, sin acción de tap — cambiar
 * de ciudad se hace desde Búsqueda (fila "Ubicación").
 *
 * En Home (fondo verde) vive en su propia fila de 390×32, alineada a la
 * derecha, justo debajo de Category Tabs — eso lo arma la pantalla que
 * usa este componente, no el componente en sí.
 *
 * Usa IconMapPin (ver icons.tsx) — trazo real de `icon/map-pin` (`1483:163`),
 * exportado a mano por Ana desde Figma (2026-09-02). El ícono viene dibujado
 * en un viewBox de 24×24, así que acá se escala a 14×14 vía className para
 * cumplir el spec de esta fila.
 */
import { IconMapPin } from "./icons";

export default function LocationIndicator({ city }: { city: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-white-100 text-[13px] font-body">
      <IconMapPin className="w-3.5 h-3.5" />
      <span className="underline underline-offset-2">{city}</span>
    </span>
  );
}
