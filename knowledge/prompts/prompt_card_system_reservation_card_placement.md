# Prompt — Ubicar Reservation Card real en Card Components + corregir conteo

Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

## 1. Mover el componente real Reservation Card a "02 — Components → Cards"

El COMPONENT_SET real "Reservation Card" (node `1594:349`, variantes `Status=Próxima` / `Status=Pasada`) está huérfano en el canvas — parentado directo a la página, cerca del origen (x=36, y=0), sin envoltorio ni ubicación dentro de ninguna sección.

Los otros 6 tipos de card reales viven en la franja "Card Components" (node `1499:118`, dentro de "02 — Components"), como el 7º hijo de ese frame (layoutMode HORIZONTAL, itemSpacing 32). Cada uno está envuelto en un frame de 360px de ancho (VERTICAL, itemSpacing 14, counterAxisSizingMode FIXED, primaryAxisSizingMode AUTO) que contiene:
1. Un bloque de encabezado/label (ver el patrón exacto del hijo "Group 2" dentro de `1549:235`, el wrapper de Booking Summary Card, como referencia).
2. Un frame de 360px de ancho con una instancia del componente real adentro.

Replicar ese mismo patrón para Reservation Card:
- Crear un frame wrapper "Reservation Card" (360px de ancho, mismas propiedades de auto-layout que los otros 6 wrappers dentro de `1499:118`).
- Adentro, un encabezado/label igual en estilo tipográfico al de los otros wrappers (usar "Reservation Card" como título).
- Debajo, una instancia del componente real (usar la variante `Status=Próxima` como la que se muestra por defecto, ya que es el caso de uso principal).
- Agregar este wrapper como 7º hijo de `1499:118` (Card Components), respetando el itemSpacing de 32px que ya usa la franja.
- El COMPONENT_SET original (`1594:349`) puede quedar donde está como master (los otros componentes maestros también suelen vivir aparte de sus instancias mostradas) — lo importante es que la franja "Card Components" muestre una instancia real y visible del componente, igual que hace con los otros 6.

No mover ni tocar las instancias reales de Reservation Card que ya están en uso en "07 — Reservas" (`1594:350`, `1594:379`, `1594:408`, `1594:423`) — esas ya están bien.

## 2. Corregir conteo desactualizado en la ficha de Booking Summary Card

En "04 — Card System" → "Booking Summary Card — Ficha completa" (`1539:151`), el texto del node `1539:153` empieza con:

> "Anatomía — Obligatorio: ... Es la única de las **6** cards con una acción primaria incrustada..."

Ahora la familia tiene 7 tipos (ya corregido en el resto de la documentación — "Familia de Tarjetas" ya dice "siete tipos"). Cambiar "las 6 cards" por "las 7 cards" en ese texto, sin tocar el resto del párrafo. (Seguir el patrón de edición de texto: cargar la fuente actual del nodo antes de mutar `characters`.)

## Verificación esperada al terminar

- La franja "Card Components" (`1499:118`) tiene 7 hijos, el último llamado "Reservation Card", con la misma estructura visual que los otros 6.
- El texto de Booking Summary Card dice "las 7 cards", no "las 6 cards".
- Ningún otro texto ni componente tocado.
