import { useEffect, useState } from "react";
import { IconX } from "./icons";
import Switch from "./Switch";
import {
  IDIOMAS,
  MONEDAS,
  IDIOMA_KEY,
  MONEDA_KEY,
  leerPreferencia,
} from "../data/preferencias";

const TRADUCCION_KEY = "theaveling:traduccion";

/*
 * IdiomaMonedaModal — 2026-09-09, a pedido de Ana: ícono de globo nuevo
 * en `DesktopNavbar` (junto al buscador) que abre esto. Mobile ya tenía
 * esta misma preferencia resuelta con `PreferenceSheet` (bottom sheet,
 * lista simple) — acá en Desktop Ana pidió calcar el patrón de referencia
 * que pasó (2 capturas: un modal centrado con pestañas "Idioma y región"
 * / "Moneda" y una grilla de tarjetas seleccionables, estilo Airbnb/
 * Google), no el bottom sheet de mobile. Comparte los MISMOS datos y el
 * MISMO storage que Perfil.tsx (`data/preferencias.ts`) — cambiar acá
 * también cambia el chip que se ve en Perfil.
 *
 * Diferencias a propósito respecto a la referencia que Ana pasó:
 * - Toggle de "Traducción" — 2026-09-10, a pedido explícito de Ana
 *   ("olvidaste lo del traductor"): se agrega tal cual la referencia
 *   (título + descripción + Switch, mismo componente que ya usa
 *   Notificaciones.tsx). Se guarda de verdad en localStorage (mismo
 *   patrón que idioma/moneda), aunque — igual que idioma/moneda — todavía
 *   no dispara una traducción real de la interfaz (Theaveling no tiene
 *   contenido en otros idiomas todavía); el día que exista, esta
 *   preferencia guardada es la base para conectarla.
 * - "Idioma y región" solo lista el idioma (Español/English) — la
 *   referencia combina idioma+país en una sola tarjeta, pero Theaveling
 *   no tiene selector de país/región propio todavía, así que se deja
 *   fuera en vez de inventarlo.
 * - Colores — a pedido explícito de Ana ("hazlas del color deep"): el
 *   panel usa `bg-[rgb(1,20,20)]` sólido (mismo criterio que
 *   Reservas.tsx/Perfil.tsx: sin foto detrás, va sólido en vez del
 *   `thea-deep` 95% opaco) en vez del modal blanco de la referencia.
 * - Sin wordmark "Theaveling" dentro del modal — a pedido explícito de
 *   Ana ("ojo que el theaveling no lo tenemos en sansita"): la referencia
 *   tampoco trae marca dentro del modal, así que no hace falta.
 *
 * Selección en vivo, sin auto-cerrar — a diferencia de `PreferenceSheet`
 * (mobile, cierra al elegir), acá se sigue el comportamiento de la
 * referencia: al tocar una tarjeta se guarda al toque (mismo patrón
 * useEffect + localStorage que Perfil.tsx) pero el modal se queda
 * abierto, para poder cambiar de pestaña o seguir mirando — se cierra
 * con la X o tocando afuera.
 */
export default function IdiomaMonedaModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"idioma" | "moneda">("idioma");
  const [idioma, setIdioma] = useState(() => leerPreferencia(IDIOMA_KEY, "es"));
  const [moneda, setMoneda] = useState(() => leerPreferencia(MONEDA_KEY, "COP"));
  const [traduccion, setTraduccion] = useState(
    () => leerPreferencia(TRADUCCION_KEY, "on") === "on",
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(TRADUCCION_KEY, traduccion ? "on" : "off");
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe la app.
    }
  }, [traduccion]);

  useEffect(() => {
    try {
      window.localStorage.setItem(IDIOMA_KEY, idioma);
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe la app.
    }
  }, [idioma]);

  useEffect(() => {
    try {
      window.localStorage.setItem(MONEDA_KEY, moneda);
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe la app.
    }
  }, [moneda]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div className="relative flex max-h-[80vh] w-full max-w-[720px] flex-col rounded-2xl border border-white-12 bg-[rgb(1,20,20)]">
        <div className="flex items-center justify-between px-6 pt-6">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-8 border-b border-white-12 px-6 pt-3">
          <button
            onClick={() => setTab("idioma")}
            className={`pb-3 font-body text-base ${
              tab === "idioma"
                ? "border-b-2 border-white-100 font-normal text-white-100"
                : "font-normal text-white-60"
            }`}
          >
            Idioma y región
          </button>
          <button
            onClick={() => setTab("moneda")}
            className={`pb-3 font-body text-base ${
              tab === "moneda"
                ? "border-b-2 border-white-100 font-normal text-white-100"
                : "font-normal text-white-60"
            }`}
          >
            Moneda
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {tab === "idioma" ? (
            <>
              <div className="mb-6 flex items-center justify-between gap-6 rounded-xl border border-white-12 bg-white-6 px-5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-body text-sm font-semibold text-white-100">
                    Traducción
                  </span>
                  <span className="font-body text-[13px] text-white-60">
                    Traducir automáticamente las descripciones y las reseñas al español.
                  </span>
                </div>
                <Switch
                  checked={traduccion}
                  onChange={setTraduccion}
                  label="Traducción automática"
                />
              </div>

              <h3 className="mb-4 font-body text-lg text-white-100">
                Elige un idioma
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {IDIOMAS.map((opt) => {
                  const activo = opt.value === idioma;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setIdioma(opt.value)}
                      className={`rounded-xl border px-4 py-3 text-left font-body text-sm ${
                        activo
                          ? "border-white-100 bg-white-8 text-white-100"
                          : "border-white-12 text-white-80 hover:border-white-20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h3 className="mb-4 font-body text-lg text-white-100">
                Selecciona una moneda
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {MONEDAS.map((opt) => {
                  const activo = opt.value === moneda;
                  const [codigoYSimbolo, nombre] = opt.label.split(" — ");
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setMoneda(opt.value)}
                      className={`rounded-xl border px-4 py-3 text-left font-body ${
                        activo
                          ? "border-white-100 bg-white-8"
                          : "border-white-12 hover:border-white-20"
                      }`}
                    >
                      <span
                        className={`block text-sm ${activo ? "text-white-100" : "text-white-80"}`}
                      >
                        {nombre}
                      </span>
                      {/* rgba(251,251,251,.5) — no hay token `white-50`
                          (la escala real es 100/80/60/20/12/8/6, ver
                          index.css), mismo criterio de valor suelto ya
                          usado en las cards de esta sesión. */}
                      <span
                        className="block text-xs"
                        style={{ color: "rgba(251,251,251,0.5)" }}
                      >
                        {codigoYSimbolo}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
