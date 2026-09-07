/*
 * Set de íconos inline — actualizado 2026-09-02 con el trazo REAL de
 * Figma. Ana exportó cada capa a mano ("Copy as SVG" en Figma, ya que
 * esta sesión no puede bajar SVGs de figma.com — la red del sandbox lo
 * bloquea, confirmado varias veces). Node IDs documentados por ícono
 * para referencia futura.
 *
 * Todos los `fill`/`stroke` originales (colores hardcodeados tipo
 * #112C2C o black, pensados para el ícono aislado sobre fondo claro) se
 * cambiaron a `currentColor` para que cada ícono herede el color de
 * texto de donde se use (ej. blanco en la Top Bar/Bottom Nav sobre
 * fondo verde oscuro) — si no, se hubieran visto oscuros sobre fondo
 * oscuro y invisibles.
 *
 * El ícono de "Reservas" (ticket) ya era exacto de antes (geometría
 * simple, verificada por número directo en Figma) — no se tocó.
 */

/* icon/search — nodo 1483:127. 16×16 real (no 24×24 como el aproximado viejo). */
export function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M15.8234 15.1609L11.8093 11.1468C12.954 9.83046 13.5429 8.12107 13.4518 6.379C13.3607 4.63693 12.5967 2.99828 11.321 1.80847C10.0453 0.61866 8.35745 -0.0293559 6.61327 0.00102174C4.86908 0.0313994 3.20482 0.737797 1.97131 1.97131C0.737797 3.20482 0.0313994 4.86908 0.00102174 6.61327C-0.0293559 8.35745 0.61866 10.0453 1.80847 11.321C2.99828 12.5967 4.63693 13.3607 6.379 13.4518C8.12107 13.5429 9.83046 12.954 11.1468 11.8093L15.1609 15.8234C15.2498 15.9062 15.3673 15.9513 15.4887 15.9491C15.6102 15.947 15.726 15.8978 15.8119 15.8119C15.8978 15.726 15.947 15.6102 15.9491 15.4887C15.9513 15.3673 15.9062 15.2498 15.8234 15.1609ZM0.960901 6.74215C0.960901 5.59873 1.29996 4.48098 1.93522 3.53026C2.57047 2.57954 3.47338 1.83854 4.52976 1.40097C5.58615 0.963403 6.74856 0.848915 7.87002 1.07199C8.99147 1.29506 10.0216 1.84567 10.8301 2.65419C11.6386 3.46271 12.1892 4.49283 12.4123 5.61428C12.6354 6.73574 12.5209 7.89815 12.0833 8.95454C11.6458 10.0109 10.9048 10.9138 9.95404 11.5491C9.00332 12.1843 7.88557 12.5234 6.74215 12.5234C5.20944 12.5215 3.74004 11.9118 2.65624 10.8281C1.57245 9.74426 0.962761 8.27486 0.960901 6.74215Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* icon/compass — nodo 1546:154. Círculo + aguja romboidal rellena. */
export function IconCompass({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" />
      <rect
        x="5.40381"
        y="10"
        width="6.5"
        height="6.5"
        transform="rotate(-45 5.40381 10)"
        fill="currentColor"
      />
    </svg>
  );
}

