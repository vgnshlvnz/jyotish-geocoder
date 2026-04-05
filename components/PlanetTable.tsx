'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFB300', Moon: '#90CAF9', Mars: '#EF5350',
  Mercury: '#66BB6A', Jupiter: '#FFA726', Venus: '#EC407A',
  Saturn: '#78909C', Rahu: '#B0BEC5', Ketu: '#B0BEC5', Lagna: '#D4A017',
};

export default function PlanetTable({ planets }: Props) {
  const rows = planets.filter((planet) => planet.planet !== 'Lagna');

  return (
    <div className="astro-shell astro-shell--table">
      <div className="astro-table-shell">
        <table>
          <thead>
            <tr>
              {['', 'Planet', 'Rasi', 'Degree', 'House', 'Status'].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: '11px 14px',
                    textAlign: 'left',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(244,240,232,0.46)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((planet, index) => (
              <tr key={planet.planet} style={{ background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <span style={{
                    fontSize: 16,
                    color: PLANET_COLORS[planet.planet] ?? '#D4A017',
                    filter: `drop-shadow(0 0 4px ${PLANET_COLORS[planet.planet] ?? '#D4A017'}66)`,
                  }}>{planet.glyph}</span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: PLANET_COLORS[planet.planet] ?? '#f4f0e8' }}>
                  {planet.planet}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: 'rgba(244,240,232,0.78)', fontFamily: 'var(--font-display)' }}>
                  {RASI_NAMES_LIST[planet.rasi]}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: 'rgba(244,240,232,0.68)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {planet.degree}°{String(planet.minute).padStart(2, '0')}′
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: 'rgba(212,160,23,0.9)', fontFamily: 'var(--font-mono)' }}>
                  {planet.house}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12 }}>
                  {planet.isRetrograde ? (
                    <span style={{ color: 'rgba(239,68,68,0.85)', fontFamily: 'var(--font-mono)' }}>℞</span>
                  ) : (
                    <span style={{ color: 'rgba(244,240,232,0.25)' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
