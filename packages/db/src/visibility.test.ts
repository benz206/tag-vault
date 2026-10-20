import { describe, expect, test } from 'bun:test';
import { canView, visibleTagFilter } from './visibility';

const tag = {
  owner_id: 'owner',
  deleted: false,
  nsfw: false,
  hidden: false,
  safe: 'safe'
};

describe('canView', () => {
  test('public tags are visible to everyone', () => {
    expect(canView(tag)).toBe(true);
    expect(canView(tag, 'someone')).toBe(true);
  });

  test.each(['deleted', 'nsfw', 'hidden'] as const)(
    '%s tags are visible only to their owner',
    (flag) => {
      const flagged = { ...tag, [flag]: true };
      expect(canView(flagged)).toBe(false);
      expect(canView(flagged, 'someone')).toBe(false);
      expect(canView(flagged, 'owner')).toBe(true);
    }
  );

  test('not_safe tags are visible to nobody', () => {
    const unsafe = { ...tag, safe: 'not_safe' };
    expect(canView(unsafe)).toBe(false);
    expect(canView(unsafe, 'owner')).toBe(false);
  });

  test.each(['unrated', ''])('%p safety rating is public', (safe) => {
    expect(canView({ ...tag, safe })).toBe(true);
  });
});

describe('visibleTagFilter', () => {
  const excluded = { removed: [1], hidden: [2] };

  test('anonymous viewers exclude removed and hidden tags', () => {
    expect(visibleTagFilter(excluded)).toMatchObject({
      safe: { $ne: 'not_safe' },
      deleted: { $ne: true },
      nsfw: { $ne: true },
      id: { $nin: [1, 2] }
    });
  });

  test('signed-in viewers also see their own hidden, deleted and nsfw tags', () => {
    const filter = visibleTagFilter(excluded, 'owner');
    expect(filter).toMatchObject({
      safe: { $ne: 'not_safe' },
      id: { $nin: [1] },
      $or: [
        { owner_id: 'owner' },
        { deleted: { $ne: true }, nsfw: { $ne: true }, id: { $nin: [2] } }
      ]
    });
    expect(filter).not.toHaveProperty('deleted');
  });
});
