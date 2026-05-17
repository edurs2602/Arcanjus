import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../services/authService.js';

export interface AuthenticatedRequest extends Request {
  adminId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
    return;
  }

  req.adminId = payload.sub;
  next();
}
