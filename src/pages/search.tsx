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
    };

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        getQueries();
    }

    function handleInputChange(event: FormEvent<HTMLInputElement>) {
        setQuery(event.currentTarget.value);
    }

    return (
        <>
            <div className="flex h-full w-full flex-col">
                <div className="flex justify-center h-72 lg:h-128 w-full bg-gradient-to-r from-pink-500 to-rose-500 content-center flex-wrap flex-col">
                    <h1 className=" relative text-center text-3xl lg:text-9xl p-12 mt-8">
                        Search Tags
                    </h1>
                    <div className="rounded-xl mb-10 bg-slate-600 p-2 flex flex-col">
                        <form className="flex justify-evenly" onSubmit={handleSubmit}>
                            <input
                                className="text-left text-white text-xl lg:text-4xl bg-slate-400 rounded-lg p-4 flex-1 text-bold placeholder:text-slate-200"
                                type="text"
                                placeholder="Search..."
                                value={query}
                               onChange={handleInputChange}
                            />
                            <button 
                                className="w-4/12 bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg text-xl lg:text-4xl flex justify-center items-center"
                                type="submit"
                            >
                                <svg className="w-8 h-8 text-white mr-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                                Search
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex justify-center content-center flex-wrap">
                    {searchData ? (
                        <Taglist tags={searchData.search}/>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
