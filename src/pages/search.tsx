import { useState, FormEvent } from "react";
import { searchTags } from "@/utils";
import { SearchQuery } from "@/types";
import Taglist from "@/components/Taglist";

export default function Home() {
    const [searchData, setSearchData] = useState<SearchQuery | null>(null);
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function getQueries() {
        setIsLoading(true);
        searchTags(query)
            .then((result) => {
                setSearchData(result);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!query) return;
        getQueries();
    }

    function handleInputChange(event: FormEvent<HTMLInputElement>) {
        setQuery(event.currentTarget.value);
    }

    return (
        <>
            <div className="flex flex-col w-full h-full min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col flex-wrap content-center justify-center w-full h-72 lg:h-128 bg-gradient-to-r from-pink-500 to-rose-500">
                    <h1 className="relative p-12 mt-8 text-3xl text-center lg:text-9xl">
                        Search Tags
                    </h1>
                    <div className="flex flex-col p-2 mb-10 rounded-xl bg-slate-600">
                        <form
                            className="flex justify-evenly"
                            onSubmit={handleSubmit}
                        >
                            <input
                                className="flex-1 p-4 mr-2 text-xl text-left text-white rounded-lg lg:text-4xl bg-slate-400 text-bold placeholder:text-slate-200"
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={handleInputChange}
                            />
                            <button
                                className={`flex items-center justify-center w-4/12 px-4 py-2 text-xl font-bold text-white rounded-lg ${
                                    isLoading
                                        ? "bg-cyan-500"
                                        : "bg-cyan-400 hover:bg-cyan-500"
                                } lg:text-4xl`}
                                type="submit"
                            >
                                {isLoading ? (
                                    <svg
                                        className="w-10 h-10 text-white lg:mr-2 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <svg
                                            className="w-10 h-10 text-white animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-100"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-10 h-10 text-white lg:mr-2"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <svg
                                            className="w-8 h-8 mr-4 text-white"
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
                            <Taglist tags={searchData.search} animDelay={0} />
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
