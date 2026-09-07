import { useEffect, useRef, useState } from "react";
import type { Experience } from "../data/experiences";
import ImagePlaceholder from "./ImagePlaceholder";
import { IconCaretRight, IconCreditCard, IconX, IconXCircle } from "./icons";
import { fechaCompletaDesdeChip } from "../utils/price";
import { useAuth } from "../context/AuthContext";

/*
 * ConfirmarPagoSheet — 2026-09-05, a pedido de Ana, sobre el paso
 * "Resumen" de Compra.tsx: "vamos a confirmar y pago". No viene de un
 * nodo de Figma de Theaveling — Ana pasó 4 capturas de referencia de
 * OTRA app (estilo Airbnb: "Confirmar y pagar" con card de resumen,
 * Forma de pago, Cupones, Información del precio, texto legal y CTA),
 * mismo criterio que TodasFechasSheet.tsx (armado a partir de una
 * captura de otra app, adaptado a datos reales del proyecto) — acá se
 * calca la ESTRUCTURA de la referencia, no sus colores (rojo/rosa de
 * Airbnb → verde/mint de Thea) ni contenido inventado sin relación.
 *
 * "Es bottom pero se instala como pantalla normal con equis" — Ana fue
 * explícita: a diferencia de TODOS los demás sheets de la app
 * (LocationSheet/FechaSheet/TodasFechasSheet/etc., que son
 * `rounded-t-[28px]` con backdrop y ocupan solo parte baja de la
 * pantalla), este ocupa la pantalla COMPLETA (`fixed inset-0`, sin
 * cantos redondeados, sin backdrop visible detrás) y se cierra con una
 * X en el header (no con el back-caret que usa el resto de la app).
 * Igual sigue siendo "sheet" en el sentido de que es un overlay con
 * estado abierto/cerrado sobre Compra.tsx, no una ruta nueva.
 *
 * SEGUNDA VUELTA — 2026-09-05, reestructuración grande a pedido de Ana
 * después de ver el primer armado (que dejaba este sheet detrás de un
 * paso "Resumen" propio con su propia card blanca y su propio botón
 * "Confirmar y pagar"):
 *
 * "TIENE QUE SER Q CUANDO UNO LE DE EN SIGUIENTE EN LA DE LOS ASIENTOS
 * AHI APAREZCA DESDE ABAJO EL BOTTOM Y SE INSTALA COMO PANTALLA" — se
 * borra el paso "Resumen" de Compra.tsx (ver punto 9 del comentario
 * grande de ese archivo). "Siguiente" en la pantalla de selección abre
 * ESTE sheet directo, sin pantalla intermedia. Y ahora sí entra con una
 * animación real: se desliza desde abajo (`translate-y-full` →
 * `translate-y-0`, ver `entrando` más abajo) hasta instalarse ocupando
 * toda la pantalla — antes aparecía de golpe, sin transición.
 *
 * "LA CARD QUE YA TENEMOS EXACTAMENTE IGUAL EN LA PANTALLA DE RESUMEN ES
 * LA QUE DEBE IR EN ESTE BOTTON CON LO DEMAS DATOS PARA ELEGIR DE PAGOS Y
 * DEMAS" — la Booking Summary Card (nodo real de Figma `2342:1441`: foto
 * h-40, categoría + título, filas con viñeta Fecha/Hora/Lugar/Entradas,
 * separador, Total) que antes vivía en el paso "Resumen" de Compra.tsx
 * se movió tal cual —misma estructura y clases— a este archivo, como la
 * card de arriba de todo acá. La única diferencia de contenido es la
 * fecha: se usa `fechaCompleta` (formato largo, "Viernes, 2 de octubre de
 * 2026") en vez del chip abreviado ("Vie 2 oct") — esa versión larga ya
 * se había armado puntualmente para este sheet y se mantiene por quedar
 * más apropiada en una pantalla de pago que el chip corto.
 *
 * "lo de modificar se le puede agregar como boton abajo de la card de
 * booking, donde ahora mismo esta confirmar y pagar puede ir modificar y
 * al lado ver detalles. modificar te lleva a la pantalla anterior, y
 * detalles a la parte de abajo como funciona ahora" — debajo de esa card
 * van 2 botones lado a lado, en el lugar donde el viejo paso "Resumen"
 * tenía su botón ancho "Confirmar y pagar" (ese botón ya no hace falta
 * acá, "Confirmar y pagar" pasó a ser el CTA final flotante de este mismo
 * sheet, ver más abajo): "Modificar" (cierra este sheet y vuelve a la
 * pantalla de selección, `onModificar`) y "Ver detalles" (scrollea hasta
 * "Información del precio" más abajo en este mismo sheet, `irADetalles`
 * — mismo comportamiento que ya tenía el botón "Detalles" que antes vivía
 * adentro de la card).
 *
 * Rating (`experiencia.rating`/`ratingCount`) se saca de acá — no era
 * parte de la card real de "Resumen" que se está reusando tal cual, era
 * un agregado propio de la primera versión de este sheet.
 *
 * Tema claro, no oscuro — a diferencia del resto de Compra.tsx (fondo
 * `thea-green` oscuro), esta pantalla se arma en blanco/`thea-green`
 * sobre fondo claro, mismo tratamiento que ya usaba la card de "Resumen".
 *
 * "Cuando uno baja ahí recién aparece el botón" — versión original (fiel
 * a la referencia de Ana): el CTA arrancaba como una píldora flotante
 * "Revisar" que recién se reemplazaba por el botón ancho "Confirmar y
 * pagar" al llegar al final del contenido (sentinel + IntersectionObserver).
 * SACADO — 2026-09-05, a pedido de Ana: "NO PONGAS BOTON DE PILDORA AHI".
 * El botón "Confirmar y pagar" queda fijo abajo desde que se abre el
 * sheet, sin mecanismo de revelado.
 *
 * Loading de 3 segundos — 2026-09-05, a pedido de Ana: "AL CHECK DE
 * COMPRADO QUIERO QUE LE PONGAS UN LOADING DE 3 SEGUNDOS ANTES DE
 * MOSTRARLO" ("el check de comprado" es Confirmacion.tsx, la pantalla con
 * el ícono de check post-pago). Tocar "Confirmar y pagar" ya no navega
 * directo — pone `procesando` en `true`, este mismo sheet muestra un
 * spinner centrado 3 segundos (`setTimeout`, sin pago real detrás, ver
 * `confirmar` más abajo) y recién ahí llama a `onConfirmar` (la
 * navegación de verdad la sigue haciendo Compra.tsx).
 *
 * Compromisos honestos de contenido (mismo espíritu "primera pasada,
 * documentado" que el resto del proyecto):
 * - "Forma de pago": no hay ningún método de pago real guardado (el
 *   catálogo no modela esto, y aunque lo modelara, esta app nunca
 *   colecta datos financieros reales) — se muestran 2 tarjetas
 *   decorativas ("terminada en 4242"/"terminada en 0002"), marcadas
 *   como "Demo" para que quede claro que son de mentira.
 *
 *   2026-09-07, CAMBIO — a pedido de Ana, se construye el estado "error
 *   de pago" que hasta ahora no existía en el proyecto (el pago siempre
 *   terminaba bien, sin excepción). No hay forma honesta de que un pago
 *   falso "falle al azar" sin backend real detrás — inventar una
 *   probabilidad de fallo sería tan arbitrario como cualquier otro
 *   número inventado del catálogo, y además haría el estado imposible
 *   de mostrar a pedido (dependería de la suerte). En vez de eso, se usa
 *   una convención ya conocida en la industria (Stripe usa tarjetas de
 *   prueba con terminaciones específicas para forzar resultados
 *   distintos en modo test): la tarjeta "4242" simula éxito (como ya
 *   hacía), la tarjeta "0002" simula un rechazo. Por eso "Forma de
 *   pago" deja de ser una tarjeta fija no-editable y pasa a ser
 *   elegible entre las 2 (ver `TARJETAS_DEMO` más abajo) — sigue sin
 *   ser un método de pago real, ahora es además el control que decide
 *   qué estado de esta pantalla se quiere ver.
 * - "Cupones": no hay sistema de cupones/descuentos en el proyecto —
 *   la fila es decorativa, no abre nada al tocarla.
 * - Hora: la referencia trae un RANGO ("De 12:00 p.m. a 4:00 p.m."); el
 *   catálogo real solo tiene una hora de inicio por función (con la
 *   única excepción de "Uno a Uno", que ya trae su propio rango como
 *   parte del string de hora) — se muestra la hora de inicio sola.
 * - "Cancelación gratuita": no hay política de cancelación real
 *   modelada — se usa un texto genérico de 24 horas (no una fecha límite
 *   calculada) para no fabricar una precisión que no existe.
 * - Texto legal: la referencia trae 4 links a páginas que no existen en
 *   Theaveling — en vez de 4 links muertos, una sola oración de aviso,
 *   sin links, honesta sobre que es contenido de relleno.
 *
 * Login contextual — 2026-09-06: "al reservar: Inicia sesión para
 * continuar con tu reserva" (spec del Onboarding/Login). El gate se
 * puso ACÁ, al tocar "Confirmar y pagar" — no antes, al entrar a Compra
 * ni al elegir fecha/asientos — a propósito: se puede armar toda la
 * reserva sin cuenta (mismo criterio que Airbnb, confirmado con Ana:
 * "tocar cualquier alojamiento... te deja reservar con solo elegir
 * fechas/huéspedes y pagar", la sesión no es requisito para MIRAR ni
 * ARMAR, solo para el compromiso final). Si ya hay sesión, `requireAuth`
 * llama a `iniciarConfirmacion` directo, sin mostrar nada.
 */