/* icon/user — versión que Ana pidió (reemplaza la primera que mandó). */
export function IconUser({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M11.83 10.8697C11.94 10.8597 12.06 10.8597 12.16 10.8697C12.7424 10.8592 13.317 10.7341 13.8511 10.5015C14.3851 10.269 14.8682 9.93345 15.2726 9.51419C15.677 9.09494 15.9948 8.60013 16.208 8.05804C16.4212 7.51594 16.5255 6.93716 16.515 6.35474C16.5045 5.77233 16.3793 5.19769 16.1468 4.66363C15.9142 4.12957 15.5787 3.64656 15.1594 3.24216C14.7402 2.83776 14.2454 2.5199 13.7033 2.30672C13.1612 2.09355 12.5824 1.98924 12 1.99974C9.53997 1.99974 7.55997 3.98974 7.55997 6.43974C7.55671 7.5882 8.00059 8.69283 8.7976 9.5197C9.59461 10.3466 10.6822 10.8308 11.83 10.8697Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15997 20.4297C4.73997 18.8197 4.73997 16.1797 7.15997 14.5597C9.91997 12.7297 14.43 12.7297 17.17 14.5597C19.59 16.1697 19.59 18.8097 17.17 20.4297C14.42 22.2697 9.90997 22.2697 7.15997 20.4297Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* icon/map-pin — nodo 1483:163. */
export function IconMapPin({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 7.15625C11.4128 7.15625 10.8389 7.33036 10.3507 7.65657C9.86244 7.98279 9.48193 8.44644 9.25723 8.98891C9.03254 9.53138 8.97374 10.1283 9.08829 10.7042C9.20284 11.2801 9.48559 11.809 9.90078 12.2242C10.316 12.6394 10.8449 12.9222 11.4208 13.0367C11.9967 13.1513 12.5936 13.0925 13.1361 12.8678C13.6786 12.6431 14.1422 12.2626 14.4684 11.7743C14.7946 11.2861 14.9688 10.7122 14.9688 10.125C14.9688 9.33764 14.656 8.58253 14.0992 8.02578C13.5425 7.46903 12.7874 7.15625 12 7.15625ZM12 12.1562C11.5983 12.1562 11.2055 12.0371 10.8715 11.8139C10.5375 11.5907 10.2771 11.2735 10.1234 10.9023C9.96963 10.5312 9.9294 10.1227 10.0078 9.72872C10.0862 9.3347 10.2796 8.97276 10.5637 8.68869C10.8478 8.40461 11.2097 8.21116 11.6037 8.13278C11.9977 8.0544 12.4062 8.09463 12.7773 8.24837C13.1485 8.40211 13.4657 8.66246 13.6889 8.9965C13.9121 9.33054 14.0312 9.72326 14.0312 10.125C14.0312 10.6637 13.8172 11.1804 13.4363 11.5613C13.0554 11.9422 12.5387 12.1562 12 12.1562ZM12 3.40625C10.2187 3.40832 8.51097 4.11685 7.25141 5.37641C5.99185 6.63597 5.28332 8.34371 5.28125 10.125C5.28125 12.5398 6.40156 15.1047 8.52109 17.5422C9.47774 18.6478 10.5544 19.6435 11.7312 20.5109C11.81 20.5661 11.9039 20.5956 12 20.5956C12.0961 20.5956 12.19 20.5661 12.2688 20.5109C13.4456 19.6435 14.5223 18.6478 15.4789 17.5422C17.5984 15.1047 18.7188 12.5422 18.7188 10.125C18.7167 8.34371 18.0082 6.63597 16.7486 5.37641C15.489 4.11685 13.7813 3.40832 12 3.40625ZM12 19.5398C10.8281 18.6352 6.21875 14.7828 6.21875 10.125C6.21875 8.59172 6.82784 7.12123 7.91204 6.03704C8.99623 4.95284 10.4667 4.34375 12 4.34375C13.5333 4.34375 15.0038 4.95284 16.088 6.03704C17.1722 7.12123 17.7812 8.59172 17.7812 10.125C17.7812 14.7828 13.1719 18.6352 12 19.5398Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* icon/caret-right — nodo 1483:135. */
export function IconCaretRight({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16.0813 12.3313L9.83128 18.5813C9.74242 18.6641 9.62489 18.7092 9.50345 18.707C9.38201 18.7049 9.26615 18.6557 9.18026 18.5698C9.09438 18.4839 9.04518 18.368 9.04304 18.2466C9.0409 18.1252 9.08598 18.0076 9.16878 17.9188L15.0867 12L9.16878 6.08128C9.08598 5.99242 9.0409 5.87489 9.04304 5.75345C9.04518 5.63201 9.09438 5.51615 9.18026 5.43026C9.26615 5.34438 9.38201 5.29518 9.50345 5.29304C9.62489 5.2909 9.74242 5.33598 9.83128 5.41878L16.0813 11.6688C16.1691 11.7567 16.2184 11.8758 16.2184 12C16.2184 12.1242 16.1691 12.2434 16.0813 12.3313Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* icon/heart — nodo 1483:123. */
export function IconHeart({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M15.9062 5.28125C14.2656 5.28125 12.8391 6.02109 12 7.26094C11.1609 6.02109 9.73438 5.28125 8.09375 5.28125C6.85099 5.2827 5.65955 5.77702 4.78079 6.65579C3.90202 7.53455 3.4077 8.72599 3.40625 9.96875C3.40625 12.25 4.82812 14.6242 7.63281 17.0242C8.91801 18.1193 10.3063 19.0874 11.7781 19.9148C11.8463 19.9515 11.9226 19.9707 12 19.9707C12.0774 19.9707 12.1537 19.9515 12.2219 19.9148C13.6937 19.0874 15.082 18.1193 16.3672 17.0242C19.1719 14.6242 20.5938 12.25 20.5938 9.96875C20.5923 8.72599 20.098 7.53455 19.2192 6.65579C18.3405 5.77702 17.149 5.2827 15.9062 5.28125ZM12 18.9617C10.718 18.2219 4.34375 14.3219 4.34375 9.96875C4.34478 8.97451 4.7402 8.02128 5.44324 7.31824C6.14628 6.6152 7.09951 6.21978 8.09375 6.21875C9.67812 6.21875 11.0086 7.06484 11.5664 8.42734C11.6017 8.51332 11.6618 8.58685 11.739 8.6386C11.8162 8.69035 11.9071 8.71798 12 8.71798C12.0929 8.71798 12.1838 8.69035 12.261 8.6386C12.3382 8.58685 12.3983 8.51332 12.4336 8.42734C12.9914 7.06484 14.3219 6.21875 15.9062 6.21875C16.9005 6.21978 17.8537 6.6152 18.5568 7.31824C19.2598 8.02128 19.6552 8.97451 19.6562 9.96875C19.6562 14.3219 13.282 18.2219 12 18.9617Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* icon/heart (relleno) — 2026-09-03, segunda pasada de Ana: el primer
 * "Copy as SVG" (viewBox 18×15) tenía una proporción distinta a la del
 * contorno, así que el corazón "crecía" visualmente al favoritear/
 * desfavoritear (cambio de tamaño aparente, no solo de forma). Este
 * trazo nuevo usa el MISMO contorno exterior que IconHeart (arriba) —
 * literalmente el mismo path hasta el cierre, sin el recorte interior
 * que lo hace hueco — así que comparte viewBox 24×24 y geometría exacta
 * con el estado inactivo: solo cambia sólido vs. hueco, nunca el tamaño.
 * `fill` original de Ana era `#112C2C` (thea-green) — queda en
 * `currentColor`, mismo criterio que el resto de los íconos. */
export function IconHeartFilled({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M15.9062 5.28125C14.2656 5.28125 12.8391 6.02109 12 7.26094C11.1609 6.02109 9.73438 5.28125 8.09375 5.28125C6.85099 5.2827 5.65955 5.77702 4.78079 6.65579C3.90202 7.53455 3.4077 8.72599 3.40625 9.96875C3.40625 12.25 4.82812 14.6242 7.63281 17.0242C8.91801 18.1193 10.3063 19.0874 11.7781 19.9148C11.8463 19.9515 11.9226 19.9707 12 19.9707C12.0774 19.9707 12.1537 19.9515 12.2219 19.9148C13.6937 19.0874 15.082 18.1193 16.3672 17.0242C19.1719 14.6242 20.5938 12.25 20.5938 9.96875C20.5923 8.72599 20.098 7.53455 19.2192 6.65579C18.3405 5.77702 17.149 5.2827 15.9062 5.28125Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* icon/share — PENDIENTE: no tengo el trazo real de Figma (nodo
 * `1516:121`) todavía. Placeholder genérico (3 puntos conectados, patrón
 * estándar de "compartir") hasta que Ana lo pase con "Copy as SVG". */
/* Geometría exacta verificada en Figma (2026-09-02, "Copy as SVG" de Ana,
 * node icon/share `1516:121`) — reemplaza el placeholder anterior (3
 * círculos + 2 líneas), que era una aproximación inventada. */
export function IconShare({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16.5 15.1879C15.9991 15.1877 15.5037 15.2934 15.0465 15.4981C14.5892 15.7028 14.1804 16.0019 13.8469 16.3758L9.26254 13.4292C9.46033 12.9788 9.56246 12.4923 9.56246 12.0004C9.56246 11.5086 9.46033 11.0221 9.26254 10.5717L13.8469 7.62513C14.445 8.29227 15.2725 8.70955 16.1645 8.79379C17.0566 8.87804 17.9476 8.62307 18.66 8.07971C19.3724 7.53634 19.8539 6.74448 20.0086 5.86194C20.1632 4.9794 19.9796 4.071 19.4944 3.31778C19.0091 2.56456 18.2579 2.02183 17.3904 1.79777C16.5229 1.57371 15.6028 1.68476 14.8135 2.1088C14.0242 2.53284 13.4237 3.23872 13.1316 4.08576C12.8395 4.9328 12.8774 5.8588 13.2375 6.67919L8.65317 9.62576C8.17221 9.0879 7.53927 8.70877 6.83811 8.53853C6.13695 8.36829 5.40063 8.41496 4.72658 8.67238C4.05253 8.9298 3.47253 9.38582 3.06334 9.98011C2.65415 10.5744 2.43506 11.2789 2.43506 12.0004C2.43506 12.722 2.65415 13.4265 3.06334 14.0208C3.47253 14.6151 4.05253 15.0711 4.72658 15.3285C5.40063 15.5859 6.13695 15.6326 6.83811 15.4624C7.53927 15.2921 8.17221 14.913 8.65317 14.3751L13.2375 17.3217C12.9298 18.0246 12.8572 18.8082 13.0307 19.5557C13.2041 20.3032 13.6143 20.9747 14.2002 21.4703C14.786 21.9659 15.5162 22.2591 16.2822 22.3062C17.0481 22.3534 17.8087 22.1519 18.4509 21.7319C19.0931 21.3119 19.5826 20.6957 19.8464 19.9751C20.1102 19.2545 20.1342 18.468 19.915 17.7327C19.6958 16.9973 19.245 16.3523 18.6296 15.8938C18.0143 15.4353 17.2674 15.1877 16.5 15.1879ZM16.5 2.81295C16.9821 2.81295 17.4534 2.9559 17.8542 3.22374C18.2551 3.49157 18.5675 3.87226 18.752 4.31765C18.9365 4.76305 18.9848 5.25315 18.8907 5.72598C18.7967 6.19881 18.5645 6.63313 18.2236 6.97402C17.8827 7.31491 17.4484 7.54706 16.9756 7.64111C16.5027 7.73516 16.0126 7.68689 15.5673 7.5024C15.1219 7.31791 14.7412 7.00549 14.4733 6.60465C14.2055 6.2038 14.0625 5.73254 14.0625 5.25045C14.0625 4.60398 14.3194 3.98399 14.7765 3.52687C15.2336 3.06975 15.8536 2.81295 16.5 2.81295ZM6.00004 14.4379C5.51795 14.4379 5.04669 14.295 4.64584 14.0272C4.245 13.7593 3.93258 13.3786 3.74809 12.9332C3.5636 12.4878 3.51533 11.9977 3.60938 11.5249C3.70343 11.0521 3.93558 10.6178 4.27647 10.2769C4.61736 9.93598 5.05168 9.70383 5.52451 9.60978C5.99734 9.51573 6.48744 9.564 6.93283 9.74849C7.37823 9.93298 7.75891 10.2454 8.02675 10.6462C8.29459 11.0471 8.43754 11.5184 8.43754 12.0004C8.43754 12.6469 8.18074 13.2669 7.72362 13.724C7.2665 14.1811 6.64651 14.4379 6.00004 14.4379ZM16.5 21.1879C16.018 21.1879 15.5467 21.045 15.1458 20.7772C14.745 20.5093 14.4326 20.1286 14.2481 19.6832C14.0636 19.2378 14.0153 18.7477 14.1094 18.2749C14.2034 17.8021 14.4356 17.3678 14.7765 17.0269C15.1174 16.686 15.5517 16.4538 16.0245 16.3598C16.4973 16.2657 16.9874 16.314 17.4328 16.4985C17.8782 16.683 18.2589 16.9954 18.5268 17.3962C18.7946 17.7971 18.9375 18.2684 18.9375 18.7504C18.9375 19.0705 18.8745 19.3875 18.752 19.6832C18.6295 19.979 18.45 20.2477 18.2236 20.474C17.9973 20.7004 17.7286 20.8799 17.4328 21.0024C17.1371 21.1249 16.8201 21.1879 16.5 21.1879Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Geometría exacta verificada en Figma (2026-08-31) — no es aproximación. */
export function IconTicket({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="1.7" y="3.3" width="16.7" height="13.3" rx="2.499" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5" y="9.2" width="10" height="1.5" fill="currentColor" />
      <rect x="5" y="6.7" width="6.5" height="1.5" fill="currentColor" />
    </svg>
  );
}

/* icon/map — PENDIENTE: no tengo el trazo real de Figma (nodo usado en
 * el link "Ver mapa de butacas" del frame `compra-mobile`, 1861:554,
 * traído vía get_design_context 2026-09-04) todavía — su asset lo sirve
 * Figma como .svg remoto y este sandbox no puede bajarlo (red bloqueada
 * a figma.com, mismo problema documentado en icon/share e icon/building
 * arriba). Placeholder genérico (mapa plegado con un pin), 20×20 como
 * pide la spec — reemplazar cuando Ana lo pase con "Copy as SVG".
 * NOTA: el link "Ver mapa de butacas" que usaría este ícono todavía no
 * se construyó en Compra.tsx — no hay mapa de asientos interactivo en
 * esta pasada (ver comentario de scope en Compra.tsx), así que este
 * ícono queda definido pero sin uso por ahora, listo para cuando se
 * arme esa función. */
export function IconMap({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M7.5 3L2.5 4.7V17L7.5 15.3L12.5 17L17.5 15.3V3L12.5 4.7L7.5 3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7.5 3V15.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12.5 4.7V17" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="9.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* icon/minus e icon/plus — controles del stepper "Cantidad de personas"
 * en Compra.tsx (frame `compra-mobile`, 1861:554). Geometría universal
 * (un solo trazo/cruz), no depende del trazo específico de Figma como
 * los íconos ilustrativos de arriba — bajo riesgo de desajuste visual,
 * no necesitan el "Copy as SVG" de Ana. */
export function IconMinus({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M7 2.5V11.5M2.5 7H11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* icon/clock, icon/alert-circle, icon/globe, icon/camera-off — usados en
 * "practical-info-list" de "Información adicional" en Detalle (nodo
 * `informacion-adicional-bottom-sheet`, `1950:670`, traído vía
 * get_design_context 2026-09-04). PENDIENTE: no tengo el trazo real de
 * Figma para estos 4 (mismo problema de red bloqueada a figma.com que
 * el resto de los íconos "PENDIENTE" de este archivo) — son glifos
 * universales bastante estándar (reloj, alerta, globo, cámara tachada),
 * geometría propia simple, no un intento de calcar el trazo exacto de
 * Figma — reemplazar cuando Ana los pase con "Copy as SVG". 16×16,
 * mismo tamaño que pide la spec (van dentro de un wrapper de 20×20 al
 * 50% de opacidad, ver DetalleExperiencia.tsx). */
export function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5V8L10.3 9.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAlertCircle({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5V8.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.8" fill="currentColor" />
    </svg>
  );
}

/*
 * IconXCircle — 2026-09-04, nuevo, a pedido de Ana: "poner boton para
 * cancelar" en ReservationCard.tsx. PENDIENTE: mismo problema de red
 * bloqueada a figma.com que el resto de los íconos "PENDIENTE" de este
 * archivo (ver nota de IconClock/IconAlertCircle más arriba) — glifo
 * universal simple (círculo + X), 16×16, mismo trazo (`strokeWidth 1.2`)
 * que sus vecinos, no un intento de calcar un asset real de Figma.
 * Reemplazar cuando Ana pase el trazo real con "Copy as SVG".
 */
export function IconXCircle({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.8 5.8L10.2 10.2M10.2 5.8L5.8 10.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 8H14.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 1.5C9.9 3.4 10.9 5.6 10.9 8C10.9 10.4 9.9 12.6 8 14.5C6.1 12.6 5.1 10.4 5.1 8C5.1 5.6 6.1 3.4 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function IconCameraOff({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M2 5.5H4.6L5.4 3.8H10.6L11.4 5.5H14C14.3 5.5 14.5 5.7 14.5 6V12.5C14.5 12.8 14.3 13 14 13H2C1.7 13 1.5 12.8 1.5 12.5V6C1.5 5.7 1.7 5.5 2 5.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9.3" r="2.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 1.5L14.5 14.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* icon/calendar-x — fila "Política de cancelación" en "Información
 * adicional" de Detalle (2026-09-04, a pedido de Ana, con la referencia
 * de Airbnb que mandó como ejemplo de tono para ese texto — no del
 * ícono). PENDIENTE: no tengo el trazo real de Figma para este —
 * geometría propia simple (calendario + X), mismo criterio que
 * clock/alert-circle/globe/camera-off de arriba. 16×16. */
export function IconCalendarX({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="2.8" width="13" height="11.7" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 6H14.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11.5 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.2 8.2L9.8 11.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9.8 8.2L6.2 11.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* icon/repeat, icon/flag, icon/award, icon/book-open, icon/shield-check —
 * 2026-09-04, a pedido de Ana: "Ficha del descubrimiento" pasa de filas
 * separadas por línea divisoria a filas con ícono (mismo lenguaje visual
 * que "Información adicional", ver clock/alert-circle/globe/camera-off
 * arriba). Un ícono por campo de la ficha — Duración reusa `IconClock`
 * (quedó sin uso en este archivo cuando se recortó "Información
 * adicional" a 3 filas, ver esa nota) e Idioma reusa `IconGlobe`
 * (mismo criterio: glifo universal de idioma/internacional). Los otros
 * 5 son nuevos:
 *  - repeat → Presentaciones (número de funciones — dos flechas en
 *    bucle, funciones repetidas).
 *  - flag → Festivales (banderín en asta).
 *  - award → Premios (medalla con cinta).
 *  - book-open → Origen (libro abierto — si es pieza original o
 *    adaptación de una obra fuente).
 *  - shield-check → Restricción de edad (escudo con check, glifo
 *    típico de clasificación/certificación de contenido).
 * PENDIENTE: no tengo el trazo real de Figma para ninguno de los 5 —
 * mismo criterio que el resto de los íconos "PENDIENTE" de este
 * archivo (geometría propia simple, no un intento de calcar Figma) —
 * reemplazar cuando Ana los pase con "Copy as SVG". 16×16. */
export function IconRepeat({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2.5 6.5V6C2.5 4.6 3.6 3.5 5 3.5H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3 1.3L12.8 3.5L10.3 5.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 9.5V10C13.5 11.4 12.4 12.5 11 12.5H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.7 14.7L3.2 12.5L5.7 10.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFlag({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3.5 1.5V14.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M3.5 2.5H11.5C12 2.5 12.2 3.1 11.8 3.4L9.7 5L11.8 6.6C12.2 6.9 12 7.5 11.5 7.5H3.5V2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconAward({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.8 9.5L4.5 14.5L8 12.5L11.5 14.5L10.2 9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBookOpen({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 3.2C7 2.3 5.3 1.8 3.3 1.8C2.9 1.8 2.5 1.9 2.5 2.3V11.8C2.5 12.1 2.8 12.3 3.1 12.3C5 12.3 6.8 12.8 8 13.7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.2C9 2.3 10.7 1.8 12.7 1.8C13.1 1.8 13.5 1.9 13.5 2.3V11.8C13.5 12.1 13.2 12.3 12.9 12.3C11 12.3 9.2 12.8 8 13.7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8 3.2V13.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconShieldCheck({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 1.5L13.5 3.3V7.3C13.5 10.7 11.2 13.4 8 14.5C4.8 13.4 2.5 10.7 2.5 7.3V3.3L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5.8 8.2L7.3 9.7L10.3 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* icon/mail, icon/message-circle, icon/bell, icon/help-circle,
 * icon/currency — 2026-09-04, a pedido de Ana: "iconizamos" las filas de
 * Preferencias en Perfil (Idioma, Moneda, Notificaciones, Datos de
 * cuenta, Ayuda) y las de Contacto en Ayuda.tsx (Correo, WhatsApp).
 * Idioma reusa `IconGlobe` y Datos de cuenta reusa `IconUser` (ya
 * existían) — los 5 de acá son nuevos, mismo criterio que el resto de
 * los íconos "PENDIENTE" de este archivo: geometría propia simple
 * (16×16, strokeWidth 1.2), no marcas/logos reales (nada de el ícono
 * verde real de WhatsApp — acá es una burbuja de chat genérica,
 * consistente con cómo el resto de la app evita marcas ajenas). PENDIENTE
 * reemplazar con el trazo real de Figma si Ana llega a definir estos
 * campos ahí. */
export function IconMail({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 4.2L8 9L14 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMessageCircle({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 13.2C11.0376 13.2 13.5 10.9106 13.5 8.1C13.5 5.28935 11.0376 3 8 3C4.96243 3 2.5 5.28935 2.5 8.1C2.5 9.13417 2.83309 10.0961 3.4 10.9L2.8 13.2L5.3 12.5C6.11 12.94 7.03 13.2 8 13.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/*
 * IconBell — 2026-09-04: reemplazado el trazo PENDIENTE (stroke, dibujado
 * a mano) por el trazo REAL que Ana proveyó directamente ("aca esta" +
 * SVG), a pedido de agregar una campanita de notificaciones en Perfil
 * ("hacia la derecha si va una campanita en paralelo con la foto del
 * usuario"). Mismo criterio ya usado en el proyecto para íconos
 * PENDIENTE: se actualizan a trazo real en cuanto Ana lo da, en TODOS
 * los usos existentes (acá: fila "Notificaciones" en Perfil.tsx, además
 * del nuevo uso en el header del perfil) — no se crea un ícono aparte.
 * Es un ícono de relleno (fill), no de contorno (stroke) como el resto
 * de esta familia — se respeta así el trazo real en vez de forzarlo a
 * stroke; sólo se cambia `fill="black"` (el valor que Ana pegó) por
 * `fill="currentColor"`, mismo patrón de color que ya usan todos los
 * demás íconos del archivo.
 */
export function IconBell({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="none" className={className}>
      <path
        d="M221.8 175.94C216.25 166.38 208 139.33 208 104C208 82.7827 199.571 62.4344 184.568 47.4315C169.566 32.4285 149.217 24 128 24C106.783 24 86.4343 32.4285 71.4313 47.4315C56.4284 62.4344 47.9999 82.7827 47.9999 104C47.9999 139.34 39.7399 166.38 34.1899 175.94C32.7726 178.37 32.0212 181.132 32.0116 183.945C32.0019 186.759 32.7343 189.525 34.1349 191.965C35.5354 194.405 37.5547 196.433 39.9889 197.843C42.4232 199.254 45.1864 199.998 47.9999 200H88.8099C90.6556 209.032 95.5641 217.148 102.705 222.978C109.846 228.807 118.782 231.991 128 231.991C137.218 231.991 146.153 228.807 153.295 222.978C160.436 217.148 165.344 209.032 167.19 200H208C210.813 199.996 213.574 199.251 216.007 197.84C218.44 196.428 220.458 194.4 221.857 191.961C223.257 189.521 223.988 186.755 223.978 183.943C223.968 181.13 223.217 178.37 221.8 175.94ZM128 216C123.038 215.998 118.199 214.459 114.148 211.594C110.097 208.728 107.034 204.678 105.38 200H150.62C148.966 204.678 145.903 208.728 141.852 211.594C137.801 214.459 132.962 215.998 128 216ZM47.9999 184C55.6999 170.76 63.9999 140.08 63.9999 104C63.9999 87.0261 70.7427 70.7475 82.745 58.7452C94.7474 46.7428 111.026 40 128 40C144.974 40 161.252 46.7428 173.255 58.7452C185.257 70.7475 192 87.0261 192 104C192 140.05 200.28 170.73 208 184H47.9999Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconHelpCircle({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6.2 6.2C6.2 5.1 7 4.3 8 4.3C9 4.3 9.8 5.1 9.8 6.1C9.8 7.4 8 7.6 8 9.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="11.4" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconCurrency({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5V11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M6 6.2C6 5.5 6.9 5 8 5C9.1 5 10 5.5 10 6.2C10 6.9 9.1 7.2 8 7.5C6.9 7.8 6 8.1 6 8.8C6 9.5 6.9 10 8 10C9.1 10 10 9.5 10 8.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* icon/calendar — PENDIENTE: no tengo el trazo real de Figma (nodo
 * `icon/calendar`, usado en la fila "Por fecha" de la pantalla de
 * Búsqueda — ver Busqueda.tsx, sección 05 — Búsqueda, `2271:1089`)
 * todavía — mismo problema de red bloqueada a figma.com que el resto
 * de los íconos "PENDIENTE" de este archivo (confirmado de nuevo
 * 2026-09-04, intentando bajar el asset .svg remoto). Geometría propia
 * simple (calendario liso, sin la X de IconCalendarX de arriba — acá
 * no es "cancelar", es "elegir fecha"), 16×16, strokeWidth 1.2, mismo
 * criterio que el resto. Reemplazar cuando Ana lo pase con "Copy as
 * SVG". */
export function IconCalendar({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="2.8" width="13" height="11.7" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 6H14.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11.5 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* icon/building — PENDIENTE: no tengo el trazo real de Figma (nodo
 * `1483:16`, usado al 40% de opacidad dentro del avatar de Artist/Space
 * Card, ver ArtistSpaceCard.tsx) todavía — el asset lo entrega Figma como
 * imagen exportada (.svg remoto, expira a los 7 días), y este sandbox no
 * puede bajarlo directo (red bloqueada a figma.com, igual que con
 * get_screenshot). Placeholder genérico (silueta simple de edificio),
 * mismo criterio que se usó para icon/share antes de tener el trazo
 * real — reemplazar cuando Ana lo pase con "Copy as SVG". */
export function IconBuilding({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="3" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="15" y="9" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7.5" y="6" width="2" height="2" fill="currentColor" />
      <rect x="11" y="6" width="2" height="2" fill="currentColor" />
      <rect x="7.5" y="10" width="2" height="2" fill="currentColor" />
      <rect x="11" y="10" width="2" height="2" fill="currentColor" />
      <rect x="7.5" y="14" width="2" height="2" fill="currentColor" />
      <rect x="11" y="14" width="2" height="2" fill="currentColor" />
      <rect x="9.5" y="17.5" width="1.6" height="3.5" fill="currentColor" />
    </svg>
  );
}

/* icon/x, icon/chevron-down, icon/star, icon/credit-card — 2026-09-05,
 * nuevos para `ConfirmarPagoSheet.tsx`. Esta pantalla no viene de un
 * nodo real de Figma (Ana la definió pasando capturas de referencia de
 * otra app — ver la nota grande de ConfirmarPagoSheet.tsx), así que no
 * hay trazo real que calcar como con el resto de los íconos
 * "PENDIENTE" de este archivo. Geometría propia simple (glifos
 * universales: X, flecha abajo, estrella, tarjeta), mismo criterio de
 * placeholder que ya se usó acá para `IconBuilding`/`IconClock`/etc. —
 * reemplazar si Ana pasa el trazo real de Figma para esto en algún
 * momento. */
export function IconX({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4.5 4.5L15.5 15.5M15.5 4.5L4.5 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M2.5 5L7 9.5L11.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconStar({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className={className}>
      <path d="M7 0.8L8.85 4.9L13.2 5.4L9.95 8.35L10.85 12.7L7 10.45L3.15 12.7L4.05 8.35L0.8 5.4L5.15 4.9L7 0.8Z" />
    </svg>
  );
}

export function IconCreditCard({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2" y="4.5" width="16" height="11" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8H18" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 12H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/*
 * IconGoogle / IconApple — 2026-09-07, a pedido de Ana: "quiero que
 * salieran los loguitos de Google y Apple". Hasta ahora LoginSheet.tsx
 * documentaba a propósito NO usar los logos reales ("usar los logos
 * reales... sin la integración real detrás sería engañoso") — Ana pidió
 * explícitamente lo contrario, así que se agregan acá. Sigue siendo un
 * login falso sin OAuth real detrás (ver AuthContext.tsx); el logo por
 * sí solo es un patrón estándar y reconocible en cualquier mockup/demo
 * de producto, no una promesa de integración real.
 *
 * Google usa sus 4 colores de marca reales (no `currentColor` — el
 * logo de Google SIEMPRE se ve así, no hereda color de texto). Apple sí
 * usa `currentColor`: su isotipo es monocromático por diseño, se pinta
 * del mismo color que el texto de al lado en cualquier contexto.
 */
export function IconGoogle({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className={className}>
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.68-3.87 2.68-6.62Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function IconApple({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" className={className}>
      <path d="M13.27 9.53c-.02-2.05 1.68-3.03 1.75-3.08-.96-1.4-2.45-1.59-2.98-1.61-1.27-.13-2.48.75-3.12.75-.65 0-1.63-.73-2.68-.71-1.38.02-2.65.8-3.36 2.03-1.43 2.48-.37 6.16 1.03 8.17.68.98 1.5 2.08 2.57 2.04 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.68.64 1.11-.02 1.81-1 2.48-1.99.78-1.14 1.11-2.25 1.13-2.3-.02-.01-2.16-.83-2.18-3.28Z" />
      <path d="M11.35 3.5c.56-.68.93-1.62.83-2.56-.8.03-1.77.53-2.35 1.2-.52.6-.98 1.56-.86 2.48.9.07 1.82-.45 2.38-1.12Z" />
    </svg>
  );
}

/* icon/arrow-right — flecha con palito (línea + punta), no confundir con
   IconCaretRight (que es solo un "wedge"/`>` sin línea). Se agregó
   2026-09-07 puntual para el botón circular de "siguiente mensaje" del
   carrusel de Bienvenida — a pedido de Ana: "que sea flechita con
   palito". */
export function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
