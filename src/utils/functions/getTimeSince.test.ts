import { describe, expect, test } from 'bun:test';
import { getTimeSince } from './getTimeSince';

const ago = (ms: number) => new Date(Date.now() - ms);
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

describe('getTimeSince', () => {
  test.each([
    [1000, '1 second'],
    [30_000, '30 seconds'],
    [MINUTE, '1 minute'],
    [2 * 60 * MINUTE, '2 hours'],
    [3 * DAY, '3 days'],
    [14 * DAY, '2 weeks'],
    [60 * DAY, '2 months'],
    [400 * DAY, '1 year']
  ])('%p ms ago is %p', (ms, expected) => {
    expect(getTimeSince(ago(ms))).toBe(expected);
  });
});
