import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PasswordField, StrengthMeter, TextField } from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function AuthShell({ asideTitle, asideText, points, children }) {
  return (
    <section className="auth2">
      <div className="auth2__card">
        <aside className="auth2__aside">
          <Link className="auth2__brand" to="/">
            <img src="/gift-svgrepo-com.svg" alt="" />
            <span>GiftNest</span>
          </Link>
          <div className="auth2__asideBody">
            <h2>{asideTitle}</h2>
            <p>{asideText}</p>
            <ul>
              {points.map((point) => (
                <li key={point}>
                  <span><Icon name="check" width={2.6} /></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="auth2__main">{children}</div>
      </div>
    </section>
  );
}

function SubmitButton({ busy, children, busyText }) {
  return (
    <button className="btn btn--lg auth2__submit" type="submit" disabled={busy}>
      {busy && <i className="spinner" aria-hidden="true" />}
      {busy ? busyText : children}
    </button>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setMessage('');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (error) {
      setErrors(error.errors || {});
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      asideTitle="Welcome back"
      asideText="Sign in to pick up where you left off: your cart, your orders, and your saved details."
      points={['Track your orders in one place', 'Checkout faster with saved details', 'Secure, password-protected account']}
    >
      <div className="auth2__head">
        <h1>Sign in</h1>
        <p>Enter your email and password to continue.</p>
      </div>

      {message && !errors.email && <div className="auth2__alert" role="alert">{message}</div>}

      <form className="auth2__form" onSubmit={submit} noValidate>
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
          autoComplete="username"
          autoFocus
          required
          error={errors.email}
        />
        <PasswordField
          label="Password"
          value={form.password}
          onChange={set('password')}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={errors.password}
        />
        <SubmitButton busy={busy} busyText="Signing in…">Sign in</SubmitButton>
      </form>

      <p className="auth2__switch">
        New to GiftNest? <Link className="link" to="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

const emptyForm = { firstName: '', lastName: '', email: '', password: '', passwordConfirmation: '' };

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  // Quick checks so people get instant feedback; the server validates again.
  const check = () => {
    const found = {};
    if (!form.firstName.trim()) found.firstName = 'First name is required.';
    if (!form.lastName.trim()) found.lastName = 'Last name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email address.';
    if (form.password.length < 8) found.password = 'Use at least 8 characters.';
    if (form.password !== form.passwordConfirmation) found.passwordConfirmation = 'The passwords do not match.';
    return found;
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    const found = check();
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (error) {
      setErrors(error.errors || {});
      setMessage(Object.keys(error.errors || {}).length ? '' : error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      asideTitle="Join GiftNest"
      asideText="Create a free account to shop, place orders, and keep track of every gift you send."
      points={['Order in a few clicks', 'Follow every order from your account', 'Your details stay private and secure']}
    >
      <div className="auth2__head">
        <h1>Create your account</h1>
        <p>It only takes a minute.</p>
      </div>

      {message && <div className="auth2__alert" role="alert">{message}</div>}

      <form className="auth2__form" onSubmit={submit} noValidate>
        <div className="auth2__row">
          <TextField label="First name" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" autoFocus required error={errors.firstName} />
          <TextField label="Last name" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" required error={errors.lastName} />
        </div>

        <TextField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" required error={errors.email} />

        <div className="auth2__row">
          <PasswordField label="Password" value={form.password} onChange={set('password')} autoComplete="new-password" placeholder="At least 8 characters" required error={errors.password} />
          <PasswordField label="Confirm password" value={form.passwordConfirmation} onChange={set('passwordConfirmation')} autoComplete="new-password" placeholder="Repeat the password" required error={errors.passwordConfirmation} />
        </div>
        <StrengthMeter value={form.password} />

        <SubmitButton busy={busy} busyText="Creating account…">Create account</SubmitButton>
      </form>

      <p className="auth2__switch">
        Already have an account? <Link className="link" to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
