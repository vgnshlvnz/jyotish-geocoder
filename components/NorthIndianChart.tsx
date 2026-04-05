'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFB300', Moon: '#90CAF9', Mars: '#EF5350',
  Mercury: '#66BB6A', Jupiter: '#FFA726', Venus: '#EC407A',
  Saturn: '#78909C', Rahu: '#B0BEC5', Ketu: '#B0BEC5', Lagna: '#D4A017',
};

/**
 * North Indian chart — 12 house polygons on a 480×480 canvas.
 *
 * Key points:
 *   TL=(0,0)    TC=(240,0)   TR=(480,0)
 *   ML=(0,240)  CTR=(240,240) MR=(480,240)
 *   BL=(0,480)  BC=(240,480)  BR=(480,480)
 *   ITL=(120,120) ITR=(360,120)
 *   IBL=(120,360) IBR=(360,360)
 *
 * Houses (house number → polygon vertices):
 *   H1  (top inner):    ITL, ITR, CTR
 *   H2  (top-left):     TL, TC, ITL, ML
 *   H3  (left edge):    ML, ITL, IBL
 *   H4  (left inner):   IBL, ITL, CTR
 *   H5  (bot-left):     ML, IBL, BC, BL
 *   H6  (bot edge):     IBL, BC, IBR
 *   H7  (bot inner):    IBR, IBL, CTR
 *   H8  (bot-right):    MR, BR, BC, IBR
 *   H9  (right edge):   ITR, MR, IBR
 *   H10 (right inner):  ITR, IBR, CTR
 *   H11 (top-right):    TC, TR, MR, ITR
 *   H12 (top edge):     TC, ITL, ITR
 */

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
  return pts.map(p => p.join(',')).join(' ');
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
    a.planet === 'Lagna' ? -1 : b.planet === 'Lagna' ? 1 : 0
  );

  const twoCol = sorted.length > 3;
  const columns = twoCol ? 2 : 1;
  const rows = Math.max(1, Math.ceil(sorted.length / columns));
  const lineH = twoCol ? 11.5 : 13;
  const startY = cy - ((rows - 1) * lineH) / 2 + 8;

  return (
    <g>
      <polygon
        points={ptsToStr(pts)}
        fill={isLagna ? 'rgba(212,160,23,0.08)' : 'rgba(14,14,28,0.86)'}
        stroke={isLagna ? 'rgba(212,160,23,0.72)' : 'rgba(255,255,255,0.08)'}
        strokeWidth={isLagna ? 1.4 : 0.85}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={cx}
        y={cy - 34}
        textAnchor="middle"
        style={{
          fontSize: '9px',
          fill: isLagna ? 'rgba(212,160,23,0.7)' : 'rgba(244,240,232,0.26)',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.08em',
        }}
      >
        {house}
      </text>

      {sorted.map((p, i) => {
        const color = PLANET_COLORS[p.planet] ?? '#D4A017';
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
              fontSize: twoCol ? '9px' : '10px',
              fontFamily: 'var(--font-mono)',
              fill: color,
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
            paintOrder="stroke"
            stroke="rgba(8,8,16,0.85)"
            strokeWidth="2"
          >
            {p.glyph}
            {p.planet !== 'Lagna' && ` ${p.degree}°`}
            {p.isRetrograde && (
              <tspan style={{ fill: 'rgba(239,68,68,0.82)', fontSize: '8px' }}> ℞</tspan>
            )}
          </text>
        );
      })}
    </g>
  );
}

export default function NorthIndianChart({ planets }: Props) {
  const lagnaHouse = 1; // by definition in whole-sign system

  const lagnaPos = planets.find(p => p.planet === 'Lagna');
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
              <stop offset="0%" stopColor="#0b0b15" />
              <stop offset="56%" stopColor="#10101d" />
              <stop offset="100%" stopColor="#070710" />
            </linearGradient>
            <linearGradient id="north-lagna-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(212,160,23,0.14)" />
              <stop offset="100%" stopColor="rgba(212,160,23,0.03)" />
            </linearGradient>
            <linearGradient id="north-cell-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.055)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
            <radialGradient id="north-glow" cx="50%" cy="48%" r="70%">
              <stop offset="0%" stopColor="rgba(212,160,23,0.12)" />
              <stop offset="55%" stopColor="rgba(212,160,23,0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="480" height="480" fill="url(#north-chart-bg)" />
          <rect width="480" height="480" fill="url(#north-glow)" />
          <polygon
            points={ptsToStr([V.ITL, V.ITR, V.IBR, V.IBL])}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />

          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
            <HousePolygon
              key={h}
              house={h}
              planetsInHouse={byHouse[h] ?? []}
              lagnaHouse={lagnaHouse}
            />
          ))}

          {lagnaRasiName && (
            <text
              x={centroid(HOUSES[1])[0]}
              y={centroid(HOUSES[1])[1] + 34}
              textAnchor="middle"
              style={{
                fontSize: '8.5px',
                fill: 'rgba(212,160,23,0.68)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
              paintOrder="stroke"
              stroke="rgba(8,8,16,0.85)"
              strokeWidth="1.5"
            >
              {lagnaRasiName}
            </text>
          )}

          <rect
            x="0"
            y="0"
            width="480"
            height="480"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
