import React from 'react';
import { Compass, Phone, Mail, MessageSquare, Instagram, Facebook, Shield, ArrowUpRight } from 'lucide-react';
import { Link } from '../../router';
import { CONTACT_CONFIG } from '../../config/contact';
import { NewsletterSignup } from './NewsletterSignup';

export function Footer() {
  return (
    <footer className="bg-[#202522] text-[#FAF8F3] pt-16 pb-12 border-t border-[#313834]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Signup Section */}
        <NewsletterSignup />

        {/* Top brand grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-serif font-bold text-white group">
              <span className="w-8 h-8 rounded-full bg-[#C5A46D] text-[#202522] flex items-center justify-center transition-transform group-hover:rotate-45">
                <Compass className="w-4 h-4" />
              </span>
              <span>Desi Musafir</span>
            </Link>
            <p className="text-sm text-stone-300 max-w-sm leading-relaxed">
              Discover India, One Journey at a Time. A premium Indian travel discovery platform, editorial magazine, and photography collective exploring India exclusively.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] block mb-2">
                Connect Directly
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={CONTACT_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#244C3A] hover:bg-[#2F634B] text-white text-xs rounded-md transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={CONTACT_CONFIG.phoneTel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-md transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>+91 {CONTACT_CONFIG.phone}</span>
                </a>
                <a
                  href={CONTACT_CONFIG.emailMailto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-md transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#B85C38]" />
                  <span>{CONTACT_CONFIG.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D]">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Travel Stories & Guides
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Frames of Incredible India
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Desi Musafir
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Indian Regions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D]">
              Featured States
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/destinations/uttarakhand" className="hover:text-white transition-colors">
                  Uttarakhand (Devbhoomi)
                </Link>
              </li>
              <li>
                <Link href="/destinations/himachal-pradesh" className="hover:text-white transition-colors">
                  Himachal Pradesh
                </Link>
              </li>
              <li>
                <Link href="/destinations/rajasthan" className="hover:text-white transition-colors">
                  Rajasthan Forts & Desert
                </Link>
              </li>
              <li>
                <Link href="/destinations/uttar-pradesh" className="hover:text-white transition-colors">
                  Uttar Pradesh (Kashi)
                </Link>
              </li>
              <li>
                <Link href="/destinations/kerala" className="hover:text-white transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Social Media Profiles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D]">
              Follow Desi Musafir
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <a
                  href={CONTACT_CONFIG.social.instagramProfile1.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md bg-stone-800/80 hover:bg-stone-800 text-stone-200 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Jonty Dubey</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_CONFIG.social.instagramProfile2.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md bg-stone-800/80 hover:bg-stone-800 text-stone-200 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Desi Musafir India</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_CONFIG.social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md bg-stone-800/80 hover:bg-stone-800 text-stone-200 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Facebook className="w-3.5 h-3.5 text-blue-400" />
                    <span>Desi Musafir (Facebook)</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype notice & legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C5A46D]" />
            <span>
              © {new Date().getFullYear()} Desi Musafir. Dedicated exclusively to Indian travel discovery.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="text-stone-400">
              Free-First Frontend (Step 1 Prototype)
            </span>
            <Link href="/admin/login" className="text-stone-300 hover:text-white transition-colors underline underline-offset-4">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
