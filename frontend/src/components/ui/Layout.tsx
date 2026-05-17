'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/camisas', label: 'Camisas' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/localizacao', label: 'Localização' },
];

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-brand-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-primary">
            Arcanjus
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-primary-light transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      <MobileNav
        links={navLinks}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-brand-200 bg-brand-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-primary-light">
          <p>&copy; {new Date().getFullYear()} Arcanjus. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
