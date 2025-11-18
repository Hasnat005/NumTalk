// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createStartingCalculation, listCalculationTree, respondToCalculation } from '../src/services/calculationService';
import { HttpError } from '../src/types/httpError';

jest.mock('../src/db/prisma', () => ({
  prisma: {
    calculation: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { prisma } = require('../src/db/prisma');
const mockCalculation = prisma.calculation as any;

describe('calculationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listCalculationTree', () => {
    it('returns nested calculation nodes', async () => {
      const createdAt = new Date('2025-01-01T00:00:00.000Z');
      mockCalculation.findMany.mockResolvedValue([
        {
          id: 1,
          operation: 'START',
          operand: null,
          result: 5,
          parentId: null,
          createdAt,
          author: { id: 10, username: 'alex' },
        },
        {
          id: 2,
          operation: 'ADD',
          operand: 3,
          result: 8,
          parentId: 1,
          createdAt,
          author: { id: 11, username: 'george' },
        },
      ]);

      const tree = await listCalculationTree();

      expect(mockCalculation.findMany).toHaveBeenCalled();
      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].result).toBe(8);
      expect(tree[0].children[0].createdAt).toBe(createdAt.toISOString());
    });
  });

  describe('createStartingCalculation', () => {
    it('persists a starting node and normalizes dates', async () => {
      const createdAt = new Date('2025-01-02T00:00:00.000Z');
      mockCalculation.create.mockResolvedValue({
        id: 1,
        operation: 'START',
        operand: null,
        result: 42,
        parentId: null,
        createdAt,
        author: { id: 5, username: 'alex' },
      });

      const payload = await createStartingCalculation(5, 42);

      expect(mockCalculation.create).toHaveBeenCalledWith({
        data: {
          operation: 'START',
          operand: null,
          result: 42,
          parentId: null,
          authorId: 5,
        },
        select: expect.any(Object),
      });
      expect(payload.createdAt).toBe(createdAt.toISOString());
    });
  });

  describe('respondToCalculation', () => {
    it('throws when parent calculation is not found', async () => {
      mockCalculation.findUnique.mockResolvedValue(null);

      await expect(respondToCalculation(1, 999, 'ADD', 2)).rejects.toThrow(HttpError);
      expect(mockCalculation.create).not.toHaveBeenCalled();
    });

    it('stores a derived calculation using the supplied operation', async () => {
      const parent = {
        id: 1,
        result: 10,
        operation: 'START',
        operand: null,
      };
      const createdAt = new Date('2025-01-03T00:00:00.000Z');

      mockCalculation.findUnique.mockResolvedValue(parent);
      mockCalculation.create.mockResolvedValue({
        id: 2,
        operation: 'SUBTRACT',
        operand: 4,
        result: 6,
        parentId: 1,
        createdAt,
        author: { id: 2, username: 'masha' },
      });

      const response = await respondToCalculation(2, 1, 'SUBTRACT', 4);

      expect(mockCalculation.create).toHaveBeenCalledWith({
        data: {
          operation: 'SUBTRACT',
          operand: 4,
          result: 6,
          parentId: 1,
          authorId: 2,
        },
        select: expect.any(Object),
      });
      expect(response.result).toBe(6);
      expect(response.createdAt).toBe(createdAt.toISOString());
    });
  });
});
