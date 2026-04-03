import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { q } = await request.json();

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'JyotishLagnaCalculator/1.0 (contact@yourdomain.com)',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
