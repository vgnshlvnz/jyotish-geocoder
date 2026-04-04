'use client';

import { useState } from 'react';
import { calculateChart, julianDay, PlanetPosition, RASI_NAMES_LIST } from '../../lib/chartEngine';
import SouthIndianChart from '../../components/SouthIndianChart';
import NorthIndianChart from '../../components/NorthIndianChart';
import PlanetTable from '../../components/PlanetTable';
import LocationInput from '../../components/LocationInput';

type ChartStyle = 'south' | 'north' | 'both';

interface LocState { lat: number; lon: number; label: string; }

export default function ChartPage() {
  const [date, setDate]         = useState('');
  const [time, setTime]         = useState('');
  const [loc, setLoc]           = useState<LocState>({ lat: 0, lon: 0, label: '' });
  const [tzOffset, setTzOffset] = useState(0);
  const [style, setStyle]       = useState<ChartStyle>('south');
  const [planets, setPlanets]   = useState<PlanetPosition[] | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLocSelect(lat: number, lon: number, label: string) {
    setLoc({ lat, lon, label });
    // Auto-detect timezone via timeapi.io
    try {
      const r = await fetch(
        `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`
      );
      if (r.ok) {
        const d = await r.json();
        const secs: number = (d as { currentUtcOffset?: { seconds?: number } })
          .currentUtcOffset?.seconds ?? 0;
        setTzOffset(Math.round(secs / 60));
      }
    } catch { /* keep current tzOffset */ }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!date || !time) { setError('Please enter a birth date and time.'); return; }
    if (!loc.lat && !loc.lon) { setError('Please select a birth location.'); return; }
    setLoading(true);
    try {
      const [y, mo, d] = date.split('-').map(Number);
      const [hh, mm]   = time.split(':').map(Number);
      // Convert local time → UTC hours (may be outside 0–24; calculateChart handles rollover)
      const utcHour = hh + mm / 60 - tzOffset / 60;
      const result = calculateChart(y, mo, d, utcHour, loc.lat, loc.lon);
      setPlanets(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  }

  const lagnaPos = planets?.find(p => p.planet === 'Lagna');

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#F4F0E8',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    colorScheme: 'dark' as React.CSSProperties['colorScheme'],
  };

  function ToggleBtn({ val, label }: { val: ChartStyle; label: string }) {
    const active = style === val;
    return (
      <button
        type="button"
        onClick={() => setStyle(val)}
        style={{
          padding: '8px 18px',
          background: active ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? 'rgba(212,160,23,0.45)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '20px',
          color: active ? '#D4A017' : 'rgba(255,255,255,0.45)',
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          transition: 'all 0.2s',
        }}
      >{label}</button>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600&family=JetBrains+Mono:wght@200;300;400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --font-display: 'Cinzel', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --bg: #080812;
          --surface: #0f0f1e;
          --border: rgba(255,255,255,0.07);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: #F4F0E8;
          font-family: var(--font-body);
          min-height: 100vh;
          overflow-x: hidden;
        }
        body::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 100% 60% at 30% -5%, rgba(99,102,241,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 80% 50% at 80% 110%, rgba(212,160,23,0.05) 0%, transparent 55%);
        }
        @keyframes twinkle {
          0%, 100% { opacity: var(--op, 0.3); }
          50% { opacity: calc(var(--op, 0.3) * 0.2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .chart-result { animation: fadeUp 0.55s ease forwards; }
        .field-input:focus {
          border-color: rgba(212,160,23,0.5) !important;
          box-shadow: 0 0 0 3px rgba(212,160,23,0.08) !important;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.18); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 14px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.1em',
            textDecoration: 'none', marginBottom: '20px',
            transition: 'color 0.2s',
          }}>← Lagna Calculator</a>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '5px 18px', borderRadius: '20px',
            background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)',
            marginBottom: '16px', marginLeft: '10px',
          }}>
            <span style={{ color: 'rgba(212,160,23,0.8)', fontSize: '12px' }}>🕉</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(212,160,23,0.7)', fontWeight: 500 }}>
              VEDIC EPHEMERIS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4.5vw, 44px)',
            fontWeight: 300,
            color: '#F4F0E8',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            marginBottom: '10px',
          }}>
            Birth Chart<span style={{ color: '#D4A017' }}> ·</span>
          </h1>
          <p style={{ color: 'rgba(244,240,232,0.35)', fontSize: '13px', letterSpacing: '0.12em' }}>
            Rasi Kundali · South Indian & North Indian formats
          </p>
          <div style={{ width: '48px', height: '1px', background: 'linear-gradient(90deg,transparent,#D4A017,transparent)', margin: '18px auto 0' }} />
        </header>

        {/* Form */}
        <section style={{
          background: 'rgba(14,14,28,0.85)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          padding: 'clamp(20px,4vw,40px)',
          backdropFilter: 'blur(20px)',
          marginBottom: '28px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px',
            }}>
              {/* Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  Birth Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="field-input"
                  style={inputStyle}
                />
              </div>

              {/* Time */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  Birth Time (local)
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  className="field-input"
                  style={inputStyle}
                />
              </div>

              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  Birth Place
                </label>
                <LocationInput onSelect={handleLocSelect} />
              </div>
            </div>

            {/* Timezone */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
              padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Timezone Offset
              </span>
              <input
                type="number"
                value={tzOffset}
                onChange={e => setTzOffset(Number(e.target.value))}
                min={-840} max={840} step={15}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '5px 10px', color: '#D4A017',
                  fontFamily: 'var(--font-mono)', fontSize: '13px', width: '80px', outline: 'none',
                  colorScheme: 'dark' as React.CSSProperties['colorScheme'],
                }}
              />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                minutes from UTC · IST=+330 · MYT=+480 · EST=−300 · auto-set on location select
              </span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '17px',
              background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#D4A017 0%,#B8860B 100%)',
              color: loading ? 'rgba(255,255,255,0.3)' : '#100d00',
              border: 'none', borderRadius: '14px',
              fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 500,
              letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading ? (
                <>
                  <div style={{ width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.15)',borderTopColor:'#D4A017',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
                  Computing Chart…
                </>
              ) : '⟡ Generate Birth Chart'}
            </button>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div style={{
            background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.2)',
            borderRadius:'14px',padding:'14px 18px',color:'#FCA5A5',
            fontSize:'13px',marginBottom:'24px',textAlign:'center',
          }}>⚠ {error}</div>
        )}

        {/* Chart style toggle */}
        {planets && (
          <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
            <ToggleBtn val="south"  label="◈ South Indian" />
            <ToggleBtn val="north"  label="◇ North Indian" />
            <ToggleBtn val="both"   label="✦ Both" />
          </div>
        )}

        {/* Results */}
        {planets && (
          <div className="chart-result">
            {/* Lagna info strip */}
            {lagnaPos && (
              <div style={{
                display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px', marginBottom:'24px',
              }}>
                {[
                  { label:'Lagna', value:`${RASI_NAMES_LIST[lagnaPos.rasi]} (House 1)`, icon:'⟡' },
                  { label:'Lat', value:`${loc.lat.toFixed(4)}°N`, icon:'📍' },
                  { label:'Lon', value:`${loc.lon.toFixed(4)}°E`, icon:'📍' },
                  { label:'UTC offset', value:`${tzOffset >= 0 ? '+' : ''}${tzOffset} min`, icon:'⏱' },
                ].map(item => (
                  <span key={item.label} style={{
                    display:'inline-flex', alignItems:'center', gap:'5px',
                    padding:'5px 12px', borderRadius:'16px',
                    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                    fontSize:'11px', color:'rgba(255,255,255,0.5)',
                    fontFamily:'var(--font-mono)',
                  }}>
                    <span>{item.icon}</span>{item.label}: {item.value}
                  </span>
                ))}
              </div>
            )}

            {/* Charts side-by-side (or single) */}
            <div style={{
              display: style === 'both' ? 'grid' : 'flex',
              gridTemplateColumns: style === 'both' ? 'repeat(auto-fit, minmax(320px, 1fr))' : undefined,
              gap: '24px',
              justifyContent: style !== 'both' ? 'center' : undefined,
              marginBottom: '24px',
            }}>
              {(style === 'south' || style === 'both') && (
                <div>
                  <div style={{
                    fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center',
                  }}>South Indian · Rasi Chart</div>
                  <SouthIndianChart planets={planets} />
                </div>
              )}
              {(style === 'north' || style === 'both') && (
                <div>
                  <div style={{
                    fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center',
                  }}>North Indian · Rasi Chart</div>
                  <NorthIndianChart planets={planets} />
                </div>
              )}
            </div>

            {/* Planet Table */}
            <PlanetTable planets={planets} />

            {/* Footer note */}
            <div style={{
              marginTop:'20px', padding:'14px 18px',
              background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:'14px', fontSize:'11px', color:'rgba(255,255,255,0.25)',
              lineHeight:1.7, textAlign:'center',
            }}>
              Lahiri (Chitrapaksha) Ayanamsa · Whole-sign houses · Low-precision VSOP87 / ELP-2000 truncated series ±0.5° accuracy
            </div>
          </div>
        )}
      </main>
    </>
  );
}
