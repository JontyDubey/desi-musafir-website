import React, { useState, useMemo, useEffect } from 'react';
import { Search, RotateCcw, BookOpen, Compass } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { ArticleCard } from '../components/blog/ArticleCard';
import { TRAVEL_ARTICLES } from '../data/articles';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { INDIAN_STATES } from '../data/destinations';
import { TravelArticle } from '../types';
import { getPublishedArticles } from '../services/firestoreService';
import { useRouter } from '../router';

export function BlogPage() {
  const { searchParams } = useRouter();
  const initialCat = searchParams.get('category') || 'all';

  const [articles, setArticles] = useState<TravelArticle[]>(TRAVEL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedState, setSelectedState] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getPublishedArticles().then((liveArticles) => {
      if (mounted && liveArticles.length > 0) {
        setArticles(liveArticles);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        searchQuery === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || art.categorySlug === selectedCategory;

      const matchesState =
        selectedState === 'all' || art.stateSlug === selectedState;

      return matchesSearch && matchesCat && matchesState;
    });
  }, [searchQuery, selectedCategory, selectedState]);

  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedState('all');
  };

  const hasFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedState !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Editorial Page Header */}
        <section className="bg-[#202522] text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-widest text-[#E0C99E] font-semibold block mb-2">
              Dispatches & Essays
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Desi Musafir Travel Chronicles
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
              In-depth travel narratives, photo essays, and slow journeys exploring India’s heritage, peaks, and living cultures.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E5DE] py-4 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles & stories..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
                >
                  <option value="all">All Story Categories</option>
                  {TRAVEL_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
                >
                  <option value="all">All Indian States</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {hasFilters && (
                  <button
                    onClick={handleReset}
                    title="Reset filters"
                    className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg shrink-0 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E8E5DE] rounded-2xl p-8 max-w-lg mx-auto">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                No matching articles found
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Try searching for other terms or clearing category filters.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#244C3A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1E3B2E] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Highlight first article with horizontal card */}
              {featured && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-3">
                    Featured Dispatch
                  </span>
                  <ArticleCard article={featured} layout="horizontal" />
                </div>
              )}

              {/* Grid of remaining articles */}
              {rest.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-6">
                    Latest Chronicles
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rest.map((art) => (
                      <ArticleCard key={art.id} article={art} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
