import { OperationType } from '@prisma/client';

export type OperationDTO = {
  id: number;
  operation: OperationType;
  operand: number | null;
  result: number;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
  parentId: number | null;
  children: OperationDTO[];
};

export const MUTATING_OPERATIONS: OperationType[] = [
  'ADD',
  'SUBTRACT',
  'MULTIPLY',
  'DIVIDE'
];
