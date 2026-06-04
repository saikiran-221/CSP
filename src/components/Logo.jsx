/* Logo / Brand Component */
export function Logo({ size = 'md', showText = true, onClick }) {
  const cfg = {
    sm: { box: 30, r: 8,  font: '0.95rem' },
    md: { box: 36, r: 10, font: '1.1rem'  },
    lg: { box: 48, r: 14, font: '1.4rem'  },
  }
  const c = cfg[size] || cfg.md

  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: onClick ? 'pointer' : 'default', textDecoration: 'none' }}
    >
      {/* Icon box */}
      <div style={{
        width: c.box, height: c.box, borderRadius: c.r, flexShrink: 0,
        background: 'linear-gradient(135deg, #6B7CC4 0%, #5B8DB8 50%, #7BAE8F 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(107,124,196,0.35)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle sheen */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
        }} />
        {/* DX text icon */}
        <span style={{
          fontWeight: 900, fontSize: c.box * 0.38, color: 'white',
          letterSpacing: '-1px', lineHeight: 1, position: 'relative',
          fontFamily: 'Inter, sans-serif',
        }}>
          DX
        </span>
      </div>

      {/* Brand name */}
      {showText && (
        <span style={{ fontWeight: 800, fontSize: c.font, letterSpacing: '-0.03em', lineHeight: 1, userSelect: 'none' }}>
          <span style={{ color: 'var(--c-text-1)' }}>Doubt</span>
          <span style={{
            background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontWeight: 900, fontSize: '1.05em',
          }}>
            X
          </span>
          <span style={{ color: 'var(--c-text-1)' }}>change</span>
        </span>
      )}
    </div>
  )
}
