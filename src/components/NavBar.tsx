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
            <div className="relative ml-auto mr-8">
                <Link href="/search">Search</Link>
            </div>
        </div>
    );
};

export default NavBar;
