import { useMemo } from 'react'

export default function CosmojiEmblem({ size = 28, className = '' }) {
  const px = size
  const ringBorder = Math.max(2, Math.round(size / 14))

  // Inline style values derived from size to keep proportions
  const styles = useMemo(() => ({
    root: { width: px, height: px },
    ring: { borderWidth: ringBorder },
    dot: {
      fontSize: Math.round(px * 0.42),
      left: Math.round(px * 0.32),
      top: Math.round(px * 0.30),
    },
    degree: {
      fontSize: Math.round(px * 0.36),
      left: Math.round(px * 0.58),
      top: Math.round(px * 0.08),
    },
    sparkle1: { right: -Math.round(px * 0.14), top: Math.round(px * 0.35) },
    sparkle2: { right: -Math.round(px * 0.28), top: -Math.round(px * 0.06) },
    sparkle3: { right: -Math.round(px * 0.04), bottom: -Math.round(px * 0.02) },
  }), [px, ringBorder])

  return (
    <span className={`relative inline-block align-middle cosmoji-emblem ${className}`} style={styles.root} aria-hidden="true">
      {/* Local styles scoped by class names */}
      <style>{`
        .cosmoji-emblem .cosmoji-ring { 
          position: absolute; inset: 0; border-radius: 9999px; 
          border-style: solid; border-color: rgba(2, 6, 23, 0.2); /* slate-950/20 on white */
          box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.06) inset;
          background: radial-gradient(closest-side, rgba(2,6,23,0.02), transparent);
        }
        .dark .cosmoji-emblem .cosmoji-ring {
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset;
          background: radial-gradient(closest-side, rgba(255,255,255,0.04), transparent);
        }
        .cosmoji-emblem .glyph { position: absolute; line-height: 1; color: #0f172a; opacity: 0.9; }
        .dark .cosmoji-emblem .glyph { color: #e2e8f0; }

        .cosmoji-emblem .sparkle { 
          position: absolute; color: #0891b2; /* cyan-700 */
          filter: drop-shadow(0 0 2px rgba(34,211,238,0.6));
          animation: cosmoji-sparkle 2.4s ease-in-out infinite;
          transform-origin: left center;
          font-size: ${Math.max(10, Math.round(px * 0.34))}px;
          opacity: 0;
        }
        .cosmoji-emblem .sparkle:nth-of-type(1) { animation-delay: 0s; }
        .cosmoji-emblem .sparkle:nth-of-type(2) { animation-delay: 0.6s; color: #06b6d4; }
        .cosmoji-emblem .sparkle:nth-of-type(3) { animation-delay: 1.2s; color: #22d3ee; }

        @keyframes cosmoji-sparkle {
          0%   { transform: translateX(0px) scale(0.6) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          45%  { transform: translateX(${Math.round(px * 0.38)}px) scale(1) rotate(12deg); opacity: 0.85; }
          70%  { opacity: 0.3; }
          100% { transform: translateX(${Math.round(px * 0.7)}px) scale(0.9) rotate(22deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cosmoji-emblem .sparkle { animation: none; opacity: 0.25; }
        }
      `}</style>

      <span className="cosmoji-ring" style={styles.ring} />
      <span className="glyph" style={styles.dot}>•</span>
      <span className="glyph" style={styles.degree}>°</span>

      {/* Sparkles bursting from the right side of the ring */}
      <span className="sparkle" style={styles.sparkle1}>✦</span>
      <span className="sparkle" style={styles.sparkle2}>✦</span>
      <span className="sparkle" style={styles.sparkle3}>✦</span>
    </span>
  )
}
