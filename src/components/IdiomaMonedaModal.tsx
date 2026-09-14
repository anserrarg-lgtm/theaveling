import { useEffect, useState } from "react";
import { IconX, IconTranslate } from "./icons";
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
 *   panel usaba `bg-[rgb(1,20,20)]` sólido (mismo criterio que
 *   Reservas.tsx/Perfil.tsx: sin foto detrás, va sólido en vez del
 *   `thea-deep` 95% opaco) en vez del modal blanco de la referencia.
 *   2026-09-11, Ana pidió el cambio contrario ("podria estar tambien en
 *   el otro verde de thea q es mas claro"): pasa a `bg-thea-green`
 *   (`#112c2c`, el verde de contenido, más claro que el deep casi negro
 *   de arriba) — mismo tono que ya usan los paneles flotantes de Desktop
 *   de esta tanda (DesktopSearchDropdown.tsx/DesktopLocationDropdown.tsx).
 *   Mismo día, a pedido de Ana ("no quiero stroke... en panel de
 *   lenguaje y moneda"): se saca también el `border border-white-12` que
 *   tenía el panel — queda separado del fondo solo por el color.
 * - 2026-09-11 (segunda vuelta) — Ana señaló que todavía quedaba stroke
 *   ("hay stroke... en lo de moneda y lenguaje"): faltaban la línea bajo
 *   las pestañas, la tarjeta de Traducción y las tarjetas de
 *   idioma/moneda seleccionables, que tenían su propio `border`. Se saca
 *   en los 4 lugares. Las tarjetas seleccionables perdían con el border
 *   su única señal de hover — se agrega `hover:bg-white-6` en su reemplazo
 *   (mismo token que ya usan otros hovers de la app) para no perder esa
 *   señal.
 * - Sin wordmark "Theaveling" dentro del modal — a pedido explícito de
 *   Ana ("ojo que el theaveling no lo tenemos en sansita"): la referencia
 *   tampoco trae marca dentro del modal, así que no hace falta.
 *
 * 2026-09-12, a pedido de Ana ("pongamosle icono a lenguaje"): primer
 * intento, sumar `IconGlobe` a la pestaña "Idioma y región" — Ana corrigió
 * en el momento ("no pero no era de globo que queria, mira la ref"): la
 * referencia que pasó (2 capturas) mostraba la fila "Traducción" con un
 * ícono de "traducir" al lado del texto, no la pestaña. Se saca el globo
 * de la pestaña (queda como estaba, sin ícono) y se agrega `IconTranslate`
 * (nuevo, ver icons.tsx) junto al texto "Traducción" en la tarjeta de
 * abajo, que es lo que la referencia realmente mostraba.
 *
 * 2026-09-12, a pedido de Ana ("la letra del panel de lenguaje y moneda
 * esta muy chiquita, como tienen los demas paneles de busqueda ubicacion?
 * las veo bien"): en píxeles el texto ya era igual o más grande que en
 * DesktopLocationDropdown.tsx/DesktopSearchDropdown.tsx (14px filas, 13px
 * texto secundario) — el problema es que este modal es mucho más ancho
 * (`max-w-[720px]` vs ~400px de esos paneles), así que el mismo tamaño
 * pesa menos visualmente acá. Se sube un escalón cada texto para
 * compensar: pestañas `text-base`→`text-lg`, título "Traducción"
 * `text-sm`→`text-base`, su descripción `text-[13px]`→`text-sm`,
 * headers "Elige un idioma"/"Selecciona una moneda" `text-lg`→`text-xl`,
 * opciones de idioma `text-sm`→`text-base`, nombre de moneda
 * `text-sm`→`text-base` y su código/símbolo `text-xs`→`text-sm`.
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
      <div className="relative flex max-h-[80vh] w-full max-w-[720px] flex-col rounded-2xl bg-thea-green">
        <div className="flex items-center justify-between px-6 pt-6">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-8 px-6 pt-3">
          <button
            onClick={() => setTab("idioma")}
            className={`pb-3 font-body text-lg ${
              tab === "idioma"
                ? "border-b-2 border-white-100 font-normal text-white-100"
                : "font-normal text-white-60"
            }`}
          >
            Idioma y región
          </button>
          <button
            onClick={() => setTab("moneda")}
            className={`pb-3 font-body text-lg ${
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
              <div className="mb-6 flex items-center justify-between gap-6 rounded-xl bg-white-6 px-5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-body text-base font-semibold text-white-100">
                    Traducción
                    {/* 2026-09-12, a pedido de Ana ("pon el logo de
                        traduccion mucho mas grande"): de h-4/w-4 (16px)
                        a h-6/w-6 (24px) — bien más grande que el texto
                        de al lado, no un ajuste chico. */}
                    <IconTranslate className="h-6 w-6 text-white-60" />
                  </span>
                  <span className="font-body text-sm text-white-60">
                    Traducir automáticamente las descripciones y las reseñas al español.
                  </span>
                </div>
                <Switch
                  checked={traduccion}
                  onChange={setTraduccion}
                  label="Traducción automática"
                />
              </div>

              <h3 className="mb-4 font-body text-xl text-white-100">
                Elige un idioma
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {IDIOMAS.map((opt) => {
                  const activo = opt.value === idioma;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setIdioma(opt.value)}
                      className={`rounded-xl px-4 py-3 text-left font-body text-base ${
                        activo
                          ? "bg-white-8 text-white-100"
                          : "text-white-80 hover:bg-white-6"
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
              <h3 className="mb-4 font-body text-xl text-white-100">
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
                      className={`rounded-xl px-4 py-3 text-left font-body ${
                        activo ? "bg-white-8" : "hover:bg-white-6"
                      }`}
                    >
                      <span
                        className={`block text-base ${activo ? "text-white-100" : "text-white-80"}`}
                      >
                        {nombre}
                      </span>
                      {/* rgba(251,251,251,.5) — no hay token `white-50`
                          (la escala real es 100/80/60/20/12/8/6, ver
                          index.css), mismo criterio de valor suelto ya
                          usado en las cards de esta sesión. */}
                      <span
                        className="block text-sm"
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
