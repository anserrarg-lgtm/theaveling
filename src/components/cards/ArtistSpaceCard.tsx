/*
 * "Artist / Space Card" — nodo real de Figma `1867:702` (dentro de
 * detalle-mobile, sección "Artista / compañía"), traído vía
 * get_design_context 2026-09-03.
 *
 * Fondo — 2026-09-04, cambiado a pedido de Ana: antes era una card CLARA
 * (bg-white-100 opaco, texto thea-green), tal cual el trazo literal de
 * Figma — mismo criterio que se había usado en Supporting Card. Ana pidió
 * que en cambio tenga "la misma transparencia en los mismos valores que
 * las de exp" — se iguala acá a `bg-white-6`, exactamente el mismo fill
 * que usan las Experience Cards (Más reservados/Descubrimientos, ver
 * ExperienceCardMasReservados.tsx). Como el fondo deja de ser un blanco
 * sólido y pasa a ser casi transparente sobre el thea-green de Detalle,
 * el texto interno también se invierte (antes thea-green sobre blanco,
 * ahora blanco sobre la propia página) para seguir siendo legible — se
 * reusan los MISMOS valores rgba que ya usa la metadata de Experience
 * Card (rgba(251,251,251,0.5) para la ciudad, igual que su línea de
 * venue), no valores nuevos inventados para esta card.
 *
 * Avatar: círculo 96px con degradado placeholder (mismo gris/beige que
 * usa Supporting Card cuando no hay imagen — ver ImagePlaceholder) más
 * un ícono de edificio al 40% de opacidad — el nodo real de Figma no
 * trae foto real para este avatar todavía (es placeholder en el propio
 * diseño, no una foto de la compañía). `icon/building` es un trazo
 * placeholder propio (ver icons.tsx) hasta tener el real de Figma. Se
 * mantiene igual (no se le aplicó la inversión de color de arriba): es
 * el mismo placeholder claro que ya se usa dentro de cards oscuras en
 * el resto de la app (ImagePlaceholder dentro de Experience Card).
 *
 * `imageUrl` — 2026-09-04, agregado a pedido de Ana para probar cómo se
 * ve una foto real en este avatar (primer caso: "Xolo Modular" en Trance,
 * ver experiences.ts). Cuando viene, reemplaza el degradado+ícono por la
 * foto real (mismo `object-cover` circular que ya usan Experience/
 * Supporting Card); sin `imageUrl`, sigue cayendo al placeholder de
 * siempre — no cambia nada para las piezas que todavía no tienen foto.
 *
 * `variant` — agregado 2026-09-04 para reusar esta misma card en Compra
 * (frame `compra-mobile`, 1861:554), que la trae CLARA (bg-[#fbfbfb]
 * opaco, texto thea-green) — el mismo trazo literal que esta card tenía
 * ANTES de que Ana pidiera oscurecerla para Detalle (ver nota de arriba
 * sobre el cambio de fondo). En vez de deshacer ese cambio (que fue un
 * pedido explícito de Ana para Detalle) o duplicar el componente entero,
 * se agrega esta variante: `variant="dark"` (default) mantiene el
 * comportamiento actual sin tocar nada en Detalle; `variant="light"` es
 * la versión clara para contextos con fondo blanco/claro alrededor,
 * como la card de Compra.
 *
 * `orientacion` — 2026-09-14, a pedido de Ana solo para el Detalle en
 * Desktop: "la card de quienes hacen parte esta muy alta, debe ser mas
 * cuadrada o rectangular". La card original es una columna centrada
 * (avatar arriba, texto debajo) — angosta y alta a propósito, pensada
 * para mobile/Compra. En vez de tocar ese layout (usado también en
 * mobile, ver arriba — regla de esta sesión: nunca mobile sin pedido
 * explícito para ESE archivo), se agrega `orientacion` ("vertical" por
 * defecto, mismo comportamiento de siempre) con una opción "horizontal"
 * (avatar a la izquierda, texto a la derecha) que solo usa la llamada
 * nueva de Desktop. */
import { IconBuilding } from "../icons";

export default function ArtistSpaceCard({
  nombre,
  categoria,
  ciudad,
  imageUrl,
  variant = "dark",
  orientacion = "vertical",
}: {
  nombre: string;
  categoria: string;
  ciudad: string;
  imageUrl?: string;
  variant?: "dark" | "light";
  orientacion?: "vertical" | "horizontal";
}) {
  const isLight = variant === "light";
  const esHorizontal = orientacion === "horizontal";

  const avatar = imageUrl ? (
    <img
      src={imageUrl}
      alt=""
      className={`rounded-full object-cover shrink-0 ${esHorizontal ? "h-20 w-20" : "h-24 w-24"}`}
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${esHorizontal ? "h-20 w-20" : "h-24 w-24"}`}
      style={{
        background: "linear-gradient(to right, #ebe9e6, #dcdad6, #cfcdc9)",
      }}
    >
      <IconBuilding className="w-5 h-5 text-thea-green opacity-40" />
    </div>
  );

  if (esHorizontal) {
    return (
      <div
        className={`flex items-center gap-5 p-6 rounded-2xl w-full ${
          isLight ? "bg-white-100 border border-green-12" : "bg-white-6"
        }`}
      >
        {avatar}
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          <p
            className={`font-display text-xl tracking-[-0.1px] ${
              isLight ? "text-thea-green" : "text-white-100"
            }`}
          >
            {nombre}
          </p>
          <span
            className={`font-body font-semibold text-[10px] uppercase px-2 py-1 rounded ${
              isLight ? "bg-green-8 text-thea-green" : "bg-white-12 text-white-100"
            }`}
          >
            {categoria}
          </span>
          <p
            className="font-body text-xs"
            style={{ color: isLight ? "rgba(17,44,44,0.5)" : "rgba(251,251,251,0.5)" }}
          >
            {ciudad}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl w-[280px] ${
        isLight ? "bg-white-100 border border-green-12" : "bg-white-6"
      }`}
    >
      {avatar}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <p
          className={`font-display text-xl tracking-[-0.1px] text-center ${
            isLight ? "text-thea-green" : "text-white-100"
          }`}
        >
          {nombre}
        </p>
        <span
          className={`font-body font-semibold text-[10px] uppercase px-2 py-1 rounded ${
            isLight ? "bg-green-8 text-thea-green" : "bg-white-12 text-white-100"
          }`}
        >
          {categoria}
        </span>
      </div>
      <p
        className="font-body text-xs text-center"
        style={{ color: isLight ? "rgba(17,44,44,0.5)" : "rgba(251,251,251,0.5)" }}
      >
        {ciudad}
      </p>
    </div>
  );
}
