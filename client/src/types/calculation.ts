export type UserSummary = {
  id: number;
  username: string;
};

export type CalculationNode = {
  id: number;
  operation: 'START' | 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';
  operand: number | null;
  result: number;
  author: UserSummary;
  createdAt: string;
  parentId: number | null;
  children: CalculationNode[];
};
