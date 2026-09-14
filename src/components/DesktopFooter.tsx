import { Link } from "react-router-dom";
import Wordmark from "./Wordmark";

/*
 * DesktopFooter — 2026-09-11, a pedido de Ana. Mandó 3 capturas de
 * referencia (Fever, Airbnb, MUBI) preguntando cuál convenía para
 * Theaveling. Fever/Airbnb tienen footers enormes porque tienen varios
 * públicos reales detrás (organizadores, agencias, empresas, prensa,
 * postulantes) — Theaveling todavía no tiene nada de eso construido, así
 * que copiar ese tamaño de footer sería llenarlo de links a pantallas que
 * no existen. Se sigue el criterio de MUBI en cambio: un footer chico,
 * con solo lo que Theaveling realmente tiene hoy. Nada de
 * "Corporativo"/"Prensa"/"Carreras" inventado.
 *
 * 2026-09-11 (segunda vuelta) — Ana: "podemos hacer un poco mas elavarado?
 * no mucho un poquito mas". La primera versión era una sola fila (wordmark
 * + 3 links + copyright). Para darle más cuerpo SIN inflarlo con negocio
 * inventado, se suma:
 * - Bajada bajo el wordmark: se reusa el tagline real que ya existe en
 *   InstalarApp.tsx ("La escena de la ciudad empieza aquí.") en vez de
 *   escribir una frase nueva — mismo criterio de no inventar copy de
 *   marca que no está ya establecido.
 * - Columna "Explora": en vez de una sección de negocio falsa, son 3
 *   rutas que YA EXISTEN de verdad en la app (Descubrir/Reservas/Centro
 *   de ayuda) — mismo espíritu que la columna "Descubre" de la
 *   referencia de Fever, pero con contenido real de Theaveling en vez de
 *   inventado.
 * - Columna "Legal": los mismos 3 links de antes, ahora con encabezado
 *   (mismo patrón visual que las 3 referencias, que agrupan sus links
 *   bajo un título de columna).
 *
 * Redes sociales — se sigue sin agregar: Theaveling no tiene cuentas
 * reales, poner íconos sin destino real es peor que no ponerlos.
 *
 * Legal sin contenido real — ver Legal.tsx: placeholder honesto en vez
 * de inventar letra chica.
 *
 * Solo Desktop — vive acá, no en mobile (regla de esta sesión: no tocar
 * mobile sin que Ana lo pida explícito). Se monta una sola vez, al final
 * del bloque Desktop de Descubrir.tsx, no en cada tab.
 *
 * `mt-auto` (SACADO 2026-09-11) — se había agregado junto con
 * `min-h-screen`+`flex-col` en el wrapper de Descubrir.tsx para que en
 * pestañas con poco contenido (Escena/Cultura) el footer quedara pegado
 * al borde real de la pantalla. Ana reportó un bloque oscuro vacío
 * apareciendo DEBAJO del footer (con scroll de más) — ver la nota grande
 * en Descubrir.tsx. Se sacó el mecanismo completo por ese lado; acá
 * también se saca `mt-auto` porque ya no está dentro de un contenedor
 * flex — el footer ahora simplemente sigue al contenido, sin colchón.
 *
 * 2026-09-11 (tercera vuelta) — Ana: "no quiero esas lineas tampoco, solo
 * pon ese bloque despegadado de contenido y que sea del verde mas claro
 * de thea". Antes el footer se separaba del contenido con dos líneas
 * (`border-t border-white-12`, una arriba del todo y otra antes del
 * copyright). Ana no quiere líneas — quiere que el bloque entero se
 * distinga por color, no por borde. Se saca `border-t` de los dos
 * lugares y el `<footer>` pasa a usar `bg-thea-green` (el verde MÁS
 * CLARO del tema, distinto del fondo sólido `rgb(1,20,20)` del resto de
 * Desktop) de pared a pared — así el bloque se lee "despegado" del
 * contenido de arriba por ser un panel de color propio, sin necesitar
 * ninguna línea divisoria. El ancho de página (`max-w-[1440px]` +
 * padding) se mueve a un `<div>` interno para que el color de fondo siga
 * ocupando todo el ancho de la pantalla.
 */
function ColumnaFooter({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-body text-[11px] font-semibold uppercase tracking-[1px] text-white-100">
        {titulo}
      </span>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export default function DesktopFooter() {
  const anio = new Date().getFullYear();
  const linkClass = "font-body text-[13px] text-white-60 hover:text-white-100";

  return (
    <footer className="w-full bg-thea-green">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-20 py-14">
        <div className="flex items-start justify-between gap-16">
          <div className="flex max-w-[280px] flex-col gap-3">
            <Wordmark size={26} color="var(--color-white-100)" />
            <p className="font-body text-[13px] text-white-60">
              La escena de la ciudad empieza aquí.
            </p>
          </div>

          <div className="flex gap-20">
            <ColumnaFooter titulo="Explora">
              <Link to="/" className={linkClass}>
                Descubrir
              </Link>
              <Link to="/reservas" className={linkClass}>
                Mis reservas
              </Link>
              <Link to="/perfil/ayuda" className={linkClass}>
                Centro de ayuda
              </Link>
            </ColumnaFooter>

            <ColumnaFooter titulo="Legal">
              <Link to="/terminos" className={linkClass}>
                Términos de uso
              </Link>
              <Link to="/privacidad" className={linkClass}>
                Política de privacidad
              </Link>
              <Link to="/cookies" className={linkClass}>
                Gestión de cookies
              </Link>
            </ColumnaFooter>
          </div>
        </div>

        <p className="font-body text-[13px] text-white-40">
          © {anio} Theaveling
        </p>
      </div>
    </footer>
  );
}
