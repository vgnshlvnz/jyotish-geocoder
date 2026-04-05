'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

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
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      });
      if (res.ok) {
        const data: GeoResult[] = await res.json();
        const next = data.slice(0, 5);
        setResults(next);
        setOpen(next.length > 0);
      }
    } catch {
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selected && query === selected) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 320);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, search, selected]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  function pick(item: GeoResult) {
    const label = item.display_name.split(',').slice(0, 3).join(',');
    setQuery(label);
    setSelected(label);
    setOpen(false);
    onSelect(parseFloat(item.lat), parseFloat(item.lon), label);
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        className="vedic-input"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected('');
        }}
        placeholder="Kuala Lumpur, Malaysia"
        autoComplete="off"
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        style={{ paddingRight: loading ? 36 : 12 }}
      />

      {loading && (
        <span
          className="loader-ring"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
        />
      )}

      {open && (
        <div className="vedic-dropdown" role="listbox" aria-label="location suggestions">
          {results.length === 0 ? (
            <div style={{ color: '#c7c0ac', padding: '10px' }}>No locations found.</div>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {results.map((item, idx) => (
                <li key={`${item.display_name}-${idx}`}>
                  <button type="button" className="vedic-dropdown-item" onMouseDown={() => pick(item)}>
                    <div style={{ fontSize: 13, lineHeight: 1.35 }}>
                      {item.display_name.length > 88
                        ? `${item.display_name.slice(0, 85)}...`
                        : item.display_name}
                    </div>
                    <div style={{ marginTop: 3, fontSize: 11, color: '#9ea7bf' }}>
                      lat {Number(item.lat).toFixed(4)} · lon {Number(item.lon).toFixed(4)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
