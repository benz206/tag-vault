import { expect, test } from 'bun:test';
import { formatDate } from './formatDate';

test('formatDate uses the UTC day so server and browser agree', () => {
  expect(formatDate(new Date('2024-01-05T23:30:00Z'))).toBe('Jan 5, 2024');
  expect(formatDate(new Date('2024-01-05T00:30:00Z'))).toBe('Jan 5, 2024');
});
