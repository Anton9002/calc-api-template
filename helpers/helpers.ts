import { APIRequestContext } from '@playwright/test';

export function calculateShipping(
  request: APIRequestContext,
  country: string,
  weightKg: string | number,
) {
  return request.get('/api/shipping/calculate', { params: { country, weightKg } });
}

export function calculateShippingExpress(
  request: APIRequestContext,
  country: string,
  weightKg: string | number,
  express: string | boolean,
) {
  return request.get('/api/shipping/calculate', { params: { country, weightKg, express } });
}

export function getTicketPrice(
  request: APIRequestContext,
  age: string | number,
  day: string,
) {
  return request.get('/api/tickets/price', { params: { age, day } });
}

export function calculateTurnoverTax(
  request: APIRequestContext,
  country: string,
  amount: string | number,
) {
  return request.get('/api/turnover-tax/calculate', { params: { country, amount } });
}

export function checkPassword(request: APIRequestContext, password: string) {
  return request.post('/api/password/check', { data: { password } });
}

export function checkEmail(request: APIRequestContext, email: string) {
  return request.get('/api/email/check', { params: { email } });
}
