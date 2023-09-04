import React, { PropsWithChildren } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};
export default Layout;
