'use client';

import { useState, useEffect } from 'react';

type LagnaData = {
  rasi: string;
  degree: number;
  minute: number;
  totalDeg: number;
};

type LagnaResult = {
  udaya: LagnaData;
  hora: LagnaData;
  ghati: LagnaData;
  lat: number;
  lon: number;
  sunriseLocal: string | null;
  elapsedHours: number;
  note?: string;
};

const RASI_SYMBOLS: Record<string, string> = {
  Mesha: '♈', Vrishabha: '♉', Mithuna: '♊', Karka: '♋',
  Simha: '♌', Kanya: '♍', Tula: '♎', Vrishchika: '♏',
  Dhanus: '♐', Makara: '♑', Kumbha: '♒', Meena: '♓',
};

const RASI_LORDS: Record<string, string> = {
  Mesha: 'Kuja', Vrishabha: 'Shukra', Mithuna: 'Budha', Karka: 'Chandra',
  Simha: 'Surya', Kanya: 'Budha', Tula: 'Shukra', Vrishchika: 'Kuja',
  Dhanus: 'Guru', Makara: 'Shani', Kumbha: 'Shani', Meena: 'Guru',
};

const LAGNA_DESC: Record<string, { color: string; label: string; desc: string }> = {
  udaya: {
    color: '#F59E0B',
    label: 'UDAYA LAGNA',
    desc: 'Rising sign at birth — the body, temperament & life path',
  },
  hora: {
    color: '#6366F1',
    label: 'HORA LAGNA',
    desc: 'Wealth & resources — advances 1 rasi per hora (hour)',
  },
  ghati: {
    color: '#10B981',
    label: 'GHATI LAGNA',
    desc: 'Power & authority — advances 1 rasi per ghati (24 min)',
  },
};

