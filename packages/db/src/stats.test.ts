import { expect, test } from 'bun:test';
import { summarizeOwnerTags } from './stats';
import type { TagSummary } from './types';

function tag(overrides: Partial<TagSummary>): TagSummary {
  return {
    id: 1,
    created_at: '',
    tag_name: 'tag',
    nsfw: false,
    owner_id: 'owner',
    uses: 0,
    description: null,
    restricted: false,
    shared: false,
    deleted: false,
    safe: 'safe',
    hidden: false,
    ...overrides
  };
}

test('summarizeOwnerTags counts exactly the listed tags', () => {
  expect(
    summarizeOwnerTags([
      tag({ shared: true, uses: 10 }),
      tag({ shared: true, nsfw: true, uses: 5 }),
      tag({ uses: 1 })
    ])
  ).toEqual({
    tags: { public: 2, private: 1, nsfw: 1, total: 3 },
    uses: 16
  });
});

test('summarizeOwnerTags handles no tags', () => {
  expect(summarizeOwnerTags([])).toEqual({
    tags: { public: 0, private: 0, nsfw: 0, total: 0 },
    uses: 0
  });
});
