type Stat = { label: string; value?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
    return (
        <dl className="grid grid-cols-2 gap-px overflow-hidden border rounded-lg sm:flex bg-neutral-800 border-neutral-800 [&>*:last-child:nth-child(odd)]:col-span-2">
            {stats.map((stat) => (
                <div key={stat.label} className="flex-1 px-5 py-4 bg-black">
                    <dt className="text-sm text-neutral-400">{stat.label}</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                        {stat.value ?? (
                            <span className="block w-20 rounded h-7 animate-pulse bg-neutral-900" />
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
