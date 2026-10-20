import type { ReactNode } from 'react';
import Header from '@/components/Head';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CommandMenu from '@/components/CommandMenu';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandMenu />
    </div>
  );
}
