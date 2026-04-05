'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#e8b447',
  Moon: '#9ac7ff',
  Mars: '#ff8a7a',
  Mercury: '#8dd9a8',
  Jupiter: '#f0cd72',
  Venus: '#f5a8db',
  Saturn: '#b8c5dc',
  Rahu: '#d9c8ff',
  Ketu: '#d9c8ff',
  Lagna: '#f0cd72',
};

const CELL_TO_RASI: Record<string, number> = {
  '0,0': 11, '0,1': 0, '0,2': 1,  '0,3': 2,
  '1,0': 10,                        '1,3': 3,
  '2,0': 9,                         '2,3': 4,
  '3,0': 8,  '3,1': 7, '3,2': 6,  '3,3': 5,
};

const CENTER_CELLS = new Set(['1,1','1,2','2,1','2,2']);
const CELL = 120;

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
  const rowGap = twoCol ? 11 : 12.5;
  const startY = 30;
  const centerX = CELL / 2;

  return (
    <>
      <text
        x="9"
        y="14"
        style={{
          fontSize: '9px',
          fontFamily: 'var(--font-body)',
          fill: '#b6bfd8',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </text>

      {isLagna && <polygon points="0,0 16,0 0,16" fill="#d4af47" opacity="0.55" />}

      {sorted.map((p, idx) => {
        const col = twoCol ? idx % 2 : 0;
        const row = twoCol ? Math.floor(idx / 2) : idx;
        const px = twoCol ? (col === 0 ? centerX - 30 : centerX + 30) : 8;
        const py = startY + row * rowGap;
        if (py > CELL - 8) return null;

        return (
          <text
            key={p.planet}
            x={px}
            y={py}
            textAnchor={twoCol ? 'middle' : 'start'}
            style={{
              fontSize: twoCol ? '8.6px' : '9.6px',
              fontFamily: 'var(--font-mono)',
              fill: PLANET_COLORS[p.planet] ?? '#f6f0de',
              fontWeight: 600,
            }}
          >
            {p.planet}
            {p.planet !== 'Lagna' && ` ${p.degree}°`}
            {p.isRetrograde && <tspan style={{ fill: '#fca5a5' }}> ℞</tspan>}
          </text>
        );
      })}
    </>
  );
}

export default function SouthIndianChart({ planets }: Props) {
  const lagnaRasi = planets.find((p) => p.planet === 'Lagna')?.rasi ?? -1;

  const byRasi: Record<number, PlanetPosition[]> = {};
  for (const p of planets) {
    if (!byRasi[p.rasi]) byRasi[p.rasi] = [];
    byRasi[p.rasi].push(p);
  }

  return (
    <div className="vedic-card" style={{ padding: 8 }}>
      <div className="chart-wrap">
        <svg className="chart-svg" viewBox="0 0 480 480" role="img" aria-label="South Indian birth chart">
          <rect width="480" height="480" fill="#0b1230" />

          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => {
              const key = `${row},${col}`;
              const x = col * CELL;
              const y = row * CELL;

              if (CENTER_CELLS.has(key)) {
                return (
                  <rect
                    key={key}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    fill="#0f1835"
                    stroke="#2a3769"
                    strokeWidth="0.8"
                  />
                );
              }

              const rasi = CELL_TO_RASI[key];
              if (rasi === undefined) return null;
              const planetsInRasi = byRasi[rasi] ?? [];
              const isLagna = lagnaRasi === rasi;

              return (
                <g key={key}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    fill={isLagna ? '#172657' : '#0f1838'}
                    stroke={isLagna ? '#d4af47' : '#2a3769'}
                    strokeWidth={isLagna ? 1.4 : 0.85}
                    vectorEffect="non-scaling-stroke"
                  />
                  <svg x={x} y={y} width={CELL} height={CELL} overflow="hidden">
                    <CellContent rasi={rasi} planetsInRasi={planetsInRasi} isLagna={isLagna} />
                  </svg>
                </g>
              );
            })
          )}

          <rect x="0" y="0" width="480" height="480" fill="none" stroke="#b9933b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
