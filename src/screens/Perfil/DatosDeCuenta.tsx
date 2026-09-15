import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCaretRight,
  IconMail,
  IconUser,
  IconBell,
  IconMessageCircle,
} from "../../components/icons";
import DesktopNavbar from "../../components/DesktopNavbar";
import DesktopFooter from "../../components/DesktopFooter";
import Switch from "../../components/Switch";
import { useAuth } from "../../context/AuthContext";
import { useDescubrirTab } from "../../context/DescubrirTabContext";

/*
 * Datos de cuenta — nodo real de Figma `datos-de-cuenta-screen` (2051:770),
 * traído vía get_design_context 2026-09-03. Mismo motivo que
 * Notificaciones.tsx: pantalla que ya existía diseñada en Figma, enlazada
 * desde la fila "Datos de cuenta" de Preferencias en Perfil, pero nunca se
 * había construido en código.
 *
 * Fondo verde (thea-green), no el blanco del mockup de Figma — mismo pedido
 * explícito de Ana para toda esta sección de Perfil (ver nota en
 * Perfil.tsx). Los 3 campos usaban `rgba(17,44,44,0.08)` como fondo en el
 * mockup claro de Figma — acá pasan a `bg-white-8`, el equivalente ya
 * establecido en el proyecto para "superficie sutil" sobre thea-green
 * (mismo token que usa el placeholder de imagen en las Experience Cards).
 *
 * Valores de los 3 campos — mock, sin cuenta real todavía (mismo criterio
 * que "Elena Voss" en Perfil.tsx). OJO: el nodo de Figma trae el campo
 * "Nombre" con el valor literal "Ana" — coincide con el nombre real de la
 * usuaria, a diferencia del resto de los mocks del proyecto ("Elena Voss",
 * "elena.voss@email.com"). Se deja tal cual viene en el diseño.
 *
 * "Cerrar sesión" / "Eliminar cuenta" — Figma los mockea como texto plano
 * (sin botón/chip), thea-green y thea-red respectivamente sobre el fondo
 * claro. Acá "Cerrar sesión" pasa a white-100 (mismo criterio de contraste
 * que el resto de la pantalla).
 *
 * "Eliminar cuenta" — 2026-09-03, resuelto: se había implementado primero
 * en thea-red tal cual Figma, pero eso chocaba con STACK.md (thea-red
 * exclusivo del wordmark + corazón de favorito, ver FavoritoButton.tsx) —
 * señalado a Ana. A pedido suyo ("ponlo en el naranja de semánticos") pasa
 * a `text-warning` (`--color-warning`, #F5A623, ver index.css) — primer
 * color semántico del proyecto con valor hex definido (no existía en
 * Figma, confirmado con search_design_system sin resultados; Ana lo eligió
 * directamente acá). Encaja además con el criterio de STACK.md "05 —
 * Semantic": una acción destructiva es un caso de Warning/Error, no de
 * identidad de marca — separar ese acento de thea-red es justo lo que la
 * sección ya pedía.
 *
 * "Cerrar sesión"/"Eliminar cuenta" centrados — 2026-09-03, a pedido de
 * Ana ("y esos dos con cerrar sesion deben ir centrados"). Figma los
 * traía alineados a la izquierda (mismo margen que los campos de arriba);
 * acá pasan a centrados horizontalmente, apilados.
 *
 * Ninguno de los 3 campos ni "Eliminar cuenta" tiene funcionalidad real
 * todavía (no hay backend de cuenta) — son solo la UI del diseño.
 *
 * "Cerrar sesión" — 2026-09-06, único de los 2 botones que SÍ quedó
 * funcional: ahora existe una auth real (aunque falsa, ver
 * AuthContext.tsx) que puede cerrarse de verdad. Llama a `logout()` y
 * vuelve a Perfil, que al perder la sesión muestra su propio estado de
 * "inicia sesión" (ver nota grande en Perfil.tsx). "Correo" ahora
 * también refleja el correo real de la sesión en vez del mock fijo
 * "ana@ejemplo.com" — Nombre/Teléfono siguen siendo decorativos, el
 * login falso no recolecta esos datos.
 *
 * Desktop — 2026-09-14, a pedido de Ana: mandó 3 capturas de referencia
 * real (Fever, "feverup.com/.../account") de cómo debe verse esta
 * pantalla en Desktop — un layout de cuenta con menú lateral de pestañas
 * ("Detalles de la cuenta" / "Información del perfil" / "Preferencias de
 * comunicación" / "Mis pedidos" / "Mis entradas"), no la columna apilada
 * de mobile. Ana ya había aclarado antes ("sin mis entradas y mis
 * pedidos") que esas 2 últimas pestañas puntuales no hacen falta acá —
 * Theaveling ya resuelve ese contenido en "Mis reservas" — así que el
 * menú de Desktop queda con las primeras 3 nada más.
 *
 * Contenido por pestaña — mapeado a lo que Theaveling REALMENTE tiene,
 * nada inventado:
 * - "Detalles de la cuenta": el correo real de la sesión (`useAuth().
 *   email`), sin "Métodos de pago" (la referencia sí lo trae, pero
 *   Theaveling no tiene ningún sistema de pago real — Confirmar y pagar
 *   es un mock sin captura de tarjeta, así que esa sección se cae en vez
 *   de inventar una lista de tarjetas guardadas). Acá también viven
 *   "Cerrar sesión"/"Eliminar cuenta" (mismas acciones de mobile, ver
 *   notas de arriba) — Ana pidió explícitamente que "Eliminar cuenta"
 *   esté presente en esta versión también.
 * - "Información del perfil": Nombre + Teléfono (los mismos 2 campos
 *   mock que ya tenía mobile, ver `CAMPOS` abajo) más Cumpleaños/Lugar de
 *   nacimiento — 2 campos NUEVOS que la referencia trae. Se muestran
 *   vacíos ("----", igual que la propia captura de referencia que Ana
 *   mandó — ni siquiera su cuenta real de Fever los tiene cargados), sin
 *   inventar una fecha/lugar que Theaveling no recolecta.
 * - "Preferencias de comunicación": un toggle nuevo ("Quiero recibir
 *   cupones de descuento, ofertas exclusivas y las últimas noticias") —
 *   DISTINTO del toggle de "Recordatorios de reserva" que ya vive en
 *   `NotificacionesSheet.tsx` (ese es sobre la reserva en sí; este es
 *   marketing/promociones). Mismo criterio que el resto de toggles del
 *   proyecto: estado local en memoria, sin backend real de preferencias
 *   todavía.
 *
 * Menú lateral — mismo `bg-white-8` para la pestaña activa que ya usa
 * `IdiomaMonedaModal.tsx` para la tarjeta de idioma/moneda seleccionada,
 * no un patrón nuevo.
 *
 * Pestaña "Notificaciones" — 2026-09-14 (octava vuelta), a pedido de Ana:
 * después de corregir `/perfil/notificaciones` para que muestre el
 * estado vacío real (ver esa nota en Notificaciones.tsx — ahí NO hay
 * backend de notificaciones, así que un estado vacío es más honesto que
 * toggles que no hacen nada), Ana pidió mover ESE contenido de toggles
 * (Recordatorios de reserva/Novedades/Promociones) para acá, como una
 * pestaña nueva de Datos de cuenta. Mismo contenido EXACTO que tenía
 * antes `Notificaciones.tsx` (y que sigue teniendo `NotificacionesSheet.tsx`
 * en mobile) — no se inventa nada nuevo, solo cambia dónde vive en
 * Desktop. `IconBell` se reasigna acá (semánticamente es el ícono de
 * notificaciones); "Preferencias de comunicación" pasa a usar
 * `IconMessageCircle` para no repetir ícono entre las 2 pestañas.
 *
 * Sin versión mobile nueva — el bloque de mobile de abajo es EXACTAMENTE
 * el que ya existía (solo se envolvió en `lg:hidden`), ni una clase se
 * tocó.
 */
