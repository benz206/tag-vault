import React from "react";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="absolute flex items-center w-full h-16">
            <div className="relative flex-1 left-8">
                <a className="font-bold" href="/">
                    Tag Vault
                </a>
            </div>
            <div className="relative flex-none right-8">
                <ul className="flex justify-end px-1 menu menu-horizontal">
                    <li>
                        <Link href="/search">Search</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavBar;
