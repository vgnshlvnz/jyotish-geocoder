// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanetPosition {
  planet: string;       // 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Lagna'
  glyph: string;        // ☉ ☽ ♂ ☿ ♃ ♀ ♄ ☊ ☋ Lg
  longitude: number;   // 0–360 sidereal
  rasi: number;         // 0–11 (0=Aries, 1=Taurus ... 11=Pisces)
  degree: number;       // 0–29 within rasi
  minute: number;       // 0–59
  isRetrograde: boolean;
  house: number;        // 1–12 whole-sign
}

export interface LagnaData {
  rasi: string;
  degree: number;
  minute: number;
  totalDeg: number;
}

export interface UnifiedChartCalculation {
  planets: PlanetPosition[];
  udaya: LagnaData;
  hora: LagnaData;
  ghati: LagnaData;
  birthJulianDay: number;
  sunriseJulianDay: number | null;
  elapsedHours: number;
  note?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PI = Math.PI;
function toRad(d: number): number { return d * PI / 180; }
function toDeg(r: number): number { return r * 180 / PI; }
function norm360(d: number): number { return ((d % 360) + 360) % 360; }
function sin(d: number): number { return Math.sin(toRad(d)); }
function cos(d: number): number { return Math.cos(toRad(d)); }
function meanObliquity(T: number): number {
  return 23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
}
function greenwichMeanSiderealTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return norm360(
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000
  );
}

/** Newton's method to solve Kepler's equation E - e·sin(E) = M
 *  M in degrees, returns E in degrees */
function solveKepler(Mdeg: number, e: number): number {
  let M = toRad(norm360(Mdeg));
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let i = 0; i < 6; i++) {
    const dE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-9) break;
  }
  return toDeg(E);
}

// ─── Julian Day ───────────────────────────────────────────────────────────────

/** Meeus Ch.7. ut = decimal hours (0–24) */
export function julianDay(year: number, month: number, day: number, ut: number): number {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) +
         day + ut / 24 + B - 1524.5;
}

// ─── Ayanamsa ─────────────────────────────────────────────────────────────────

/** Lahiri (Chitrapaksha): 23.853° at JD 2415020.0 (Jan 0.5, 1900), rate 50.3″/year */
export function lahiriAyanamsa(jd: number): number {
  return 23.853 + (jd - 2415020.0) / 365.25 * (50.3 / 3600);
}

function solarAltitude(jd: number, latDeg: number, lonDeg: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M = toRad(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M);
  const sunLon = toRad(norm360(L0 + C));
  const eps = toRad(meanObliquity(T));
  const ra = Math.atan2(Math.cos(eps) * Math.sin(sunLon), Math.cos(sunLon));
  const dec = Math.asin(Math.sin(eps) * Math.sin(sunLon));
  const lstRad = toRad(greenwichMeanSiderealTime(jd) + lonDeg);
  const ha = lstRad - ra;
  const latR = toRad(latDeg);
  return toDeg(
    Math.asin(
      Math.sin(latR) * Math.sin(dec) +
      Math.cos(latR) * Math.cos(dec) * Math.cos(ha)
    )
  );
}

function findSunrise(jdStart: number, latDeg: number, lonDeg: number): number | null {
  let prev = solarAltitude(jdStart, latDeg, lonDeg);
  const step = 1 / (24 * 60);

  for (let i = 1; i <= 1440; i++) {
    const jd = jdStart + i * step;
    const alt = solarAltitude(jd, latDeg, lonDeg);
    if (prev < -0.833 && alt >= -0.833) {
      let lo = jdStart + (i - 1) * step;
      let hi = jd;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        if (solarAltitude(mid, latDeg, lonDeg) < -0.833) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return (lo + hi) / 2;
    }
    prev = alt;
  }

  return null;
}

function previousSunrise(jdBirth: number, latDeg: number, lonDeg: number): number | null {
  for (let dayBack = 0; dayBack <= 2; dayBack++) {
    const windowStart = jdBirth - (dayBack + 1);
    const sunrise = findSunrise(windowStart, latDeg, lonDeg);
    if (sunrise !== null && sunrise <= jdBirth) {
      return sunrise;
    }
  }

  return null;
}

// ─── Sun ──────────────────────────────────────────────────────────────────────

/** Tropical longitude of the Sun (Meeus Ch.25 low-precision, ±0.01°) */
function sunTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const Mrad = toRad(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  const Omega = toRad(125.04 - 1934.136 * T);
  return norm360(L0 + C - 0.00569 - 0.00478 * Math.sin(Omega));
}

