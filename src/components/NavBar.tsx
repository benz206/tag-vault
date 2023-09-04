import React from "react";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="absolute flex items-center h-16 w-full">
            <div className="flex-1 left-8 relative">
                <a className="normal-case" href="/">Tag Vault</a>
            </div>
            <div className="flex-none relative right-8">
                <ul className="menu menu-horizontal px-1 flex justify-end">
                    <li>
                        <Link href="/">Search</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavBar;
