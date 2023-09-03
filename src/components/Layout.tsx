import React, { PropsWithChildren } from "react";
import Navbar from "@/components/NavBar";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};
export default Layout;
