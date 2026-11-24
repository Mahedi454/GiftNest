import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatDate, initials, money } from '../api.js';
import { PasswordField, StrengthMeter, TextAreaField, TextField } from '../components/Field.jsx';
import { useFetch } from '../components/common.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Notice({ tone = 'ok', children }) {
  if (!children) return null;
  return <div className={`acc-notice acc-notice--${tone}`} role={tone === 'ok' ? 'status' : 'alert'}>{children}</div>;
}

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const orders = useFetch(() => api.get('/orders/mine'));

  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone || '', address: user.address || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileNote, setProfileNote] = useState({ tone: 'ok', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', password: '', passwordConfirmation: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwNote, setPwNote] = useState({ tone: 'ok', text: '' });
  const [savingPw, setSavingPw] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const list = orders.data?.orders || [];
  const spent = list.reduce((sum, o) => sum + o.totalPrice, 0);

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileErrors({});
    setProfileNote({ tone: 'ok', text: '' });
    setSavingProfile(true);
    try {
      const { user: updated } = await api.put('/profile', profile);
      setUser(updated);
      setProfileNote({ tone: 'ok', text: 'Your details have been saved.' });
    } catch (error) {
      setProfileErrors(error.errors || {});
      if (!Object.keys(error.errors || {}).length) setProfileNote({ tone: 'error', text: error.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPwErrors({});
    setPwNote({ tone: 'ok', text: '' });
    setSavingPw(true);
    try {
      await api.put('/profile/password', pw);
      setPw({ currentPassword: '', password: '', passwordConfirmation: '' });
      setPwNote({ tone: 'ok', text: 'Your password has been updated.' });
    } catch (error) {
      setPwErrors(error.errors || {});
      if (!Object.keys(error.errors || {}).length) setPwNote({ tone: 'error', text: error.message });
    } finally {
      setSavingPw(false);
    }
  };

  const deleteAccount = async (event) => {
    event.preventDefault();
    setDeleteError('');
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return;
    try {
      await api.delete('/profile', { password: deletePassword });
      logout();
      navigate('/');
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  const setP = (key) => (e) => setProfile({ ...profile, [key]: e.target.value });
  const setW = (key) => (e) => setPw({ ...pw, [key]: e.target.value });

  return (
    <>
      <section className="shop-head">
        <div className="kicker">My account</div>
        <h1>Hello, {user.name.split(' ')[0]}</h1>
        <p className="muted">Manage your details, password and orders in one place.</p>
      </section>

      <div className="acc">
        <aside className="acc__side">
          <div className="acc-card">
            <span className="acc-card__avatar">{initials(user.name)}</span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.createdAt && <small>Member since {formatDate(user.createdAt, false)}</small>}

            <dl className="acc-card__stats">
              <div><dt>{orders.loading ? '–' : list.length}</dt><dd>Orders</dd></div>
              <div><dt>{orders.loading ? '–' : money(spent, 0)}</dt><dd>Total spent</dd></div>
            </dl>

            <nav className="acc-card__links" aria-label="Account">
              <Link to="/orders"><Icon name="receipt" /> My orders</Link>
              <Link to="/shop"><Icon name="gift" /> Keep shopping</Link>
              <button type="button" onClick={() => { logout(); navigate('/'); }}><Icon name="logout" /> Log out</button>
            </nav>
          </div>
        </aside>

        <div className="acc__main">
          <form className="panel acc-panel" onSubmit={saveProfile} noValidate>
            <div className="acc-panel__head">
              <span className="acc-panel__icon"><Icon name="user" /></span>
              <div>
                <h2>Personal details</h2>
                <p>These are used to fill in checkout for you.</p>
              </div>
            </div>

            <Notice tone={profileNote.tone}>{profileNote.text}</Notice>

            <div className="auth2__row">
              <TextField label="Full name" value={profile.name} onChange={setP('name')} autoComplete="name" required error={profileErrors.name} />
              <TextField label="Email" type="email" value={profile.email} onChange={setP('email')} autoComplete="email" required error={profileErrors.email} />
            </div>
            <TextField label="Phone number" type="tel" value={profile.phone} onChange={setP('phone')} placeholder="+880 1XXX XXXXXX" autoComplete="tel" error={profileErrors.phone} />
            <TextAreaField label="Delivery address" rows="3" value={profile.address} onChange={setP('address')} placeholder="House, road, area and city" autoComplete="street-address" error={profileErrors.address} />

            <div className="acc-panel__actions">
              <button className="btn" type="submit" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>

          <form className="panel acc-panel" onSubmit={savePassword} noValidate>
            <div className="acc-panel__head">
              <span className="acc-panel__icon"><Icon name="lock" /></span>
              <div>
                <h2>Password</h2>
                <p>Choose a strong password to keep your account secure.</p>
              </div>
            </div>

            <Notice tone={pwNote.tone}>{pwNote.text}</Notice>

            <PasswordField label="Current password" value={pw.currentPassword} onChange={setW('currentPassword')} autoComplete="current-password" error={pwErrors.currentPassword} />
            <div className="auth2__row">
              <PasswordField label="New password" value={pw.password} onChange={setW('password')} autoComplete="new-password" placeholder="At least 8 characters" error={pwErrors.password} />
              <PasswordField label="Confirm new password" value={pw.passwordConfirmation} onChange={setW('passwordConfirmation')} autoComplete="new-password" error={pwErrors.passwordConfirmation} />
            </div>
            <StrengthMeter value={pw.password} />

            <div className="acc-panel__actions">
              <button className="btn" type="submit" disabled={savingPw}>{savingPw ? 'Updating…' : 'Update password'}</button>
            </div>
          </form>

          <form className="panel acc-panel acc-panel--danger" onSubmit={deleteAccount} noValidate>
            <div className="acc-panel__head">
              <span className="acc-panel__icon acc-panel__icon--danger"><Icon name="alert" /></span>
              <div>
                <h2>Delete account</h2>
                <p>This permanently removes your account. Your past orders stay on record with the store.</p>
              </div>
            </div>
            <PasswordField label="Confirm with your password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} autoComplete="current-password" error={deleteError} />
            <div className="acc-panel__actions">
              <button className="btn btn--danger" type="submit" disabled={!deletePassword}>Delete my account</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
