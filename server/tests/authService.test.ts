// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { loginUser, registerUser, getUserProfile } from '../src/services/authService';
import { HttpError } from '../src/types/httpError';

jest.mock('../src/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { prisma } = require('../src/db/prisma');
const mockUser = prisma.user as any;

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const { hash: bcryptHash, compare: bcryptCompare } = require('bcryptjs');
const { sign: jwtSign } = require('jsonwebtoken');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcryptHash.mockResolvedValue('hashed');
    bcryptCompare.mockResolvedValue(true);
    jwtSign.mockReturnValue('token');
  });

  describe('registerUser', () => {
    it('rejects duplicate usernames', async () => {
      mockUser.findUnique.mockResolvedValue({ id: 1 });

      await expect(registerUser('alex', 'secret123')).rejects.toThrow(HttpError);
      expect(mockUser.create).not.toHaveBeenCalled();
    });

    it('creates a new user and returns token payload', async () => {
      const created = { id: 2, username: 'alex', createdAt: new Date(), passwordHash: 'hashed' };
      mockUser.findUnique.mockResolvedValue(null);
      mockUser.create.mockResolvedValue(created);

      const result = await registerUser('alex', 'secret123');

      expect(bcryptHash).toHaveBeenCalledWith('secret123', expect.any(Number));
      expect(mockUser.create).toHaveBeenCalledWith({ data: { username: 'alex', passwordHash: 'hashed' } });
      expect(result).toEqual({ token: 'token', user: { id: created.id, username: created.username, createdAt: created.createdAt } });
    });
  });

  describe('loginUser', () => {
    it('throws when user does not exist', async () => {
      mockUser.findUnique.mockResolvedValue(null);

      await expect(loginUser('ghost', 'secret')).rejects.toThrow(HttpError);
    });

    it('throws when password does not match', async () => {
      mockUser.findUnique.mockResolvedValue({ id: 1, username: 'alex', passwordHash: 'hashed', createdAt: new Date() });
      bcryptCompare.mockResolvedValue(false);

      await expect(loginUser('alex', 'wrong')).rejects.toThrow(HttpError);
    });

    it('returns token and safe user when credentials valid', async () => {
      const user = { id: 1, username: 'alex', passwordHash: 'hashed', createdAt: new Date() };
      mockUser.findUnique.mockResolvedValue(user);

      const result = await loginUser('alex', 'secret');

      expect(bcryptCompare).toHaveBeenCalledWith('secret', 'hashed');
      expect(result.user).toEqual({ id: 1, username: 'alex', createdAt: user.createdAt });
      expect(result.token).toBe('token');
    });
  });

  describe('getUserProfile', () => {
    it('returns safe user info when found', async () => {
      const user = { id: 1, username: 'alex', passwordHash: 'hashed', createdAt: new Date() };
      mockUser.findUnique.mockResolvedValue(user);

      const profile = await getUserProfile(1);
      expect(profile).toEqual({ id: 1, username: 'alex', createdAt: user.createdAt });
    });

    it('throws when user missing', async () => {
      mockUser.findUnique.mockResolvedValue(null);
      await expect(getUserProfile(999)).rejects.toThrow(HttpError);
    });
  });
});
