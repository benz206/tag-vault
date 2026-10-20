'use client';

import { useState, useTransition } from 'react';
import {
  deleteTagAction,
  setHiddenAction,
  type ActionResult
} from '@/app/tags/[id]/actions';
import { buttonClass } from '@/components/buttons';

export default function TagOwnerActions({
  tagId,
  hidden
}: {
  tagId: number;
  hidden: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result) setError(result.error);
    });
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-[15px]">Manage your tag</h2>
      <p className="mt-1 text-sm text-muted">
        {hidden
          ? 'Hidden. Only you can see this tag on TagVault.'
          : 'Visible to everyone who can see it on Carl-bot.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => setHiddenAction(tagId, !hidden))}
          className={buttonClass('secondary', 'sm')}
        >
          {hidden ? 'Unhide tag' : 'Hide tag'}
        </button>
        {confirming ? (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={() => run(() => deleteTagAction(tagId))}
              className={`${buttonClass('secondary', 'sm')} text-ctp-red`}
            >
              {isPending ? 'Deleting…' : 'Delete permanently'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setConfirming(false)}
              className={buttonClass('secondary', 'sm')}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className={buttonClass('secondary', 'sm')}
          >
            Delete tag
          </button>
        )}
      </div>
      {confirming && (
        <p className="mt-3 text-sm text-muted">
          This removes the tag from TagVault for good. It stays on Carl-bot.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-ctp-red">
          {error}
        </p>
      )}
    </div>
  );
}
