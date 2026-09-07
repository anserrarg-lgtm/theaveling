import { useNavigate } from "react-router-dom";
import { IconCaretRight } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";

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
 */
const CAMPOS = [
  { label: "Nombre", value: "Ana" },
  { label: "Teléfono", value: "+57 300 000 0000" },
] as const;

export default function DatosDeCuenta() {
  const navigate = useNavigate();
  const { email, logout } = useAuth();

  return (
    <div className="min-h-screen bg-thea-green text-white-100">
      {/* Header fijo — 2026-09-03, a pedido de Ana: cualquier pantalla con
          back se mantiene visible al scrollear (ver nota completa en
          DetalleExperiencia.tsx y Perfil.tsx). Sin foto detrás, así que
          va con thea-deep sólido desde el arranque. `pt-14` abajo
          compensa el alto fijo del header.

          bg-[rgb(1,20,20)] en vez de bg-thea-deep — 2026-09-03, mismo
          motivo que Perfil.tsx/Notificaciones.tsx: thea-deep es 95%
          opaco (pensado para foto detrás); acá cubre texto plano y ese
          5% dejaba pasar un "fantasma" del contenido al scrollear. Mismo
          RGB, 100% opaco. */}
      <header className="fixed top-0 left-0 right-0 z-20 h-[calc(56px+var(--safe-top))] pt-[var(--safe-top)] flex items-center gap-3 px-5 bg-[rgb(1,20,20)] border-b border-white-12">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="p-1 -m-1">
          <IconCaretRight className="w-5 h-5 text-white-100 rotate-180" />
        </button>
        <h1 className="font-display font-semibold text-2xl">Datos de cuenta</h1>
      </header>

      <div className="flex flex-col gap-4 px-5 pt-[calc(56px+var(--safe-top))] mt-2">
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
  );
}
