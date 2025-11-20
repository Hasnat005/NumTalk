import type { Prisma, OperationType } from '@prisma/client';
import { prisma } from '../db/prisma';
import { HttpError } from '../types/httpError';
import { OperationDTO } from '../types/operation';
import { applyOperation } from '../utils/operationMath';

const calculationSelect = {
  id: true,
  operation: true,
  operand: true,
  result: true,
  parentId: true,
  createdAt: true,
  author: {
    select: {
      id: true,
      username: true,
    },
  },
};

type CalculationWithAuthor = Prisma.CalculationGetPayload<{
  select: typeof calculationSelect;
}>;

const serializeCalculation = (calc: CalculationWithAuthor) => ({
  ...calc,
  createdAt: calc.createdAt.toISOString(),
});

export const listCalculationTree = async (): Promise<OperationDTO[]> => {
  const calculations: CalculationWithAuthor[] = await prisma.calculation.findMany({
    select: calculationSelect,
    orderBy: { createdAt: 'asc' },
  });

  const nodeMap = new Map<number, OperationDTO>();
  const roots: OperationDTO[] = [];

  calculations.forEach((calc) => {
    nodeMap.set(calc.id, { ...serializeCalculation(calc), children: [] });
  });

  nodeMap.forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const createStartingCalculation = async (authorId: number, value: number) => {
  const calc = await prisma.calculation.create({
    data: {
      operation: 'START',
      operand: null,
      result: value,
      parentId: null,
      authorId,
    },
    select: calculationSelect,
  });

  return serializeCalculation(calc);
};

export const respondToCalculation = async (
  authorId: number,
  parentId: number,
  operation: OperationType,
  operand: number,
) => {
  const parent = await prisma.calculation.findUnique({ where: { id: parentId } });

  if (!parent) {
    throw new HttpError(404, 'Parent calculation not found');
  }

  const result = applyOperation(parent.result, operation, operand);

  const calc = await prisma.calculation.create({
    data: {
      operation,
      operand,
      result,
      parentId,
      authorId,
    },
    select: calculationSelect,
  });

  return serializeCalculation(calc);
};
