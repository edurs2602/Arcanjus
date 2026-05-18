import { Router } from 'express';
import { listActiveCollections, getCollectionById } from '../../services/collectionService.js';

export const collectionsRouter = Router();

collectionsRouter.get('/collections', async (_req, res, next) => {
  try {
    const collections = await listActiveCollections();
    res.json({ collections });
  } catch (error) {
    next(error);
  }
});

collectionsRouter.get('/collections/:id', async (req, res, next) => {
  try {
    const collection = await getCollectionById(req.params.id);
    if (!collection) {
      res.status(404).json({ error: 'Collection not found', code: 'NOT_FOUND' });
      return;
    }
    res.json(collection);
  } catch (error) {
    next(error);
  }
});
