'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFB300', Moon: '#90CAF9', Mars: '#EF5350',
  Mercury: '#66BB6A', Jupiter: '#FFA726', Venus: '#EC407A',
  Saturn: '#78909C', Rahu: '#B0BEC5', Ketu: '#B0BEC5', Lagna: '#D4A017',
};

/**
 * South Indian chart: fixed rasi positions (not house-based).
 * Signs go clockwise starting from Pisces at top-left.
 *
 * Grid (row, col) → rasi index (0=Aries):
 *   (0,0)=11(Pis)  (0,1)=0(Ari)   (0,2)=1(Tau)  (0,3)=2(Gem)
 *   (1,0)=10(Aqu)  [center]        [center]       (1,3)=3(Can)
 *   (2,0)=9(Cap)   [center]        [center]       (2,3)=4(Leo)
 *   (3,0)=8(Sag)   (3,1)=7(Sco)   (3,2)=6(Lib)  (3,3)=5(Vir)
 */
const CELL_TO_RASI: Record<string, number> = {
  '0,0': 11, '0,1': 0, '0,2': 1,  '0,3': 2,
  '1,0': 10,                        '1,3': 3,
  '2,0': 9,                         '2,3': 4,
  '3,0': 8,  '3,1': 7, '3,2': 6,  '3,3': 5,
};

const CENTER_CELLS = new Set(['1,1','1,2','2,1','2,2']);

const CELL = 120; // px per cell

function CellContent({ rasi, planetsInRasi, isLagna }: {
  rasi: number;
  planetsInRasi: PlanetPosition[];
  isLagna: boolean;
}) {
  const cx = 0;
  const cy = 0;
  const label = RASI_NAMES_LIST[rasi].slice(0, 3);

  // Sort: Lagna first, then by planet name
  const sorted = [...planetsInRasi].sort((a, b) =>
    a.planet === 'Lagna' ? -1 : b.planet === 'Lagna' ? 1 : a.planet.localeCompare(b.planet)
  );

  // Layout planets: 1 column if ≤3, 2 columns if >3
  const twoCol = sorted.length > 3;
  const lineH = 14;
  const startY = 30; // below rasi label

  return (
    <>
      {/* Rasi label */}
      <text x={cx + 6} y={cy + 14} style={{
        fontSize: '9px', fontFamily: 'var(--font-display)',
        fill: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em',
      }}>{label}</text>

      {/* Lagna triangle marker */}
      {isLagna && (
        <polygon
          points={`${cx},${cy} ${cx + 16},${cy} ${cx},${cy + 16}`}
          fill="rgba(212,160,23,0.55)"
        />
      )}

      {/* Planet glyphs */}
      {sorted.map((p, idx) => {
        const col = twoCol ? idx % 2 : 0;
        const row = twoCol ? Math.floor(idx / 2) : idx;
        const px = cx + (twoCol ? 8 + col * 56 : 8);
        const py = cy + startY + row * lineH;
        if (py > cy + CELL - 8) return null; // overflow guard
        const color = PLANET_COLORS[p.planet] ?? '#D4A017';
        return (
          <g key={p.planet}>
            <text x={px} y={py} style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fill: color,
            }}>
              {p.glyph}
              {p.planet !== 'Lagna' && ` ${p.degree}°`}
              {p.isRetrograde && (
                <tspan style={{ fill: 'rgba(239,68,68,0.75)', fontSize: '9px' }}> ℞</tspan>
              )}
            </text>
          </g>
        );
      })}
    </>
  );
}

export default function SouthIndianChart({ planets }: Props) {
  const lagnaRasi = planets.find(p => p.planet === 'Lagna')?.rasi ?? -1;

  // Group planets by rasi
  const byRasi: Record<number, PlanetPosition[]> = {};
  for (const p of planets) {
    if (!byRasi[p.rasi]) byRasi[p.rasi] = [];
    byRasi[p.rasi].push(p);
  }

  return (
    <svg
      viewBox="0 0 480 480"
      style={{ width: '100%', maxWidth: '480px', display: 'block' }}
      role="img"
      aria-label="South Indian birth chart"
    >
      {/* Background */}
      <rect width="480" height="480" fill="#080812" />

      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => {
          const key = `${row},${col}`;
          const x = col * CELL;
          const y = row * CELL;

          if (CENTER_CELLS.has(key)) {
            return (
              <g key={key}>
                <rect x={x} y={y} width={CELL} height={CELL}
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
                {/* OM symbol in center */}
                {key === '1,1' && (
                  <text x={x + CELL} y={y + CELL}
                    textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: '28px', fill: 'rgba(212,160,23,0.08)', fontFamily: 'serif' }}
                  >
                    🕉
                  </text>
                )}
              </g>
            );
          }

          const rasi = CELL_TO_RASI[key];
          if (rasi === undefined) return null;
          const planetsInRasi = byRasi[rasi] ?? [];
          const isLagna = rasi === lagnaRasi;

          return (
            <g
              key={key}
              style={{ cursor: 'default' }}
              onMouseEnter={e => {
                const rect = e.currentTarget.querySelector('rect');
                if (rect) rect.setAttribute('filter', 'brightness(1.18)');
              }}
              onMouseLeave={e => {
                const rect = e.currentTarget.querySelector('rect');
                if (rect) rect.removeAttribute('filter');
              }}
            >
              {/* Cell background */}
              <rect
                x={x} y={y} width={CELL} height={CELL}
                fill="rgba(14,14,28,0.85)"
                stroke={isLagna ? 'rgba(212,160,23,0.55)' : 'rgba(255,255,255,0.07)'}
                strokeWidth={isLagna ? 1.5 : 0.8}
              />
              {/* Lagna inner border */}
              {isLagna && (
                <rect
                  x={x + 4} y={y + 4} width={CELL - 8} height={CELL - 8}
                  fill="none"
                  stroke="rgba(212,160,23,0.25)"
                  strokeWidth="0.8"
                />
              )}
              {/* Content clipped to cell */}
              <svg x={x} y={y} width={CELL} height={CELL} overflow="hidden">
                <CellContent rasi={rasi} planetsInRasi={planetsInRasi} isLagna={isLagna} />
              </svg>
            </g>
          );
        })
      )}

      {/* Outer border */}
      <rect x="0" y="0" width="480" height="480"
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
}
