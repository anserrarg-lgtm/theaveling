/*
 * Placeholder de imagen para cards sin foto real todavía — no es
 * contenido inventado (no simula una foto real), es una textura neutra
 * que deja claro que ahí va una imagen, mientras se suma fotografía real
 * (ver VOICE.md — Thea cura, no decora con foto de stock genérica).
 */
export default function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(251,251,251,0.10) 0%, rgba(251,251,251,0.02) 60%)",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-white-20">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10.5" r="1.6" />
        <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 19" />
      </svg>
    </div>
  );
}
