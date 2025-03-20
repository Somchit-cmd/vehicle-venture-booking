
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" />
      <motion.main
        className="flex-grow pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="py-8">
          {children}
        </div>
      </motion.main>
      <footer className="py-6 border-t border-gray-200 mt-auto bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Office Vehicle Booking System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
