import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Filter, Camera, RotateCcw, Eye } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { Lightbox } from '../components/gallery/Lightbox';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { GALLERY_PHOTOS, GALLERY_CATEGORIES } from '../data/gallery';
import { INDIAN_STATES } from '../data/destinations';
import { GalleryPhoto } from '../types';
import { getPublishedGalleryPhotos } from '../services/firestoreService';
import { Link } from '../router';

export function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getPublishedGalleryPhotos().then((livePhotos) => {
      if (mounted && livePhotos.length > 0) {
        setPhotos(livePhotos);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch =
        searchQuery === '' ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.caption.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || photo.categorySlug === selectedCategory;

      const matchesState =
        selectedState === 'all' || photo.state === selectedState;

      return matchesSearch && matchesCat && matchesState;
    });
  }, [searchQuery, selectedCategory, selectedState]);

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
        {/* Gallery Hero Banner */}
        <section className="bg-[#202522] text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#E0C99E] text-xs uppercase tracking-widest font-semibold mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>India In Frames</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Frames of Incredible India
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
              A curated photographic gallery of timeless Indian landscapes, holy riverbanks, architectural marvels, and candid mountain scenes.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E5DE] py-4 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Segmented Scroll */}
              <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {GALLERY_CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#244C3A] text-white shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Search & State Filter */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search photo or location..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
                >
                  <option value="all">All States</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {hasFilters && (
                  <button
                    onClick={handleReset}
                    title="Reset filters"
                    className="p-1.5 text-stone-500 hover:text-stone-900 bg-stone-100 rounded-lg shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
            <span>
              Displaying <strong className="text-stone-800">{filteredPhotos.length}</strong> photographs
            </span>
            <Link href="/admin/gallery" className="text-xs font-semibold text-[#244C3A] hover:underline">
              Curator & Upload Portal (Admin Demo) &rarr;
            </Link>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E8E5DE] rounded-2xl p-8 max-w-lg mx-auto">
              <Camera className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                No frames match your selection
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Try selecting &ldquo;All Frames&rdquo; or clearing your location search.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#244C3A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1E3B2E] transition-colors"
              >
                Reset Gallery
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white rounded-xl border border-[#E8E5DE] overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={photo.imageUrl}
                      alt={photo.altText}
                      aspectRatioClass={
                        photo.orientation === 'portrait'
                          ? 'aspect-[3/4]'
                          : photo.orientation === 'square'
                          ? 'aspect-square'
                          : 'aspect-[16/10]'
                      }
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-xs flex items-center gap-1.5 text-xs font-medium">
                        <Eye className="w-4 h-4" />
                        <span>View Lightbox</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-[#B85C38] font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>{photo.destination}, {photo.state}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#202522] leading-tight">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 pt-0.5">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Lightbox
        photo={selectedPhoto}
        photos={filteredPhotos}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={(p) => setSelectedPhoto(p)}
      />
    </div>
  );
}
