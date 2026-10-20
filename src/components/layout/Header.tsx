import React, { useState } from 'react';
import { Search, Menu, X, Compass, PhoneCall } from 'lucide-react';
import { Link, useRouter } from '../../router';
import { EnquiryModal } from '../booking/EnquiryModal';
import { CONTACT_CONFIG } from '../../config/contact';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { path } = useRouter();

  const navLinks = [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Travel Stories', href: '/blog' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E8E5DE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-20">
            {/* Zone 1: Single text wordmark with subtle Indian travel emblem */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-2xl font-serif font-bold tracking-tight text-[#202522] whitespace-nowrap shrink-0 group"
            >
              <span className="w-8 h-8 rounded-full bg-[#244C3A] text-[#C5A46D] flex items-center justify-center transition-transform group-hover:rotate-45">
                <Compass className="w-4 h-4" />
              </span>
              <span>Desi Musafir</span>
            </Link>

            {/* Zone 2: Clean single-line text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
              {navLinks.map((link) => {
                const isActive = path === link.href || (link.href !== '/' && path.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                      isActive
                        ? 'border-[#B85C38] text-stone-900 font-semibold'
                        : 'border-transparent hover:text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Search button & 1 primary action */}
            <div className="flex items-center gap-3 shrink-0">
              {onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-200/60 transition-colors"
                  aria-label="Search destinations and stories"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => setEnquiryOpen(true)}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#244C3A] hover:bg-[#1E3B2E] rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                Plan Your Trip
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F3] border-b border-[#E8E5DE] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#E8E5DE] flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEnquiryOpen(true);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#244C3A] rounded-lg"
              >
                Plan Your Trip
              </button>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 px-1">
                <a href={CONTACT_CONFIG.phoneTel} className="flex items-center gap-1.5 hover:text-stone-900">
                  <PhoneCall className="w-3.5 h-3.5 text-[#B85C38]" />
                  <span>+91 {CONTACT_CONFIG.phone}</span>
                </a>
                <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
                  Admin Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
