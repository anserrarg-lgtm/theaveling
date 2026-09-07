# Theaveling — app

Proyecto de código real de Theaveling. Vive junto a `knowledge/`, que sigue siendo la fuente de verdad de producto/diseño — este proyecto la traduce a código, no la reemplaza.

## Stack

- **React 19 + TypeScript** (Vite)
- **Tailwind CSS 4** (config CSS-first en `src/index.css`, sin `tailwind.config.js`)
- **React Router** para las rutas del flujo principal

## Cómo correrlo

```
npm install
npm run dev
```

Abre en `http://localhost:5173`.

## Estructura

```
src/
  index.css          ← design tokens (colores, opacidades, tipografía) — ver STACK.md
  router.tsx          ← rutas del flujo principal
  screens/             ← una carpeta por pantalla real del Sitemap
    Descubrir/
    DetalleExperiencia/
    Compra/
    Confirmacion/
  components/          ← piezas reutilizables (Wordmark, LocationIndicator, ...)
```

## Orden de construcción

Decidido con Ana (2026-08-31): **flujo principal primero** — Descubrir → Detalle de experiencia → Compra → Confirmación — antes que Login/Onboarding/Perfil. Es el corazón del producto según CASE_STUDY.md.

Las pantallas ya scaffoldeadas son **placeholders estructurales**: siguen la anatomía documentada en `knowledge/ARCHITECTURE.md` (qué bloques van, en qué orden), pero todavía no tienen el detalle visual pixel-perfect de Figma ni contenido real. Se completan pantalla por pantalla, no todas de una vez.

## Reglas de tokens (no negociable)

Ningún color ni opacidad se escribe "a mano" en un componente (`rgba(...)`, hex suelto). Todo color/opacidad vive en `src/index.css` como token de Tailwind (`@theme`), igual que se está corrigiendo en Figma con las variables `White/<N>` — ver STACK.md, "Nota real (2026-08-31)".
