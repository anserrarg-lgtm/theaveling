import { useState } from "react";
import MobileTopBar from "../../components/MobileTopBar";
import MobileBottomNav from "../../components/MobileBottomNav";
import ReservationCard from "../../components/ReservationCard";
import { getExperienceById } from "../../data/experiences";
import { IconTicket } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";

/*
 * Reservas — nodo real de Figma `reservas-screen` (`1557:348`), dentro
 * de "07 — Reservas" del archivo Prototipo final
 * (`Bas9SSdMLitN1S37kjFeOy`), traído vía get_design_context 2026-09-04
 * a pedido de Ana ("vamos a la pantalla de reservas"). Reemplaza el
 * placeholder estructural que había antes (ver ARCHITECTURE.md,
 * "Contenido de Reservas... pendiente de construir").
 *
 * Fondo verde — mismo criterio de conversión que Perfil/Notificaciones/
 * Datos de cuenta/Ayuda: Figma trae este screen sobre fondo claro
 * (`#fbfbfb`), se pasa a `thea-green` + `white-100`.
 *
 * Sin header fijo con back — a diferencia de Notificaciones/Datos de
 * cuenta/Ayuda, Reservas es un tab PRINCIPAL del Bottom Nav (no una
 * pantalla a la que se llega con "volver"), mismo estatus que
 * Descubrir/Perfil — por eso usa el `MobileTopBar` normal (logo +
 * lupa, sin back) tal cual ya traía este archivo, y el título
 * "Reservas" no queda fijo, se desplaza con el contenido (así lo
 * dibuja Figma también: el título vive DEBAJO del Top Bar fijo, no es
 * parte de él).
 *
 * Título "Reservas" — Figma lo tipografía en Instrument Sans (font
 * body) SemiBold 24px, no en el Archivo/Sansita Thin que STACK.md
 * describe para "Display/H1 grandes" — se respeta el trazo real de
 * este nodo puntual en vez de forzar la regla general, mismo criterio
 * que ya se usa en toda esta sesión (hint de Figma > asunción
 * genérica) cuando hay un nodo real que lo contradice.
 *
 * Datos — las 4 reservas de ejemplo (`RESERVAS_INICIALES` abajo) usan
 * experiencias REALES de `experiences.ts` (título/categoría/venue/
 * ciudad, no inventados) — Figma traía 2 títulos que sí existen en el
 * catálogo ("Cuerpos en tránsito", con nombre completo distinto ahí, y
 * "Fronteras Difusas: Retrospectiva", idem) y 2 que no existen
 * ("La omisión de la familia Coleman", "Giselle contemporánea") —
 * mismo problema ya resuelto en Busqueda.tsx/Tendencias: se mantienen
 * las 2 que sí matchean (con su título REAL completo) y se reemplazan
 * las otras 2 por experiencias reales adicionales, elegidas por
 * variedad de categoría (Teatro inmersivo, Música experimental). La
 * fecha/hora de cada reserva SÍ es inventada de cero — el tipo
 * `Experience` no modela funciones programadas (es contenido
 * "siempre disponible"), así que no hay ningún dato real de fecha de
 * función que reusar; son fechas de "primera pasada", ajustadas para
 * caer de verdad antes/después de hoy (Próximas en el futuro, Pasadas
 * en el pasado — Figma usaba fechas de marzo/febrero sueltas que no
 * se corresponden con ninguna fecha real "de hoy").
 *
 * "Ver ticket" / "Ver en mapa" / "Volver a reservar" / "Dejar reseña"
 * — ver la nota grande en ReservationCard.tsx, que es donde vive toda
 * esa lógica (acordeones reales, no decorativos).
 *
 * "Cancelar reserva" — 2026-09-04, a pedido de Ana. `RESERVAS` pasa de
 * ser una constante fija a vivir en `useState` acá (antes no hacía
 * falta modificarla nunca) porque cancelar necesita QUITAR una reserva
 * de la lista de verdad — no alcanza con la constante de solo lectura.
 * `manejarCancelar(experienciaId)` filtra esa reserva de "Próximas" y
 * listo (no se mueve a ninguna sección "Canceladas" — Ana no pidió esa
 * sección, y no hay backend que necesite registrar el cambio de
 * estado); el botón/confirmación en sí vive en ReservationCard.tsx (ver
 * esa nota grande sobre la política de cancelación genérica).
 *
 * "Próximas" / "Pasadas" — 2026-09-04, a pedido de Ana: "viste como
 * pusiste preferencias en perfil asi pon en reservas proximas y
 * pasadas". Antes eran `text-sm font-semibold`, una (Próximas) en
 * `white-100` y la otra (Pasadas) en `white-60` — inconsistentes entre
 * sí y con peso similar al contenido de abajo. Pasan al mismo lenguaje
 * de encabezado "de apoyo" que ya usa "Preferencias" en Perfil.tsx (y
 * "Cerca de ti"/"Recientes"/"Ciudades sugeridas" en LocationSheet.tsx):
 * `text-[13px]` uppercase, `tracking-wide`, `white-40` — chico y
 * apagado, subordinado a las reservas mismas, que son las que llevan el
 * peso visual. Ahora Próximas y Pasadas comparten el mismo tratamiento
 * (antes no era ni siquiera igual entre ellas dos).
 *
 * Gate de login — 2026-09-07, bug real encontrado por Ana ("no me pide
 * iniciar sesion para ver las reservas"): esta pantalla mostraba
 * `RESERVAS_INICIALES` sin importar si había sesión o no, aunque
 * `AuthContext.tsx` documenta desde el principio "reservas" como uno de
 * los 3 momentos donde el login "aporta valor" (junto con favoritos y
 * perfil, ver la nota grande de ese archivo) — Perfil.tsx sí tenía su
 * gate (`if (!loggedIn)`), este archivo se quedó sin el suyo. Se agrega
 * el mismo patrón, mismo espíritu de copy ("Inicia sesión para ver tus
 * reservas") y mismo tratamiento visual (ícono + título + texto +
 * botón, Bottom Nav siempre visible), cambiando solo el ícono
 * (`IconTicket` en vez de `IconUser`, más apropiado acá) y la frase.
 */

