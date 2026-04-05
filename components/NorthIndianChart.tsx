'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#c27c00', Moon: '#2f6fb6', Mars: '#c53030',
  Mercury: '#18794e', Jupiter: '#b36b00', Venus: '#ad3f84',
  Saturn: '#4b6073', Rahu: '#556987', Ketu: '#556987', Lagna: '#1476d1',
};

type Pt = [number, number];

const V: Record<string, Pt> = {
  TL:[0,0],   TC:[240,0],  TR:[480,0],
  ML:[0,240], CTR:[240,240], MR:[480,240],
  BL:[0,480], BC:[240,480], BR:[480,480],
  ITL:[120,120], ITR:[360,120],
  IBL:[120,360], IBR:[360,360],
};

const HOUSES: Record<number, Pt[]> = {
  1:  [V.ITL, V.ITR, V.CTR],
  2:  [V.TL,  V.TC,  V.ITL, V.ML],
  3:  [V.ML,  V.ITL, V.IBL],
  4:  [V.IBL, V.ITL, V.CTR],
  5:  [V.ML,  V.IBL, V.BC, V.BL],
  6:  [V.IBL, V.BC,  V.IBR],
  7:  [V.IBR, V.IBL, V.CTR],
  8:  [V.MR,  V.BR,  V.BC, V.IBR],
  9:  [V.ITR, V.MR,  V.IBR],
  10: [V.ITR, V.IBR, V.CTR],
  11: [V.TC,  V.TR,  V.MR, V.ITR],
  12: [V.TC,  V.ITL, V.ITR],
};

function centroid(pts: Pt[]): Pt {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [cx, cy];
}

function ptsToStr(pts: Pt[]): string {
  return pts.map((p) => p.join(',')).join(' ');
}

function HousePolygon({ house, planetsInHouse, lagnaHouse }: {
  house: number;
  planetsInHouse: PlanetPosition[];
  lagnaHouse: number;
}) {
  const pts = HOUSES[house];
  const [cx, cy] = centroid(pts);
  const isLagna = house === lagnaHouse;

  const sorted = [...planetsInHouse].sort((a, b) =>
    a.planet === 'Lagna' ? -1 : b.planet === 'Lagna' ? 1 : a.planet.localeCompare(b.planet)
  );

  const twoCol = sorted.length > 3;
  const lineH = twoCol ? 11 : 12.5;
  const rows = Math.max(1, Math.ceil(sorted.length / (twoCol ? 2 : 1)));
  const startY = cy - ((rows - 1) * lineH) / 2 + 7;

  return (
    <g>
      <polygon
        points={ptsToStr(pts)}
        fill={isLagna ? '#eaf4ff' : '#ffffff'}
        stroke={isLagna ? '#1476d1' : '#d9e2ec'}
        strokeWidth={isLagna ? 1.3 : 0.85}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <text
        x={cx}
        y={cy - 33}
        textAnchor="middle"
        style={{
          fontSize: '9px',
          fill: isLagna ? '#1476d1' : '#7a8da3',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.08em',
        }}
      >
        {house}
      </text>

      {sorted.map((p, i) => {
        const color = PLANET_COLORS[p.planet] ?? '#1476d1';
        const col = twoCol ? i % 2 : 0;
        const row = twoCol ? Math.floor(i / 2) : i;
        const x = twoCol ? cx + (col === 0 ? -30 : 30) : cx;
        const y = startY + row * lineH;
        return (
          <text
            key={p.planet}
            x={x}
            y={y}
            textAnchor="middle"
            style={{
              fontSize: twoCol ? '8.8px' : '9.6px',
              fontFamily: 'var(--font-mono)',
              fill: color,
              fontWeight: 600,
            }}
          >
            {p.planet}
            {p.planet !== 'Lagna' && ` ${p.degree}°`}
            {p.isRetrograde && (
              <tspan style={{ fill: '#be123c', fontSize: '8px' }}> ℞</tspan>
            )}
          </text>
        );
      })}
    </g>
  );
}

export default function NorthIndianChart({ planets }: Props) {
  const lagnaHouse = 1;
  const lagnaPos = planets.find((p) => p.planet === 'Lagna');
  const lagnaRasiName = lagnaPos ? RASI_NAMES_LIST[lagnaPos.rasi] : '';

  const byHouse: Record<number, PlanetPosition[]> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  for (const p of planets) {
    if (byHouse[p.house]) byHouse[p.house].push(p);
  }

  return (
    <div className="astro-shell astro-shell--compact astro-shell--chart">
      <div className="astro-chart-frame">
        <svg
          className="astro-chart-svg"
          viewBox="0 0 480 480"
          role="img"
          aria-label="North Indian birth chart"
        >
          <defs>
            <linearGradient id="north-chart-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f4f8fc" />
            </linearGradient>
          </defs>

          <rect width="480" height="480" fill="url(#north-chart-bg)" />
          <polygon
            points={ptsToStr([V.ITL, V.ITR, V.IBR, V.IBL])}
            fill="none"
            stroke="#c8d7e6"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />

          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <HousePolygon key={h} house={h} planetsInHouse={byHouse[h] ?? []} lagnaHouse={lagnaHouse} />
          ))}

          {lagnaRasiName && (
            <text
              x={centroid(HOUSES[1])[0]}
              y={centroid(HOUSES[1])[1] + 34}
              textAnchor="middle"
              style={{
                fontSize: '8.5px',
                fill: '#1476d1',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.08em',
              }}
            >
              {lagnaRasiName}
            </text>
          )}

          <rect x="0" y="0" width="480" height="480" fill="none" stroke="#c8d7e6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
