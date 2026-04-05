import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateUnifiedChart, RASI_NAMES_LIST } from '../../lib/chartEngine';
import { POST } from '../../app/api/calculate/route';

function shortestAngularDistance(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;
  return raw > 180 ? 360 - raw : raw;
}

test('unified chart keeps Lagna card consistent with Lagna planet and house', () => {
  const result = calculateUnifiedChart(1992, 3, 11, 6 + 17 / 60 - 8, 3.139, 101.6869);
  const lagnaPlanet = result.planets.find((planet) => planet.planet === 'Lagna');

  assert.ok(lagnaPlanet, 'Lagna planet must exist in planetary array');
  assert.equal(lagnaPlanet!.house, 1, 'Lagna planet must always map to house 1 in whole-sign system');

  const lagnaSign = RASI_NAMES_LIST[lagnaPlanet!.rasi];
  assert.equal(result.udaya.rasi, lagnaSign, 'Udaya Lagna sign must match Lagna planet sign');
  assert.equal(result.udaya.degree, lagnaPlanet!.degree, 'Udaya Lagna degree must match Lagna planet degree');
  assert.equal(result.udaya.minute, lagnaPlanet!.minute, 'Udaya Lagna minute must match Lagna planet minute');

  const rahu = result.planets.find((planet) => planet.planet === 'Rahu');
  const ketu = result.planets.find((planet) => planet.planet === 'Ketu');
  assert.ok(rahu && ketu, 'Rahu and Ketu must both be present');
  assert.equal(shortestAngularDistance(rahu!.longitude, ketu!.longitude), 180, 'Rahu and Ketu must remain exactly opposite');
});

test('API response remains aligned with chart Lagna for direct coordinate input', async () => {
  const request = new Request('http://localhost/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: '1992-03-11',
      time: '06:17',
      tzOffset: 480,
      lat: 3.139,
      lon: 101.6869,
      label: 'Kuala Lumpur, Malaysia',
    }),
  });

  const response = await POST(request as any);
  assert.equal(response.status, 200, 'API call should succeed for valid direct coordinate payload');

  const payload = await response.json();
  const lagnaPlanet = (payload.planets as Array<{ planet: string; rasi: number; degree: number; minute: number; house: number }>).find((planet) => planet.planet === 'Lagna');
  assert.ok(lagnaPlanet, 'API payload must include Lagna planet');
  assert.equal(lagnaPlanet!.house, 1, 'API Lagna planet should be in house 1');
  assert.equal(payload.udaya.rasi, RASI_NAMES_LIST[lagnaPlanet!.rasi], 'API Udaya Lagna sign should match Lagna planet sign');
  assert.equal(payload.udaya.degree, lagnaPlanet!.degree, 'API Udaya Lagna degree should match Lagna planet degree');
  assert.equal(payload.udaya.minute, lagnaPlanet!.minute, 'API Udaya Lagna minute should match Lagna planet minute');
});
