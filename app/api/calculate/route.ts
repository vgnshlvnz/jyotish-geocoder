import { NextRequest, NextResponse } from 'next/server';

import { calculateUnifiedChart } from '../../../lib/chartEngine';

type CalculateRequest = {
  date?: string;
  time?: string;
  place?: string;
  lat?: number;
  lon?: number;
  label?: string;
  tzOffset?: number;
};

type ResolvedLocation = {
  lat: number;
  lon: number;
  label: string;
  source: 'coordinates' | 'geocoded';
};

function parseFiniteNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function geocodePlace(place: string): Promise<ResolvedLocation | null> {
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=3&addressdetails=1`,
    { headers: { 'User-Agent': 'JyotishLagnaCalculator/1.0', Accept: 'application/json' } }
  );

  if (!geoRes.ok) {
    throw new Error('Geocoding unavailable.');
  }

  const geoData = await geoRes.json();
  if (!geoData?.length) {
    return null;
  }

  const lat = parseFiniteNumber(geoData[0].lat);
  const lon = parseFiniteNumber(geoData[0].lon);
  if (lat === null || lon === null) {
    throw new Error('Invalid coordinates');
  }

  return {
    lat,
    lon,
    label: geoData[0].display_name?.split(',').slice(0, 3).join(',') || place,
    source: 'geocoded',
  };
}

async function resolveLocation(body: CalculateRequest): Promise<ResolvedLocation | null> {
  const lat = parseFiniteNumber(body.lat);
  const lon = parseFiniteNumber(body.lon);

  if (lat !== null && lon !== null) {
    return {
      lat,
      lon,
      label: body.label || body.place || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      source: 'coordinates',
    };
  }

  if (!body.place) {
    return null;
  }

  return geocodePlace(body.place);
}

function formatLocalTimeFromJulianDay(jd: number, tzOffsetMinutes: number): string {
  const unixMs = (jd - 2440587.5) * 86400000 + tzOffsetMinutes * 60000;
  const local = new Date(unixMs);
  return `${String(local.getUTCHours()).padStart(2, '0')}:${String(local.getUTCMinutes()).padStart(2, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CalculateRequest;
    const { date, time } = body;

    if (!date || !time) {
      return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
    }

    const location = await resolveLocation(body);
    if (!location) {
      return NextResponse.json({ error: 'Place or coordinates are required' }, { status: 400 });
    }

    const [year, month, day] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const localHour = hh + mm / 60;
    const tzOffsetMinutes = body.tzOffset !== undefined
      ? Number(body.tzOffset)
      : Math.round(location.lon / 15) * 60;
    const utcHour = localHour - tzOffsetMinutes / 60;

    const calculation = calculateUnifiedChart(year, month, day, utcHour, location.lat, location.lon);

    return NextResponse.json({
      ...calculation,
      lat: location.lat,
      lon: location.lon,
      place: location.label,
      locationSource: location.source,
      sunriseLocal: calculation.sunriseJulianDay === null
        ? null
        : formatLocalTimeFromJulianDay(calculation.sunriseJulianDay, tzOffsetMinutes),
      trace: {
        date,
        time,
        tzOffsetMinutes,
        utcHour: Number(utcHour.toFixed(6)),
        birthJulianDay: Number(calculation.birthJulianDay.toFixed(8)),
        sunriseJulianDay: calculation.sunriseJulianDay === null
          ? null
          : Number(calculation.sunriseJulianDay.toFixed(8)),
      },
    });
  } catch (err) {
    console.error('Calculation error:', err);

    const message = err instanceof Error ? err.message : 'Calculation failed. Please try again.';
    const status = message === 'Geocoding unavailable.' ? 500 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
