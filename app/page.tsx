'use client';

import { useState, useEffect } from 'react';
import PARIHARA_DATA, { PariharaInfo } from '../lib/pariharaData';
import FeedbackForm from '../components/FeedbackForm';

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

const RASI_COLORS: Record<string, string> = {
  Mesha: '#E53E3E', Vrishabha: '#38A169', Mithuna: '#3182CE',
  Karka: '#B7791F', Simha: '#DD6B20', Kanya: '#2F855A',
  Tula: '#6B46C1', Vrishchika: '#9B2C2C', Dhanus: '#C05621',
  Makara: '#2D3748', Kumbha: '#2B6CB0', Meena: '#285E61',
};

const LAGNA_META = {
  udaya: { label: 'UDAYA LAGNA', shortLabel: 'Udaya', color: '#D4A017', desc: 'Rising sign · Body & life path' },
  hora: { label: 'HORA LAGNA', shortLabel: 'Hora', color: '#7C3AED', desc: 'Wealth & resources' },
  ghati: { label: 'GHATI LAGNA', shortLabel: 'Ghati', color: '#059669', desc: 'Power & authority' },
};

function StarField() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden>
      {Array.from({ length: 120 }).map((_, i) => {
        const size = Math.random() * 2 + 0.3;
        const opacity = Math.random() * 0.5 + 0.05;
        const animDuration = Math.random() * 4 + 2;
        const animDelay = Math.random() * 4;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'white',
            borderRadius: '50%',
            opacity,
            animation: `twinkle ${animDuration}s ${animDelay}s ease-in-out infinite`,
          }} />
        );
      })}
    </div>
  );
}

function MuhurtaStars({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          fontSize: '14px',
          color: i <= score ? '#F6AD55' : 'rgba(255,255,255,0.15)',
          filter: i <= score ? 'drop-shadow(0 0 4px rgba(246,173,85,0.8))' : 'none',
        }}>★</span>
      ))}
    </div>
  );
}

