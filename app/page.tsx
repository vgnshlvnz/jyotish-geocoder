'use client';

import { useMemo, useState } from 'react';
import type { PlanetPosition } from '../lib/chartEngine';
import SouthIndianChart from '../components/SouthIndianChart';
import NorthIndianChart from '../components/NorthIndianChart';
import PlanetTable from '../components/PlanetTable';
import LocationInput from '../components/LocationInput';

type ChartStyle = 'south' | 'north' | 'both';

type LagnaData = {
  rasi: string;
  degree: number;
  minute: number;
  totalDeg: number;
};

type UnifiedResult = {
  planets: PlanetPosition[];
  udaya: LagnaData;
  hora: LagnaData;
  ghati: LagnaData;
  lat: number;
  lon: number;
  place: string;
  elapsedHours: number;
  sunriseLocal: string | null;
  note?: string;
};

type LocState = { lat: number; lon: number; label: string };

const LAGNA_META = {
  udaya: { label: 'Udaya Lagna', color: '#1476d1' },
  hora: { label: 'Hora Lagna', color: '#7a5af8' },
  ghati: { label: 'Ghati Lagna', color: '#10b981' },
} as const;

function fmt(data: LagnaData): string {
  return `${data.rasi} ${data.degree}°${String(data.minute).padStart(2, '0')}′`;
}

function LagnaCard({ label, color, value }: { label: string; color: string; value: string }) {
  return (
    <div className="astro-shell" style={{ padding: 14 }}>
      <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: '#1d2733' }}>{value}</div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center',
      padding: '6px 10px',
      borderRadius: 999,
      border: '1px solid #d7e2ee',
      background: '#fff',
      fontSize: 12,
      color: '#344a5f',
    }}>
      <strong style={{ color: '#60758a' }}>{label}</strong>{value}
    </span>
  );
}

export default function HomePage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loc, setLoc] = useState<LocState>({ lat: 0, lon: 0, label: '' });
  const [tzOffset, setTzOffset] = useState<number>(-new Date().getTimezoneOffset());
  const [style, setStyle] = useState<ChartStyle>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<UnifiedResult | null>(null);

  async function handleLocSelect(lat: number, lon: number, label: string) {
    setLoc({ lat, lon, label });
    try {
      const res = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`);
      if (res.ok) {
        const data = await res.json();
        const sec = (data as { currentUtcOffset?: { seconds?: number } }).currentUtcOffset?.seconds;
        if (typeof sec === 'number') setTzOffset(Math.round(sec / 60));
      }
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Please enter birth date and birth time.');
      return;
    }
    if (!loc.lat && !loc.lon) {
      setError('Please select a birth place from suggestions.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, tzOffset, lat: loc.lat, lon: loc.lon, label: loc.label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Calculation failed');
      setResult(data as UnifiedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  }

  const lagnaFromChart = useMemo(() => result?.planets.find((p) => p.planet === 'Lagna') ?? null, [result]);

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 48px' }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 32, color: '#1d2733' }}>Kundli Calculator</h1>
        <p style={{ margin: '6px 0 0', color: '#60758a', fontSize: 14 }}>
          Flat bright view with unified Lagna + chart output.
        </p>
      </header>

      <section className="astro-shell" style={{ padding: 16, marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginBottom: 10 }}>
            <label style={{ display: 'grid', gap: 5 }}>
              <span style={{ fontSize: 12, color: '#5d7388' }}>Birth Date</span>
              <input className="astro-input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '10px 12px' }} />
            </label>
            <label style={{ display: 'grid', gap: 5 }}>
              <span style={{ fontSize: 12, color: '#5d7388' }}>Birth Time (Local)</span>
              <input className="astro-input" type="time" required value={time} onChange={(e) => setTime(e.target.value)} style={{ padding: '10px 12px' }} />
            </label>
            <label style={{ display: 'grid', gap: 5 }}>
              <span style={{ fontSize: 12, color: '#5d7388' }}>Birth Place</span>
              <LocationInput onSelect={handleLocSelect} />
            </label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#5d7388' }}>Timezone Offset (minutes)</span>
            <input className="astro-input" type="number" value={tzOffset} onChange={(e) => setTzOffset(Number(e.target.value))} min={-840} max={840} step={15} style={{ width: 90, padding: '8px 10px' }} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              border: '1px solid #1476d1',
              borderRadius: 8,
              background: loading ? '#eaf1f8' : '#1476d1',
              color: loading ? '#54708a' : '#fff',
              padding: '11px 14px',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              justifyContent: 'center',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {loading && <span className="astro-input-spinner" />}
            {loading ? 'Calculating…' : 'Calculate Kundli'}
          </button>
        </form>
      </section>

      {error && (
        <div style={{ border: '1px solid #f2c4c4', background: '#fff1f1', color: '#9a2b2b', padding: '10px 12px', borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {result && (
        <section style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
            <LagnaCard label={LAGNA_META.udaya.label} color={LAGNA_META.udaya.color} value={fmt(result.udaya)} />
            <LagnaCard label={LAGNA_META.hora.label} color={LAGNA_META.hora.color} value={fmt(result.hora)} />
            <LagnaCard label={LAGNA_META.ghati.label} color={LAGNA_META.ghati.color} value={fmt(result.ghati)} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill label="Place" value={result.place} />
            <Pill label="Latitude" value={`${result.lat.toFixed(4)}°`} />
            <Pill label="Longitude" value={`${result.lon.toFixed(4)}°`} />
            <Pill label="Sunrise" value={result.sunriseLocal || 'N/A'} />
            <Pill label="Elapsed" value={`${result.elapsedHours.toFixed(2)} h`} />
            {lagnaFromChart && <Pill label="Lagna From Chart" value={`${lagnaFromChart.degree}°${String(lagnaFromChart.minute).padStart(2, '0')}′`} />}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([
              ['south', 'South Indian'],
              ['north', 'North Indian'],
              ['both', 'Both'],
            ] as const).map(([val, label]) => {
              const active = style === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStyle(val)}
                  style={{
                    border: `1px solid ${active ? '#1476d1' : '#c4d3e2'}`,
                    background: active ? '#e8f2fc' : '#fff',
                    color: active ? '#0d5fa9' : '#466179',
                    borderRadius: 999,
                    padding: '6px 11px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ display: style === 'both' ? 'grid' : 'block', gridTemplateColumns: style === 'both' ? 'repeat(auto-fit,minmax(340px,1fr))' : undefined, gap: 12 }}>
            {(style === 'south' || style === 'both') && (
              <div style={{ display: 'grid', gap: 6 }}>
                <div className="astro-shell__title">South Indian Rasi</div>
                <SouthIndianChart planets={result.planets} />
              </div>
            )}
            {(style === 'north' || style === 'both') && (
              <div style={{ display: 'grid', gap: 6 }}>
                <div className="astro-shell__title">North Indian Rasi</div>
                <NorthIndianChart planets={result.planets} />
              </div>
            )}
          </div>

          <div>
            <div className="astro-shell__title" style={{ marginBottom: 6 }}>Planetary Placement Summary</div>
            <PlanetTable planets={result.planets} />
          </div>
        </section>
      )}
    </main>
  );
}
