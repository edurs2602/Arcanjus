import { prisma } from '../config/database.js';

interface OverviewParams {
  from?: string;
  to?: string;
}

export async function getAnalyticsOverview(params: OverviewParams) {
  const to = params.to ? new Date(params.to) : new Date();
  const from = params.from ? new Date(params.from) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [pageViews, productClicks, deviceBreakdown, topPages, topShirts] = await Promise.all([
    prisma.pageViewEvent.count({ where: { timestamp: { gte: from, lte: to } } }),
    prisma.productClickEvent.count({ where: { timestamp: { gte: from, lte: to } } }),
    prisma.pageViewEvent.groupBy({
      by: ['deviceType'],
      where: { timestamp: { gte: from, lte: to } },
      _count: true,
    }),
    prisma.pageViewEvent.groupBy({
      by: ['page'],
      where: { timestamp: { gte: from, lte: to } },
      _count: true,
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    }),
    prisma.productClickEvent.groupBy({
      by: ['shirtId'],
      where: { timestamp: { gte: from, lte: to }, shirtId: { not: null } },
      _count: true,
      orderBy: { _count: { shirtId: 'desc' } },
      take: 10,
    }),
  ]);

  const totalDeviceViews = deviceBreakdown.reduce((sum, d) => sum + d._count, 0) || 1;
  const deviceMap: Record<string, number> = {};
  for (const d of deviceBreakdown) {
    deviceMap[d.deviceType] = Math.round((d._count / totalDeviceViews) * 100);
  }

  // Get shirt names for top shirts
  const shirtIds = topShirts.map((s) => s.shirtId).filter(Boolean) as string[];
  const shirts = await prisma.shirt.findMany({
    where: { id: { in: shirtIds } },
    select: { id: true, name: true },
  });
  const shirtNameMap = Object.fromEntries(shirts.map((s) => [s.id, s.name]));

  return {
    period: { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] },
    totalPageViews: pageViews,
    totalProductClicks: productClicks,
    deviceBreakdown: deviceMap,
    topPages: topPages.map((p) => ({ page: p.page, views: p._count })),
    topShirts: topShirts.map((s) => ({
      shirtId: s.shirtId,
      name: shirtNameMap[s.shirtId!] ?? 'Desconhecida',
      clicks: s._count,
    })),
  };
}

export async function getShirtAnalytics(shirtId: string) {
  const shirt = await prisma.shirt.findUnique({
    where: { id: shirtId },
    select: { id: true, name: true },
  });

  if (!shirt) return null;

  const [totalClicks, clicksByAction, dailyClicks] = await Promise.all([
    prisma.productClickEvent.count({ where: { shirtId } }),
    prisma.productClickEvent.groupBy({
      by: ['actionType'],
      where: { shirtId },
      _count: true,
    }),
    prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE(timestamp) as date, COUNT(*) as count
      FROM "ProductClickEvent"
      WHERE "shirtId" = ${shirtId}
      AND timestamp > NOW() - INTERVAL '30 days'
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `,
  ]);

  return {
    shirtId: shirt.id,
    name: shirt.name,
    totalClicks,
    clicksByAction: Object.fromEntries(clicksByAction.map((c) => [c.actionType, c._count])),
    dailyClicks: dailyClicks.map((d) => ({ date: d.date, count: Number(d.count) })),
  };
}