const TARJETAS_DEMO = [
  { terminacion: "4242" as const },
  { terminacion: "0002" as const },
];

export default function ConfirmarPagoSheet({
  open,
  experiencia,
  fecha,
  hora,
  cantidadEfectiva,
  gratis,
  totalLabel,
  onClose,
  onModificar,
  onConfirmar,
}: {
  open: boolean;
  experiencia: Experience;
  fecha: string;
  hora: string;
  cantidadEfectiva: number;
  gratis: boolean;
  totalLabel: string;
  onClose: () => void;
  onModificar: () => void;
  onConfirmar: () => void;
}) {
  // Animación de entrada — 2026-09-05, a pedido de Ana: "AHI APAREZCA
  // DESDE ABAJO EL BOTTOM Y SE INSTALA COMO PANTALLA". Arranca
  // `translate-y-full` (fuera de pantalla, abajo) y en el siguiente frame
  // pasa a `translate-y-0` — el `requestAnimationFrame` es necesario para
  // que el navegador pinte el estado inicial ANTES de aplicar la clase
  // final, si no, no hay transición que animar (los 2 estados se aplican
  // en el mismo frame). El cierre no tiene animación de salida (se
  // desmonta directo, `if (!open) return null`) — no pedido, se puede
  // sumar después si hace falta.
  const [entrando, setEntrando] = useState(false);
  // 2026-09-05, a pedido de Ana: "AL CHECK DE COMPRADO QUIERO QUE LE
  // PONGAS UN LOADING DE 3 SEGUNDOS ANTES DE MOSTRARLO" — tocar el botón
  // final ya no navega directo a Confirmacion.tsx, primero muestra 3
  // segundos de carga simulando el procesamiento del pago (ver
  // `confirmar` más abajo). Es una demora de mentira con `setTimeout`, no
  // hay ningún pago real detrás — mismo espíritu "primera pasada,
  // documentado" que el resto del proyecto.
  const [procesando, setProcesando] = useState(false);
  // "Forma de pago" / error de pago — ver la nota grande de arriba
  // ("CAMBIO"). "4242" simula éxito (comportamiento de siempre), "0002"
  // simula un rechazo — convención tipo Stripe test cards.
  const [tarjetaElegida, setTarjetaElegida] = useState<"4242" | "0002">("4242");
  const [pagoRechazado, setPagoRechazado] = useState(false);
  const { requireAuth } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const precioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setProcesando(false);
      setPagoRechazado(false);
      setTarjetaElegida("4242");
      setEntrando(false);
      scrollRef.current?.scrollTo({ top: 0 });
      const raf = requestAnimationFrame(() => setEntrando(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntrando(false);
  }, [open]);

  // Limpia el timeout si el componente se desmonta con el pago "en
  // proceso" — evita llamar a `onConfirmar` sobre un componente que ya
  // no está montado.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!open) return null;

  const anioActual = new Date().getFullYear();
  // `fechaCompletaDesdeChip` devuelve todo en minúscula ("viernes, 2 de
  // octubre") — se capitaliza solo la primera letra a mano acá (no con
  // la clase `capitalize` de Tailwind, que pone mayúscula en CADA
  // palabra: "Viernes, 2 De Octubre De 2026", se ve mal).
  const fechaSinAnio = fechaCompletaDesdeChip(fecha);
  const fechaCompleta = `${fechaSinAnio.charAt(0).toUpperCase()}${fechaSinAnio.slice(1)} de ${anioActual}`;

  const irADetalles = () => {
    precioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const iniciarConfirmacion = () => {
    setProcesando(true);
    const fallara = tarjetaElegida === "0002";
    timeoutRef.current = setTimeout(() => {
      if (fallara) {
        setProcesando(false);
        setPagoRechazado(true);
      } else {
        onConfirmar();
      }
    }, 3000);
  };

  // Reintentar — vuelve al formulario (con la tarjeta "0002" todavía
  // elegida, a propósito: si simplemente se cambia de tarjeta y se
  // vuelve a tocar "Confirmar y pagar", ahí sí sale bien, igual que en
  // la vida real cuando te rechazan una tarjeta y probás con otra).
  const reintentar = () => {
    setPagoRechazado(false);
  };

  // Gate de login — ver nota grande de arriba ("Login contextual").
  const confirmar = () => {
    requireAuth(
      "Inicia sesión para continuar con tu reserva.",
      iniciarConfirmacion,
    );
  };

  // 2026-09-05, a pedido de Ana: "AL CHECK DE COMPRADO QUIERO QUE LE
  // PONGAS UN LOADING DE 3 SEGUNDOS ANTES DE MOSTRARLO" — mientras
  // `procesando` es `true`, este mismo sheet (misma animación de entrada,
  // mismo fondo) reemplaza su contenido por un spinner centrado. Sin X
  // para cerrar acá — no tiene sentido "cancelar" un pago que ya se
  // mandó a procesar, ni siquiera en una demo.
  if (procesando) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white-100 transition-transform duration-300 ease-out ${
          entrando ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className="h-10 w-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "rgba(17,44,44,0.12)", borderTopColor: "#112C2C" }}
          role="status"
          aria-label="Procesando pago"
        />
        <p className="font-body text-sm text-thea-green">Procesando tu pago…</p>
      </div>
    );
  }

  // Error de pago — 2026-09-07, ver la nota grande de arriba ("CAMBIO").
  // Mismo lenguaje visual de "estado vacío/error" que ya usa el resto de
  // la app (ícono + título + subtítulo + acciones), esta vez con
  // IconXCircle y color warning en vez de thea-red (mismo criterio que
  // "Agotado" en DetalleExperiencia.tsx: un rechazo de pago es un caso
  // de Warning/Error semántico, no de identidad de marca).
  if (pagoRechazado) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white-100 px-6 text-center transition-transform duration-300 ease-out ${
          entrando ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <IconXCircle className="w-12 h-12 text-warning" />
        <div className="flex flex-col gap-2">
          <h2 className="font-display font-semibold text-lg text-thea-green">
            No pudimos procesar tu pago
          </h2>
          <p className="font-body text-sm max-w-[280px]" style={{ color: "rgba(17,44,44,0.6)" }}>
            Tu banco rechazó la tarjeta terminada en 0002 (demo). Elige otra
            forma de pago e inténtalo de nuevo.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full pt-2">
          <button
            onClick={reintentar}
            className="w-full h-12 rounded-xl bg-thea-green text-white-100 font-body font-semibold text-[15px] leading-5 tracking-[0.3px]"
          >
            Reintentar
          </button>
          <button
            onClick={onClose}
            className="font-body text-sm text-green-70 underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-white-100 transition-transform duration-300 ease-out ${
        entrando ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Header — X a la derecha en vez del back-caret a la izquierda
          que usa el resto de la app, ver nota grande de arriba. */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-green-12 shrink-0">
        <h2 className="font-display font-semibold text-lg text-thea-green">
          Confirmar y pagar
        </h2>
        <button onClick={onClose} aria-label="Cerrar" className="h-9 w-9 -mr-2 flex items-center justify-center">
          <IconX className="w-5 h-5 text-thea-green" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-4 pb-32 flex flex-col gap-6">
        {/* Booking Summary Card — nodo real de Figma `2342:1441`, movida
            tal cual desde el viejo paso "Resumen" de Compra.tsx (ver nota
            grande de arriba, "LA CARD QUE YA TENEMOS EXACTAMENTE IGUAL"). */}
        {/* `shrink-0` es obligatorio acá: el contenedor scrolleable de
            arriba (`overflow-y-auto`) tiene altura fija (`flex-1` dentro
            del sheet fullscreen), y esta card usa `overflow-hidden` para
            recortar las esquinas de la foto — un ítem flex con overflow
            distinto de `visible` pasa a tener tamaño mínimo automático 0
            (regla real de flexbox), así que sin `shrink-0` el navegador
            la encogía a ~2px de alto en vez de dejarla scrollear con el
            resto. Bug real encontrado al mover esta card acá (en su
            ubicación vieja en Compra.tsx nunca pasaba, porque ese
            contenedor no tenía altura fija ni necesitaba encoger nada). */}
        <div className="w-full shrink-0 bg-white-100 border border-green-12 rounded-2xl overflow-hidden">
          <div className="relative h-40 bg-white-8">
            {experiencia.imageUrl ? (
              <img
                src={experiencia.imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-body font-semibold text-[11px] uppercase tracking-[1.5px] text-thea-green">
                {experiencia.category}
              </span>
              <h3 className="font-display text-xl tracking-[-0.1px] text-thea-green">
                {experiencia.title}
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { label: "Fecha", value: fechaCompleta },
                ...(hora ? [{ label: "Hora", value: `${hora} h` }] : []),
                { label: "Lugar", value: `${experiencia.venue}, ${experiencia.city}` },
                {
                  label: "Entradas",
                  value: `${cantidadEfectiva} ${cantidadEfectiva === 1 ? "persona" : "personas"}`,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-20 shrink-0" />
                  <p className="font-body text-sm" style={{ color: "rgba(17,44,44,0.7)" }}>
                    <span className="font-semibold text-thea-green">{row.label}: </span>
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px w-full" style={{ backgroundColor: "rgba(17,44,44,0.12)" }} />

            <div className="flex items-center justify-between">
              <span className="font-body text-sm" style={{ color: "rgba(17,44,44,0.5)" }}>
                Total
              </span>
              <span className="font-display font-semibold text-xl text-thea-green">
                {totalLabel}
              </span>
            </div>
          </div>
        </div>

        {/* "Modificar" / "Ver detalles" — 2026-09-05, a pedido de Ana:
            "SE LE PUEDE AGREGAR COMO BOTON ABAJO DE LA CARD DE BOOKING,
            DONDE AHORA MISMO ESTA CONFIRMAR Y PAGAR PUEDE IR MODIFICAR Y
            AL LADO VER DETALLES". Mismo lugar donde el viejo paso
            "Resumen" tenía su botón ancho de "Confirmar y pagar" (ver
            nota grande de arriba). */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onModificar}
            className="h-11 rounded-xl bg-green-8 text-thea-green font-body font-semibold text-sm"
          >
            Modificar
          </button>
          <button
            onClick={irADetalles}
            className="h-11 rounded-xl bg-green-8 text-thea-green font-body font-semibold text-sm"
          >
            Ver detalles
          </button>
        </div>

        {/* Cancelación gratuita — política genérica, no una fecha límite
            calculada (ver "Compromisos honestos" arriba). */}
        <div className="flex flex-col gap-3">
          <p className="font-body font-semibold text-sm text-thea-green">
            Cancelación gratuita
          </p>
          <div className="rounded-2xl border border-green-12 px-4 py-3.5">
            <p className="font-body text-sm" style={{ color: "rgba(17,44,44,0.7)" }}>
              Puedes cancelar sin costo hasta 24 horas antes de la función y
              recibes un reembolso completo.
            </p>
          </div>
        </div>

        {/* Forma de pago — 2 tarjetas decorativas elegibles, ver nota
            grande de arriba ("CAMBIO", 2026-09-07). Elegir una no es
            solo estética: decide si "Confirmar y pagar" termina bien o
            en el estado de error. */}
        <div className="flex flex-col gap-3">
          <p className="font-body font-semibold text-sm text-thea-green">Forma de pago</p>
          <div className="flex flex-col gap-2">
            {TARJETAS_DEMO.map((tarjeta) => {
              const elegida = tarjetaElegida === tarjeta.terminacion;
              return (
                <button
                  key={tarjeta.terminacion}
                  onClick={() => setTarjetaElegida(tarjeta.terminacion)}
                  className={`rounded-2xl border px-4 py-3.5 flex items-center gap-3 text-left ${
                    elegida ? "border-thea-green" : "border-green-12"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      elegida ? "border-thea-green" : "border-green-20"
                    }`}
                  >
                    {elegida && <span className="h-2 w-2 rounded-full bg-thea-green" />}
                  </span>
                  <IconCreditCard className="w-5 h-5 text-thea-green opacity-70" />
                  <span className="font-body text-sm text-thea-green flex-1">
                    Tarjeta terminada en {tarjeta.terminacion}
                  </span>
                  <span className="font-body text-[11px] uppercase tracking-[1px] text-thea-green opacity-40">
                    Demo
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cupones — fila decorativa, no hay sistema de cupones real. */}
        <div className="flex flex-col gap-3">
          <p className="font-body font-semibold text-sm text-thea-green">Cupones</p>
          <div className="rounded-2xl border border-green-12 px-4 py-3.5 flex items-center justify-between">
            <span className="font-body text-sm" style={{ color: "rgba(17,44,44,0.5)" }}>
              Ingresa un cupón
            </span>
            <IconCaretRight className="w-4 h-4 text-thea-green opacity-40" />
          </div>
        </div>

        {/* Información del precio — mismo total ya calculado en
            Compra.tsx (`totalLabel`), no un cálculo nuevo. Destino de
            "Ver detalles" de arriba (`irADetalles`). */}
        <div ref={precioRef} className="flex flex-col gap-3">
          <p className="font-body font-semibold text-sm text-thea-green">
            Información del precio
          </p>
          <div className="rounded-2xl border border-green-12 px-4 py-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-body text-sm text-thea-green">
                {gratis ? "Gratis" : experiencia.price} × {cantidadEfectiva}{" "}
                {cantidadEfectiva === 1 ? "persona" : "personas"}
              </span>
              <span className="font-body text-sm text-thea-green shrink-0">{totalLabel}</span>
            </div>
            <div className="h-px w-full bg-green-12" />
            <div className="flex items-center justify-between gap-3">
              <span className="font-body font-semibold text-sm text-thea-green">
                Total{" "}
                <span className="font-normal underline" style={{ color: "rgba(17,44,44,0.5)" }}>
                  COP
                </span>
              </span>
              <span className="font-display font-semibold text-lg text-thea-green">
                {totalLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Aviso legal — una sola oración honesta, sin links a páginas
            que no existen (ver nota grande de arriba). */}
        <p className="font-body text-xs" style={{ color: "rgba(17,44,44,0.5)" }}>
          Al tocar "Confirmar y pagar" aceptas los términos de la reserva de
          Theaveling. Esta es una demo — no se procesa ningún pago real.
        </p>
      </div>

      {/* CTA — 2026-09-05, a pedido de Ana: "NO PONGAS BOTON DE PILDORA
          AHI" — se saca la píldora "Revisar" y el mecanismo de
          revelado-al-scrollear que la acompañaba (sentinel +
          IntersectionObserver). El botón final queda siempre fijo abajo,
          visible desde que se abre el sheet, mismo trato que el resto de
          los CTA anchos de la app (por ejemplo "Siguiente" en Compra.tsx). */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white-100 border-t border-green-12">
        <button
          onClick={confirmar}
          className="w-full h-12 rounded-xl bg-thea-green text-white-100 font-body font-semibold text-[15px] leading-5 tracking-[0.3px]"
        >
          Confirmar y pagar
        </button>
      </div>
    </div>
  );
}
