/*
 * "Ver más" — card de cierre al final de los rieles horizontales "Más
 * reservados" y "Descubrimientos", 2026-09-02 a pedido de Ana. No hay
 * componente real en Figma para esto (buscado en el design system, no
 * existe) — se arma en código con el mismo lenguaje visual del resto de
 * las cards del riel (imagen a sangre + degradado + texto centrado),
 * mismo criterio que ya se usó para el "+20 / Más Curados" del riel
 * Curado (ese es un botón de texto porque las cards de Curado van
 * apiladas verticalmente, no en scroll horizontal — acá sí tiene
 * sentido que sea una card más, del mismo tamaño que sus hermanas, para
 * que el gesto de "seguir scrolleando" sea consistente).
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
        style={{ background: "rgba(17,44,44,0.55)" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
        <span className="font-display font-light text-2xl leading-none text-white-100">
          +{count}
        </span>
        <span className="font-body font-semibold text-[11px] text-white-100 underline">
          Ver más
        </span>
      </div>
    </div>
  );
}
