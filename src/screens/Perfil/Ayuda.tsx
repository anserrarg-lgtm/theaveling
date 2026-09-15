import { useNavigate } from "react-router-dom";
import { IconCaretRight, IconMail, IconMessageCircle } from "../../components/icons";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import { useDescubrirTab } from "../../context/DescubrirTabContext";

/*
 * Ayuda / Servicio al cliente — 2026-09-04, nueva pantalla a pedido de
 * Ana: "incluir en perfil tambien un apartado de servicio al cliente o
 * ayuda". No existe en Figma (no hay nodo que traer) — se construyó
 * directo en código, mismo lenguaje visual que Notificaciones.tsx /
 * DatosDeCuenta.tsx (header fijo con back, fondo thea-green).
 *
 * Contenido — a pedido explícito de Ana esta vez sí lleva contenido
 * real, no un simple "pendiente de construir" (que es lo que se hace
 * por defecto con secciones sin definir, ver Reservas.tsx): pidió
 * "correo y wp proximamente" como medios de contacto. El correo real
 * que dio es el mismo mock que ya usa el Perfil ("pues el de elena que
 * inventaste") — elena.voss@email.com, ya usado como email de cuenta
 * mock en Perfil.tsx, así que reutilizarlo acá es consistente, no un
 * dato nuevo inventado. El botón de Correo SÍ es funcional (abre el
 * cliente de correo real vía `mailto:`). WhatsApp queda marcado
 * "Próximamente", no clickeable — mismo tratamiento visual que las
 * ciudades sugeridas de LocationSheet.tsx (atenuado + etiqueta), porque
 * ese canal todavía no está definido.
 *
 * Preguntas frecuentes — contenido de PRIMERA PASADA, inventado (mismo
 * criterio que el resto del catálogo cuando falta contenido real, ver
 * notas de "primera pasada" en experiences.ts): preguntas genéricas y
 * plausibles para una app de boletería/experiencias culturales,
 * pendientes de que Ana las revise o reemplace por las reales.
 *
 * Desktop — 2026-09-14, a pedido de Ana ("la pantalla de ayuda no va asi,
 * no es desk, hazla desk con las mismas preguntas que estan ahora"): esta
 * pantalla era 100% mobile — el link "Ayuda" del panel de perfil de
 * Desktop (`DesktopPerfilDropdown.tsx`) llevaba acá y mostraba la versión
 * mobile sin adaptar. Mismo contenido EXACTO (Contacto + las 4 preguntas
 * frecuentes de arriba, `CORREO_SOPORTE` incluido) — Ana pidió
 * puntualmente "las mismas preguntas que estan ahora", nada nuevo. Mismos
 * criterios ya convergidos en esta tanda de pantallas de Desktop: título
 * sin flecha de volver (ver nota en Favoritos.tsx) y bloques de contenido
 * "contenidos tipo card" (`rounded-2xl bg-white-6`, mismo tratamiento que
 * Notificaciones.tsx/Reservas.tsx de Desktop). Bloque de mobile de abajo:
 * EXACTAMENTE el que ya existía, solo envuelto en `lg:hidden`.
 */
const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Puedo cancelar o cambiar mi reserva?",
    respuesta:
      "Depende de la política de cada experiencia — revisa los detalles de cancelación en la pantalla de tu reserva antes de comprar. Si ya compraste y necesitas ayuda puntual, escríbenos por correo.",
  },
  {
    pregunta: "¿Cómo recibo mis boletos?",
    respuesta:
      "Quedan disponibles dentro de la app, en Reservas, apenas se confirma el pago — no necesitas imprimir nada, se muestran en el celular el día del evento.",
  },
  {
    pregunta: "¿Qué pasa si el evento se cancela o se reprograma?",
    respuesta:
      "Te avisamos por correo apenas lo sepamos, con las opciones disponibles (reembolso o cambio de fecha, según el caso).",
  },
  {
    pregunta: "¿Puedo comprar boletos para otra persona?",
    respuesta:
      "Sí — al momento de la compra puedes ingresar los datos de quien va a asistir, aunque no sea tu cuenta la que paga.",
  },
] as const;

const CORREO_SOPORTE = "elena.voss@email.com";

