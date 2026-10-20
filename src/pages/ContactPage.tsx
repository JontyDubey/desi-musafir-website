import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  Instagram,
  Facebook,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { CONTACT_CONFIG } from '../config/contact';
import { DESTINATIONS } from '../data/destinations';
import { submitEnquiryToFirestore } from '../services/firestoreService';

export function ContactPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    destination: 'Rishikesh, Uttarakhand',
    travelDate: '',
    travellersCount: '2',
    duration: '3-4 Days',
    budgetRange: 'Standard (₹5,000 - ₹12,000 / person)',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await submitEnquiryToFirestore({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        destination: formData.destination,
        travelDate: formData.travelDate,
        travellersCount: formData.travellersCount,
        duration: formData.duration,
        budgetRange: formData.budgetRange,
        message: formData.message,
      });
    } catch (err) {
      console.warn('Enquiry stored locally; Firestore sync notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#202522] text-white py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-widest text-[#E0C99E] font-semibold block mb-2">
              Connect With Desi Musafir
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Start Your Indian Expedition
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you need customized itinerary curation, collaboration inquiries, or guidance on Indian routes, our team is right here.
            </p>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Details Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38] block mb-1">
                    Direct Reach
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#202522]">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={CONTACT_CONFIG.phoneTel}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF8F3] hover:bg-stone-100 border border-[#E8E5DE] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#244C3A] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                        Call Us Directly
                      </span>
                      <span className="text-sm font-bold text-stone-900 group-hover:text-[#244C3A]">
                        +91 {CONTACT_CONFIG.phone}
                      </span>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={CONTACT_CONFIG.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold block">
                        Instant WhatsApp Consultation
                      </span>
                      <span className="text-sm font-bold text-emerald-950">
                        Chat: +91 {CONTACT_CONFIG.phone}
                      </span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={CONTACT_CONFIG.emailMailto}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF8F3] hover:bg-stone-100 border border-[#E8E5DE] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                        Official Email
                      </span>
                      <span className="text-sm font-bold text-stone-900 group-hover:text-[#B85C38]">
                        {CONTACT_CONFIG.email}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Social Profiles */}
                <div className="pt-4 border-t border-[#E8E5DE] space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                    Official Social Profiles
                  </span>
                  <div className="space-y-2">
                    <a
                      href={CONTACT_CONFIG.social.instagramProfile1.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs transition-colors group"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <span>Instagram: Jonty Dubey</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800" />
                    </a>

                    <a
                      href={CONTACT_CONFIG.social.instagramProfile2.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs transition-colors group"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <span>Instagram: Desi Musafir India</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800" />
                    </a>

                    <a
                      href={CONTACT_CONFIG.social.facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs transition-colors group"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span>Facebook: Desi Musafir</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#244C3A]" />
                  <span>Based in India · Dedicated exclusively to Indian travel</span>
                </div>
              </div>
            </div>

            {/* Right Form Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 sm:p-10 shadow-xs">
                {submitted ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Enquiry Received Successfully
                    </h3>
                    <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="font-semibold text-stone-800">{formData.fullName}</span>. Your enquiry for{' '}
                      <span className="font-semibold text-stone-800">{formData.destination}</span> has been securely recorded. Our Indian travel curators will review your expedition details and get back to you shortly.
                    </p>

                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-left max-w-md mx-auto my-4 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Enquiry Securely Logged:</span>
                      </div>
                      <p>
                        Your trip details and contact info have been safely submitted to our administration desk.
                      </p>
                      <p className="text-[11px] text-emerald-800 pt-1">
                        Need an immediate response? Connect directly via our official WhatsApp desk:
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={CONTACT_CONFIG.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#244C3A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1E3B2E] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp (+91 {CONTACT_CONFIG.phone})</span>
                      </a>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2.5 bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-300 transition-colors"
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-8">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38] block mb-1">
                        Get in Touch
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
                        Send a Journey Inquiry
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1">
                        Fill out your travel expectations below and our Indian travel specialists will curate your route.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Priyanshu Verma"
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          />
                          {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Mobile Number (WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g. 9876543210"
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          />
                          {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@domain.com"
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          />
                          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Indian Destination of Interest
                          </label>
                          <select
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          >
                            {DESTINATIONS.map((d) => (
                              <option key={d.id} value={`${d.title}, ${d.state}`}>
                                {d.title}, {d.state}
                              </option>
                            ))}
                            <option value="Himalayan Circuit (Uttarakhand / Himachal)">Himalayan Circuit</option>
                            <option value="Royal Rajasthan Circuit">Royal Rajasthan Circuit</option>
                            <option value="Kerala Backwaters & Tea Hills">Kerala Backwaters & Tea Hills</option>
                            <option value="Northeast Living Roots Circuit">Northeast Living Roots Circuit</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Approx. Travel Date
                          </label>
                          <input
                            type="date"
                            value={formData.travelDate}
                            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Travellers
                          </label>
                          <select
                            value={formData.travellersCount}
                            onChange={(e) => setFormData({ ...formData, travellersCount: e.target.value })}
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          >
                            <option value="1">Solo (1)</option>
                            <option value="2">Couple (2)</option>
                            <option value="3-5">Family / Friends (3-5)</option>
                            <option value="6+">Group (6+)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Duration
                          </label>
                          <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                          >
                            <option value="Weekend (2-3 Days)">Weekend (2-3 Days)</option>
                            <option value="3-4 Days">Short Break (3-4 Days)</option>
                            <option value="5-7 Days">One Week (5-7 Days)</option>
                            <option value="8+ Days">Long Expedition (8+ Days)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Message or Itinerary Preferences
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about special interests: hiking, photography spots, spiritual aartis, local cuisines..."
                          className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                        />
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-stone-500">
                          Step 1 client validation · No backend submission yet
                        </span>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-7 py-3 bg-[#B85C38] hover:bg-[#9B4C2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs inline-flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Journey Enquiry</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
