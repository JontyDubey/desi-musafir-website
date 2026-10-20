import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../router';
import { DESTINATIONS } from '../../data/destinations';
import { DestinationCard } from '../destinations/DestinationCard';

export function DestinationGrid() {
  const featured = DESTINATIONS.slice(0, 6);

  return (
    <section className="py-20 bg-[#FAF8F3] border-t border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
              Explore India by Destination
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522]">
              Iconic Lands, Holy Ghats & Highland Escapes
            </h2>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <span>Discover All Indian States & Places</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
