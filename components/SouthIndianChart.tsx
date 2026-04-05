'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#c27c00', Moon: '#2f6fb6', Mars: '#c53030',
  Mercury: '#18794e', Jupiter: '#b36b00', Venus: '#ad3f84',
  Saturn: '#4b6073', Rahu: '#556987', Ketu: '#556987', Lagna: '#1476d1',
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
  const label = RASI_NAMES_LIST[rasi].slice(0, 3).toUpperCase();

  const sorted = [...planetsInRasi].sort((a, b) =>
    a.planet === 'Lagna' ? -1 : b.planet === 'Lagna' ? 1 : a.planet.localeCompare(b.planet)
  );

  const twoCol = sorted.length > 3;
  const columns = twoCol ? 2 : 1;
  const rows = Math.max(1, Math.ceil(sorted.length / columns));
  const lineH = twoCol ? 12 : 13;
  const startY = 32;
  const centerX = CELL / 2;

  return (
    <>
      <text
        x="10"
        y="14"
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-body)',
          fill: '#5f7183',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </text>

      {isLagna && (
        <polygon
          points={`0,0 16,0 0,16`}
          fill="#d9ebfb"
        />
      )}

      {sorted.map((p, idx) => {
        const col = twoCol ? idx % 2 : 0;
        const row = twoCol ? Math.floor(idx / 2) : idx;
        const px = twoCol ? (col === 0 ? centerX - 30 : centerX + 30) : 12;
        const py = startY + row * lineH;
        if (py > CELL - 10) return null;
        const color = PLANET_COLORS[p.planet] ?? '#D4A017';
        return (
          <g key={p.planet}>
            <text
              x={px}
              y={py}
              textAnchor={twoCol ? 'middle' : 'start'}
              style={{
                fontSize: twoCol ? '10px' : '11px',
                fontFamily: 'var(--font-mono)',
                fill: color,
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              {p.planet}
              {p.planet !== 'Lagna' && ` ${p.degree}°`}
              {p.isRetrograde && (
                <tspan style={{ fill: '#be123c', fontSize: '9px' }}> ℞</tspan>
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

  const byRasi: Record<number, PlanetPosition[]> = {};
  for (const p of planets) {
    if (!byRasi[p.rasi]) byRasi[p.rasi] = [];
    byRasi[p.rasi].push(p);
  }

  return (
    <div className="astro-shell astro-shell--compact astro-shell--chart">
      <div className="astro-chart-frame">
        <svg
          className="astro-chart-svg"
          viewBox="0 0 480 480"
          role="img"
          aria-label="South Indian birth chart"
        >
          <defs>
            <linearGradient id="south-chart-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f4f8fc" />
            </linearGradient>
            <linearGradient id="south-cell-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f7fbff" />
            </linearGradient>
            <linearGradient id="south-lagna-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eaf4ff" />
              <stop offset="100%" stopColor="#f6fbff" />
            </linearGradient>
          </defs>

          <rect width="480" height="480" fill="url(#south-chart-bg)" />

          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => {
              const key = `${row},${col}`;
              const x = col * CELL;
              const y = row * CELL;

              if (CENTER_CELLS.has(key)) {
                return (
                  <g key={key}>
                    <rect
                      x={x}
                      y={y}
                      width={CELL}
                      height={CELL}
                      fill="#ffffff"
                      stroke="#d9e2ec"
                      strokeWidth="0.75"
                    />
                  </g>
                );
              }

              const rasi = CELL_TO_RASI[key];
              if (rasi === undefined) return null;
              const planetsInRasi = byRasi[rasi] ?? [];
              const isLagna = rasi === lagnaRasi;

              return (
                <g key={key}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    fill={isLagna ? 'url(#south-lagna-bg)' : 'url(#south-cell-bg)'}
                    stroke={isLagna ? '#1476d1' : '#d9e2ec'}
                    strokeWidth={isLagna ? 1.3 : 0.85}
                    vectorEffect="non-scaling-stroke"
                  />
                  {isLagna && (
                    <rect
                      x={x + 5}
                      y={y + 5}
                      width={CELL - 10}
                      height={CELL - 10}
                      fill="none"
                      stroke="#b7d7f3"
                      strokeWidth="0.9"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <svg x={x} y={y} width={CELL} height={CELL} overflow="hidden">
                    <CellContent rasi={rasi} planetsInRasi={planetsInRasi} isLagna={isLagna} />
                  </svg>
                </g>
              );
            })
          )}

          <rect
            x="0"
            y="0"
            width="480"
            height="480"
            fill="none"
            stroke="#c8d7e6"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
