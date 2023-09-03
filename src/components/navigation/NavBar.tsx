import React from "react";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="navbar bg-gradient-to-r from-ygreen to-green flex items-center h-24 bg-size-400%">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl navBarHeader">
                    My Website
                </a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 flex justify-end">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavBar;
