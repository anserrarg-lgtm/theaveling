import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconCaretRight } from "../../components/icons";

/*
 * Legal — 2026-09-11, a pedido de Ana (ver la nota grande de
 * DesktopFooter.tsx): el footer de Desktop necesitaba algún destino real
 * para "Términos de uso"/"Política de privacidad"/"Gestión de cookies",
 * pero Theaveling no tiene ese contenido legal redactado todavía (es un
 * caso de estudio de UX, no una empresa real con abogados). En vez de
 * inventar letra chica legal (mala idea: sería contenido falso
 * presentado como real) o dejar los links sin destino (mismo criterio de
 * "no dejar espacio muerto" ya usado en el resto del proyecto), esta
 * pantalla es un placeholder honesto — dice claramente que el contenido
 * todavía se está redactando, mismo tono que ya se usó para "Escena/
 * Cultura en Desktop" en Descubrir.tsx.
 *
 * Una sola pantalla para las 3 — `TITULOS` resuelve cuál según la URL
 * (`/terminos`/`/privacidad`/`/cookies`, cada una registrada aparte en
 * router.tsx, sin usar un `:param` porque son 3 rutas fijas, no una
 * familia con id variable como `/ver-mas/:slug`), mismo criterio que
 * `getVerMasContent` en VerMas.tsx: contenido intercambiable, misma
 * estructura visual.
 */
const TITULOS: Record<string, string> = {
  "/terminos": "Términos de uso",
  "/privacidad": "Política de privacidad",
  "/cookies": "Gestión de cookies",
};

export default function Legal() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const titulo = TITULOS[pathname] ?? "Legal";

  return (
    <div className="min-h-screen bg-[rgb(1,20,20)] text-white-100">
      <header className="flex items-center gap-3 px-5 pt-[calc(20px_+_var(--safe-top))] pb-3 lg:px-20 lg:pt-10">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="h-5 w-5 shrink-0 flex items-center justify-center"
        >
          <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
        </button>
        <h1 className="font-display text-lg text-white-100 truncate">{titulo}</h1>
      </header>

      <div className="flex flex-col items-center gap-2 px-5 pt-16 pb-10 text-center">
        <p className="font-display text-2xl text-white-100">
          Todavía estamos redactando esta sección
        </p>
        <p className="max-w-[420px] font-body text-sm text-white-60">
          Theaveling es un proyecto en construcción — el contenido legal
          real todavía no está listo. Volvé a mirar más adelante.
        </p>
        <Link
          to="/"
          className="mt-4 font-body text-[13px] text-white-100 underline underline-offset-2"
        >
          Volver a Descubrir
        </Link>
      </div>
    </div>
  );
}
