import { useEffect, useState } from "react";
import Wordmark from "../../components/Wordmark";

/*
 * InstalarApp — 2026-09-07, a pedido de Ana: "quiero que antes de que
 * deje ver el contenido de la app, el usuario tenga un boton de
 * descargar o de ver en linea" / "como cuando alguien te comparte un
 * app de la tienda". Es la primera pantalla que ve cualquiera que abre
 * el link (antes de Onboarding/Bienvenida), con el ícono de Theaveling
 * y 2 botones:
 *   - "Descargar": intenta instalar la PWA (ver manifest.webmanifest y
 *     public/sw.js, agregados en la misma tanda). Si el navegador
 *     soporta el aviso nativo de instalación (`beforeinstallprompt`,
 *     Chrome/Edge en Android y escritorio), lo dispara acá. Si no
 *     (Safari/iOS no lo soporta, o ya está instalada), muestra
 *     instrucciones cortas para instalarla a mano en vez de fallar en
 *     silencio.
 *   - "Ver en línea": entra directo a la app en el navegador, sin
 *     instalar nada — el link de Vercel sigue funcionando igual que
 *     siempre para quien prefiera esto.
 *
 * Vive en App.tsx, ANTES del router — se muestra una vez por visita
 * (recargar la página la vuelve a mostrar, mismo comportamiento que la
 * ficha de una app cuando te comparten el link). Si la app ya se abrió
 * instalada (`display-mode: standalone`), se salta esta pantalla del
 * todo: no tiene sentido ofrecer "instalar" a alguien que ya la tiene
 * instalada.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function detectarInstrucciones(): string {
  const ua = navigator.userAgent;
  const esIOS = /iphone|ipad|ipod/i.test(ua);
  if (esIOS) {
    return 'Toca el ícono de compartir (el cuadrado con la flecha hacia arriba) y luego "Añadir a pantalla de inicio".';
  }
  return 'Abre el menú (⋮) del navegador y busca "Instalar aplicación" o "Añadir a pantalla de inicio".';
}

export default function InstalarApp({ onContinuar }: { onContinuar: () => void }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDescargar = async () => {
    if (!promptEvent) {
      setMostrarInstrucciones(true);
      return;
    }
    await promptEvent.prompt();
    const eleccion = await promptEvent.userChoice;
    setPromptEvent(null);
    if (eleccion.outcome === "accepted") {
      onContinuar();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-thea-green px-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/icon-512.png"
          alt=""
          aria-hidden="true"
          className="h-24 w-24 rounded-[22%] shadow-lg"
        />
        <Wordmark size={28} />
        <p className="max-w-xs font-body text-sm text-white-80">
          Descubre experiencias culturales y artísticas en tu ciudad.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={handleDescargar}
          className="h-12 w-full rounded-xl bg-white-100 font-body text-[15px] font-semibold text-thea-green"
        >
          Descargar
        </button>
        <button
          type="button"
          onClick={onContinuar}
          className="h-12 w-full rounded-xl border border-white-20 font-body text-[15px] font-medium text-white-100"
        >
          Ver en línea
        </button>
      </div>

      {mostrarInstrucciones && (
        <div
          className="fixed inset-0 z-10 flex items-end justify-center bg-black/60 px-6 pb-10"
          onClick={() => setMostrarInstrucciones(false)}
        >
          <div
            className="flex w-full max-w-xs flex-col gap-4 rounded-2xl bg-thea-green p-6 text-center"
            style={{ boxShadow: "0 -4px 24px rgb(0 0 0 / 30%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-body text-sm text-white-100">
              {detectarInstrucciones()}
            </p>
            <button
              type="button"
              onClick={() => setMostrarInstrucciones(false)}
              className="h-11 w-full rounded-xl bg-white-12 font-body text-sm font-medium text-white-100"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
