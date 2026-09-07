import { IconCaretRight } from "./icons";

/*
 * BandejaSheet — 2026-09-04, a pedido de Ana: "cuando haya notificaciones
 * va a tener un puntito mint, y si quieres de una vez hacemos como una
 * pantallita generica de notificaciones. con una o dos." Es la bandeja
 * real que abre la campanita del header de Perfil (ver Perfil.tsx) — hoy
 * la campanita solo abría `NotificacionesSheet.tsx`, que en realidad es
 * el panel de PREFERENCIAS de notificación (toggles Recordatorios/
 * Novedades/Promociones), no un listado de notificaciones recibidas. Ese
 * archivo se deja intacto (la fila "Notificaciones" de Preferencias sigue
 * abriéndolo, es contenido distinto) — esto es un componente nuevo,
 * aparte, para no mezclar "qué avisos quiero recibir" con "qué avisos
 * recibí".
 *
 * Nombre "Bandeja" (no "NotificacionesSheet2" ni similar) para que quede
 * claro en el código que son 2 cosas distintas con el mismo ícono de
 * entrada.
 *
 * Contenido — 2 notificaciones de PRIMERA PASADA, inventadas (mismo
 * criterio que el resto del catálogo cuando falta contenido real, ver
 * notas de "primera pasada" en experiences.ts / Reservas.tsx): un aviso
 * de reserva confirmada y uno de experiencia nueva cerca — géneros
 * plausibles de notificación para esta app, pendientes de que Ana las
 * revise o reemplace por las reales.
 *
 * Estado "leída" — vive en Perfil.tsx (useState en memoria, ver esa
 * nota) y se marca al CERRAR la bandeja (no al abrirla), para que los
 * puntitos mint individuales de cada aviso sin leer alcancen a verse
 * mientras está abierta. NO usa localStorage a propósito: Ana pidió
 * explícitamente "la
 * idea es que cada vez que se refresca pueda aparecer la notificación
 * para mostrarla funcionable" — si el estado de lectura persistiera
 * entre visitas, el puntito mint desaparecería para siempre después de
 * la primera vez que alguien abre la bandeja, y no se podría demostrar
 * de nuevo sin borrar localStorage a mano. Al no persistir, cada refresh
 * de la página vuelve a arrancar con las 2 notificaciones sin leer —
 * mismo patrón en memoria que ya usa NotificacionesSheet para sus
 * toggles.
 *
 * El puntito mint por notificación (acá) y el de la campanita (ícono en
 * Perfil.tsx) son el mismo lenguaje visual: `bg-thea-mint`, círculo
 * chico — Ana lo pidió literal ("un puntito mint").
 *
 * Jerarquía de texto — 2026-09-04, a pedido de Ana: "en las
 * notificaciones haz que se note mas la jerarquia del texto". Antes
 * título (`text-sm` semibold) y cuerpo (`text-[13px]` regular) quedaban
 * muy parecidos en peso visual (1px de diferencia + negrita nomás).
 * Ahora: título sube a `text-base` (16px) y además usa el propio estado
 * `leida` como señal extra de jerarquía (blanco pleno si no se leyó,
 * `white-80` si ya se leyó — mismo criterio que atenuar contenido ya
 * visto); cuerpo se queda en 13px pero con `leading-snug` para que lea
 * como párrafo secundario, no como otro título; tiempo pasa a
 * mayúsculas + tracking ancho (mismo tratamiento ya usado en la app para
 * metadata chica y apagada — ver eyebrow de categoría en
 * ReservationCard.tsx, "PREFERENCIAS" en Perfil.tsx) para que quede
 * claramente en el escalón más bajo, no confundible con el cuerpo.
 */
export type NotificacionRecibida = {
  id: string;
  titulo: string;
  cuerpo: string;
  tiempo: string;
  leida: boolean;
};

export function notificacionesIniciales(): NotificacionRecibida[] {
  return [
    {
      id: "confirmacion-cuerpos-en-transito",
      titulo: "Reserva confirmada",
      cuerpo:
        'Tu lugar para "Cuerpos en tránsito" el sábado 12 de septiembre quedó confirmado.',
      tiempo: "Hace 2 horas",
      leida: false,
    },
    {
      id: "nueva-antigona-ahora",
      titulo: "Nueva experiencia cerca de ti",
      cuerpo: '"Antígona, ahora" ya está disponible para reservar en Bogotá.',
      tiempo: "Ayer",
      leida: false,
    },
  ];
}

export default function BandejaSheet({
  open,
  notificaciones,
  onClose,
}: {
  open: boolean;
  notificaciones: NotificacionRecibida[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div className="relative bg-thea-deep rounded-t-[28px] flex flex-col pb-8 max-h-[80vh] sheet-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white-20" />
        </div>
        <div className="flex items-center gap-2 px-5 pt-2 pb-2">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="h-10 w-10 -ml-2 flex items-center justify-center shrink-0 text-white-100"
          >
            <IconCaretRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="font-display text-xl text-white-100">Notificaciones</h2>
        </div>

        {notificaciones.length === 0 ? (
          <p className="font-body text-[13px] text-white-60 px-5 pt-2">
            No tienes notificaciones por ahora.
          </p>
        ) : (
          <div className="flex flex-col px-5 pt-2 overflow-y-auto">
            {notificaciones.map((n, i) => (
              <div key={n.id}>
                <div className="flex items-start gap-3 py-4">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      n.leida ? "bg-transparent" : "bg-thea-mint"
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <span
                      className={`font-body font-semibold text-base ${
                        n.leida ? "text-white-80" : "text-white-100"
                      }`}
                    >
                      {n.titulo}
                    </span>
                    <span className="font-body text-[13px] leading-snug text-white-80">
                      {n.cuerpo}
                    </span>
                    <span className="font-body font-medium text-[11px] uppercase tracking-wide text-white-40 mt-1">
                      {n.tiempo}
                    </span>
                  </div>
                </div>
                {i < notificaciones.length - 1 && (
                  <div className="h-px w-full bg-white-8" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
