
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Calendar, ClipboardList, UserCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navLinks = [
    { name: 'Vehicles', path: '/', icon: <Car className="h-4 w-4 mr-2" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: 'Management', path: '/management', icon: <ClipboardList className="h-4 w-4 mr-2" /> }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-semibold text-xl">MSIGSX</span>
              <span className="text-foreground font-semibold text-xl"> Vehicle Booking</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button 
                  variant={location.pathname === link.path ? "default" : "ghost"} 
                  className={`flex items-center transition-all duration-200 ${
                    location.pathname === link.path 
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center">
            <Button variant="ghost" className="flex items-center">
              <UserCircle className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
