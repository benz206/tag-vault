'use client';

import { buttonClass } from '@/components/buttons';

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center sm:px-6">
      <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-3 text-xl text-muted">
        This page couldn&apos;t load. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={retry}
        className={`${buttonClass('primary')} mt-8`}
      >
        Try again
      </button>
    </div>
  );
}
