import React, { PropsWithChildren } from "react";
import Navbar from "./navigation/NavBar";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};
export default Layout;