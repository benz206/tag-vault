import type { ReactNode } from "react";
import Header from "@/components/Head";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
