import React from 'react';
import { ArrowRight, Mountain, Flame, Waves, Landmark, Car, Trees, Compass, UtensilsCrossed, Sparkles, Wallet, Gem, Users } from 'lucide-react';
import { Link } from '../../router';
import { TRAVEL_CATEGORIES } from '../../data/categories';

export function TravelStylesSection() {
  const iconMap: Record<string, React.ReactNode> = {
    'mountains-and-hill-stations': <Mountain className="w-5 h-5" />,
    'spiritual-journeys': <Flame className="w-5 h-5" />,
    'beaches-and-coastal-travel': <Waves className="w-5 h-5" />,
    'heritage-and-forts': <Landmark className="w-5 h-5" />,
    'road-trips': <Car className="w-5 h-5" />,
    'wildlife-and-nature': <Trees className="w-5 h-5" />,
    'adventure-and-trekking': <Compass className="w-5 h-5" />,
    'food-and-culture': <UtensilsCrossed className="w-5 h-5" />,
    'weekend-getaways': <Sparkles className="w-5 h-5" />,
    'budget-travel': <Wallet className="w-5 h-5" />,
    'hidden-gems': <Gem className="w-5 h-5" />,
    'family-travel': <Users className="w-5 h-5" />,
  };

  return (
    <section className="py-20 bg-white border-t border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
            Curated Themes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522]">
            Explore by Travel Style
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            Whether you seek high altitude solitude, sacred river rituals, royal forts, or authentic regional cuisines, discover journeys tailored to your spirit.
          </p>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRAVEL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group p-5 bg-[#FAF8F3] hover:bg-[#244C3A] border border-[#E8E5DE] hover:border-[#244C3A] rounded-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-stone-200/80 group-hover:bg-white/20 text-[#244C3A] group-hover:text-[#E0C99E] flex items-center justify-center mb-4 transition-colors">
                  {iconMap[cat.slug] || <Compass className="w-5 h-5" />}
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#202522] group-hover:text-white transition-colors mb-1.5 leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-600 group-hover:text-stone-300 transition-colors line-clamp-2 leading-relaxed">
                  {cat.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 group-hover:border-white/10 flex items-center justify-between text-xs font-medium text-[#244C3A] group-hover:text-[#E0C99E] transition-colors">
                <span>Explore Circuit</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
