import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedDestination } from '../components/home/FeaturedDestination';
import { DestinationGrid } from '../components/home/DestinationGrid';
import { TravelStylesSection } from '../components/home/TravelStylesSection';
import { FeaturedStories } from '../components/home/FeaturedStories';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { TravelGuidesSection } from '../components/home/TravelGuidesSection';
import { PlanJourneySection } from '../components/home/PlanJourneySection';
import { SocialSection } from '../components/home/SocialSection';
import { SearchModal } from '../components/common/SearchModal';
import { EnquiryModal } from '../components/booking/EnquiryModal';

export function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      {/* Responsive Navigation Header */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* A. Hero Section */}
        <HeroSection onOpenEnquiry={() => setIsEnquiryOpen(true)} />

        {/* B. Featured Indian Destination */}
        <FeaturedDestination />

        {/* C. Explore India by Destination */}
        <DestinationGrid />

        {/* D. Explore by Travel Style */}
        <TravelStylesSection />

        {/* E. Featured Travel Stories */}
        <FeaturedStories />

        {/* F. Frames of Incredible India — Gallery Preview */}
        <GalleryPreview />

        {/* G. Travel Guides */}
        <TravelGuidesSection />

        {/* H. Plan Your Journey (Enquiry & Consultation) */}
        <PlanJourneySection />

        {/* I. Social Media Section */}
        <SocialSection />
      </main>

      {/* J. Comprehensive Brand Footer */}
      <Footer />

      {/* Overlays */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  );
}
