import React, { useState } from 'react';
import { Search, Compass, ArrowRight, MapPin } from 'lucide-react';
import { Link, useRouter } from '../../router';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface HeroSectionProps {
  onOpenEnquiry?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenEnquiry }) => {
  const [searchInput, setSearchInput] = useState('');
  const { navigate } = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/destinations?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  const trendingTags = [
    { label: 'Rishikesh', href: '/places/rishikesh' },
    { label: 'Spiti Valley', href: '/places/spiti-valley' },
    { label: 'Varanasi', href: '/places/varanasi' },
    { label: 'Hampi', href: '/places/hampi' },
    { label: 'Munnar', href: '/places/munnar' },
  ];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1E2522] text-white">
      {/* Background Indian Destination Imagery */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=85"
          alt="Emerald Ganges river valley and foothills of the Himalayas in Uttarakhand, India"
          aspectRatioClass="h-full w-full"
          className="h-full w-full object-cover scale-105 transform motion-safe:transition-transform motion-safe:duration-10000 motion-safe:hover:scale-100"
        />
        {/* Measured Scrim for WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/35" />
        <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-black/20 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E0C99E] text-xs uppercase tracking-widest font-medium mb-6">
          <Compass className="w-3.5 h-3.5" />
          <span>India Exclusively · Curated Journeys</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] text-balance">
          Discover India, <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#E0C99E]">One Journey</span> at a Time.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-stone-200 max-w-2xl mx-auto font-light leading-relaxed">
          Explore India’s hidden gems, timeless heritage, mountain escapes, and unforgettable journeys with Desi Musafir.
        </p>

        {/* Search input bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-xl border border-white/30 transition-all focus-within:ring-2 focus-within:ring-[#C5A46D]"
          >
            <div className="pl-3 pr-2 text-stone-500">
              <MapPin className="w-5 h-5 text-[#B85C38]" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by state or place (e.g. Kedarnath, Jaipur)..."
              className="w-full text-stone-900 text-sm md:text-base py-2 focus:outline-none bg-transparent placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs md:text-sm font-semibold rounded-lg transition-colors shrink-0 uppercase tracking-wider"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick search tags */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-stone-300">
            <span className="text-stone-400 font-medium">Trending:</span>
            {trendingTags.map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="hover:text-[#E0C99E] underline underline-offset-4 transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/destinations"
            className="w-full sm:w-auto px-7 py-3 bg-[#B85C38] hover:bg-[#9B4C2E] text-white font-medium text-sm rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>Explore Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg backdrop-blur-md border border-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <span>Read Travel Stories</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
