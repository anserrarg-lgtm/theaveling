/*
 * "Experience Card — Curado" (Desktop) — nodo real de Figma "Tarjeta de
 * Experiencia Curada" dentro de `categoría-theaveling-cards desktop`
 * (`1407:14`), traído vía get_design_context 2026-09-08 (primera
 * pantalla de Theaveling Desktop). A sangre horizontal (w-full, 310px de
 * alto fijo) con degradado inferior únicamente — a diferencia de la
 * versión mobile (`ExperienceCardCurado.tsx`), que además de ser vertical
 * trae degradado arriba Y abajo; acá el nodo real de Figma solo trae el
 * de abajo, se respeta esa diferencia real en vez de calcar mobile.
 *
 * Categoría — el nodo de Figma sí trae un eyebrow de categoría encima
 * del título ("DANZA CONTEMPORÁNEA"), que la card de Curado de mobile no
 * muestra. Se usa `exp.category` (ya existe en el catálogo real,
 * `data/experiences.ts`) para ese eyebrow.
 *
 * Botón de favorito — se reusa `FavoritoButton` tal cual (drop-shadow,
 * sin chip circular), NO el chip circular blanco que trae el nodo de
 * Figma: Ana ya probó y descartó el chip 2 veces para esta misma familia
 * de cards (ver nota grande en FavoritoButton.tsx) — se prioriza esa
 * decisión ya tomada sobre calcar un nodo de Figma que es anterior a
 * ella.
 *
 * Chip "Destacado" — 2026-09-12, a pedido de Ana: la sección "Curado"
 * pasa de 3 cards grandes apiladas a UNA sola grande (esta) + un riel
 * chico debajo con las demás (ver `ExperienceCardCuradoGridDesktop.tsx`
 * y la nota grande en `Descubrir.tsx`). Ana mandó de referencia el chip
 * "Populares" de Airbnb (píldora blanca, arriba a la izquierda de la
 * imagen) y pidió algo similar para la que queda grande — nuevo prop
 * opcional `destacado`, así este componente sigue sirviendo igual (sin
 * el prop) para cualquier otro lugar que lo use en el futuro.
 *
 * Segunda vuelta, mismo día — a pedido de Ana ("la etiqueta de destacada
 * puede no ser una pildora sino rectangular bordeada"): el chip deja de
 * ser una píldora (`rounded-full`) y pasa a un rectángulo con borde
 * (`rounded-md border`) — SOLO la forma cambia. Corrección inmediata de
 * Ana ("solo dije que los pusieras rectangular, no que le quitaras el
 * fill y el color"): el primer intento también había sacado el relleno
 * blanco y el texto verde (quedó hueco/blanco) — error mío, no pedido.
 * Se mantiene `bg-white-100`/`text-thea-green` tal cual estaban, con
 * el borde y las esquinas rectangulares sumados encima. Como sigue
 * atado al mismo prop `destacado`, este cambio de forma aplica a
 * cualquier card que use el prop en el futuro, no solo a "Comité del
 * Fracaso" (hoy es la única).
 *
 * `tituloColor`/`tituloFontFamily` — mismo pedido, puntual para "Comité
 * del Fracaso" (la pieza de clown): quiere su título en amarillo mostaza
 * y en la tipografía "Carnivalee Freakshow" (ver `@font-face`/
 * `--font-carnivalee` en index.css — Ana subió el archivo real de la
 * fuente, ya no cae a `cursive`). Se agregan como props opcionales EN
 * VEZ de cambiar el estilo por defecto del título: ninguna otra card de
 * esta familia pidió esto, así que sin pasarlos el título se ve
 * exactamente igual que antes (blanco, `font-display`).
 *
 * `renderTitulo`/tildecita dibujada a mano — 2026-09-12, mismo día: al
 * verificar con Playwright, la "é" de "Comité" se veía como un hueco en
 * blanco — el archivo de fuente que Ana subió tiene la "é" registrada
 * (no tira error) pero el glifo en sí está vacío, sin trazo (confirmado
 * inspeccionando el .ttf con fonttools: `numberOfContours: 0`). Ana lo
 * vio y pidió la solución puntual: "pon con letra e normal y tu le
 * dibujas un tildecita arriba" — en vez de la "é" (que no se dibuja), se
 * usa una "e" normal (esa sí tiene trazo) más una tildecita chica
 * dibujada con un `<span>` propio (una barrita rotada, no un carácter de
 * fuente) apoyada encima. Solo se activa cuando viene `tituloFontFamily`
 * (hoy, únicamente esta card) — para cualquier otra card sigue
 * renderizando el título tal cual, sin tocar nada. `aria-label` con el
 * título real completo para que lectores de pantalla sigan escuchando
 * "Comité" con tilde, aunque visualmente sea una "e" + una marca aparte.
 * La posición de la tildecita está en unidades `em` (no px fijos) para
 * que seguir sirviendo si el tamaño del título cambia — medida con
 * Playwright contra la caja real del glifo "e" en esta fuente puntual.
 *
 * `tituloTamano`/`descripcionTamano`/`descripcionLineas`/`descripcionAncho`
 * — 2026-09-12, mismo día, a pedido de Ana: "la letra de la desc de la
 * card de clown mas grande y hacia la izq, dos o 3 lineas. y el titulo
 * mucho mas grande". Mismo criterio que `tituloColor`/`tituloFontFamily`:
 * props opcionales puntuales para esta card, el resto de la familia
 * sigue igual si no se pasan (`text-[26px]` el título, `truncate` de una
 * línea la descripción, mismo ancho `right-24` de siempre). Cuando se
 * pasa `descripcionLineas`, la descripción deja el `truncate` de una
 * línea y pasa a `line-clamp-2`/`line-clamp-3`; `descripcionAncho` le
 * pone un `max-width` propio (en vez de heredar el ancho compartido con
 * el título) para que quede angosta y pegada a la izquierda en vez de
 * estirarse por toda la card.
 *
 * Ronda de ajuste fino, mismo día — a pedido de Ana:
 * - Tildecita "más corta... y un tris hacia la derecha": de `h-[0.32em]`
 *   a `h-[0.2em]`, y de centrada (`left-1/2`) a `left-[calc(50%+0.05em)]`
 *   (un toque a la derecha del centro de la "e").
 * - "la desc llegando mas hacia la derecha, no 3 lineas solo dos": el
 *   `descripcionAncho` que le pasa `Descubrir.tsx` sube (más ancho, ver
 *   ese archivo) y `descripcionLineas` baja de 3 a 2.
 * - "baja un poco el titulo hacia la desc": el espaciado entre bloques
 *   deja de ser un `gap-2` parejo (categoría-título y título-descripción
 *   con el mismo espacio) y pasa a márgenes propios por bloque —
 *   `mb-2` fijo en categoría y título (mismo espacio de antes por
 *   default), pero `tituloMargenInferior` (nuevo prop opcional) permite
 *   pisar el margen del título puntualmente para esta card y achicar
 *   SOLO el espacio título→descripción, sin tocar el de categoría→título.
 *
 * Ajuste fino, mismo día ("baja un poquito la tilde y ensanchala mas"):
 * `top-[0.1em]`→`top-[0.18em]` (un poco más abajo) y `w-[2px]`→`w-[3px]`
 * (trazo más ancho); la altura (`h-[0.2em]`) no cambió, solo se pidió
 * más ancha, no más larga. Después, otra vuelta más ("hazla mas
 * gruesa"): `w-[3px]`→`w-[5px]`. Y otra más ("y mas hacia abajo"):
 * `top-[0.18em]`→`top-[0.26em]` (con esto la tildecita queda a
 * `0.46em` de la parte de arriba del recuadro de línea — el trazo de
 * la "e" en esta fuente puntual empieza a `~0.49em`, ver la nota de
 * arriba sobre cómo se midió esa caja con Playwright — así que sigue
 * sin tocar la letra, solo le queda más cerca).
 */
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

