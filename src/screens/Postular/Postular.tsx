import { useState } from "react";
import { Link } from "react-router-dom";
import VolverButton from "../../components/VolverButton";
import type { CategoryTab } from "../../components/CategoryTabs";

/*
 * Postular — 2026-10-08, a pedido de Ana: charlando sobre por qué
 * Airbnb integra "Modo Anfitrión" en el mismo menú del usuario mientras
 * que Fever lo separa por completo (público distinto de cada lado +
 * necesita revisión antes de publicarse), Ana decidió el modelo de
 * negocio de Theaveling: como la propuesta de valor es "curado" (el
 * equipo de Theaveling selecciona cada experiencia, no es un marketplace
 * abierto tipo Airbnb), el punto de entrada de un organizador NO puede
 * vivir en la navbar/menú de perfil del consumidor — mandaría la señal
 * equivocada de "cualquiera puede publicar acá". Va en el footer, como
 * un link de baja jerarquía más (ver DesktopFooter.tsx, columna
 * "¿Tenés una experiencia?") — mismo lugar donde Fever separa esto en SU
 * propio footer real.
 *
 * Esta pantalla es el destino de ese link ("Postulá acá"). Mismo
 * criterio que Legal.tsx: Theaveling no tiene backend real en ningún
 * lado del proyecto, así que el formulario no se manda a ningún
 * servidor — pero a diferencia de Legal.tsx (que es un placeholder
 * honesto sin contenido todavía), ACÁ sí hay contenido real que
 * mostrar: el copy explica que esto es una postulación con revisión
 * (no un alta instantánea tipo Airbnb), que es justo la decisión de
 * negocio que se acaba de tomar — y el formulario + estado de "enviado"
 * son reales en el front, mismo espíritu que la auth falsa de
 * AuthContext.tsx (la UI y el mecanismo del gate están completos, solo
 * no hay backend detrás).
 *
 * Estructura — header calcado de Legal.tsx (volver + título), cuerpo
 * centrado a `max-w-[560px]` como el resto de las pantallas de
 * formulario angostas de Desktop. Inputs con el mismo tratamiento que
 * `DesktopLoginModal.tsx` (`rounded-xl bg-white-8`, sin usar un color de
 * fondo nuevo). Selector de categoría reusa `CategoryTab` (Escena/
 * Cultura) en vez de inventar un enum nuevo — son las mismas 2
 * categorías de siempre, ahora elegidas por quien postula en vez de por
 * quien navega.
 *
 * 2026-10-08, corrección a pedido de Ana ("no lo pongas en argentino
 * acento, neutral"): el copy de esta pantalla se había redactado en
 * voseo ("Postulá", "Contanos", "vos@email.com") — ninguna otra pantalla
 * de Theaveling usa voseo (ver Busqueda.tsx/DesktopLoginModal.tsx, todas
 * en tuteo neutro o infinitivo), así que rompía la consistencia. Pasa
 * todo a tuteo neutro ("Quieres", "Cuéntanos", "tu@email.com") y el
 * título a infinitivo ("Postular tu experiencia"), mismo criterio que ya
 * usa el resto de la app para botones/placeholders.
 *
 * 2026-10-08 (segunda vuelta), a pedido de Ana ("en vez de experiencia
 * por descubrimiento"): "experiencia" es el término que usa el resto de
 * la app para el contenido ya curado/publicado (`ExperienceCard`,
 * `DetalleExperiencia`, etc.) — ACÁ, del lado de alguien que todavía está
 * postulando algo que ni siquiera pasó la curaduría, "descubrimiento" es
 * más preciso (es justo el verbo que ya usa el resto de Theaveling:
 * "Descubrir"/"Descubrimientos" en Descubrir.tsx). Se cambia el copy
 * visible de esta pantalla (título, pregunta, label, texto de éxito) —
 * NO los nombres de variable internos (`experiencia`/`setExperiencia`
 * siguen igual, son identificadores de código, no texto que lea nadie) ni
 * el resto de la app, donde "experiencia" sigue siendo el término
 * correcto para contenido ya curado.
 */
