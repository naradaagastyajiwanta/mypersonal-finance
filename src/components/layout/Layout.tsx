import type { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-20 pt-16">
        <div className="max-w-md mx-auto px-4">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;