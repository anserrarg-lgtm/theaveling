import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import { IconApple, IconGoogle, IconMail, IconX } from "./icons";
import GoogleAccountPickerSheet from "./GoogleAccountPickerSheet";
import AppleSignInSheet from "./AppleSignInSheet";

/*
 * LoginSheet — 2026-09-06, parte del flujo de Login contextual (ver
 * AuthContext.tsx): "el login aparece cuando realmente aporta valor" —
 * nunca como pantalla obligatoria del Onboarding. Este es el ÚNICO sheet
 * de login de toda la app; se monta una sola vez (dentro de
 * AuthProvider) y se reutiliza para los 3 disparadores reales
 * (favoritos, reserva, perfil) cambiando solo el `mensaje` — mismo
 * mecanismo que un `alert`/`confirm` del navegador, pero propio.
 *
 * Referencia visual — Ana mandó 2 capturas de otra app (estilo Airbnb):
 * "Inicia sesión o regístrate" con campo único, botón sólido ancho,
 * separador "o", 2 botones de redes debajo; y el patrón de diálogo nativo
 * (fondo oscurecido + tarjeta clara centrada) para pedir permisos. Acá se
 * calca la ESTRUCTURA (campo → CTA → separador → alternativas), no los
 * colores de esa app (coral/negro → verde/mint de Thea) — mismo criterio
 * que ConfirmarPagoSheet.tsx con su propia referencia.
 *
 * Bottom sheet, no pantalla completa — a diferencia de ConfirmarPagoSheet
 * (que SÍ ocupa toda la pantalla, ver nota ahí sobre por qué), este es un
 * gate rápido en medio de otra acción (favoritear, pagar, ver perfil) —
 * se cierra o se resuelve en segundos, no amerita tomar toda la pantalla.
 * Mismo tratamiento que LocationSheet.tsx (`rounded-t-[28px]`, backdrop,
 * `sheet-slide-up`), pero en tema CLARO (bg-white-100/texto thea-green)
 * en vez de oscuro — coincide mejor con la referencia y con el tema claro
 * que ya usa ConfirmarPagoSheet para este tipo de flujo transaccional.
 *
 * Auth falsa, sin backend — ver la nota grande en AuthContext.tsx.
 * Cualquier correo no vacío "inicia sesión" (no valida formato ni
 * contraseña — no hay nada real que validar contra).
 *
 * Google/Apple — 2026-09-07, a pedido de Ana: "quiero que salieran los
 * loguitos de Google y Apple y si se escogen esas opciones sobre todo
 * Google pues que salga el aviso ese nativo para poder ingresar, se ve
 * como la ref" (mandó 2 capturas del selector de cuenta real de
 * Google). Esto CAMBIA una decisión anterior de este archivo, que
 * dejaba los botones sin logo a propósito para no sugerir una
 * integración real — ahora Ana pidió explícitamente lo contrario, así
 * que se agregan `IconGoogle`/`IconApple` (ver icons.tsx) y, al tocar
 * cada botón, se abre un diálogo que imita el nativo real de cada
 * plataforma en vez de loguear directo:
 * - Google → `GoogleAccountPickerSheet` (selector de cuentas estilo
 *   Android, con la referencia exacta que mandó Ana).
 * - Apple → `AppleSignInSheet` (tarjeta Face ID + "Continuar como...",
 *   patrón real de iOS — distinto del de Google a propósito, ver la
 *   nota grande de ese archivo).
 * Elegir una cuenta en cualquiera de los 2 llama a `onLogin` igual que
 * el correo — sigue sin haber OAuth real detrás, es la MISMA auth falsa,
 * solo con la puesta en escena que pidió Ana.
 *
 * 2026-09-07, ajuste — Ana: "esta raro el login con google" / "el de
 * apple tambien". El problema no era el diálogo nativo en sí, era que
 * esta tarjeta (blanca, con los botones Google/Apple todavía visibles y
 * legibles) se quedaba de fondo, a medio dimear, compitiendo visualmente
 * con el diálogo nativo de arriba — dos capas de UI pisándose en vez de
 * sentirse como "salir de Theaveling hacia un diálogo del sistema". Se
 * soluciona ocultando esta tarjeta (`opacity-0`, sigue montada, no se
 * pierde su estado) mientras cualquiera de los 2 diálogos nativos está
 * abierto — así solo queda el fondo oscurecido detrás del diálogo,
 * mismo efecto que la referencia de Ana (donde apenas se asoma una
 * franja mínima de la pantalla de atrás, no toda la tarjeta).
 */
export default function LoginSheet({
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

  // Limpia el campo y cierra los diálogos nativos cada vez que se abre
  // para un disparador nuevo — ninguna sesión previa "a medio hacer"
  // debería sobrevivir de un uso al siguiente.
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
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(1,20,20,0.6)]"
      />
      <div
        className={`relative bg-white-100 rounded-t-[28px] flex flex-col pb-8 sheet-slide-up transition-opacity duration-150 ${
          googlePickerAbierto || appleSheetAbierto
            ? "opacity-0 pointer-events-none"
            : ""
        }`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-green-12" />
        </div>
        <div className="flex items-center justify-end px-5 pt-2">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="h-9 w-9 -mr-2 flex items-center justify-center"
          >
            <IconX className="w-5 h-5 text-thea-green" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 px-6 pt-2 pb-6 text-center">
          <Wordmark />
          <h2 className="font-display font-semibold text-xl text-thea-green mt-3">
            Inicia sesión o regístrate
          </h2>
          {/* Mensaje contextual — por qué se pide sesión justo acá (distinto
              en favoritos/reserva/perfil, ver cada sitio que llama a
              `requireAuth`). Sin esto, el gate se siente arbitrario. */}
          {mensaje && (
            <p className="font-body text-sm text-green-70 max-w-[280px]">
              {mensaje}
            </p>
          )}
        </div>

        <div className="px-6 flex flex-col gap-3">
          <label className="flex items-center gap-2.5 h-12 rounded-xl border border-green-20 px-4">
            <IconMail className="w-4 h-4 text-green-50 shrink-0" />
            <input
              autoFocus
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && continuarConCorreo()}
              placeholder="Correo electrónico"
              className="flex-1 bg-transparent font-body text-sm text-thea-green placeholder:text-green-50 outline-none"
            />
          </label>
          <button
            onClick={continuarConCorreo}
            disabled={!email.trim()}
            className="w-full h-12 rounded-xl bg-thea-green text-white-100 font-body font-semibold text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-green-12" />
            <span className="font-body text-xs text-green-50">o</span>
            <div className="h-px flex-1 bg-green-12" />
          </div>

          {/* Google/Apple — abren un diálogo que imita el nativo real de
              cada plataforma en vez de loguear directo, ver nota grande
              de arriba. */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGooglePickerAbierto(true)}
              className="h-12 rounded-xl bg-green-8 text-thea-green font-body font-semibold text-sm flex items-center justify-center gap-2"
            >
              <IconGoogle className="w-[18px] h-[18px]" />
              Google
            </button>
            <button
              onClick={() => setAppleSheetAbierto(true)}
              className="h-12 rounded-xl bg-green-8 text-thea-green font-body font-semibold text-sm flex items-center justify-center gap-2"
            >
              <IconApple className="w-4 h-4" />
              Apple
            </button>
          </div>

          <p className="font-body text-xs text-green-50 text-center pt-1">
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
