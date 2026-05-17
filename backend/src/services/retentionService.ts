import { prisma } from '../config/database.js';

const RETENTION_MONTHS = 12;

export async function purgeOldAnalytics(): Promise<{ deletedPageViews: number; deletedClicks: number }> {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);

  const [pageViewResult, clickResult] = await Promise.all([
    prisma.pageViewEvent.deleteMany({ where: { timestamp: { lt: cutoff } } }),
    prisma.productClickEvent.deleteMany({ where: { timestamp: { lt: cutoff } } }),
  ]);

  console.log(
    JSON.stringify({
      level: 'info',
      message: 'Analytics retention purge complete',
      deletedPageViews: pageViewResult.count,
      deletedClicks: clickResult.count,
      cutoffDate: cutoff.toISOString(),
      timestamp: new Date().toISOString(),
    }),
  );

  return {
    deletedPageViews: pageViewResult.count,
    deletedClicks: clickResult.count,
  };
}
