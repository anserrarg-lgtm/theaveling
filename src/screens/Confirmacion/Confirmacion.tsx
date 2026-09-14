import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getExperienceById } from "../../data/experiences";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { useDescubrirTab } from "../../context/DescubrirTabContext";

/*
 * Confirmación de reserva — último paso del flujo feliz
 * (ver knowledge/ARCHITECTURE.md, User Flow).
 * Thea Mint (#2ECCA6) es el único acento reservado para "Pago exitoso"
 * (ver knowledge/STACK.md) — el ícono de check acá es el uso puntual.
 * Placeholder estructural.
 *
 * 2026-09-05, a pedido de Ana: "QUIERO QUE EL CHECK NO SEA MARCADO POR UN
 * CIRCULO, QUIERO UN CHECK EN MINT NORMAL" — se saca el círculo de fondo
 * (`bg-thea-mint` + `rounded-full`) que traía el ícono; queda el trazo
 * del check solo, en mint (`text-thea-mint` + `stroke="currentColor"`,
 * mismo patrón que el resto de los íconos de la app, ver icons.tsx), más
 * grande que antes (antes 28px adentro de un círculo de 64px, ahora 56px
 * él solo) para que siga teniendo presencia como elemento principal de la
 * pantalla.
 *
 * "EL BOTON DE DESCUBRIR MAS QUE NO SEA UNA PILDORA" — "Volver a
 * Descubrir" pasa de `rounded-full` (píldora) a `rounded-xl`, mismo
 * lenguaje de esquinas que el resto de los botones de la app (Siguiente,
 * Confirmar y pagar, etc. — ninguno de esos es píldora).
 *
 * 2026-09-07, bug real — a pedido de Ana: "el feedback no esta tirando
 * bien el nombre del descubrimiento, lo tira como con#". El texto
 * mostraba literalmente "la experiencia #{id}" usando el slug de la URL
 * (ej. "#sesion-subterranea") en vez del nombre real de la experiencia —
 * quedó así desde que esta pantalla era un placeholder estructural sin
 * conectar al catálogo. Ahora busca la experiencia con
 * `getExperienceById` (mismo helper que usa el resto de la app, ver
 * DetalleExperiencia.tsx/Compra.tsx) y muestra su `title` real; si por
 * algún motivo el id no matchea ninguna experiencia del catálogo, cae a
 * un texto genérico en vez de mostrar el slug crudo.
 *
 * Desktop — 2026-09-14, a pedido de Ana: preguntó "cómo suelen ser estas
 * pantallas" y, al ver que esta pantalla no tenía NINGÚN tratamiento de
 * Desktop (a diferencia de todo el resto de la app), confirmó armar una
 * versión propia ("si vamos"). Referencia real (Fever/Airbnb/Eventbrite,
 * descrita en la conversación, no calcada de un nodo de Figma puntual —
 * no hay uno para esta pantalla): la barra y el pie de la app se
 * mantienen (no se "sale" de Theaveling), el contenido vive en un bloque
 * centrado con una tarjeta de resumen de la reserva (mismo formato que la
 * card de resumen del paso "pago" en DetalleExperiencia.tsx — foto,
 * categoría, título, Fecha/Hora/Lugar/Entradas, Total), y hay 2 botones
 * en vez de uno solo ("Ver mi reserva" / "Seguir descubriendo").
 *
 * De dónde sale el resumen — `Reserva` (ReservationsContext.tsx) solo
 * guarda `fechaHora` como texto, no cantidad de entradas ni total (nunca
 * hizo falta hasta ahora). En vez de agrandar ese modelo compartido con
 * mobile solo para esto, `confirmarPagoDesktop` (DetalleExperiencia.tsx)
 * pasa fecha/hora/cantidad/total por `state` de la navegación — se lee
 * acá con `useLocation().state`. Si no está (por ejemplo, alguien
 * recarga la página ya en `/confirmacion`, donde `state` se pierde) esas
 * filas de la tarjeta simplemente no se muestran — queda lugar y foto/
 * categoría/título, que sí salen siempre de `experiencia`.
 *
 * Solo se agrega el bloque Desktop (`hidden lg:block`) — el bloque de
 * mobile de arriba se envuelve en `lg:hidden` tal cual estaba, sin tocar
 * ni una clase de su contenido (regla de esta sesión: nunca mobile sin
 * pedido explícito para ESE archivo).
 */
