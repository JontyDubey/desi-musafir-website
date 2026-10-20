import React, { useState } from 'react';
import { Send, Compass, MessageSquare, PhoneCall, ShieldCheck } from 'lucide-react';
import { EnquiryModal } from '../booking/EnquiryModal';
import { CONTACT_CONFIG } from '../../config/contact';

export function PlanJourneySection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-20 bg-[#244C3A] text-white relative overflow-hidden">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#2F634B]/60 via-transparent to-black/30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#E0C99E] text-xs uppercase tracking-widest font-semibold mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Bespoke Indian Expeditions</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Plan Your Next Unforgettable Indian Journey
        </h2>

        <p className="mt-4 text-sm sm:text-base text-stone-200 max-w-2xl mx-auto font-light leading-relaxed">
          From mountain retreats in Uttarakhand and cold deserts of Spiti to royal palaces in Rajasthan and spiritual corridors of Kashi — let us help you craft an authentic travel itinerary.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#B85C38] hover:bg-[#9B4C2E] text-white font-medium text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-colors shadow-lg inline-flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Travel Enquiry</span>
          </button>

          <a
            href={CONTACT_CONFIG.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm uppercase tracking-wider rounded-lg backdrop-blur-md border border-white/20 transition-colors inline-flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#C5A46D]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
            100% India-Only Travel Specialization
          </span>
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-[#C5A46D]" />
            Direct Consultation: +91 {CONTACT_CONFIG.phone}
          </span>
        </div>
      </div>

      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
