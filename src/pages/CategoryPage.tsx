import React, { useState } from 'react';
import { ArrowLeft, Compass, MapPin, BookOpen } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { ArticleCard } from '../components/blog/ArticleCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { DESTINATIONS } from '../data/destinations';
import { TRAVEL_ARTICLES } from '../data/articles';
import { Link } from '../router';

interface CategoryPageProps {
  slug: string;
}

export function CategoryPage({ slug }: CategoryPageProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const category = TRAVEL_CATEGORIES.find((c) => c.slug === slug) || {
    id: 'unknown',
    slug,
    name: slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    tagline: 'Curated Indian Travel Circuit',
    description: 'Explore Indian destinations and journeys tailored to this theme.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  };

  const matchingDestinations = DESTINATIONS.filter((d) => d.categorySlugs.includes(slug));
  const matchingArticles = TRAVEL_ARTICLES.filter((a) => a.categorySlug === slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-[#E8E5DE] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/destinations" className="hover:text-stone-900 transition-colors">Categories</Link>
            <span aria-hidden="true">/</span>
            <span className="text-stone-900 font-medium">{category.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center bg-[#244C3A] text-white overflow-hidden py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#E0C99E] font-semibold block mb-2">
              Indian Travel Theme
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              {category.name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-stone-200 max-w-xl mx-auto font-light">
              {category.tagline}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>
        </section>

        {/* Matching Destinations */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                Featured Places
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
                Destinations in {category.name}
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

          {matchingDestinations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E8E5DE] p-6 text-stone-500">
              <Compass className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="text-sm">We are currently curating more destinations under {category.name}.</p>
              <Link href="/destinations" className="mt-3 inline-block text-xs font-semibold text-[#244C3A] underline">
                Explore other Indian places
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchingDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </section>

        {/* Matching Stories */}
        {matchingArticles.length > 0 && (
          <section className="py-16 bg-white border-t border-[#E8E5DE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                  Stories
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202522]">
                  Chronicles on {category.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {matchingArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
