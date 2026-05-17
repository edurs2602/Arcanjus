import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { adminAuthRouter } from './auth.js';
import { adminShirtsRouter } from './shirts.js';
import { adminStoreInfoRouter } from './storeInfo.js';
import { adminAnalyticsRouter } from './analytics.js';

export const adminRouter = Router();

// Auth routes (no auth required)
adminRouter.use(adminAuthRouter);

// All other admin routes require auth
adminRouter.use(requireAuth);
adminRouter.use(adminShirtsRouter);
adminRouter.use(adminStoreInfoRouter);
adminRouter.use(adminAnalyticsRouter);
