import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { HttpError } from '../types/httpError';
import {
  createStartingCalculation,
  listCalculationTree,
  respondToCalculation,
} from '../services/calculationService';
import { MUTATING_OPERATIONS } from '../types/operation';

const startSchema = z.object({
  value: z.coerce.number(),
});

const respondSchema = z.object({
  operation: z.enum(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']),
  operand: z.coerce.number(),
});

export const getCalculations = asyncHandler(async (_req: Request, res: Response) => {
  const tree = await listCalculationTree();
  res.json(tree);
});

export const startCalculation = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, 'Not authenticated');
  }

  const { value } = startSchema.parse(req.body);
  const calculation = await createStartingCalculation(req.user.id, value);
  res.status(201).json(calculation);
});

export const replyToCalculation = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, 'Not authenticated');
  }

  const { operation, operand } = respondSchema.parse(req.body);
  const parentId = Number(req.params.calculationId);

  if (Number.isNaN(parentId)) {
    throw new HttpError(400, 'Invalid calculation id');
  }

  if (!MUTATING_OPERATIONS.includes(operation)) {
    throw new HttpError(400, 'Unsupported operation');
  }

  const calculation = await respondToCalculation(req.user.id, parentId, operation, operand);
  res.status(201).json(calculation);
});
