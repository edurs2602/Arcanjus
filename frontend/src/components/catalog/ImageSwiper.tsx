'use client';

import { useState } from 'react';

interface ImageSwiperProps {
  images: Array<{ id: string; url: string; alt: string }>;
}

export function ImageSwiper({ images }: ImageSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-brand-100">
        <span className="text-[10px] uppercase tracking-widest-xl text-brand-400">Sem imagem</span>
      </div>
    );
  }

  const currentImage = images[currentIndex]!;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
        <img
          src={`${imageBase}${currentImage.url}`}
          alt={currentImage.alt}
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-primary/50 transition-colors hover:text-primary"
              aria-label="Imagem anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-primary/50 transition-colors hover:text-primary"
              aria-label="Próxima imagem"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4">
              <span className="text-[10px] uppercase tracking-widest-xl text-primary/50">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={`relative h-20 w-20 overflow-hidden transition-opacity duration-200 ${
                i === currentIndex ? 'opacity-100 ring-1 ring-primary' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={`${imageBase}${img.url}`}
                alt={img.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
