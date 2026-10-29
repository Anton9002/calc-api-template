import {test, expect} from '@playwright/test';
import { checkPassword } from '../helpers/helpers';

// Example from the spec
test('password: "abc" is invalid', async ({ request }) => {
  const response = await checkPassword(request, 'abc');

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({
    valid: false,
    errors: ['TOO_SHORT', 'NO_UPPERCASE', 'NO_DIGIT', 'NO_SPECIAL'],
  });
});

// Example of parametrization: same test, different data
const cases = [
  { password: 'Abcdef1!', valid: true, errors: [] },
  { password: 'ABCDEFG1!', valid: false, errors: ['NO_LOWERCASE'] },
  { password: 'abcdef', valid: false, errors: ["TOO_SHORT", "NO_UPPERCASE", "NO_DIGIT", "NO_SPECIAL"] }
  // TODO (students): add more cases: NO_DIGIT, HAS_SPACE and other rules
];

for (const { password, valid, errors } of cases) {
  test(`password: "${password}" valid=${valid}`, async ({ request }) => {
    const response = await checkPassword(request, password);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ valid, errors });
  });
}

const INVALID_PASSWORD = [

  {password: "Abc!1".repeat(13), valid: false, errors: ["TOO_LONG"]},
  {password: "passWord1", valid: false, errors: ["NO_SPECIAL"]},

]

// TODO (students): one case per error code, e.g. TOO_LONG with 65 characters, NO_SPECIAL, NO_UPPERCASE
for(const item of INVALID_PASSWORD) {

  test(`password: ${item.password} valid = ${item.valid} error = ${item.errors}`, async ({request}) => {

    const response = await checkPassword(request, item.password);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({valid: item.valid, errors: item.errors});

  });

}

const INVALID_BODY = [

  {password: "", valid: false, error: "password must be a non-empty string"},
  {password: 12345, valid: false, error: "password must be a non-empty string"},
  {valid: false, error: "password must be a non-empty string"},
  {password: null, valid: false, error: "password must be a non-empty string"},

]

// TODO (students): 400 for empty password, non-string password, missing password, invalid JSON
for(const item of INVALID_BODY) {

  test(`password: ${item.password} returns 400`, async ({request}) => {

    const response = await checkPassword(request, item.password as any);

    console.log(await response.json());

    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({error: item.error});

  });

}

// TODO (students): GET on /api/password/check returns 405
test('password: unsupported method returns 405', async ({request}) => {

  const response = await request.get("/api/password/check", {

    data: "Abcdef1!"

  })

  expect(response.status()).toBe(405)

});

// TODO (students): body larger than 10 000 bytes returns 413
test('password: too large body returns 413', async ({request}) => {

  const response = await checkPassword(request,"Abcdef1!".repeat(1250))

  expect(response.status()).toBe(413)

});
