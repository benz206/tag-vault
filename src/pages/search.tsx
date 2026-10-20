import { useEffect, useRef, useState, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { DiscoverQuery, SearchQuery } from '@/types';
import Taglist from '@/components/Taglist';
import DiscoverTabs from '@/components/DiscoverTabs';
import RandomTagButton from '@/components/RandomTagButton';
import { buttonClass } from '@/components/buttons';
import { useSession, signIn } from 'next-auth/react';

const SUGGESTIONS = [
  'embed',
  'welcome',
  'ticket',
  'giveaway',
  'poll',
  '8ball',
  'afk',
  'verify'
];

export default function SearchPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn('discord', { callbackUrl: '/search' });
    }
  });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = typeof router.query.q === 'string' ? router.query.q : '';
  const [draft, setDraft] = useState<string | null>(null);
  const query = draft ?? urlQuery;

  const {
    data: searchData,
    error,
    isLoading
  } = useSWR<SearchQuery>(
    urlQuery ? `/api/tags/search/${encodeURIComponent(urlQuery)}` : null
  );
  const { data: discover, error: discoverError } = useSWR<DiscoverQuery>(
    urlQuery ? null : '/api/tags/discover'
  );

  function runSearch(value: string) {
    const trimmed = value.trim();
    router.replace(
      trimmed ? { pathname: '/search', query: { q: trimmed } } : '/search',
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    if (draft === null) return;
    const trimmed = draft.trim();
    if (trimmed === urlQuery || trimmed.length === 1) return;
    const timer = setTimeout(() => runSearch(trimmed), 300);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    function focusOnSlash(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', focusOnSlash);
    return () => document.removeEventListener('keydown', focusOnSlash);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(query);
  }

  function pickSuggestion(suggestion: string) {
    setDraft(suggestion);
    runSearch(suggestion);
  }

  const resultCount = searchData?.search.length ?? 0;

  return (
    <>
      <Head>
        <title>
          {urlQuery ? `${urlQuery} | Search | TagVault` : 'Search | TagVault'}
        </title>
      </Head>
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 lg:pt-20">
        <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">Search tags</h1>
        <p className="mt-3 text-xl text-muted">
          Matches tag names, descriptions, and content.
        </p>
        <form
          className="mt-8 flex max-w-2xl gap-2 rounded-xl border border-line bg-surface p-1.5 shadow-sm focus-within:border-faint"
          onSubmit={handleSubmit}
          role="search"
        >
          <label htmlFor="tag-search" className="sr-only">
            Search tags
          </label>
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m17 17-3.5-3.5" />
            </svg>
            <input
              ref={inputRef}
              id="tag-search"
              className="h-10 w-full bg-transparent pr-10 pl-9 text-base placeholder:text-faint focus-visible:outline-none"
              type="search"
              placeholder="Try “embed” or “ticket”"
              value={query}
              onChange={(e) => setDraft(e.currentTarget.value)}
              maxLength={30}
              disabled={status === 'loading'}
            />
            <kbd className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border border-line px-1.5 font-mono text-xs text-faint sm:block">
              /
            </kbd>
          </div>
          <button
            className={buttonClass('primary')}
            type="submit"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Searching…' : 'Search'}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-muted">Try</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => pickSuggestion(suggestion)}
              aria-pressed={urlQuery === suggestion}
              className={`h-7 rounded-md border px-2.5 text-sm transition-colors ${
                urlQuery === suggestion
                  ? 'border-ink bg-ink text-canvas'
                  : 'border-line bg-surface text-ink-3 hover:border-line-strong hover:text-ink'
              }`}
            >
              {suggestion}
            </button>
          ))}
          <span className="mx-1 text-line-strong" aria-hidden="true">
            |
          </span>
          <RandomTagButton size="xs" />
        </div>
        <div className="mt-12">
          {!urlQuery ? (
            <DiscoverTabs
              tabs={[
                {
                  key: 'popular',
                  label: 'Most used',
                  tags: discover?.popular,
                  error: discoverError
                },
                {
                  key: 'newest',
                  label: 'Newest',
                  tags: discover?.newest,
                  error: discoverError
                }
              ]}
            />
          ) : error ? (
            <p className="text-sm text-muted">
              Search failed. Check your connection and try again.
            </p>
          ) : searchData && resultCount === 0 ? (
            <div className="rounded-xl border border-dashed border-line-strong bg-surface px-4 py-12 text-center text-sm text-muted">
              No tags match “{urlQuery}”. Try a shorter or more general keyword,
              or one of the suggestions above.
            </div>
          ) : (
            <Taglist
              key={urlQuery}
              tags={searchData?.search}
              defaultSortLabel="Relevance"
              summary={
                searchData
                  ? `${resultCount} ${
                      resultCount === 1 ? 'result' : 'results'
                    } for “${urlQuery}”`
                  : `Searching for “${urlQuery}”…`
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
