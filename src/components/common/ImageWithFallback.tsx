import React, { useState } from 'react';
import { Compass, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackLocation?: string;
  aspectRatioClass?: string;
}

export function ImageWithFallback({
  src,
  alt = 'Indian destination scene',
  fallbackTitle,
  fallbackLocation,
  className = '',
  aspectRatioClass = 'aspect-[16/10]',
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If there's an error loading or no source provided, show an elegant editorial fallback
  if (error || !src) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-gradient-to-br from-[#244C3A] via-[#2D5A45] to-[#1E3B2E] text-white flex flex-col justify-end p-6 relative overflow-hidden select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-4 right-4 text-[#C5A46D]/60 flex items-center gap-1.5 text-xs tracking-wider uppercase">
          <Compass className="w-4 h-4 text-[#C5A46D]" />
          <span>Incredible India</span>
        </div>
        <div className="relative z-10">
          <span className="text-[11px] uppercase tracking-widest text-[#E0C99E] block mb-1">
            {fallbackLocation || 'Desi Musafir Expedition'}
          </span>
          <h4 className="font-serif text-lg md:text-xl font-medium text-white leading-tight">
            {fallbackTitle || alt}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} bg-[#EAE6DD] ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#EAE6DD] via-[#F3EFE7] to-[#EAE6DD]" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
