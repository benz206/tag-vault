import type { ReactNode } from 'react';

export default function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-5 items-center rounded-md bg-chip px-1.5 text-xs whitespace-nowrap text-ink-3">
      {children}
    </span>
  );
}
