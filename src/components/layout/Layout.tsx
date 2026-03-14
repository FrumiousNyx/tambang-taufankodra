'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const Header = dynamic(() => import('./Header'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });
const Chatbot = dynamic(() => import('../Chatbot'), { ssr: false });
import ClientOnly from '../ClientOnly';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden touch-action-pan-y">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 pt-24 overflow-y-auto touch-action-pan-y focus:outline-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <ClientOnly>{children}</ClientOnly>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout;
