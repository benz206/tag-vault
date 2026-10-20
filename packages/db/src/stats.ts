import type { OwnerStats, TagSummary } from './types';

export function summarizeOwnerTags(tags: TagSummary[]): OwnerStats {
  const shared = tags.filter((tag) => tag.shared).length;
  return {
    tags: {
      public: shared,
      private: tags.length - shared,
      nsfw: tags.filter((tag) => tag.nsfw).length,
      total: tags.length
    },
    uses: tags.reduce((sum, tag) => sum + tag.uses, 0)
  };
}
