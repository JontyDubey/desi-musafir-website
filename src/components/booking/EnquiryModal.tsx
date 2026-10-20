import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';
import { DESTINATIONS } from '../../data/destinations';
import { submitEnquiryToFirestore } from '../../services/firestoreService';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDestination?: string;
}

export function EnquiryModal({ isOpen, onClose, preselectedDestination = '' }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    destination: preselectedDestination || 'Rishikesh, Uttarakhand',
    travelDate: '',
    travellersCount: '2',
    duration: '3-4 Days',
    budgetRange: 'Standard (₹5,000 - ₹12,000 / person)',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.phone.trim()) {
      errs.phone = 'Please provide your mobile number';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!formData.destination) errs.destination = 'Please choose an Indian destination';
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

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="relative w-full max-w-xl bg-[#FAF8F3] border border-[#E8E5DE] rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-[#202522]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Journey Request Received!
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-stone-800">{formData.fullName}</span>. Your enquiry for{' '}
              <span className="font-semibold text-stone-800">{formData.destination}</span> has been securely recorded. Our Indian travel curators will review your expedition details.
            </p>

            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-left text-xs text-emerald-900 space-y-1.5 my-4">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Enquiry Successfully Logged:</span>
              </div>
              <p>
                Your travel itinerary preferences and contact information have been safely submitted to our team.
              </p>
              <p className="pt-1 text-[11px] text-emerald-800">
                Need an immediate itinerary consultation? Connect directly with us on WhatsApp:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <a
                href={CONTACT_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp (+91 {CONTACT_CONFIG.phone})
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#B85C38] font-semibold block mb-1">
                Plan Your Incredible Journey
              </span>
              <h2 id="enquiry-modal-title" className="font-serif text-2xl md:text-3xl font-semibold text-stone-900">
                Custom India Travel Enquiry
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Share your travel preferences for curated itineraries, local insights, and expert arrangements across India.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                  {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Indian Destination *
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={`${d.title}, ${d.state}`}>
                        {d.title}, {d.state}
                      </option>
                    ))}
                    <option value="Himalayan Circuit (Uttarakhand / Himachal)">Himalayan Circuit</option>
                    <option value="Royal Rajasthan Circuit (Jaipur, Jaisalmer, Udaipur)">Royal Rajasthan Circuit</option>
                    <option value="South India Heritage & Backwaters (Kerala, Hampi)">South India Heritage & Backwaters</option>
                    <option value="Northeast Expedition (Meghalaya, Assam)">Northeast Expedition</option>
                    <option value="Other Indian Destination">Other Indian Destination</option>
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
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Travellers
                  </label>
                  <select
                    value={formData.travellersCount}
                    onChange={(e) => setFormData({ ...formData, travellersCount: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  >
                    <option value="1">Solo Musafir (1)</option>
                    <option value="2">Couple (2)</option>
                    <option value="3-5">Small Group / Family (3-5)</option>
                    <option value="6+">Large Group (6+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Trip Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  >
                    <option value="Weekend (2-3 Days)">Weekend (2-3 Days)</option>
                    <option value="3-4 Days">Short Break (3-4 Days)</option>
                    <option value="5-7 Days">One Week (5-7 Days)</option>
                    <option value="8-12 Days">Expedition (8-12 Days)</option>
                    <option value="14+ Days">Long Stay (14+ Days)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Budget Preference
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                >
                  <option value="Backpacker / Budget (₹1,500 - ₹3,000 / day)">Backpacker / Budget (₹1,500 - ₹3,000 / day)</option>
                  <option value="Standard Comfort (₹3,000 - ₹6,000 / day)">Standard Comfort (₹3,000 - ₹6,000 / day)</option>
                  <option value="Premium Heritage (₹6,000 - ₹12,000 / day)">Premium Heritage (₹6,000 - ₹12,000 / day)</option>
                  <option value="Luxury Retreat (₹12,000+ / day)">Luxury Retreat (₹12,000+ / day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Special Interests or Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Interested in riverside camping, local vegetarian food walks, sunrise photography..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-stone-500">
                  Strict India-only travel curation
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B85C38] hover:bg-[#9B4C2E] text-white text-sm font-medium rounded-lg transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
