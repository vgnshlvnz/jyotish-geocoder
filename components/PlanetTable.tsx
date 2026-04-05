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

export default function PlanetTable({ planets }: Props) {
  const rows = planets.filter((planet) => planet.planet !== 'Lagna');

  return (
    <div className="table-list">
      {rows.map((planet) => (
        <div key={planet.planet} className="table-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ color: PLANET_COLORS[planet.planet] ?? '#f6f0de', fontWeight: 700, fontSize: 15 }}>
              {planet.planet}
            </div>
            <div style={{ color: '#f0cd72', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              House {planet.house}
            </div>
          </div>

          <div className="table-item-grid">
            <div>
              <div style={{ color: '#9ea7bf', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rasi</div>
              <div style={{ color: '#f6f0de' }}>{RASI_NAMES_LIST[planet.rasi]}</div>
            </div>
            <div>
              <div style={{ color: '#9ea7bf', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Degree</div>
              <div style={{ color: '#f6f0de', fontFamily: 'var(--font-mono)' }}>
                {planet.degree}°{String(planet.minute).padStart(2, '0')}′
              </div>
            </div>
            <div>
              <div style={{ color: '#9ea7bf', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
              <div style={{ color: planet.isRetrograde ? '#fca5a5' : '#c7c0ac', fontFamily: 'var(--font-mono)' }}>
                {planet.isRetrograde ? 'Retrograde ℞' : 'Direct'}
              </div>
            </div>
            <div>
              <div style={{ color: '#9ea7bf', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Longitude</div>
              <div style={{ color: '#f6f0de', fontFamily: 'var(--font-mono)' }}>
                {planet.longitude.toFixed(2)}°
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
