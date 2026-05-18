import { Router } from 'express';
import { z } from 'zod';
import { listShirts, getShirtById, getShirtFilters } from '../../services/shirtService.js';
import { validate } from '../middleware/validate.js';

export const shirtsRouter = Router();

const listSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
    collection: z.string().uuid().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
  body: z.any(),
  params: z.any(),
});

shirtsRouter.get('/shirts', validate(listSchema), async (req, res, next) => {
  try {
    const result = await listShirts({
      category: req.query.category as string | undefined,
      color: req.query.color as string | undefined,
      size: req.query.size as string | undefined,
      collection: req.query.collection as string | undefined,
      sort: req.query.sort as 'price_asc' | 'price_desc' | 'newest' | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

shirtsRouter.get('/shirts/filters', async (_req, res, next) => {
  try {
    const filters = await getShirtFilters();
    res.json(filters);
  } catch (error) {
    next(error);
  }
});

shirtsRouter.get('/shirts/:id', async (req, res, next) => {
  try {
    const shirt = await getShirtById(req.params.id!);
    if (!shirt) {
      res.status(404).json({ error: 'Shirt not found' });
      return;
    }
    res.json(shirt);
  } catch (error) {
    next(error);
  }
});
