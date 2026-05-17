import { Router } from 'express';
import { getStoreInfo } from '../../services/storeInfoService.js';

export const storeInfoRouter = Router();

storeInfoRouter.get('/store-info', async (_req, res, next) => {
  try {
    const info = await getStoreInfo();
    if (!info) {
      res.status(404).json({ error: 'Store info not configured' });
      return;
    }
    res.json(info);
  } catch (error) {
    next(error);
  }
});
