import { applyOperation } from '../src/utils/operationMath';

describe('applyOperation', () => {
  it('adds numbers', () => {
    expect(applyOperation(5, 'ADD', 3)).toBe(8);
  });

  it('subtracts numbers', () => {
    expect(applyOperation(5, 'SUBTRACT', 2)).toBe(3);
  });

  it('multiplies numbers', () => {
    expect(applyOperation(4, 'MULTIPLY', 2)).toBe(8);
  });

  it('divides numbers', () => {
    expect(applyOperation(9, 'DIVIDE', 3)).toBe(3);
  });

  it('throws on division by zero', () => {
    expect(() => applyOperation(9, 'DIVIDE', 0)).toThrow('Division by zero');
  });
});
