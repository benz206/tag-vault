type Stat = { label: string; value?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
    return (
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                    <dt className="text-muted">{stat.label}</dt>
                    <dd className="px-1.5 py-0.5 font-mono text-xs bg-surface border rounded-md border-line tabular-nums text-ink">
                        {stat.value ?? (
                            <span className="inline-block w-12 h-3 align-middle rounded animate-pulse bg-chip" />
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
