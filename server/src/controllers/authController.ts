import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { HttpError } from '../types/httpError';
import { getUserProfile, loginUser, registerUser } from '../services/authService';

const authSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(64),
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = authSchema.parse(req.body);
  const payload = await registerUser(username.trim(), password);
  res.status(201).json(payload);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = authSchema.parse(req.body);
  const payload = await loginUser(username.trim(), password);
  res.json(payload);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, 'Not authenticated');
  }

  const profile = await getUserProfile(req.user.id);
  res.json({ user: profile });
});
