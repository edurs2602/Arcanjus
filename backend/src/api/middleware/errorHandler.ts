import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Array<{ field: string; message: string }>;
}

export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction): void {
  const correlationId = req.headers['x-correlation-id'] as string;

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  console.error(
    JSON.stringify({
      level: 'error',
      correlationId,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    }),
  );

  res.status(statusCode).json({
    error: message,
    code: err.code ?? 'INTERNAL_ERROR',
  });
}
