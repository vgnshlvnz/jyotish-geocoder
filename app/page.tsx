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
  trace?: {
    tzOffsetMinutes: number;
    utcHour: number;
    birthJulianDay: number;
    sunriseJulianDay: number | null;
  };
};

type LocState = { lat: number; lon: number; label: string };

const LAGNA_META = {
  udaya: { label: 'Udaya Lagna', tone: '#d4a017', desc: 'Ascendant at birth' },
  hora: { label: 'Hora Lagna', tone: '#8b5cf6', desc: 'Wealth and resources' },
  ghati: { label: 'Ghati Lagna', tone: '#10b981', desc: 'Power and authority' },
} as const;

function formatLagna(data: LagnaData): string {
  return `${data.rasi} ${data.degree}°${String(data.minute).padStart(2, '0')}′`;
}

function ResultPill({ label, value }: { label: string; value: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center',
      padding: '7px 12px',
      borderRadius: 16,
      fontSize: 12,
      color: 'rgba(244,240,232,0.72)',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.03)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.02em',
    }}>
      <strong style={{ color: 'rgba(244,240,232,0.5)', fontWeight: 500 }}>{label}</strong>
      {value}
    </span>
  );
}

function LagnaCard({ title, tone, desc, data }: { title: string; tone: string; desc: string; data: LagnaData }) {
  return (
    <div className="astro-shell astro-shell--compact" style={{ padding: 18 }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: tone,
          marginBottom: 10,
          fontWeight: 600,
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          lineHeight: 1.2,
          marginBottom: 6,
        }}>{formatLagna(data)}</div>
        <div style={{ fontSize: 12, color: 'rgba(244,240,232,0.56)' }}>{desc}</div>
      </div>
    </div>
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
    } catch {
      // keep manual timezone value
    }
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
        body: JSON.stringify({
          date,
          time,
          tzOffset,
          lat: loc.lat,
          lon: loc.lon,
          label: loc.label,
        }),
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
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 16px 64px' }}>
      <header style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex',
          gap: 8,
          alignItems: 'center',
          borderRadius: 999,
          border: '1px solid rgba(212,160,23,0.28)',
          background: 'rgba(212,160,23,0.08)',
          color: 'rgba(212,160,23,0.84)',
          padding: '6px 12px',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Jyotish Engine
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 5vw, 48px)',
          fontWeight: 400,
          lineHeight: 1.15,
          margin: 0,
        }}>
          Unified Kundli Workspace
        </h1>
        <p style={{ marginTop: 10, color: 'rgba(244,240,232,0.58)', fontSize: 14 }}>
          One input flow, one calculation flow, one result view for Lagna and Rasi charts.
        </p>
      </header>

      <section className="astro-shell" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            marginBottom: 12,
          }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(244,240,232,0.58)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Birth Date
              </span>
              <input className="astro-input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '12px 14px' }} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(244,240,232,0.58)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Birth Time (Local)
              </span>
              <input className="astro-input" type="time" required value={time} onChange={(e) => setTime(e.target.value)} style={{ padding: '12px 14px' }} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(244,240,232,0.58)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Birth Place
              </span>
              <LocationInput onSelect={handleLocSelect} />
            </label>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 11, color: 'rgba(244,240,232,0.56)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Timezone Offset (minutes)
            </span>
            <input
              className="astro-input"
              type="number"
              value={tzOffset}
              onChange={(e) => setTzOffset(Number(e.target.value))}
              min={-840}
              max={840}
              step={15}
              style={{ width: 92, padding: '8px 10px', fontFamily: 'var(--font-mono)' }}
            />
            <span style={{ fontSize: 12, color: 'rgba(244,240,232,0.5)' }}>
              Auto-detected on place selection. You can override manually.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 14,
              padding: '14px 16px',
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              letterSpacing: '0.05em',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #f0c65d 0%, #d4a017 55%, #a7760b 100%)',
              color: loading ? 'rgba(244,240,232,0.5)' : '#1c1300',
              display: 'inline-flex',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loading && <span className="astro-input-spinner" />}
            {loading ? 'Calculating Unified Kundli…' : 'Calculate Kundli'}
          </button>
        </form>
      </section>

      {error && (
        <div style={{
          marginBottom: 14,
          borderRadius: 12,
          border: '1px solid rgba(239,68,68,0.34)',
          background: 'rgba(239,68,68,0.12)',
          color: '#fda4af',
          padding: '10px 12px',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {result && (
        <section style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <LagnaCard title={LAGNA_META.udaya.label} tone={LAGNA_META.udaya.tone} desc={LAGNA_META.udaya.desc} data={result.udaya} />
            <LagnaCard title={LAGNA_META.hora.label} tone={LAGNA_META.hora.tone} desc={LAGNA_META.hora.desc} data={result.hora} />
            <LagnaCard title={LAGNA_META.ghati.label} tone={LAGNA_META.ghati.tone} desc={LAGNA_META.ghati.desc} data={result.ghati} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <ResultPill label="Place" value={result.place} />
            <ResultPill label="Latitude" value={`${result.lat.toFixed(4)}°`} />
            <ResultPill label="Longitude" value={`${result.lon.toFixed(4)}°`} />
            <ResultPill label="Sunrise" value={result.sunriseLocal || 'N/A'} />
            <ResultPill label="Elapsed" value={`${result.elapsedHours.toFixed(2)} h`} />
            {lagnaFromChart && <ResultPill label="Lagna from Chart" value={`${lagnaFromChart.degree}°${String(lagnaFromChart.minute).padStart(2, '0')}′ ${lagnaFromChart.planet === 'Lagna' ? '' : ''}`} />}
          </div>

          {result.note && (
            <div style={{
              borderRadius: 12,
              border: '1px solid rgba(245,158,11,0.35)',
              background: 'rgba(245,158,11,0.12)',
              color: '#fcd34d',
              padding: '10px 12px',
              fontSize: 13,
            }}>
              {result.note}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([
              ['south', 'South Indian'],
              ['north', 'North Indian'],
              ['both', 'Both'],
            ] as const).map(([value, label]) => {
              const active = style === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStyle(value)}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${active ? 'rgba(212,160,23,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    background: active ? 'rgba(212,160,23,0.16)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#f6d37d' : 'rgba(244,240,232,0.66)',
                    padding: '8px 13px',
                    cursor: 'pointer',
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{
            display: style === 'both' ? 'grid' : 'block',
            gridTemplateColumns: style === 'both' ? 'repeat(auto-fit, minmax(340px, 1fr))' : undefined,
            gap: 16,
          }}>
            {(style === 'south' || style === 'both') && (
              <div style={{ display: 'grid', gap: 8 }}>
                <div className="astro-shell__title">South Indian Rasi</div>
                <SouthIndianChart planets={result.planets} />
              </div>
            )}

            {(style === 'north' || style === 'both') && (
              <div style={{ display: 'grid', gap: 8 }}>
                <div className="astro-shell__title">North Indian Rasi</div>
                <NorthIndianChart planets={result.planets} />
              </div>
            )}
          </div>

          <div>
            <div className="astro-shell__title" style={{ marginBottom: 8 }}>Planetary Placement Summary</div>
            <PlanetTable planets={result.planets} />
          </div>

          <div style={{
            fontSize: 12,
            color: 'rgba(244,240,232,0.48)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 12,
            lineHeight: 1.7,
          }}>
            Lahiri (Chitrapaksha) Ayanamsa · Whole-sign houses · Unified source object powers Lagna cards and chart rendering.
          </div>
        </section>
      )}
    </main>
  );
}
