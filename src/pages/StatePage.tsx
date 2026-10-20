import React, { useState } from 'react';
import { ArrowLeft, MapPin, Compass, BookOpen, Layers } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { ArticleCard } from '../components/blog/ArticleCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { INDIAN_STATES, DESTINATIONS } from '../data/destinations';
import { TRAVEL_ARTICLES } from '../data/articles';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { Link, useRouter } from '../router';

interface StatePageProps {
  stateSlug: string;
}

export function StatePage({ stateSlug }: StatePageProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const state = INDIAN_STATES.find((s) => s.slug === stateSlug) || {
    name: stateSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: stateSlug,
    zone: 'North' as const,
    capital: 'State Capital',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    description: `Discover the breathtaking landscapes, ancient traditions, and vibrant cultures across ${stateSlug.replace(/-/g, ' ')}, India.`,
    destinationsCount: 4,
  };

  const stateDestinations = DESTINATIONS.filter((d) => d.stateSlug === stateSlug);
  const stateArticles = TRAVEL_ARTICLES.filter((a) => a.stateSlug === stateSlug);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-[#E8E5DE] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/destinations" className="hover:text-stone-900 transition-colors">Destinations</Link>
            <span aria-hidden="true">/</span>
            <span className="text-stone-900 font-medium">{state.name}</span>
          </div>
        </div>

        {/* State Hero Banner */}
        <section className="relative min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#1E2522] text-white">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src={state.heroImage}
              alt={`${state.name}, India`}
              aspectRatioClass="h-full w-full"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#E0C99E] text-xs uppercase tracking-widest font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{state.zone} India · Capital: {state.capital}</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              {state.name}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-200 max-w-2xl mx-auto font-light leading-relaxed">
              {state.description}
            </p>
          </div>
        </section>

        {/* Popular Destinations in this State */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                Regional Highlights
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
                Popular Destinations in {state.name}
              </h2>
            </div>
            <Link
              href="/destinations"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#244C3A] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Destinations</span>
            </Link>
          </div>

          {stateDestinations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E8E5DE] p-6 text-stone-500">
              <Compass className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="text-sm">More destination guides for {state.name} are being documented by Desi Musafir.</p>
              <Link href="/destinations" className="mt-3 inline-block text-xs font-semibold text-[#244C3A] underline">
                Browse other Indian destinations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stateDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </section>

        {/* Related Travel Stories in this Region */}
        {stateArticles.length > 0 && (
          <section className="py-16 bg-white border-t border-[#E8E5DE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                  Editorial Stories
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
                  Stories & Chronicles from {state.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stateArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Relevant Travel Categories */}
        <section className="py-16 bg-[#FAF8F3] border-t border-[#E8E5DE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                Explore More of India
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#202522]">
                Explore Other Indian Travel Circuits
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {TRAVEL_CATEGORIES.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 bg-white hover:bg-[#244C3A] text-stone-700 hover:text-white border border-[#E8E5DE] rounded-lg text-xs font-medium transition-colors shadow-2xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
