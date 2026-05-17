import { Router } from 'express';
import { getAnalyticsOverview, getShirtAnalytics } from '../../../services/analyticsService.js';

export const adminAnalyticsRouter = Router();

adminAnalyticsRouter.get('/analytics/overview', async (req, res, next) => {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const overview = await getAnalyticsOverview({ from, to });
    res.json(overview);
  } catch (error) {
    next(error);
  }
});

adminAnalyticsRouter.get('/analytics/shirts/:id', async (req, res, next) => {
  try {
    const analytics = await getShirtAnalytics(req.params.id!);
    if (!analytics) {
      res.status(404).json({ error: 'Shirt not found' });
      return;
    }
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});
