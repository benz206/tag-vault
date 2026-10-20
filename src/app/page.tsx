import Link from 'next/link';
import {
  findDiscoverTags,
  findTagSummaries,
  getStatistics
} from '@tag-vault/db';
import DiscoverTabs from '@/components/DiscoverTabs';
import HeroActions from '@/components/HeroActions';
import StatStrip from '@/components/StatStrip';
import TagScriptCode from '@/components/TagScriptCode';
import TimeAgo from '@/components/TimeAgo';
import { withOwners } from '@/lib/owners';
import { getTagColor } from '@/utils';

export const revalidate = 300;

const featuredTagIds = [1157946, 1111722, 1217391, 825576, 962280, 865606];

const heroTag = {
  id: 1157946,
  name: 'buildembed',
  color: getTagColor(1157946, Number('149926720114262016')),
  snippet: `{=(COMMENT):User Settings}
{=(prefix):!}
{=(tagName):buildembed|be}
{=(defaultColor):2f3136}
{=(example):{prefix}{tagName} title:My title|desc:My description}`
};

export default async function Home() {
  const [stats, featured, discover] = await Promise.all([
    getStatistics(),
    findTagSummaries(featuredTagIds),
    findDiscoverTags()
  ]);
  const listed = await withOwners([
    ...featured,
    ...discover.popular,
    ...discover.newest
  ]);
  const popularStart = featured.length;
  const newestStart = popularStart + discover.popular.length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-12 pt-16 pb-14 motion-safe:animate-rise lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <h1 className="text-5xl leading-[1.05] tracking-[-0.03em] text-balance sm:text-[64px]">
            TagScript tags, ready to copy.
          </h1>
          <p className="mt-5 max-w-lg text-xl leading-snug text-pretty text-muted">
            Browse thousands of Carl-bot tags shared across Discord servers,
            then use them in your own.
          </p>
          <HeroActions />
          <div className="mt-10">
            <StatStrip
              stats={[
                {
                  label: 'Tags archived',
                  value: stats.all_tag_count.toLocaleString()
                },
                {
                  label: 'Shared publicly',
                  value: stats.public_tag_count.toLocaleString()
                },
                {
                  label: 'Last updated',
                  value: stats.latest_last_fetched ? (
                    <TimeAgo date={stats.latest_last_fetched} />
                  ) : (
                    'Never'
                  )
                }
              ]}
            />
          </div>
        </div>
        <Link
          href={`/tags/${heroTag.id}`}
          className="relative block min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition hover:shadow-md"
        >
          <span
            className={`absolute inset-x-0 top-0 h-[3px] bg-${heroTag.color}`}
            aria-hidden="true"
          />
          <div className="flex h-12 items-center border-b border-line px-5">
            <span className="font-mono text-sm">{heroTag.name}</span>
            <span className="ml-auto text-sm text-muted">Open tag</span>
          </div>
          <pre className="bg-subtle px-5 py-4 font-mono text-[13px] leading-6 break-words whitespace-pre-wrap text-ink-2">
            <TagScriptCode source={heroTag.snippet} />
          </pre>
        </Link>
      </section>
      <section className="pt-10 pb-20">
        <h2 className="mb-6 text-[28px] leading-8 tracking-tight">
          Discover tags.{' '}
          <span className="text-faint">
            Hand-picked, most used, and newest.
          </span>
        </h2>
        <DiscoverTabs
          tabs={[
            {
              key: 'featured',
              label: 'Featured',
              tags: listed.slice(0, popularStart)
            },
            {
              key: 'popular',
              label: 'Most used',
              tags: listed.slice(popularStart, newestStart)
            },
            { key: 'newest', label: 'Newest', tags: listed.slice(newestStart) }
          ]}
        />
      </section>
    </div>
  );
}
