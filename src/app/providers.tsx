'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
  dedupingInterval: 60_000,
  fetcher: async (resource: string, init?: RequestInit) => {
    const r = await fetch(resource, init);
    if (!r.ok) throw new Error(`Request failed ${r.status}`);
    return r.json();
  }
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </SessionProvider>
  );
}
