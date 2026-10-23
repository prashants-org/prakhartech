import { useEffect, useState } from 'react'

// Illustrative "live dashboard": a stylised city map with vehicles moving
// along routes, telemetry chips and a geofence. Pure SVG + SMIL, no map
// library. Motion starts after mount and only if the visitor allows motion,
// so the prerendered HTML and first client render are identical.

const ROUTES = [
  { id: 'r1', d: 'M30 300 C 120 300, 150 210, 240 205 S 380 120, 500 110', color: '#2563eb', dur: 14 },
  { id: 'r2', d: 'M60 60 C 140 90, 170 160, 230 250 S 330 360, 480 350', color: '#0ea5e9', dur: 18 },
  { id: 'r3', d: 'M500 250 C 420 250, 390 300, 310 300 S 160 380, 40 380', color: '#f97316', dur: 16 },
]

function LiveFleetMap() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable motion only after hydration
    if (!reduce) setAnimate(true)
  }, [])

  return (
    <div className="lfm" role="img" aria-label="Illustration of the live tracking dashboard: vehicles moving across a city map with speed and alert notifications">
      <div className="lfm-chrome" aria-hidden="true">
        <span className="lfm-dot" />
        <span className="lfm-dot" />
        <span className="lfm-dot" />
        <span className="lfm-title">Live fleet · Pune</span>
        <span className="lfm-live"><i />LIVE</span>
      </div>

      <svg className="lfm-map" viewBox="0 0 540 420" aria-hidden="true">
        <defs>
          <pattern id="lfm-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="currentColor" strokeOpacity="0.07" />
          </pattern>
          <radialGradient id="lfm-pulse">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="540" height="420" fill="url(#lfm-grid)" />

        {/* river */}
        <path d="M0 170 C 90 150, 140 190, 220 160 S 380 70, 540 60" fill="none" stroke="#bae6fd" strokeWidth="18" strokeLinecap="round" opacity="0.7" />

        {/* city blocks */}
        {[
          [70, 200, 60, 40], [150, 240, 46, 36], [300, 150, 70, 44], [390, 170, 52, 52],
          [330, 230, 40, 30], [90, 320, 70, 34], [400, 300, 60, 34], [200, 60, 60, 40],
        ].map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="6" className="lfm-block" />
        ))}

        {/* geofence */}
        <circle cx="420" cy="120" r="46" className="lfm-fence" />
        <text x="420" y="78" textAnchor="middle" className="lfm-fence-label">Plant geofence</text>

        {/* roads */}
        {ROUTES.map((r) => (
          <g key={r.id}>
            <path d={r.d} className="lfm-road" />
            <path id={r.id} d={r.d} className="lfm-route" style={{ stroke: r.color }} />
          </g>
        ))}

        {/* depot */}
        <g transform="translate(240 205)">
          <circle r="22" fill="url(#lfm-pulse)" className={animate ? 'lfm-pulse' : undefined} />
          <circle r="6" fill="#0f172a" />
        </g>

        {/* vehicles */}
        {ROUTES.map((r, i) => (
          <g key={`v-${r.id}`} className="lfm-vehicle">
            {animate ? (
              <circle r="9" fill="#fff" stroke={r.color} strokeWidth="3">
                <animateMotion dur={`${r.dur}s`} repeatCount="indefinite" begin={`${-i * 3}s`}>
                  <mpath href={`#${r.id}`} />
                </animateMotion>
              </circle>
            ) : (
              // static position so the illustration still reads without motion
              <circle r="9" fill="#fff" stroke={r.color} strokeWidth="3" cx={[150, 215, 310][i]} cy={[262, 228, 300][i]} />
            )}
          </g>
        ))}
      </svg>

      <div className="lfm-chip lfm-chip--a" aria-hidden="true">
        <span className="lfm-chip-dot" style={{ background: '#2563eb' }} />
        <div>
          <strong>Truck 07</strong>
          <span>46 km/h · On route</span>
        </div>
      </div>
      <div className="lfm-chip lfm-chip--b" aria-hidden="true">
        <span className="lfm-chip-icon">⚠</span>
        <div>
          <strong>Idle alert</strong>
          <span>Van 03 · engine on 6 min</span>
        </div>
      </div>
      <div className="lfm-chip lfm-chip--c" aria-hidden="true">
        <span className="lfm-chip-icon lfm-chip-icon--ok">✓</span>
        <div>
          <strong>Arrived</strong>
          <span>Bus 12 entered plant</span>
        </div>
      </div>
      <p className="lfm-caption">Illustrative dashboard view</p>
    </div>
  )
}

export default LiveFleetMap
