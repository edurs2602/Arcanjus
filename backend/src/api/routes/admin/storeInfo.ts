import { Router } from 'express';
import { updateStoreInfo } from '../../../services/storeInfoService.js';

export const adminStoreInfoRouter = Router();

adminStoreInfoRouter.put('/store-info', async (req, res, next) => {
  try {
    const updated = await updateStoreInfo(req.body);
    if (!updated) {
      res.status(404).json({ error: 'Store info not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});
