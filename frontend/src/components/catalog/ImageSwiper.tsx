'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageSwiperProps {
  images: Array<{ id: string; url: string; alt: string }>;
}

export function ImageSwiper({ images }: ImageSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-brand-50">
        <span className="text-brand-400">Sem imagem</span>
      </div>
    );
  }

  const currentImage = images[currentIndex]!;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-brand-50">
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Navigation arrows for mobile swipe */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
              aria-label="Imagem anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
              aria-label="Próxima imagem"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                i === currentIndex ? 'border-accent' : 'border-transparent'
              }`}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
