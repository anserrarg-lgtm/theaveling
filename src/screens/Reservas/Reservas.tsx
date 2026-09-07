import MobileTopBar from "../../components/MobileTopBar";
import MobileBottomNav from "../../components/MobileBottomNav";
import ReservationCard from "../../components/ReservationCard";
import { getExperienceById } from "../../data/experiences";
import { IconTicket } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationsContext";

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
 */

export default function Reservas() {
  // 2026-09-07: ya no arranca de `RESERVAS_INICIALES` (datos de ejemplo)
  // — ver la nota grande de arriba ("Gate de login" queda vieja en ese
  // sentido) y context/ReservationsContext.tsx. `reservasBase` sale de
  // ahí: si la persona que está probando la app no reservó nada todavía,
  // sale vacío de verdad.
  const { reservas: reservasBase, cancelarReserva } = useReservations();
  const { loggedIn, requireAuth } = useAuth();

  const manejarCancelar = (experienciaId: string) => {
    cancelarReserva(experienciaId);
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

      {/* 2026-09-07: estado vacío — ver la nota grande de arriba
          ("Datos"). Antes no hacía falta (siempre había 4 reservas de
          ejemplo); ahora que arranca vacío de verdad, sin esto la
          pantalla se veía rota (solo el título y una línea divisoria
          suelta, sin nada abajo). Mismo lenguaje visual que el estado
          "sin sesión" de arriba (ícono + título + texto), sin botón acá
          porque no hay ninguna acción que ofrecer (reservar se hace
          desde Descubrir/Detalle, no desde acá). */}
      {proximas.length === 0 && pasadas.length === 0 && (
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

      {proximas.length > 0 && pasadas.length > 0 && (
        <div className="h-px w-full bg-white-12" />
      )}

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
