Archivo: "Prototipo final" (Bas9SSdMLitN1S37kjFeOy), página "THEAVELING — DESIGN SYSTEM" (0:1).

Corregir 2 etiquetas de los Sub-category Tabs de la categoría "Todo" — no coinciden con los nombres reales de las secciones del mockup "categoría-theaveling-cards" (Curado por Theaveling / Más reservados / Descubrimientos). "Más reservados" ya está bien, no tocar esa.

En Sub-category Tabs blanca (Content=Todo, 1546:148):
- Nodo 1419:177: texto actual "Recomendado" → reemplazar por "Curado por Thea"
- Nodo 1419:183: texto actual "Nuevos descubrimientos" → reemplazar por "Descubrimientos"

En Sub-category Tabs — Fondo verde (Content=Todo, 1582:387):
- Nodo 1582:389: texto actual "Recomendado" → reemplazar por "Curado por Thea"
- Nodo 1582:395: texto actual "Nuevos descubrimientos" → reemplazar por "Descubrimientos"

Seguir la receta canónica de edición de texto: cargar la fuente actual de cada nodo (loadFontAsync con el fontName ya reportado por el nodo) antes de mutar characters.

No tocar el layout, tamaño ni posición de ningún card ni sección — este prompt es solo texto. "Curado por Theaveling" ya está en scroll vertical (correcto, no se toca) y "Más reservados"/"Descubrimientos" se quedan en horizontal (no se tocan).

Verificación esperada al terminar
- Las 4 etiquetas cambiaron a "Curado por Thea" / "Descubrimientos" en ambas versiones (blanca y verde).
- Nada más se modificó.
