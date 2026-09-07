import { IconHeart, IconHeartFilled } from "./icons";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

/*
 * Botón de favorito reusado por las 3 Experience Cards + el hero de
 * Detalle — se extrae acá para no repetir el markup 3+ veces.
 *
 * IconHeart trae el trazo real (viewBox 24×24, exportado a mano
 * 2026-09-02) — se escala acá vía className para cumplir el spec.
 *
 * 2026-09-03, a pedido de Ana ("quiero que los corazones empiecen a ser
 * clickeables y que empiecen a aparecer en favs"): el botón ahora es
 * funcional — lee/escribe el estado global de favoritos (FavoritesContext,
 * ver esa nota para el porqué del Context+localStorage en vez de backend
 * real).
 *
 * Corazón relleno (estado activo) — 2026-09-03, tres vueltas con Ana: 1)
 * "Copy as SVG" que resultó ser el mismo trazo que el contorno (nodo
 * equivocado); 2) un asset relleno real pero con viewBox 18×15 (Ana notó
 * que el corazón "crecía" al favoritear — la proporción no coincidía con
 * el contorno 24×24); 3) el trazo final, mismo contorno exterior que
 * IconHeart pero cerrado sin el recorte interior — mismo viewBox 24×24,
 * misma geometría exacta, solo sólido en vez de hueco. Ver nota completa
 * en icons.tsx (IconHeartFilled).
 *
 * BUG REAL encontrado 2026-09-03 (Ana: "los corazones de la home no
 * estan... los pusiste del lado izq, van del lado derecho"): el botón
 * traía `relative` hardcodeado en su propio className base, y cada card
 * le pasaba `className="absolute top-X right-X"` para posicionarlo en la
 * esquina de la imagen. En el CSS generado por Tailwind, `.relative`
 * queda declarado DESPUÉS de `.absolute` — así que `position: relative`
 * ganaba la cascada sin importar el orden en el string de className. El
 * botón nunca llegaba a `position: absolute` de verdad: quedaba en el
 * flujo normal del documento (como primer hijo "en flujo" de la card,
 * ya que la imagen y los degradados son absolutos) y el `top`/`right`
 * que le pasaba la card se interpretaba como offset relativo a esa
 * posición en vez de como esquina del contenedor — de ahí que apareciera
 * corrido a la izquierda y tapado/perdido en vez de arriba a la derecha.
 *
 * Se resolvió sacando `relative` del className base del botón (ya no
 * hace falta — ver debajo, el halo con corazón duplicado se reemplazó
 * por `drop-shadow`, así que el botón no necesita ser positioning
 * context para ningún hijo absoluto). Ahora cada card controla 100% del
 * posicionamiento vía el className que pasa, sin conflicto de cascada.
 *
 * SIN círculo de fondo — 2026-09-03, cambio de dirección de Ana: "no
 * quiero círculo de visibilidad, algo como Fever o Airbnb... el corazón
 * con relleno de un color oscuro muy transparente y luego el relleno del
 * color que va a ir". Primera implementación: corazón sólido más grande
 * (24px) DETRÁS del ícono real (18px), en negro muy transparente, como
 * halo de legibilidad (truco de Airbnb: 2 siluetas superpuestas, no un
 * blur). Ana señaló un problema real con esto: el halo (24px) sobresalía
 * visiblemente más grande que el contorno del ícono sin favoritear
 * (18px, solo trazo fino) — se veía como una mancha oscura más grande
 * que el corazón mismo, no un halo sutil.
 *
 * 2026-09-03, fix: se reemplazó el halo (corazón duplicado, más grande,
 * absolutamente posicionado) por `drop-shadow` — mismo recurso que ya
 * usan Volver/Compartir en el hero de Detalle (ver nota ahí). El
 * drop-shadow sigue el contorno EXACTO del ícono real, sea outline o
 * relleno, así que nunca puede verse "más grande" que el ícono — y de
 * paso deja de necesitar el hijo absoluto (por eso ya no hace falta
 * `relative` en el botón, ver arriba). Ícono subido de 18px a 24px
 * (`w-6 h-6`) — a pedido de Ana, "obviamente" muy chico antes — y área
 * táctil de 36px a 40px.
 *
 * Historial del fondo (para contexto, ya no aplica): 1) chip circular
 * blanco 80% + ícono thea-green (original) → 2) chip thea-deep + ícono
 * blanco/mint (prueba) → 3) chip blanco sólido (`white-100`) + ícono
 * thea-deep, contorno y relleno (prueba) → 4) sin chip, halo de corazón
 * duplicado (bug de tamaño) → 5) sin chip, drop-shadow (la de acá) →
 * 6) 2026-09-04, probado de nuevo un chip circular oscuro muy opaco a
 * pedido explícito de Ana ("en los iconos que estan en la card de
 * pieza... podemos poner un breve circulito oscuro muy opaco"); ese
 * mismo día, viéndolo ya andando, Ana volvió atrás: "corazon: devuelve
 * a como estaba antes no me gusto" — se revierte al punto 5
 * (drop-shadow, sin chip), que es donde queda esto ahora. Se deja el
 * historial completo (incluido el punto 6, ya descartado) para que la
 * próxima vez que alguien proponga un chip circular acá quede claro que
 * ya se probó 2 veces y no convenció ninguna de las 2.
 *
 * Color del corazón activo — 2026-09-03: primero probado a pedido de Ana
 * ("solo por probar, lo podemos poner en el rojo de thea???"), pasado de
 * thea-mint a thea-red. Le gustó y lo confirmó como regla fija ("hay que
 * dejar acentado que solo Theaveling y los corazones van a usar este
 * color") — ya NO es una prueba. STACK.md (`knowledge/STACK.md`, sección
 * "01 — Brand") quedó actualizado con esta excepción: Thea Red pasa a
 * tener 2 usos aprobados, y solo esos 2 — el wordmark "Theaveling" y el
 * corazón de favorito activo. "Eliminar cuenta" en DatosDeCuenta.tsx
 * también usaba thea-red y NO era uno de esos 2 casos — ya resuelto
 * (2026-09-03): pasó a `text-warning` (`--color-warning`, ver
 * DatosDeCuenta.tsx e index.css), no se sumó como tercera excepción acá.
 */
export default function FavoritoButton({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const { isFavorito, toggleFavorito } = useFavorites();
  const { requireAuth } = useAuth();
  const active = isFavorito(id);

  return (
    <button
      type="button"
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // 2026-09-06, parte del Login contextual: favoritear es uno de
        // los 3 momentos donde el login "aporta valor" (ver
        // AuthContext.tsx) — si ya hay sesión, `requireAuth` ejecuta
        // `toggleFavorito` de inmediato sin mostrar nada; si no, abre
        // LoginSheet con este mensaje y recién favoritea si el login se
        // completa. Quien está de visita puede seguir mirando todo el
        // catálogo sin sesión — el gate es solo acá, al querer guardar.
        requireAuth(
          "Crea una cuenta para guardar tus experiencias favoritas.",
          () => toggleFavorito(id),
        );
      }}
      className={`h-10 w-10 flex items-center justify-center ${className}`}
    >
      {active ? (
        <IconHeartFilled className="w-6 h-6 text-thea-red drop-shadow-[0_1px_4px_rgba(1,20,20,0.6)]" />
      ) : (
        <IconHeart className="w-6 h-6 text-white-100 drop-shadow-[0_1px_4px_rgba(1,20,20,0.6)]" />
      )}
    </button>
  );
}
