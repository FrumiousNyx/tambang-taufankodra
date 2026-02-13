import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden touch-action-pan-y">
      <Header />
      <main className="flex-1 pt-24 overflow-y-auto touch-action-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout;
