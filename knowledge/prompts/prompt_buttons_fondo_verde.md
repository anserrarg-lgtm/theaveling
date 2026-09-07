Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

Crear una versión "— Fondo verde" del componente Button (COMPONENT_SET 1388:26, 22 variantes: Style=Primary/Secondary/Ghost/Icon × State), pensada para vivir sobre el fondo Thea Green (#112C2C) de la app — mismo patrón ya usado para Navigation ("Mobile Bottom Navigation — Fondo verde", etc.): clonar el component set completo, no reemplazar el original.

Reglas de color para la versión verde (sin stroke en ningún caso — Ana no quiere bordes):

**Primary** — el relleno sólido Thea Green actual desaparecería contra un fondo del mismo color. Invertir: relleno Off-white `#FBFBFB` (opacity 100%), texto Thea Green `#112C2C` (en vez de Off-white). Estados:
- Default: Off-white 100%
- Hover: Off-white 92%
- Pressed: Off-white 80%
- Focus: Off-white 96%
- Disabled: Off-white 30%, texto Thea Green al 40%
- Loading: igual que Default (Off-white 100%), mismo cambio de texto a "Reservando..." que ya tiene el original

**Secondary** — pasa de relleno+stroke Thea Green a solo relleno blanco con transparencia (escala "Blanco sobre Thea Green" de STACK.md), sin stroke:
- Default: fill blanco 8%
- Hover: fill blanco 14%
- Pressed: fill blanco 20%
- Focus: fill blanco 14%
- Disabled: fill blanco 4%
- Loading: fill blanco 8%
Texto e ícono en blanco (Off-white), no en Thea Green.

**Ghost** — ya no tiene fill en el original (solo aparece en Hover); mantener la misma lógica pero en blanco:
- Default/Pressed/Focus/Disabled: sin fill (como el original)
- Hover: fill blanco 8% (en vez del actual fill verde 5%)
Texto en blanco.

**Icon** — mismo criterio que Secondary, sin stroke (el original ya no tenía stroke):
- Default: fill blanco 8%
- Hover: fill blanco 14%
- Pressed: fill blanco 12%
- Focus: fill blanco 8%
- Disabled: fill blanco 6%
Ícono en blanco (Off-white) en vez de Thea Green.

Mantener toda la estructura, tipografía, tamaños y padding idénticos al original — el único cambio es de color (relleno, texto, íconos) y la eliminación de cualquier stroke.

Posicionar el nuevo component set clonado cerca del original (1388:26), con el nombre "Button — Fondo verde", sin superponerse con nada existente.

Verificación esperada al terminar
- Existen 22 variantes nuevas bajo "Button — Fondo verde", con la misma estructura que el original.
- Primary tiene relleno Off-white y texto Thea Green (invertido respecto al original).
- Secondary, Ghost e Icon usan relleno blanco con transparencia, sin stroke en ningún caso.
- El componente original "Button" (1388:26) no se modificó.
