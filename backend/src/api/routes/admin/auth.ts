import { Router } from 'express';
import { z } from 'zod';
import { authenticateAdmin, signToken, verifyToken } from '../../../services/authService.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminAuthRouter = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  query: z.any(),
  params: z.any(),
});

adminAuthRouter.post('/auth/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authenticateAdmin(email, password);

    if (!result) {
      res.status(401).json({ error: 'Invalid credentials', code: 'UNAUTHORIZED' });
      return;
    }

    res.json({
      token: result.token,
      expiresIn: 86400,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

adminAuthRouter.post('/auth/refresh', requireAuth, (req: AuthenticatedRequest, res) => {
  const token = signToken(req.adminId!, '');
  res.json({ token, expiresIn: 86400 });
});
