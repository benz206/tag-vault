import { useState } from 'react';
import type { TagSummary } from '@/types';
import Taglist from '@/components/Taglist';

export type DiscoverTab = {
  key: string;
  label: string;
  tags: TagSummary[] | undefined;
  error?: unknown;
};

export default function DiscoverTabs({ tabs }: { tabs: DiscoverTab[] }) {
  const [activeKey, setActiveKey] = useState(tabs[0].key);
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <div>
      <div className="mb-4 flex gap-1 border-b border-line" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === active.key}
            onClick={() => setActiveKey(tab.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-[15px] transition-colors ${
              tab.key === active.key
                ? 'border-ink text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Taglist
        key={active.key}
        tags={active.tags}
        error={active.error}
        defaultSortLabel={active.label}
      />
    </div>
  );
}
