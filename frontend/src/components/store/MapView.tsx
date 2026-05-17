'use client';

import { useEffect, useRef } from 'react';

interface MapViewProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function MapView({ latitude, longitude, name }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    async function initMap() {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([latitude, longitude], 15);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map).bindPopup(name).openPopup();
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, name]);

  return <div ref={mapRef} className="h-[400px] w-full rounded-lg" />;
}
