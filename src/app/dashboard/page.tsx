import type { Metadata } from 'next';
import {
  findFavoriteTags,
  findOwnerTags,
  summarizeOwnerTags
} from '@tag-vault/db';
import SignInRequired from '@/components/SignInRequired';
import StatStrip from '@/components/StatStrip';
import TagTabs from '@/components/TagTabs';
import { getSession } from '@/lib/auth';
import { withOwners } from '@/lib/owners';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return <SignInRequired callbackUrl="/dashboard" />;

  const userId = session.user.id;
  const [tags, favorites] = await Promise.all([
    findOwnerTags(userId).then(withOwners),
    findFavoriteTags(userId).then(withOwners)
  ]);
  const stats = summarizeOwnerTags(tags);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 lg:pt-20">
      <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">Dashboard</h1>
      <p className="mt-3 text-xl text-muted">
        Your tags, including private and hidden ones, and the tags you
        favorited.
      </p>
      <div className="mt-8">
        <StatStrip
          stats={[
            { label: 'Tags', value: stats.tags.total.toLocaleString() },
            { label: 'Shared', value: stats.tags.public.toLocaleString() },
            { label: 'Private', value: stats.tags.private.toLocaleString() },
            { label: 'NSFW', value: stats.tags.nsfw.toLocaleString() },
            { label: 'Total uses', value: stats.uses.toLocaleString() },
            { label: 'Favorites', value: favorites.length.toLocaleString() }
          ]}
        />
      </div>
      <section className="mt-12">
        <TagTabs
          tabs={[
            {
              key: 'mine',
              label: 'Your tags',
              tags,
              emptyMessage:
                "You don't own any tags yet. Tags you create with Carl-bot will show up here."
            },
            {
              key: 'favorites',
              label: 'Favorites',
              tags: favorites,
              emptyMessage:
                'No favorites yet. Use the Favorite button on any tag page to save it here.'
            }
          ]}
        />
      </section>
    </div>
  );
}
