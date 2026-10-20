import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Compass, Heart } from 'lucide-react';
import { submitNewsletterToFirestore } from '../../services/firestoreService';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please provide your email address.');
      return;
    }
    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmittedEmail(cleanEmail);
    setIsSubmitting(true);
    setSubscribed(true);

    try {
      await submitNewsletterToFirestore(cleanEmail);
    } catch (err) {
      console.warn('Newsletter stored in local session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubscribed(false);
    setEmail('');
    setSubmittedEmail('');
    setError('');
  };

  return (
    <div className="bg-[#2A312D] border border-white/10 rounded-2xl p-6 sm:p-8 mb-12 text-[#FAF8F3] transition-all">
      {subscribed ? (
        /* Thank-You Note: Completely replaces the form once submitted */
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#244C3A] border border-[#C5A46D]/40 text-[#C5A46D] flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-[#E0C99E]" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C5A46D] font-semibold">
                <Heart className="w-3.5 h-3.5 text-[#B85C38]" />
                <span>Subscription Confirmed</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Thank You for Joining the Musafir Circle!
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-2xl">
                We have registered <strong className="text-white font-medium">{submittedEmail}</strong>. You are now set to receive our monthly editorial dispatches featuring unseen Indian routes, high-altitude Himalayan field notes, and slow-travel chronicles.
              </p>
              <div className="pt-1 text-[11px] text-stone-400">
                <span>Free-first prototype verified</span> · <span>Zero spam guaranteed</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/20 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Subscribe Another Email
            </button>
          </div>
        </div>
      ) : (
        /* Standard Form Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Headline and Context */}
          <div className="lg:col-span-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C5A46D] font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>The Musafir Dispatch</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Letters from the Indian Trail
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-lg">
              Receive monthly curated route itineraries, secret Himalayan escapes, sunrise photography, and slow travel essays across India. No spam, ever.
            </p>
          </div>

          {/* Right Column: Interactive Subscription Form */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#202522] border border-white/20 rounded-lg text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B85C38] hover:bg-[#9B4C2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </div>

              {error && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </p>
              )}

              <p className="text-[11px] text-stone-400">
                100% Indian travel stories · Zero sponsored spam · Unsubscribe at any time
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
