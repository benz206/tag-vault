'use client';

import { useOptimistic, useTransition } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { setFavoriteAction } from '@/app/tags/[id]/actions';
import { buttonClass } from '@/components/buttons';

export default function FavoriteButton({
  tagId,
  favorited,
  count
}: {
  tagId: number;
  favorited: boolean;
  count: number;
}) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic(
    { favorited, count },
    (_current, next: { favorited: boolean; count: number }) => next
  );

  function toggle() {
    if (!session) {
      signIn('discord');
      return;
    }
    const next = !state.favorited;
    startTransition(async () => {
      setOptimistic({ favorited: next, count: state.count + (next ? 1 : -1) });
      await setFavoriteAction(tagId, next);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={state.favorited}
      className={buttonClass('secondary')}
    >
      <svg
        className={`size-4 ${state.favorited ? 'text-ctp-yellow' : ''}`}
        viewBox="0 0 16 16"
        fill={state.favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m8 1.75 1.93 3.9 4.3.63-3.11 3.03.73 4.29L8 11.58l-3.85 2.02.73-4.29-3.11-3.03 4.3-.63L8 1.75Z" />
      </svg>
      {state.favorited ? 'Favorited' : 'Favorite'}
      <span className="text-muted tabular-nums">{state.count}</span>
    </button>
  );
}
