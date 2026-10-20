import { useState, FormEvent } from "react";
import Head from "next/head";
import useSWR from "swr";
import { SearchQuery } from "@/types";
import Taglist from "@/components/Taglist";
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

    const { data: searchData, isLoading } = useSWR<SearchQuery>(
        submitted ? `/api/tags/search/${encodeURIComponent(submitted)}` : null
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        setSubmitted(trimmed);
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center w-full h-[60vh]">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Search | TagVault</title>
            </Head>
            <div className="flex flex-col w-full h-full min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col flex-wrap content-center justify-center w-full h-72 lg:h-128 bg-gradient-to-r from-pink-500 to-rose-500">
                    <h1 className="relative p-12 mt-8 text-3xl text-center lg:text-9xl">
                        Search Tags
                    </h1>
                    <div className="flex flex-col p-2 mb-10 rounded-xl bg-slate-600">
                        <form
                            className="flex justify-evenly"
                            onSubmit={handleSubmit}
                            role="search"
                        >
                            <label htmlFor="tag-search" className="sr-only">
                                Search tags
                            </label>
                            <input
                                id="tag-search"
                                className="flex-1 p-4 mr-2 text-xl text-left text-white rounded-lg lg:text-4xl bg-slate-400 text-bold placeholder:text-slate-200"
                                type="search"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.currentTarget.value)}
                                maxLength={30}
                            />
                            <button
                                className={`flex items-center justify-center w-4/12 px-4 py-2 text-xl font-bold text-white rounded-lg ${
                                    isLoading
                                        ? "bg-cyan-500"
                                        : "bg-cyan-400 hover:bg-cyan-500"
                                } lg:text-4xl`}
                                type="submit"
                                aria-label="Submit search"
                                disabled={isLoading || !query.trim()}
                            >
                                {isLoading ? (
                                    <svg
                                        className="w-10 h-10 text-white lg:mr-2 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-100"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-10 h-10 text-white lg:mr-2"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                )}
                                <span className="hidden text-4xl font-semibold lg:block">
                                    Search
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="relative flex justify-center h-auto">
                    {searchData && searchData.search.length > 0 ? (
                        <div className="flex flex-col items-center">
                            <h2 className="pt-12">
                                {searchData.search.length} results were found.
                            </h2>
                            <Taglist key={submitted} tags={searchData.search} />
                        </div>
                    ) : (
                        <h2 className="p-12">
                            {searchData && searchData.search.length === 0
                                ? "Sorry, 0 results were found."
                                : "Search results will appear here."}
                        </h2>
                    )}
                </div>
            </div>
        </>
    );
}
