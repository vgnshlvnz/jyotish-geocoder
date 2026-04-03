import { NextRequest, NextResponse } from 'next/server';
import { parseISO } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const { date, time, place } = await req.json();

    if (!date || !time || !place) {
      return NextResponse.json({ error: "Date, time and place are required" }, { status: 400 });
    }

    // Geocode using relative URL (works on Vercel)
    const geoRes = await fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: place }),
    });

    if (!geoRes.ok) {
      return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 500 });
    }

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const { lat, lon } = geoData[0];

    // Simple but functional Lagna calculation
    const birthDateTime = parseISO(`${date}T${time}:00`);
    const year = birthDateTime.getUTCFullYear();
    const month = birthDateTime.getUTCMonth() + 1;
    const day = birthDateTime.getUTCDate();
    const utcHours = birthDateTime.getUTCHours() + birthDateTime.getUTCMinutes() / 60;

    const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
               Math.floor(275 * month / 9) + day + 1721013.5 + utcHours / 24;

    // Lahiri Ayanamsa approximation
    const t = (jd - 2451545.0) / 36525;
    const ayanamsa = 23.853 + 0.000133 * t;

    // Local Sidereal Time approximation
    const lst = (jd - 2451545.0) * 0.0657098 + utcHours * 1.0027379 + parseFloat(lon) / 15 + 18.697374558;

    // Ascendant (Udaya Lagna)
    const obliquity = 23.439 - 0.0000004 * (jd - 2451545.0);
    const asc = (Math.atan2(
      Math.sin(lst * Math.PI / 12),
      Math.cos(lst * Math.PI / 12) * Math.sin(obliquity * Math.PI / 180) - Math.tan(parseFloat(lat) * Math.PI / 180) * Math.cos(obliquity * Math.PI / 180)
    ) * 180 / Math.PI + 360) % 360;

    const udayaDeg = (asc + ayanamsa) % 360;
    const horaDeg = (udayaDeg + 30) % 360;
    const ghatiDeg = (udayaDeg + 60) % 360;

    const rasiNames = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanus", "Makara", "Kumbha", "Meena"];

    const toDMS = (deg: number) => {
      const d = Math.floor(deg);
      const m = Math.floor((deg - d) * 60);
      return { degree: d, minute: m };
    };

    const getRasi = (deg: number) => rasiNames[Math.floor(deg / 30) % 12];

    const result = {
      udaya: { ...toDMS(udayaDeg), rasi: getRasi(udayaDeg) },
      hora: { ...toDMS(horaDeg), rasi: getRasi(horaDeg) },
      ghati: { ...toDMS(ghatiDeg), rasi: getRasi(ghatiDeg) },
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Calculation failed" }, { status: 500 });
  }
}
