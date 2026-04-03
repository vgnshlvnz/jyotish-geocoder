'use client';

import { useState } from 'react';

type LagnaResult = {
  udaya: { sign: string; degree: number; minute: number; rasi: string };
  hora: { sign: string; degree: number; minute: number; rasi: string };
  ghati: { sign: string; degree: number; minute: number; rasi: string };
  lat: number;
  lon: number;
};

export default function Home() {
  const [form, setForm] = useState({
    date: '',
    time: '',
    place: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LagnaResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Calculation failed');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-amber-400">Jyotish Lagna</h1>
        <p className="text-zinc-400 mt-3">Udaya • Hora • Ghati Lagna Calculator</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Birth Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-amber-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Birth Time (24h)</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-amber-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Birth Place</label>
            <input
              type="text"
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              placeholder="Kuala Lumpur, Malaysia"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-amber-400 outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 text-black font-semibold py-5 rounded-3xl text-lg transition-colors"
        >
          {loading ? 'Calculating Lagnas...' : 'Calculate 3 Lagnas'}
        </button>
      </form>

      {error && <p className="text-red-400 text-center mt-6">{error}</p>}

      {result && (
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-3xl font-medium mb-8 text-center">Lagna Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border border-amber-400/30 rounded-3xl p-6">
              <div className="text-amber-400 text-sm tracking-widest mb-2">UDAYA LAGNA</div>
              <div className="text-6xl font-light">{result.udaya.rasi}</div>
              <div className="text-4xl mt-2 font-mono">{result.udaya.degree}° {result.udaya.minute}'</div>
            </div>

            <div className="text-center border border-zinc-700 rounded-3xl p-6">
              <div className="text-zinc-400 text-sm tracking-widest mb-2">HORA LAGNA</div>
              <div className="text-6xl font-light">{result.hora.rasi}</div>
              <div className="text-4xl mt-2 font-mono">{result.hora.degree}° {result.hora.minute}'</div>
            </div>

            <div className="text-center border border-zinc-700 rounded-3xl p-6">
              <div className="text-zinc-400 text-sm tracking-widest mb-2">GHATI LAGNA</div>
              <div className="text-6xl font-light">{result.ghati.rasi}</div>
              <div className="text-4xl mt-2 font-mono">{result.ghati.degree}° {result.ghati.minute}'</div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-zinc-500">
            Lat: {result.lat.toFixed(4)}° | Lon: {result.lon.toFixed(4)}°
          </div>
        </div>
      )}
    </div>
  );
}
