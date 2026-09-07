import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPreview } from "./MapPreview";
import type { Experience } from "../data/experiences";
import {
  IconCalendar,
  IconCaretRight,
  IconMap,
  IconMapPin,
  IconTicket,
  IconXCircle,
} from "./icons";

/*
 * ReservationCard — nodo real de Figma "Reservation Card" (`1598:380`,
 * variantes "— Próxima" `2239:1019` y "— Pasada" `1965:666`), dentro de
 * "07 — Reservas" (`reservas-screen`, `1557:348`), traído vía
 * get_design_context 2026-09-04 a pedido de Ana ("vamos a la pantalla
 * de reservas").
 *
 * Fondo verde — Figma trae este screen sobre `mobile-top-bar`/fondo
 * claro (`#fbfbfb`), texto `#112c2c` — mismo criterio de conversión que
 * ya se aplicó a Perfil/Notificaciones/Datos de cuenta/Ayuda: se pasa a
 * `thea-green` sólido + `white-100`. El "eyebrow" de categoría
 * (PERFORMANCE/TEATRO/CINE/DANZA en Figma, `rgba(17,44,44,0.5)` 10px)
 * NO se mapea al gris atenuado literal — se usa `text-thea-mint`, el
 * mismo tratamiento que ya tienen TODAS las demás cards reales de la
 * app para su eyebrow (ver ExperienceCardMasReservados.tsx,
 * SupportingCard.tsx) — más consistente con el lenguaje ya convergido
 * de "cards" del proyecto que calcar el gris aislado de este nodo en
 * particular.
 *
 * Sin miniatura — Figma NO trae imagen en esta card (a diferencia de
 * las cards de Descubrir/Perfil), solo texto + íconos. Se respeta así,
 * no se agrega una foto que el diseño real no pide.
 *
 * Contenido — `experience` viene de `experiences.ts` (título, categoría,
 * venue, ciudad, todos reales), pero `fechaHora` es dato de LA RESERVA
 * puntual (una función/fecha específica), no del catálogo — el tipo
 * `Experience` no modela funciones con fecha propia (es contenido
 * "siempre disponible", no programado), así que se recibe aparte, como
 * prop, con contenido de primera pasada inventado en Reservas.tsx
 * (mismo criterio que el resto de datos "primera pasada" del proyecto).
 *
 * "Ver ticket" / "Ver en mapa" — en Figma llevan un ícono caret-down,
 * lo que sugiere un acordeón que expande contenido ahí mismo, no una
 * navegación a otra pantalla (se reutiliza `IconCaretRight` rotado 90°
 * en vez de dibujar un ícono nuevo — mismo trazo real, solo orientación
 * distinta, mismo criterio que ya se usa para el caret-left de "volver"
 * en toda la app). Se construyen los 2 como acordeones reales, no
 * decorativos:
 *  - "Ver en mapa" reutiliza `MapPreview` tal cual (mismo componente
 *    real que ya usan Detalle/Compra) — link de verdad a Google Maps
 *    por nombre de venue, no un mapa inventado.
 *  - "Ver ticket" no tiene ningún componente de ticket/QR real todavía
 *    en el proyecto (no hay backend de reservas, no hay QR que
 *    escanear de verdad) — en vez de fingir un código de barras/QR
 *    escaneable que no validaría nada, se arma un resumen de texto
 *    simple (evento, fecha, lugar, código) — mismo nivel de honestidad
 *    que el resto del contenido "primera pasada" del proyecto (no
 *    inventa precisión que no existe, pero tampoco deja el espacio
 *    muerto). El "código de reserva" se deriva de forma determinística
 *    del id de la experiencia (`codigoReserva()` abajo) para que no
 *    cambie en cada render/remount.
 *
 * "Volver a reservar" (Pasadas) — sí es un link real a
 * `/experiencia/:id` (Detalle), mismo patrón que el resto de la app.
 * "Dejar reseña" — no hay ningún sistema de reseñas real en el
 * proyecto todavía (nadie lo pidió, no se inventa) — se deja como
 * texto NO interactivo. Ana lo puede pedir después si hace falta.
 * Encaja además con cómo el propio Figma ya lo dibuja más apagado que
 * "Volver a reservar" (mismo texto atenuado que el resto de estados
 * secundarios/deshabilitados de la app) — la jerarquía visual real de
 * Figma ya sugería que no son 2 acciones de igual peso.
 *
 * "Cancelar reserva" — 2026-09-04, nuevo, a pedido de Ana: "poner boton
 * para cancelar q concuerde con la poli de cancelacion en las que estan
 * proximas o activas". Solo aparece en `estado === "proxima"` (una
 * reserva "pasada" ya ocurrió, no hay nada que cancelar — coincide con
 * su pedido de que sea para las próximas/activas). No hay ninguna
 * política de cancelación real en el proyecto todavía (`experiences.ts`
 * no modela ventanas de cancelación por experiencia) — se usa un texto
 * de política GENÉRICO de primera pasada ("sin costo hasta 24 horas
 * antes"), igual de plausible/honesto que el resto de contenido
 * inventado del catálogo, documentado como tal. Limitación real conocida
 * (no resuelta): `fechaHora` es un string de display ("Sábado 12 sep ·
 * 20:30"), no una fecha parseable — no se puede calcular en código si
 * ya pasaron o no esas 24 horas para deshabilitar el botón cuando
 * corresponda; el texto de política se muestra siempre, como
 * información, sin bloquear la cancelación por horario.
 *
 * Es un acordeón real (mismo patrón que "Ver ticket"/"Ver en mapa": caret
 * rotado, no ícono nuevo salvo `IconXCircle` para el botón en sí) que
 * pide confirmación en 2 pasos en vez de cancelar directo al primer
 * toque — "Confirmar cancelación" queda en `text-warning` (mismo token
 * ya reservado para acciones destructivas, ver "Eliminar cuenta" en
 * DatosDeCuenta.tsx) para que se note que es distinto de las otras 2
 * acciones (informativas) de la card. La cancelación en sí (`onCancelar`)
 * la resuelve Reservas.tsx, que es quien tiene el estado de la lista —
 * ver esa nota para cómo se quita la card de "Próximas".
 */

