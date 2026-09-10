import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileBottomNav from "../../components/MobileBottomNav";
import SupportingCard from "../../components/cards/SupportingCard";
import PreferenceSheet from "../../components/PreferenceSheet";
import NotificacionesSheet from "../../components/NotificacionesSheet";
import BandejaSheet, {
  notificacionesIniciales,
  type NotificacionRecibida,
} from "../../components/BandejaSheet";
import {
  IconBell,
  IconCaretRight,
  IconCurrency,
  IconGlobe,
  IconHelpCircle,
  IconUser,
} from "../../components/icons";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { getExperienceById } from "../../data/experiences";
import {
  IDIOMAS,
  MONEDAS,
  IDIOMA_KEY,
  MONEDA_KEY,
  leerPreferencia,
} from "../../data/preferencias";

/*
 * Idioma / Moneda — 2026-09-04, a pedido de Ana: "idioma y moneda deben
 * ser clickeables tambien y cambiables". Antes eran texto plano fijo
 * (ver nota vieja más abajo, que se actualiza). Ahora abren
 * PreferenceSheet — la selección se guarda de verdad en localStorage
 * (mismo patrón que "recientes" en LocationSheet.tsx), pero no traduce
 * la interfaz ni convierte precios todavía (ver nota completa en
 * PreferenceSheet.tsx sobre por qué).
 *
 * 2026-09-09: `IDIOMAS`/`MONEDAS`/las keys/`leerPreferencia` se movieron
 * a `data/preferencias.ts` — ahora también los usa `IdiomaMonedaModal.tsx`
 * (ícono nuevo en `DesktopNavbar`), mismo criterio de "una sola fuente"
 * que el resto del proyecto. Nada de la lógica de acá cambió.
 */

/*
 * Perfil — 2026-09-03, reconstruido a partir del nodo REAL de Figma
 * (`08 — Perfil` → `perfil-screen`, `1557:460`), traído vía
 * get_design_context. La versión anterior era una aproximación armada
 * sin mirar Figma (reusaba ExperienceCardMasReservados —268×368, con
 * precio— en un riel horizontal); Ana la corrigió señalando que el
 * spec real es MUY distinto: grilla de 2 columnas con una card más chica
 * y simple (SupportingCard, sin precio/rating), no un riel.
 *
 * Diferencias a propósito respecto al nodo real de Figma:
 * - Header: Figma trae el `mobile-top-bar` completo (wordmark + buscador,
 *   igual que en Descubrir) — a pedido explícito de Ana, acá va solo un
 *   botón de volver, nada más. Mismo lenguaje visual que los headers de
 *   Notificaciones/Datos de cuenta (flecha simple, sin chip circular — el
 *   chip circular es un patrón reservado a "ícono sobre imagen", ver
 *   DetalleExperiencia.tsx).
 * - El texto rojo al final de "Preferencias" en el nodo de Figma
 *   ("Idioma y Moneda: confirmados... falta definir qué pasa al
 *   tocarlas") era una nota de trabajo de Ana para el equipo de diseño,
 *   no copy real de producto — se excluyó del render a propósito. La
 *   pregunta que dejaba abierta ("qué pasa al tocarlas") ya se resolvió
 *   2026-09-04 — ver la nota grande arriba del todo del archivo.
 * - Fondo — 2026-09-03, corrección de Ana: "recuerda que esta pantalla
 *   debe ir en verde en el diseño a código". El nodo de Figma mockea
 *   Perfil (y sus 2 subpantallas) sobre fondo claro (bg-white-100,
 *   texto thea-green) — literal, pero Ana pidió explícitamente que en
 *   CÓDIGO esta sección use el tema oscuro thea-green de siempre (mismo
 *   que Descubrir/Detalle), no el blanco que Figma muestra. Toda la
 *   pantalla (+ Notificaciones.tsx + DatosDeCuenta.tsx) se armó/corrigió
 *   con ese criterio: bg-thea-green, texto white-100, tintes de
 *   rgba(251,251,251,X) en vez de rgba(17,44,44,X), tokens white-* en vez
 *   de los valores claros que trae el mockup.
 * - "Notificaciones" y "Datos de cuenta" — 2026-09-03: existían como
 *   pantallas propias en Figma (`notificaciones-screen`, node 2051:746;
 *   `datos-de-cuenta-screen`, node 2051:770) pero se me habían quedado
 *   afuera de la reconstrucción inicial de Perfil — Ana lo señaló. Ya
 *   están construidas (ver Notificaciones.tsx / DatosDeCuenta.tsx) y acá
 *   las filas ahora son <Link> reales a /perfil/notificaciones y
 *   /perfil/datos-de-cuenta.
 * - Perfil (nombre/foto) es contenido mock ("Elena Voss") tal cual el
 *   nodo de Figma — no hay login/cuenta real todavía.
 *
 * Login contextual — 2026-09-06: "acceder al perfil/historial" es uno de
 * los 3 momentos donde el login aporta valor (ver AuthContext.tsx). Acá
 * el gate no es un sheet a mitad de otra acción (como en favoritos/
 * reserva) — Perfil es un tab completo del Bottom Nav, así que sin
 * sesión se muestra un estado propio (ícono + texto + botón), no el
 * perfil mock detrás de un overlay. Nombre ("Elena Voss") sigue siendo
 * contenido decorativo — no se recolecta nombre real en el login falso
 * (ver LoginSheet.tsx) — pero el correo ahora sí refleja el que se usó
 * para "iniciar sesión" (auth falsa, pero ya no un valor 100% inventado).
 */