interface ConfirmacionNavState {
  fecha?: string;
  hora?: string;
  cantidad?: number;
  totalLabel?: string;
}

export default function Confirmacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const experiencia = id ? getExperienceById(id) : undefined;
  const estadoNav = (location.state ?? {}) as ConfirmacionNavState;

  // DesktopNavbar — mismo Context compartido que el resto de las
  // pantallas de Desktop (ver nota grande en DetalleExperiencia.tsx).
  const { activeCategory, setActiveCategory } = useDescubrirTab();

  return (
    <>
      {/* Mobile — sin cambios, ver nota grande arriba. `lg:hidden` para
          convivir con el bloque Desktop de abajo (mismo criterio que
          Descubrir.tsx/DetalleExperiencia.tsx/VerMas.tsx). */}
      <div className="min-h-screen bg-thea-green text-white-100 font-body flex flex-col items-center justify-center px-6 text-center gap-4 lg:hidden">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-thea-mint"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <h1 className="font-display font-thin text-3xl">¡Reserva confirmada!</h1>
        <p className="text-white-80 text-sm max-w-xs">
          Ya tienes tu lugar para{" "}
          {experiencia ? (
            <span className="text-white-100 font-medium">{experiencia.title}</span>
          ) : (
            "esta experiencia"
          )}
          . El ticket queda disponible en Reservas.
        </p>
        <Link
          to="/"
          className="mt-4 rounded-xl bg-white-12 px-6 py-3 font-display text-sm"
        >
          Volver a Descubrir
        </Link>
      </div>

      {/* Desktop — ver nota grande arriba. */}
      <div className="hidden bg-[rgb(1,20,20)] text-white-100 font-body lg:block">
        <DesktopNavbar
          active={activeCategory}
          onChange={(tab) => {
            setActiveCategory(tab);
            navigate("/");
          }}
        />

        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-20 pb-24 pt-20 text-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-thea-mint"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <h1 className="font-display font-thin text-4xl">¡Reserva confirmada!</h1>
            <p className="max-w-[480px] font-body text-[15px] text-white-70">
              Ya tienes tu lugar para{" "}
              {experiencia ? (
                <span className="font-medium text-white-100">{experiencia.title}</span>
              ) : (
                "esta experiencia"
              )}
              . El ticket queda disponible en Reservas.
            </p>
          </div>

          {experiencia && (
            <div className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white-12 bg-white-6 text-left">
              <div className="relative h-40 bg-white-8">
                {experiencia.imageUrl ? (
                  <img
                    src={experiencia.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                  <span className="font-body font-semibold text-[11px] uppercase tracking-[1.5px] text-thea-mint">
                    {experiencia.category}
                  </span>
                  <h3 className="font-display text-xl tracking-[-0.1px] text-white-100">
                    {experiencia.title}
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    ...(estadoNav.fecha ? [{ label: "Fecha", value: estadoNav.fecha }] : []),
                    ...(estadoNav.hora ? [{ label: "Hora", value: `${estadoNav.hora} h` }] : []),
                    { label: "Lugar", value: `${experiencia.venue}, ${experiencia.city}` },
                    ...(estadoNav.cantidad
                      ? [
                          {
                            label: "Entradas",
                            value: `${estadoNav.cantidad} ${estadoNav.cantidad === 1 ? "persona" : "personas"}`,
                          },
                        ]
                      : []),
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white-20" />
                      <p className="font-body text-sm text-white-70">
                        <span className="font-semibold text-white-100">{row.label}: </span>
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
                {estadoNav.totalLabel && (
                  <>
                    <div className="h-px w-full bg-white-12" />
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-white-50">Total</span>
                      <span className="font-display font-semibold text-xl text-white-100">
                        {estadoNav.totalLabel}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Link
              to="/reservas"
              className="rounded-xl bg-thea-mint px-6 py-3 font-display text-sm font-semibold text-thea-green"
            >
              Ver mi reserva
            </Link>
            <Link
              to="/"
              className="rounded-xl bg-white-12 px-6 py-3 font-display text-sm"
            >
              Seguir descubriendo
            </Link>
          </div>
        </div>

        <DesktopFooter />
      </div>
    </>
  );
}
