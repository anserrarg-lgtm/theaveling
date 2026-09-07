import { useNavigate } from "react-router-dom";
import Wordmark from "./Wordmark";
import { IconMapPin, IconSearch } from "./icons";

/*
 * "Mobile Top Bar" — master `1552:173` (light) / `1582:290` (verde).
 * Spec verificado en vivo en Figma (2026-08-31): 390×56, px-20, items-center
 * justify-between. En la Home ensamblada (`home-mobile`) el fondo real
 * usado es rgba(1,20,20,0.95), no el #011414 sólido del master aislado —
 * se usa ese valor de instancia acá porque estamos armando Home, no el
 * catálogo de componentes.
 *
 * 2026-09-02: valor registrado como token `thea-deep` en index.css (antes
 * repetido "a mano" acá y en CategoryTabs.tsx/MobileBottomNav.tsx).
 *
 * 2026-09-04, a pedido de Ana: sacar la fila de Ubicación (ícono + "Bogotá"
 * subrayado, `LocationIndicator`) de Descubrir — "no lo quiero ahi, quiero
 * SOLO el icono al lado de la lupa, a su lado izquierdo". Ese ícono ahora
 * vive acá, como botón propio a la izquierda de Buscar, y al tocarlo abre
 * `LocationSheet` (ver ese componente). `onLocationClick` es opcional
 * para no forzar el ícono en pantallas que todavía no lo necesitan
 * (Reservas, que también usa este Top Bar) — sin ese prop, la barra queda
 * igual que antes.
 *
 * Tamaño de los 2 íconos — 2026-09-04, varias vueltas con Ana hasta
 * que quedó bien:
 * 1) subí Ubicación a 16px y después a 20px comparándolo contra "los
 *    demás iconos principales, share/back/lupa/favoritos" (esos viven
 *    en 24px). Igualé los DOS acá a 24px pensando que la caja igual =
 *    se ve igual.
 * 2) Ana: "la lupa se ve enorme". El trazo de IconSearch dibuja borde
 *    a borde dentro de su viewBox nativo de 16×16, más "denso" que
 *    IconMapPin (viewBox 24×24, mucho aire adentro). Se bajó a
 *    Ubicación 18px / Buscar nativo (16px) a ojo — mejoró pero Ana
 *    seguía viéndolos distintos: "NO SE VEN IGUAL TODAVIA", pero dio
 *    permiso de que estos 2 salgan de la norma de 24px del resto de
 *    la app con tal de que se vean iguales ENTRE ELLOS.
 * 3) En vez de seguir a ojo, se midió real: se renderizó cada ícono a
 *    un canvas y se contó qué % del cuadro llenan los píxeles del
 *    trazo (no solo el viewBox). Buscar llena ~18.2% de su caja;
 *    Ubicación solo ~11.0% de la suya — son casi 1.29x menos densos.
 *    Iguales en "tinta" (no en caja) es lo que de verdad se percibe
 *    como "mismo tamaño". Con Buscar en 18px, Ubicación necesita
 *    18×1.29 ≈ 23px para tener la misma cantidad de tinta.
 */
export default function MobileTopBar({
  onLocationClick,
}: {
  onLocationClick?: () => void;
}) {
  const navigate = useNavigate();

  return (
    // 2026-09-07: pt-[var(--safe-top)] + h-[calc(...)] — ver la nota
    // grande de --safe-top en index.css. El alto total crece con la
    // barra de estado del celular (0 en escritorio), pero el padding
    // empuja el contenido (logo/íconos) para que siga viéndose a 56px
    // de alto de siempre, ahora debajo de la hora/batería/wifi en vez
    // de tapado por ellos.
    // 2026-09-07: bg-[rgb(1,20,20)] (sólido) en vez de bg-thea-deep (95%
    // opaco) — a pedido de Ana, que seguía viendo un corte de color justo
    // donde termina la barra de estado del celular (hora/batería/wifi) y
    // empieza este header, aun con el padding de --safe-top ya puesto.
    // La barra de estado se pinta 100% sólida (ver theme-color en
    // index.html); este header, con thea-deep, dejaba pasar un 5% del
    // verde de fondo (bg-thea-green del body) — casi imperceptible contra
    // el resto de la pantalla, pero notorio pegado a un color 100% sólido
    // arriba. Mismo criterio que ya se usó para arreglar el "ghosting" en
    // Perfil/Notificaciones/Busqueda (ver esas notas): reemplazar el tono
    // traslúcido por el mismo tono 100% opaco.
    <header className="h-[calc(56px_+_var(--safe-top))] pt-[var(--safe-top)] flex items-center justify-between px-5 bg-[rgb(1,20,20)]">
      <Wordmark />
      {/* mt-[3px] — 2026-09-04, a pedido de Ana: "siento que estan
          ligeramente mas arriba que Theaveling". Medido en captura de
          pantalla real, pixel por pixel: el bloque de tinta del
          wordmark (fuente Sansita) cae centrado ~2.5px más abajo que
          el de los íconos, aunque las cajas de ambos ya estén
          perfectamente centradas por `items-center` (fuente de
          display con mucho aire propio arriba/abajo del glifo — eso
          es lo que se percibía "corrido", no un error de layout). Se
          empuja el grupo de íconos 3px hacia abajo para igualar el
          centro óptico real, no el centro geométrico de la caja. */}
      {/* 2026-09-04, a pedido de Ana: "el icono de lupa y ubicacion...
          esta muy separado, acerca el pin un poco a la lupa". Primera
          vuelta movió los DOS íconos uno hacia el otro — Ana corrigió:
          quería solo el pin moviéndose hacia la lupa, la lupa se queda
          donde siempre estuvo (centrada en su caja). Los dos botones
          siguen siendo cajas de 40×40 (mismo tap target de siempre, no
          se achica por estética) — Ubicación empuja su ícono hacia el
          borde derecho de su caja (`justify-end`), Buscar sigue
          centrado (`justify-center`, como al principio). `gap-1` en
          vez de `gap-2` para cerrar un poco más el espacio entre las
          dos cajas. */}
      <div className="flex items-center gap-1 mt-[3px]">
        {onLocationClick && (
          <button
            onClick={onLocationClick}
            aria-label="Elegir ubicación"
            className="h-10 w-10 flex items-center justify-end text-white-100"
          >
            {/* 2026-09-04: subido de 23px a 25px — Ana seguía viéndolo
                "un poquito" más chico que la lupa incluso después de
                igualar la densidad de tinta (ver nota de arriba, punto
                3) — ajuste fino final a ojo sobre esa base medida. */}
            <IconMapPin className="w-[25px] h-[25px]" />
          </button>
        )}
        {/* 2026-09-04: antes no hacía nada (sin onClick) — a pedido de
            Ana ("hagamos la pantalla de busqueda") ya lleva a /busqueda
            (ver Busqueda.tsx), la pantalla real de Figma (05 — Búsqueda,
            `search-screen` 2034:702). */}
        <button
          onClick={() => navigate("/busqueda")}
          aria-label="Buscar"
          className="h-10 w-10 flex items-center justify-center text-white-100"
        >
          <IconSearch className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
}
