import { type FormEvent, useState } from 'react';
import { useStartCalculation } from '../api/hooks';

export const StartCalculationForm = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mutation = useStartCalculation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      setError('Please enter a valid number');
      return;
    }

    try {
      await mutation.mutateAsync(parsed);
      setValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish number');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Start new number
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 42"
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="btn primary" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Publishing…' : 'Publish starting number'}
      </button>
    </form>
  );
};
