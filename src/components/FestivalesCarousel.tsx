/*
 * FestivalesCarousel — 2026-09-07, a pedido de Ana para la sección
 * especial "El arte toma la ciudad" (Festivales) dentro de Cultura, ver
 * la nota grande sobre `FESTIVALES_CIUDAD_IDS` en data/experiences.ts.
 *
 * Pedido textual: "cards grandes igual a las de curado, pero en vez de
 * que sea scroll hacia abajo van a aparecer puntos abajo y se van a ir
 * pasando solas". Reusa `ExperienceCardCurado` tal cual (mismo tamaño,
 * a sangre) pero en vez de apilarlas en columna (como el riel de Curado
 * en "Todo"), muestra una sola a la vez con un track deslizable y
 * avanza sola cada `DURACION_AUTOPLAY_MS`, en loop.
 *
 * Distinto del carrusel de Bienvenida.tsx (que terminó siendo 100%
 * manual, sin avance automático, por pedido explícito de Ana en esa
 * pantalla) — acá SÍ pidió avance automático, así que no hay que copiar
 * esa decisión de Bienvenida sin más. Lo que sí se reusa de ahí es el
 * mecanismo visual (track `flex` + `translateX` + puntos de paginación
 * tappables) porque ya está resuelto y probado en esta app.
 *
 * Tocar un punto salta directo a ese festival Y reinicia el temporizador
 * de autoplay (si no, un segundo después de tocar un punto el carrusel
 * podría saltar de nuevo solo, sensación de "pelea" con el usuario).
 *
 * `prefers-reduced-motion`: se respeta apagando el autoplay por completo
 * (no solo la transición) — a diferencia de Bienvenida, que sí igual
 * avanzaba pasos importantes del flujo con reduced motion (acá no hay
 * flujo que completar, es contenido de scroll libre, así que no avanzar
 * solo es la opción más simple y más respetuosa).
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExperienceCardCurado from "./cards/ExperienceCardCurado";
import type { Experience } from "../data/experiences";

const DURACION_AUTOPLAY_MS = 5000;
const DURACION_TRANSICION_MS = 500;

export default function FestivalesCarousel({
  experiencias,
}: {
  experiencias: Experience[];
}) {
  const [indice, setIndice] = useState(0);
  const [reducirMovimiento, setReducirMovimiento] = useState(false);

  useEffect(() => {
    setReducirMovimiento(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Se re-arma cada vez que cambia `indice` (auto o por tap en un
  // punto) — así tocar un punto reinicia la cuenta en vez de que el
  // autoplay salte de nuevo un instante después.
  useEffect(() => {
    if (reducirMovimiento || experiencias.length <= 1) return;
    const t = setTimeout(() => {
      setIndice((i) => (i + 1) % experiencias.length);
    }, DURACION_AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [indice, reducirMovimiento, experiencias.length]);

  if (experiencias.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden">
        <div
          className={`flex ${
            reducirMovimiento ? "" : "transition-transform ease-out"
          }`}
          style={{
            transform: `translateX(-${indice * 100}%)`,
            transitionDuration: reducirMovimiento
              ? undefined
              : `${DURACION_TRANSICION_MS}ms`,
          }}
        >
          {experiencias.map((exp) => (
            <Link
              key={exp.id}
              to={`/experiencia/${exp.id}`}
              className="w-full shrink-0"
            >
              <ExperienceCardCurado
                id={exp.id}
                title={exp.title}
                description={exp.description}
                imageUrl={exp.imageUrl}
                imagePosition={exp.imagePosition}
              />
            </Link>
          ))}
        </div>
      </div>

      {experiencias.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {experiencias.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              aria-label={`Ir al festival ${i + 1} de ${experiencias.length}`}
              aria-current={i === indice}
              className="p-1.5 -m-1.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === indice ? "w-5 bg-white-100" : "w-1.5 bg-white-20"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
