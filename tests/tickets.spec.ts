import { test, expect } from '@playwright/test';
import { getTicketPrice } from '../helpers/helpers';

// Example from the spec
test('tickets: age 17, SAT is CHILD for 7', async ({ request }) => {
  const response = await getTicketPrice(request, 17, 'SAT');

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ category: 'CHILD', price: 7 });
});

// Example of parametrization: same test, different data
const cases = [
  { age: 6, day: 'MON', category: 'FREE', price: 0 },
  { age: 7, day: 'FRI', category: 'CHILD', price: 5 },
  // TODO (students): add more cases: ADULT (age 30, SUN, 12), SENIOR (age 65, WED, 7)
];

for (const { age, day, category, price } of cases) {
  test(`tickets: age ${age}, ${day} is ${category} for ${price}`, async ({ request }) => {
    const response = await getTicketPrice(request, age, day);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ category, price });
  });
}

// TODO (students): age boundaries 0, 6, 7, 17, 18, 64, 65, 120
test.fixme('tickets: category by age boundaries', async () => {});

// TODO (students): 400 for age -1 / 121 / 1.5 / "abc", day "mon" / "XXX", missing params
test.fixme('tickets: invalid params return 400', async () => {});