const CAMPOS = [
  { label: "Nombre", value: "Ana" },
  { label: "Teléfono", value: "+57 300 000 0000" },
] as const;

// Mismo contenido que ya vivía en Notificaciones.tsx/NotificacionesSheet.tsx
// — ver la nota grande de arriba sobre por qué se mudó acá.
const NOTIFICACIONES = [
  { key: "recordatorios", label: "Recordatorios de reserva", defaultOn: true },
  { key: "novedades", label: "Novedades", defaultOn: true },
  { key: "promociones", label: "Promociones", defaultOn: true },
] as const;

type TabDesktop = "cuenta" | "perfil" | "comunicacion" | "notificaciones";

export default function DatosDeCuenta() {
  const navigate = useNavigate();
  const { email, logout } = useAuth();
  const { activeCategory, setActiveCategory } = useDescubrirTab();
  const [tabDesktop, setTabDesktop] = useState<TabDesktop>("cuenta");
  const [recibirPromos, setRecibirPromos] = useState(true);
  const [estadoNotificaciones, setEstadoNotificaciones] = useState<
    Record<string, boolean>
  >(Object.fromEntries(NOTIFICACIONES.map((n) => [n.key, n.defaultOn])));

  return (
    <>
      {/* Mobile — sin cambios, ver nota grande arriba. `lg:hidden` para
          convivir con el bloque Desktop de abajo (mismo criterio que el
          resto de la app). */}
      <div className="min-h-screen bg-thea-green text-white-100 lg:hidden">
        <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px_+_var(--safe-top))] pt-[var(--safe-top)] flex items-center gap-3 px-5 bg-[rgb(1,20,20)] border-b border-white-12">
          <button onClick={() => navigate(-1)} aria-label="Volver" className="p-1 -m-1">
            <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
          </button>
          <h1 className="font-display font-semibold text-2xl">Datos de cuenta</h1>
        </header>

        <div className="flex flex-col gap-4 px-5 pt-[calc(56px_+_var(--safe-top))] mt-2">
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs text-white-60">Nombre</span>
            <div className="h-12 rounded-xl px-4 flex items-center bg-white-8">
              <span className="font-body text-[15px] text-white-100">
                {CAMPOS[0].value}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs text-white-60">Correo</span>
            <div className="h-12 rounded-xl px-4 flex items-center bg-white-8">
              <span className="font-body text-[15px] text-white-100">
                {email}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs text-white-60">Teléfono</span>
            <div className="h-12 rounded-xl px-4 flex items-center bg-white-8">
              <span className="font-body text-[15px] text-white-100">
                {CAMPOS[1].value}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 px-5 pt-8">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/perfil");
            }}
            className="font-body font-medium text-sm text-white-100"
          >
            Cerrar sesión
          </button>
          <button type="button" className="font-body font-medium text-sm text-warning">
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* Desktop — ver nota grande arriba. Sticky footer — ver la nota
          completa en Favoritos.tsx. */}
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
              volver en Desktop, ver la nota en Favoritos.tsx. */}
          <h1 className="mb-10 font-display text-3xl text-white-100">
            Datos de cuenta
          </h1>

          <div className="flex gap-16">
            <nav className="flex w-[260px] shrink-0 flex-col gap-1">
              <button
                onClick={() => setTabDesktop("cuenta")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-body text-sm ${
                  tabDesktop === "cuenta"
                    ? "bg-white-8 text-white-100"
                    : "text-white-70 hover:bg-white-6"
                }`}
              >
                <IconMail className="h-4 w-4 shrink-0 opacity-60" />
                Detalles de la cuenta
              </button>
              <button
                onClick={() => setTabDesktop("perfil")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-body text-sm ${
                  tabDesktop === "perfil"
                    ? "bg-white-8 text-white-100"
                    : "text-white-70 hover:bg-white-6"
                }`}
              >
                <IconUser className="h-4 w-4 shrink-0 opacity-60" />
                Información del perfil
              </button>
              <button
                onClick={() => setTabDesktop("notificaciones")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-body text-sm ${
                  tabDesktop === "notificaciones"
                    ? "bg-white-8 text-white-100"
                    : "text-white-70 hover:bg-white-6"
                }`}
              >
                <IconBell className="h-4 w-4 shrink-0 opacity-60" />
                Notificaciones
              </button>
              <button
                onClick={() => setTabDesktop("comunicacion")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-body text-sm ${
                  tabDesktop === "comunicacion"
                    ? "bg-white-8 text-white-100"
                    : "text-white-70 hover:bg-white-6"
                }`}
              >
                <IconMessageCircle className="h-4 w-4 shrink-0 opacity-60" />
                Preferencias de comunicación
              </button>
            </nav>

            <div className="max-w-[560px] flex-1">
              {tabDesktop === "cuenta" && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <h2 className="font-display text-xl text-white-100">
                      Correo electrónico
                    </h2>
                    <p className="font-body text-sm text-white-60">
                      Es donde recibes toda la información de tus reservas
                      — confirmaciones, cambios y recordatorios.
                    </p>
                    <div className="h-px w-full bg-white-12" />
                    <span className="font-body text-[15px] text-white-100">
                      {email}
                    </span>
                  </div>

                  {/* 2026-09-14 (séptima vuelta), a pedido de Ana ("el
                      cerrar sesion de la pantalla de datos no debe
                      existir, solo el eliminar cuenta"): se saca el botón
                      "Cerrar sesión" de acá — ya está resuelto en el panel
                      de perfil (`DesktopPerfilDropdown.tsx`, fila "Salir"),
                      no hace falta duplicarlo acá. Queda solo "Eliminar
                      cuenta", alineado a la izquierda (mismo eje que
                      "Correo electrónico"/el valor de arriba, no
                      centrado) y en `text-white-100` (no `text-warning`)
                      — pedido explícito de Ana para esta pantalla. */}
                  <div className="pt-4">
                    <button
                      type="button"
                      className="font-body font-medium text-sm text-white-100"
                    >
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              )}

              {tabDesktop === "perfil" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-body text-xs text-white-60">Nombre</span>
                    <div className="h-12 rounded-xl bg-white-8 px-4 flex items-center">
                      <span className="font-body text-[15px] text-white-100">
                        {CAMPOS[0].value}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-body text-xs text-white-60">Teléfono</span>
                    <div className="h-12 rounded-xl bg-white-8 px-4 flex items-center">
                      <span className="font-body text-[15px] text-white-100">
                        {CAMPOS[1].value}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-white-12 pb-4">
                    <span className="font-body text-sm text-white-100">Cumpleaños</span>
                    <span className="font-body text-sm text-white-40">----</span>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <span className="font-body text-sm text-white-100">
                      Lugar de nacimiento
                    </span>
                    <span className="font-body text-sm text-white-40">----</span>
                  </div>
                </div>
              )}

              {tabDesktop === "notificaciones" && (
                <div className="flex flex-col rounded-xl bg-white-6 px-5">
                  {NOTIFICACIONES.map((n, i) => (
                    <div key={n.key}>
                      <div className="flex items-center justify-between py-4">
                        <span className="font-body text-sm text-white-100">
                          {n.label}
                        </span>
                        <Switch
                          checked={estadoNotificaciones[n.key]}
                          onChange={(v) =>
                            setEstadoNotificaciones((prev) => ({
                              ...prev,
                              [n.key]: v,
                            }))
                          }
                          label={n.label}
                        />
                      </div>
                      {i < NOTIFICACIONES.length - 1 && (
                        <div className="h-px w-full bg-white-8" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tabDesktop === "comunicacion" && (
                <div className="flex items-center justify-between gap-6 rounded-xl bg-white-6 px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-sm font-semibold text-white-100">
                      Correo electrónico
                    </span>
                    <span className="font-body text-sm text-white-60">
                      Quiero recibir novedades y ofertas de Theaveling.
                    </span>
                  </div>
                  <Switch
                    checked={recibirPromos}
                    onChange={setRecibirPromos}
                    label="Recibir novedades y ofertas por correo"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DesktopFooter />
      </div>
    </>
  );
}
