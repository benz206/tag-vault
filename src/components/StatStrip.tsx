type Stat = { label: string; value?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <dt className="text-muted">{stat.label}</dt>
          <dd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-xs text-ink tabular-nums">
            {stat.value ?? (
              <span className="inline-block h-3 w-12 animate-pulse rounded bg-chip align-middle" />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
