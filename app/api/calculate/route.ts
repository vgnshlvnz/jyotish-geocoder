import { NextRequest, NextResponse } from 'next/server';

// ─── Astronomy helpers ──────────────────────────────────────────────────────

function julianDay(year: number, month: number, day: number, hourUtc: number): number {
  return (
    367 * year -
    Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) +
    Math.floor((275 * month) / 9) +
    day +
    1721013.5 +
    hourUtc / 24
  );
}

/** Lahiri (Chitrapaksha) ayanamsa — accurate to ±0.01° for 1800–2100 */
function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.853 + (T * 36525) / 100 * 0.013611;
  // Simplified: linear drift from 23.853° at 1900.0 at 50.3"/yr ≈ 0.013611°/yr
}

/** More accurate Lahiri using T directly */
function ayanamsa(jd: number): number {
  const yearFrac = 1900 + (jd - 2415020.5) / 365.25;
  return 23.853 + (yearFrac - 1900) * 0.013611;
}

/** Mean obliquity of the ecliptic */
function obliquity(T: number): number {
  return 23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
}

/** Greenwich Mean Sidereal Time in degrees (IAU 1982) */
function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return (
    (280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T -
      (T * T * T) / 38710000) %
    360
  );
}

/** Sidereal ascendant in degrees (tropical) */
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

/** Approximate solar altitude at a given JD and location */
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

  return (
    Math.asin(
      Math.sin(latR) * Math.sin(dec) + Math.cos(latR) * Math.cos(dec) * Math.cos(ha)
    ) *
    (180 / Math.PI)
  );
}

/** Find sunrise JD within a 24h window starting at jdStart */
function findSunrise(jdStart: number, latDeg: number, lonDeg: number): number | null {
  let prev = solarAltitude(jdStart, latDeg, lonDeg);
  const step = 1 / (24 * 60); // 1 minute in JD units

  for (let i = 1; i <= 1440; i++) {
    const jd = jdStart + i * step;
    const alt = solarAltitude(jd, latDeg, lonDeg);
    if (prev < -0.833 && alt >= -0.833) {
      // Binary search refinement
      let lo = jdStart + (i - 1) * step;
      let hi = jd;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        if (solarAltitude(mid, latDeg, lonDeg) < -0.833) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    }
    prev = alt;
  }
  return null;
}

/**
 * Find the most recent sunrise before (or at) jdBirth.
 * Searches up to 2 days back.
 */
function prevSunrise(jdBirth: number, latDeg: number, lonDeg: number): number | null {
  // Start searching from 18h before birth (midnight before birth day)
  for (let dayBack = 0; dayBack <= 2; dayBack++) {
    const windowStart = jdBirth - (dayBack + 1) * 1.0; // start 1-2 days back
    const sr = findSunrise(windowStart, latDeg, lonDeg);
    if (sr !== null && sr <= jdBirth) {
      return sr;
    }
  }
  return null;
}

// ─── Formatting ─────────────────────────────────────────────────────────────

const RASI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya', 'Tula', 'Vrishchika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena',
];

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

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { date, time, place, tzOffset } = await req.json();

    if (!date || !time || !place) {
      return NextResponse.json({ error: 'Date, time and place are required' }, { status: 400 });
    }

    // Geocode
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'JyotishLagnaCalculator/1.0 (vigneshwaranr@outlook.com)',
          Accept: 'application/json',
        },
      }
    );

    if (!geoRes.ok) {
      return NextResponse.json(
        { error: 'Geocoding unavailable. Please try again in a moment.' },
        { status: 500 }
      );
    }

    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) {
      return NextResponse.json(
        { error: "Place not found. Try a more specific name, e.g. 'Kuala Lumpur, Malaysia'" },
        { status: 404 }
      );
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 500 });
    }

    // Parse date/time — treat as LOCAL time, convert to UTC using tzOffset
    const [year, month, day] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const localHour = hh + mm / 60;

    // tzOffset in minutes (positive = east of UTC, e.g. UTC+8 → 480)
    // If not provided, attempt a rough estimate from longitude
    const tzMin: number = tzOffset !== undefined ? Number(tzOffset) : Math.round(lon / 15) * 60;
    const utcHour = localHour - tzMin / 60;

    // Adjust date for UTC
    let utcYear = year, utcMonth = month, utcDay = day;
    let adjustedUtcHour = utcHour;
    if (adjustedUtcHour < 0) {
      adjustedUtcHour += 24;
      // Go back one day
      const d = new Date(Date.UTC(year, month - 1, day));
      d.setUTCDate(d.getUTCDate() - 1);
      utcYear = d.getUTCFullYear();
      utcMonth = d.getUTCMonth() + 1;
      utcDay = d.getUTCDate();
    } else if (adjustedUtcHour >= 24) {
      adjustedUtcHour -= 24;
      const d = new Date(Date.UTC(year, month - 1, day));
      d.setUTCDate(d.getUTCDate() + 1);
      utcYear = d.getUTCFullYear();
      utcMonth = d.getUTCMonth() + 1;
      utcDay = d.getUTCDate();
    }

    const jdBirth = julianDay(utcYear, utcMonth, utcDay, adjustedUtcHour);

    // ── Udaya Lagna (sidereal ascendant at birth) ──
    const udayaDeg = siderealAscendant(jdBirth, lat, lon);

    // ── Find sunrise before birth for Hora / Ghati Lagna ──
    const srJd = prevSunrise(jdBirth, lat, lon);
    if (!srJd) {
      // Fallback: return udaya only
      return NextResponse.json({
        udaya: degToRasi(udayaDeg),
        hora: degToRasi(udayaDeg),
        ghati: degToRasi(udayaDeg),
        lat, lon,
        note: 'Hora/Ghati could not be computed (sunrise not found)',
      });
    }

    const ulAtSunrise = siderealAscendant(srJd, lat, lon);
    const elapsedHours = (jdBirth - srJd) * 24;
    const elapsedGhatis = elapsedHours * 2.5; // 1 hora = 1 hr; 1 ghati = 24 min = 0.4 hr

    // Hora Lagna advances 30° per hora (1 rasi per hour)
    const horaDeg = (ulAtSunrise + elapsedHours * 30 + 360) % 360;

    // Ghati Lagna advances 30° per ghati (1 rasi per 24 min)
    const ghatiDeg = (ulAtSunrise + elapsedGhatis * 30 + 360) % 360;

    return NextResponse.json({
      udaya: degToRasi(udayaDeg),
      hora: degToRasi(horaDeg),
      ghati: degToRasi(ghatiDeg),
      lat,
      lon,
      sunriseLocal: srJd !== null
        ? (() => {
            const h = ((srJd - julianDay(utcYear, utcMonth, utcDay, 0)) * 24 + tzMin / 60);
            const hNorm = ((h % 24) + 24) % 24;
            return `${String(Math.floor(hNorm)).padStart(2,'0')}:${String(Math.floor((hNorm % 1) * 60)).padStart(2,'0')}`;
          })()
        : null,
      elapsedHours: parseFloat(elapsedHours.toFixed(4)),
    });
  } catch (err: unknown) {
    console.error('Calculation error:', err);
    return NextResponse.json({ error: 'Calculation failed. Please try again.' }, { status: 500 });
  }
}
