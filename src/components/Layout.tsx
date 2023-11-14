import React, { ReactNode } from "react";
import Header from "@/components/Head";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
