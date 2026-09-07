# Prompt — Corregir fondo/card faltante en 4 iconos de la galería

Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

## Problema

En "01.5 — Icons" → "Icon Grid" (`1483:121`), los 18 iconos originales tienen un frame wrapper con fondo y padding — ejemplo de referencia, "Heart" (`1483:122`):
- `layoutMode: VERTICAL`, `itemSpacing: 10`
- `padding: 16` en los 4 lados
- `primaryAxisAlignItems: MIN`, `counterAxisAlignItems: CENTER`
- `fills`: SOLID, color `{r: 0.9843137, g: 0.9843137, b: 0.9843137}` (Off-white #FBFBFB), opacity 1
- `cornerRadius: 12`

4 iconos agregados en sesiones más recientes no replican ese wrapper — están sin fondo y con distintos valores de padding/spacing/alineación entre sí:

- **Share** (`1525:122`): `fills: []`, `cornerRadius: 0`, padding `0/0/0/0` (debería ser 16 en los 4 lados), `itemSpacing: 10` (correcto).
- **Compass** (`1546:161`): `fills: []`, `cornerRadius: 0`, padding ya está en 16 (correcto), `itemSpacing: 10` (correcto).
- **Ticket** (`1546:166`): mismo caso que Compass — `fills: []`, `cornerRadius: 0`, padding ya en 16, `itemSpacing: 10`.
- **Map** (`1594:298`): `fills: []`, `cornerRadius: 0`, padding `0/0/0/0` (debería ser 16), `itemSpacing: 8` (debería ser 10), `primaryAxisAlignItems: CENTER` (debería ser MIN, igual que el resto).

## Fix

Para los 4 frames (`1525:122`, `1546:161`, `1546:166`, `1594:298`), igualar exactamente las propiedades de Heart (`1483:122`):
- `fills`: `[{ type: 'SOLID', color: { r: 0.9843137264251709, g: 0.9843137264251709, b: 0.9843137264251709 }, opacity: 1 }]`
- `cornerRadius: 12`
- `paddingLeft/Top/Right/Bottom: 16`
- `itemSpacing: 10`
- `primaryAxisAlignItems: 'MIN'`
- `counterAxisAlignItems: 'CENTER'`

No tocar los hijos (`icon/share`, `icon/compass`, `icon/ticket`, `icon/map` INSTANCE + label TEXT) — solo las propiedades del frame contenedor. No tocar ningún otro ícono de la grilla (los 18 originales ya están bien).

## Verificación esperada

Los 4 iconos (Share, Compass, Ticket, Map) se ven visualmente idénticos en tratamiento a los otros 18 — mismo fondo, mismo radio, mismo padding — dentro de "Icon Grid".
