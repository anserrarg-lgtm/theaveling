import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import { IconApple, IconGoogle, IconMail, IconX } from "./icons";
import GoogleAccountPickerSheet from "./GoogleAccountPickerSheet";
import AppleSignInSheet from "./AppleSignInSheet";

/*
 * DesktopLoginModal — 2026-09-12, a pedido de Ana: "vamos con el inicio
 * de secion ahora mismo esta como si fuera mobile, y para desk
 * necesitamos que sea un bloque flotante que funcione de una vez". Hasta
 * ahora `AuthContext.tsx` montaba un solo `LoginSheet` (bottom sheet,
 * `fixed inset-0 flex-col justify-end`, `sheet-slide-up`) para TODA la
 * app — en Desktop eso se veía igual que en el celular: una tarjeta
 * pegada abajo ocupando el ancho completo, en vez de un panel flotante
 * como el resto de los overlays de Desktop (`IdiomaMonedaModal`,
 * `DesktopSearchDropdown`, `DesktopLocationDropdown`).
 *
 * NO se tocó `LoginSheet.tsx` — regla de esta sesión de no tocar nada de
 * mobile salvo pedido explícito para ESE archivo puntual. En cambio, este
 * es un componente NUEVO, hermano de `LoginSheet`, con su propia copia
 * del formulario (mismo criterio ya usado en `DesktopSearchDropdown` para
 * no compartir estado/lógica con la versión mobile). `AuthContext.tsx`
 * ahora monta los dos, cada uno escondido con CSS en el breakpoint que no
 * le toca (`lg:hidden` / `hidden lg:block`) — mismo patrón de "las 2
 * versiones conviven, se turnan con Tailwind" que ya usa el resto de la
 * app (ver Descubrir.tsx) en vez de detectar el viewport a mano en JS.
 *
 * Estructura del panel — calcada de `IdiomaMonedaModal.tsx` (el otro
 * modal centrado de Desktop): overlay oscuro + tarjeta `bg-thea-green
 * rounded-2xl` centrada, sin borde, botón X arriba. Tema oscuro (blanco
 * sobre verde) en vez del tema claro que usa `LoginSheet` — "de una vez"
 * quiere decir que funcione ya, así que se elige consistencia con el
 * resto de los paneles flotantes de Desktop en vez de inventar un tercer
 * tratamiento de color; si Ana prefiere calcar el tema claro del sheet
 * de mobile acá también, es un cambio chico de ida.
 *
 * Google/Apple — reusa `GoogleAccountPickerSheet`/`AppleSignInSheet` TAL
 * CUAL (sin cambios): esos 2 ya son diálogos centrados estilo nativo
 * (Android/iOS), no bottom sheets — el problema de "se ve mobile" era
 * solo la tarjeta de "Inicia sesión o regístrate" en sí, no estos 2.
 *
 * Auth falsa, sin backend — mismo mecanismo que `LoginSheet` (ver
 * `AuthContext.tsx`): cualquier correo no vacío, o Google/Apple
 * decorativos, completan el login. Este componente llama a los mismos
 * `onLogin`/`onClose` que le pasa `AuthContext`.
 */
export default function DesktopLoginModal({
  open,
  mensaje,
  onClose,
  onLogin,
}: {
  open: boolean;
  mensaje: string;
  onClose: () => void;
  onLogin: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [googlePickerAbierto, setGooglePickerAbierto] = useState(false);
  const [appleSheetAbierto, setAppleSheetAbierto] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setGooglePickerAbierto(false);
      setAppleSheetAbierto(false);
    }
  }, [open]);

  if (!open) return null;

  const continuarConCorreo = () => {
    const valor = email.trim();
    if (!valor) return;
    onLogin(valor);
  };

  const elegirCuentaGoogle = (correo: string) => {
    setGooglePickerAbierto(false);
    onLogin(correo);
  };

  const continuarConApple = (correo: string) => {
    setAppleSheetAbierto(false);
    onLogin(correo);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div
        className={`relative flex w-full max-w-[400px] flex-col rounded-2xl bg-thea-green transition-opacity duration-150 ${
          googlePickerAbierto || appleSheetAbierto
            ? "pointer-events-none opacity-0"
            : ""
        }`}
      >
        <div className="flex items-center justify-end px-5 pt-5">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white-100 hover:bg-white-8"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 px-8 pb-6 pt-1 text-center">
          <Wordmark />
          <h2 className="mt-3 font-display text-xl font-semibold text-white-100">
            Inicia sesión o regístrate
          </h2>
          {mensaje && (
            <p className="max-w-[280px] font-body text-sm text-white-60">
              {mensaje}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 px-8 pb-8">
          <label className="flex h-12 items-center gap-2.5 rounded-xl bg-white-8 px-4">
            <IconMail className="h-4 w-4 shrink-0 text-white-60" />
            <input
              autoFocus
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && continuarConCorreo()}
              placeholder="Correo electrónico"
              className="flex-1 bg-transparent font-body text-sm text-white-100 outline-none placeholder:text-white-40"
            />
          </label>
          <button
            onClick={continuarConCorreo}
            disabled={!email.trim()}
            className="h-12 w-full rounded-xl bg-white-100 font-body text-[15px] font-semibold text-thea-green disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white-12" />
            <span className="font-body text-xs text-white-60">o</span>
            <div className="h-px flex-1 bg-white-12" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGooglePickerAbierto(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white-8 font-body text-sm font-semibold text-white-100"
            >
              <IconGoogle className="h-[18px] w-[18px]" />
              Google
            </button>
            <button
              onClick={() => setAppleSheetAbierto(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white-8 font-body text-sm font-semibold text-white-100"
            >
              <IconApple className="h-4 w-4" />
              Apple
            </button>
          </div>

          <p className="pt-1 text-center font-body text-xs text-white-60">
            Esta es una demo — no se crea ninguna cuenta real ni se guarda
            tu correo en ningún servidor.
          </p>
        </div>
      </div>

      <GoogleAccountPickerSheet
        open={googlePickerAbierto}
        onCancelar={() => setGooglePickerAbierto(false)}
        onElegirCuenta={elegirCuentaGoogle}
      />
      <AppleSignInSheet
        open={appleSheetAbierto}
        onCancelar={() => setAppleSheetAbierto(false)}
        onContinuar={continuarConApple}
      />
    </div>
  );
}
