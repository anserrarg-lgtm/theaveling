import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../../components/Switch";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import { IconCaretRight, IconBell } from "../../components/icons";
import { useDescubrirTab } from "../../context/DescubrirTabContext";

/*
 * 2026-09-04: la fila "Notificaciones" de Perfil ya NO enlaza acá — pasa
 * a abrir `NotificacionesSheet.tsx` (bottom sheet), a pedido de Ana
 * ("me gustaria tambien tipo bottonsheet", mismo patrón que Idioma/
 * Moneda). Este archivo y su ruta (/perfil/notificaciones) se dejan tal
 * cual, sin borrar, por si queda enlazado desde otro lado más adelante
 * — pero el contenido real y al día vive en NotificacionesSheet.tsx; si
 * hay que tocar algo de esto, tocarlo ahí también (o en vez de acá).
 *
 * Notificaciones — nodo real de Figma `notificaciones-screen` (2051:746),
 * traído vía get_design_context 2026-09-03. Ana señaló que se me había
 * quedado afuera de la reconstrucción de Perfil ("recuerda... te
 * olvidaste del apartado de notificaciones y datos de cuenta") — Figma
 * ya tenía esta pantalla armada, con ruta propia desde la fila
 * "Notificaciones" de Preferencias.
 *
 * Fondo verde (thea-green), no el blanco del mockup de Figma — mismo
 * pedido explícito de Ana para toda esta sección de Perfil. Ver nota
 * completa en Perfil.tsx sobre por qué el fondo real de código difiere
 * del mockup de Figma acá.
 *
 * El texto de advertencia en rojo que traía el nodo de Figma ("⚠ Tipos
 * de notificación de ejemplo — la lista final todavía no está
 * definida.") es una nota de trabajo para el equipo, no copy real de
 * producto — se excluye acá, mismo criterio que la nota roja que se
 * excluyó en Perfil.tsx.
 *
 * `checked` de cada switch es solo estado local de UI por ahora (no hay
 * backend de preferencias real todavía) — no persiste entre visitas.
 *
 * Desktop — 2026-09-14, a pedido de Ana ("y la pantalla de notificaciones
 * no esta, tienes una ref"): esta pantalla era 100% mobile hasta ahora —
 * el link "Notificaciones" del panel de perfil de Desktop
 * (`DesktopPerfilDropdown.tsx`) llevaba acá y mostraba la versión mobile
 * sin adaptar. Ana mandó una referencia real (Airbnb "Notificaciones":
 * título simple sin flecha + estado vacío "Todavía no hay
 * notificaciones").
 *
 * Primera vuelta (equivocada): se copió el contenido de PREFERENCIAS
 * (Recordatorios/Novedades/Promociones) a Desktop en vez del estado vacío
 * de la referencia, con el razonamiento de que esta pantalla "siempre fue
 * de preferencias, no un listado de notificaciones recibidas". Ana
 * corrigió ("ya te mande la ref de notificaciones, porq no la hiciste
 * asi??") — tenía razón: como acá NO hay ningún backend de notificaciones
 * real (nunca se genera una notificación de verdad), el estado vacío de
 * la referencia es en realidad más honesto que mostrar toggles de
 * preferencia que no hacen nada persistente. Se reemplaza el contenido de
 * Desktop por el mismo patrón de estado vacío ya usado en
 * Favoritos.tsx/Reservas.tsx (ícono en círculo + título + texto, sin
 * inventar una ilustración custom). Los toggles de preferencias siguen
 * viviendo en mobile (`NotificacionesSheet.tsx`, el bottom sheet real que
 * usa Perfil) — no se tocó eso, esta corrección es solo del bloque de
 * Desktop de este archivo.
 *
 * Bloque de mobile de abajo: EXACTAMENTE el que ya existía, solo envuelto
 * en `lg:hidden`.
 */
const NOTIFICACIONES = [
  { key: "recordatorios", label: "Recordatorios de reserva", defaultOn: true },
  { key: "novedades", label: "Novedades", defaultOn: true },
  { key: "promociones", label: "Promociones", defaultOn: true },
] as const;

export default function Notificaciones() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICACIONES.map((n) => [n.key, n.defaultOn])),
  );

  const { activeCategory, setActiveCategory } = useDescubrirTab();

  return (
    <>
      <div className="min-h-screen bg-thea-green text-white-100 lg:hidden">
        {/* Header fijo — 2026-09-03, a pedido de Ana: cualquier pantalla con
            back se mantiene visible al scrollear (ver nota completa en
            DetalleExperiencia.tsx y Perfil.tsx). Mismo tratamiento que
            Perfil: sin foto detrás, así que va con thea-deep sólido desde
            el arranque, no recién al scrollear. `pt-14` abajo compensa el
            alto fijo del header (56px, mismo que el resto de la app).

            bg-[rgb(1,20,20)] en vez de bg-thea-deep — 2026-09-03, mismo
            motivo que Perfil.tsx: thea-deep es 95% opaco (pensado para foto
            detrás); acá cubre texto plano y ese 5% dejaba pasar un
            "fantasma" del contenido al scrollear. Mismo RGB, 100% opaco. */}
        <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px_+_var(--safe-top))] pt-[var(--safe-top)] flex items-center gap-3 px-5 bg-[rgb(1,20,20)] border-b border-white-12">
          <button onClick={() => navigate(-1)} aria-label="Volver" className="p-1 -m-1">
            <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
          </button>
          <h1 className="font-display font-semibold text-2xl">Notificaciones</h1>
        </header>

        <div className="flex flex-col px-5 pt-[calc(56px_+_var(--safe-top))]">
          {NOTIFICACIONES.map((n, i) => (
            <div key={n.key}>
              <div className="flex items-center justify-between py-3">
                <span className="font-body text-sm text-white-100">{n.label}</span>
                <Switch
                  checked={estado[n.key]}
                  onChange={(v) => setEstado((prev) => ({ ...prev, [n.key]: v }))}
                  label={n.label}
                />
              </div>
              {i < NOTIFICACIONES.length - 1 && (
                <div className="h-px w-full bg-white-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop — ver nota grande de arriba. */}
      <div className="hidden bg-[rgb(1,20,20)] text-white-100 font-body lg:block">
        <DesktopNavbar
          active={activeCategory}
          onChange={(tab) => {
            setActiveCategory(tab);
            navigate("/");
          }}
        />

        <div className="mx-auto max-w-[1440px] px-20 pt-16 pb-20">
          {/* 2026-09-14 (sexta vuelta), a pedido de Ana: sin flecha de
              volver en Desktop, ver la nota en Favoritos.tsx. */}
          <h1 className="mb-10 font-display text-3xl text-white-100">
            Notificaciones
          </h1>

          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white-8">
              <IconBell className="h-7 w-7 text-white-60" />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-2xl text-white-100">
                Todavía no tienes notificaciones
              </h2>
              <p className="mx-auto max-w-[420px] font-body text-[15px] text-white-60">
                Por ahora no hay novedades. Te vamos a avisar acá apenas
                tengas algo nuevo sobre tus reservas.
              </p>
            </div>
          </div>
        </div>

        <DesktopFooter />
      </div>
    </>
  );
}
