import { NextRequest, NextResponse } from 'next/server';

function julianDay(year: number, month: number, day: number, hourUtc: number): number {
  return (
    367 * year -
    Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) +
    Math.floor((275 * month) / 9) +
    day + 1721013.5 + hourUtc / 24
  );
}

function ayanamsa(jd: number): number {
  const yearFrac = 1900 + (jd - 2415020.5) / 365.25;
  return 23.853 + (yearFrac - 1900) * 0.013611;
}

function obliquity(T: number): number {
  return 23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
}

function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return (
    (280.46061837 + 360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T - (T * T * T) / 38710000) % 360
  );
}

function tropicalAscendant(jd: number, latDeg: number, lonDeg: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const lst = ((gmst(jd) + lonDeg) % 360 + 360) % 360;
  const eps = obliquity(T);
  const ramc = (lst * Math.PI) / 180;
  const epsR = (eps * Math.PI) / 180;
  const latR = (latDeg * Math.PI) / 180;
  const asc = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR))
  );
  return ((asc * 180) / Math.PI + 360) % 360;
}

function siderealAscendant(jd: number, latDeg: number, lonDeg: number): number {
  const trop = tropicalAscendant(jd, latDeg, lonDeg);
  return (trop - ayanamsa(jd) + 360) % 360;
}

function solarAltitude(jd: number, latDeg: number, lonDeg: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = ((280.46646 + 36000.76983 * T) % 360 + 360) % 360;
  const M = ((357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360) * (Math.PI / 180);
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M);
  const sunLon = ((L0 + C) % 360) * (Math.PI / 180);
  const eps = obliquity(T) * (Math.PI / 180);
  const ra = Math.atan2(Math.cos(eps) * Math.sin(sunLon), Math.cos(sunLon));
  const dec = Math.asin(Math.sin(eps) * Math.sin(sunLon));
  const lstRad = (((gmst(jd) + lonDeg) % 360) * Math.PI) / 180;
  const ha = lstRad - ra;
  const latR = (latDeg * Math.PI) / 180;
  return Math.asin(Math.sin(latR) * Math.sin(dec) + Math.cos(latR) * Math.cos(dec) * Math.cos(ha)) * (180 / Math.PI);
}

function findSunrise(jdStart: number, latDeg: number, lonDeg: number): number | null {
  let prev = solarAltitude(jdStart, latDeg, lonDeg);
  const step = 1 / (24 * 60);
  for (let i = 1; i <= 1440; i++) {
    const jd = jdStart + i * step;
    const alt = solarAltitude(jd, latDeg, lonDeg);
    if (prev < -0.833 && alt >= -0.833) {
      let lo = jdStart + (i - 1) * step, hi = jd;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        if (solarAltitude(mid, latDeg, lonDeg) < -0.833) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    }
    prev = alt;
  }
  return null;
}

function prevSunrise(jdBirth: number, latDeg: number, lonDeg: number): number | null {
  for (let dayBack = 0; dayBack <= 2; dayBack++) {
    const windowStart = jdBirth - (dayBack + 1) * 1.0;
    const sr = findSunrise(windowStart, latDeg, lonDeg);
    if (sr !== null && sr <= jdBirth) return sr;
  }
  return null;
}

const RASI_NAMES = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanus','Makara','Kumbha','Meena'];

function degToRasi(deg: number) {
  const normalized = ((deg % 360) + 360) % 360;
  const rasiIdx = Math.floor(normalized / 30) % 12;
  const inRasi = normalized % 30;
  return {
    rasi: RASI_NAMES[rasiIdx],
    degree: Math.floor(inRasi),
    minute: Math.floor((inRasi - Math.floor(inRasi)) * 60),
    totalDeg: normalized,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { date, time, place, tzOffset } = await req.json();
    if (!date || !time || !place) {
      return NextResponse.json({ error: 'Date, time and place are required' }, { status: 400 });
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=3&addressdetails=1`,
      { headers: { 'User-Agent': 'JyotishLagnaCalculator/1.0', Accept: 'application/json' } }
    );
    if (!geoRes.ok) return NextResponse.json({ error: 'Geocoding unavailable.' }, { status: 500 });

    const geoData = await geoRes.json();
    if (!geoData?.length) return NextResponse.json({ error: "Place not found. Try a more specific name." }, { status: 404 });

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);
    if (isNaN(lat) || isNaN(lon)) return NextResponse.json({ error: 'Invalid coordinates' }, { status: 500 });

    const [year, month, day] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const localHour = hh + mm / 60;
    const tzMin: number = tzOffset !== undefined ? Number(tzOffset) : Math.round(lon / 15) * 60;
    const utcHour = localHour - tzMin / 60;

    let utcYear = year, utcMonth = month, utcDay = day;
    let adjustedUtcHour = utcHour;
    if (adjustedUtcHour < 0) {
      adjustedUtcHour += 24;
      const d = new Date(Date.UTC(year, month - 1, day));
      d.setUTCDate(d.getUTCDate() - 1);
      utcYear = d.getUTCFullYear(); utcMonth = d.getUTCMonth() + 1; utcDay = d.getUTCDate();
    } else if (adjustedUtcHour >= 24) {
      adjustedUtcHour -= 24;
      const d = new Date(Date.UTC(year, month - 1, day));
      d.setUTCDate(d.getUTCDate() + 1);
      utcYear = d.getUTCFullYear(); utcMonth = d.getUTCMonth() + 1; utcDay = d.getUTCDate();
    }

    const jdBirth = julianDay(utcYear, utcMonth, utcDay, adjustedUtcHour);
    const udayaDeg = siderealAscendant(jdBirth, lat, lon);
    const srJd = prevSunrise(jdBirth, lat, lon);

    if (!srJd) {
      return NextResponse.json({ udaya: degToRasi(udayaDeg), hora: degToRasi(udayaDeg), ghati: degToRasi(udayaDeg), lat, lon, note: 'Hora/Ghati could not be computed (sunrise not found)' });
    }

    const ulAtSunrise = siderealAscendant(srJd, lat, lon);
    const elapsedHours = (jdBirth - srJd) * 24;
    const elapsedGhatis = elapsedHours * 2.5;
    const horaDeg = (ulAtSunrise + elapsedHours * 30 + 360) % 360;
    const ghatiDeg = (ulAtSunrise + elapsedGhatis * 30 + 360) % 360;

    return NextResponse.json({
      udaya: degToRasi(udayaDeg),
      hora: degToRasi(horaDeg),
      ghati: degToRasi(ghatiDeg),
      lat, lon,
      sunriseLocal: (() => {
        const h = ((srJd - julianDay(utcYear, utcMonth, utcDay, 0)) * 24 + tzMin / 60);
        const hNorm = ((h % 24) + 24) % 24;
        return `${String(Math.floor(hNorm)).padStart(2,'0')}:${String(Math.floor((hNorm % 1) * 60)).padStart(2,'0')}`;
      })(),
      elapsedHours: parseFloat(elapsedHours.toFixed(4)),
    });
  } catch (err) {
    console.error('Calculation error:', err);
    return NextResponse.json({ error: 'Calculation failed. Please try again.' }, { status: 500 });
  }
}
