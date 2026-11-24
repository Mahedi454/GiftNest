import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return loader()
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => setState({ data: null, error, loading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}

export function Loading() {
  return (
    <div className="card empty">
      <div className="empty__title">Loading...</div>
    </div>
  );
}

export function ErrorBox({ error }) {
  return (
    <div className="card empty">
      <div className="empty__title">Something went wrong</div>
      <div className="empty__subtitle">{error?.message || 'Please try again.'}</div>
    </div>
  );
}

export function FieldError({ errors, name }) {
  return errors?.[name] ? <span className="muted">{errors[name]}</span> : null;
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      {page <= 1 ? (
        <span className="pagination__link pagination__link--disabled">Prev</span>
      ) : (
        <button type="button" className="pagination__link" onClick={() => onChange(page - 1)}>Prev</button>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`pagination__link ${n === page ? 'pagination__link--active' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      {page >= pages ? (
        <span className="pagination__link pagination__link--disabled">Next</span>
      ) : (
        <button type="button" className="pagination__link" onClick={() => onChange(page + 1)}>Next</button>
      )}
    </div>
  );
}

export function RequireAuth({ admin = false, children }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export function GuestOnly({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  return children;
}

export function NotFound() {
  return (
    <section className="section">
      <div className="card empty">
        <div className="empty__title">Page not found</div>
        <div className="empty__subtitle">The page you are looking for does not exist.</div>
        <Link className="btn" to="/">Back to home</Link>
      </div>
    </section>
  );
}
