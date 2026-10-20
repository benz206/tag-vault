import type { ReactNode } from "react";

type StatCardProps = {
    title: string;
    accentClassName: string;
    titleHoverClassName: string;
    delayMs: number;
    children: ReactNode;
};

export default function StatCard({
    title,
    accentClassName,
    titleHoverClassName,
    delayMs,
    children,
}: StatCardProps) {
    return (
        <div
            className="motion-safe:animate-rise"
            style={{ animationDelay: `${delayMs}ms` }}
        >
            <div
                className={`group flex flex-col justify-center h-full p-6 border-t-8 shadow-xl rounded-xl bg-slate-600 w-80 md:w-[200px] lg:w-[270px] 2xl:w-[430px] transition-transform duration-300 ease-spring hover:scale-105 ${accentClassName}`}
            >
                <h2
                    className={`mb-4 text-2xl text-center text-white transition-colors duration-500 ease-in-out lg:text-5xl ${titleHoverClassName}`}
                >
                    {title}
                </h2>
                <p>{children}</p>
            </div>
        </div>
    );
}
