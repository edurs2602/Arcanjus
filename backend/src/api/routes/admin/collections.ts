import { Router } from 'express';
import multer from 'multer';
import {
  listAllCollections,
  createCollection,
  updateCollection,
  deactivateCollection,
} from '../../../services/collectionService.js';

export const adminCollectionsRouter = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

adminCollectionsRouter.get('/collections', async (_req, res, next) => {
  try {
    const collections = await listAllCollections();
    res.json({ collections });
  } catch (error) {
    next(error);
  }
});

adminCollectionsRouter.post('/collections', upload.single('banner'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Banner image is required', code: 'VALIDATION_ERROR' });
      return;
    }

    const { name, description, bannerAlt, order } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required', code: 'VALIDATION_ERROR' });
      return;
    }

    const collection = await createCollection({
      name,
      description,
      bannerAlt,
      order: order ? parseInt(order, 10) : undefined,
      banner: { buffer: file.buffer, mimeType: file.mimetype },
    });

    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
});

adminCollectionsRouter.put('/collections/:id', upload.single('banner'), async (req, res, next) => {
  try {
    const { name, description, bannerAlt, order, active } = req.body;

    const file = req.file;
    const id = req.params.id as string;
    const collection = await updateCollection(id, {
      name,
      description,
      bannerAlt,
      order: order !== undefined ? parseInt(order, 10) : undefined,
      active: active !== undefined ? active === 'true' : undefined,
      banner: file ? { buffer: file.buffer, mimeType: file.mimetype } : undefined,
    });

    if (!collection) {
      res.status(404).json({ error: 'Collection not found', code: 'NOT_FOUND' });
      return;
    }

    res.json(collection);
  } catch (error) {
    next(error);
  }
});

adminCollectionsRouter.delete('/collections/:id', async (req, res, next) => {
  try {
    await deactivateCollection(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