// ─── Moon ─────────────────────────────────────────────────────────────────────

/** Tropical longitude of the Moon (ELP-2000 truncated, 10 terms, ±0.3°) */
function moonTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T
           + T * T * T / 538841 - T * T * T * T / 65194000;
  const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T
           + T * T * T / 545868 - T * T * T * T / 113065000;
  const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T
           + T * T * T / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T
           + T * T * T / 69699 - T * T * T * T / 14712000;
  const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T
           - T * T * T / 3526000 + T * T * T * T / 863310000;

  const sumL =
    6288774 * sin(Mp)
  + 1274027 * sin(2 * D - Mp)
  +  658314 * sin(2 * D)
  +  213618 * sin(2 * Mp)
  -  185116 * sin(M)
  -  114332 * sin(2 * F)
  +   58793 * sin(2 * D - 2 * Mp)
  +   57066 * sin(2 * D - M - Mp)
  +   53322 * sin(2 * D + Mp)
  +   45758 * sin(2 * D - M)
  +   41696 * sin(Mp - M)
  +   30959 * sin(2 * D + M)
  +   15327 * sin(2 * F - 2 * D)
  -   12528 * sin(Mp + 2 * F)
  +   10980 * sin(Mp - 2 * F);

  return norm360(Lp + sumL / 1000000);
}

// ─── Rahu (Moon's Ascending Node) ─────────────────────────────────────────────

function rahuTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Omega = 125.0445479
    - 1934.1362608 * T
    + 0.0020754 * T * T
    + T * T * T / 467441
    - T * T * T * T / 60616000;
  return norm360(Omega);
}

// ─── Heliocentric → Geocentric planets ───────────────────────────────────────

interface OrbElements { a: number; e: number; I: number; L: number; lp: number; ln: number; }

function elementsAt(base: OrbElements, rate: OrbElements, T: number): OrbElements {
  return {
    a:  base.a  + rate.a  * T,
    e:  base.e  + rate.e  * T,
    I:  base.I  + rate.I  * T,
    L:  base.L  + rate.L  * T,
    lp: base.lp + rate.lp * T,
    ln: base.ln + rate.ln * T,
  };
}

/** Returns heliocentric ecliptic rectangular coordinates [x, y, z] in AU */
function keplerToRect(el: OrbElements): [number, number, number] {
  const { a, e, I, L, lp, ln } = el;
  const M = norm360(L - lp);
  const Edeg = solveKepler(M, e);
  const Erad = toRad(Edeg);
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(Erad / 2),
    Math.sqrt(1 - e) * Math.cos(Erad / 2)
  );
  const r = a * (1 - e * Math.cos(Erad));
  const omega = toRad(norm360(lp - ln)); // argument of perihelion
  const u = nu + omega;                  // argument of latitude
  const Irad = toRad(I);
  const lnrad = toRad(ln);
  const x = r * (Math.cos(lnrad) * Math.cos(u) - Math.sin(lnrad) * Math.sin(u) * Math.cos(Irad));
  const y = r * (Math.sin(lnrad) * Math.cos(u) + Math.cos(lnrad) * Math.sin(u) * Math.cos(Irad));
  const z = r * Math.sin(u) * Math.sin(Irad);
  return [x, y, z];
}

// JPL simplified Keplerian elements (Table 1, J2000 epoch + rate per Julian century)
// Source: ssd.jpl.nasa.gov/planets/approx_pos.html (Table 1, 1800–2050)
const EARTH_BASE: OrbElements = { a:1.00000261, e:0.01671123, I:-0.00001531, L:100.46457166, lp:102.93768193, ln:0.0 };
const EARTH_RATE: OrbElements = { a:0.00000562, e:-0.00004392, I:-0.01294668, L:35999.37244981, lp:0.32327364, ln:0.0 };

