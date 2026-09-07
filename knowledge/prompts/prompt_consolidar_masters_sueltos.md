Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

Contexto: hay 5 componentes maestros sueltos en el canvas, en dos grupos separados. Grupo A, cerca de un texto título "COMPONENTES" (node 1555:258, en x=1487, y=11706, fontSize 100): icon/share (1522:124, en x=1743,y=11987), icon/compass (1546:154, en x=1743,y=12049), icon/ticket (1546:157, en x=1743,y=12021). Grupo B, suelto cerca del origen del canvas, sin relación visual con el Grupo A: icon/map (1594:293, en x=0,y=0) y Reservation Card (1594:349, COMPONENT_SET, en x=36,y=0).

Acción: unificar todo en una sola zona ordenada, bajo el mismo título "COMPONENTES" que ya existe. No es necesario mover estos componentes a otra parte del archivo — el punto es que dejen de estar dispersos.

1. Mover icon/map (1594:293) y Reservation Card (1594:349) desde el origen del canvas hasta el Grupo A, cerca de icon/share, icon/compass e icon/ticket.

2. Reacomodar los 4 iconos en una fila prolija, alineados en Y, con espaciado consistente (por ejemplo 40px entre cada uno), en este orden: icon/share, icon/compass, icon/ticket, icon/map. Ubicar esta fila debajo del título "COMPONENTES" (que termina en y=11828), por ejemplo empezando en x=1487, y=11850.

3. Ubicar Reservation Card (557×177px) debajo de esa fila de iconos, con un margen razonable (30-40px), por ejemplo en x=1487, y=11900 aproximadamente — ajustar si se superpone con algo.

4. Agregar un texto corto debajo o al lado, aclarando qué es esta zona — algo como: "Masters de componentes — no editar acá. Las instancias reales y usables están en 02 — Components → Cards (cards) y en 02.1 — Navigation / 02.2 — Tabs (iconos usados en navegación)." Usar un estilo de texto pequeño (14px), igual al resto de las notas/anotaciones que ya existen en el archivo (buscar el estilo usado en otras notas tipo "⚠ Interacción pendiente..." como referencia de tamaño/color).

No tocar las instancias reales ya usadas en 07 — Reservas, Navigation, ni en ninguna otra pantalla — esto es solo reorganización de los componentes maestros sueltos, no afecta dónde se usan.

Verificación esperada al terminar
- Los 5 componentes (icon/share, icon/compass, icon/ticket, icon/map, Reservation Card) están todos juntos, cerca del título "COMPONENTES", en una fila/zona prolija — nada suelto cerca del origen del canvas (0,0).
- Hay una nota de texto explicando qué es esa zona.
- Ninguna instancia real en el resto del archivo se movió ni se rompió.
