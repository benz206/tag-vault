'use client';

import { useEffect, useRef, useState, useTransition, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import RandomTagButton from '@/components/RandomTagButton';
import { buttonClass } from '@/components/buttons';

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

export default function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const query = draft ?? initialQuery;

  function runSearch(value: string) {
    const trimmed = value.trim();
    startTransition(() => {
      router.replace(
        trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search',
        { scroll: false }
      );
    });
  }

  useEffect(() => {
    if (draft === null) return;
    const trimmed = draft.trim();
    if (trimmed === initialQuery || trimmed.length === 1) return;
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

  return (
    <>
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
          />
          <kbd className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border border-line px-1.5 font-mono text-xs text-faint sm:block">
            /
          </kbd>
        </div>
        <button
          className={buttonClass('primary')}
          type="submit"
          disabled={isPending || !query.trim()}
        >
          {isPending ? 'Searching…' : 'Search'}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">Try</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => pickSuggestion(suggestion)}
            aria-pressed={initialQuery === suggestion}
            className={`h-7 rounded-md border px-2.5 text-sm transition-colors ${
              initialQuery === suggestion
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
    </>
  );
}
