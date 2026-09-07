Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

Esto reemplaza los intentos anteriores. El Reservation Card tiene que quedar FÍSICAMENTE adentro de "02 — Components → Cards" (fila "Card Components", node 1499:118), igual que Experience Card, Curated/Featured Card, Supporting Card y Artist/Space Card — cuyo componente maestro real vive directamente adentro de esa fila, no como instancia de algo que vive afuera. No cerca de los iconos sueltos, no en ninguna zona de "masters" — adentro de la sección del Design System a la que pertenece.

Estado actual (a corregir):
- El COMPONENT_SET real "Reservation Card" (1594:349, variantes Status=Próxima / Status=Pasada, 557×177px) sigue afuera del frame "THEAVELING — DESIGN SYSTEM" (que va de x=3165 a x=6903) — está en x=1711, y=11534, junto a otros componentes sueltos.
- Adentro de la fila "Card Components" (1499:118) ya existe un wrapper "Reservation Card" (1605:380) con un label (Group, 1605:383) y una instancia (1605:385, instancia de una variante del COMPONENT_SET externo) — pero esto no sigue el patrón de los otros 4 cards mencionados arriba.

Acción:
1. Mover el COMPONENT_SET real (1594:349) desde su posición actual (x=1711, y=11534) hasta adentro de "02 — Components → Cards", como reemplazo del wrapper actual.
2. Borrar el contenido actual del wrapper 1605:380 que muestra la instancia (el frame 1605:384 con la instancia 1605:385 adentro) — ya no hace falta, el componente real va a estar ahí directamente.
3. Reusar el label existente (Group 1605:383, que ya tiene el título "Reservation Card" y su descripción) y ponerlo arriba del COMPONENT_SET real, dentro del mismo wrapper 1605:380 — mismo patrón vertical que usan los otros wrappers de la fila (label arriba, card/componente abajo).
4. El wrapper 1605:380 sigue siendo el 7° hijo de la fila "Card Components" (1499:118), en la misma posición donde está ahora — solo cambia qué hay adentro (el componente real en vez de una instancia).
5. Si el COMPONENT_SET (557px de ancho, mostrando las 2 variantes lado a lado) no encaja con el ancho de 360px que usan los otros wrappers, está bien que sea más ancho — no fuerces el tamaño, dejalo mostrar las 2 variantes completas.

Verificación esperada al terminar
- El componente real "Reservation Card" (1594:349) ya NO existe fuera del frame "THEAVELING — DESIGN SYSTEM" — su absoluteBoundingBox.x está entre 3165 y 6903.
- Está físicamente adentro de la fila "Card Components" (1499:118), como 7° elemento, con su label arriba.
- No queda ninguna instancia "puente" apuntando hacia afuera — el componente que se ve en la fila ES el maestro real, directamente.
- El resto de la fila (los otros 6 cards) no se tocó.
