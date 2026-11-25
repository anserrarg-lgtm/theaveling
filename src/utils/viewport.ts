/*
 * Vista forzada por query param — 2026-11-26, a pedido de Ana.
 *
 * Contexto: hoy toda la app decide mobile vs Desktop mirando SOLO el ancho
 * de la ventana (`matchMedia("(min-width: 1024px)")`, el breakpoint `lg`).
 * Eso significa que un link "no es de mobile ni de Desktop": el mismo link
 * se ve de una u otra forma según el ancho del navegador donde se abra.
 *
 * Este módulo agrega la opción de pedir EXPLÍCITAMENTE una de las dos
 * versiones con un query param, para poder compartir dos links distintos:
 *
 *   https://…/?vista=desktop   → siempre la versión Desktop
 *   https://…/?vista=mobile    → siempre la versión mobile
 *   https://…/                 → automático por ancho (comportamiento de siempre)
 *
 * Cómo funciona (dos mitades que tienen que ir juntas):
 *  1. CSS: se pone `data-vista="desktop"|"mobile"` en <html> y el breakpoint
 *     `lg` de Tailwind queda redefinido en index.css para responder también
 *     a ese atributo (no solo al ancho). Sin eso, forzar Desktop en un
 *     celular dejaría el layout mobile aunque el JS creyera lo contrario.
 *  2. JS: `esDesktop()` (abajo) respeta el mismo atributo — así las
 *     decisiones de JS (saltar Onboarding, saltar pantalla de instalar,
 *     el redirect de Favoritos) coinciden exactamente con el CSS.
 *
 * El atributo se aplica UNA vez al arrancar (ver `aplicarVistaForzada()` en
 * main.tsx) y queda como fuente de verdad durante toda la sesión: si el
 * usuario navega dentro de la app y el `?vista=` se pierde de la URL (los
 * `<Link>` internos no lo arrastran), la vista forzada sigue aplicando.
 */

export type VistaForzada = "mobile" | "desktop";

const PARAM = "vista";

/** Lee `?vista=` de la URL. Devuelve null si no está o no es un valor válido. */
function leerVistaDeUrl(): VistaForzada | null {
  try {
    const valor = new URLSearchParams(window.location.search).get(PARAM);
    if (valor === "mobile" || valor === "desktop") return valor;
  } catch {
    // URLSearchParams no debería fallar, pero por las dudas no rompemos.
  }
  return null;
}

/**
 * Aplica la vista forzada al <html> (o la limpia si no hay param).
 * Llamar antes de renderizar (ver main.tsx) para que el primer paint ya
 * salga con la vista correcta, sin parpadeo.
 */
export function aplicarVistaForzada(): void {
  const forzada = leerVistaDeUrl();
  if (forzada) {
    document.documentElement.dataset.vista = forzada;
  } else {
    delete document.documentElement.dataset.vista;
  }
}

/** La vista forzada vigente en esta sesión (o null si no se forzó ninguna). */
export function leerVistaForzada(): VistaForzada | null {
  const enHtml = document.documentElement.dataset.vista;
  if (enHtml === "mobile" || enHtml === "desktop") return enHtml;
  return leerVistaDeUrl();
}

/**
 * ¿Estamos en la versión Desktop? Si hay una vista forzada manda esa;
 * si no, cae al comportamiento de siempre (ancho de ventana >= 1024px).
 *
 * Mismo breakpoint `lg` (1024px) que ya usan Descubrir.tsx, App.tsx,
 * router.tsx y Favoritos.tsx — ahora todos a través de esta única función.
 */
export function esDesktop(): boolean {
  const forzada = leerVistaForzada();
  if (forzada) return forzada === "desktop";
  return window.matchMedia("(min-width: 1024px)").matches;
}
