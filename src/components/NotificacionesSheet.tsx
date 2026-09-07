import { useState } from "react";
import Switch from "./Switch";
import { IconCaretRight } from "./icons";

/*
 * NotificacionesSheet — 2026-09-04, a pedido de Ana: "los toggles en el
 * apartado de notificaciones no estan bien hechos y me gustaria tambien
 * tipo bottonsheet". Antes "Notificaciones" navegaba a una pantalla
 * propia (Notificaciones.tsx, ruta /perfil/notificaciones) — pasa a
 * abrir este bottom sheet desde Perfil, mismo patrón ya establecido con
 * Idioma/Moneda (ver PreferenceSheet.tsx) para que las 5 filas de
 * Preferencias se sientan consistentes entre sí (todas abren un sheet,
 * ninguna navega a pantalla completa salvo Datos de cuenta/Ayuda, que sí
 * tienen contenido largo que justifica pantalla propia).
 *
 * El bug real de los toggles (el thumb se salía del track) se corrigió
 * en Switch.tsx — ver esa nota. Este componente solo reubica el mismo
 * contenido (Recordatorios/Novedades/Promociones) que ya existía en
 * Notificaciones.tsx dentro del nuevo chrome de sheet; esa pantalla y su
 * ruta se dejan tal cual por si queda enlazada desde otro lado, pero ya
 * no es el camino principal.
 *
 * `checked` sigue siendo solo estado local de UI (no hay backend de
 * preferencias real todavía) — se mantiene en memoria mientras la
 * pestaña está abierta (mismo criterio de antes), no persiste entre
 * visitas nuevas a la página.
 */
const NOTIFICACIONES = [
  { key: "recordatorios", label: "Recordatorios de reserva", defaultOn: true },
  { key: "novedades", label: "Novedades", defaultOn: true },
  { key: "promociones", label: "Promociones", defaultOn: true },
] as const;

export default function NotificacionesSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [estado, setEstado] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICACIONES.map((n) => [n.key, n.defaultOn])),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div className="relative bg-thea-deep rounded-t-[28px] flex flex-col pb-8 sheet-slide-up">
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

        <div className="flex flex-col px-5 pt-2">
          {NOTIFICACIONES.map((n, i) => (
            <div key={n.key}>
              <div className="flex items-center justify-between py-4">
                <span className="font-body text-sm text-white-100">{n.label}</span>
                <Switch
                  checked={estado[n.key]}
                  onChange={(v) => setEstado((prev) => ({ ...prev, [n.key]: v }))}
                  label={n.label}
                />
              </div>
              {i < NOTIFICACIONES.length - 1 && (
                <div className="h-px w-full bg-white-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
