import { createContext, useContext, useState, type ReactNode } from "react";
import type { CategoryTab } from "../components/CategoryTabs";

/*
 * DescubrirTabContext — 2026-09-10, a pedido de Ana ("porque la app se
 * abre en Escena o Cultura?? se tiene que abrir en Todo").
 *
 * Bug real: la pestaña activa de Descubrir (Todo/Escena/Cultura) se
 * guardaba en `localStorage` (ver la nota vieja, 2026-09-07, que queda
 * documentada abajo en Descubrir.tsx) para que el botón "volver" desde
 * el Detalle de una experiencia respetara la pestaña de la que se venía
 * — Descubrir se desmonta al entrar a Detalle y se vuelve a montar al
 * volver, así que sin persistir el dato se perdía. Pero `localStorage`
 * sobrevive también a un reload/apertura de cero de la app — con eso, la
 * ÚLTIMA pestaña usada en cualquier visita anterior quedaba como la
 * pestaña de arranque, que es justo lo que Ana no quiere: la app SIEMPRE
 * debe abrir en "Todo", solo debe recordar la pestaña al volver de un
 * detalle DENTRO de la misma sesión.
 *
 * Solución: mover el estado a un Context que vive en `Layout`
 * (router.tsx) — ese componente NO se desmonta al navegar a Detalle y
 * volver (la navegación es interna de React Router, `Layout` sigue
 * montado todo el tiempo), así que el valor sobrevive exactamente a esas
 * idas y vueltas. Pero si se recarga la página o se abre la app de cero,
 * todo React se reinicia desde cero — el Provider vuelve a arrancar con
 * su valor por defecto ("Todo"), sin depender de nada guardado. Con esto
 * ya no hace falta `localStorage` para este dato.
 */
const DescubrirTabContext = createContext<{
  activeCategory: CategoryTab;
  setActiveCategory: (tab: CategoryTab) => void;
} | null>(null);

export function DescubrirTabProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("Todo");
  return (
    <DescubrirTabContext.Provider value={{ activeCategory, setActiveCategory }}>
      {children}
    </DescubrirTabContext.Provider>
  );
}

export function useDescubrirTab() {
  const ctx = useContext(DescubrirTabContext);
  if (!ctx) {
    throw new Error("useDescubrirTab debe usarse dentro de DescubrirTabProvider");
  }
  return ctx;
}
