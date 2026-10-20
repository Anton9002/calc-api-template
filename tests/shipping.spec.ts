import { test, expect } from '@playwright/test';
import { calculateShippingExpress } from '../helpers/helpers';

// Example from the spec: plain test
test('shipping: EE, 2.5 kg, express', async ({ request }) => {
  const response = await calculateShippingExpress(request, 'EE', 2.5, true);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ cost: 7.5, currency: 'EUR', days: 1 });
});

// Example of parametrization: same test, different data
const cases = [
  { country: 'EE', weightKg: 1, express: false, cost: 3, days: 2 },
  { country: 'LV', weightKg: 5, express: false, cost: 10, days: 5 },
  { country: 'US', weightKg: 20, express: true, cost: 52.5, days: 4 },
];

for (const { country, weightKg, express, cost, days } of cases) {
  test(`shipping: ${country}, ${weightKg} kg, express=${express}`, async ({ request }) => {
    const response = await calculateShippingExpress(request, country, weightKg, express);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ cost, currency: 'EUR', days });
  });
}

// TODO (students): parametrize over zones (EE / EU / rest of world) and weight boundaries 1, 1.01, 5, 5.01, 20
test.fixme('shipping: tariffs by zone and weight boundaries', async () => {});

// TODO (students): express = true, cost x 1.5 rounded to cents, fewer days
test.fixme('shipping: express surcharge and days', async () => {});

// TODO (students): 400 for country "ee" / "XX", weightKg 0 / -1 / 20.01 / "abc", express "yes"
test.fixme('shipping: invalid params return 400', async () => {});

// TODO (students): GET on an unknown URL returns 404
test.fixme('shipping: unknown URL returns 404', async () => {});

// TODO (students): POST on a GET endpoint returns 405
test.fixme('shipping: unsupported method returns 405', async () => {});
