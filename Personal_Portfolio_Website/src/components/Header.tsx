"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setIsLoaded(true);
    
    // Observer untuk mendeteksi section yang aktif
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -60% 0px',
      threshold: [0.1, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
      // Sort entries by intersection ratio (highest first)
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries[0];
        setActiveSection(mostVisible.target.id);
      }
    }, observerOptions);

    // Fallback scroll detection
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset untuk header
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // Delay untuk memastikan DOM sudah ready
    const initObserver = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      let foundSections = 0;
      
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
          foundSections++;
          console.log(`Observing section: ${sectionId}`); // Debug log
        } else {
          console.warn(`Section not found: ${sectionId}`); // Debug log
        }
      });
      
      console.log(`Total sections found: ${foundSections}`); // Debug log
      
      // Add scroll listener as fallback
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    };

    // Delay initialization sedikit untuk memastikan semua komponen sudah mounted
    const timer = setTimeout(initObserver, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId.replace('#', ''));
    if (element) {
      const headerOffset = 80; // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transform transition-all duration-1000 ease-out ${
      isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-16 gap-2 overflow-hidden">
            {/* Logo */}
            <div className="flex-shrink-0 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary truncate">
                Portfolio
              </h1>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 flex-1 justify-center min-w-0">
            {menuItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(item.href);
                  }}
                  className={`relative px-3 lg:px-4 py-2 font-medium transition-all duration-300 ease-out cursor-pointer group ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {/* Background hover effect */}
                  <span className="absolute inset-0 rounded-lg bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></span>
                  
                  {/* Active indicator */}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${
                    isActive ? 'w-6' : 'w-0 group-hover:w-4'
                  }`}></span>
                  
                  {/* Text */}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0">
            {/* Theme Toggle */}
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                {isMenuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {menuItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(item.href);
                      setIsMenuOpen(false);
                    }}
                    className={`relative block px-4 py-3 font-medium transition-all duration-300 cursor-pointer group rounded-lg ${
                      isActive 
                        ? 'text-primary bg-primary/5 border-l-2 border-primary' 
                        : 'text-foreground hover:text-primary hover:bg-primary/5 hover:translate-x-1'
                    }`}
                  >
                    {/* Active indicator for mobile */}
                    <span className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 bg-primary transition-all duration-300 ease-out ${
                      isActive ? 'h-6' : 'h-0 group-hover:h-4'
                    }`}></span>
                    
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
