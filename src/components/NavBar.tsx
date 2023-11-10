import React from "react";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="absolute flex items-center w-full h-16">
            <div className="relative ml-6 mr-auto">
                <Link className="font-bold" href="/">
                    Tag Vault
                </Link>
            </div>
            <div className="relative ml-auto mr-2">
                <div className="px-4 py-1 transition-colors duration-500 ease-in-out lg:px-10 lg:py-2 hover:bg-cyan-400 rounded-3xl">
                    <Link href="/search">Search</Link>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
