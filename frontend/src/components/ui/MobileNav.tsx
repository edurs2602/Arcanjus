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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Slide-out drawer */}
      <div className="fixed inset-y-0 right-0 w-64 bg-white p-6 shadow-xl">
        <button onClick={onClose} className="mb-8 ml-auto block" aria-label="Fechar menu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <nav>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block text-lg font-medium text-primary transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
