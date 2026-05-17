'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface ShirtAnalytics {
  shirtId: string;
  name: string;
  totalClicks: number;
  clicksByAction: Record<string, number>;
  dailyClicks: Array<{ date: string; count: number }>;
}

interface ShirtItem {
  id: string;
  name: string;
  clickCount: number;
}

export default function AdminAnalyticsPage() {
  const { token } = useAdminAuth();
  const [shirts, setShirts] = useState<ShirtItem[]>([]);
  const [selectedShirt, setSelectedShirt] = useState<ShirtAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ shirts: ShirtItem[] }>('/admin/shirts?limit=50', { token })
      .then((data) => setShirts(data.shirts))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  async function selectShirt(id: string) {
    if (!token) return;
    const data = await apiFetch<ShirtAnalytics>(`/admin/analytics/shirts/${id}`, { token });
    setSelectedShirt(data);
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Analytics por Produto</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Shirt list */}
        <div className="rounded-lg bg-white p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold uppercase text-primary-light">Camisas</h2>
          <ul className="space-y-2">
            {shirts.map((shirt) => (
              <li key={shirt.id}>
                <button
                  onClick={() => selectShirt(shirt.id)}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                    selectedShirt?.shirtId === shirt.id
                      ? 'bg-accent/10 text-accent-dark'
                      : 'text-primary hover:bg-brand-50'
                  }`}
                >
                  <span className="block font-medium">{shirt.name}</span>
                  <span className="text-xs text-primary-light">{shirt.clickCount} cliques</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Detail */}
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
          {selectedShirt ? (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-primary">{selectedShirt.name}</h2>
              <p className="text-3xl font-bold text-accent-dark">
                {selectedShirt.totalClicks} cliques totais
              </p>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-primary-light">Por tipo de ação</h3>
                <div className="flex gap-4">
                  {Object.entries(selectedShirt.clicksByAction).map(([action, count]) => (
                    <div key={action} className="text-center">
                      <p className="text-xl font-bold text-primary">{count}</p>
                      <p className="text-xs text-primary-light">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-primary-light">Últimos 30 dias</h3>
                <div className="space-y-1">
                  {selectedShirt.dailyClicks.slice(0, 10).map((day) => (
                    <div key={day.date} className="flex justify-between text-sm">
                      <span className="text-primary-light">{day.date}</span>
                      <span className="font-medium text-primary">{day.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-primary-light">
              Selecione uma camisa para ver as analytics
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
