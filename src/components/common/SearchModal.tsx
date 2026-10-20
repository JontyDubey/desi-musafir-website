import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, BookOpen, Compass, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';
import { TRAVEL_ARTICLES } from '../../data/articles';
import { TRAVEL_CATEGORIES } from '../../data/categories';
import { Link } from '../../router';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const matchingDestinations = normalizedQuery
    ? DESTINATIONS.filter(
        (d) =>
          d.title.toLowerCase().includes(normalizedQuery) ||
          d.state.toLowerCase().includes(normalizedQuery) ||
          d.excerpt.toLowerCase().includes(normalizedQuery)
      ).slice(0, 4)
    : [];

  const matchingArticles = normalizedQuery
    ? TRAVEL_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(normalizedQuery) ||
          a.destination.toLowerCase().includes(normalizedQuery) ||
          a.state.toLowerCase().includes(normalizedQuery) ||
          a.category.toLowerCase().includes(normalizedQuery)
      ).slice(0, 4)
    : [];

  const quickPicks = [
    { label: 'Rishikesh', href: '/places/rishikesh' },
    { label: 'Varanasi', href: '/places/varanasi' },
    { label: 'Spiti Valley', href: '/places/spiti-valley' },
    { label: 'Jaipur', href: '/places/jaipur' },
    { label: 'Munnar', href: '/places/munnar' },
    { label: 'Hampi', href: '/places/hampi' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF8F3] border border-[#E8E5DE] rounded-2xl shadow-2xl overflow-hidden text-[#202522]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 md:px-6 py-4 border-b border-[#E8E5DE] gap-3 bg-white">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Indian destinations, states, or stories (e.g. Varanasi, Spiti)..."
            className="w-full text-base bg-transparent focus:outline-none placeholder:text-stone-400 text-stone-900"
          />
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Quick links */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {!query && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-3">
                Popular Indian Explorations
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPicks.map((pick) => (
                  <Link
                    key={pick.label}
                    href={pick.href}
                    onClick={onClose}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-[#244C3A] hover:text-white rounded-lg text-xs font-medium text-stone-700 transition-colors"
                  >
                    {pick.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query && matchingDestinations.length === 0 && matchingArticles.length === 0 && (
            <div className="text-center py-8 text-stone-500">
              <Compass className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm">No results found for &ldquo;{query}&rdquo;.</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for Indian states like Uttarakhand, Rajasthan, Kerala, or Himachal Pradesh.
              </p>
            </div>
          )}

          {matchingDestinations.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38] block mb-3">
                Destinations
              </span>
              <div className="space-y-2">
                {matchingDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/places/${dest.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#244C3A] flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900 group-hover:text-[#244C3A]">
                          {dest.title}
                        </h4>
                        <span className="text-xs text-stone-500">{dest.state}, India</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {matchingArticles.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#244C3A] block mb-3">
                Travel Stories
              </span>
              <div className="space-y-2">
                {matchingArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/blog/${art.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900 group-hover:text-[#244C3A] line-clamp-1">
                          {art.title}
                        </h4>
                        <span className="text-xs text-stone-500">
                          {art.destination} · {art.readTime}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
