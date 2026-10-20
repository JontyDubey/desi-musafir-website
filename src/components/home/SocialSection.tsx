import React from 'react';
import { Instagram, Facebook, Phone, MessageSquare, Mail, ArrowUpRight } from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

export function SocialSection() {
  return (
    <section className="py-16 bg-[#FAF8F3] border-t border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E8E5DE] rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
              Join Our Community
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
              Follow Desi Musafir
            </h3>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              Stay connected with daily travel reels, behind-the-scenes photography from Indian expeditions, and community route updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={CONTACT_CONFIG.social.instagramProfile1.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-[#FAF8F3] border border-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors group shadow-2xs"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Jonty Dubey</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
            </a>

            <a
              href={CONTACT_CONFIG.social.instagramProfile2.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-[#FAF8F3] border border-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors group shadow-2xs"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Desi Musafir India</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
            </a>

            <a
              href={CONTACT_CONFIG.social.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-[#FAF8F3] border border-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors group shadow-2xs"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook Page</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
            </a>

            <a
              href={CONTACT_CONFIG.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-medium rounded-lg transition-colors shadow-2xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
