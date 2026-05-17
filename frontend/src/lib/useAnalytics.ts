'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${API_BASE}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        page: pathname,
        referrer: document.referrer || undefined,
        deviceType: getDeviceType(),
      }),
    }).catch(() => {
      // Fire-and-forget: analytics failures should not affect UX
    });
  }, [pathname]);
}

export function trackProductClick(shirtId: string, actionType: 'view_detail' | 'filter' | 'image') {
  fetch(`${API_BASE}/analytics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'product_click',
      shirtId,
      actionType,
    }),
  }).catch(() => {
    // Fire-and-forget
  });
}
