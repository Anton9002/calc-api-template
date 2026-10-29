import { test, expect } from '@playwright/test';
import { checkEmail } from '../helpers/helpers';

// Example of parametrization: same test, different data
const cases = [
  { email: 'anna@example.ee', valid: true, reason: null },
  { email: 'annaexample.ee', valid: false, reason: 'INVALID_AT' },
  { email: '@gmail.com', valid: false, reason: 'INVALID_LOCAL' },
  { email: 'an..na@example.ee', valid: false, reason: 'INVALID_LOCAL' },
  { email: 'user@gmail', valid: false, reason: 'INVALID_DOMAIN' },
  { email: `user` + `a`.repeat(255) + `mail.com`, valid: false, reason: `TOO_LONG`}
  // TODO (students): add more cases: user+tag@example.ee (valid), .anna@example.ee (INVALID_LOCAL), anna@example (INVALID_DOMAIN)
];

for (const { email, valid, reason } of cases) {
  test(`email: "${email}" valid=${valid}`, async ({ request }) => {
    const response = await checkEmail(request, email);

    console.log(response.status());

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ email, valid, reason });
  });
}

// TODO (students): TOO_LONG for an address over 254 characters
//test.fixme('email: too long address', async () => {});

const MISSING_EMAIL = [

  {email: "", valid: false, reason: "EMPTY_EMAIL"},
  {valid: false, reason: "MISSING_EMAIL"},

]

// TODO (students): 400 for empty email and for missing email parameter
for(const item of MISSING_EMAIL) {

  test(`email: invalid request returns 400 reason: ${item.reason}`, async ({request}) => {

    const response = await checkEmail(request, item.email as any);

    expect(response.status()).toBe(400);

  });
}


// TODO (students): POST on /api/email/check returns 405
test('email: unsupported method returns 405', async ({request}) => {

  const response = await request.post("/api/email/check", {

    data: {email: "someUser@mail.com"}

  })

  expect(response.status()).toBe(405);

});
