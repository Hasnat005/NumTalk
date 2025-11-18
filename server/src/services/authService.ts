import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { env } from '../config/env';
import { HttpError } from '../types/httpError';

const TOKEN_TTL = '7d';
const SALT_ROUNDS = 10;

type UserSafe = {
  id: number;
  username: string;
  createdAt: Date;
};

const toSafeUser = (user: { id: number; username: string; createdAt: Date }): UserSafe => ({
  id: user.id,
  username: user.username,
  createdAt: user.createdAt,
});

const createToken = (user: UserSafe) =>
  jwt.sign({ sub: user.id, username: user.username }, env.jwtSecret, { expiresIn: TOKEN_TTL });

export const registerUser = async (username: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) {
    throw new HttpError(409, 'Username already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { username, passwordHash } });
  const safeUser = toSafeUser(user);
  const token = createToken(safeUser);

  return { token, user: safeUser };
};

export const loginUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const safeUser = toSafeUser(user);
  const token = createToken(safeUser);

  return { token, user: safeUser };
};

export const getUserProfile = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return toSafeUser(user);
};
