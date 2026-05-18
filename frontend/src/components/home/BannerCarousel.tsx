'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  description?: string;
  bannerUrl: string;
  bannerAlt: string;
}

interface BannerCarouselProps {
  collections: Collection[];
}

export default function BannerCarousel({ collections }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % collections.length);
  }, [current, collections.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + collections.length) % collections.length);
  }, [current, collections.length, goTo]);

  useEffect(() => {
    if (collections.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, collections.length]);

  if (collections.length === 0) return null;

  const imageBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-primary">
      {/* Slides */}
      {collections.map((collection, index) => (
        <div
          key={collection.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={`${imageBase}${collection.bannerUrl}`}
            alt={collection.bannerAlt}
            className="h-full w-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="luxury-container w-full pb-20 md:pb-28">
          <div
            className={`max-w-xl transition-all duration-500 ${
              isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
            }`}
          >
            <p className="text-[10px] font-medium uppercase tracking-widest-xl text-white/50">
              Coleção {String(current + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
            </p>
            <h2 className="mt-4 font-display text-4xl font-normal tracking-wide text-white md:text-6xl">
              {collections[current].name}
            </h2>
            {collections[current].description && (
              <p className="mt-4 text-sm font-light leading-relaxed text-white/70">
                {collections[current].description}
              </p>
            )}
            <Link
              href={`/camisas?collection=${collections[current].id}`}
              className="mt-8 inline-block border border-white/40 px-10 py-4 text-[10px] font-medium uppercase tracking-widest-xl text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-primary"
            >
              Explorar
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      {collections.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 transition-colors hover:text-white md:left-10"
            aria-label="Anterior"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 transition-colors hover:text-white md:right-10"
            aria-label="Próximo"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress indicators */}
          <div className="absolute bottom-10 right-6 flex items-center gap-3 md:right-10">
            {collections.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-px transition-all duration-500 ${
                  i === current ? 'w-10 bg-white' : 'w-5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
