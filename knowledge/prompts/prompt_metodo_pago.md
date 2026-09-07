# NOTA PARA ANA

Prompt para pegar en tu agente de Figma. Agrega un paso nuevo al flujo de Compra que hoy no existe: la pantalla de "Método de pago" con tarjeta. Investigué antes de armarlo: confirmé que en "Prototipo final" el flujo actual es Selección → (selección de asientos, si aplica) → Booking Summary Card (resumen + botón "Confirmar reserva") → Confirmación, sin ningún paso de carga de tarjeta en el medio — por eso es una pieza nueva, no algo que faltaba encontrar.

También reusa el componente Input ya documentado en tu Design System (nodo `1388:43`, variante "Light"): 48px de alto, radio 12px, fondo `rgba(17,44,44,0.08)` (Green/8), sin borde, Instrument Sans 15px — así los campos de la tarjeta quedan coherentes con el resto del sistema en vez de inventar un estilo nuevo.

---

## PROMPT

Trabajá en el archivo "Prototipo final" (fileKey `Bas9SSdMLitN1S37kjFeOy`), página "THEAVELING — DESIGN SYSTEM".

Creá una nueva pantalla mobile (390px de ancho) llamada **"Método de pago"**, ubicada en la sección de Patterns junto a "Pattern / Compra — 1. Selección", "2. Selección de asientos" y "3. Confirmación" — este nuevo paso va DESPUÉS del Booking Summary Card (resumen de la reserva) y ANTES de Confirmación.

**Criterio de componentización (importante):**
- La **vista previa de tarjeta** (número 2 de la estructura de abajo) SÍ es un componente nuevo — creala como componente reutilizable con 2 variantes (vacío / con datos), sumado al catálogo de Card System.
- Los **campos de formulario** (número 3) NO son componentes nuevos — son instancias del componente Input que YA existe (`1388:43`, variante Light), cada una con su ícono y placeholder propio. No crees un componente Input distinto por cada campo.
- El **checkbox** (número 4): si no existe ya un componente de checkbox en el Design System, creá uno nuevo reutilizable (vas a necesitarlo en otros lados, no es exclusivo de esta pantalla).
- El **botón CTA** (número 6): reusá el componente Button que ya existe, solo cambiando el texto — no crees un botón nuevo.

Fondo: superficie clara (off-white `#FBFBFB`), igual que el resto de las pantallas de Compra — no el verde oscuro de Home.

**Estructura de arriba a abajo:**

1. **Header**: fila con flecha de "volver" a la izquierda (apuntando a la izquierda, mismo trazo que `icon/caret-right` pero espejado) + título "Método de pago" centrado o alineado, mismo patrón que usa el header-row de "informacion-adicional-bottom-sheet" (nodo `1950:672`).

2. **Vista previa de tarjeta** (elemento nuevo): un rectángulo con proporción de tarjeta real (~342×216px, radio 16px), fondo Thea Green sólido con algún detalle en Thea Mint (por ejemplo el "chip" o un acento geométrico sutil — nada literal tipo banco real). Adentro, en texto blanco/off-white:
   - Número de tarjeta agrupado de a 4 dígitos (estado vacío: guiones o placeholder tipo "•••• •••• •••• ••••"; estado lleno: números reales de ejemplo)
   - Nombre del titular (abajo a la izquierda)
   - Vencimiento MM/AA (abajo a la derecha)
   - Diseñá el estado vacío (placeholder) Y un estado con datos de ejemplo cargados, como dos variantes del mismo componente.

3. **Campos de formulario** (debajo de la tarjeta, con el componente Input real — `1388:43`, variante Light, 48px alto, radio 12px, fondo Green/8, sin borde, Instrument Sans 15px):
   - Número de tarjeta (ícono de tarjeta a la izquierda del input, en vez del ícono de lupa que trae el default)
   - Nombre del titular
   - Fila con dos inputs lado a lado, mismo ancho cada uno: Vencimiento (MM/AA) y CVV

4. **Checkbox opcional**: "Guardar tarjeta para próximas compras" — usá el estilo de checkbox que ya exista en el Design System si hay uno documentado; si no existe, uno simple: cuadrado 20×20px, radio 4px, borde Green/20, relleno Thea Mint cuando está marcado con un check blanco.

5. **Nota de seguridad**: texto chico (12-13px, Green/50) con un ícono de candado a la izquierda, algo como "Pago seguro y encriptado".

6. **Botón CTA** al final: mismo estilo que el botón "Confirmar reserva" del Booking Summary Card (Thea Green sólido, texto blanco, 48px alto, radio 12px) pero con el texto **"Pagar $85.000 COP"** — el monto viene del resumen de la reserva, mostralo como ejemplo con ese valor.

No modifiques el Booking Summary Card existente ni el paso de Confirmación — solo agregá esta pantalla nueva entre los dos, documentada como parte de la secuencia de "Pattern / Compra".
