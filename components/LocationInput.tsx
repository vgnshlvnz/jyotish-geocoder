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
    timer.current = setTimeout(() => search(query), 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
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
        className="astro-input"
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
        style={{ padding: '12px 14px', paddingRight: loading ? 36 : 14 }}
      />

      {loading && (
        <span
          className="astro-input-spinner"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
        />
      )}

      {open && (
        <div className="astro-dropdown" role="listbox" aria-label="location suggestions">
          {results.length === 0 ? (
            <div className="astro-dropdown__empty">No locations found.</div>
          ) : (
            <ul className="astro-dropdown__list">
              {results.map((item, idx) => (
                <li key={`${item.display_name}-${idx}`}>
                  <button
                    type="button"
                    className="astro-dropdown__item"
                    onMouseDown={() => pick(item)}
                  >
                    <div className="astro-dropdown__item-title">
                      {item.display_name.length > 85
                        ? `${item.display_name.slice(0, 82)}...`
                        : item.display_name}
                    </div>
                    <div className="astro-dropdown__item-meta">
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
