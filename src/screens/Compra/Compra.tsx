import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExperienceById } from "../../data/experiences";
import { IconCaretRight, IconMap, IconMinus, IconPlus } from "../../components/icons";
import ConfirmarPagoSheet from "../../components/ConfirmarPagoSheet";
import MapaButacas from "../../components/MapaButacas";
import TodasFechasSheet from "../../components/TodasFechasSheet";
import {
  esGratis,
  formatCOP,
  generarOpcionesFechaHora,
  horaCompacta,
  parsePriceToNumber,
} from "../../utils/price";

/*
 * Compra — reconstruida 2026-09-04 sobre el placeholder estructural
 * anterior, con los 2 frames reales de Figma `compra-mobile` (traídos
 * vía get_design_context el mismo día):
 *   - Nodo `1861:554` — paso de selección (fecha/hora, tipo de entrada,
 *     cantidad, Artist/Space Card).
 *   - Nodo `2342:1441` — paso de resumen antes de pagar (card con foto,
 *     Fecha/Hora/Lugar/Entradas, Total, CTA "Confirmar y pagar").
 *
 * Un solo route (`/experiencia/:id/compra`, ver router.tsx) para los 2
 * frames — no son 2 pantallas separadas en el flujo, son 2 estados de
 * ESTA pantalla (`step`), van y vienen con "Siguiente"/back, sin cambiar
 * de URL. El paso 2 en Figma navega a otra pantalla de éxito post-pago
 * por fuera de estos 2 frames — eso ya existe en el proyecto como
 * Confirmacion.tsx (`/experiencia/:id/confirmacion`), así que "Confirmar
 * y pagar" navega ahí, igual que hacía el placeholder viejo.
 *
 * Decisiones de alcance tomadas acá, para que Ana las revise:
 *
 * 1. Naming — el frame `2342:1441` trae como título de header literal
 *    "Confirmación", pero esa palabra ya la usa la pantalla de ÉXITO
 *    post-pago que existe en el proyecto (Confirmacion.tsx). Un paso
 *    PRE-pago con el mismo título que la pantalla de éxito post-pago
 *    iba a confundir (dos pantallas distintas literalmente llamadas
 *    "Confirmación" en el mismo flujo). Se tituló "Resumen" acá en su
 *    lugar — mismo contenido y layout del frame real, solo cambia la
 *    palabra del header. Si Ana prefiere el texto literal de Figma,
 *    es un cambio de una línea.
 *
 * 2. Tipo de entrada / fecha y hora — el mock de Figma muestra 3 chips
 *    de fecha/hora de ejemplo y 2 niveles de precio ("General"/
 *    "Preferencial"). El catálogo real (experiences.ts) solo tiene UN
 *    `date` y UN `price` por experiencia — no hay datos para una
 *    segunda categoría de precio, así que "Tipo de entrada" se queda en
 *    1 sola fila ("General" + el precio real de la pieza). Fecha y hora
 *    SÍ pasó a tener chips reales entre los que elegir, con el día
 *    abreviado tal cual el nodo real de Figma ("Vie 20 mar") — 2026-09-04,
 *    a pedido explícito de Ana ("PON LAS OTRAS DOS FECHAS Y HORAS, SON 3
 *    LAS QUE ESTAN EN FIGMA Y CON LA ABREVIACION DEL DIA"), ajustado a 2
 *    chips el mismo día porque 3 no entraban en el ancho real de la card
 *    en mobile sin cortarse ("AH OK NO CABEN LAS 3 BUENO PON DOS
 *    ENTONCES"), y a 4 (2 filas de 2, en grid) el 2026-09-05 a pedido de
 *    Ana ("PODEMOS PONER DOS FECHAS Y HORAS MAS ABAJO EN LA MISMA
 *    CARD") — ver `NUM_CHIPS_VISIBLE` más abajo. Ver
 *    `generarOpcionesFechaHora` en `utils/price.ts` para de dónde salen
 *    las opciones extra (el catálogo solo tiene 1 función real por
 *    experiencia) y su límite conocido. El resto de opciones (más allá
 *    de las 4 visibles) se ve completo desde "Ver todas" — ver punto 5
 *    abajo.
 *
 * 5. "Ver todas" → TodasFechasSheet — 2026-09-04, a pedido de Ana (mandó
 *    captura de referencia de otra app): "CUANDO SE LE DE AHI EN VER
 *    TODAS TIENE QUE SALIR UNA PANTALLA (EN BOTTON SHEET) COMO LA DE LA
 *    REF... OBVIAMENTE TIENE QUE SALIR EN FONDO VERDE CON LAS CARAC DE
 *    THEA". El link queda alineado a la derecha, debajo de los 2 chips
 *    ("EL VER TODAS TIENE QUE ESTAR HACICA LA DERECHA") y abre
 *    `TodasFechasSheet.tsx` — ver la nota grande de ese archivo para el
 *    detalle completo de qué se calca de la referencia y qué se adapta
 *    a datos reales del proyecto (no hay disponibilidad/cupo modelado,
 *    por ejemplo).
 *
 * 3. "Ver mapa de butacas" / mapa de asientos — el frame de Figma trae
 *    un link a un mapa de butacas interactivo (Pattern separado,
 *    `1848:681`, no es parte de estos 2 frames concretos) en el mismo
 *    renglón que el título "Entradas" (`seat-map-link`, `1837:578`,
 *    ícono `icon/map` + texto subrayado). El catálogo no modela un mapa
 *    de sala/butacas real (qué butacas existen, cuáles están vendidas).
 *
 *    2026-09-04, a pedido de Ana ("PON LO DEL MAPA DE BUTACAS QUE ESO
 *    ESTA EN FIGMA"): primera versión resolvió el acordeón con el
 *    `MapPreview` real del venue (mapa de UBICACIÓN, mismo componente
 *    que "Ver en mapa" de ReservationCard.tsx) — honesto sobre no tener
 *    dato de butacas, pero 2026-09-05 Ana lo rechazó explícitamente:
 *    "el mapa de butacas debe ser real no un mapa de ubicacion". Un
 *    mapa del LUGAR no es lo que pide un link que dice "mapa de
 *    butacas", aunque fuera honesto sobre el límite de datos.
 *
 *    Se reemplaza por `MapaButacas.tsx` (nuevo componente): un plano de
 *    butacas real (escenario + filas de asientos), con ocupación
 *    determinística por experiencia — mismo criterio que
 *    `lugaresDisponibles` en utils/price.ts (estable entre renders,
 *    documentado ahí mismo como decorativo/estimado, no inventario real
 *    de venta de asientos). Es una representación ilustrativa del
 *    aforo, ahora sí un mapa de BUTACAS y no de ubicación.
 *
 *    DECISIÓN CERRADA — 2026-09-05, Ana comparó esta card inline con el
 *    bottom-sheet real que trae Figma para esto ("Pattern / Compra — 2.
 *    Selección de asientos", nodo `1848:681`, pantalla aparte con
 *    resumen de selección y CTA propio) y eligió quedarse con ESTA
 *    versión: "ME GUSTA LA QUE ARMASTE, HAZ QUE FUNCIONE, Y REGISTRA QUE
 *    QUEDO ESTA". No se construye el bottom sheet de Figma — la card de
 *    `MapaButacas.tsx` es la versión definitiva. "Que funcione" además
 *    pidió selección real: se puede tocar cualquier butaca disponible
 *    para marcarla (mint).
 *
 *    Relación cantidad ↔ butacas (segunda vuelta, mismo día) — Ana
 *    corrigió la dirección de esa relación: "LA CANTIDAD DE PERSONAS
 *    DEBE ESTAR RELACIONADO CON EL MAPA DE BUTACAS, O SEA SUBIR CUANDO
 *    SE ELIGEN" (la primera versión hacía lo inverso: `cantidad` topeaba
 *    cuántas butacas se podían elegir). Ahora `cantidadEfectiva` sale de
 *    `butacasElegidas.length` — elegir una butaca ES sumar una persona,
 *    no al revés. Por eso "Cantidad de personas" deja de tener stepper
 *    +/- propio en estas experiencias (sería una segunda fuente de
 *    verdad compitiendo con las butacas) y pasa a ser de solo lectura.
 *
 *    "En alguno simplemente el mapa de butacas no va a ser clickeable
 *    porque no lo necesita" — se modela con el campo nuevo
 *    `asientoAsignado` en experiences.ts (`tieneMapaButacas` acá):
 *    experiencias sin butaca asignada (talleres, charlas, recorridos,
 *    festivales, funciones íntimas, rituales inmersivos) ni siquiera
 *    muestran "Ver mapa de butacas" — usan el stepper manual +/- de
 *    "Cantidad de personas" de siempre, sin ningún mapa. Ver el campo
 *    en experiences.ts para el criterio puntual por experiencia y el
 *    comentario grande de `MapaButacas.tsx` para el detalle completo.
 *
 * 4. "Información adicional" (mapa de ubicación en acordeón) — el frame
 *    concreto de Figma no traía este bloque, solo la Artist/Space Card +
 *    separador (ver ARCHITECTURE.md, donde figura como wishlist). Pasó
 *    por 3 vueltas: 1) primera versión sin el bloque (fiel al frame);
 *    2) Ana lo pidió igual ("veo que solo está lo del lugar de la info
 *    adicional") — se agregó, con "Duración"/"Restricción de edad" como
 *    acordeones propios al principio; esos 2 se sacaron el mismo día y
 *    se sumaron a la ficha de Detalle en su lugar (son datos de la
 *    pieza, no del paso de compra — ver "Ficha del descubrimiento" en
 *    DetalleExperiencia.tsx), quedando solo el acordeón de mapa; 3)
 *    2026-09-04, Ana pidió sacar TODO el bloque de "Información
 *    adicional" de acá ("empezamos primeramente quitando lo que es todo
 *    lo de la info adicional q tenemos ahi") — ya no queda nada de esto
 *    en Compra: ni el título, ni el acordeón de mapa, ni el componente
 *    `InfoAccordion` que lo armaba (se borró por quedar sin uso). La
 *    Artist/Space Card se queda — nunca estuvo bajo ese título.
 *
 * Cantidad de personas: en experiencias SIN mapa de butacas, tope 1–6
 * por el stepper manual, arbitrario pero razonable para un selector
 * simple (el catálogo no define un máximo). En experiencias CON mapa
 * de butacas, no hay tope propio — la cantidad la define cuántas
 * butacas se eligen (hasta las 32 del plano, menos las ocupadas) — ver
 * `cantidadEfectiva` y `tieneMapaButacas` más abajo.
 *
 * `IconMap`/`icon/map` ya estaba definido en icons.tsx desde antes,
 * pensado para esto — ver punto 3 arriba, ahora sí en uso.
 *
 * 6. Sin selección por defecto — 2026-09-05, a pedido de Ana ("NO DEBE
 *    APARECER EN VERDE (COMO CLICKEADO) NINGUN HORARIO" / "SE VAN A
 *    SELECCIONAR CON STROKE mint"): `fechaHoraIndice` arranca en `null`
 *    en vez de `0` — ningún chip ni ninguna card del sheet "Ver todas"
 *    se ve marcada hasta que Ana/el usuario toca una opción real. El
 *    botón "Siguiente" queda deshabilitado mientras sea `null` (ver el
 *    footer más abajo), así que no se puede avanzar sin elegir fecha y
 *    hora — por eso existe esta pantalla, como dijo Ana.
 *
 * 7. Selección con stroke mint, sin checkbox — dentro de
 *    TodasFechasSheet.tsx la card seleccionada ya no lleva un borde
 *    propio (`border-white-12`) cuando NO está elegida; solo la
 *    seleccionada lleva el borde mint. Al tocar una opción ahí, el
 *    sheet se cierra solo (`onSeleccionar` + `onClose` en el mismo
 *    click, eso no cambió) y activa "Siguiente".
 *
 * 8. BookingSelectorCard blanca → transparente (EXPERIMENTO) — hasta acá
 *    esta card era `bg-white-100 border border-green-12` (clara, fiel al
 *    nodo real de Figma). 2026-09-05 Ana preguntó si se veía mejor en el
 *    "transparente típico" que ya usamos en cards sobre fondo oscuro
 *    (`bg-white-6 border border-white-12`, mismo lenguaje que las cards
 *    de TodasFechasSheet.tsx) — dije que la dejaría blanca por contraste,
 *    pero Ana pidió probarlo igual: "probemos, si no me gusta volvemos".
 *
 *    Se cambió el fondo de la card y TODO su contenido interno (labels,
 *    chips, fila de "Tipo de entrada", "Cantidad de personas" y
 *    `MapaButacas.tsx`) de la paleta clara (`text-thea-green`,
 *    `bg-green-8/12`, pensada para fondo blanco) a la paleta oscura
 *    (`text-white-100`, `bg-white-6/8/12`, la misma que ya usan los
 *    sheets) — si se cambiaba solo el fondo de la card sin tocar los
 *    textos/colores internos, quedaban ilegibles (texto verde oscuro
 *    sobre fondo ahora también oscuro). Los chips de fecha/hora además
 *    pasaron a marcar la selección con stroke mint (mismo criterio que
 *    el punto 7, ahora consistente en toda la pantalla) en vez del
 *    relleno sólido que tenían antes, porque un relleno `bg-thea-green`
 *    sólido se confundía visualmente con el propio fondo de pantalla
 *    (`bg-thea-green` también) al quedar la card transparente.
 *
 *    Si Ana no queda conforme, es un cambio reversible con la versión
 *    blanca documentada acá mismo — no hace falta rehacer nada de cero.
 *
 * 9. Se borra el paso "Resumen" como pantalla aparte (EXPERIMENTO) — hasta
 *    acá esta pantalla tenía 2 estados (`step`): "seleccion" y "resumen",
 *    con su propia card blanca y su propio botón "Confirmar y pagar" que
 *    a su vez abría `ConfirmarPagoSheet`. 2026-09-05, Ana probó ese flujo
 *    y lo corrigió: "TIENE QUE SER Q CUANDO UNO LE DE EN SIGUIENTE EN LA
 *    DE LOS ASIENTOS AHI APAREZCA DESDE ABAJO EL BOTTOM Y SE INSTALA COMO
 *    PANTALLA" — o sea, "Siguiente" en la pantalla de selección debe abrir
 *    DIRECTO el sheet de pago (con animación de entrada desde abajo, ver
 *    `ConfirmarPagoSheet.tsx`), sin pasar antes por una pantalla de
 *    Resumen separada. Por eso ya no existe `Step`/`step` — la pantalla
 *    de selección es la única, y "Siguiente" llama directo a
 *    `setConfirmarPagoAbierto(true)`.
 *
 *    "LA CARD QUE YA TENEMOS EXACTAMENTE IGUAL EN LA PANTALLA DE RESUMEN
 *    ES LA QUE DEBE IR EN ESTE BOTTON CON LO DEMAS DATOS PARA ELEGIR DE
 *    PAGOS Y DEMAS" — la Booking Summary Card (nodo `2342:1441`) que
 *    vivía acá se movió tal cual (misma estructura y clases) a
 *    `ConfirmarPagoSheet.tsx`, como la card de arriba de todo en el
 *    sheet. Ya no vive acá — ver ese archivo.
 */

