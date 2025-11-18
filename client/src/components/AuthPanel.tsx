import { type FormEvent, useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';

const credentialsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type Variant = 'login' | 'register';

export const AuthPanel = () => {
  const { login, register, user, logout } = useAuth();
  const [variant, setVariant] = useState<Variant>('login');
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return (
      <div className="card">
        <p>
          Signed in as <strong>{user.username}</strong>
        </p>
        <button className="btn" onClick={logout} type="button">
          Logout
        </button>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const { username, password } = credentialsSchema.parse(form);
      setSubmitting(true);
      if (variant === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      setForm({ username: '', password: '' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? 'Invalid form');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <button
          type="button"
          className={`tab ${variant === 'login' ? 'active' : ''}`}
          onClick={() => setVariant('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`tab ${variant === 'register' ? 'active' : ''}`}
          onClick={() => setVariant('register')}
        >
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="Enter username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Enter password"
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : variant === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>
    </div>
  );
};