export default function Perfil() {
  const { favoritos } = useFavorites();
  const { loggedIn, email, requireAuth } = useAuth();
  const [idioma, setIdioma] = useState(() => leerPreferencia(IDIOMA_KEY, "es"));
  const [moneda, setMoneda] = useState(() => leerPreferencia(MONEDA_KEY, "COP"));
  const [sheetAbierto, setSheetAbierto] = useState<
    "idioma" | "moneda" | "notificaciones" | "avisos" | null
  >(null);
  /*
   * Notificaciones RECIBIDAS (bandeja) — 2026-09-04, distinto del estado
   * `sheetAbierto === "notificaciones"` de arriba (ese es preferencias/
   * toggles, ver NotificacionesSheet.tsx). `useState(notificacionesIniciales)`
   * — a propósito en memoria, NO localStorage: Ana pidió que cada refresh
   * de la página pueda mostrar de nuevo el puntito mint para poder hacer
   * la demo de que funciona (ver nota grande en BandejaSheet.tsx). Vive
   * acá (no en un context global) porque hoy es el único lugar de la app
   * que usa la campanita — si más pantallas necesitan mostrar el mismo
   * indicador más adelante, ahí sí se justifica subirlo a un context
   * (mismo criterio que FavoritesContext).
   */
  const [notificaciones, setNotificaciones] = useState<NotificacionRecibida[]>(
    notificacionesIniciales,
  );
  const hayNotificacionesSinLeer = notificaciones.some((n) => !n.leida);

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

  const idiomaLabel = IDIOMAS.find((i) => i.value === idioma)?.label ?? "Español";
  const monedaLabel = MONEDAS.find((m) => m.value === moneda)?.label.split(" — ")[0] ?? "COP $";

  const experienciasFavoritas = favoritos
    .map((id) => getExperienceById(id))
    .filter((exp): exp is NonNullable<typeof exp> => exp !== undefined);

  // Sin sesión — estado propio en vez del perfil mock (ver nota grande
  // de arriba, "Login contextual"). Mismo Bottom Nav que el resto de la
  // app: Perfil sigue siendo un tab alcanzable, solo que su contenido
  // pide login antes de mostrar nada personal.
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-thea-green text-white-100 pb-[72px] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="h-14 w-14 rounded-full bg-white-8 flex items-center justify-center">
            <IconUser className="w-6 h-6 text-white-60" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-xl text-white-100">
              Tu perfil te espera
            </h1>
            <p className="font-body text-sm text-white-60 max-w-[260px]">
              Inicia sesión para ver tu perfil, tus reservas y tus
              experiencias favoritas.
            </p>
          </div>
          <button
            onClick={() =>
              requireAuth(
                "Inicia sesión para ver tu perfil, tus reservas y tus favoritos.",
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
    <div className="min-h-screen bg-thea-green text-white-100 pb-[72px]">
      {/* Header fijo — 2026-09-04, a pedido de Ana: "en perfil quita el
          back y en ese espacio del header poner la img de elena con la
          campanita de notificaciones". Reemplaza la versión anterior
          (solo botón de volver — ver historial abajo) por la foto de
          Elena a la izquierda + campanita a la derecha, sin back: Perfil
          es un tab PRINCIPAL del Bottom Nav (mismo estatus que
          Descubrir/Reservas), no una pantalla de "volver", así que ya no
          hace falta caret de regreso — coherente con cómo se resolvió
          Reservas.tsx (`MobileTopBar` sin back).

          Historial — 2026-09-03: acá solo iba un botón de volver (ver
          nota vieja de diferencias con Figma, más abajo); 2026-09-04,
          primera vuelta: se agregó la campanita pero ABAJO, en la fila
          de foto+nombre+email del cuerpo, dejando el back intacto en el
          header (ver Files/summary de esa sesión) — resultaba en 2
          elementos redundantes (back que no debía estar, foto/campanita
          que Ana quería en el header). Esta es la corrección final: la
          foto (chica, 32px, sin nombre/email al lado — eso se queda en
          el cuerpo, ver más abajo) y la campanita pasan al header fijo;
          el back se elimina del todo.

          Sigue fijo (`fixed`, no se mueve al scrollear) — mismo criterio
          de siempre para "chrome" de navegación (Top Bar, Category Tabs,
          Bottom Nav), y porque la campanita necesita quedar alcanzable
          en todo momento, no solo arriba del todo. `bg-[rgb(1,20,20)]`
          100% opaco (no `thea-deep`, que es 95%) por el mismo motivo ya
          documentado antes: sin foto detrás, el 5% transparente dejaba
          pasar un "fantasma" del contenido de abajo al scrollear. */}
      <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px_+_var(--safe-top))] pt-[var(--safe-top)] flex items-center justify-between px-5 bg-[rgb(1,20,20)] border-b border-white-12">
        {/* 2026-09-07, a pedido de Ana: "baja la imagen de ahi la de
            elena y ponla junto con sus datos abajo... y ahi pon perfil"
            — la foto de Elena se va de acá (baja al bloque de nombre/
            correo, ver más abajo) y este lado del header pasa a decir
            "Perfil", mismo lenguaje que el título de las demás
            subpantallas (Notificaciones/Datos de cuenta/Ayuda), aunque
            acá no hay botón de volver (Perfil es tab principal, no se
            "vuelve" de acá). */}
        <h1 className="font-display font-semibold text-lg text-white-100">
          Perfil
        </h1>
        {/* Campanita — abre `BandejaSheet`, el listado real de
            notificaciones recibidas (no el de preferencias — ver nota
            grande de `notificaciones`/`avisos` más arriba, junto al
            useState). Puntito mint (`bg-thea-mint`, círculo chico
            absoluto) visible solo si `hayNotificacionesSinLeer`; se
            marca como leída al CERRAR la bandeja, no al abrirla — así
            los puntitos individuales de cada aviso alcanzan a verse
            mientras está abierta (ver nota completa en BandejaSheet.tsx). */}
        <button
          onClick={() => setSheetAbierto("avisos")}
          aria-label="Notificaciones"
          className="relative p-1 shrink-0"
        >
          <IconBell className="w-5 h-5 text-white-100" />
          {hayNotificacionesSinLeer && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-thea-mint"
            />
          )}
        </button>
      </header>

      <div className="pt-[calc(56px_+_var(--safe-top))]">
      {/* Nombre + email + foto — 2026-09-04: la foto y la campanita
          habían pasado al header fijo de arriba. 2026-09-07, a pedido
          de Ana ("baja la imagen... ponla junto con sus datos abajo"):
          la foto vuelve a bajar acá, al lado del nombre/correo — la
          campanita se queda arriba (sigue necesitando estar alcanzable
          en todo momento al scrollear, ver nota del header). */}
      <div className="flex items-center gap-3 p-5">
        <img
          src="/assets/images/elena-avatar.jpg"
          alt="Elena Voss"
          className="h-14 w-14 rounded-full shrink-0 object-cover bg-white-8"
        />
        <div className="flex flex-col gap-1">
          <p className="font-body font-semibold text-lg text-white-100">
            Elena Voss
          </p>
          <span className="font-body text-[13px] text-white-60">
            {email}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-white-12" />

      {/* Favoritos — riel de scroll horizontal, SupportingCard (spec real
          de Figma), no la grilla de 2 columnas que había antes. 2026-09-03,
          corrección de Ana: la grilla con wrap crecía hacia ABAJO a medida
          que se acumulaban favoritos (la pantalla se hacía cada vez más
          larga) — mismo patrón horizontal que ya usan los demás rieles del
          proyecto (Más reservados, Descubrimientos, Contenido similar).
          Cuando haya muchos favoritos, la idea a futuro es un "Ver todos"
          que sí lleve a una grilla — Ana lo dejó pendiente de definir, NO
          se construye todavía. */}
      <section className="flex flex-col gap-4 pb-4 pt-5">
        <h2 className="font-body font-semibold text-sm text-white-100 px-5">
          Favoritos
        </h2>
        {experienciasFavoritas.length === 0 ? (
          <p className="text-[13px] text-white-60 px-5">
            Todavía no marcaste ninguna experiencia como favorita — toca
            el corazón de cualquier pieza para guardarla aquí.
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
            {experienciasFavoritas.map((exp) => (
              <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                <SupportingCard
                  id={exp.id}
                  tag={exp.tag}
                  title={exp.title}
                  venue={exp.venue}
                  city={exp.city}
                  imageUrl={exp.imageUrl}
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="h-px w-full bg-white-12" />

      {/* Preferencias — Notificaciones/Datos de cuenta enlazan a las
          pantallas reales (ver nota arriba). Idioma/Moneda — 2026-09-04,
          a pedido de Ana, pasaron de texto plano a clickeables/cambiables
          (ver nota grande arriba sobre qué tan real es el cambio). Ayuda
          / Servicio al cliente — nueva fila, mismo pedido.
          2026-09-04, "iconizamos" — Ana pidió ícono a la izquierda de
          CADA fila de esta lista. Idioma reusa IconGlobe, Datos de
          cuenta reusa IconUser (ya existían); Moneda/Notificaciones/
          Ayuda usan íconos nuevos (ver icons.tsx). Mismo tratamiento
          visual que la lista de "Información adicional" en Detalle:
          16px, opacity-50 (ver esa nota en DetalleExperiencia.tsx). */}
      <section className="flex flex-col p-5">
        {/* 2026-09-04, a pedido de Ana: "haz mas notable la diferencia
            entre preferencias y las opciones" — el título y las filas
            de abajo eran casi el mismo peso visual (mismo tamaño/color,
            solo cambiaba negrita vs. regular). Pasa al mismo lenguaje
            de encabezado de sección "de apoyo" que ya usa LocationSheet
            ("Cerca de ti", "Recientes", "Ciudades sugeridas"): chico,
            mayúsculas, tracking ancho, tono apagado (white-40) — así el
            título queda claramente subordinado y las opciones (blanco
            pleno, más grandes) son las que llevan el peso visual. */}
        <h2 className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide mb-2">
          Preferencias
        </h2>

        <button
          onClick={() => setSheetAbierto("idioma")}
          className="flex items-center justify-between py-4 text-left"
        >
          <span className="flex items-center gap-3">
            <IconGlobe className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
            <span className="font-body text-sm text-white-100">
              Idioma de interfaz
            </span>
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="font-body font-medium text-[13px] text-white-80">
              {idiomaLabel}
            </span>
            <IconCaretRight className="w-4 h-4 text-white-40" />
          </span>
        </button>
        <div className="h-px w-full bg-white-6" />

        <button
          onClick={() => setSheetAbierto("moneda")}
          className="flex items-center justify-between py-4 text-left"
        >
          <span className="flex items-center gap-3">
            <IconCurrency className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
            <span className="font-body text-sm text-white-100">Moneda</span>
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="font-body font-medium text-[13px] text-white-80">
              {monedaLabel}
            </span>
            <IconCaretRight className="w-4 h-4 text-white-40" />
          </span>
        </button>
        <div className="h-px w-full bg-white-6" />

        <button
          onClick={() => setSheetAbierto("notificaciones")}
          className="flex items-center justify-between py-4 text-left"
        >
          <span className="flex items-center gap-3">
            <IconBell className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
            <span className="font-body text-sm text-white-100">
              Notificaciones
            </span>
          </span>
          <IconCaretRight className="w-4 h-4 text-white-40 shrink-0" />
        </button>
        <div className="h-px w-full bg-white-6" />

        <Link to="/perfil/datos-de-cuenta" className="flex items-center justify-between py-4">
          <span className="flex items-center gap-3">
            <IconUser className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
            <span className="font-body text-sm text-white-100">
              Datos de cuenta
            </span>
          </span>
          <IconCaretRight className="w-4 h-4 text-white-40 shrink-0" />
        </Link>
        <div className="h-px w-full bg-white-6" />

        <Link to="/perfil/ayuda" className="flex items-center justify-between py-4">
          <span className="flex items-center gap-3">
            <IconHelpCircle className="w-4 h-4 text-white-100 opacity-50 shrink-0" />
            <span className="font-body text-sm text-white-100">
              Servicio al cliente / Ayuda
            </span>
          </span>
          <IconCaretRight className="w-4 h-4 text-white-40 shrink-0" />
        </Link>
      </section>
      </div>

      <PreferenceSheet
        open={sheetAbierto === "idioma"}
        title="Idioma de interfaz"
        options={IDIOMAS}
        selected={idioma}
        onSelect={setIdioma}
        onClose={() => setSheetAbierto(null)}
      />
      <PreferenceSheet
        open={sheetAbierto === "moneda"}
        title="Moneda"
        options={MONEDAS}
        selected={moneda}
        onSelect={setMoneda}
        onClose={() => setSheetAbierto(null)}
      />
      <NotificacionesSheet
        open={sheetAbierto === "notificaciones"}
        onClose={() => setSheetAbierto(null)}
      />
      <BandejaSheet
        open={sheetAbierto === "avisos"}
        notificaciones={notificaciones}
        onClose={() => {
          setSheetAbierto(null);
          setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
        }}
      />

      <div className="fixed bottom-0 left-0 right-0">
        <MobileBottomNav />
      </div>
    </div>
  );
}
