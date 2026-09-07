import { IconApple } from "./icons";

/*
 * AppleSignInSheet — 2026-09-07, hermano de GoogleAccountPickerSheet.tsx
 * para el botón "Apple" de LoginSheet.tsx. Ana pidió el logo de Apple en
 * el botón y, para el diálogo nativo, eligió explícitamente "estilo
 * Apple real" en vez de reusar el patrón de lista de cuentas de Google
 * — con razón: el selector de Google es de Android (multi-cuenta,
 * varias cuentas de Google en un mismo teléfono), pero "Continuar con
 * Apple ID" en iOS nunca muestra una lista — hay una sola Apple ID por
 * dispositivo. El patrón real es Face ID/Touch ID → una tarjeta de
 * confirmación con esa Apple ID y un botón "Continuar".
 *
 * Tema CLARO (blanco, texto negro/gris) a propósito, a diferencia del
 * selector de Google (gris oscuro) — los diálogos de sistema de iOS son
 * casi siempre tarjetas claras sin importar el tema de la app detrás,
 * mismo criterio de "salir de Theaveling hacia un diálogo del SO" que
 * GoogleAccountPickerSheet, pero con la paleta real que le corresponde
 * a iOS en vez de a Android.
 *
 * Face ID — ícono propio (no existía en icons.tsx): el marco redondeado
 * con esquinas tipo "viewfinder" es el glyph real que usa iOS para Face
 * ID/reconocimiento facial. No se anima (sería una animación de verdad
 * de escaneo) — semi-decorativo, como todo el login falso del proyecto.
 *
 * Apple ID decorativo: 2026-09-07, a pedido de Ana, alineado con la
 * misma identidad falsa que ya usa toda la app ("el supuesto perfil
 * falso que usa la app que es el de elena") — "Elena Voss" en vez del
 * "Ana Serrano" que tenía antes (ver la nota equivalente en
 * GoogleAccountPickerSheet.tsx sobre por qué se corrigió).
 */

const NOMBRE = "Elena Voss";
const CORREO = "elena.voss@icloud.com";

function IconFaceId({ className = "" }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className}>
      {/* esquinas tipo viewfinder */}
      <path d="M3 12V8a5 5 0 0 1 5-5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M37 12V8a5 5 0 0 0-5-5h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 28v4a5 5 0 0 0 5 5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M37 28v4a5 5 0 0 1-5 5h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* rasgos faciales simples */}
      <circle cx="14" cy="17" r="1.6" fill="currentColor" />
      <circle cx="26" cy="17" r="1.6" fill="currentColor" />
      <path d="M20 17.5V23a2 2 0 0 1-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.5 28.5c2 1.6 4.2 2.4 6.5 2.4s4.5-.8 6.5-2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AppleSignInSheet({
  open,
  onCancelar,
  onContinuar,
}: {
  open: boolean;
  onCancelar: () => void;
  onContinuar: (correo: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-8">
      <button
        aria-label="Cancelar"
        onClick={onCancelar}
        className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"
      />
      <div className="relative w-full max-w-[300px] rounded-[20px] bg-white-100 flex flex-col items-center gap-1 pt-7 pb-5 px-6 text-center">
        <IconApple className="w-6 h-6 text-black mb-2" />
        <IconFaceId className="w-10 h-10 text-black mb-3" />
        <h2 className="font-body font-semibold text-base text-black">
          Continuar como {NOMBRE}
        </h2>
        <p className="font-body text-sm text-black/50 mb-4">{CORREO}</p>

        <div className="w-full h-px bg-black/10 mb-3" />

        <button
          onClick={() => onContinuar(CORREO)}
          className="w-full h-11 rounded-xl bg-black text-white-100 font-body font-semibold text-sm mb-2"
        >
          Continuar
        </button>
        <button
          onClick={onCancelar}
          className="w-full h-11 rounded-xl font-body text-sm text-black/60"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
