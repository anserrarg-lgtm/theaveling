import { IconMapPin, IconSearch } from "../../components/icons";

/*
 * ElegirCiudad — 2026-09-06, "02 — Ciudad" del spec original: se muestra
 * SOLO cuando la geolocalización (GPS o IP, ver Onboarding.tsx) no pudo
 * determinar la ciudad con confianza suficiente — que hoy, al ser Bogotá
 * la única ciudad con catálogo real, se reduce a una pregunta binaria:
 * ¿las coordenadas caen dentro del radio de Bogotá o no? (misma lógica
 * de `ciudadDesde()` en utils/geolocation.ts, no un concepto de
 * "confianza" nuevo o distinto). Si la geo SÍ tiene éxito, esta pantalla
 * ni se monta — Onboarding.tsx va directo a Home.
 *
 * Copy exacto del spec: "¿Dónde quieres descubrir?" / "También puedes
 * cambiar de ciudad en cualquier momento." + 2 opciones: "Usar mi
 * ubicación" (reintenta la detección real) y "Buscar una ciudad" (abre
 * LocationSheet, el mismo buscador que ya existe en Home — no se
 * duplica esa UI).
 *
 * Ambos caminos terminan escribiendo en `CiudadContext`
 * (`setCiudad`/`elegir` de LocationSheet.tsx) — Onboarding.tsx no
 * necesita que esta pantalla le devuelva nada por prop: solo observa
 * `ciudad` del contexto y, en cuanto deja de ser `null`, entiende que el
 * Onboarding terminó (ver ese archivo).
 *
 * 2026-09-07: este archivo se borró y se restauró el mismo día, junto
 * con SolicitarUbicacion.tsx — ver la nota grande de ese archivo para el
 * detalle del cruce de mensajes que lo causó. Acá no había copy que
 * corregir (no menciona "Thea" ni "tu ciudad" en texto visible), así que
 * volvió sin cambios.
 */
export default function ElegirCiudad({
  onUsarMiUbicacion,
  onBuscarCiudad,
  cargando,
}: {
  onUsarMiUbicacion: () => void;
  onBuscarCiudad: () => void;
  cargando: boolean;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-thea-green px-6 text-center">
      <span className="h-14 w-14 rounded-full bg-white-8 flex items-center justify-center">
        <IconMapPin className="w-6 h-6 text-thea-mint" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-white-100">
          ¿Dónde quieres descubrir?
        </h1>
        <p className="font-body text-sm text-white-60 max-w-[280px]">
          También puedes cambiar de ciudad en cualquier momento.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full pt-4">
        <button
          onClick={onUsarMiUbicacion}
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
            "Usar mi ubicación"
          )}
        </button>
        <button
          onClick={onBuscarCiudad}
          disabled={cargando}
          className="w-full h-12 rounded-xl bg-white-8 text-white-100 font-body font-semibold text-[15px] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <IconSearch className="w-4 h-4" />
          Buscar una ciudad
        </button>
      </div>
    </div>
  );
}
