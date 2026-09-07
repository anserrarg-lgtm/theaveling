import { IconMapPin } from "../../components/icons";

/*
 * SolicitarUbicacion — 2026-09-06, paso intermedio del Onboarding entre
 * Bienvenida y Home, a pedido explícito: "mientras Theaveling esté
 * intentando ver la geo SI puede pedir ubicación, se le puede especificar
 * al usuario para qué es". El navegador no deja personalizar el texto de
 * su propio diálogo nativo de permiso — así que esta pantalla ES esa
 * explicación previa (patrón común: "priming" antes del permiso nativo),
 * para que el permiso del navegador no aparezca de la nada sin contexto.
 *
 * 2026-09-07, a pedido de Ana: "podemos hacer que pedir la ubicacion sea
 * como los botton sheet que tenemos cortitos?" — pasa de pantalla
 * completa Thea Green a un bottom sheet, mismo tratamiento visual que
 * LocationSheet.tsx (`bg-thea-deep`, `rounded-t-[28px]`, agarre
 * `bg-white-20`, backdrop `rgba(1,20,20,0.6)`, `sheet-slide-up`) pero SIN
 * forzar una altura como `h-[97vh]` — el contenido acá es corto (ícono +
 * título + 2 líneas + 2 botones), así que el sheet toma su alto natural,
 * "cortito", como pidió.
 *
 * Sin backdrop tocable para cerrar — a diferencia de LocationSheet/
 * LoginSheet (que sí se pueden descartar tocando afuera), acá no hay un
 * estado "sin elegir" válido: el usuario tiene que decidir entre
 * "Permitir ubicación" o "Ahora no", mismo criterio que ElegirCiudad.tsx
 * (tampoco tiene forma de cerrarse sola). El backdrop es solo visual.
 *
 * 2026-09-07 (mismo día, más tarde): este archivo llegó a borrarse por un
 * cruce de mensajes — Ana había pedido comparar con Airbnb/Booking (que
 * no piden ubicación en el onboarding) y, al decir "sigamos con lo de la
 * ubicacion dale", entendí que quería sacar el paso completo. No era eso:
 * quería que seguíamos afinando ESTE paso (el bottom sheet recién hecho
 * arriba), no eliminarlo. Se restauró tal cual estaba, más las
 * correcciones de copy que pidió en el medio de esa confusión: "Thea" →
 * "Theaveling" completo, y "tu ciudad" sacado tanto del título ("Descubre
 * lo que pasa en la ciudad") como del párrafo ("en la ciudad que
 * elijas") — no se sabe la ciudad del usuario todavía en este punto del
 * flujo, así que decir "tu ciudad" no correspondía en ninguno de los 2
 * lugares.
 *
 * "Permitir ubicación" dispara `onPermitir`, que en Onboarding.tsx llama
 * a `determinarUbicacion()` (GPS real primero, con el permiso nativo del
 * navegador — ahí es cuando aparece el diálogo del sistema operativo —
 * y solo si lo rechaza cae a IP). "Ahora no" salta el GPS por completo y
 * va directo a la aproximación por IP (`onOmitir`) — nunca llega a
 * mostrarse el permiso nativo del navegador; es la forma de decir "no
 * quiero que me preguntes" sin tener que rechazar un diálogo del sistema
 * operativo primero.
 */
export default function SolicitarUbicacion({
  cargando,
  onPermitir,
  onOmitir,
}: {
  cargando: boolean;
  onPermitir: () => void;
  onOmitir: () => void;
}) {
  return (
    <div className="fixed inset-0 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
        aria-hidden="true"
      />
      <div className="relative bg-thea-deep rounded-t-[28px] flex flex-col items-center gap-6 px-6 pb-8 text-center sheet-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white-20" />
        </div>

        <span className="h-14 w-14 rounded-full bg-white-8 flex items-center justify-center">
          <IconMapPin className="w-6 h-6 text-thea-mint" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl text-white-100">
            Descubre lo que pasa en la ciudad
          </h1>
          <p className="font-body text-sm text-white-60 max-w-[280px]">
            Theaveling usa tu ubicación para mostrarte experiencias curadas
            en la ciudad que elijas. Puedes cambiarla cuando quieras.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onPermitir}
            disabled={cargando}
            className="w-full h-12 rounded-xl bg-white-100 text-thea-green font-body font-semibold text-[15px] leading-5 tracking-[0.3px] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {cargando ? (
              <span
                className="h-4 w-4 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(17,44,44,0.2)", borderTopColor: "#112C2C" }}
                role="status"
                aria-label="Confirmando ubicación"
              />
            ) : (
              "Permitir ubicación"
            )}
          </button>
          <button
            onClick={onOmitir}
            disabled={cargando}
            className="font-body text-sm text-white-60 underline disabled:opacity-60"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}
