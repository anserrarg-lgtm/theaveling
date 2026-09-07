/*
 * Geolocalización real (opcional) — 2026-09-04, a pedido de Ana: "hay
 * que pedirle la ubicacion, si no la quiere dar... lo puede saltar".
 * No es una pantalla de onboarding nueva (eso sigue pospuesto, ver
 * router.tsx) — es el permiso nativo del navegador
 * (`navigator.geolocation`), que el usuario puede aceptar o rechazar
 * en el momento; rechazarlo YA es "saltarlo", no hace falta un botón
 * de skip aparte.
 *
 * CIUDAD, no barrio — 2026-09-04, corrección de Ana después de ver la
 * primera versión (que calculaba el barrio/zona de Bogotá más
 * cercano): "yo realmente no quiero la zona, thea no es eso, thea
 * actua en la ciudad completa y ya, lo curado es asi, lo de nicho es
 * asi, lo mas probable es que no aparezca nada por tu zona, vas a
 * tener que desplazarte. lo que si es que te va a pedir ubicacion para
 * saber en que ciudad estar basicamente". Es un producto de curaduría
 * de nicho, no de cercanía tipo delivery — filtrar por barrio esconde
 * justo lo que vale la pena ver, que puede quedar al otro lado de la
 * ciudad. Entonces la geolocalización real solo sirve para UNA cosa:
 * confirmar en qué ciudad está el usuario (hoy, si es Bogotá o no),
 * nunca para acercarlo a un barrio específico. El barrio (`venueBarrio`
 * en experiences.ts) sigue existiendo, pero solo como dato descriptivo
 * de cada experiencia ("cómo llegar"), nunca como filtro de entrada.
 */

/*
 * Bogotá es la única ciudad con catálogo real hoy. En vez de un
 * geocoder pago (que no tenemos, mismo motivo que en el resto de la
 * app), se aproxima "¿estás en Bogotá?" con un radio generoso
 * alrededor del centro de la ciudad — cubre el área metropolitana
 * sin pretender precisión de barrio.
 */
const BOGOTA_CENTRO = { lat: 4.711, lon: -74.0721 };
const BOGOTA_RADIO_KM = 40;

function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/*
 * Devuelve "Bogotá" si las coordenadas caen dentro del radio de
 * cobertura, o null si el usuario está en otra parte del mundo — ahí
 * no hay catálogo real, así que no se inventa una ciudad.
 */
export function ciudadDesde(lat: number, lon: number): string | null {
  const distancia = haversineKm({ lat, lon }, BOGOTA_CENTRO);
  return distancia <= BOGOTA_RADIO_KM ? "Bogotá" : null;
}

/*
 * Región aproximada — 2026-09-04, a pedido de Ana: quiere sugerir
 * ciudades distintas según de dónde sea el usuario ("si esta por
 * latinoamerica... argentina, chile, brazil, uruguay... si esta en
 * europa... roma, madrid, londres, paris, praga"). No hay geocoder
 * real (mismo motivo que arriba), así que en vez de país exacto se usa
 * un cajón de lat/long MUY aproximado por continente — alcanza para
 * distinguir "Latinoamérica" de "Europa", no para más que eso. Fuera
 * de esas dos cajas, no se sugiere nada — Ana fue explícita en que
 * Theaveling no opera en todos lados ("no en todo lado hay bueno
 * cultura o nicho"), así que no inventamos sugerencias para regiones
 * que no hemos definido.
 */
export type Region = "latam" | "europa";

const REGIONES: Record<Region, { latMin: number; latMax: number; lonMin: number; lonMax: number }> = {
  latam: { latMin: -56, latMax: 33, lonMin: -118, lonMax: -34 },
  europa: { latMin: 34, latMax: 72, lonMin: -25, lonMax: 45 },
};

export function regionDesde(lat: number, lon: number): Region | null {
  for (const region of Object.keys(REGIONES) as Region[]) {
    const caja = REGIONES[region];
    if (lat >= caja.latMin && lat <= caja.latMax && lon >= caja.lonMin && lon <= caja.lonMax) {
      return region;
    }
  }
  return null;
}

export type SolicitarUbicacionResultado =
  | { status: "ok"; ciudad: string; region: Region | null; origen?: "gps" | "ip" }
  | { status: "fuera-de-cobertura"; region: Region | null; origen?: "gps" | "ip" }
  | { status: "denied" }
  | { status: "unsupported" };

/*
 * Envuelve la API nativa en una promesa. `timeout` corto (8s) porque
 * en desktop sin GPS real esto puede tardar mucho o nunca resolver —
 * mejor caer a "denied" (mismo tratamiento que un rechazo real) que
 * dejar el botón cargando para siempre.
 */
