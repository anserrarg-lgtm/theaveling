import { IconGoogle, IconPlus, IconUser } from "./icons";

/*
 * GoogleAccountPickerSheet — 2026-09-07, a pedido de Ana sobre
 * LoginSheet.tsx: "quiero que salieran los loguitos de Google y Apple y
 * si se escogen esas opciones sobre todo Google pues que salga el aviso
 * ese nativo para poder ingresar, se ve como la ref". La referencia que
 * mandó son 2 capturas del selector de cuenta REAL de Google en Android
 * (el que aparece dentro de apps como Airbnb al tocar "Continuar con
 * Google"): fondo oscurecido, tarjeta gris oscuro centrada, logo de
 * Google arriba, "Elegir una cuenta" + "para continuar usando [app]",
 * lista de cuentas, "Agregar otra cuenta", y un aviso de privacidad con
 * 2 frases en azul.
 *
 * Colores: A PROPÓSITO gris neutro (`bg-[#2d2e30]`/`bg-[#3c4043]`, la
 * paleta oscura real de Material/Android), NO los tokens `thea-*` del
 * resto de la app. La idea es que esto se sienta como si la persona
 * "saliera" de Theaveling hacia un diálogo del sistema operativo — usar
 * el verde/mint de la marca acá rompería justo esa ilusión, que es el
 * pedido explícito ("se ve como la ref").
 *
 * Sin botón X propio — el selector real de Google no lo tiene, se
 * cierra tocando afuera o con el botón atrás del sistema (acá:
 * `onCancelar` en el backdrop). La X que se ve en las capturas de Ana
 * pertenece a la pantalla de Airbnb DETRÁS del diálogo, no al diálogo
 * de Google en sí.
 *
 * Cuentas — decorativas ("primera pasada", mismo criterio honesto que
 * el resto del proyecto): NO se usa el correo real de nadie. La primera
 * cuenta es "Elena Voss" — 2026-09-07, a pedido de Ana: "agrupa por
 * favor los datos inventados del login, para que se alinees con el
 * supuesto perfil falso que usa la app que es el de elena". Antes decía
 * "Ana Serrano" (coincidencia sin querer con el nombre real de la
 * usuaria — un error, no un mock a propósito). "Elena Voss" es el mismo
 * perfil mock que ya usa toda la app (ver Perfil.tsx: nombre fijo
 * "Elena Voss" apenas hay sesión) — ahora hay una sola identidad falsa
 * consistente en todo el proyecto, no dos inventadas por separado. La
 * segunda cuenta queda como alternativa genérica, sin nombre de
 * persona, para no inventar una segunda identidad de la nada. Avatar de
 * iniciales (sin foto real, mismo criterio que "Elena Voss" en
 * Perfil.tsx, que tampoco tiene foto real). "Agregar otra cuenta" no
 * abre un formulario nuevo — en la vida real llevaría a un login
 * completo de Google que no tiene sentido simular acá; toca directo a
 * una cuenta nueva de demo, mismo login falso que el resto (ver
 * AuthContext.tsx).
 *
 * Los links "política de privacidad" / "condiciones del servicio" se
 * pintan en azul como en la referencia pero NO son interactivos —
 * distinto del criterio de "sin links muertos" que se usó en
 * ConfirmarPagoSheet (ese aviso era de Theaveling, contenido propio;
 * este es el aviso REAL de Google que aparece en cualquier app, parte
 * de lo que se está imitando a propósito, no contenido propio que deba
 * sonar honesto sobre sí mismo).
 */

interface CuentaGoogle {
  nombre: string;
  correo: string;
  inicial: string;
  colorAvatar: string;
}

const CUENTAS: CuentaGoogle[] = [
  { nombre: "Elena Voss", correo: "elena.voss@gmail.com", inicial: "E", colorAvatar: "#8E44AD" },
  { nombre: "Theaveling Demo", correo: "demo.theaveling@gmail.com", inicial: "T", colorAvatar: "#1A73E8" },
];

export default function GoogleAccountPickerSheet({
  open,
  onCancelar,
  onElegirCuenta,
}: {
  open: boolean;
  onCancelar: () => void;
  onElegirCuenta: (correo: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      <button
        aria-label="Cancelar"
        onClick={onCancelar}
        className="absolute inset-0 bg-[rgba(0,0,0,0.55)]"
      />
      <div className="relative w-full max-w-[340px] rounded-[28px] bg-[#2d2e30] flex flex-col items-center gap-1 pt-8 pb-2 px-6 text-center">
        <IconGoogle className="w-9 h-9 mb-3" />
        <h2 className="font-body text-xl text-white-100">Elegir una cuenta</h2>
        <p className="font-body text-sm text-white-60 mb-3">
          para continuar usando Theaveling
        </p>

        <div className="w-full flex flex-col">
          {CUENTAS.map((cuenta) => (
            <button
              key={cuenta.correo}
              onClick={() => onElegirCuenta(cuenta.correo)}
              className="flex items-center gap-3 py-3 border-t border-white-12 text-left"
            >
              <span
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 font-body font-semibold text-white-100"
                style={{ backgroundColor: cuenta.colorAvatar }}
              >
                {cuenta.inicial}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-body text-sm text-white-100 truncate">
                  {cuenta.nombre}
                </span>
                <span className="font-body text-xs text-white-60 truncate">
                  {cuenta.correo}
                </span>
              </span>
            </button>
          ))}

          <button
            onClick={() => onElegirCuenta("otra.cuenta.demo@gmail.com")}
            className="flex items-center gap-3 py-3 border-t border-white-12 text-left"
          >
            <span className="relative h-9 w-9 rounded-full bg-white-12 flex items-center justify-center shrink-0">
              <IconUser className="w-4 h-4 text-white-100" />
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#2d2e30] flex items-center justify-center">
                <IconPlus className="w-2.5 h-2.5 text-white-100" />
              </span>
            </span>
            <span className="font-body text-sm text-white-100">
              Agregar otra cuenta
            </span>
          </button>
        </div>

        <p className="font-body text-xs text-white-60 text-left pt-4 pb-6">
          Para continuar, Google compartirá tu nombre, dirección de correo
          electrónico y foto de perfil con Theaveling. Antes de usar esta
          app, consulta su{" "}
          <span style={{ color: "#8ab4f8" }}>política de privacidad</span> y
          las{" "}
          <span style={{ color: "#8ab4f8" }}>condiciones del servicio</span>.
        </p>
      </div>
    </div>
  );
}
