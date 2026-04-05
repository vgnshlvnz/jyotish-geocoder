import { test, expect } from '@playwright/test';

test('full unified flow renders Lagna and both charts from one submit', async ({ page }) => {
  await page.route('**/api/geocode', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          display_name: 'Kuala Lumpur, Malaysia',
          lat: '3.1390',
          lon: '101.6869',
        },
      ]),
    });
  });

  await page.goto('/');

  await page.getByLabel('Birth Date').fill('1992-03-11');
  await page.getByLabel('Birth Time (Local)').fill('06:17');

  const placeInput = page.getByPlaceholder('Kuala Lumpur, Malaysia');
  await placeInput.fill('Kuala Lumpur');
  await page.getByRole('button', { name: /Kuala Lumpur, Malaysia/i }).click();

  await page.getByRole('button', { name: 'Calculate Kundli' }).click();

  await expect(page.getByText('Udaya Lagna')).toBeVisible();
  await expect(page.getByText('South Indian Rasi')).toBeVisible();
  await expect(page.getByText('North Indian Rasi')).toBeVisible();
  await expect(page.getByText('Planetary Placement Summary')).toBeVisible();

  await page.getByRole('button', { name: 'South Indian' }).click();
  await expect(page.getByText('South Indian Rasi')).toBeVisible();

  await page.getByRole('button', { name: 'North Indian' }).click();
  await expect(page.getByText('North Indian Rasi')).toBeVisible();
});
