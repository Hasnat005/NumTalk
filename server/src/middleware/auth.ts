import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../types/httpError';

interface TokenPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

const extractToken = (authorizationHeader?: string, cookieToken?: string): string | null => {
  if (authorizationHeader?.startsWith('Bearer ')) {
    return authorizationHeader.substring('Bearer '.length);
  }

  if (cookieToken) {
    return cookieToken;
  }

  return null;
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = extractToken(req.headers.authorization, req.cookies?.token);

  if (!token) {
    throw new HttpError(401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded !== 'object' || decoded === null) {
      throw new HttpError(401, 'Invalid token payload');
    }

    const candidate = decoded as jwt.JwtPayload & Partial<TokenPayload>;
    if (typeof candidate.sub !== 'number' || typeof candidate.username !== 'string') {
      throw new HttpError(401, 'Invalid token payload');
    }

    req.user = { id: candidate.sub, username: candidate.username };
    next();
  } catch (err) {
    throw new HttpError(401, 'Invalid or expired token');
  }
};
