import React from 'react';
import { ArrowRight, MapPin, Calendar, Compass } from 'lucide-react';
import { Link } from '../../router';
import { DESTINATIONS } from '../../data/destinations';
import { ImageWithFallback } from '../common/ImageWithFallback';

export function FeaturedDestination() {
  const destination = DESTINATIONS.find((d) => d.slug === 'varanasi') || DESTINATIONS[0];

  return (
    <section className="py-20 bg-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
              Editorial Destination of the Month
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#202522]">
              The Timeless Riverfront of Kashi
            </h2>
          </div>
          <Link
            href={`/places/${destination.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors group"
          >
            <span>Read Complete Destination Guide</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2-Column Split Feature Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#E8E5DE] rounded-2xl overflow-hidden shadow-xs">
          {/* Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px]">
            <ImageWithFallback
              src={destination.heroImage}
              alt={destination.heroImageAlt}
              aspectRatioClass="h-full w-full"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#244C3A]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Cultural & Spiritual Heart</span>
            </div>
          </div>

          {/* Editorial Content (5 cols) */}
          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1 text-[#B85C38]">
                  <MapPin className="w-3.5 h-3.5" />
                  {destination.state}, India
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  Best: {destination.bestTimeToVisit.idealMonths}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] leading-tight">
                {destination.title}
              </h3>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                {destination.description}
              </p>

              {/* Highlights List */}
              <div className="pt-2 border-t border-[#E8E5DE] space-y-2.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-700 block">
                  Signature Highlights
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                  {destination.attractions.slice(0, 3).map((attr) => (
                    <li key={attr.name} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-stone-800">{attr.name}:</strong> {attr.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                Duration: <strong className="text-stone-700">{destination.duration}</strong>
              </span>
              <Link
                href={`/places/${destination.slug}`}
                className="px-5 py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>Explore {destination.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