const RESERVAS_INICIALES = [
  { experienciaId: "cuerpos-en-transito", fechaHora: "Sábado 12 sep · 20:30", estado: "proxima" as const },
  { experienciaId: "la-casa-de-los-silencios", fechaHora: "Viernes 25 sep · 19:00", estado: "proxima" as const },
  { experienciaId: "fronteras-difusas", fechaHora: "Viernes 15 ago · 20:00", estado: "pasada" as const },
  { experienciaId: "trance-ritual-sonoro", fechaHora: "Sábado 2 ago · 21:00", estado: "pasada" as const },
];

export default function Reservas() {
  const [reservasBase, setReservasBase] = useState(RESERVAS_INICIALES);
  const { loggedIn, requireAuth } = useAuth();

  const manejarCancelar = (experienciaId: string) => {
    setReservasBase((prev) => prev.filter((r) => r.experienciaId !== experienciaId));
  };

  const reservas = reservasBase.map((r) => ({
    ...r,
    experience: getExperienceById(r.experienciaId),
  })).filter(
    (r): r is typeof r & { experience: NonNullable<typeof r.experience> } =>
      r.experience !== undefined,
  );

  const proximas = reservas.filter((r) => r.estado === "proxima");
  const pasadas = reservas.filter((r) => r.estado === "pasada");

  // Sin sesión — ver la nota grande de arriba ("Gate de login"). Mismo
  // patrón que Perfil.tsx: el tab sigue siendo alcanzable desde el
  // Bottom Nav, solo que su contenido pide login antes de mostrar nada.
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-thea-green text-white-100 pb-[72px] flex flex-col">
        <MobileTopBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="h-14 w-14 rounded-full bg-white-8 flex items-center justify-center">
            <IconTicket className="w-6 h-6 text-white-60" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-xl text-white-100">
              Tus reservas te esperan
            </h1>
            <p className="font-body text-sm text-white-60 max-w-[260px]">
              Inicia sesión para ver tus próximas experiencias y tu
              historial de reservas.
            </p>
          </div>
          <button
            onClick={() =>
              requireAuth(
                "Inicia sesión para ver tus reservas.",
                () => {},
              )
            }
            className="h-12 px-6 rounded-xl bg-white-100 text-thea-green font-body font-semibold text-[15px]"
          >
            Iniciar sesión
          </button>
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <MobileBottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-thea-green pb-[72px] text-white-100">
      <MobileTopBar />

      <h1 className="font-body font-semibold text-2xl px-5 pt-4 pb-2">Reservas</h1>

      {proximas.length > 0 && (
        <section className="flex flex-col px-5 py-2">
          <h2 className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide mb-2">
            Próximas
          </h2>
          {proximas.map((r, i) => (
            <div key={r.experienciaId}>
              <ReservationCard
                experience={r.experience}
                fechaHora={r.fechaHora}
                estado={r.estado}
                onCancelar={() => manejarCancelar(r.experienciaId)}
              />
              {i < proximas.length - 1 && <div className="h-px w-full bg-white-6" />}
            </div>
          ))}
        </section>
      )}

      <div className="h-px w-full bg-white-12" />

      {pasadas.length > 0 && (
        <section className="flex flex-col px-5 py-4">
          <h2 className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide mb-2">
            Pasadas
          </h2>
          {pasadas.map((r, i) => (
            <div key={r.experienciaId}>
              <ReservationCard
                experience={r.experience}
                fechaHora={r.fechaHora}
                estado={r.estado}
              />
              {i < pasadas.length - 1 && <div className="h-px w-full bg-white-6" />}
            </div>
          ))}
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0">
        <MobileBottomNav />
      </div>
    </div>
  );
}
