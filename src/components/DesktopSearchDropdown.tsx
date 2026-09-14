import { useState } from "react";
import { Link } from "react-router-dom";
import DesktopLocationDropdown from "./DesktopLocationDropdown";
import ImagePlaceholder from "./ImagePlaceholder";
import { useCiudad } from "../context/CiudadContext";
import { IconCaretRight, IconMapPin, IconSearch } from "./icons";
import { experiences, getExperienceById, type Experience } from "../data/experiences";

/*
 * DesktopSearchDropdown — 2026-09-11, a pedido de Ana: la primera versión
 * de Búsqueda en Desktop se armó como una pantalla propia (`/busqueda`
 * con `hidden lg:block`, mismo patrón que Descubrir.tsx). Ana la rechazó
 * de raíz: "no pero no puede ser una pantalla aparte, tiene que ser una
 * extencion" — en Desktop, tocar la lupa de `DesktopNavbar.tsx` NO debe
 * navegar a ningún lado, tiene que abrir un panel flotante ahí mismo (el
 * nodo real de Figma que ya se había traído para esto:
 * `Bas9SSdMLitN1S37kjFeOy`, `2034:754`, "Desktop — Búsqueda con dropdown
 * — Fondo verde" — un panel de ~360-400px anclado debajo del buscador de
 * la navbar), sin salir de la pantalla en la que ya se está.
 *
 * Por qué un componente/lógica APARTE en vez de reusar Busqueda.tsx
 * (mobile) — Ana fue explícita: "no se te ocurra mover allgo de mobile si
 * no es que yo te lo digo". Aunque el comportamiento de fondo es case
 * idéntico (mismos 4 estados de resultados: Tendencias / ciudad no real /
 * Resultados / sin resultados — ver Busqueda.tsx para el detalle
 * completo de esa lógica, con la cita textual de Ana sobre cada caso),
 * este componente tiene su PROPIA copia de esas funciones puras
 * (`normalizar`/`coincideConBusqueda`/`formatearFecha`/etc.) en vez de
 * importarlas de Busqueda.tsx — así el archivo de mobile queda
 * completamente intacto, sin ningún cambio ni de imports ni de exports,
 * y este panel de Desktop puede evolucionar sin ningún riesgo de romper
 * mobile (mismo criterio ya usado en el proyecto para separar cards
 * mobile/Desktop en vez de meter un flag de variante — ver la nota
 * grande de ExperienceCardCuradoGridDesktop.tsx).
 *
 * Disparador — vive en `DesktopNavbar.tsx`: ese componente ahora guarda
 * un estado local `searchOpen` y monta este panel condicionalmente,
 * posicionado `absolute` relativo al botón de lupa (que dejó de ser un
 * `<Link to="/busqueda">` y pasó a ser un botón que togglea ese estado).
 *
 * Cerrar — un fondo invisible de pantalla completa (`fixed inset-0`,
 * SIN oscurecer nada — a diferencia de LocationSheet/FechaSheet, que sí
 * son bottom sheets con backdrop oscuro; este es un dropdown liviano,
 * como cualquier menú de navbar) cierra el panel al tocar afuera. Elegir
 * una experiencia (Link a `/experiencia/:id`) también lo cierra, para
 * que no quede abierto de fondo si el usuario vuelve para atrás.
 *
 * Animación de entrada — 2026-09-11, a pedido de Ana: "para busqueda
 * desde la derecha" — clase `desktop-panel-slide-right` (ver index.css),
 * este panel vive del lado derecho de la navbar (mismo criterio que
 * `desktop-panel-slide-left` en `DesktopLocationDropdown.tsx`, que vive
 * del lado izquierdo).
 *
 * Sin borde — 2026-09-11, a pedido de Ana ("no quiero stroke... ni en
 * busqueda"): se saca el `border border-white-12` del panel principal
 * (queda solo `shadow-2xl` separándolo del fondo).
 * 2026-09-11 (segunda vuelta) — Ana señaló que todavía quedaba stroke
 * ("hay stroke en búsqueda"): faltaban los 3 bloques de adentro
 * (Tendencias / Resultados / sin-resultados), que tenían su propio
 * `border border-white-12`. Se saca también ahí, quedan separados del
 * fondo solo por `bg-white-6` + `shadow-2xl`, mismo criterio que el
 * panel principal.
 *
 * Ubicación — 2026-09-11 (segunda vuelta): esta fila abría
 * `LocationSheet` TAL CUAL (el bottom sheet de mobile). Ana señaló el
 * mismo problema de siempre ("la ubicacion no es clickeable y vamos con
 * esa extension") — pasa a abrir `DesktopLocationDropdown`, el mismo
 * panel flotante que ahora también dispara el ícono de ubicación de la
 * navbar (ver DesktopNavbar.tsx), anclado debajo de esta fila.
 *
 * Fecha — 2026-09-11: se había armado un `DesktopFechaDropdown` (mismo
 * criterio que Ubicación, calendario de mobile como panel flotante) y
 * quedaba anclado debajo de una fila "Por fecha" acá al lado de
 * Ubicación. Ana pidió sacarlo de Desktop del todo ("quitemos la opccion
 * de por fecha de desktop") — se elimina la fila, el filtro por fecha de
 * `coincideConBusqueda` (que vuelve a comparar solo texto) y el
 * componente `DesktopFechaDropdown.tsx` (borrado, sin uso en ningún
 * lado). Mobile no se toca — `FechaSheet.tsx`/`Busqueda.tsx` siguen
 * exactamente igual, esto es solo para Desktop.
 */

