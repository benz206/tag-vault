import Taglist from "@/components/Taglist";
import { useState, FormEvent } from "react";
import { searchTags } from "@/utils";
import { SearchQuery } from "@/types";

export default function Home() {
    const [searchData, setSearchData] = useState<SearchQuery | null>(null);
    const [query, setQuery] = useState<string>("");

    function getQueries() {
        searchTags(query)
            .then((result) => {
                setSearchData(result);
                console.log(result);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
                                className="flex-1 p-4 text-xl text-left text-white rounded-lg lg:text-4xl bg-slate-400 text-bold placeholder:text-slate-200"
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={handleInputChange}
                            />
                            <button
                                className="flex items-center justify-center w-4/12 px-4 py-2 text-xl font-bold text-white rounded-lg bg-cyan-400 hover:bg-cyan-500 lg:text-4xl"
                                type="submit"
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
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                                Search
                            </button>
                        </form>
                    </div>
                </div>
                <div className="relative flex flex-wrap content-center justify-center h-auto">
                    {searchData ? <Taglist tags={searchData.search} /> : <></>}
                </div>
            </div>
        </>
    );
}
