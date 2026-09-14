import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Terminal, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Services', path: '/services' },
    { label: 'Engineering Approach', path: '/#philosophy' },
    { label: 'Process', path: '/#process' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      const elementId = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(elementId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(elementId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070707]/90 backdrop-blur-md border-b border-[#202020] py-3.5 shadow-2xl'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          id="nav-logo-link"
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-sm bg-[#131313] border border-[#2E2E2E] group-hover:border-[#C9A769] transition-colors flex items-center justify-center text-[#C9A769]">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk',sans-serif] font-bold tracking-tight text-[#F5F5F2] text-sm sm:text-base leading-tight group-hover:text-[#FFFFFF] transition-colors">
              TAZBIDUL SIAM
            </span>
            <span className="font-mono text-[10px] text-[#969691] tracking-wider uppercase">
              Principal Full-Stack Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`transition-colors tracking-wide relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#FFFFFF] font-semibold'
                    : 'text-[#969691] hover:text-[#F5F5F2]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A769]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Badge variant="emerald" dot size="sm" className="hidden xl:inline-flex">
            Available Q3/Q4 2026
          </Badge>

          {isAuthenticated && (
            <Link
              to="/admin"
              className="p-2 text-[#969691] hover:text-[#C9A769] bg-[#131313] border border-[#242424] rounded-sm transition-colors"
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </Link>
          )}

          <Button
            id="nav-cta-button"
            variant="primary"
            size="sm"
            onClick={() => navigate('/contact')}
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            START A PROJECT
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            id="mobile-menu-toggle"
            variant="secondary"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden fixed inset-x-0 top-[60px] bg-[#0A0A0A] border-b border-[#242424] px-6 py-8 shadow-2xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col gap-4">
            <div className="pb-3 border-b border-[#1E1E1E]">
              <Badge variant="emerald" dot size="sm">
                Available for Select Projects
              </Badge>
            </div>
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className="text-left text-lg font-medium text-[#E2E2DE] hover:text-[#C9A769] py-2 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#1E1E1E] flex flex-col gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-between"
                onClick={() => navigate('/contact')}
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                START A PROJECT
              </Button>
              <Link
                to="/admin/login"
                className="text-xs text-[#969691] hover:text-[#C9A769] text-center pt-2"
              >
                Engineer / Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
