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
            <div className="max-w-6xl px-4 pt-16 pb-20 mx-auto sm:px-6 lg:pt-20">
                <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
                    Search tags
                </h1>
                <p className="mt-3 text-xl text-muted">
                    Matches tag names, descriptions, and content.
                </p>
                <form
                    className="flex max-w-2xl gap-2 p-1.5 mt-8 bg-surface border rounded-xl border-line shadow-sm focus-within:border-faint"
                    onSubmit={handleSubmit}
                    role="search"
                >
                    <label htmlFor="tag-search" className="sr-only">
                        Search tags
                    </label>
                    <div className="relative flex-1">
                        <svg
                            className="absolute -translate-y-1/2 pointer-events-none size-4 left-3 top-1/2 text-faint"
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
                            className="w-full h-10 pr-3 text-base bg-transparent pl-9 placeholder:text-faint focus-visible:outline-none"
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
                        <p className="text-sm text-muted">
                            Search failed. Check your connection and try again.
                        </p>
                    ) : searchData && resultCount > 0 ? (
                        <Taglist
                            key={submitted}
                            tags={searchData.search}
                            defaultSortLabel="Relevance"
                            summary={`${resultCount} ${
                                resultCount === 1 ? "result" : "results"
                            } for “${submitted}”`}
                        />
                    ) : searchData ? (
                        <div className="px-4 py-12 text-sm text-center bg-surface border border-dashed rounded-xl border-line-strong text-muted">
                            No tags match “{submitted}”. Try a shorter or more
                            general keyword.
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
