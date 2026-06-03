import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
