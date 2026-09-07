Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

1. Arreglar el destello (rombo) descentrado del icon/compass

El componente icon/compass (1546:154) tiene un anillo (Ellipse, 1546:155) y un rombo interior (Rectangle rotado 45°, 1546:156, "el destello"). Medido con precisión: el centro del anillo está en X absoluto 1753, el centro del rombo está en X absoluto 1752.596 — 0.404px corrido hacia la izquierda (en Y ya están perfectamente alineados, sin diferencia).

Fix: mover el Rectangle 1546:156 en +0.404px en X (su relativeTransform actual tiene tx=5 en el eje local; cambiar a tx≈5.404, o el equivalente en x/y absoluto según cómo se acceda). Verificar después que absoluteBoundingBox center X del rectángulo quede en ~1753, igual que el del ellipse.

2. Reemplazar el contenido de 14 iconos por su versión "light" ya pegada en el canvas

Recién until ahora los 22 iconos del sistema (excepto icon/compass, icon/ticket, icon/map) usaban un estilo de relleno sólido "regular/bold". Ana pegó versiones "light" (Phosphor, weight light) como frames de 256×256px sueltos en el canvas, cada uno con un solo Vector hijo, relleno negro sólido.

Receta general para cada uno de los 14 pares abajo:
- Tomar el Vector hijo del frame "-light" correspondiente (frameId/vectorId de la tabla).
- Clonarlo, escalar TODO (x, y, width, height) por un factor de 20/256 = 0.078125 — esto preserva exactamente la misma proporción/padding que ya tiene dentro del frame de 256px, ahora dentro del frame de 20px del ícono.
- Cambiar el fill del clon a color sólido {r: 0.0661979, g: 0.1708333, b: 0.1708333} (Thea Green, mismo valor exacto que ya usa el resto del sistema), opacity 1.
- Eliminar el Vector actual (childId de la tabla) del componente master (masterId de la tabla).
- Agregar el clon escalado y recoloreado como nuevo hijo del master, en la misma posición relativa (0,0 respecto al frame de 20×20, ya que el escalado por 20/256 preserva el padding original).
- No crear componentes nuevos ni cambiar el masterId — se edita el contenido del componente existente para que todas las instancias ya usadas en el archivo se actualicen solas.

Tabla (nombre del ícono actual → master a editar → child a reemplazar → frame/vector "light" origen):

icon/heart → master 1483:2 → child actual 1483:3 → origen frame 1604:510 / vector 1604:511
icon/calendar → master 1483:6 → child actual 1483:7 → origen frame 1604:606 / vector 1604:607
icon/check → master 1483:24 → child actual 1483:25 → origen frame 1607:614 / vector 1607:615
icon/clock → master 1488:71 → child actual 1491:74 → origen frame 1607:616 / vector 1607:617
icon/search → master 1483:4 → child actual 1483:5 → origen frame 1607:624 / vector 1607:625
icon/map-pin → master 1483:18 → child actual 1483:19 → origen frame 1607:626 / vector 1607:627
icon/share → master 1522:124 → child actual 1522:125 → origen frame 1607:630 / vector 1607:631
icon/plus → master 1483:12 → child actual 1483:13 → origen frame 1607:632 / vector 1607:633
icon/minus → master 1483:28 → child actual 1483:29 → origen frame 1607:634 / vector 1607:635
icon/building → master 1483:16 → child actual 1483:17 → origen frame 1607:636 / vector 1607:637
icon/caret-down → master 1483:26 → child actual 1483:27 → origen frame 1607:638 / vector 1607:639
icon/star → master 1483:20 → child actual 1483:21 → origen frame 1607:640 / vector 1607:641
icon/close → master 1483:14 → child actual 1483:15 → origen frame 1607:642 / vector 1607:643

(icon/chat-circle y icon/dots-three-vertical quedan pendientes de confirmación con Ana antes de tocarlos — no incluir en esta corrida.)

NO tocar en esta corrida: icon/compass (solo el fix del punto 1), icon/ticket, icon/map, icon/user, icon/caret-right, icon/caret-left — no tienen versión "light" pegada todavía.

Los 18 frames "-light" originales (1604:510, 1604:606, 1607:608 a 1607:642) pueden quedar en el canvas donde están, o moverse a un área de "sobrantes/referencia" fuera de las secciones del Design System — no borrarlos, por si hacen falta para los pendientes (chat-circle, dots-three, y los 3 sin ícono actual: arrow-up-light, faders-horizontal-light, gear-light).

Verificación esperada al terminar
- Los 14 iconos de la tabla se ven visualmente en estilo "light" (trazo fino) en vez del estilo sólido anterior, en todas las instancias donde se usan (Icon Grid, Navigation, Cards, etc. — se actualizan solas al ser instancias del mismo componente).
- El destello del icon/compass queda centrado con el anillo.
- icon/chat-circle, icon/dots-three-vertical, icon/ticket, icon/map, icon/user, icon/caret-right, icon/caret-left quedan exactamente como estaban — sin tocar.