// 2026-09-05, a pedido de Ana: "PODEMOS PONER DOS FECHAS Y HORAS MAS
// ABAJO EN LA MISMA CARD" — de 2 chips visibles pasa a 4 (2 filas de 2,
// ver el grid más abajo). El resto (acá, las opciones 4 y 5 de las 6
// que genera `generarOpcionesFechaHora`) se sigue viendo completo desde
// "Ver todas" — ver `indiceInicio` en el uso de TodasFechasSheet.
const NUM_CHIPS_VISIBLE = 4;

export default function Compra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const experiencia = getExperienceById(id);
  const [cantidad, setCantidad] = useState(1);
  // 2026-09-05, a pedido de Ana: arranca en `null` (nada preseleccionado)
  // en vez de `0` — ver punto 6 del comentario grande de arriba. El tipo
  // pasa a `number | null` en todo lo que deriva de acá.
  const [fechaHoraIndice, setFechaHoraIndice] = useState<number | null>(null);
  const [sheetTodasFechasAbierto, setSheetTodasFechasAbierto] = useState(false);
  const [mapaAbierto, setMapaAbierto] = useState(false);
  // 2026-09-05, a pedido de Ana: "LA CANTIDAD DE PERSONAS DEBE ESTAR
  // RELACIONADO CON EL MAPA DE BUTACAS, O SEA SUBIR CUANDO SE ELIGEN".
  // Butacas elegidas (claves "fila-numero") — solo se usan para
  // experiencias con `asientoAsignado` (ver `tieneMapaButacas` abajo y
  // experiences.ts). Vive acá y no dentro de MapaButacas.tsx porque de
  // acá sale la cantidad real de personas, que hace falta para
  // precio/resumen — ver `cantidadEfectiva`.
  const [butacasElegidas, setButacasElegidas] = useState<string[]>([]);
  // 2026-09-05, a pedido de Ana: "vamos a confirmar y pago", ajustado
  // después (punto 9 del comentario grande de arriba) a abrirse directo
  // desde "Siguiente" — controla el sheet de pantalla completa
  // `ConfirmarPagoSheet.tsx`. El sheet es quien navega a Confirmacion.tsx
  // al final.
  const [confirmarPagoAbierto, setConfirmarPagoAbierto] = useState(false);

  const opcionesFechaHora = useMemo(
    () => generarOpcionesFechaHora(experiencia?.date ?? ""),
    [experiencia?.date],
  );
  const indiceValido =
    fechaHoraIndice !== null
      ? Math.min(fechaHoraIndice, opcionesFechaHora.length - 1)
      : null;
  // `?? 0` acá es solo para no romper el resumen (paso 2) si por algún
  // motivo se llegara ahí sin selección — en la práctica no pasa, porque
  // "Siguiente" queda deshabilitado mientras `indiceValido` sea `null`.
  const { fecha, hora } = opcionesFechaHora[indiceValido ?? 0] ?? { fecha: "", hora: "" };

  // "En alguno simplemente el mapa de butacas no va a ser clickeable
  // porque no lo necesita" — `asientoAsignado` (experiences.ts) decide
  // si esta experiencia usa el mapa de butacas (cantidad = butacas
  // elegidas) o el stepper manual +/- de siempre (sin mapa). Ver el
  // punto 3 del comentario grande de arriba.
  const tieneMapaButacas = experiencia?.asientoAsignado ?? false;
  const cantidadEfectiva = tieneMapaButacas ? butacasElegidas.length : cantidad;
  const toggleButaca = (clave: string) => {
    setButacasElegidas((prev) =>
      prev.includes(clave) ? prev.filter((k) => k !== clave) : [...prev, clave],
    );
  };

  const gratis = experiencia ? esGratis(experiencia.price) : false;
  const unitario = experiencia ? parsePriceToNumber(experiencia.price) : 0;
  const total = gratis ? 0 : unitario * cantidadEfectiva;
  const totalLabel = gratis
    ? "Gratis"
    : `${experiencia?.mostrarDesde ? "Desde " : ""}${formatCOP(total)}`;

  if (!experiencia) {
    return (
      <div className="min-h-screen bg-thea-green text-white-100 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-body text-sm" style={{ color: "rgba(251,251,251,0.6)" }}>
          No encontramos esta experiencia.
        </p>
        <button
          onClick={() => navigate("/")}
          className="font-body font-semibold text-sm text-thea-mint underline"
        >
          Volver a Descubrir
        </button>
      </div>
    );
  }

  // 2026-09-07 — hubo por un rato un chequeo acá para un estado "sin
  // disponibilidad" (campo `agotada` en experiences.ts). Ana decidió que
  // Theaveling no debe mostrar contenido sin disponibilidad ("esa
  // opcion la podemos quitar") — se revirtió del todo, junto con el
  // campo en experiences.ts y el badge/bloqueo en DetalleExperiencia.tsx.

  return (
    <div className="min-h-screen bg-thea-green text-white-100">
      {/* Header fijo — mismo tratamiento sólido-desde-el-arranque que
          Notificaciones.tsx/Perfil.tsx (sin foto detrás acá, así que no
          hay fundido de scroll como en Detalle). Ya no hay 2 estados acá
          (ver punto 9 del comentario grande de arriba) — el back siempre
          vuelve a la ruta anterior. */}
      <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px+var(--safe-top))] pt-[var(--safe-top)] flex items-center gap-2 px-5 bg-[rgb(1,20,20)] border-b border-white-12">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="h-10 w-10 -ml-2 flex items-center justify-center shrink-0"
        >
          <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
        </button>
        {/* text-xl (no text-2xl como Notificaciones/DatosDeCuenta) — a
            diferencia de esos títulos cortos ("Notificaciones"),
            "Selecciona fecha y hora" no entraba en una sola línea a
            24px sin truncarse feo a mitad de palabra; se mantiene
            `truncate` igual como red de seguridad para pantallas muy
            angostas. */}
        <p className="flex-1 min-w-0 truncate font-display font-semibold text-xl">
          Selecciona fecha y hora
        </p>
      </header>

      <div className="pt-[calc(56px+var(--safe-top))] pb-28 px-5 flex flex-col gap-8">
          {/* BookingSelectorCard — nodo 1861:554. Transparente sobre el
              fondo thea-green de la pantalla — ver punto 8 del
              comentario grande de arriba (experimento a pedido de Ana,
              reversible a la versión blanca original). */}
          <div className="mt-6 bg-white-6 border border-white-12 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {/* "Fecha y hora próximas" — 2026-09-05, a pedido de Ana
                  ("DONDE DICE FECHA Y HORA, PON FECHA Y HORA PROXIMAS"):
                  aclara que los chips (y el sheet de "Ver todas") son
                  FUNCIONES A FUTURO, no la fecha de una reserva ya
                  hecha. */}
              <p className="font-body font-semibold text-sm text-white-100">
                Fecha y hora próximas
              </p>
              {/* Chips reales (ver punto 2 en el comentario de arriba) —
                  mismo trazo del nodo real de Figma (`scrollable-chips`,
                  `1837:551`): el chip seleccionado con stroke mint, el
                  resto sin borde (ver punto 8 de arriba). 4 visibles en
                  vez de 2 — 2026-09-05, a pedido de Ana: "PODEMOS PONER
                  DOS FECHAS Y HORAS MAS ABAJO EN LA MISMA CARD" — un
                  grid de 2 columnas arma las 2 filas de 2 que pidió, en
                  vez del `flex justify-center` de una sola fila que
                  usábamos con 2 chips (ese layout ya no aplica con 4:
                  seguía centrando en una fila, no partía en 2 filas).
                  El resto de opciones (acá, la 5ta y 6ta) se ve completo
                  desde "Ver todas" — ver el link debajo, punto 5 del
                  comentario grande de arriba, y `indiceInicio` en el uso
                  de TodasFechasSheet más abajo.

                  `indicesVisibles` en vez de fijo `[0,1,2,3]`: si la
                  opción elegida desde "Ver todas" es la 5ta o 6ta
                  (ocultas acá por espacio), se reemplaza el último
                  slot visible por esa — así los 4 chips visibles
                  siempre incluyen la selección real, en vez de
                  mostrarla "escondida". Con `indiceValido` en `null`
                  (nada elegido todavía, ver punto 6 de arriba) cae en
                  el `else` y muestra las 4 primeras de entrada, ninguna
                  marcada.

                  `horaCompacta` — 2026-09-05, bug real encontrado
                  probando "Uno a Uno" (único caso con hora no estándar,
                  "14:00–20:00 (sesiones cada 15 min)"): sin recortar,
                  ese chip se estiraba mucho más ancho que el resto y
                  rompía la fila centrada de antes. Con el grid de 2
                  columnas de ahora cada chip ocupa su columna
                  (`w-full`), así que ya no puede romper la fila —
                  igual se deja `horaCompacta` puesta, sigue siendo
                  más prolijo mostrar solo "HH:MM" acá. Ver la nota
                  grande en utils/price.ts. */}
              <div className="grid grid-cols-2 gap-2">
                {(indiceValido !== null && indiceValido >= NUM_CHIPS_VISIBLE
                  ? [0, 1, 2, indiceValido]
                  : [0, 1, 2, 3]
                ).map((i) => {
                  const opcion = opcionesFechaHora[i];
                  // Red de seguridad: si el catálogo cayera en el
                  // fallback de una sola opción (ver
                  // `generarOpcionesFechaHora` en utils/price.ts), no
                  // hay 4 opciones para mostrar — se salta el slot en
                  // vez de romper con `opcion.fecha` de un `undefined`.
                  if (!opcion) return null;
                  const seleccionado = i === indiceValido;
                  return (
                    <button
                      key={`${opcion.fecha}-${opcion.hora}`}
                      onClick={() => setFechaHoraIndice(i)}
                      className={`w-full rounded-xl px-4 py-3 flex flex-col gap-0.5 border-2 ${
                        seleccionado
                          ? "bg-white-12 border-thea-mint"
                          : "bg-white-6 border-transparent"
                      }`}
                    >
                      <span className="font-body font-semibold text-sm whitespace-nowrap text-white-100">
                        {opcion.fecha}
                      </span>
                      {opcion.hora && (
                        <span className="font-body text-xs text-white-60">
                          {horaCompacta(opcion.hora)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* "Ver todas" — 2026-09-04, a pedido de Ana ("ABAJO DE LAS
                  FECHA Y HORA PON UN VER OTRAS SUBRAYADO PARA CLICKEAR",
                  después ajustado a abrir un sheet completo y alinear a
                  la derecha: "EL VER TODAS TIENE QUE ESTAR HACICA LA
                  DERECHA"). `self-end` en vez de `self-center` — ver
                  TodasFechasSheet.tsx para la pantalla que abre. */}
              {opcionesFechaHora.length > NUM_CHIPS_VISIBLE && (
                <button
                  onClick={() => setSheetTodasFechasAbierto(true)}
                  className="self-end font-body text-[13px] text-white-100 underline underline-offset-2 opacity-70"
                >
                  Ver todas
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-body font-semibold text-sm text-white-100">
                Tipo de entrada
              </p>
              <div className="w-full rounded-xl bg-white-12 px-4 py-3.5 flex items-center justify-between">
                <span className="font-body font-semibold text-sm text-white-100">
                  General
                </span>
                <span className="font-body font-semibold text-sm text-white-100">
                  {gratis ? "Gratis" : `${experiencia.mostrarDesde ? "Desde " : ""}${experiencia.price}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-body font-semibold text-sm text-white-100">
                  Entradas
                </p>
                {/* "Ver mapa de butacas" — nodo real `seat-map-link`
                    (1837:578), ver punto 3 del comentario grande de
                    arriba. Solo aparece si `tieneMapaButacas`
                    (`asientoAsignado` en experiences.ts) — 2026-09-05,
                    a pedido de Ana: "EN ALGUNO SIMPLEMENTE EL MAPA DE
                    BUTACAS NO VA A SER CLICKEABLE PORQUE NO LO
                    NECESITA". Donde no aplica, ni el link ni el
                    acordeón se muestran — pasa directo al stepper
                    manual de "Cantidad de personas" de siempre. */}
                {tieneMapaButacas && (
                  <button
                    onClick={() => setMapaAbierto((v) => !v)}
                    className="flex items-center gap-1"
                  >
                    <IconMap className="w-4 h-4 text-white-100 opacity-70" />
                    <span className="font-body text-[13px] text-white-100 underline underline-offset-2 opacity-70">
                      Ver mapa de butacas
                    </span>
                  </button>
                )}
              </div>
              {tieneMapaButacas && mapaAbierto && (
                <MapaButacas
                  experienciaId={experiencia.id}
                  seleccionadas={butacasElegidas}
                  onToggle={toggleButaca}
                />
              )}
              <div className="rounded-xl bg-white-8 border border-white-12 px-4 py-3.5 flex items-center justify-between">
                <span className="font-body text-sm text-white-100">
                  Cantidad de personas
                </span>
                {tieneMapaButacas ? (
                  // Con mapa de butacas, la cantidad la define elegir
                  // butacas arriba (ver `cantidadEfectiva`) — no tiene
                  // sentido un stepper manual aparte que compitiera con
                  // esa selección. Solo lectura acá.
                  <span className="font-body font-semibold text-sm text-white-100 [font-variant-numeric:tabular-nums]">
                    {cantidadEfectiva}
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      disabled={cantidad <= 1}
                      aria-label="Menos personas"
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-white-12 text-white-100 disabled:opacity-30"
                    >
                      <IconMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-body font-semibold text-sm text-white-100 w-4 text-center [font-variant-numeric:tabular-nums]">
                      {cantidad}
                    </span>
                    <button
                      onClick={() => setCantidad((c) => Math.min(6, c + 1))}
                      disabled={cantidad >= 6}
                      aria-label="Más personas"
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-white-12 text-white-100 disabled:opacity-30"
                    >
                      <IconPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 2026-09-04, a pedido de Ana: primero se sacó "Información
              adicional" (título + acordeón de mapa, ver historial arriba
              en el comentario grande del archivo) y a continuación pidió
              sacar "la otra card también" — la Artist/Space Card
              (Compañía Contraluz) que quedaba debajo, confirmado
              explícitamente. Ya no queda nada después del
              BookingSelectorCard en el paso de selección; el componente
              `InfoAccordion` que armaba el acordeón de mapa ya se había
              borrado por quedar sin uso. */}

          <TodasFechasSheet
            open={sheetTodasFechasAbierto}
            experiencia={experiencia}
            opciones={opcionesFechaHora}
            indiceSeleccionado={indiceValido}
            indiceInicio={NUM_CHIPS_VISIBLE}
            onSeleccionar={setFechaHoraIndice}
            onClose={() => setSheetTodasFechasAbierto(false)}
          />
        </div>

      <ConfirmarPagoSheet
        open={confirmarPagoAbierto}
        experiencia={experiencia}
        fecha={fecha}
        hora={hora}
        cantidadEfectiva={cantidadEfectiva}
        gratis={gratis}
        totalLabel={totalLabel}
        onClose={() => setConfirmarPagoAbierto(false)}
        onModificar={() => setConfirmarPagoAbierto(false)}
        onConfirmar={() => navigate(`/experiencia/${id}/confirmacion`)}
      />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-thea-green border-t border-white-12">
        {/* Deshabilitado mientras no haya fecha/hora elegida —
            2026-09-05, a pedido de Ana: "SE ACTIVE EL BOTON DE
            SIGUIENTE (QUE DEBE ESTAR DESACTIVADO SI NO SE HA
            CLICKEADO NADA) POR ESO ESTA PANTALLA". Un botón
            `disabled` no dispara `onClick`, así que no hace falta
            guardia extra adentro del handler. `cantidadEfectiva === 0`
            se suma acá mismo día: en experiencias con mapa de
            butacas, 0 butacas elegidas es un estado sin personas
            real (mismo criterio que "nada elegido" de fecha/hora) —
            en las que no tienen mapa, `cantidadEfectiva` nunca es 0
            (el stepper arranca en 1 y no baja de ahí).

            2026-09-05, punto 9 de arriba: ya no lleva a un paso de
            Resumen propio — abre directo `ConfirmarPagoSheet`, que
            entra deslizándose desde abajo (ver ese archivo). */}
        <button
          onClick={() => setConfirmarPagoAbierto(true)}
          disabled={indiceValido === null || cantidadEfectiva === 0}
          className="w-full h-12 rounded-xl bg-white-100 text-thea-green font-body font-semibold text-[15px] leading-5 tracking-[0.3px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