/** Sin distinguir mayúsculas ni tildes — mismo criterio que la búsqueda
 * de mobile (ver Busqueda.tsx). */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Solo texto — a diferencia de la mobile (`coincideConBusqueda` en
 * Busqueda.tsx), acá ya no hay filtro por fecha (ver nota grande arriba,
 * "Fecha" — sacado de Desktop a pedido de Ana). */
function coincideConBusqueda(exp: Experience, queryNormalizada: string): boolean {
  if (!queryNormalizada) return true;
  const haystack = normalizar(`${exp.title} ${exp.tag} ${exp.category} ${exp.venue}`);
  return haystack.includes(queryNormalizada);
}

// Misma selección que TENDENCIAS_IDS en Busqueda.tsx (mismo criterio
// editorial, ver esa nota grande) — duplicada acá a propósito, ver nota
// grande del archivo sobre por qué no se importa nada de mobile.
const TENDENCIAS_IDS = [
  "cuerpos-en-transito",
  "fronteras-difusas",
  "antigona-ahora",
  "trance-ritual-sonoro",
  "noche-de-cortos-ciudad-invisible",
] as const;

function FilaExperiencia({
  exp,
  subtitulo,
  onNavegar,
}: {
  exp: Experience;
  subtitulo?: string;
  onNavegar: () => void;
}) {
  return (
    <Link
      to={`/experiencia/${exp.id}`}
      onClick={onNavegar}
      className="flex items-center gap-4 py-4 border-b border-white-8 last:border-b-0"
    >
      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-white-8 shrink-0">
        {exp.imageUrl ? (
          <img src={exp.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <span className="font-body text-sm text-white-100 truncate">{exp.title}</span>
        {subtitulo && (
          <span className="font-body text-[13px] text-white-60 truncate">{subtitulo}</span>
        )}
      </div>
      <IconCaretRight className="w-4 h-4 text-white-40 shrink-0" />
    </Link>
  );
}

export default function DesktopSearchDropdown({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [ubicacionAbierta, setUbicacionAbierta] = useState(false);
  const { ciudad: ciudadCompartida } = useCiudad();
  const ciudad = ciudadCompartida ?? "Bogotá";

  const tendencias = TENDENCIAS_IDS.map((id) => getExperienceById(id)).filter(
    (exp): exp is NonNullable<typeof exp> => exp !== undefined,
  );

  const ciudadEsReal = ciudad === "Bogotá";
  const hayBusquedaActiva = query.trim() !== "";
  const queryNormalizada = normalizar(query);
  const resultados =
    hayBusquedaActiva && ciudadEsReal
      ? experiences.filter((exp) => coincideConBusqueda(exp, queryNormalizada))
      : [];

  return (
    <>
      {/* Fondo invisible — cierra al tocar afuera, sin oscurecer la
          pantalla (esto es un dropdown, no un bottom sheet). `<button>`
          en vez de `<div>`, mismo patrón que el backdrop de
          LocationSheet/FechaSheet (accesible + cursor de mano real). */}
      <button
        aria-label="Cerrar búsqueda"
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      <div className="desktop-panel-slide-right absolute right-0 top-[calc(100%+12px)] z-50 flex w-[400px] flex-col gap-3 rounded-2xl bg-thea-green p-4 shadow-2xl">
        <label className="flex h-11 items-center gap-2.5 rounded-xl bg-white-8 px-4">
          <IconSearch className="w-4 h-4 text-white-100 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar experiencia..."
            className="flex-1 bg-transparent font-body text-sm text-white-100 placeholder:text-white-40 outline-none min-w-0"
          />
        </label>

        <div className="rounded-xl bg-white-6 px-4 py-1">
          <div className="relative">
            <button
              onClick={() => setUbicacionAbierta((v) => !v)}
              className="flex items-center gap-2 py-3 w-full text-left"
            >
              <IconMapPin className="w-4 h-4 text-white-100 shrink-0" />
              <span className="font-body text-sm text-white-100 underline underline-offset-2">
                Ubicación — {ciudad}
              </span>
            </button>
            {ubicacionAbierta && (
              <DesktopLocationDropdown onClose={() => setUbicacionAbierta(false)} />
            )}
          </div>
        </div>

        {!hayBusquedaActiva ? (
          <div className="flex max-h-[420px] flex-col overflow-y-auto rounded-2xl bg-white-6 p-4 shadow-2xl">
            <h2 className="font-body font-semibold text-sm text-white-100">TENDENCIAS</h2>
            {tendencias.map((exp) => (
              <FilaExperiencia key={exp.id} exp={exp} onNavegar={onClose} />
            ))}
          </div>
        ) : !ciudadEsReal ? (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white-6 p-4 py-10 text-center">
            <span className="h-11 w-11 rounded-full bg-white-8 flex items-center justify-center">
              <IconMapPin className="w-5 h-5 text-white-40" />
            </span>
            <p className="font-body font-semibold text-sm text-white-100">
              Todavía no estamos en {ciudad}
            </p>
            <p className="font-body text-[13px] text-white-40 max-w-[260px]">
              Theaveling por ahora solo opera en Bogotá — vamos sumando ciudades de a poco.
            </p>
          </div>
        ) : resultados.length > 0 ? (
          <div className="flex max-h-[420px] flex-col overflow-y-auto rounded-2xl bg-white-6 p-4 shadow-2xl">
            <h2 className="font-body font-semibold text-sm text-white-100">
              RESULTADOS ({resultados.length})
            </h2>
            {resultados.map((exp) => (
              <FilaExperiencia
                key={exp.id}
                exp={exp}
                subtitulo={`${exp.category} · ${exp.venue}`}
                onNavegar={onClose}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white-6 p-4 py-10 text-center">
              <span className="h-11 w-11 rounded-full bg-white-8 flex items-center justify-center">
                <IconSearch className="w-5 h-5 text-white-40" />
              </span>
              <p className="font-body font-semibold text-sm text-white-100">
                No hay resultados para tu búsqueda
              </p>
              <p className="font-body text-[13px] text-white-40 max-w-[260px]">
                Pero tenemos estas experiencias que podrían interesarte.
              </p>
            </div>
            <div className="flex max-h-[340px] flex-col overflow-y-auto rounded-2xl bg-white-6 p-4 shadow-2xl">
              {tendencias.map((exp) => (
                <FilaExperiencia key={exp.id} exp={exp} onNavegar={onClose} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
