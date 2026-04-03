import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { q } = await req.json();

  if (!q) return NextResponse.json({ error: 'Query required' }, { status: 400 });

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'JyotishLagnaCalculator/1.0 (contact@yourdomain.com)',
    },
  });

  if (!res.ok) return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });

  const data = await res.json();
  return NextResponse.json(data);
}
