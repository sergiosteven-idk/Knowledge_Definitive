import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  const code = err.code || 'INTERNAL_ERROR';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      code,
      message,
      details: err.details || null
    }
  });
};
