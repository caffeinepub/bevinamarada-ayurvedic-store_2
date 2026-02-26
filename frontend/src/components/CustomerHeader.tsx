import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function CustomerHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-ayur-green-deep shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-ayur-gold flex items-center justify-center bg-ayur-green-mid">
              <img
                src="/assets/generated/store-logo.dim_256x256.png"
                alt="Bevinamarada Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <Leaf className="h-5 w-5 text-ayur-gold hidden" />
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-sm font-semibold text-ayur-cream leading-tight">Bevinamarada</p>
              <p className="font-body text-xs text-ayur-gold leading-tight">Ayurvedic Store</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-ayur-green-mid text-ayur-cream'
                    : 'text-ayur-cream/80 hover:text-ayur-cream hover:bg-ayur-green-mid/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-ayur-cream hover:bg-ayur-green-mid transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ayur-green-deep border-t border-ayur-green-mid/40 animate-fade-in">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-md font-body text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-ayur-green-mid text-ayur-cream'
                    : 'text-ayur-cream/80 hover:text-ayur-cream hover:bg-ayur-green-mid/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
