import { test, expect } from '@playwright/test';
import {calculateShipping, calculateShippingExpress} from '../helpers/helpers';

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
  { country: 'EE', weightKg: 5, express: true, cost: 7.5, days: 1 },
  { country: 'LV', weightKg: 5.01, express: true, cost: 27, days: 2 },
  { country: 'US', weightKg: 4.99, express: true, cost: 30, days: 4 }
  // TODO (students): add more cases: US, 20 kg, express=true (cost 52.5, days 4) and other zones
];

for (const { country, weightKg, express, cost, days } of cases) {
  test(`shipping: ${country}, ${weightKg} kg, express=${express}`, async ({ request }) => {
    const response = await calculateShippingExpress(request, country, weightKg, express);

    console.log(await response.json())

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ cost, currency: 'EUR', days });
  });
}

const shipping_cases = [

  { country: 'EE', weightKg: 1, cost: 3, days: 2 },
  { country: 'LV', weightKg: 5,  cost: 10, days: 5 },
  { country: 'LT', weightKg: 1.01, cost: 10, days: 5 },
  { country: 'FI', weightKg: 5.01, cost: 18, days: 5 },
  { country: 'US', weightKg: 20, cost: 35, days: 10 },

]

// TODO (students): parametrize over zones (EE / EU / rest of world) and weight boundaries 1, 1.01, 5, 5.01, 20
// Use calculateShipping (without express)

for(const {country, weightKg, cost, days} of shipping_cases) {

  test(`shipping: ${country}, ${weightKg} kg,`, async ({request}) => {

    const response = await calculateShipping(request, country, weightKg)

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ cost, currency: 'EUR', days });

  });

}

// TODO (students): express = true, cost x 1.5 rounded to cents, fewer days
// Use calculateShippingExpress
//test.fixme('shipping: express surcharge and days', async () => {});

const bad_request_cases = [

  { country: 'ee', weightKg: 1, express: false, cost: 3, days: 2 },
  { country: 'CA', weightKg: 1, express: false, cost: 3, days: 2 },
  { country: 'XX', weightKg: 1, express: false, cost: 3, days: 2 },
  { country: 'EE', weightKg: 0, express: false, cost: 3, days: 2 },
  { country: 'EE', weightKg: -1, express: false, cost: 3, days: 2 },
  { country: 'EE', weightKg: 20.01, express: false, cost: 3, days: 2 },
  { country: 'EE', weightKg: "abc", express: false, cost: 3, days: 2 },
  { country: 'EE', weightKg: 0, express: "yes", cost: 3, days: 2 },

]

// TODO (students): 400 for country "ee" / "XX", weightKg 0 / -1 / 20.01 / "abc", express "yes"
// Use calculateShipping for country and weightKg, calculateShippingExpress for express
for(const {country, weightKg, cost, days, express} of bad_request_cases) {

  test(`shipping: ${country}, ${weightKg} kg, express=${express}`, async ({request}) => {

    const response = await calculateShippingExpress(request, country, weightKg, express);

    expect(response.status()).toBe(400);

  });

}

// TODO (students): GET on an unknown URL returns 404
test('shipping: unknown URL returns 404', async ({request}) => {

  const response = await request.get('/api/shipping/calculate/express')

  expect(response.status()).toBe(404);

});

// TODO (students): POST on a GET endpoint returns 405
test('shipping: unsupported method returns 405', async ({request}) => {

  const response = await request.post('/api/shipping/calculate')

  expect(response.status()).toBe(405);

});
