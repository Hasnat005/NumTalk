import { OperationType } from '@prisma/client';
import { MUTATING_OPERATIONS } from '../types/operation';
import { HttpError } from '../types/httpError';

export function applyOperation(previousResult: number, operation: OperationType, operand: number): number {
  if (!MUTATING_OPERATIONS.includes(operation)) {
    throw new HttpError(400, 'Operation START cannot be applied here');
  }

  switch (operation) {
    case 'ADD':
      return previousResult + operand;
    case 'SUBTRACT':
      return previousResult - operand;
    case 'MULTIPLY':
      return previousResult * operand;
    case 'DIVIDE':
      if (operand === 0) {
        throw new HttpError(400, 'Division by zero is not allowed');
      }
      return previousResult / operand;
    default:
      throw new HttpError(400, `Unsupported operation ${operation}`);
  }
}
