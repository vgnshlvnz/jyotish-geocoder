import { NextRequest, NextResponse } from 'next/server';
import { parseISO } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const { date, time, place } = await req.json();

    if (!date || !time || !place) {
      return NextResponse.json({ error: "Date, time and place are required" }, { status: 400 });
    }

    // Improved Nominatim call with proper User-Agent
    const userAgent = 'JyotishLagnaCalculator/1.0 (https://github.com/yourusername/jyotish-lagna-calculator - contact: vigneshwaranr@outlook.com)';

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
        },
      }
    );

    if (!geoRes.ok) {
      console.error('Nominatim error status:', geoRes.status);
      return NextResponse.json({ 
        error: "Geocoding unavailable. Nominatim may be rate-limited. Please try again in a few minutes or use a more specific place name." 
      }, { status: 500 });
    }

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: "Place not found. Try a more specific location (e.g. 'Kuala Lumpur, Malaysia')" }, { status: 404 });
    }

    const location = geoData[0];
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ error: "Invalid coordinates returned" }, { status: 500 });
    }

    // Birth time processing
    const birthDT = parseISO(`${date}T${time}:00`);
    const year = birthDT.getUTCFullYear();
    const month = birthDT.getUTCMonth() + 1;
    const day = birthDT.getUTCDate();
    const hour = birthDT.getUTCHours() + birthDT.getUTCMinutes() / 60;

    // Julian Day
    const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
               Math.floor(275 * month / 9) + day + 1721013.5 + hour / 24;

    // Lahiri Ayanamsa
    const t = (jd - 2451545.0) / 36525.0;
    const ayanamsa = 23.853 + 0.000133 * t + 0.0000004 * t * t;

    // Improved Ascendant calculation
    let lst = (jd - 2451545.0) * 0.06570982441908 + hour * 1.00273790935 + lon / 15.0 + 18.697374558;
    lst = ((lst % 24) + 24) % 24;

    const obliquity = 23.439281 - 0.0000004 * (jd - 2451545.0);
    const ramc = lst * 15.0;

    let asc = Math.atan2(
      Math.sin(ramc * Math.PI / 180),
      Math.cos(ramc * Math.PI / 180) * Math.sin(obliquity * Math.PI / 180) - Math.tan(lat * Math.PI / 180) * Math.cos(obliquity * Math.PI / 180)
    ) * 180 / Math.PI;

    if (asc < 0) asc += 360;

    const udayaDeg = (asc + ayanamsa) % 360;

    const horaDeg = (udayaDeg + 30) % 360;
    const ghatiDeg = (udayaDeg + 60) % 360;

    const rasiNames = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanus", "Makara", "Kumbha", "Meena"];

    const toDMS = (deg: number) => ({
      degree: Math.floor(deg),
      minute: Math.floor((deg - Math.floor(deg)) * 60)
    });

    const getRasi = (deg: number) => rasiNames[Math.floor(deg / 30) % 12];

    const result = {
      udaya: { ...toDMS(udayaDeg), rasi: getRasi(udayaDeg) },
      hora: { ...toDMS(horaDeg), rasi: getRasi(horaDeg) },
      ghati: { ...toDMS(ghatiDeg), rasi: getRasi(ghatiDeg) },
      lat,
      lon,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Calculation error:', err);
    return NextResponse.json({ error: "Calculation failed. Please try again." }, { status: 500 });
  }
}
