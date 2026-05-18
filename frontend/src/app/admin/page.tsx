'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface OverviewData {
  period: { from: string; to: string };
  totalPageViews: number;
  totalProductClicks: number;
  deviceBreakdown: Record<string, number>;
  topPages: Array<{ page: string; views: number }>;
  topShirts: Array<{ shirtId: string; name: string; clicks: number }>;
}

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch<OverviewData>('/admin/analytics/overview', { token })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="animate-pulse">Carregando dados...</div>;
  if (!data) return <div>Erro ao carregar analytics</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Visualizações" value={data.totalPageViews.toLocaleString('pt-BR')} />
        <MetricCard label="Cliques em produtos" value={data.totalProductClicks.toLocaleString('pt-BR')} />
        <MetricCard
          label="Período"
          value={`${data.period.from} a ${data.period.to}`}
        />
      </div>

      {/* Device breakdown */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase text-primary-light">Dispositivos</h2>
        <div className="flex gap-6">
          {Object.entries(data.deviceBreakdown).map(([device, pct]) => (
            <div key={device} className="text-center">
              <p className="text-2xl font-bold text-accent-dark">{pct}%</p>
              <p className="text-xs capitalize text-primary-light">{device}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top shirts */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase text-primary-light">
          Camisas mais populares
        </h2>
        <ul className="space-y-2">
          {data.topShirts.map((shirt) => (
            <li key={shirt.shirtId} className="flex justify-between text-sm">
              <span className="text-primary">{shirt.name}</span>
              <span className="font-medium text-accent-dark">{shirt.clicks} cliques</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase text-primary-light">{label}</p>
      <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
