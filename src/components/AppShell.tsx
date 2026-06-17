import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-layout__content">{children}</div>
      <Footer />
    </div>
  );
}
