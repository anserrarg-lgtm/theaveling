import { useEffect, useState } from "react";
import Bienvenida from "./Bienvenida";
import SolicitarUbicacion from "./SolicitarUbicacion";
import ElegirCiudad from "./ElegirCiudad";
import LocationSheet from "../../components/LocationSheet";
import { useCiudad } from "../../context/CiudadContext";
import {
  determinarUbicacion,
  obtenerUbicacionPorIP,
  type SolicitarUbicacionResultado,
} from "../../utils/geolocation";

/*
 * Onboarding — 2026-09-06, orquestador de los pasos acordados:
 * Bienvenida → (intento de geolocalización) → Home, con ElegirCiudad
 * como pantalla de emergencia SOLO si la geo no resuelve nada usable.
 * Vive como estado local (no como rutas propias de react-router) a
 * propósito: es un flujo lineal, de una sola vez, sin necesidad de que
 * el usuario pueda "volver atrás" con el botón del navegador a la mitad
 * — mismo criterio que ya usa el resto de la app para overlays de un
 * solo paso (LocationSheet, ConfirmarPagoSheet: state booleano, no
 * ruta).
 *
 * 2026-09-07: había un paso "splash" propio (Splash.tsx) antes de
 * Bienvenida — a pedido de Ana ("quiero que theaveling se vaya hacia
 * arriba y sobre la misma foto aparezca el texto de descubre la
 * escena...") esas 2 pantallas se fusionaron en una sola escena continua
 * (ver la nota grande en Bienvenida.tsx) — Splash.tsx ya no existe, el
 * flujo arranca directo en "bienvenida".
 *
 * 2026-09-07 (mismo día, más tarde): CRUCE DE MENSAJES a documentar para
 * no repetirlo. Ana señaló que ni Airbnb ni Booking piden ubicación en
 * el onboarding, y propuse sacar este paso completo. Cuando contestó
 * "sigamos con lo de la ubicacion dale", lo entendí como "sácalo" y
 * borré este archivo (dejando Onboarding = solo Bienvenida) además de
 * SolicitarUbicacion.tsx y ElegirCiudad.tsx. Ana en realidad se refería
 * a seguir afinando ESTE paso (el bottom sheet que le acababa de pedir a
 * SolicitarUbicacion), no a eliminarlo — quedó claro cuando preguntó
 * "que hiciste no entendi... te dije que continuaramos con eso". Se
 * restauró todo el flujo de 3 pasos tal como estaba antes del borrón,
 * con SolicitarUbicacion ya en su versión bottom sheet + copy corregido
 * ("Theaveling" completo, "en la ciudad que elijas" en vez de "tu
 * ciudad" — ver la nota grande de ese archivo).
 *
 * "La lógica completa" del spec original:
 *   ¿Qué es Theaveling? → Theaveling intenta saber dónde estás → si no
 *   puede, te pregunta → Descubres.
 * Traducido a este archivo: Bienvenida = "¿qué es Theaveling?"; el paso
 * "solicitar-ubicacion" = "Theaveling intenta saber dónde estás" (primero
 * GPS con explicación propia, después IP si lo rechaza — ver
 * SolicitarUbicacion.tsx); "eligiendo-ciudad" = "si no puede, te
 * pregunta" (ElegirCiudad.tsx); terminar (llamar `onFinish`) = "Descubres".
 *
 * Termina cuando `CiudadContext` tiene una ciudad — no hace falta que
 * este componente le pase nada a `onFinish` por parámetro, ni que rastree
 * por separado "¿ya se resolvió?": un solo `useEffect` observa `ciudad`
 * del contexto y dispara `onFinish` en cuanto deja de ser `null`, sin
 * importar CUÁL de los 3 caminos la puso ahí (GPS directo, IP, o
 * selección manual en ElegirCiudad → LocationSheet). Eso evita repetir
 * "terminar el onboarding" en cada rama de resultado posible.
 *
 * Login queda completamente afuera de este archivo — a propósito, ver
 * AuthContext.tsx: "el login aparece cuando realmente aporta valor",
 * nunca como parte del onboarding.
 */
type Paso = "bienvenida" | "solicitar-ubicacion" | "eligiendo-ciudad";

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [paso, setPaso] = useState<Paso>("bienvenida");
  const [cargando, setCargando] = useState(false);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const { ciudad, setCiudad, setRegion } = useCiudad();

  // Termina el onboarding en cuanto haya una ciudad, sin importar el
  // camino que la puso ahí (ver nota grande de arriba). Deliberadamente
  // sin `onFinish` en las dependencias: solo nos interesa reaccionar a
  // que `ciudad` deje de ser null, no a que `onFinish` cambie de
  // identidad entre renders del padre.
  useEffect(() => {
    if (ciudad) {
      onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ciudad]);

  async function manejarResultado(resultado: SolicitarUbicacionResultado) {
    if (resultado.status === "ok") {
      setRegion(resultado.region);
      setCiudad(resultado.ciudad, resultado.origen ?? "gps");
      // El useEffect de arriba toma el control desde acá.
    } else if (resultado.status === "fuera-de-cobertura") {
      setRegion(resultado.region);
      setCargando(false);
      setPaso("eligiendo-ciudad");
    } else {
      setCargando(false);
      setPaso("eligiendo-ciudad");
    }
  }

  async function intentarConGPS() {
    setCargando(true);
    const resultado = await determinarUbicacion();
    await manejarResultado(resultado);
  }

  async function intentarSoloIP() {
    setCargando(true);
    const resultado = await obtenerUbicacionPorIP();
    await manejarResultado(resultado);
  }

  if (paso === "bienvenida") {
    return <Bienvenida onContinuar={() => setPaso("solicitar-ubicacion")} />;
  }

  if (paso === "solicitar-ubicacion") {
    return (
      <SolicitarUbicacion
        cargando={cargando}
        onPermitir={intentarConGPS}
        onOmitir={intentarSoloIP}
      />
    );
  }

  // paso === "eligiendo-ciudad"
  return (
    <>
      <ElegirCiudad
        cargando={cargando}
        onUsarMiUbicacion={intentarConGPS}
        onBuscarCiudad={() => setLocationSheetOpen(true)}
      />
      <LocationSheet
        open={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
      />
    </>
  );
}
