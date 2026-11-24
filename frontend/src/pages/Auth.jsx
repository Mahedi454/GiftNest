import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FieldError } from '../components/common.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function useAuthForm(initial, submitFn) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    try {
      await submitFn(form);
    } catch (error) {
      setErrors(error.errors || {});
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };
  return { form, set, submit, errors, message, busy };
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { form, set, submit, message, busy } = useAuthForm({ email: '', password: '' }, async (values) => {
    const user = await login(values.email, values.password);
    navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/'), { replace: true });
  });

  return (
    <section className="section auth">
      <div className="auth__shell">
        <div className="auth__intro">
          <div className="kicker">Authentication</div>
          <h1>Login to GiftNest</h1>
          <p className="lead">Use the standard GiftNest sign-in flow to access your orders or admin panel.</p>
          <div className="auth__highlights">
            <span className="chip">JWT authentication</span>
            <span className="chip">Hashed passwords</span>
            <span className="chip">Role-based redirect</span>
          </div>
        </div>

        <div className="auth__card card">
          <div className="auth__cardHead">
            <h2>Sign in</h2>
            <p className="muted">Use your account email and password.</p>
          </div>

          <form className="auth__form" onSubmit={submit}>
            <label className="field">
              <span className="field__label">Email</span>
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required autoFocus autoComplete="username" />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="Enter your password" required autoComplete="current-password" />
            </label>
            {message && <span className="muted">{message}</span>}
            <button className="btn btn--full" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
          </form>

          <div className="auth__bottom">
            <span className="muted">Need an account?</span>
            <Link className="link" to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { form, set, submit, errors, busy } = useAuthForm(
    { name: '', email: '', password: '', passwordConfirmation: '' },
    async (values) => {
      await register(values);
      navigate('/', { replace: true });
    },
  );
  const errorList = Object.values(errors);

  return (
    <section className="section auth">
      <div className="auth__shell">
        <div className="auth__intro">
          <div className="kicker">Create account</div>
          <h1>Register your GiftNest account</h1>
          <p className="lead">Create a customer account so you can shop, manage orders, and continue to checkout.</p>
          <div className="auth__highlights">
            <span className="chip">JWT authentication</span>
            <span className="chip">Secure passwords</span>
            <span className="chip">Order-ready account</span>
          </div>
        </div>

        <div className="auth__card card">
          <div className="auth__cardHead">
            <h2>Create account</h2>
            <p className="muted">Enter your details to register.</p>
          </div>

          {errorList.length > 0 && (
            <div className="auth__errors">
              <strong>Please fix these fields:</strong>
              <ul>{errorList.map((error) => <li key={error}>{error}</li>)}</ul>
            </div>
          )}

          <form className="auth__form" onSubmit={submit}>
            <label className="field">
              <span className="field__label">Name</span>
              <input className="input" type="text" value={form.name} onChange={set('name')} required autoComplete="name" />
              <FieldError errors={errors} name="name" />
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <input className="input" type="email" value={form.email} onChange={set('email')} required autoComplete="username" />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input className="input" type="password" value={form.password} onChange={set('password')} required minLength={8} autoComplete="new-password" />
            </label>
            <label className="field">
              <span className="field__label">Confirm password</span>
              <input className="input" type="password" value={form.passwordConfirmation} onChange={set('passwordConfirmation')} required autoComplete="new-password" />
            </label>
            <button className="btn btn--full" type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
          </form>

          <div className="auth__bottom">
            <span className="muted">Already registered?</span>
            <Link className="link" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
