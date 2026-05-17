import { Router } from 'express';
import { z } from 'zod';
import { recordPageView, recordProductClick } from '../../services/eventTrackingService.js';
import { validate } from '../middleware/validate.js';

export const analyticsRouter = Router();

const eventSchema = z.object({
  body: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('page_view'),
      page: z.string(),
      referrer: z.string().optional(),
      deviceType: z.enum(['mobile', 'tablet', 'desktop']),
    }),
    z.object({
      type: z.literal('product_click'),
      shirtId: z.string().uuid(),
      actionType: z.enum(['view_detail', 'filter', 'image']),
    }),
  ]),
  query: z.any(),
  params: z.any(),
});

analyticsRouter.post('/analytics/event', validate(eventSchema), async (req, res, next) => {
  try {
    const event = req.body;

    if (event.type === 'page_view') {
      await recordPageView({
        page: event.page,
        referrer: event.referrer,
        deviceType: event.deviceType,
      });
    } else {
      await recordProductClick({
        shirtId: event.shirtId,
        actionType: event.actionType,
      });
    }

    res.status(202).json({ status: 'accepted' });
  } catch (error) {
    next(error);
  }
});
