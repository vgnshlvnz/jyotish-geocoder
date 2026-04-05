'use client';

import { PlanetPosition, RASI_NAMES_LIST } from '../lib/chartEngine';

interface Props { planets: PlanetPosition[]; }

const PLANET_COLORS: Record<string, string> = {
  Sun: '#c27c00', Moon: '#2f6fb6', Mars: '#c53030',
  Mercury: '#18794e', Jupiter: '#b36b00', Venus: '#ad3f84',
  Saturn: '#4b6073', Rahu: '#556987', Ketu: '#556987', Lagna: '#1476d1',
};

export default function PlanetTable({ planets }: Props) {
  const rows = planets.filter((planet) => planet.planet !== 'Lagna');

  return (
    <div className="astro-shell astro-shell--table">
      <div className="astro-table-shell">
        <table>
          <thead>
            <tr>
              {['Name', 'Planet', 'Rasi', 'Degree', 'House', 'Status'].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: '11px 14px',
                    textAlign: 'left',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#5f7183',
                    borderBottom: '1px solid #dbe5ef',
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
              <tr key={planet.planet} style={{ background: index % 2 === 0 ? 'transparent' : '#f8fbff' }}>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <span style={{
                    fontSize: 12,
                    color: PLANET_COLORS[planet.planet] ?? '#D4A017',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}>{planet.planet}</span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: PLANET_COLORS[planet.planet] ?? '#1d2733' }}>
                  {planet.planet}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#2f4356', fontFamily: 'var(--font-body)' }}>
                  {RASI_NAMES_LIST[planet.rasi]}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#41586e', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {planet.degree}°{String(planet.minute).padStart(2, '0')}′
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#1476d1', fontFamily: 'var(--font-mono)' }}>
                  {planet.house}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12 }}>
                  {planet.isRetrograde ? (
                    <span style={{ color: '#be123c', fontFamily: 'var(--font-mono)' }}>℞</span>
                  ) : (
                    <span style={{ color: '#9aabbd' }}>—</span>
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