export default function Postular() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [categoria, setCategoria] = useState<CategoryTab>("Escena");
  const [descripcion, setDescripcion] = useState("");
  const [enviado, setEnviado] = useState(false);

  const listoParaEnviar =
    nombre.trim() && email.trim() && experiencia.trim() && descripcion.trim();

  const enviar = () => {
    if (!listoParaEnviar) return;
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-[rgb(1,20,20)] text-white-100">
      <header className="flex items-center gap-3 px-5 pt-[calc(20px_+_var(--safe-top))] pb-3 lg:px-20 lg:pt-10">
        <VolverButton size="tight" />
        <h1 className="font-display text-lg text-white-100 truncate">
          Postular tu descubrimiento
        </h1>
      </header>

      <div className="mx-auto flex max-w-[560px] flex-col gap-8 px-5 pb-20 pt-6 lg:px-0 lg:pt-10">
        {enviado ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-thea-green px-8 py-12 text-center">
            <p className="font-display text-2xl text-white-100">
              ¡Gracias, {nombre.split(" ")[0]}!
            </p>
            <p className="max-w-[380px] font-body text-sm text-white-60">
              Recibimos tu postulación para "{experiencia}". Nuestro equipo
              revisa cada descubrimiento a mano antes de sumarlo al catálogo
              curado — te escribimos a {email} con la respuesta.
            </p>
            <Link
              to="/"
              className="mt-3 font-body text-[13px] text-white-100 underline underline-offset-2"
            >
              Volver a Descubrir
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <p className="font-display text-2xl text-white-100">
                ¿Quieres que tu descubrimiento esté en Theaveling?
              </p>
              <p className="font-body text-sm text-white-60">
                No es un alta automática: cada descubrimiento que aparece en
                Theaveling pasa primero por nuestro equipo de curaduría.
                Cuéntanos del tuyo y lo evaluamos — si encaja, te
                ayudamos a sumarlo.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-[13px] font-medium text-white-100">
                  Tu nombre
                </span>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="h-12 rounded-xl bg-white-8 px-4 font-body text-sm text-white-100 outline-none placeholder:text-white-40"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-body text-[13px] font-medium text-white-100">
                  Correo de contacto
                </span>
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="h-12 rounded-xl bg-white-8 px-4 font-body text-sm text-white-100 outline-none placeholder:text-white-40"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-body text-[13px] font-medium text-white-100">
                  Nombre del descubrimiento
                </span>
                <input
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  placeholder="Ej: Jazz en la terraza"
                  className="h-12 rounded-xl bg-white-8 px-4 font-body text-sm text-white-100 outline-none placeholder:text-white-40"
                />
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="font-body text-[13px] font-medium text-white-100">
                  Categoría
                </span>
                <div className="flex gap-2">
                  {(["Escena", "Cultura"] as CategoryTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCategoria(tab)}
                      className={`h-10 flex-1 rounded-xl font-body text-sm font-medium transition-colors ${
                        categoria === tab
                          ? "bg-white-100 text-thea-green"
                          : "bg-white-8 text-white-100 hover:bg-white-12"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="font-body text-[13px] font-medium text-white-100">
                  Cuéntanos brevemente de qué se trata
                </span>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Qué es, dónde pasa, cada cuánto..."
                  rows={4}
                  className="resize-none rounded-xl bg-white-8 px-4 py-3 font-body text-sm text-white-100 outline-none placeholder:text-white-40"
                />
              </label>

              <button
                onClick={enviar}
                disabled={!listoParaEnviar}
                className="mt-2 h-12 w-full rounded-xl bg-white-100 font-body text-[15px] font-semibold text-thea-green disabled:cursor-not-allowed disabled:opacity-40"
              >
                Enviar postulación
              </button>

              <p className="text-center font-body text-xs text-white-60">
                Esta es una demo: tu postulación no se envía a ningún
                servidor real.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
