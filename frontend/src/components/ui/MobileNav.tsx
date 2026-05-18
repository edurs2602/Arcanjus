'use client';

import Link from 'next/link';

interface MobileNavProps {
  links: Array<{ href: string; label: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ links, isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Slide-out drawer */}
      <div className="fixed inset-y-0 right-0 w-80 animate-slide-in bg-brand-50 p-10 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg tracking-wide text-primary">ARCANJUS</span>
          <button onClick={onClose} aria-label="Fechar menu">
            <svg className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-16">
          <ul className="space-y-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block text-[11px] font-medium uppercase tracking-widest-xl text-primary-light transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-10 left-10 right-10 border-t border-brand-200 pt-8">
          <p className="text-[10px] uppercase tracking-widest-xl text-brand-500">
            Elegância atemporal
          </p>
        </div>
      </div>
    </div>
  );
}