function LagnaHeader({ type, data }: { type: 'udaya' | 'hora' | 'ghati'; data: LagnaData }) {
  const meta = LAGNA_META[type];
  const symbol = RASI_SYMBOLS[data.rasi] || '◈';
  const lord = RASI_LORDS[data.rasi] || '—';
  const rasiColor = RASI_COLORS[data.rasi] || '#888';
  const isUdaya = type === 'udaya';

  return (
    <div style={{
      background: isUdaya
        ? `linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.03) 100%)`
        : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isUdaya ? 'rgba(212,160,23,0.35)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '20px',
      padding: '24px',
    }}>
      <div style={{ fontSize: '9px', letterSpacing: '0.22em', color: meta.color, fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>
        {meta.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <span style={{ fontSize: '44px', lineHeight: 1, color: rasiColor, filter: `drop-shadow(0 0 10px ${rasiColor}66)` }}>
          {symbol}
        </span>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 300, color: '#F4F0E8', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            {data.rasi}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', letterSpacing: '0.08em' }}>
            Lord: {lord}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 200, color: meta.color }}>
            {data.degree}<span style={{ fontSize: '16px', opacity: 0.6 }}>°</span>
            {String(data.minute).padStart(2, '0')}<span style={{ fontSize: '16px', opacity: 0.6 }}>'</span>
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
            {meta.desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function PariharaPanel({ rasi, lagnaType }: { rasi: string; lagnaType: string }) {
  const [tab, setTab] = useState<'overview' | 'deity' | 'mantra' | 'prayer' | 'remedies'>('overview');
  const data: PariharaInfo | undefined = PARIHARA_DATA[rasi];
  if (!data) return null;

  const rasiColor = RASI_COLORS[rasi] || '#888';
  const symbol = RASI_SYMBOLS[rasi] || '◈';

  const tabs: { key: typeof tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '◎' },
    { key: 'deity', label: 'Deva / Devi', icon: '✦' },
    { key: 'mantra', label: 'Mantra', icon: '॰' },
    { key: 'prayer', label: 'Parihara Prayer', icon: '🙏' },
    { key: 'remedies', label: 'Remedies', icon: '◈' },
  ];

  return (
    <div style={{
      background: 'rgba(12,12,24,0.9)',
      border: `1px solid ${rasiColor}33`,
      borderRadius: '20px',
      overflow: 'hidden',
      marginTop: '16px',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '16px 20px',
        background: `linear-gradient(90deg, ${rasiColor}18 0%, transparent 100%)`,
        borderBottom: `1px solid ${rasiColor}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', color: rasiColor }}>{symbol}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: '#F4F0E8', letterSpacing: '0.06em' }}>
              {rasi} Parihara — {lagnaType}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginTop: '1px' }}>
              {data.deity.primary}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MuhurtaStars score={data.muhurtaScore} />
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>muhurta</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '10px 12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: tab === t.key ? `${rasiColor}22` : 'transparent',
              color: tab === t.key ? rasiColor : 'rgba(255,255,255,0.35)',
              fontSize: '11px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderBottom: tab === t.key ? `2px solid ${rasiColor}` : '2px solid transparent',
              transition: 'all 0.2s',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ marginRight: '5px' }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '20px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Qualities</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {data.qualities.map(q => (
                  <span key={q} style={{
                    fontSize: '11px', padding: '3px 9px', borderRadius: '12px',
                    background: `${rasiColor}15`, border: `1px solid ${rasiColor}30`,
                    color: 'rgba(255,255,255,0.7)',
                  }}>{q}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Strengths</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.strengths.map(s => (
                  <li key={s} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                    <span style={{ color: '#4ade80', marginRight: '6px' }}>▸</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: '#f87171', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Challenges</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.challenges.map(c => (
                  <li key={c} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                    <span style={{ color: '#f87171', marginRight: '6px' }}>▸</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: '#60a5fa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Best Pursuits</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.goodFor.map(g => (
                  <li key={g} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                    <span style={{ color: '#60a5fa', marginRight: '6px' }}>▸</span>{g}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                padding: '12px 16px',
                background: `${rasiColor}0d`,
                border: `1px solid ${rasiColor}25`,
                borderRadius: '10px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
              }}>
                <span style={{ color: '#F6AD55', marginRight: '6px' }}>★</span>
                <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Muhurta:</strong> {data.muhurtaNote}
              </div>
            </div>
          </div>
        )}

        {/* DEITY */}
        {tab === 'deity' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{
              padding: '20px',
              background: `${rasiColor}0d`,
              border: `1px solid ${rasiColor}25`,
              borderRadius: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: `${rasiColor}22`, border: `2px solid ${rasiColor}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', flexShrink: 0,
                  filter: `drop-shadow(0 0 8px ${rasiColor}66)`,
                }}>
                  {RASI_SYMBOLS[rasi]}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#F4F0E8', letterSpacing: '0.04em', marginBottom: '4px' }}>
                    {data.deity.primary}
                  </div>
                  <div style={{ fontSize: '11px', color: rasiColor, letterSpacing: '0.08em', marginBottom: '8px' }}>
                    {data.deity.aspect}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    <em>{data.deity.iconography}</em>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Also propitiate
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {data.deity.secondary.map(d => (
                  <span key={d} style={{
                    fontSize: '12px', padding: '4px 12px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.65)',
                  }}>{d}</span>
                ))}
              </div>
            </div>

            <div style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
            }}>
              {data.devaDeviNote}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              {[
                { label: 'Sacred Day', value: data.day },
                { label: 'Stotra', value: data.stotra },
                { label: 'Vrata', value: data.vratam },
                { label: 'Tirtha', value: data.tirtha },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                }}>
                  <div style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MANTRA */}
        {tab === 'mantra' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{
              padding: '24px',
              background: `${rasiColor}0d`,
              border: `1px solid ${rasiColor}30`,
              borderRadius: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>
                Graha Mantra
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px, 3vw, 22px)',
                color: '#F4F0E8',
                lineHeight: 1.6,
                marginBottom: '12px',
                letterSpacing: '0.04em',
              }}>
                {data.mantra.sanskrit}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: rasiColor,
                marginBottom: '10px',
                letterSpacing: '0.06em',
              }}>
                {data.mantra.transliteration}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginBottom: '12px' }}>
                {data.mantra.meaning}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 14px', borderRadius: '20px',
                background: `${rasiColor}18`, border: `1px solid ${rasiColor}35`,
                fontSize: '11px', color: rasiColor,
              }}>
                <span>🔔</span> {data.mantra.count}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Recommended Stotra</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{data.stotra}</div>
              </div>
              <div style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Vrata</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{data.vratam}</div>
              </div>
            </div>

            <div style={{
              padding: '12px 16px',
              background: 'rgba(246,173,85,0.05)',
              border: '1px solid rgba(246,173,85,0.15)',
              borderRadius: '10px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
            }}>
              💡 Recite mantra after bath, facing <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{data.direction}</strong>, on <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{data.day}s</strong> during Brahma Muhurta (96 min before sunrise) for maximum effect.
            </div>
          </div>
        )}

        {/* PRAYER */}
        {tab === 'prayer' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{
              padding: '4px',
              background: `linear-gradient(135deg, ${rasiColor}22, transparent)`,
              borderRadius: '16px',
            }}>
              <div style={{
                padding: '20px 22px',
                background: '#0a0a18',
                borderRadius: '13px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '16px' }}>🇮🇳</span>
                  <span style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Tamil Prayer</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  color: '#F4F0E8',
                  lineHeight: 2.0,
                  whiteSpace: 'pre-line',
                  letterSpacing: '0.02em',
                }}>
                  {data.pariharaPrayer.tamil}
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>🕉</span>
                <span style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Sanskrit Prayer</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                color: 'rgba(244,240,232,0.85)',
                lineHeight: 2.0,
                whiteSpace: 'pre-line',
              }}>
                {data.pariharaPrayer.sanskrit}
              </div>
            </div>

            <div style={{
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>🌐</span>
                <span style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.18em', textTransform: 'uppercase' }}>English Prayer</span>
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(244,240,232,0.7)',
                lineHeight: 1.9,
                whiteSpace: 'pre-line',
                fontStyle: 'italic',
              }}>
                {data.pariharaPrayer.english}
              </div>
            </div>

            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '10px',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
              letterSpacing: '0.06em',
            }}>
              Recite with devotion on {data.day}s · Tirtha: {data.tirtha}
            </div>
          </div>
        )}

        {/* REMEDIES */}
        {tab === 'remedies' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Ratna (Gemstone)', value: data.gemstone, icon: '💎', sub: `Alt: ${data.alternateGem}` },
              { label: 'Dhatu (Metal)', value: data.metal, icon: '⚗️', sub: `Wear on ${data.day}` },
              { label: 'Varna (Color)', value: data.color, icon: '🎨', sub: 'Wear / use in puja' },
              { label: 'Dik (Direction)', value: data.direction, icon: '🧭', sub: 'Face while praying' },
              { label: 'Vara (Day)', value: data.day, icon: '📅', sub: 'Primary worship day' },
              { label: 'Vrata', value: data.vratam.split('—')[0].trim(), icon: '🌙', sub: data.vratam.split('—')[1]?.trim() || '' },
              { label: 'Tirtha / Kshetra', value: data.tirtha.split(',')[0], icon: '🛕', sub: data.tirtha.split(',').slice(1, 2).join(', ') },
              { label: 'Stotra Path', value: data.stotra.split('/')[0].trim(), icon: '📿', sub: 'Daily recommended' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${rasiColor}20`,
                borderRadius: '12px',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = `${rasiColor}0d`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '9px', color: rasiColor, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '13px', color: '#F4F0E8', fontWeight: 500, marginBottom: '3px' }}>
                  {item.value}
                </div>
                {item.sub && (
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{item.sub}</div>
                )}
              </div>
            ))}

            <div style={{
              gridColumn: '1 / -1',
              padding: '14px 16px',
              background: `${rasiColor}0a`,
              border: `1px solid ${rasiColor}25`,
              borderRadius: '12px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
            }}>
              <strong style={{ color: rasiColor, display: 'block', marginBottom: '6px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ◈ Deva / Devi Worship Note
              </strong>
              {data.devaDeviNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LagnaSection({ type, data }: { type: 'udaya' | 'hora' | 'ghati'; data: LagnaData }) {
  const [showParihara, setShowParihara] = useState(type === 'udaya');
  const meta = LAGNA_META[type];
  const rasiColor = RASI_COLORS[data.rasi] || '#888';

  return (
    <div style={{ marginBottom: '24px' }}>
      <LagnaHeader type={type} data={data} />
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setShowParihara(!showParihara)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 16px',
            background: showParihara ? `${rasiColor}18` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showParihara ? rasiColor + '44' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            color: showParihara ? rasiColor : 'rgba(255,255,255,0.4)',
            fontSize: '11px',
            cursor: 'pointer',
            letterSpacing: '0.08em',
            transition: 'all 0.2s',
          }}
        >
          <span>{showParihara ? '▾' : '▸'}</span>
          {showParihara ? 'Hide' : 'Show'} Parihara, Deity & Prayer
        </button>
      </div>
      {showParihara && <PariharaPanel rasi={data.rasi} lagnaType={meta.shortLabel} />}
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
            radial-gradient(ellipse 100% 60% at 30% -5%, rgba(99,102,241,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 80% 50% at 80% 110%, rgba(212,160,23,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 50% 70% at 50% 50%, rgba(16,185,129,0.02) 0%, transparent 60%);
        }
        @keyframes twinkle {
          0%, 100% { opacity: var(--op, 0.3); }
          50% { opacity: calc(var(--op, 0.3) * 0.2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .result-section { animation: fadeUp 0.6s ease forwards; }
        .field input {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 18px;
          color: #F4F0E8;
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          color-scheme: dark;
        }
        .field input:focus {
          border-color: rgba(212,160,23,0.5);
          box-shadow: 0 0 0 3px rgba(212,160,23,0.08);
        }
        .field input::placeholder { color: rgba(255,255,255,0.18); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @media (max-width: 640px) {
          .grid-inputs { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <StarField />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '5px 18px', borderRadius: '20px',
            background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)',
            marginBottom: '20px',
          }}>
            <span style={{ color: 'rgba(212,160,23,0.8)', fontSize: '12px', letterSpacing: '0.08em' }}>🕉</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(212,160,23,0.7)', fontWeight: 500 }}>VEDIC EPHEMERIS</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5.5vw, 52px)',
            fontWeight: 300,
            color: '#F4F0E8',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}>
            Jyotish Lagna<span style={{ color: '#D4A017' }}> ·</span>
          </h1>
          <p style={{
            color: 'rgba(244,240,232,0.38)',
            fontSize: '13px',
            letterSpacing: '0.14em',
          }}>
            Udaya · Hora · Ghati &nbsp;—&nbsp; with Parihara, Deva/Devi & Prayers
          </p>
          <div style={{ width: '48px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017, transparent)', margin: '22px auto 0' }} />
        </header>

        {/* Form */}
        <section style={{
          background: 'rgba(14,14,28,0.85)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 40px)',
          backdropFilter: 'blur(20px)',
          marginBottom: '32px',
        }}>
          <form onSubmit={handleSubmit}>
            <div className="grid-inputs" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '20px',
            }}>
              {[
                { label: 'Birth Date', type: 'date', field: 'date' },
                { label: 'Birth Time (local)', type: 'time', field: 'time' },
                { label: 'Birth Place', type: 'text', field: 'place', placeholder: 'Kuala Lumpur, Malaysia' },
              ].map(({ label, type, field, placeholder }) => (
                <div key={field} className="field" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder}
                    required
                  />
                </div>
              ))}
            </div>

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
                }}
              />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                minutes from UTC &nbsp;·&nbsp; IST=+330 &nbsp;·&nbsp; MYT=+480 &nbsp;·&nbsp; EST=−300
              </span>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '17px',
              background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
              color: loading ? 'rgba(255,255,255,0.3)' : '#100d00',
              border: 'none', borderRadius: '14px',
              fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 500,
              letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s, transform 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.15)',
                    borderTopColor: '#D4A017', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Computing Lagnas…
                </>
              ) : '⟡ Calculate Three Lagnas with Parihara'}
            </button>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '14px', padding: '14px 18px', color: '#FCA5A5',
            fontSize: '13px', marginBottom: '24px', textAlign: 'center',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="result-section">
            {/* Meta pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
              {[
                { label: `${result.lat.toFixed(3)}°N`, icon: '📍' },
                { label: `${result.lon.toFixed(3)}°E`, icon: '📍' },
                result.sunriseLocal ? { label: `Sunrise ${result.sunriseLocal}`, icon: '🌅' } : null,
                { label: `${result.elapsedHours.toFixed(2)}h from sunrise`, icon: '⏱' },
              ].filter(Boolean).map((item, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '11px', color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <span>{item!.icon}</span>{item!.label}
                </span>
              ))}
            </div>

            {result.note && (
              <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '11px', color: 'rgba(212,160,23,0.55)' }}>
                ⚠ {result.note}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                LAGNA PHALA
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Three lagnas */}
            <LagnaSection type="udaya" data={result.udaya} />
            <LagnaSection type="hora" data={result.hora} />
            <LagnaSection type="ghati" data={result.ghati} />

            {/* Footer note */}
            <div style={{
              marginTop: '16px', padding: '16px 20px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.25)',
              lineHeight: 1.7, textAlign: 'center',
            }}>
              Lahiri (Chitrapaksha) Ayanamsa · IAU 1982 GMST · Solar altitude sunrise model ·
              Parihara recommendations are traditional Shaiva-Vaishnava and Tamil Siddha sampradaya guidance
            </div>

            <FeedbackForm defaultLagna={`${result.udaya.rasi} Udaya`} />
          </div>
        )}
      </main>
    </>
  );
}
