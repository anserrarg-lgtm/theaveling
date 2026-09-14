import { Link } from "react-router-dom";
import {
  IconX,
  IconHeart,
  IconTicket,
  IconGlobe,
  IconBell,
  IconHelpCircle,
  IconUser,
} from "./icons";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useReservations } from "../context/ReservationsContext";

/*
 * DesktopPerfilDropdown — 2026-09-14, a pedido de Ana: "ahora vamos a lo
 * de perfil, debe ser tambien un bloque flotante (fijate de hacerlo con
 * la misma estetica que los demas) y devemos agregar favoritos y el
 * bloque de reservas, te dejo refs" (2 capturas: un modal estilo Fever —
 * cuenta, Perfil/Favoritos/Mis pedidos, puntos, Salir — y un menú estilo
 * Airbnb — Favoritos/Viajes/Mensajes/Perfil, Notificaciones/
 * Configuración/Idiomas/Centro de ayuda, Cerrar sesión).
 *
 * Antes, el avatar+nombre de `DesktopNavbar` era un <Link> directo a
 * `/perfil` (la pantalla completa de mobile). Ahora sigue el MISMO
 * patrón que ya usan `DesktopSearchDropdown`/`DesktopLocationDropdown`:
 * panel flotante liviano (sin oscurecer la pantalla, backdrop invisible
 * nada más para cerrar al tocar afuera), anclado debajo del avatar. Como
 * el avatar vive en el extremo DERECHO de la navbar, usa la variante
 * `desktop-panel-slide-right` (mismo criterio espejo ya documentado en
 * `DesktopSearchDropdown.tsx`). Mismo `bg-thea-green` + `shadow-2xl` sin
 * stroke que el resto de estos paneles.
 *
 * Sin fila "Perfil" — 2026-09-14 (segunda vuelta), a pedido de Ana: "y
 * quita la opcion de perfil, ya esa es la opcion que se abre cuando
 * tocas la foto". La primera versión traía una fila "Perfil" adentro del
 * propio panel de perfil, redundante — tocar la foto/nombre YA es la
 * acción de "entrar a perfil" (abre este panel), así que esa fila se saca.
 *
 * Idioma y moneda / Notificaciones / Servicio al cliente — 2026-09-14
 * (segunda vuelta), a pedido de Ana: "cuando el usuario ingrese la
 * opcion de moneda y lenguaje que esta en la barra debe pasar a vivir en
 * el perfil, y ahi tambien incluye notificaciones servicio al cliente
 * ayuda". El ícono de globo que abría `IdiomaMonedaModal` vivía suelto en
 * la navbar (al lado de la lupa) — se saca de ahí (ver DesktopNavbar.tsx)
 * y pasa a ser una fila acá, que sigue abriendo el MISMO
 * `IdiomaMonedaModal` de siempre (no se duplica ni se rehace, solo
 * cambia desde dónde se dispara). Como ese modal vive montado en
 * DesktopNavbar (para no desmontarse a mitad de camino si este panel se
 * cierra al abrirlo), acá se recibe `onAbrirIdiomaMoneda` como callback.
 *
 * Notificaciones / Datos de cuenta / Ayuda son NUEVAS filas acá, mismo
 * criterio de "no inventar rutas nuevas": enlazan a las pantallas que YA
 * EXISTEN de verdad (`/perfil/notificaciones`, `/perfil/datos-de-cuenta`,
 * `/perfil/ayuda` — esta última ya se linkeaba desde `DesktopFooter.tsx`
 * como "Centro de ayuda", mismo destino).
 *
 * "Ayuda" (antes "Servicio al cliente / Ayuda") — 2026-09-14 (cuarta
 * vuelta), a pedido de Ana: "deja lo de atencion al cliente sin
 * pantalla, o sea que no sea clickeable". La fila combinaba 2 conceptos
 * bajo un solo link ("Servicio al cliente / Ayuda" → `/perfil/ayuda`,
 * copiando el label exacto que ya usa esa fila en Perfil.tsx mobile). Se
 * saca la parte "Servicio al cliente" del label clickeable — queda solo
 * "Ayuda", sin que el panel implique que hay una pantalla dedicada de
 * "atención al cliente" aparte. El contenido de Contacto (correo/
 * WhatsApp) sigue viviendo DENTRO de `Ayuda.tsx` tal cual estaba — no se
 * saca nada de esa pantalla, solo se renombra cómo se LLEGA a ella desde
 * acá.
 *
 * "Datos de cuenta" — 2026-09-14 (tercera vuelta), a pedido de Ana: pasó
 * una referencia de Fever ("Detalles de la cuenta", con cumpleaños/lugar
 * de nacimiento/teléfono editables y pestañas de Mis pedidos/Mis
 * entradas) pidiendo que la fila llevara "a la pantalla de la ref". Ana
 * aclaró después ("sin mis entradas y mis pedidos") que esas 2 pestañas
 * puntuales NO hacen falta acá — Theaveling ya tiene ese contenido
 * resuelto en "Mis reservas" (arriba), no hace falta duplicarlo. En vez
 * de construir una pantalla nueva calcando el resto de la referencia
 * (cumpleaños/lugar de nacimiento son datos que Theaveling no recolecta,
 * inventarlos rompería el criterio de "nada mock nuevo sin pedirlo"), la
 * fila enlaza a `DatosDeCuenta.tsx` (`/perfil/datos-de-cuenta`) — la
 * pantalla de cuenta que YA existe (Nombre/Correo/Teléfono + Cerrar
 * sesión), mismo espíritu que la referencia (una pantalla dedicada a los
 * datos de la cuenta) con los campos reales que Theaveling sí tiene.
 *
 * Contenido propio — adaptado a lo que Theaveling realmente tiene, nada
 * inventado a partir de las referencias:
 * - Cuenta: mismo nombre/foto mock "Elena Voss" + el correo real de la
 *   sesión falsa (`useAuth().email`), igual que ya muestra Perfil.tsx.
 * - Favoritos: enlaza a `/favoritos` mostrando la cantidad real
 *   (`useFavorites().favoritos.length`). 2026-09-14 (tercera vuelta):
 *   antes enlazaba a `/perfil` (no existía ruta propia) — Ana mandó una
 *   referencia real pidiendo una pantalla dedicada, ver Favoritos.tsx.
 * - "Mis reservas": enlaza a `/reservas` (pantalla real) mostrando la
 *   cantidad de reservas PRÓXIMAS reales (`useReservations()`, estado
 *   "proxima").
 * - Salir: `useAuth().logout()`.
 *
 * No se toca Perfil.tsx (mobile) ni ninguna lógica de mobile — este panel
 * tiene su propio contenido, mismo criterio que el resto de los paneles
 * de Desktop de esta tanda.
 */
