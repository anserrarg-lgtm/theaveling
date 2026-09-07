Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

1. Corregir alineación de Category Tabs (no tocar Sub-category Tabs — ese sí está pensado para scroll y su alineación actual es correcta)

Los 3 ítems de Category Tabs (Todo/Escena/Cultura) están empaquetados a la izquierda (`primaryAxisAlignItems: MIN`) dentro de un contenedor de 390px fijo, dejando un espacio vacío grande a la derecha porque el contenido siempre es más angosto que el contenedor. Cambiar a `primaryAxisAlignItems: SPACE_BETWEEN` para que los 3 ítems se distribuyan a lo ancho del contenedor, en estas 6 variantes:

Category Tabs (blanca, 1552:214): Active=Todo (1552:184), Active=Escena (1552:194), Active=Cultura (1552:204)
Category Tabs — Fondo verde (1582:355): Active=Todo (1582:356), Active=Escena (1582:366), Active=Cultura (1582:376)

2. Corregir color en "categoría-theaveling-cards" (desktop + mobile) — blanco puro en vez de Off-white de marca

Las cards de "Más reservados" y "Descubrimientos" en estos dos frames sueltos (1405:90 desktop, 1407:4 mobile) usan relleno blanco puro `#FFFFFF` (r:1, g:1, b:1) al 6% de opacidad. El blanco de marca de Theaveling es `#FBFBFB` (r:0.9843137, g:0.9843137, b:0.9843137), no blanco puro — corregir el color base de esas cards a `#FBFBFB`, manteniendo la misma opacidad (6%). Aplicar a todas las cards con ese mismo patrón de relleno dentro de ambos frames (buscar todos los fills con color {r:1,g:1,b:1} y reemplazar por {r:0.9843137264251709, g:0.9843137264251709, b:0.9843137264251709}).

Verificación esperada al terminar
- Los 3 ítems de Category Tabs (blanca y verde) se distribuyen a lo ancho del contenedor de 390px, sin espacio vacío grande a la derecha.
- Sub-category Tabs no se tocó.
- Todas las cards de "categoría-theaveling-cards" (desktop y mobile) usan #FBFBFB en vez de #FFFFFF.
