import type { Metadata } from 'next';
import { findDiscoverTags, searchTags } from '@tag-vault/db';
import DiscoverTabs from '@/components/DiscoverTabs';
import SearchBox from '@/components/SearchBox';
import SignInRequired from '@/components/SignInRequired';
import Taglist from '@/components/Taglist';
import { getSession } from '@/lib/auth';

type SearchParams = Promise<{ q?: string | string[] }>;

function readQuery(q: string | string[] | undefined): string {
  return (typeof q === 'string' ? q : '').trim().slice(0, 30);
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const query = readQuery((await searchParams).q);
  return { title: query ? `${query} · Search` : 'Search' };
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) return <SignInRequired callbackUrl="/search" />;

  const query = readQuery((await searchParams).q);
  const [results, discover] = await Promise.all([
    query ? searchTags(query) : null,
    query ? null : findDiscoverTags()
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 lg:pt-20">
      <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">Search tags</h1>
      <p className="mt-3 text-xl text-muted">
        Matches tag names, descriptions, and content.
      </p>
      <SearchBox initialQuery={query} />
      <div className="mt-12">
        {discover ? (
          <DiscoverTabs
            tabs={[
              { key: 'popular', label: 'Most used', tags: discover.popular },
              { key: 'newest', label: 'Newest', tags: discover.newest }
            ]}
          />
        ) : results && results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface px-4 py-12 text-center text-sm text-muted">
            No tags match “{query}”. Try a shorter or more general keyword, or
            one of the suggestions above.
          </div>
        ) : (
          <Taglist
            key={query}
            tags={results ?? []}
            defaultSortLabel="Relevance"
            summary={`${results?.length ?? 0} ${
              results?.length === 1 ? 'result' : 'results'
            } for “${query}”`}
          />
        )}
      </div>
    </div>
  );
}
