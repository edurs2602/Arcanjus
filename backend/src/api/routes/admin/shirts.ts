import { Router } from 'express';
import multer from 'multer';
import { listAllShirts, createShirt, updateShirt, deactivateShirt } from '../../../services/adminShirtService.js';

export const adminShirtsRouter = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

adminShirtsRouter.get('/shirts', async (req, res, next) => {
  try {
    const active = req.query.active !== undefined ? req.query.active === 'true' : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const result = await listAllShirts({ active, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

adminShirtsRouter.post('/shirts', upload.array('images', 10), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { name, description, price, sizes, color, category } = req.body;

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'At least one image is required', code: 'VALIDATION_ERROR' });
      return;
    }

    const shirt = await createShirt({
      name,
      description,
      price: parseFloat(price),
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes),
      color,
      category,
      images: files.map((f, i) => ({
        buffer: f.buffer,
        mimeType: f.mimetype,
        alt: `${name} - imagem ${i + 1}`,
      })),
    });

    res.status(201).json(shirt);
  } catch (error) {
    next(error);
  }
});

adminShirtsRouter.put('/shirts/:id', async (req, res, next) => {
  try {
    const shirt = await updateShirt(req.params.id!, req.body);
    res.json(shirt);
  } catch (error) {
    next(error);
  }
});

adminShirtsRouter.delete('/shirts/:id', async (req, res, next) => {
  try {
    await deactivateShirt(req.params.id!);
    res.json({ status: 'deactivated' });
  } catch (error) {
    next(error);
  }
});
