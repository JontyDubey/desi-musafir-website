import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Link } from '../router';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-4 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#244C3A] text-[#C5A46D] flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <span className="font-mono text-sm tracking-widest text-[#B85C38] uppercase font-bold block">
            404 · Uncharted Trail
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            This Path Has Not Been Documented
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed font-light">
            Like a remote mountain pass during winter, the page you are seeking does not exist or has moved. Return to the main trail.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
            >
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
