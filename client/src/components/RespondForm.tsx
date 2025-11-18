import { type FormEvent, useState } from 'react';
import { useRespondToCalculation } from '../api/hooks';

const operations = [
  { label: 'Add', value: 'ADD' },
  { label: 'Subtract', value: 'SUBTRACT' },
  { label: 'Multiply', value: 'MULTIPLY' },
  { label: 'Divide', value: 'DIVIDE' },
] as const;

type Props = {
  calculationId: number;
  onClose: () => void;
};

export const RespondForm = ({ calculationId, onClose }: Props) => {
  const [operation, setOperation] = useState<(typeof operations)[number]['value']>('ADD');
  const [operand, setOperand] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mutation = useRespondToCalculation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number(operand);
    if (!Number.isFinite(parsed)) {
      setError('Operand must be a valid number');
      return;
    }

    try {
      await mutation.mutateAsync({ calculationId, operation, operand: parsed });
      setOperand('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post operation');
    }
  };

  return (
    <form className="form inline" onSubmit={handleSubmit}>
      <select value={operation} onChange={(e) => setOperation(e.target.value as typeof operation)}>
        {operations.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={operand}
        onChange={(e) => setOperand(e.target.value)}
        placeholder="Your number"
      />
      <button className="btn primary" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Posting…' : 'Apply'}
      </button>
      <button className="btn" type="button" onClick={onClose}>
        Cancel
      </button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};
