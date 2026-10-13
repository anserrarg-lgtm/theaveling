/*
 * "Ver más" — card de cierre al final de los rieles horizontales "Más
 * reservados" y "Descubrimientos", 2026-09-02 a pedido de Ana. En su
 * momento se armó en código a mano con el mismo lenguaje visual del
 * resto de las cards del riel (imagen a sangre + degradado + texto
 * centrado), mismo criterio que ya se usó para el "+20 / Más Curados"
 * del riel Curado — en ese momento se buscó en el design system y no se
 * encontró ("Experience Card — Ver más" no existía todavía documentada).
 *
 * 2026-10-12: SÍ existe ahora en Figma, dentro de "04 — Card System"
 * ("Experience Card — Ver más", nodo `1806:560`). Se ajustan acá los 3
 * detalles de estilo que no coincidían con el trazo real: oscurecimiento
 * negro puro al 60% (antes verde oscuro al 55%), número más grande sin
 * subrayado en el texto de abajo. El tamaño (`width`/`height`, ver nota
 * debajo) se queda igual — ese SÍ lo definía bien el código, es la
 * card maestra de Figma la que no estaba ajustada al tamaño real de cada
 * riel (se corrige aparte, directamente en Figma).
 *
 * `width`/`height` en vez de tamaño fijo interno: cada riel tiene su
 * propio tamaño de card (Más reservados 268×368, Descubrimientos
 * 300×310) y esta card de cierre debe calzar exacto en la fila, así que
 * el tamaño lo define quien la usa, no el componente.
 *
 * No navega a ningún lado todavía — no existe una pantalla "ver todos"
 * en el proyecto (fuera del alcance de este prototipo). Cuando exista,
 * envolver el uso en un <Link>, igual que las demás cards.
 *
 * 2026-09-02: texto igualado al patrón "+20 / Más Curados" que ya existe
 * en el riel Curado (mismas 2 clases de texto, mismo orden) — número
 * arriba (`count`, distinto por riel: +8 en Más reservados, +20 en
 * Descubrimientos) y "Ver más" subrayado abajo, en vez del texto suelto
 * centrado que tenía antes.
 */
export default function VerMasCard({
  imageUrl,
  width,
  height,
  count,
}: {
  imageUrl?: string;
  width: number;
  height: number;
  /** Número que va arriba de "Ver más", ej. 8 → "+8". */
  count: number;
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden shrink-0 bg-white-8"
      style={{ width, height }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Degradado uniforme (no solo abajo, como en las otras cards) para
          que el texto centrado se lea bien sin importar qué parte de la
          foto quede detrás. */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="font-display font-thin text-[32px] leading-[40px] text-white-100">
          +{count}
        </span>
        <span
          className="font-body font-semibold text-[15px]"
          style={{ color: "rgba(251,251,251,0.7)" }}
        >
          Ver más
        </span>
      </div>
    </div>
  );
}