const PLANET_ELEMENTS: Record<string, [OrbElements, OrbElements]> = {
  Mercury: [
    { a:0.38709927, e:0.20563593, I:7.00497902,  L:252.25032350, lp:77.45779628,  ln:48.33076593 },
    { a:0.00000037, e:0.00001906, I:-0.00594749, L:149472.67411175, lp:0.16047689, ln:-0.12534081 },
  ],
  Venus: [
    { a:0.72333566, e:0.00677672, I:3.39467605,  L:181.97909950, lp:131.60246718, ln:76.67984255 },
    { a:0.00000390, e:-0.00004107, I:-0.00078890, L:58517.81538729, lp:0.00268329, ln:-0.27769418 },
  ],
  Mars: [
    { a:1.52371034, e:0.09339410, I:1.84969142,  L:-4.55343205, lp:-23.94362959, ln:49.55953891 },
    { a:0.00001847, e:0.00007882, I:-0.00813131, L:19140.30268499, lp:0.44441088, ln:-0.29257343 },
  ],
  Jupiter: [
    { a:5.20288700, e:0.04838624, I:1.30439695,  L:34.39644051, lp:14.72847983, ln:100.47390909 },
    { a:-0.00011607, e:-0.00013253, I:-0.00183714, L:3034.74612775, lp:0.21252668, ln:0.20469106 },
  ],
  Saturn: [
    { a:9.53667594, e:0.05386179, I:2.48599187,  L:49.95424423, lp:92.59887831, ln:113.66242448 },
    { a:-0.00125060, e:-0.00050991, I:0.00193609, L:1222.49362201, lp:-0.41897216, ln:-0.28867794 },
  ],
};

/** Tropical geocentric longitude for a planet using heliocentric Keplerian elements */
function planetTropical(name: string, jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const earthEl = elementsAt(EARTH_BASE, EARTH_RATE, T);
  const [base, rate] = PLANET_ELEMENTS[name];
  const planetEl = elementsAt(base, rate, T);
  const [xe, ye] = keplerToRect(earthEl);
  const [xp, yp] = keplerToRect(planetEl);
  return norm360(toDeg(Math.atan2(yp - ye, xp - xe)));
}

// ─── Retrograde detection ─────────────────────────────────────────────────────

function isRetrograde(fn: (jd: number) => number, jd: number): boolean {
  const l1 = fn(jd - 0.5);
  const l2 = fn(jd + 0.5);
  let diff = l2 - l1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// ─── Lagna (Ascendant) ────────────────────────────────────────────────────────

/** Sidereal ascendant using GMST → LST → tropical ascendant → subtract ayanamsa */
function computeLagna(jd: number, lat: number, lon: number): number {
  const T = (jd - 2451545.0) / 36525;
  const gmst = norm360(
    280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - T * T * T / 38710000
  );
  const lst = norm360(gmst + lon);
  const e = toRad(23.439291111 - 0.013004167 * T);
  const ramcRad = toRad(lst);
  const latRad = toRad(lat);

  // Standard ascendant formula
  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e);
  let asc = toDeg(Math.atan2(y, x));
  if (asc < 0) asc += 360;

  // Quadrant correction: ascendant should be in the same quadrant as RAMC
  const q = Math.floor(lst / 90) * 90;
  if (Math.abs(norm360(asc) - q) > 90) asc = norm360(asc + 180);

  // The raw formula above yields the opposite horizon point in this coordinate setup.
  // Shift by 180° to get the true eastern ascendant before applying ayanamsa.
  return norm360(asc + 180 - lahiriAyanamsa(jd));
}

// ─── Rasi helpers ─────────────────────────────────────────────────────────────

const RASI_NAMES = [
  'Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya',
  'Tula','Vrishchika','Dhanus','Makara','Kumbha','Meena',
];

function lonToPosition(lon: number): { rasi: number; degree: number; minute: number } {
  const rasi = Math.floor(lon / 30);
  const rem = lon - rasi * 30;
  const degree = Math.floor(rem);
  const minute = Math.floor((rem - degree) * 60);
  return { rasi, degree, minute };
}

