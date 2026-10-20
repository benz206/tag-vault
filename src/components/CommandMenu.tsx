import { useEffect, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import useSWR from 'swr';
import type { SearchQuery } from '@tag-vault/db';
import { getTagColor } from '@/utils';
import { openRandomTag } from '@/components/RandomTagButton';
import { toggleTheme } from '@/components/ThemeToggle';

export const OPEN_COMMAND_MENU = 'command-menu:open';

type Item = {
  id: string;
  section: 'Actions' | 'Tags';
  label: string;
  detail?: string;
  color?: string;
  run: () => unknown;
};

export default function CommandMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [active, setActive] = useState(0);

  function close() {
    setOpen(false);
    setQuery('');
    setDebounced('');
    setActive(0);
  }

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((wasOpen) => !wasOpen);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const canSearch = !!session && debounced.length >= 2;
  const { data: results, isLoading } = useSWR<SearchQuery>(
    open && canSearch
      ? `/api/tags/search/${encodeURIComponent(debounced)}`
      : null
  );

  const trimmed = query.trim();
  const go = (url: string) => () => router.push(url);

  const actions: Item[] = [
    {
      id: 'search',
      section: 'Actions',
      label: trimmed ? `Search for “${trimmed}”` : 'Search tags',
      run: go(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
    },
    ...(session
      ? [
          {
            id: 'dashboard',
            section: 'Actions' as const,
            label: 'Open dashboard',
            run: go('/dashboard')
          }
        ]
      : []),
    {
      id: 'random',
      section: 'Actions',
      label: 'Surprise me',
      detail: 'Open a random tag',
      run: () => openRandomTag(router.push)
    },
    {
      id: 'theme',
      section: 'Actions',
      label: 'Toggle dark mode',
      run: toggleTheme
    },
    { id: 'home', section: 'Actions', label: 'Go home', run: go('/') },
    session
      ? {
          id: 'auth',
          section: 'Actions',
          label: 'Sign out',
          run: () => signOut({ callbackUrl: '/' })
        }
      : {
          id: 'auth',
          section: 'Actions',
          label: 'Sign in with Discord',
          detail: 'Required to search tags',
          run: () => signIn('discord')
        }
  ];

  const matchingActions = trimmed
    ? actions.filter(
        (action) =>
          action.id === 'search' ||
          action.label.toLowerCase().includes(trimmed.toLowerCase())
      )
    : actions;

  const tagItems: Item[] = canSearch
    ? (results?.search ?? []).slice(0, 8).map((tag) => ({
        id: `tag-${tag.id}`,
        section: 'Tags',
        label: tag.tag_name,
        detail: tag.description ?? undefined,
        color: getTagColor(tag.id, Number(tag.owner_id)),
        run: go(`/tags/${tag.id}`)
      }))
    : [];

  const items = [...matchingActions, ...tagItems];
  const activeIndex = Math.min(active, items.length - 1);

  async function runItem(item: Item | undefined) {
    if (!item) return;
    close();
    await item.run();
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next =
        (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) %
        items.length;
      setActive(next);
      document
        .getElementById(`command-${items[next].id}`)
        ?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runItem(items[activeIndex]);
    } else if (event.key === 'Escape') {
      close();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[14vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-2xl motion-safe:animate-drop"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg
            className="size-4 shrink-0 text-faint"
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
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={
              session ? 'Search tags or type a command…' : 'Type a command…'
            }
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={
              items[activeIndex]
                ? `command-${items[activeIndex].id}`
                : undefined
            }
            className="h-12 flex-1 bg-transparent text-[15px] placeholder:text-faint focus-visible:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 font-mono text-xs text-faint">
            Esc
          </kbd>
        </div>
        <ul
          id="command-list"
          role="listbox"
          className="max-h-80 overflow-y-auto p-1.5"
        >
          {items.map((item, index) => (
            <li key={item.id} role="presentation">
              {(index === 0 || items[index - 1].section !== item.section) && (
                <p className="px-3 pt-2 pb-1 text-xs text-faint">
                  {item.section}
                </p>
              )}
              <div
                id={`command-${item.id}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseMove={() => setActive(index)}
                onClick={() => runItem(item)}
                className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  index === activeIndex ? 'bg-chip text-ink' : 'text-ink-3'
                }`}
              >
                {item.color && (
                  <span
                    className={`h-4 w-[3px] shrink-0 rounded-full bg-${item.color}`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`shrink-0 ${item.section === 'Tags' ? 'font-mono' : ''}`}
                >
                  {item.label}
                </span>
                {item.detail && (
                  <span className="truncate text-faint">{item.detail}</span>
                )}
              </div>
            </li>
          ))}
          {canSearch && isLoading && (
            <li className="px-3 py-2 text-sm text-faint">Searching tags…</li>
          )}
        </ul>
      </div>
    </div>
  );
}
