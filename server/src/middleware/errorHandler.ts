import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/httpError';

// Centralized error responder that keeps JSON responses consistent
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = isHttpError ? err.message : 'Internal Server Error';

  if (!isHttpError) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({ message });
}