function LagnaCard({
  type,
  data,
}: {
  type: 'udaya' | 'hora' | 'ghati';
  data: LagnaData;
}) {
  const meta = LAGNA_DESC[type];
  const symbol = RASI_SYMBOLS[data.rasi] || '◈';
  const lord = RASI_LORDS[data.rasi] || '—';
  const isUdaya = type === 'udaya';

  return (
    <div
      style={{
        background: isUdaya
          ? `linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isUdaya ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '24px',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px rgba(0,0,0,0.4)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Label */}
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        color: meta.color,
        fontFamily: 'var(--font-label)',
      }}>
        {meta.label}
      </div>

      {/* Symbol + Rasi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          fontSize: '52px',
          lineHeight: 1,
          filter: `drop-shadow(0 0 12px ${meta.color}60)`,
        }}>
          {symbol}
        </span>
        <div>
          <div style={{
            fontSize: '28px',
            fontWeight: 300,
            color: '#F4F0E8',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}>
            {data.rasi}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '2px',
            fontFamily: 'var(--font-label)',
            letterSpacing: '0.08em',
          }}>
            Lord: {lord}
          </div>
        </div>
      </div>

      {/* Degree */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '36px',
        fontWeight: 200,
        color: meta.color,
        letterSpacing: '-0.02em',
      }}>
        {data.degree}<span style={{ fontSize: '20px', opacity: 0.7 }}>°</span>
        {String(data.minute).padStart(2, '0')}<span style={{ fontSize: '20px', opacity: 0.7 }}>'</span>
      </div>

      {/* Description */}
      <div style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.35)',
        lineHeight: 1.5,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '14px',
      }}>
        {meta.desc}
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({ date: '', time: '', place: '' });
  const [tzOffset, setTzOffset] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LagnaResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Detect browser timezone offset in minutes (positive = ahead of UTC)
    setTzOffset(-new Date().getTimezoneOffset());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tzOffset }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Calculation failed');
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600&family=JetBrains+Mono:wght@200;300;400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --font-display: 'Cinzel', serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --font-label: 'DM Sans', sans-serif;
          --bg: #0C0B10;
          --surface: #141219;
          --surface2: #1C1A24;
          --gold: #F59E0B;
          --gold-dim: rgba(245,158,11,0.15);
          --text: #F4F0E8;
          --text-muted: rgba(244,240,232,0.45);
          --border: rgba(255,255,255,0.07);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Nebula background */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 10%, rgba(99,102,241,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(245,158,11,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 50% 50%, rgba(16,185,129,0.02) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .page {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 64px 24px 96px;
        }

        /* Divider */
        .divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 0 auto;
        }

        /* Form inputs — MD3 filled style */
        .field {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
          font-family: var(--font-label);
        }
        .field input {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 20px;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          -webkit-appearance: none;
          color-scheme: dark;
        }
        .field input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
        }
        .field input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        /* Submit button — MD3 filled tonal */
        .btn-submit {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: #1A1200;
          border: none;
          border-radius: 16px;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-submit:disabled {
          background: var(--surface2);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* Fade-in for results */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .result-grid {
          animation: fadeUp 0.5s ease forwards;
        }

        /* Responsive grid */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 720px) {
          .grid-3 { grid-template-columns: 1fr; }
          .grid-inputs { grid-template-columns: 1fr !important; }
        }

        /* Metadata pills */
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.7;
        }

        /* Stars decoration */
        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
      `}</style>

      {/* Static star field */}
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              background: 'white',
              borderRadius: '50%',
              opacity: Math.random() * 0.4 + 0.05,
            }}
          />
        ))}
      </div>

      <main className="page">
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(245,158,11,0.6)',
            fontFamily: 'var(--font-label)',
            fontWeight: 500,
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}>
            ॐ · Vedic Ephemeris
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 300,
            color: '#F4F0E8',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            Jyotish Lagna
            <span style={{ color: 'var(--gold)' }}> ·</span>
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            letterSpacing: '0.06em',
            fontFamily: 'var(--font-label)',
          }}>
            Udaya &nbsp;·&nbsp; Hora &nbsp;·&nbsp; Ghati &nbsp;Lagna Calculator
          </p>
          <div className="divider" style={{ marginTop: '28px' }} />
        </header>

        {/* Form */}
        <section style={{
          background: 'rgba(20,18,25,0.8)',
          border: '1px solid var(--border)',
          borderRadius: '28px',
          padding: 'clamp(24px, 4vw, 48px)',
          backdropFilter: 'blur(20px)',
          marginBottom: '40px',
        }}>
          <form onSubmit={handleSubmit}>
            <div
              className="grid-inputs"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              <div className="field">
                <label>Birth Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Birth Time (local)</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Birth Place</label>
                <input
                  type="text"
                  value={form.place}
                  onChange={e => setForm({ ...form, place: e.target.value })}
                  placeholder="Kuala Lumpur, Malaysia"
                  required
                />
              </div>
            </div>

            {/* Timezone row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-label)', letterSpacing: '0.1em' }}>
                TIMEZONE OFFSET
              </span>
              <input
                type="number"
                value={tzOffset}
                onChange={e => setTzOffset(Number(e.target.value))}
                min={-840}
                max={840}
                step={15}
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  width: '90px',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                minutes from UTC &nbsp;(e.g. IST = +330, MYT = +480, EST = −300)
              </span>
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <><span className="spinner" />Computing Lagnas…</>
              ) : (
                '⟡ Calculate Three Lagnas'
              )}
            </button>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#FCA5A5',
            fontSize: '14px',
            marginBottom: '32px',
            textAlign: 'center',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="result-grid">
            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 300,
                color: 'var(--text)',
                letterSpacing: '0.04em',
                marginBottom: '16px',
              }}>
                Lagna Phala
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                <span className="pill">
                  <span className="pill-dot" />
                  {result.lat.toFixed(4)}°N
                </span>
                <span className="pill">
                  <span className="pill-dot" />
                  {result.lon.toFixed(4)}°E
                </span>
                {result.sunriseLocal && (
                  <span className="pill">
                    <span className="pill-dot" style={{ background: '#F59E0B' }} />
                    Sunrise {result.sunriseLocal}
                  </span>
                )}
                {result.elapsedHours !== undefined && (
                  <span className="pill">
                    <span className="pill-dot" style={{ background: '#6366F1' }} />
                    {result.elapsedHours.toFixed(2)}h from sunrise
                  </span>
                )}
              </div>
              {result.note && (
                <p style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(245,158,11,0.6)' }}>
                  ⚠ {result.note}
                </p>
              )}
            </div>

            <div className="grid-3">
              <LagnaCard type="udaya" data={result.udaya} />
              <LagnaCard type="hora" data={result.hora} />
              <LagnaCard type="ghati" data={result.ghati} />
            </div>

            {/* Footer note */}
            <div style={{
              marginTop: '36px',
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              textAlign: 'center',
            }}>
              Lahiri (Chitrapaksha) Ayanamsa · Ascendant computed via IAU 1982 GMST ·
              Hora & Ghati Lagna calculated from sunrise using solar altitude model ·
              Pre-sunrise births use the previous day&apos;s sunrise
            </div>
          </div>
        )}
      </main>
    </>
  );
}
