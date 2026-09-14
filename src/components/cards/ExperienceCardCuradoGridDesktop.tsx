/*
 * "Experience Card — Curado" chica, para riel de scroll (Desktop) —
 * 2026-09-12, a pedido de Ana: la sección "Curado por Theaveling" tenía
 * 3 cards grandes (`ExperienceCardCuradoDesktop`, imagen a sangre con
 * degradado y texto adentro) apiladas una debajo de la otra. Ana pidió
 * dejar UNA sola grande/destacada arriba (ver `ExperienceCardCuradoDesktop`,
 * que ahora suma un prop `destacado` para el chip tipo "Populares" de
 * Airbnb que mandó de referencia) y mover las demás a un riel de scroll
 * horizontal debajo, chicas — pero manteniendo el mismo lenguaje visual
 * (texto ADENTRO de la imagen, no abajo en un bloque aparte como
 * `ExperienceCardGridDesktop`, que es la card de "Más reservados"/
 * "Descubrimientos"). Cita textual: "las demas en riel abajo chicas,
 * solo que con el texto adentro de la img, y tambien con lo mismo de
 * agrandarse como las otras secciones".
 *
 * Por qué un componente nuevo y no reusar `ExperienceCardGridDesktop`
 * con una variante más — esa card resuelve texto ABAJO de la imagen
 * (bloque de contenido en flujo normal, por eso su alto en hover puede
 * ser intrínseco/auto: crece porque el texto de abajo necesita más
 * lugar). Acá el texto va SUPERPUESTO arriba de la imagen (posición
 * absoluta, mismo criterio que `ExperienceCardCuradoDesktop`) — no hay
 * "contenido en flujo" que empuje un alto distinto, la imagen ocupa
 * 100% de la card en los 2 estados. Meter las 2 lógicas en un solo
 * componente con un prop de variante iba a ensuciar bastante el que ya
 * está probado y funcionando (`ExperienceCardGridDesktop`, con varios
 * bugs reales ya cazados ahí — ver sus notas grandes), así que se separa
 * en un componente propio que REUSA el mismo mecanismo de hover-expand
 * (mismo truco FLIP, mismo debounce de salida, mismo aviso entre cards
 * vecinas del riel) pero con alto FIJO en vez de intrínseco — ver más
 * abajo por qué acá sí es seguro usar un alto fijo sin repetir el bug de
 * "espacio vacío" que motivó sacarlo de la otra card.
 */
import { useLayoutEffect, useRef, useState } from "react";
import FavoritoButton from "../FavoritoButton";
import ImagePlaceholder from "../ImagePlaceholder";