function renderTituloConTildeDibujada(title: string) {
  const partes = title.split(/(é)/g);
  return partes.map((parte, i) =>
    parte === "é" ? (
      <span key={i} className="relative inline-block">
        e
        <span
          aria-hidden="true"
          className="absolute left-[calc(50%+0.05em)] top-[0.26em] h-[0.2em] w-[5px] -translate-x-1/2 rotate-[35deg] bg-current"
        />
      </span>
    ) : (
      <span key={i}>{parte}</span>
    ),
  );
}

export default function ExperienceCardCuradoDesktop({
  id,
  category,
  title,
  description,
  imageUrl,
  imagePosition,
  destacado,
  tituloColor,
  tituloFontFamily,
  tituloTamano,
  tituloMargenInferior,
  descripcionTamano,
  descripcionLineas,
  descripcionAncho,
}: {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
  destacado?: boolean;
  tituloColor?: string;
  tituloFontFamily?: string;
  tituloTamano?: string;
  tituloMargenInferior?: string;
  descripcionTamano?: string;
  descripcionLineas?: 2 | 3;
  descripcionAncho?: string;
}) {
  return (
    <div className="relative h-[310px] w-full overflow-hidden rounded-xl bg-white-8">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imagePosition ?? "center" }}
        />
      ) : (
        <ImagePlaceholder />
      )}

      {/* Degradado inferior únicamente — spec real del nodo Desktop. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {destacado && (
        <span className="absolute top-4 left-4 rounded-md border border-white-100 bg-white-100 px-3 py-1.5 font-body text-[13px] font-semibold text-thea-green">
          Destacado
        </span>
      )}

      <FavoritoButton id={id} className="absolute top-4 right-4" />

      <div className="absolute bottom-5 left-5 right-24 flex flex-col">
        <span className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[1.5px] text-white-80">
          {category}
        </span>
        <h3
          className="mb-2 font-display text-[26px] tracking-[-0.3px] text-white-100"
          style={{
            color: tituloColor,
            fontFamily: tituloFontFamily,
            fontSize: tituloTamano,
            marginBottom: tituloMargenInferior,
          }}
        >
          {tituloFontFamily ? (
            <span aria-label={title}>
              <span aria-hidden="true">{renderTituloConTildeDibujada(title)}</span>
            </span>
          ) : (
            title
          )}
        </h3>
        {/* rgba(251,251,251,.7) — mismo valor suelto (no coincide con
            ningún escalón de white-*) que ya usan las otras cards de
            esta familia para su descripción, ver ExperienceCardCurado.tsx. */}
        <p
          className={`font-body text-[13px] ${
            descripcionLineas === 3
              ? "line-clamp-3"
              : descripcionLineas === 2
                ? "line-clamp-2"
                : "truncate"
          }`}
          style={{
            color: "rgba(251,251,251,0.7)",
            fontSize: descripcionTamano,
            maxWidth: descripcionAncho,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
