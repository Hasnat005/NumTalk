import { CalculationTree } from '../components/CalculationTree';
import { AuthPanel } from '../components/AuthPanel';
import { StartCalculationForm } from '../components/StartCalculationForm';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { user, loading } = useAuth();

  return (
    <div className="layout">
      <main>
        <header className="hero">
          <div>
            <p className="eyebrow">Number-first social network</p>
            <h1>Welcome to NumTalk</h1>
            <p>Start with a number, respond with operations, grow infinite computation trees.</p>
          </div>
        </header>
        <section className="panel">
          <CalculationTree />
        </section>
      </main>
      <aside>
        {loading ? (
          <p>Checking session…</p>
        ) : (
          <>
            <AuthPanel />
            {user && (
              <div className="card">
                <h3>Start a discussion</h3>
                <StartCalculationForm />
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
};
