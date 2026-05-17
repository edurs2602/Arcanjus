import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const correlationId = randomUUID();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        level: 'info',
        correlationId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      }),
    );
  });

  next();
}
