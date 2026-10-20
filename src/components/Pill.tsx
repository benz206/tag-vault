import type { ReactNode } from "react";

export default function Pill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center h-5 px-1.5 text-[11px] font-medium border rounded border-neutral-800 text-neutral-400 whitespace-nowrap">
            {children}
        </span>
    );
}
