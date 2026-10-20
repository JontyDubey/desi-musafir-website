import React, { useState } from 'react';
import { ArrowRight, Eye, Camera } from 'lucide-react';
import { Link } from '../../router';
import { GALLERY_PHOTOS } from '../../data/gallery';
import { GalleryPhoto } from '../../types';
import { Lightbox } from '../gallery/Lightbox';
import { ImageWithFallback } from '../common/ImageWithFallback';

export function GalleryPreview() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const previewPhotos = GALLERY_PHOTOS.slice(0, 6);

  return (
    <section className="py-20 bg-white border-t border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B85C38] mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Photography Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522]">
              Frames of Incredible India
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Visual dispatches celebrating Himalayan crests, sacred river ghats, desert fortresses, and southern backwaters.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors group"
          >
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Bento / Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {previewPhotos.map((photo, index) => {
            // First item large 2-col span
            const colSpanClass = index === 0 ? 'col-span-2 row-span-2' : index === 3 ? 'col-span-2' : 'col-span-1 md:col-span-1 lg:col-span-2';
            const aspectClass = index === 0 ? 'aspect-[4/3] md:aspect-square lg:aspect-[4/3]' : 'aspect-square';

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer bg-stone-100 ${colSpanClass}`}
              >
                <ImageWithFallback
                  src={photo.imageUrl}
                  alt={photo.altText}
                  aspectRatioClass={aspectClass}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-[#E0C99E] font-medium block">
                    {photo.destination}, {photo.state}
                  </span>
                  <h4 className="font-serif text-sm sm:text-base font-semibold leading-tight mt-0.5">
                    {photo.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-stone-300">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Frame</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#FAF8F3] hover:bg-[#244C3A] text-stone-800 hover:text-white border border-[#E8E5DE] hover:border-[#244C3A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-2xs"
          >
            <span>Browse All {GALLERY_PHOTOS.length}+ Frames</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        photo={selectedPhoto}
        photos={GALLERY_PHOTOS}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={(p) => setSelectedPhoto(p)}
      />
    </section>
  );
}
