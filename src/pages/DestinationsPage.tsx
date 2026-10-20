import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, RotateCcw, Compass } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { DESTINATIONS, INDIAN_STATES } from '../data/destinations';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { useRouter } from '../router';

export function DestinationsPage() {
  const { searchParams } = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialState = searchParams.get('state') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'name'>('featured');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtered & sorted destinations
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      const matchesSearch =
        searchQuery === '' ||
        dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        selectedState === 'all' || dest.stateSlug === selectedState;

      const matchesCategory =
        selectedCategory === 'all' || dest.categorySlugs.includes(selectedCategory);

      return matchesSearch && matchesState && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      return a.title.localeCompare(b.title);
    });
  }, [searchQuery, selectedState, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery !== '' || selectedState !== 'all' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Page Hero Banner */}
        <section className="bg-[#244C3A] text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-widest text-[#E0C99E] font-semibold block mb-2">
              Incredible India · 100% Exclusive
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold max-w-3xl mx-auto">
              Destinations Across India
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-200 max-w-2xl mx-auto font-light leading-relaxed">
              From the sacred river ghats of Kashi and high Himalayan passes of Spiti to sunlit Thar sand dunes and backwaters of Kerala.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E5DE] py-4 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Indian places..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              {/* State filter */}
              <div>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
                >
                  <option value="all">All Indian States / UTs</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st.slug} value={st.slug}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
                >
                  <option value="all">All Travel Categories</option>
                  {TRAVEL_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'featured' | 'name')}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
                >
                  <option value="featured">Sort: Curated Featured</option>
                  <option value="name">Sort: Alphabetical (A-Z)</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    title="Reset all filters"
                    className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg shrink-0 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Destination Listing Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-800">{filteredDestinations.length}</strong> Indian destinations
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[#B85C38] hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E8E5DE] rounded-2xl p-8 max-w-lg mx-auto">
              <Compass className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                No matching Indian destinations
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                We couldn&apos;t find places matching your current search query or filter combination.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#244C3A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1E3B2E] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
