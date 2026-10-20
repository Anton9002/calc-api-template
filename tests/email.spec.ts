import { test, expect } from '@playwright/test';
import { checkEmail } from '../helpers/helpers';

// Example of parametrization: same test, different data
const cases = [
  { email: 'anna@example.ee', valid: true, reason: null },
  { email: 'user+tag@example.ee', valid: true, reason: null },
  { email: 'annaexample.ee', valid: false, reason: 'INVALID_AT' },
  { email: '.anna@example.ee', valid: false, reason: 'INVALID_LOCAL' },
  { email: 'anna@example', valid: false, reason: 'INVALID_DOMAIN' },
];

for (const { email, valid, reason } of cases) {
  test(`email: "${email}" valid=${valid}`, async ({ request }) => {
    const response = await checkEmail(request, email);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ email, valid, reason });
  });
}

// TODO (students): local part boundaries, 64 characters is valid, 65 is INVALID_LOCAL
test.fixme('email: local part length boundaries', async () => {});

// TODO (students): TOO_LONG for an address over 254 characters
test.fixme('email: too long address', async () => {});

// TODO (students): rules order, e.g. "a%20b@@c" is INVALID_AT, "a%20b@c" is INVALID_LOCAL
test.fixme('email: only the first failed rule is reported', async () => {});

// TODO (students): 400 for empty email and for missing email parameter
test.fixme('email: invalid request returns 400', async () => {});

// TODO (students): POST on /api/email/check returns 405
test.fixme('email: unsupported method returns 405', async () => {});
