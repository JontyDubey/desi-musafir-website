import React, { useState } from 'react';
import { Compass, ShieldCheck, Heart, MapPin, ArrowRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Link } from '../router';
import { CONTACT_CONFIG } from '../config/contact';

export function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-[#244C3A] text-white py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-widest text-[#E0C99E] font-semibold block mb-2">
              Our Story & Manifesto
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              India Is More Than a Destination. <br />
              <span className="italic font-normal text-[#E0C99E]">It&apos;s a Journey.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-stone-200 max-w-2xl mx-auto font-light leading-relaxed">
              Desi Musafir was founded on a singular conviction: that the vast, vibrant, and timeless land of India holds infinite depths for those who travel with intention and reverence.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 font-light text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
              Why We Travel Exclusively in India
            </h2>
            <p>
              In a world crowded with bucket-list checklists and rushed travel itineraries, <strong>Desi Musafir</strong> is a dedicated homage to slow, conscious exploration across India. From the mist-shrouded cedar forests of Uttarakhand to the quiet backwaters of Kerala and the living forts of Rajasthan, every corner of our subcontinent holds centuries of living memory.
            </p>
            <p>
              We believe a journey through India is not merely about visiting geographic coordinates; it is about listening to morning chants on the riverbanks, savoring cardamom chai poured in terracotta kulhads, and learning from local village custodians who protect centuries-old living traditions.
            </p>

            <blockquote className="my-8 p-6 bg-white border border-[#E8E5DE] rounded-xl font-serif italic text-xl text-stone-800 shadow-2xs">
              &ldquo;Discover India, One Journey at a Time. Real exploration begins when we pause to understand the people, the soil, and the stories beneath our feet.&rdquo;
              <cite className="text-xs uppercase tracking-widest text-[#B85C38] not-italic block mt-3 font-sans font-semibold">
                — Jonty Dubey, Founder
              </cite>
            </blockquote>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] pt-6">
              Our Core Guiding Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose my-8">
              <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#244C3A] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  100% India-Only
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  No international distractions. Our entire research, editorial writing, and photography are exclusively dedicated to Indian soil.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#B85C38] flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Responsible Travel
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  We champion zero-waste habits in fragile Himalayan ecosystems and support locally owned homestays and community guides.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2">
                <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Authentic Storytelling
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Original field dispatches, real photography, and practical itineraries tested on Indian roads and railways.
                </p>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] pt-6">
              Connect with Our Team
            </h2>
            <p>
              Have a story from your Indian travels? Looking for advice on planning an upcoming journey across Uttarakhand, Himachal, or Rajasthan? We welcome your questions and ideas.
            </p>

            <div className="not-prose pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={CONTACT_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
