import { test, expect } from '@playwright/test';
import { calculateTurnoverTax } from '../helpers/helpers';

// Example from the spec
test('turnover tax: EE, 19.99', async ({ request }) => {
  const response = await calculateTurnoverTax(request, 'EE', 19.99);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ net: 19.99, tax: 4.8, gross: 24.79, rate: 24 });
});

// Example of parametrization: same test, different data
const cases = [
  { country: 'EE', amount: 100, tax: 24, gross: 124, rate: 24 },
  { country: 'LV', amount: 19.99, tax: 4.2, gross: 24.19, rate: 21 },
  { country: 'FI', amount: 10, tax: 2.55, gross: 12.55, rate: 25.5 },
  { country: 'SE', amount: 200, tax: 50, gross: 250, rate: 25 },
];

for (const { country, amount, tax, gross, rate } of cases) {
  test(`turnover tax: ${country}, ${amount}`, async ({ request }) => {
    const response = await calculateTurnoverTax(request, country, amount);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ net: amount, tax, gross, rate });
  });
}

// TODO (students): all 5 countries, rounding half-up to cents
test.fixme('turnover tax: rates and rounding', async () => {});

// TODO (students): 400 for unknown country, amount 0 / -5 / 1000000.01 / 10.123 / "abc"
test.fixme('turnover tax: invalid params return 400', async () => {});
