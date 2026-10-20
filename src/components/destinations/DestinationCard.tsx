import React from 'react';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { Destination } from '../../types';
import { Link } from '../../router';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-[#E8E5DE] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-stone-300">
      <div>
        {/* Destination Image with 4:3 Aspect Ratio */}
        <Link href={`/places/${destination.slug}`} className="block relative overflow-hidden">
          <ImageWithFallback
            src={destination.heroImage}
            alt={destination.heroImageAlt || `${destination.title}, ${destination.state}, India`}
            aspectRatioClass="aspect-[4/3]"
            className="group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Card Content */}
        <div className="p-6">
          {/* Metadata line with typographic separators (anti-slop zero-pill) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="flex items-center gap-1 text-[#B85C38] font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {destination.state}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {destination.duration}
            </span>
          </div>

          <h3 className="font-serif text-xl font-bold text-[#202522] group-hover:text-[#244C3A] transition-colors line-clamp-1 mb-2">
            <Link href={`/places/${destination.slug}`}>
              {destination.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {destination.excerpt}
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-6 pt-2 border-t border-[#F2EFE9] flex items-center justify-between">
        <span className="text-[11px] text-stone-400 font-medium">
          India Exclusively
        </span>
        <Link
          href={`/places/${destination.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors"
        >
          <span>Explore Guide</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
