import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7] font-sans text-slate-800">
      <Header />
      <main className="flex-1 pb-16 md:pb-0 pt-16">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