function codigoReserva(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const iniciales = id
    .split("-")
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return `${iniciales}-${(hash % 9000) + 1000}`;
}

export default function ReservationCard({
  experience,
  fechaHora,
  estado,
  onCancelar,
}: {
  experience: Experience;
  fechaHora: string;
  estado: "proxima" | "pasada";
  /** Solo se usa (y solo se muestra el botón "Cancelar reserva") cuando
   * `estado === "proxima"` — ver nota grande de arriba. */
  onCancelar?: () => void;
}) {
  const [ticketAbierto, setTicketAbierto] = useState(false);
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const [cancelarAbierto, setCancelarAbierto] = useState(false);

  return (
    <div className="flex flex-col gap-2 py-4">
      <span className="font-body font-semibold text-[11px] uppercase text-thea-mint">
        {experience.category}
      </span>
      <h3 className="font-body font-semibold text-base text-white-100">
        {experience.title}
      </h3>
      <div className="flex items-center gap-3">
        <IconCalendar className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
        <span className="font-body text-[13px] text-white-80">{fechaHora}</span>
      </div>
      <div className="flex items-center gap-3">
        <IconMapPin className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
        <span className="font-body text-[13px] text-white-80">
          {experience.venue}, {experience.city}
        </span>
      </div>

      <div className="h-px w-full bg-white-12 my-1" />

      {estado === "proxima" ? (
        <>
          <button
            onClick={() => setTicketAbierto((v) => !v)}
            className="flex items-center gap-3 py-1 w-full"
          >
            <IconTicket className="w-4 h-4 text-white-100 shrink-0" />
            <span className="font-body font-medium text-[13px] text-white-100 flex-1 text-left">
              Ver ticket
            </span>
            <IconCaretRight
              className={`w-3 h-3 text-white-40 shrink-0 transition-transform ${
                ticketAbierto ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>
          {ticketAbierto && (
            <div className="flex flex-col gap-1.5 rounded-xl bg-white-6 px-4 py-3 mb-1">
              <span className="font-body text-sm font-semibold text-white-100">
                {experience.title}
              </span>
              <span className="font-body text-[13px] text-white-80">{fechaHora}</span>
              <span className="font-body text-[13px] text-white-80">
                {experience.venue}, {experience.city}
              </span>
              <span className="font-body text-[13px] text-white-40 mt-1">
                Código de reserva: {codigoReserva(experience.id)}
              </span>
            </div>
          )}

          <button
            onClick={() => setMapaAbierto((v) => !v)}
            className="flex items-center gap-3 py-1 w-full"
          >
            <IconMap className="w-4 h-4 text-white-100 shrink-0" />
            <span className="font-body font-medium text-[13px] text-white-100 flex-1 text-left">
              Ver en mapa
            </span>
            <IconCaretRight
              className={`w-3 h-3 text-white-40 shrink-0 transition-transform ${
                mapaAbierto ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>
          {mapaAbierto && (
            <MapPreview
              venue={experience.venue}
              city={experience.city}
              variant="dark"
              className="h-28 mb-1"
            />
          )}

          <button
            onClick={() => setCancelarAbierto((v) => !v)}
            className="flex items-center gap-3 py-1 w-full"
          >
            <IconXCircle className="w-4 h-4 text-white-100 shrink-0" />
            <span className="font-body font-medium text-[13px] text-white-100 flex-1 text-left">
              Cancelar reserva
            </span>
            <IconCaretRight
              className={`w-3 h-3 text-white-40 shrink-0 transition-transform ${
                cancelarAbierto ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>
          {cancelarAbierto && (
            <div className="flex flex-col gap-3 rounded-xl bg-white-6 px-4 py-3 mb-1">
              <span className="font-body text-[13px] text-white-80">
                Puedes cancelar esta reserva sin costo hasta 24 horas antes
                del evento. Pasado ese plazo, no hay reembolso.
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setCancelarAbierto(false);
                    onCancelar?.();
                  }}
                  className="font-body font-semibold text-[13px] text-warning"
                >
                  Confirmar cancelación
                </button>
                <button
                  onClick={() => setCancelarAbierto(false)}
                  className="font-body font-medium text-[13px] text-white-40"
                >
                  Mantener reserva
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to={`/experiencia/${experience.id}`}
            className="font-body font-medium text-[13px] text-white-100"
          >
            Volver a reservar
          </Link>
          <span className="font-body font-medium text-[13px] text-white-40">
            Dejar reseña
          </span>
        </div>
      )}
    </div>
  );
}
