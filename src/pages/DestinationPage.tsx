import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  Plane,
  Train,
  Car,
  Bus,
  Coins,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { EnquiryModal } from '../components/booking/EnquiryModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { DESTINATIONS } from '../data/destinations';
import { TRAVEL_ARTICLES } from '../data/articles';
import { ArticleCard } from '../components/blog/ArticleCard';
import { Link } from '../router';
import { CONTACT_CONFIG } from '../config/contact';

interface DestinationPageProps {
  slug: string;
}

export function DestinationPage({ slug }: DestinationPageProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const destination = DESTINATIONS.find((d) => d.slug === slug) || DESTINATIONS[0];

  // Related articles
  const relatedArticles = TRAVEL_ARTICLES.filter(
    (a) => a.destinationSlug === destination.slug || a.stateSlug === destination.stateSlug
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-[#E8E5DE] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/destinations" className="hover:text-stone-900 transition-colors">Destinations</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/destinations/${destination.stateSlug}`} className="hover:text-stone-900 transition-colors">
              {destination.state}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-stone-900 font-medium">{destination.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[50vh] lg:min-h-[60vh] flex items-end overflow-hidden bg-[#1E2522] text-white">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src={destination.heroImage}
              alt={destination.heroImageAlt}
              aspectRatioClass="h-full w-full"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-28 w-full">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[#E0C99E] font-semibold mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {destination.state}, India
              </span>
              <span aria-hidden="true">·</span>
              <span>{destination.duration} Trip</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              {destination.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-stone-200 max-w-3xl font-light leading-relaxed">
              {destination.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="px-6 py-2.5 bg-[#B85C38] hover:bg-[#9B4C2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enquire About {destination.title}</span>
              </button>
              <a
                href={CONTACT_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold uppercase tracking-wider rounded-lg backdrop-blur-md border border-white/20 transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Introduction */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] mb-4">
                  About {destination.title}
                </h2>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light">
                  {destination.description}
                </p>
              </div>

              {/* Key Attractions */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
                  What to See & Experience
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202522] mb-6">
                  Top Attractions & Sights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.attractions.map((attraction, i) => (
                    <div
                      key={attraction.name}
                      className="p-5 bg-white border border-[#E8E5DE] rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-xs text-stone-400 block mb-1">
                          0{i + 1}.
                        </span>
                        <h3 className="font-serif text-base font-bold text-stone-900 mb-1.5">
                          {attraction.name}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {attraction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Day-by-Day Itinerary */}
              {destination.itinerary && destination.itinerary.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#244C3A] block mb-2">
                    Curated Flow
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#202522] mb-6">
                    Suggested {destination.duration} Itinerary
                  </h2>

                  <div className="space-y-4">
                    {destination.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="p-6 bg-white border border-[#E8E5DE] rounded-xl"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2.5 py-1 bg-[#244C3A] text-white text-xs font-mono font-bold rounded-md">
                            Day {day.day}
                          </span>
                          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                            {day.title}
                          </h3>
                        </div>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600 pl-4 list-disc marker:text-[#B85C38]">
                          {day.activities.map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How to Reach & Local Transport */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
                  Connectivity
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202522] mb-6">
                  How to Reach {destination.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-5 bg-white border border-[#E8E5DE] rounded-xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                      <Plane className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      By Air
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {destination.howToReach.byAir}
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-[#E8E5DE] rounded-xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Train className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      By Train
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {destination.howToReach.byTrain}
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-[#E8E5DE] rounded-xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      By Road
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {destination.howToReach.byRoad}
                    </p>
                  </div>
                </div>

                {/* Local transport */}
                <div className="p-4 bg-stone-100 rounded-xl text-xs text-stone-700 flex items-start gap-3">
                  <Bus className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-stone-900">Local Commute: </strong>
                    {destination.localTransport}
                  </div>
                </div>
              </div>

              {/* Practical Tips */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#202522] mb-4">
                  Musafir Field Tips
                </h2>
                <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-3">
                  {destination.practicalTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#244C3A] mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Trip Facts Card */}
              <div className="p-6 bg-white border border-[#E8E5DE] rounded-2xl shadow-xs space-y-5">
                <h3 className="font-serif text-lg font-bold text-[#202522] pb-3 border-b border-[#E8E5DE]">
                  Trip Essentials
                </h3>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                    Best Time to Visit
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-stone-800">
                    {destination.bestTimeToVisit.idealMonths}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5 font-light">
                    {destination.bestTimeToVisit.peakSeason}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                    Suggested Duration
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-stone-800">
                    {destination.duration}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                    Estimated Budget Range (Sample)
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-stone-800">
                    {destination.budgetRange}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="w-full py-3 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Plan Journey to {destination.title}</span>
                  </button>
                </div>
              </div>

              {/* Sample Disclaimer Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  <strong>Notice:</strong> Travel schedules, rail bookings, and seasonal conditions in India fluctuate. The details shown are curated sample guides.
                </p>
              </div>

              {/* WhatsApp direct assist */}
              <div className="p-5 bg-[#FAF8F3] border border-[#E8E5DE] rounded-xl space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Need Live Route Advice?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Message Desi Musafir on WhatsApp to consult regarding road conditions, homestay suggestions, or local guides.
                </p>
                <a
                  href={CONTACT_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>WhatsApp +91 {CONTACT_CONFIG.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Related Stories */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-white border-t border-[#E8E5DE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                  Field Dispatch
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202522]">
                  Stories Featuring {destination.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        preselectedDestination={`${destination.title}, ${destination.state}`}
      />
    </div>
  );
}
