import React, { PropsWithChildren } from "react";
import Header from "@/components/Head";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: PropsWithChildren }) {
    return (
        <>
            <Header />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
