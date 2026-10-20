import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Camera } from 'lucide-react';
import { GalleryPhoto } from '../../types';

interface LightboxProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onNavigate: (photo: GalleryPhoto) => void;
}

export function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photos]);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  const handlePrev = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    onNavigate(photos[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    onNavigate(photos[nextIndex]);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-300">
          <Camera className="w-4 h-4 text-[#C5A46D]" />
          <span>Frames of Incredible India</span>
          <span className="text-stone-500">·</span>
          <span className="font-mono text-xs tabular-nums text-stone-400">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-stone-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Center Image */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 text-white rounded-full bg-black/50 hover:bg-black/80 transition-colors"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <img
          src={photo.imageUrl}
          alt={photo.altText || photo.title}
          referrerPolicy="no-referrer"
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all"
        />

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 text-white rounded-full bg-black/50 hover:bg-black/80 transition-colors"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5 z-10">
        <h3 className="font-serif text-lg sm:text-2xl font-bold text-white">
          {photo.title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
          {photo.caption}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-stone-400 pt-1">
          <span className="flex items-center gap-1 text-[#E0C99E]">
            <MapPin className="w-3.5 h-3.5" />
            {photo.destination}, {photo.state}
          </span>
          {photo.photoCredit && (
            <>
              <span aria-hidden="true">·</span>
              <span>Credit: {photo.photoCredit}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