export function longitudeToLagnaData(lon: number): LagnaData {
  const normalized = norm360(lon);
  const pos = lonToPosition(normalized);
  return {
    rasi: RASI_NAMES[pos.rasi],
    degree: pos.degree,
    minute: pos.minute,
    totalDeg: normalized,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export const RASI_NAMES_LIST = RASI_NAMES;

/**
 * Calculate all 10 positions (9 planets + Lagna) for a birth chart.
 * @param year  Birth year
 * @param month Birth month (1–12)
 * @param day   Birth day (1–31)
 * @param utHour Decimal UTC hours (0–24, can be negative or >24 — will be normalised via JD)
 * @param lat   Geographic latitude in degrees (N positive)
 * @param lon   Geographic longitude in degrees (E positive)
 */
export function calculateChart(
  year: number, month: number, day: number,
  utHour: number, lat: number, lon: number
): PlanetPosition[] {
  // Handle day rollover from utHour outside 0–24
  let y = year, mo = month, d = day, h = utHour;
  while (h < 0)  { d--;  h += 24; }
  while (h >= 24){ d++;  h -= 24; }
  // Normalise d within month (simple approach via JD)
  const jd = julianDay(y, mo, d, h);
  const ayan = lahiriAyanamsa(jd);

  // Compute tropical longitudes
  const tropicals: Record<string, number> = {
    Sun:     sunTropical(jd),
    Moon:    moonTropical(jd),
    Mars:    planetTropical('Mars', jd),
    Mercury: planetTropical('Mercury', jd),
    Jupiter: planetTropical('Jupiter', jd),
    Venus:   planetTropical('Venus', jd),
    Saturn:  planetTropical('Saturn', jd),
    Rahu:    rahuTropical(jd),
  };
  tropicals.Ketu = norm360(tropicals.Rahu + 180);

  const lagnaLon = computeLagna(jd, lat, lon);

  // Sidereal longitudes
  const sidereal: Record<string, number> = {};
  for (const [name, trop] of Object.entries(tropicals)) {
    sidereal[name] = norm360(trop - ayan);
  }
  sidereal.Lagna = lagnaLon;

  const lagnaRasi = Math.floor(lagnaLon / 30);

  const GLYPHS: Record<string, string> = {
    Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃',
    Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋', Lagna:'Lg',
  };

  // Retrograde flags (Sun/Moon/Lagna never retro; Rahu/Ketu always retro)
  const retro: Record<string, boolean> = {
    Sun: false, Moon: false, Lagna: false,
    Rahu: true, Ketu: true,
    Mars:    isRetrograde((j) => norm360(planetTropical('Mars', j) - lahiriAyanamsa(j)), jd),
    Mercury: isRetrograde((j) => norm360(planetTropical('Mercury', j) - lahiriAyanamsa(j)), jd),
    Jupiter: isRetrograde((j) => norm360(planetTropical('Jupiter', j) - lahiriAyanamsa(j)), jd),
    Venus:   isRetrograde((j) => norm360(planetTropical('Venus', j) - lahiriAyanamsa(j)), jd),
    Saturn:  isRetrograde((j) => norm360(planetTropical('Saturn', j) - lahiriAyanamsa(j)), jd),
  };

  const ORDER = ['Lagna','Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

  return ORDER.map(name => {
    const lon2 = sidereal[name];
    const pos = lonToPosition(lon2);
    const house = ((pos.rasi - lagnaRasi + 12) % 12) + 1;
    return {
      planet: name,
      glyph: GLYPHS[name] ?? name,
      longitude: lon2,
      rasi: pos.rasi,
      degree: pos.degree,
      minute: pos.minute,
      isRetrograde: retro[name] ?? false,
      house,
    };
  });
}

export function calculateUnifiedChart(
  year: number,
  month: number,
  day: number,
  utHour: number,
  lat: number,
  lon: number
): UnifiedChartCalculation {
  let h = utHour;
  let d = day;
  while (h < 0) {
    d -= 1;
    h += 24;
  }
  while (h >= 24) {
    d += 1;
    h -= 24;
  }

  const birthJulianDay = julianDay(year, month, d, h);
  const planets = calculateChart(year, month, day, utHour, lat, lon);
  const lagna = planets.find((planet) => planet.planet === 'Lagna');

  if (!lagna) {
    throw new Error('Chart calculation did not return a Lagna position.');
  }

  const udaya = longitudeToLagnaData(lagna.longitude);
  const sunriseJulianDay = previousSunrise(birthJulianDay, lat, lon);

  if (sunriseJulianDay === null) {
    return {
      planets,
      udaya,
      hora: udaya,
      ghati: udaya,
      birthJulianDay,
      sunriseJulianDay,
      elapsedHours: 0,
      note: 'Hora/Ghati could not be computed (sunrise not found)',
    };
  }

  const lagnaAtSunrise = computeLagna(sunriseJulianDay, lat, lon);
  const elapsedHours = (birthJulianDay - sunriseJulianDay) * 24;
  const elapsedGhatis = elapsedHours * 2.5;
  const hora = longitudeToLagnaData(lagnaAtSunrise + elapsedHours * 30);
  const ghati = longitudeToLagnaData(lagnaAtSunrise + elapsedGhatis * 30);

  return {
    planets,
    udaya,
    hora,
    ghati,
    birthJulianDay,
    sunriseJulianDay,
    elapsedHours,
  };
}
