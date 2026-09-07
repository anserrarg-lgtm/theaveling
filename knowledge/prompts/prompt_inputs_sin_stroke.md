Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

Quitar el stroke a todos los campos del componente "Input" (COMPONENT_SET 1388:106, 4 tipos × varios estados) — Ana no quiere borde en ningún input, la diferencia de estado se comunica solo con la opacidad del relleno.

1. Quitar el stroke (dejar `strokes: []`) en el frame "Input Field" de cada una de estas 25 variantes:

Text: 1388:28, 1471:5, 1388:31, 1388:34, 1388:37, 1388:41
Search: 1388:44, 1471:8, 1388:48, 1388:52, 1388:56, 1388:61, 1471:20
Select: 1388:65, 1471:12, 1388:69, 1388:73, 1388:77, 1388:82
Date: 1388:86, 1471:16, 1388:90, 1388:94, 1388:98, 1388:103

2. Ajustar la opacidad del relleno (fill) en los estados Hover y Focused, para compensar que ya no tienen borde — quedaban muy planos si se dejan igual:

Hover (1471:5, 1471:8, 1471:12, 1471:16): opacidad de fill de 10% → 14%
Focused (1388:31, 1388:48, 1388:69, 1388:90): opacidad de fill de 8% → 20%

3. El resto de los estados (Default 8%, Filled 8%, Error 8%, Disabled 4%, Loading 8%) mantienen su opacidad de fill actual — solo se les quita el stroke, nada más.

4. El estado Error ya comunica el error con el texto "Error Message" en rojo debajo del campo (ej. "Este campo es obligatorio") — no hace falta ningún reemplazo visual por la pérdida del borde rojo, el mensaje de texto ya cumple esa función.

No tocar ningún otro componente ni pantalla.

Verificación esperada al terminar
- Las 25 variantes de Input no tienen stroke en el campo.
- Hover queda en 14% de opacidad de fill, Focused en 20%, el resto sin cambios.
- El mensaje de error en rojo sigue visible en los estados Error.
