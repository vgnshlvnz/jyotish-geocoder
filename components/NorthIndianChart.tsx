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

type Pt = [number, number];

const V: Record<string, Pt> = {
  TL:[0,0], TC:[240,0], TR:[480,0],
  ML:[0,240], CTR:[240,240], MR:[480,240],
  BL:[0,480], BC:[240,480], BR:[480,480],
  ITL:[120,120], ITR:[360,120],
  IBL:[120,360], IBR:[360,360],
};

const HOUSES: Record<number, Pt[]> = {
  1:[V.ITL,V.ITR,V.CTR],
  2:[V.TL,V.TC,V.ITL,V.ML],
  3:[V.ML,V.ITL,V.IBL],
  4:[V.IBL,V.ITL,V.CTR],
  5:[V.ML,V.IBL,V.BC,V.BL],
  6:[V.IBL,V.BC,V.IBR],
  7:[V.IBR,V.IBL,V.CTR],
  8:[V.MR,V.BR,V.BC,V.IBR],
  9:[V.ITR,V.MR,V.IBR],
  10:[V.ITR,V.IBR,V.CTR],
  11:[V.TC,V.TR,V.MR,V.ITR],
  12:[V.TC,V.ITL,V.ITR],
};

function centroid(points: Pt[]): Pt {
  const x = points.reduce((s, p) => s + p[0], 0) / points.length;
  const y = points.reduce((s, p) => s + p[1], 0) / points.length;
  return [x, y];
}

function pointsToStr(points: Pt[]): string {
  return points.map((p) => p.join(',')).join(' ');
}

function HouseShape({ house, planetsInHouse, lagnaHouse }: {
  house: number;
  planetsInHouse: PlanetPosition[];
  lagnaHouse: number;
}) {
  const points = HOUSES[house];
  const [cx, cy] = centroid(points);
  const isLagna = house === lagnaHouse;

  const sorted = [...planetsInHouse].sort((a, b) =>
    a.planet === 'Lagna' ? -1 : b.planet === 'Lagna' ? 1 : a.planet.localeCompare(b.planet)
  );

  const twoCol = sorted.length > 3;
  const rowGap = twoCol ? 10.8 : 12.2;
  const rows = Math.max(1, Math.ceil(sorted.length / (twoCol ? 2 : 1)));
  const startY = cy - ((rows - 1) * rowGap) / 2 + 7;

  return (
    <g>
      <polygon
        points={pointsToStr(points)}
        fill={isLagna ? '#172657' : '#0f1838'}
        stroke={isLagna ? '#d4af47' : '#2a3769'}
        strokeWidth={isLagna ? 1.4 : 0.85}
        vectorEffect="non-scaling-stroke"
      />

      <text
        x={cx}
        y={cy - 32}
        textAnchor="middle"
        style={{ fontSize: '8.8px', fill: isLagna ? '#f0cd72' : '#9ea7bf', fontFamily: 'var(--font-body)' }}
      >
        {house}
      </text>

      {sorted.map((p, i) => {
        const col = twoCol ? i % 2 : 0;
        const row = twoCol ? Math.floor(i / 2) : i;
        const x = twoCol ? cx + (col === 0 ? -30 : 30) : cx;
        const y = startY + row * rowGap;
        return (
          <text
            key={p.planet}
            x={x}
            y={y}
            textAnchor="middle"
            style={{
              fontSize: twoCol ? '8.2px' : '9.2px',
              fill: PLANET_COLORS[p.planet] ?? '#f6f0de',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
            }}
          >
            {p.planet}
            {p.planet !== 'Lagna' && ` ${p.degree}°`}
            {p.isRetrograde && <tspan style={{ fill: '#fca5a5' }}> ℞</tspan>}
          </text>
        );
      })}
    </g>
  );
}

export default function NorthIndianChart({ planets }: Props) {
  const byHouse: Record<number, PlanetPosition[]> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  for (const p of planets) byHouse[p.house]?.push(p);

  const lagna = planets.find((p) => p.planet === 'Lagna');
  const lagnaRasiName = lagna ? RASI_NAMES_LIST[lagna.rasi] : '';

  return (
    <div className="vedic-card" style={{ padding: 8 }}>
      <div className="chart-wrap">
        <svg className="chart-svg" viewBox="0 0 480 480" role="img" aria-label="North Indian birth chart">
          <rect width="480" height="480" fill="#0b1230" />
          <polygon points={pointsToStr([V.ITL, V.ITR, V.IBR, V.IBL])} fill="none" stroke="#2a3769" strokeWidth="0.8" />

          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <HouseShape key={h} house={h} lagnaHouse={1} planetsInHouse={byHouse[h] ?? []} />
          ))}

          {lagnaRasiName && (
            <text
              x={centroid(HOUSES[1])[0]}
              y={centroid(HOUSES[1])[1] + 34}
              textAnchor="middle"
              style={{ fontSize: '8px', fill: '#d4af47', fontFamily: 'var(--font-body)', letterSpacing: '0.08em' }}
            >
              {lagnaRasiName}
            </text>
          )}

          <rect x="0" y="0" width="480" height="480" fill="none" stroke="#b9933b" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
