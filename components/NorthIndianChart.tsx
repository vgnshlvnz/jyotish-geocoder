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
 *   H2  (top-right):    TC, TR, MR, ITR
 *   H3  (right edge):   ITR, MR, IBR
 *   H4  (left inner):   IBL, ITL, CTR
 *   H5  (bot-right):    MR, BR, BC, IBR
 *   H6  (bot edge):     IBL, BC, IBR
 *   H7  (bot inner):    IBR, IBL, CTR
 *   H8  (bot-left):     ML, IBL, BC, BL
 *   H9  (left edge):    ML, ITL, IBL
 *   H10 (right inner):  ITR, IBR, CTR
 *   H11 (top-left):     TL, TC, ITL, ML
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
  2:  [V.TC,  V.TR,  V.MR, V.ITR],
  3:  [V.ITR, V.MR,  V.IBR],
  4:  [V.IBL, V.ITL, V.CTR],
  5:  [V.MR,  V.BR,  V.BC, V.IBR],
  6:  [V.IBL, V.BC,  V.IBR],
  7:  [V.IBR, V.IBL, V.CTR],
  8:  [V.ML,  V.IBL, V.BC, V.BL],
  9:  [V.ML,  V.ITL, V.IBL],
  10: [V.ITR, V.IBR, V.CTR],
  11: [V.TL,  V.TC,  V.ITL, V.ML],
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

  // Spread planets vertically around centroid
  const lineH = 13;
  const totalH = sorted.length * lineH;
  const startY = cy - totalH / 2 + lineH / 2;

  return (
    <g>
      <polygon
        points={ptsToStr(pts)}
        fill={isLagna ? 'rgba(212,160,23,0.05)' : 'rgba(14,14,28,0.85)'}
        stroke={isLagna ? 'rgba(212,160,23,0.6)' : 'rgba(255,255,255,0.07)'}
        strokeWidth={isLagna ? 1.5 : 0.8}
      />
      {/* House number */}
      <text
        x={cx} y={cy - totalH / 2 - 4}
        textAnchor="middle"
        style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-body)' }}
      >{house}</text>

      {/* Planet labels */}
      {sorted.map((p, i) => {
        const color = PLANET_COLORS[p.planet] ?? '#D4A017';
        return (
          <text
            key={p.planet}
            x={cx}
            y={startY + i * lineH}
            textAnchor="middle"
            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fill: color }}
          >
            {p.glyph}
            {p.planet !== 'Lagna' && ` ${p.degree}°`}
            {p.isRetrograde && (
              <tspan style={{ fill: 'rgba(239,68,68,0.75)', fontSize: '9px' }}> ℞</tspan>
            )}
          </text>
        );
      })}
    </g>
  );
}

export default function NorthIndianChart({ planets }: Props) {
  const lagnaHouse = 1; // by definition in whole-sign system

  // Find lagna rasi to show its name in H1
  const lagnaPos = planets.find(p => p.planet === 'Lagna');
  const lagnaRasiName = lagnaPos ? RASI_NAMES_LIST[lagnaPos.rasi] : '';

  // Group planets by house
  const byHouse: Record<number, PlanetPosition[]> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  for (const p of planets) {
    if (byHouse[p.house]) byHouse[p.house].push(p);
  }

  return (
    <svg
      viewBox="0 0 480 480"
      style={{ width: '100%', maxWidth: '480px', display: 'block' }}
      role="img"
      aria-label="North Indian birth chart"
    >
      <rect width="480" height="480" fill="#080812" />

      {/* House polygons */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
        <HousePolygon
          key={h}
          house={h}
          planetsInHouse={byHouse[h] ?? []}
          lagnaHouse={lagnaHouse}
        />
      ))}

      {/* Lagna rasi name in H1 */}
      {lagnaRasiName && (
        <text
          x={centroid(HOUSES[1])[0]}
          y={centroid(HOUSES[1])[1] + 30}
          textAnchor="middle"
          style={{
            fontSize: '8px',
            fill: 'rgba(212,160,23,0.45)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
          }}
        >{lagnaRasiName}</text>
      )}

      {/* Outer border */}
      <rect x="0" y="0" width="480" height="480"
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Inner diamond outline */}
      <polygon
        points={ptsToStr([V.ITL, V.ITR, V.IBR, V.IBL])}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.8"
      />
    </svg>
  );
}
