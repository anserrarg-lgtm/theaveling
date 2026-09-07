Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

1. Borrar el vector viejo que quedó duplicado en 12 iconos

La corrida anterior agregó el vector "light" nuevo pero no borró el vector original — quedaron los dos adentro del mismo componente, superpuestos. Borrar SOLO el vector viejo (el id de "childIdOld" abajo) en cada uno de estos 12 masters, dejando únicamente el vector nuevo (el que ya tiene las dimensiones escaladas ~20/256, más chico y más fino):

icon/heart → master 1483:2 → borrar 1483:3 (dejar 1612:435)
icon/calendar → master 1483:6 → borrar 1483:7 (dejar 1612:436)
icon/check → master 1483:24 → borrar 1483:25 (dejar 1612:437)
icon/clock → master 1488:71 → borrar 1491:74 (dejar 1612:438)
icon/search → master 1483:4 → borrar 1483:5 (dejar 1612:439)
icon/map-pin → master 1483:18 → borrar 1483:19 (dejar 1612:440)
icon/plus → master 1483:12 → borrar 1483:13 (dejar 1612:521)
icon/minus → master 1483:28 → borrar 1483:29 (dejar 1612:522)
icon/building → master 1483:16 → borrar 1483:17 (dejar 1612:523)
icon/caret-down → master 1483:26 → borrar 1483:27 (dejar 1612:524)
icon/star → master 1483:20 → borrar 1483:21 (dejar 1612:525)
icon/close → master 1483:14 → borrar 1483:15 (dejar 1612:526)

icon/share (master 1522:124) ya quedó bien — un solo vector adentro (1612:441) — no tocar.

2. Swap de 4 iconos nuevos, misma receta que la corrida anterior (clonar vector del frame "-light" correspondiente, escalar x/y/width/height por 20/256, recolorear a fill sólido {r: 0.0661979, g: 0.1708333, b: 0.1708333} opacity 1, borrar el vector viejo del master, agregar el clon nuevo como único hijo):

icon/chat-circle → master 1488:73 → borrar child actual 1488:74 → origen frame 1610:758 / vector 1610:759
icon/caret-right → master 1483:8 → borrar child actual 1483:9 → origen frame 1610:754 / vector 1610:755
icon/caret-left → master 1483:10 → borrar child actual 1483:11 → origen frame 1610:756 / vector 1610:757
icon/map → master 1594:293 → borrar los 4 children actuales (1594:294, 1594:295, 1594:296, 1594:297) → origen frame 1610:752 / vector 1610:753

(icon/map hoy tiene 4 formas armadas a mano en vez de un solo vector — borrar las 4 y dejar solo el vector nuevo, igual que los demás.)

No tocar: icon/compass (ya tiene su propio fix de centrado pendiente aparte), icon/ticket, icon/user, icon/dots-three-vertical (todavía no hay versión light vertical, solo hay "dots-three-light" horizontal — no aplicar esa por ahora).

Verificación esperada al terminar
- Los 12 iconos de la lista 1 tienen un solo vector adentro del master (el nuevo, chico), no dos.
- Los 4 iconos de la lista 2 muestran el nuevo glyph light, un solo vector cada uno.
- icon/compass, icon/ticket, icon/user, icon/dots-three-vertical quedan sin tocar.
