import React, { PropsWithChildren } from "react";
import Header from "@/components/Head";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Header />
            <Navbar />
            {children}
            <Footer />
        </>
    );
};
export default Layout;