export function solicitarUbicacion(): Promise<SolicitarUbicacionResultado> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ status: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const ciudad = ciudadDesde(latitude, longitude);
        const region = regionDesde(latitude, longitude);
        if (ciudad) {
          resolve({ status: "ok", ciudad, region, origen: "gps" });
        } else {
          // Coordenadas válidas, pero fuera del radio de Bogotá — no es
          // lo mismo que "no dio permiso", así que se distingue: acá sí
          // sabemos dónde está, simplemente no operamos ahí todavía.
          resolve({ status: "fuera-de-cobertura", region, origen: "gps" });
        }
      },
      () => resolve({ status: "denied" }),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

/*
 * Fallback de geolocalización por IP — 2026-09-06, a pedido del usuario:
 * cuando el permiso nativo falla o no está disponible (GPS denegado,
 * navegador sin soporte), aproximamos la ubicación del usuario sin
 * pedir más permisos, usando su dirección IP. Mismo criterio que Airbnb
 * — nunca mostrar datos aproximados como si fueran exactos.
 *
 * Diferencia importante: GPS es mucho más preciso; IP es una
 * aproximación gruesa (a veces errónea por km o incluso más). Por eso
 * marcamos origen: "ip" en el resultado — para avisar en la UI que es
 * una aproximación, no una posición real ("Bogotá, Colombia
 * (aproximada)", etc.). Si falla la llamada a la API, se devuelve
 * { status: "denied" } — mismo tratamiento que GPS denegado, no se
 * inventa un estado nuevo sin necesidad.
 *
 * API elegida: ipwho.is (gratuita, sin API key, sin CORS bloqueante,
 * responde de verdad en browser desde cualquier lado). Alternativas
 * probadas: ipapi.co (también funciona), geojs.io.
 *
 * CONSIDERACIÓN LEGAL/PRIVACIDAD — 2026-09-06:
 * La dirección IP del usuario se envía a un servicio externo (ipwho.is)
 * para aproximar su ciudad. Ese tercero recibe y procesa esa IP según
 * sus propios términos de servicio. La IP se considera un dato personal
 * bajo GDPR (regulación europea), así que si Theaveling fuera un producto
 * real con usuarios reales, esto debería mencionarse explícitamente en
 * una política de privacidad — no requiere un banner/popup invasivo de
 * cookies, pero sí transparencia sobre "qué dato se recoge, a quién se
 * envía, para qué se usa".
 *
 * Hoy (2026-09-06), Theaveling es un prototipo de portafolio sin backend
 * ni datos de usuarios reales, así que no hay exposición legal real. Este
 * comentario queda como documentación honesta para si/cuando esto se
 * convierte en producto real — mismo criterio que el resto de las notas
 * del archivo (explicar motivos, no ocultar limitaciones).
 */
export async function obtenerUbicacionPorIP(): Promise<SolicitarUbicacionResultado> {
  try {
    /* Timeout de 5s con AbortController — más corto que GPS porque IP
       es más rápido, así que si no responde en 5s probablemente no
       responde. */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://ipwho.is/", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { status: "denied" };
    }

    const data = (await response.json()) as {
      success?: boolean;
      latitude?: number;
      longitude?: number;
    };

    /* Validación defensiva — si no hay coordenadas, devolver "denied".
       La API puede responder pero con success: false (p.ej., en
       entornos sin IP válida, proxies raros, etc.). */
    if (!data.success || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      return { status: "denied" };
    }

    const ciudad = ciudadDesde(data.latitude, data.longitude);
    const region = regionDesde(data.latitude, data.longitude);

    if (ciudad) {
      return { status: "ok", ciudad, region, origen: "ip" };
    } else {
      return { status: "fuera-de-cobertura", region, origen: "ip" };
    }
  } catch {
    /* Cualquier error (timeout, JSON inválido, etc.) cae acá — devolver
       "denied" y dejar que la UI lo trate como "sin-permiso", igual que
       GPS. */
    return { status: "denied" };
  }
}

/*
 * Orquestador — 2026-09-06, parte del Onboarding: intenta GPS primero
 * (más preciso) y, solo si el navegador lo rechaza o no lo soporta, cae
 * a la aproximación por IP. Antes esta secuencia de 2 intentos vivía
 * duplicada dentro de `usarMiUbicacion` en LocationSheet.tsx — se saca
 * a una función propia para que Onboarding.tsx pueda usar exactamente
 * la misma lógica (sin repetirla) al determinar la ciudad por primera
 * vez, antes de que exista ningún sheet abierto.
 */
export async function determinarUbicacion(): Promise<SolicitarUbicacionResultado> {
  const resultado = await solicitarUbicacion();
  if (resultado.status === "denied" || resultado.status === "unsupported") {
    return obtenerUbicacionPorIP();
  }
  return resultado;
}