function Contacto({ variant }: { variant: "mobile" | "desktop" }) {
  const contenedor =
    variant === "desktop" ? "rounded-2xl bg-white-6 px-6" : "";
  const divisor = variant === "desktop" ? "bg-white-8" : "bg-white-6";
  return (
    <div className={contenedor}>
      <a
        href={`mailto:${CORREO_SOPORTE}`}
        className="flex items-center justify-between py-4"
      >
        <span className="flex items-center gap-3">
          <IconMail className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
          <span className="flex flex-col">
            <span className="font-body text-sm text-white-100">Correo</span>
            <span className="font-body text-[13px] text-white-60">
              {CORREO_SOPORTE}
            </span>
          </span>
        </span>
        <IconCaretRight className="w-4 h-4 text-white-40 shrink-0" />
      </a>
      <div className={`h-px w-full ${divisor}`} />

      {/* WhatsApp — 2026-09-04: Ana lo pidió como "proximamente", no
          funcional todavía (sin número confirmado). Mismo tratamiento
          visual que las ciudades sugeridas de LocationSheet.tsx:
          atenuado, con etiqueta, sin onClick. Ícono genérico de burbuja
          de chat, no el logo real de WhatsApp (ver nota en icons.tsx). */}
      <div
        aria-disabled="true"
        className="flex items-center justify-between py-4 opacity-50"
      >
        <span className="flex items-center gap-3">
          <IconMessageCircle className="w-4 h-4 text-white-100 shrink-0" />
          <span className="font-body text-sm text-white-100">WhatsApp</span>
        </span>
        <span className="font-body text-[11px] font-semibold text-white-40 uppercase tracking-wide shrink-0">
          Próximamente
        </span>
      </div>
    </div>
  );
}

function PreguntasFrecuentes({ variant }: { variant: "mobile" | "desktop" }) {
  const contenedor =
    variant === "desktop" ? "rounded-2xl bg-white-6 px-6" : "";
  const divisor = variant === "desktop" ? "bg-white-8" : "bg-white-6";
  return (
    <div className={contenedor}>
      {PREGUNTAS_FRECUENTES.map((item, i) => (
        <div key={item.pregunta}>
          <div className="flex flex-col gap-1.5 py-4">
            <span className="font-body font-semibold text-sm text-white-100">
              {item.pregunta}
            </span>
            <span className="font-body text-[13px] text-white-60">
              {item.respuesta}
            </span>
          </div>
          {i < PREGUNTAS_FRECUENTES.length - 1 && (
            <div className={`h-px w-full ${divisor}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Ayuda() {
  const navigate = useNavigate();
  const { activeCategory, setActiveCategory } = useDescubrirTab();

  return (
    <>
      <div className="min-h-screen bg-thea-green text-white-100 lg:hidden">
        {/* Header fijo — mismo patrón que Notificaciones.tsx/DatosDeCuenta.tsx
            (ver esas notas para el porqué del RGB sólido en vez de
            thea-deep). */}
        <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px_+_var(--safe-top))] pt-[var(--safe-top)] flex items-center gap-3 px-5 bg-[rgb(1,20,20)] border-b border-white-12">
          <button onClick={() => navigate(-1)} aria-label="Volver" className="p-1 -m-1">
            <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
          </button>
          <h1 className="font-display font-semibold text-2xl">Ayuda</h1>
        </header>

        <div className="flex flex-col gap-8 pt-[calc(56px_+_var(--safe-top))] pb-10">
          <section className="flex flex-col px-5 pt-6">
            <h2 className="font-body font-semibold text-sm text-white-100 mb-1">
              Contacto
            </h2>
            <Contacto variant="mobile" />
          </section>

          <div className="h-px w-full bg-white-12" />

          <section className="flex flex-col px-5">
            <h2 className="font-body font-semibold text-sm text-white-100 mb-1">
              Preguntas frecuentes
            </h2>
            <PreguntasFrecuentes variant="mobile" />
          </section>
        </div>
      </div>

      {/* Desktop — ver nota grande de arriba. Sticky footer — ver la nota
          completa en Favoritos.tsx. */}
      <div className="hidden min-h-[160vh] flex-col bg-[rgb(1,20,20)] text-white-100 font-body lg:flex">
        <DesktopNavbar
          active={activeCategory}
          onChange={(tab) => {
            setActiveCategory(tab);
            navigate("/");
          }}
        />

        <div className="mx-auto w-full max-w-[1440px] flex-1 px-20 pt-16 pb-20">
          {/* 2026-09-14 (sexta vuelta), a pedido de Ana: sin flecha de
              volver en Desktop, ver la nota en Favoritos.tsx. */}
          <h1 className="mb-10 font-display text-3xl text-white-100">
            Ayuda
          </h1>

          <div className="flex max-w-[640px] flex-col gap-10">
            <section className="flex flex-col gap-2">
              <h2 className="font-body text-[13px] font-semibold uppercase tracking-wide text-white-40">
                Contacto
              </h2>
              <Contacto variant="desktop" />
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-body text-[13px] font-semibold uppercase tracking-wide text-white-40">
                Preguntas frecuentes
              </h2>
              <PreguntasFrecuentes variant="desktop" />
            </section>
          </div>
        </div>

        <DesktopFooter />
      </div>
    </>
  );
}
