import { expect, test } from 'bun:test';
import { getClientIp } from './getClientIp';

test("prefers Netlify's client IP header", () => {
  expect(
    getClientIp(
      new Headers({
        'x-nf-client-connection-ip': '1.1.1.1',
        'x-real-ip': '2.2.2.2',
        'x-forwarded-for': '3.3.3.3'
      })
    )
  ).toBe('1.1.1.1');
});

test('falls back to x-real-ip', () => {
  expect(
    getClientIp(
      new Headers({ 'x-real-ip': '2.2.2.2', 'x-forwarded-for': '3.3.3.3' })
    )
  ).toBe('2.2.2.2');
});

test('uses the first x-forwarded-for hop', () => {
  expect(
    getClientIp(new Headers({ 'x-forwarded-for': '3.3.3.3, 10.0.0.1' }))
  ).toBe('3.3.3.3');
});

test('returns unknown without any IP header', () => {
  expect(getClientIp(new Headers())).toBe('unknown');
});