export default function DesktopPerfilDropdown({
  onClose,
  onAbrirIdiomaMoneda,
}: {
  onClose: () => void;
  onAbrirIdiomaMoneda: () => void;
}) {
  const { email, logout } = useAuth();
  const { favoritos } = useFavorites();
  const { reservas } = useReservations();
  const proximas = reservas.filter((r) => r.estado === "proxima").length;

  return (
    <>
      <button
        aria-label="Cerrar menú de perfil"
        onClick={onClose}
        className="fixed inset-0 z-40"
      />
      <div className="desktop-panel-slide-right absolute right-0 top-[calc(100%+12px)] z-50 flex w-[360px] flex-col gap-3 rounded-2xl bg-thea-green p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/elena-avatar.jpg"
              alt="Elena Voss"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-body text-sm font-semibold text-white-100">
                Elena Voss
              </span>
              <span className="font-body text-[13px] text-white-60">{email}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 shrink-0 items-center justify-center text-white-60"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <div className="h-px w-full bg-white-8" />

        <nav className="flex flex-col">
          <Link
            to="/favoritos"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-2 py-3 hover:bg-white-6"
          >
            <span className="flex items-center gap-3">
              <IconHeart className="h-4 w-4 shrink-0 text-white-100 opacity-50" />
              <span className="font-body text-sm text-white-100">Favoritos</span>
            </span>
            <span className="font-body text-[13px] text-white-60">
              {favoritos.length}
            </span>
          </Link>

          <Link
            to="/reservas"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-2 py-3 hover:bg-white-6"
          >
            <span className="flex items-center gap-3">
              <IconTicket className="h-4 w-4 shrink-0 text-white-100 opacity-50" />
              <span className="font-body text-sm text-white-100">Mis reservas</span>
            </span>
            <span className="font-body text-[13px] text-white-60">{proximas}</span>
          </Link>
        </nav>

        <div className="h-px w-full bg-white-8" />

        <nav className="flex flex-col">
          <button
            onClick={onAbrirIdiomaMoneda}
            className="flex items-center gap-3 rounded-xl px-2 py-3 text-left hover:bg-white-6"
          >
            <IconGlobe className="h-4 w-4 shrink-0 text-white-100 opacity-50" />
            <span className="font-body text-sm text-white-100">Idioma y moneda</span>
          </button>

          <Link
            to="/perfil/notificaciones"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-white-6"
          >
            <IconBell className="h-4 w-4 shrink-0 text-white-100 opacity-50" />
            <span className="font-body text-sm text-white-100">Notificaciones</span>
          </Link>

          <Link
            to="/perfil/datos-de-cuenta"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-white-6"
          >
            <IconUser className="h-4 w-4 shrink-0 text-white-100 opacity-50" />
            <span className="font-body text-sm text-white-100">Datos de cuenta</span>
          </Link>

          <Link
            to="/perfil/ayuda"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-white-6"
          >
            <IconHelpCircle className="h-4 w-4 shrink-0 text-white-100 opacity-50" />
            <span className="font-body text-sm text-white-100">Ayuda</span>
          </Link>
        </nav>

        <div className="h-px w-full bg-white-8" />

        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="rounded-xl px-2 py-3 text-left hover:bg-white-6"
        >
          <span className="font-body text-sm text-white-100">Salir</span>
        </button>
      </div>
    </>
  );
}
