import { Router } from 'express';
import { healthRouter } from './health.js';
import { shirtsRouter } from './shirts.js';
import { collectionsRouter } from './collections.js';
import { storeInfoRouter } from './storeInfo.js';
import { analyticsRouter } from './analytics.js';
import { adminRouter } from './admin/index.js';

export const router = Router();

router.use(healthRouter);
router.use(shirtsRouter);
router.use(collectionsRouter);
router.use(storeInfoRouter);
router.use(analyticsRouter);
router.use('/admin', adminRouter);
