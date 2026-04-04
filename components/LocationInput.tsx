'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface GeoResult { display_name: string; lat: string; lon: string; }

interface Props {
  onSelect: (lat: number, lon: number, label: string) => void;
}

export default function LocationInput({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      });
      if (res.ok) {
        const data: GeoResult[] = await res.json();
        setResults(data.slice(0, 5));
        setOpen(data.length > 0);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (selected && query === selected) return; // already confirmed
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, search, selected]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function pick(r: GeoResult) {
    const label = r.display_name.split(',').slice(0, 3).join(',');
    setQuery(label);
    setSelected(label);
    setOpen(false);
    onSelect(parseFloat(r.lat), parseFloat(r.lon), label);
  }

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

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setSelected(''); }}
        placeholder="Kuala Lumpur, Malaysia"
        autoComplete="off"
        style={inputStyle}
        onFocus={e => {
          (e.target as HTMLInputElement).style.borderColor = 'rgba(212,160,23,0.5)';
          (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(212,160,23,0.08)';
          if (results.length > 0) setOpen(true);
        }}
        onBlur={e => {
          (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)';
          (e.target as HTMLInputElement).style.boxShadow = 'none';
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
          width: '13px', height: '13px',
          border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#D4A017',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
      )}
      {open && results.length > 0 && (
        <ul style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          background: '#0f0f1e',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          listStyle: 'none', margin: 0, padding: '4px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          maxHeight: '220px', overflowY: 'auto',
        }}>
          {results.map((r, i) => (
            <li
              key={i}
              onMouseDown={() => pick(r)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'rgba(244,240,232,0.8)',
                lineHeight: 1.4,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,160,23,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {r.display_name.length > 80
                ? r.display_name.slice(0, 77) + '…'
                : r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
