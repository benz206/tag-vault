import { useState, FormEvent } from "react";
import Head from "next/head";
import useSWR from "swr";
import { SearchQuery } from "@/types";
import Taglist from "@/components/Taglist";
import { buttonClass } from "@/components/buttons";
import { useSession, signIn } from "next-auth/react";

export default function SearchPage() {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("discord", { callbackUrl: "/search" });
        },
    });

    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState<string | null>(null);

    const { data: searchData, error, isLoading } = useSWR<SearchQuery>(
        submitted ? `/api/tags/search/${encodeURIComponent(submitted)}` : null
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        setSubmitted(trimmed);
    }

    const resultCount = searchData?.search.length ?? 0;

    return (
        <>
            <Head>
                <title>Search | TagVault</title>
            </Head>
            <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:py-16">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Search tags
                </h1>
                <p className="mt-2 text-neutral-400">
                    Matches tag names, descriptions, and content.
                </p>
                <form
                    className="flex gap-2 mt-8"
                    onSubmit={handleSubmit}
                    role="search"
                >
                    <label htmlFor="tag-search" className="sr-only">
                        Search tags
                    </label>
                    <div className="relative flex-1">
                        <svg
                            className="absolute -translate-y-1/2 pointer-events-none size-4 left-3 top-1/2 text-neutral-500"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <circle cx="9" cy="9" r="6" />
                            <path d="m17 17-3.5-3.5" />
                        </svg>
                        <input
                            id="tag-search"
                            className="w-full pr-3 text-sm border rounded-md h-9 pl-9 bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
                            type="search"
                            placeholder="Try “embed” or “ticket”"
                            value={query}
                            onChange={(e) => setQuery(e.currentTarget.value)}
                            maxLength={30}
                            disabled={status === "loading"}
                        />
                    </div>
                    <button
                        className={buttonClass("primary")}
                        type="submit"
                        disabled={isLoading || !query.trim()}
                    >
                        {isLoading ? "Searching…" : "Search"}
                    </button>
                </form>
                <div className="mt-10">
                    {error ? (
                        <p className="text-sm text-neutral-400">
                            Search failed. Check your connection and try again.
                        </p>
                    ) : searchData && resultCount > 0 ? (
                        <>
                            <p className="mb-3 text-sm text-neutral-400">
                                {resultCount}{" "}
                                {resultCount === 1 ? "result" : "results"} for
                                “{submitted}”
                            </p>
                            <Taglist key={submitted} tags={searchData.search} />
                        </>
                    ) : searchData ? (
                        <div className="px-4 py-12 text-sm text-center border border-dashed rounded-lg border-neutral-800 text-neutral-400">
                            No tags match “{submitted}”. Try a shorter or more
                            general keyword.
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
