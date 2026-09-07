import { useState } from "react";
import { Link } from "react-router-dom";
import MobileTopBar from "../../components/MobileTopBar";
import CategoryTabs, { type CategoryTab } from "../../components/CategoryTabs";
import LocationSheet from "../../components/LocationSheet";
import MobileBottomNav from "../../components/MobileBottomNav";
import ExperienceCardCurado from "../../components/cards/ExperienceCardCurado";
import ExperienceCardMasReservados from "../../components/cards/ExperienceCardMasReservados";
import ExperienceCardDescubrimientos from "../../components/cards/ExperienceCardDescubrimientos";
import VerMasCard from "../../components/cards/VerMasCard";
import { IconCaretRight } from "../../components/icons";
import { getExperiencesByRail } from "../../data/experiences";

/*
 * Descubrir (mobile) — reconstruido el 2026-08-31 a partir de la Home
 * REAL ya ensamblada en Figma (`home-mobile`, `2122:960`), no de la
 * descripción de ARCHITECTURE.md. Orden real, de arriba a abajo:
 * Mobile Top Bar → Category Tabs → encabezado "Curado por Theaveling" →
 * card Curado (hero a sangre) → riel "Más reservados" → riel
 * "Descubrimientos" → Bottom Navigation.
 *
 * Las Sub-category Tabs (debajo de Category Tabs) se sacaron de acá:
 * no existen construidas en Figma (buscado a fondo, ver PENDIENTES.md) y
 * la versión inventada en código no llevaba a ningún lado. El componente
 * queda guardado en SubCategoryTabs.tsx para retomar cuando haya spec
 * real. Contenido de ejemplo: Bogotá (STACK.md, ciudad de referencia).
 *
 * Data-driven — 2026-09-02: las 3 secciones ahora leen de
 * `data/experiences.ts` (12 experiencias reales, inconsistencias de
 * Figma resueltas con Ana) en vez de placeholders/loops genéricos, y
 * cada card navega a `/experiencia/:id` (react-router `Link`) — antes
 * tocar una card no hacía nada.
 *
 * 2026-09-04, a pedido de Ana: se sacó la fila de Ubicación (ícono +
 * "Bogotá" subrayado, antes debajo de Category Tabs) — "no lo quiero
 * ahi, quiero SOLO el icono al lado de la lupa". El ícono pasó al Top
 * Bar (ver MobileTopBar.tsx) y ahora abre `LocationSheet`, un bottom
 * sheet parecido a la referencia que mandó (selector de ubicación de
 * Uber) pero adaptado a lo que la app realmente tiene y a cómo opera:
 * Theaveling es curaduría de nicho a nivel CIUDAD, no un servicio de
 * cercanía por barrio (Ana: "thea actua en la ciudad completa y ya"),
 * así que el sheet es un selector de ciudad (hoy solo Bogotá es real,
 * el resto aparece como "Próximamente" — ver esa nota grande en
 * LocationSheet.tsx).
 */

export default function Descubrir() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("Todo");
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);

  const curado = getExperiencesByRail("curado");
  const masReservados = getExperiencesByRail("mas-reservados");
  const descubrimientos = getExperiencesByRail("descubrimientos");

  return (
    <div className="min-h-screen bg-thea-green pb-[72px]">
      {/* Top Bar + Category Tabs suspendidas (fixed) arriba, como un solo
          bloque de header — 2026-09-02, a pedido de Ana: Category Tabs es
          navegación que se usa en cualquier momento, no contenido de una
          sola lectura, mismo criterio que el Bottom Nav. pt-[96px] en el
          contenedor de abajo compensa su alto combinado (56+40px). */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <MobileTopBar onLocationClick={() => setLocationSheetOpen(true)} />
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>
      <LocationSheet
        open={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
      />
      <div className="pt-[calc(96px+var(--safe-top))]">
        <main className="flex flex-col gap-8 pt-6 pb-8">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-5">
              <h2 className="font-display text-lg text-white-100">
                Curado por Theaveling
              </h2>
              <IconCaretRight className="text-white-60" />
            </div>
            {/* Sin padding acá a propósito: las cards Curado van a sangre
                (edge-to-edge), spec real de Figma (`1753:518`) — a
                diferencia de los rieles de abajo, que sí tienen margen.
                2026-09-02: son 3 cards apiladas (no 1), con un +20 debajo
                indicando que hay más picks curados que no se muestran acá. */}
            <div className="flex flex-col gap-6">
              {curado.map((exp) => (
                <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                  <ExperienceCardCurado
                    id={exp.id}
                    title={exp.title}
                    description={exp.description}
                    imageUrl={exp.imageUrl}
                  />
                </Link>
              ))}
            </div>
            {/* Alineado a la derecha (no centrado) y en blanco (no mint) —
                2026-09-02, a pedido de Ana. Dos líneas: "+20" grande y en
                light (font-display, mismo criterio que el comentario de
                index.html — Thin/Light reservado a Display en tamaños
                grandes) arriba, "Más Curados" chico y subrayado abajo
                (única señal de que es clickeable, sin flechita). */}
            <button className="flex flex-col items-end gap-0 py-1 pr-5">
              <span className="font-display font-light text-2xl leading-none text-white-100">
                +10
              </span>
              <span className="font-body font-semibold text-[11px] text-white-100 underline">
                Más Curados
              </span>
            </button>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-5">
              <h2 className="font-display text-lg text-white-100">
                Más reservados
              </h2>
              <IconCaretRight className="text-white-60" />
            </div>
            <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
              {masReservados.map((exp) => (
                <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                  <ExperienceCardMasReservados
                    id={exp.id}
                    tag={exp.tag}
                    title={exp.title}
                    description={exp.description}
                    venue={exp.venue}
                    city={exp.city}
                    rating={exp.rating}
                    price={exp.price}
                    imageUrl={exp.imageUrl}
                    mostrarDesde={exp.mostrarDesde}
                  />
                </Link>
              ))}
              <VerMasCard
                width={268}
                height={368}
                count={15}
                imageUrl="/assets/images/ver%20mas%20-%20reservados.jpg"
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-5">
              <h2 className="font-display text-lg text-white-100">
                Descubrimientos
              </h2>
              <IconCaretRight className="text-white-60" />
            </div>
            <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
              {descubrimientos.map((exp) => (
                <Link key={exp.id} to={`/experiencia/${exp.id}`}>
                  <ExperienceCardDescubrimientos
                    id={exp.id}
                    tag={exp.tag}
                    title={exp.title}
                    venue={exp.venue}
                    city={exp.city}
                    imageUrl={exp.imageUrl}
                  />
                </Link>
              ))}
              <VerMasCard
                width={300}
                height={310}
                count={40}
                imageUrl="/assets/images/ver%20mas-descubrimientos.png"
              />
            </div>
          </section>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <MobileBottomNav />
      </div>
    </div>
  );
}
