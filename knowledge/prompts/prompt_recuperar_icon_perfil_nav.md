Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

Ana recuperó el ícono de Perfil que le gustaba (desde el historial de versiones de Figma) y lo pegó en el canvas: componente "reicon:profile" (1623:776), 24×24px, círculo + óvalo con contorno (stroke 1.5px), sin relleno.

Reemplazar el ícono usado en el tab "Perfil" de Mobile Bottom Navigation (las dos versiones: blanca y fondo verde) por este nuevo ícono, en vez de `icon/user`. Mismo tamaño (24×24), no hace falta escalar.

Ubicaciones a actualizar — en cada una, adentro del frame "icon-perfil" hay una instancia de icon/user; reemplazarla por una instancia de reicon:profile (1623:776):

Mobile Bottom Navigation (blanca, COMPONENT_SET 1419:118), variante Perfil, 3 estados de tab (Descubrir/Reservas/Perfil activos):
- icon-perfil 1419:133 → instancia actual 1546:193 (icon/user) → reemplazar por instancia de 1623:776
- icon-perfil 1419:151 → instancia actual 1546:195 (icon/user) → reemplazar por instancia de 1623:776
- icon-perfil 1419:168 → instancia actual 1546:197 (icon/user) → reemplazar por instancia de 1623:776

Mobile Bottom Navigation — Fondo verde (COMPONENT_SET 1582:294), mismos 3 estados:
- icon-perfil 1582:306 → instancia actual 1582:307 (icon/user) → reemplazar por instancia de 1623:776
- icon-perfil 1582:320 → instancia actual 1582:321 (icon/user) → reemplazar por instancia de 1623:776
- icon-perfil 1582:333 → instancia actual 1582:334 (icon/user) → reemplazar por instancia de 1623:776

Como estos 2 component sets son los maestros, las instancias ya usadas en pantallas (07 — Reservas, 08 — Perfil, etc., por ejemplo I1557:438 e I1557:512) se actualizan solas al ser instancias de estos masters — no hace falta tocarlas una por una.

NO tocar `icon/user` (el master en 01.5 — Icons / Icon Grid) — se queda como está, esto es solo para el ícono de Perfil dentro de la navegación. Si más adelante Ana quiere este mismo ícono en otros lados, se hace aparte.

Verificación esperada al terminar
- Las 6 ubicaciones (3 blancas + 3 verdes) muestran el nuevo ícono (círculo + óvalo, contorno) en vez del anterior (cabeza+hombros).
- El resto del sistema (icon/user en la galería, otros usos) no se tocó.
