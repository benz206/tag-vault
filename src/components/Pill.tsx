import type { ReactNode } from "react";

export default function Pill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center h-5 px-1.5 text-xs rounded-md bg-stone-100 text-stone-600 whitespace-nowrap">
            {children}
        </span>
    );
}
