type Stat = { label: string; value?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
    return (
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                    <dt className="text-stone-500">{stat.label}</dt>
                    <dd className="px-1.5 py-0.5 font-mono text-xs bg-white border rounded-md border-stone-200 tabular-nums text-stone-950">
                        {stat.value ?? (
                            <span className="inline-block w-12 h-3 align-middle rounded animate-pulse bg-stone-100" />
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