export default function ExperienceCardCuradoGridDesktop({
  id,
  category,
  title,
  description,
  imageUrl,
  imagePosition,
}: {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [corrimientoIzquierda, setCorrimientoIzquierda] = useState(0);
  const ANCHO_HOVER = 420;
  // Alto FIJO en los 2 estados (no intrínseco como en
  // `ExperienceCardGridDesktop`) — acá es seguro: la imagen ocupa el
  // 100% de la card en ambos casos, así que un alto fijo mayor en hover
  // no deja "hueco vacío" en ningún lado, simplemente se ve más foto. El
  // texto va superpuesto (posición absoluta) sobre esa imagen, no
  // empuja ni necesita que el alto se ajuste a su contenido.
  const ALTO_NORMAL = 190;
  const ALTO_HOVER = 300;

  const cardRef = useRef<HTMLDivElement>(null);
  const rectAntesRef = useRef<DOMRect | null>(null);

  const guardarRectAntes = () => {
    if (cardRef.current) {
      rectAntesRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  // Mismo debounce de salida que `ExperienceCardGridDesktop` (ver nota
  // grande ahí, "hay algo raro cuando esta expandida") — evita el
  // parpadeo cuando el mouse tiembla justo en el borde de la card
  // agrandada.
  const leaveTimeoutRef = useRef<number | null>(null);

  const cancelarSalidaPendiente = () => {
    if (leaveTimeoutRef.current !== null) {
      window.clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  useLayoutEffect(() => {
    return () => cancelarSalidaPendiente();
  }, []);

  // Mismo mecanismo que `ExperienceCardGridDesktop` (ver su nota grande
  // "bug real que mandó Ana en video"): al agrandarse, esta card avisa
  // por un evento en su propio riel para que cualquier vecina que haya
  // quedado expandida se achique de una, sin animación — así nunca se
  // ven dos agrandadas superpuestas al mover el mouse rápido entre ellas.
  //
  // 2026-09-12 (segunda vuelta) — mismo arreglo que se hizo en
  // `ExperienceCardGridDesktop` tras confirmar el bug seguía pasando en
  // uso real: `hoveredRef` no solo se sincroniza en este
  // `useLayoutEffect` (que corre una vuelta de React DESPUÉS del cambio
  // de estado) sino también de forma directa e inmediata en el propio
  // `onMouseEnter`/`onMouseLeave` de más abajo — si no, con el mouse
  // moviéndose muy rápido, una vecina puede consultar este valor ANTES
  // de que ese efecto llegue a correr y verlo desactualizado.
  const hoveredRef = useRef(hovered);
  useLayoutEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  const EVENTO_HOVER = "theaveling:hover-card";

  useLayoutEffect(() => {
    const el = cardRef.current;
    const rail = el?.closest("[data-scroll-rail]") as HTMLElement | null;
    if (!rail) return;
    const alEmpezarOtraCard = (evento: Event) => {
      const otroId = (evento as CustomEvent<{ id: string }>).detail?.id;
      if (otroId === id || !hoveredRef.current) return;
      cancelarSalidaPendiente();
      const elActual = cardRef.current;
      if (elActual) {
        elActual.style.transition = "none";
        elActual.style.transform = "";
      }
      rectAntesRef.current = null;
      hoveredRef.current = false;
      setHovered(false);
    };
    rail.addEventListener(EVENTO_HOVER, alEmpezarOtraCard);
    return () => rail.removeEventListener(EVENTO_HOVER, alEmpezarOtraCard);
  }, [id]);

  // Mismo truco FLIP que `ExperienceCardGridDesktop` (ver esa nota
  // grande para el detalle completo de por qué existe: para que la
  // animación se vea "crece desde chiquita" y no "se desliza"). Acá es
  // más simple porque el alto ya es conocido de antemano (fijo) — no
  // hace falta la corrección imperativa de `top` que sí necesita la otra
  // card (alto intrínseco). El centrado vertical se calcula directo en
  // el propio `onMouseEnter`, como el horizontal.
  useLayoutEffect(() => {
    const el = cardRef.current;
    const antes = rectAntesRef.current;
    if (!el || !antes) return;
    rectAntesRef.current = null;
    const despues = el.getBoundingClientRect();
    const escala = antes.width / despues.width;
    const trasladoX =
      antes.left + antes.width / 2 - (despues.left + despues.width / 2);
    const trasladoY =
      antes.top + antes.height / 2 - (despues.top + despues.height / 2);
    el.style.transition = "none";
    el.style.transform = `translate(${trasladoX}px, ${trasladoY}px) scale(${escala})`;
    void el.getBoundingClientRect();
    const id = requestAnimationFrame(() => {
      el.style.transition = "transform 300ms ease-out";
      el.style.transform = "";
    });
    return () => cancelAnimationFrame(id);
  }, [hovered, corrimientoIzquierda]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={(e) => {
        cancelarSalidaPendiente();
        if (hovered) return;
        const rail = e.currentTarget.closest(
          "[data-scroll-rail]",
        ) as HTMLElement | null;
        const cardRect = e.currentTarget.getBoundingClientRect();
        const extra = ANCHO_HOVER - cardRect.width;
        let corrimiento = -extra / 2;
        if (rail) {
          const railRect = rail.getBoundingClientRect();
          const completa =
            cardRect.left >= railRect.left - 0.5 &&
            cardRect.right <= railRect.right + 0.5;
          if (!completa) return;
          const nuevaIzquierda = cardRect.left + corrimiento;
          const nuevaDerecha = nuevaIzquierda + ANCHO_HOVER;
          if (nuevaIzquierda < railRect.left) {
            corrimiento = railRect.left - cardRect.left;
          } else if (nuevaDerecha > railRect.right) {
            corrimiento = railRect.right - ANCHO_HOVER - cardRect.left;
          }
          rail.dispatchEvent(
            new CustomEvent(EVENTO_HOVER, { detail: { id } }),
          );
        }
        guardarRectAntes();
        setCorrimientoIzquierda(corrimiento);
        // Directo e inmediato — ver nota grande "condición de carrera"
        // en `ExperienceCardGridDesktop.tsx`.
        hoveredRef.current = true;
        setHovered(true);
      }}
      onMouseLeave={() => {
        leaveTimeoutRef.current = window.setTimeout(() => {
          leaveTimeoutRef.current = null;
          guardarRectAntes();
          hoveredRef.current = false;
          setHovered(false);
        }, 80);
      }}
      className={`absolute overflow-hidden rounded-xl bg-white-8 transition-shadow duration-300 ${
        hovered ? "z-20 shadow-2xl" : "top-0 left-0 right-0 h-full"
      }`}
      style={
        hovered
          ? {
              // Centrado vertical: mitad del crecimiento (300-190=110)
              // para arriba, mitad para abajo — mismo criterio que el
              // horizontal, pero acá se puede calcular directo porque el
              // alto en hover es un número fijo conocido de antemano.
              top: -(ALTO_HOVER - ALTO_NORMAL) / 2,
              left: corrimientoIzquierda,
              width: ANCHO_HOVER,
              height: ALTO_HOVER,
            }
          : { height: ALTO_NORMAL }
      }
    >
      <div className="relative h-full w-full">
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
        {/* Mismo degradado (solo inferior) que `ExperienceCardCuradoDesktop`
            — un poco más alto acá (45% en vez de 60%) porque en hover
            aparece también la descripción, necesita más aire legible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <FavoritoButton id={id} className="absolute top-3 right-3" />
        <div className="absolute right-4 bottom-4 left-4 flex flex-col gap-1.5">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[1.5px] text-white-80">
            {category}
          </span>
          <h3 className="font-display line-clamp-2 text-lg tracking-[-0.3px] text-white-100">
            {title}
          </h3>
          {/* Mismo criterio que "Más reservados"/"Descubrimientos": la
              descripción solo aparece en hover, cortada a 3 líneas con
              puntos suspensivos si no entra completa. */}
          {hovered && (
            <p
              className="font-body line-clamp-3 text-sm"
              style={{ color: "rgba(251,251,251,0.8)" }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
