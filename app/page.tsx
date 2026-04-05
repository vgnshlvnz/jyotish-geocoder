'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PlanetPosition } from '../lib/chartEngine';
import SouthIndianChart from '../components/SouthIndianChart';
import NorthIndianChart from '../components/NorthIndianChart';
import PlanetTable from '../components/PlanetTable';
import LocationInput from '../components/LocationInput';

type ChartStyle = 'south' | 'north';

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

function fmtLagna(v: LagnaData): string {
  return `${v.rasi}`;
}

function fmtDegree(v: LagnaData): string {
  return `${v.degree}°${String(v.minute).padStart(2, '0')}′`;
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      minHeight: 32,
      borderRadius: 999,
      border: '1px solid #354576',
      padding: '0 10px',
      fontSize: 12,
      color: '#c7c0ac',
      background: '#0e1734',
    }}>
      <strong style={{ color: '#f6f0de', fontWeight: 600 }}>{label}</strong>
      {value}
    </span>
  );
}

export default function HomePage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loc, setLoc] = useState<LocState>({ lat: 0, lon: 0, label: '' });
  const [tzOffset, setTzOffset] = useState<number>(-new Date().getTimezoneOffset());
  const [style, setStyle] = useState<ChartStyle>('south');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<UnifiedResult | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);

  async function handleLocSelect(lat: number, lon: number, label: string) {
    setLoc({ lat, lon, label });
    try {
      const r = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`);
      if (r.ok) {
        const d = await r.json();
        const secs = (d as { currentUtcOffset?: { seconds?: number } }).currentUtcOffset?.seconds;
        if (typeof secs === 'number') setTzOffset(Math.round(secs / 60));
      }
    } catch {
      // keep existing tz
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Please enter date and time of birth.');
      return;
    }
    if (!loc.lat && !loc.lon) {
      setError('Please choose a location from suggestions.');
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

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const lagnaPlanet = useMemo(() => result?.planets.find((p) => p.planet === 'Lagna') ?? null, [result]);

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '14px 12px 30px' }}>
      <header style={{ textAlign: 'center', marginBottom: 14 }}>
        <h1 className="vedic-title" style={{ margin: 0, fontSize: 30, fontWeight: 600 }}>Jyotish Lagna Calculator</h1>
        <p style={{ margin: '4px 0 0', color: '#d4af47', fontSize: 13 }}>ज्योतिषीय लग्न गणना</p>
        <p style={{ margin: '6px 0 0', color: '#c7c0ac', fontSize: 13 }}>Enter birth details once, see Lagna and chart instantly.</p>
      </header>

      <section className="vedic-card vedic-card--gold" style={{ padding: 12 }}>
        <h2 className="vedic-title" style={{ margin: '0 0 10px', fontSize: 18 }}>Birth Details</h2>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span className="vedic-label">Date Of Birth</span>
              <input className="vedic-input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span className="vedic-label">Time Of Birth (Local)</span>
              <input className="vedic-input" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span className="vedic-label">Birth Location</span>
              <LocationInput onSelect={handleLocSelect} />
              <span style={{ fontSize: 12, color: '#c7c0ac' }}>Select from suggestions for accurate latitude/longitude.</span>
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span className="vedic-label">Timezone Offset (minutes)</span>
              <input className="vedic-input" type="number" min={-840} max={840} step={15} value={tzOffset} onChange={(e) => setTzOffset(Number(e.target.value))} />
            </label>
          </div>

          <button
            type="submit"
            className="vedic-btn"
            disabled={loading}
            style={{ width: '100%', marginTop: 12, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            {loading && <span className="loader-ring" />}
            {loading ? 'Calculating...' : 'Calculate Lagna'}
          </button>
        </form>
      </section>

      {error && (
        <div style={{ marginTop: 10, border: '1px solid #7c2d2d', background: '#381919', color: '#fca5a5', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>
          {error}
        </div>
      )}

      {result && (
        <section ref={resultRef} style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          <section className="vedic-card vedic-card--gold" style={{ padding: 12 }}>
            <h2 className="vedic-title" style={{ margin: 0, fontSize: 17 }}>Result</h2>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: '#f0cd72' }}>{fmtLagna(result.udaya)}</div>
            <div style={{ marginTop: 4, fontSize: 14, color: '#f6f0de' }}>{fmtDegree(result.udaya)}</div>
            {lagnaPlanet && (
              <div style={{ marginTop: 6, fontSize: 12, color: '#c7c0ac' }}>
                Chart Lagna: House {lagnaPlanet.house}
              </div>
            )}

            <div style={{ marginTop: 10, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <InfoPill label="Place" value={result.place} />
              <InfoPill label="Lat" value={`${result.lat.toFixed(3)}°`} />
              <InfoPill label="Lon" value={`${result.lon.toFixed(3)}°`} />
              <InfoPill label="Sunrise" value={result.sunriseLocal || 'N/A'} />
            </div>
          </section>

          <section className="vedic-card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <h3 className="vedic-title" style={{ margin: 0, fontSize: 16 }}>Rasi Chart</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className={`pill-toggle ${style === 'south' ? 'active' : ''}`} onClick={() => setStyle('south')}>South</button>
                <button type="button" className={`pill-toggle ${style === 'north' ? 'active' : ''}`} onClick={() => setStyle('north')}>North</button>
              </div>
            </div>

            <div className="chart-wrap">
              {style === 'south' ? <SouthIndianChart planets={result.planets} /> : <NorthIndianChart planets={result.planets} />}
            </div>
          </section>

          <details className="vedic-disclosure">
            <summary>Optional Details</summary>
            <div style={{ marginTop: 10, display: 'grid', gap: 12 }}>
              <div style={{ fontSize: 13, color: '#c7c0ac' }}>
                Hora Lagna: <strong style={{ color: '#f6f0de' }}>{fmtLagna(result.hora)} {fmtDegree(result.hora)}</strong>
                <br />
                Ghati Lagna: <strong style={{ color: '#f6f0de' }}>{fmtLagna(result.ghati)} {fmtDegree(result.ghati)}</strong>
                <br />
                Elapsed from sunrise: <strong style={{ color: '#f6f0de' }}>{result.elapsedHours.toFixed(2)} h</strong>
              </div>
              <PlanetTable planets={result.planets} />
            </div>
          </details>
        </section>
      )}
    </main>
  );
}
