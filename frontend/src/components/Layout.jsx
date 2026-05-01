import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-body">
      <Navbar />
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;