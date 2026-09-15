import { Link, useNavigate } from "react-router-dom";
import MobileBottomNav from "../../components/MobileBottomNav";
import ReservationCard from "../../components/ReservationCard";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import { getExperienceById } from "../../data/experiences";
import { IconTicket } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationsContext";
import { useDescubrirTab } from "../../context/DescubrirTabContext";
import { esFechaHoraPasada } from "../../utils/price";

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
 * Descubrir/Perfil. El título "Reservas" no queda fijo, se desplaza con
 * el contenido.
 *
 * 2026-09-07, a pedido de Ana: sin `MobileTopBar` (el logo "Theaveling"
 * + lupa) arriba de todo — este archivo lo traía desde el principio,
 * pero Ana lo sacó explícitamente ("ese header no va ahi"). El título
 * "Reservas" pasa a ser el primer elemento de la pantalla.
 *
 * Título "Reservas" — Figma lo tipografía en Instrument Sans (font
 * body) SemiBold 24px, no en el Archivo/Sansita Thin que STACK.md
 * describe para "Display/H1 grandes" — se respeta el trazo real de
 * este nodo puntual en vez de forzar la regla general, mismo criterio
 * que ya se usa en toda esta sesión (hint de Figma > asunción
 * genérica) cuando hay un nodo real que lo contradice.
 *
 * Datos — 2026-09-07, a pedido de Ana: "no quiero que aparezcan
 * reservas si el usuario que va a testear no las ha hecho". Hasta acá
 * esta pantalla arrancaba con 4 reservas de ejemplo fijas
 * (`RESERVAS_INICIALES`, ya no existe) que se mostraban SIEMPRE, sin
 * importar si esa persona reservó algo de verdad — quedaban de cuando
 * esto era solo un mock visual. Ahora lee de
 * `context/ReservationsContext.tsx`, que arranca vacío de verdad y solo
 * se llena cuando alguien completa el flujo real de compra (ver
 * Compra.tsx, `onConfirmar` → `agregarReserva`). Si la persona que
 * prueba la app no reservó nada, esta pantalla sale vacía (ver el
 * estado "Aún no tienes reservas" más abajo) — y si reserva algo, esa
 * reserva real aparece acá, con la experiencia/fecha/hora que eligió,
 * no un dato inventado.
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
 * iniciar sesion para ver las reservas"): esta pantalla mostraba las
 * reservas sin importar si había sesión o no, aunque `AuthContext.tsx`
 * documenta desde el principio "reservas" como uno de los 3 momentos
 * donde el login "aporta valor" (junto con favoritos y perfil, ver la
 * nota grande de ese archivo) — Perfil.tsx sí tenía su gate (`if
 * (!loggedIn)`), este archivo se quedó sin el suyo. Se agrega el mismo
 * patrón, mismo espíritu de copy ("Inicia sesión para ver tus
 * reservas") y mismo tratamiento visual (ícono + título + texto +
 * botón, Bottom Nav siempre visible), cambiando solo el ícono
 * (`IconTicket` en vez de `IconUser`, más apropiado acá) y la frase.
 *
 * 2026-09-08, a pedido de Ana ("resuelvelo y sin romper nada") — bug
 * real de auditoría: "Pasadas" nunca mostraba nada, porque
 * `ReservationsContext` guarda `estado: "proxima"` en el momento de
 * reservar y nunca lo vuelve a tocar (ver Compra.tsx). Acá se calcula
 * el estado REAL de cada reserva con `esFechaHoraPasada` (utils/price.ts,
 * parsea el mismo string `fechaHora` que ya se muestra en la card) en
 * vez de confiar en el campo guardado — así una reserva pasa sola a
 * "Pasadas" cuando su fecha ya ocurrió, sin tener que tocar el dato
 * guardado ni el flujo de compra.
 *
 * Desktop — 2026-09-14, a pedido de Ana ("encuentra una pantalla de ref
 * desktop para como deben ir las reservas y tambien como se debe ver la
 * pantalla y mensaje cuando no haya"). Esta pantalla era 100% mobile
 * hasta ahora (a diferencia de Detalle/Confirmación/Ver más, nunca
 * había recibido su bloque `hidden lg:block`) — el link "Mis reservas"
 * del panel de perfil de Desktop (`DesktopPerfilDropdown.tsx`) llevaba
 * acá y mostraba la versión de mobile sin adaptar. La búsqueda de una
 * referencia visual puntual (Fever/Eventbrite "mis entradas") no dio una
 * captura reusable — la mayoría de esas pantallas están detrás de login
 * y no se pueden ver sin cuenta real. En su lugar se sigue el mismo
 * patrón que ya converge en TODA esta tanda de pantallas de Desktop
 * (breadcrumb "< Título" + contenido, ver Favoritos.tsx/VerMas.tsx): acá
 * el contenido es la MISMA `ReservationCard` de mobile (sin foto, ya
 * pensada como fila con acordeones — no una card de catálogo, así que
 * NO tiene sentido en grilla) puesta en una columna centrada de lectura
 * cómoda (`max-w-[640px]`) en vez de ancho completo, mismo criterio que
 * usan estas pantallas de "lista personal" en apps reales (Airbnb
 * "Viajes", por ejemplo) — no una tabla ni una grilla de fotos.
 *
 * Estado vacío / sin sesión en Desktop — mismo ícono+título+texto+botón
 * que ya usa el estado vacío de Favoritos.tsx (mismo criterio de
 * consistencia entre las pantallas nuevas de esta tanda), con el ícono y
 * el copy YA estableados acá para mobile (`IconTicket`, "Aún no tienes
 * reservas" / "Inicia sesión para ver tus reservas") — no se inventa
 * copy nuevo, se reusa el mismo tono.
 *
 * Sin versión mobile nueva — el bloque de mobile de abajo es EXACTAMENTE
 * el que ya existía (solo se envolvió en `lg:hidden` para convivir con
 * el bloque de Desktop), ni una clase se tocó.
 */

export default function Reservas() {
  const navigate = useNavigate();
  // 2026-09-07: ya no arranca de `RESERVAS_INICIALES` (datos de ejemplo)
  // — ver la nota grande de arriba ("Gate de login" queda vieja en ese
  // sentido) y context/ReservationsContext.tsx. `reservasBase` sale de
  // ahí: si la persona que está probando la app no reservó nada todavía,
  // sale vacío de verdad.
  const { reservas: reservasBase, cancelarReserva } = useReservations();
  const { loggedIn, requireAuth } = useAuth();
  // DesktopNavbar — mismo Context compartido que el resto de las
  // pantallas de Desktop (ver nota grande en DetalleExperiencia.tsx).
  const { activeCategory, setActiveCategory } = useDescubrirTab();

  const manejarCancelar = (id: string) => {
    cancelarReserva(id);
  };

  const reservas = reservasBase.map((r) => ({
    ...r,
    experience: getExperienceById(r.experienciaId),
    estado: esFechaHoraPasada(r.fechaHora) ? ("pasada" as const) : ("proxima" as const),
  })).filter(
    (r): r is typeof r & { experience: NonNullable<typeof r.experience> } =>
      r.experience !== undefined,
  );

  const proximas = reservas.filter((r) => r.estado === "proxima");
  const pasadas = reservas.filter((r) => r.estado === "pasada");
  const sinReservas = proximas.length === 0 && pasadas.length === 0;

  return (
    <>
      {/* Mobile — ver nota grande arriba. `lg:hidden` para convivir con
          el bloque Desktop de abajo (mismo criterio que el resto de la
          app). Contenido sin tocar, byte a byte igual al de antes. */}
      <div className="lg:hidden">
        {/* Sin sesión — ver la nota grande de arriba ("Gate de login").
            Mismo patrón que Perfil.tsx: el tab sigue siendo alcanzable
            desde el Bottom Nav, solo que su contenido pide login antes
            de mostrar nada. */}
        {!loggedIn ? (
          <div className="min-h-screen bg-thea-green text-white-100 pb-[72px] flex flex-col">
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
        ) : (
          <div className="min-h-screen bg-thea-green pb-[72px] text-white-100">
            {/* 2026-09-07, a pedido de Ana: sin MobileTopBar (el logo
                "Theaveling" + lupa) — no va en esta pantalla. Después,
                "pon asi mismo el de reservas" (mismo tratamiento que le
                acaba de pedir a Perfil.tsx): header fijo sólido con el
                título, en vez del `<h1>` suelto que se desplazaba con el
                scroll. Mismo alto/color/borde que el header de Perfil
                (sin foto ni campanita acá, Reservas no tiene ninguna de
                las dos). */}
            <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px_+_var(--safe-top))] pt-[var(--safe-top)] flex items-center px-5 bg-[rgb(1,20,20)] border-b border-white-12">
              <h1 className="font-display font-semibold text-lg text-white-100">
                Reservas
              </h1>
            </header>

            <div className="pt-[calc(56px_+_var(--safe-top))]">
              {/* 2026-09-07: estado vacío — ver la nota grande de arriba
                  ("Datos"). Antes no hacía falta (siempre había 4
                  reservas de ejemplo); ahora que arranca vacío de
                  verdad, sin esto la pantalla se veía rota (solo el
                  título y una línea divisoria suelta, sin nada abajo).
                  Mismo lenguaje visual que el estado "sin sesión" de
                  arriba (ícono + título + texto), sin botón acá porque
                  no hay ninguna acción que ofrecer (reservar se hace
                  desde Descubrir/Detalle, no desde acá). */}
              {sinReservas && (
                <div className="flex flex-col items-center justify-center gap-4 px-6 pt-16 text-center">
                  <span className="h-14 w-14 rounded-full bg-white-8 flex items-center justify-center">
                    <IconTicket className="w-6 h-6 text-white-60" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display text-xl text-white-100">
                      Aún no tienes reservas
                    </h2>
                    <p className="font-body text-sm text-white-60 max-w-[260px]">
                      Cuando reserves una experiencia, va a aparecer acá.
                    </p>
                  </div>
                </div>
              )}

              {proximas.length > 0 && (
                <section className="flex flex-col px-5 py-2">
                  <h2 className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide mb-2">
                    Próximas
                  </h2>
                  {proximas.map((r, i) => (
                    <div key={r.id}>
                      <ReservationCard
                        experience={r.experience}
                        fechaHora={r.fechaHora}
                        estado={r.estado}
                        onCancelar={() => manejarCancelar(r.id)}
                      />
                      {i < proximas.length - 1 && <div className="h-px w-full bg-white-6" />}
                    </div>
                  ))}
                </section>
              )}

              {proximas.length > 0 && pasadas.length > 0 && (
                <div className="h-px w-full bg-white-12" />
              )}

              {pasadas.length > 0 && (
                <section className="flex flex-col px-5 py-4">
                  <h2 className="font-body text-[13px] font-semibold text-white-40 uppercase tracking-wide mb-2">
                    Pasadas
                  </h2>
                  {pasadas.map((r, i) => (
                    <div key={r.id}>
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
            </div>

            <div className="fixed bottom-0 left-0 right-0">
              <MobileBottomNav />
            </div>
          </div>
        )}
      </div>

      {/* Desktop — ver nota grande arriba. Sticky footer (min-h-screen +
          flex-col + flex-1 abajo) — ver la nota completa en Favoritos.tsx
          sobre por qué se hace así y no con overflow-x-hidden. */}
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
              volver en Desktop, ver la nota igual en Favoritos.tsx. */}
          <h1 className="mb-10 font-display text-3xl text-white-100">
            Reservas
          </h1>

          {!loggedIn ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white-8">
                <IconTicket className="h-7 w-7 text-white-60" />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl text-white-100">
                  Tus reservas te esperan
                </h2>
                <p className="mx-auto max-w-[420px] font-body text-[15px] text-white-60">
                  Inicia sesión para ver tus próximas experiencias y tu
                  historial de reservas.
                </p>
              </div>
              <button
                onClick={() =>
                  requireAuth("Inicia sesión para ver tus reservas.", () => {})
                }
                className="rounded-xl bg-white-100 px-6 py-3 font-display text-sm font-semibold text-thea-green"
              >
                Iniciar sesión
              </button>
            </div>
          ) : sinReservas ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white-8">
                <IconTicket className="h-7 w-7 text-white-60" />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl text-white-100">
                  Aún no tienes reservas
                </h2>
                <p className="mx-auto max-w-[420px] font-body text-[15px] text-white-60">
                  Cuando reserves una experiencia, va a aparecer acá.
                </p>
              </div>
              <Link
                to="/"
                className="rounded-xl bg-thea-mint px-6 py-3 font-display text-sm font-semibold text-thea-green"
              >
                Seguir descubriendo
              </Link>
            </div>
          ) : (
            // 2026-09-14 (sexta vuelta), a pedido de Ana ("las reservas
            // aca en desk si creo que deben estar contenidas tipo card"):
            // cada `ReservationCard` pasa a vivir dentro de un contenedor
            // propio (`rounded-2xl bg-white-6`), separadas por espacio
            // (`gap-3`) en vez de la línea divisoria fina que usaba antes
            // — ahora se leen como tarjetas individuales, no como una
            // lista plana con separadores.
            //
            // 2026-09-14 (décima vuelta), corrección a pedido de Ana ("TE
            // DIJE QUE LA RESERVA EN LA PANTALLA DE RESERVA TENIA QUE ESTA
            // ALINEADA A LA IZQ"): tenía `mx-auto`, que centraba esta
            // columna en la página — quedaba descuadrada respecto al
            // título "Reservas" de arriba, que sí está pegado a la
            // izquierda. Se saca el `mx-auto`: la columna queda alineada a
            // la izquierda, debajo del título, mismo ancho de lectura
            // (`max-w-[640px]`).
            <div className="flex max-w-[640px] flex-col gap-10">
              {proximas.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="font-body text-[13px] font-semibold uppercase tracking-wide text-white-40">
                    Próximas
                  </h2>
                  {proximas.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl bg-white-6 px-6"
                    >
                      <ReservationCard
                        experience={r.experience}
                        fechaHora={r.fechaHora}
                        estado={r.estado}
                        onCancelar={() => manejarCancelar(r.id)}
                      />
                    </div>
                  ))}
                </section>
              )}

              {pasadas.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="font-body text-[13px] font-semibold uppercase tracking-wide text-white-40">
                    Pasadas
                  </h2>
                  {pasadas.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl bg-white-6 px-6"
                    >
                      <ReservationCard
                        experience={r.experience}
                        fechaHora={r.fechaHora}
                        estado={r.estado}
                      />
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>

        <DesktopFooter />
      </div>
    </>
  );
}
