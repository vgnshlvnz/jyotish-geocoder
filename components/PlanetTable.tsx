'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFB300', Moon: '#90CAF9', Mars: '#EF5350',
  Mercury: '#66BB6A', Jupiter: '#FFA726', Venus: '#EC407A',
  Saturn: '#78909C', Rahu: '#B0BEC5', Ketu: '#B0BEC5', Lagna: '#D4A017',
};

export default function PlanetTable({ planets }: Props) {
  const rows = planets.filter(p => p.planet !== 'Lagna');

  return (
    <div style={{
      marginTop: '16px',
      background: 'rgba(14,14,28,0.85)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['', 'Planet', 'Rasi', 'Degree', 'House', 'Status'].map(h => (
              <th key={h} style={{
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: '9px',
                letterSpacing: '0.16em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr
              key={p.planet}
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
            >
              {/* Glyph */}
              <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                <span style={{
                  fontSize: '16px',
                  color: PLANET_COLORS[p.planet] ?? '#D4A017',
                  filter: `drop-shadow(0 0 4px ${PLANET_COLORS[p.planet] ?? '#D4A017'}66)`,
                }}>{p.glyph}</span>
              </td>
              {/* Planet name */}
              <td style={{
                padding: '9px 14px',
                fontSize: '12px',
                color: PLANET_COLORS[p.planet] ?? '#F4F0E8',
                fontFamily: 'var(--font-body)',
              }}>{p.planet}</td>
              {/* Rasi */}
              <td style={{
                padding: '9px 14px',
                fontSize: '12px',
                color: 'rgba(244,240,232,0.75)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.03em',
              }}>{RASI_NAMES_LIST[p.rasi]}</td>
              {/* Degree */}
              <td style={{
                padding: '9px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'rgba(244,240,232,0.65)',
              }}>
                {p.degree}°{String(p.minute).padStart(2, '0')}′
              </td>
              {/* House */}
              <td style={{
                padding: '9px 14px',
                fontSize: '12px',
                color: 'rgba(212,160,23,0.8)',
                fontFamily: 'var(--font-mono)',
              }}>{p.house}</td>
              {/* Status */}
              <td style={{ padding: '9px 14px' }}>
                {p.isRetrograde ? (
                  <span style={{
                    fontSize: '11px',
                    color: 'rgba(239,68,68,0.75)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.06em',
                  }}>℞</span>
                ) : (
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
