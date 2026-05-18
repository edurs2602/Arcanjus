'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/camisas', label: 'Camisas' },
  { href: '/sobre', label: 'Nossa História' },
  { href: '/localizacao', label: 'Atelier' },
];

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Announcement bar */}
      <div className="bg-primary py-2 text-center">
        <p className="text-[10px] font-medium uppercase tracking-widest-xl text-white/80">
          Entrega para todo o Brasil — Frete grátis acima de R$ 299
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-brand-200/60 bg-brand-50/95 backdrop-blur-md">
        <nav className="luxury-container flex items-center justify-between py-5">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="font-display text-2xl tracking-wide text-primary transition-colors group-hover:text-accent md:text-3xl">
              ARCANJUS
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative text-[11px] font-medium uppercase tracking-widest-xl text-primary-light transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
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
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
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

      {/* Footer */}
      <footer className="border-t border-brand-200/60 bg-primary">
        <div className="luxury-container py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Brand */}
            <div>
              <h3 className="font-display text-2xl tracking-wide text-white">ARCANJUS</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Elegância atemporal em cada detalhe. Camisas feitas para quem valoriza o requinte e a qualidade incomparável.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-widest-xl text-white/40">
                Navegação
              </h4>
              <ul className="mt-6 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-widest-xl text-white/40">
                Contato
              </h4>
              <div className="mt-6 space-y-3 text-sm text-white/60">
                <p>contato@arcanjus.com.br</p>
                <p>(11) 9999-0000</p>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <p className="text-center text-[10px] uppercase tracking-widest-xl text-white/30">
              &copy; {new Date().getFullYear()} Arcanjus. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
