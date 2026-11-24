import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { FieldError } from '../components/common.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone || '', address: user.address || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileStatus, setProfileStatus] = useState('');

  const [pw, setPw] = useState({ currentPassword: '', password: '', passwordConfirmation: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwStatus, setPwStatus] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileErrors({});
    setProfileStatus('');
    try {
      const { user: updated } = await api.put('/profile', profile);
      setUser(updated);
      setProfileStatus('Profile updated successfully.');
    } catch (error) {
      setProfileErrors(error.errors);
      setProfileStatus(error.message);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPwErrors({});
    setPwStatus('');
    try {
      await api.put('/profile/password', pw);
      setPw({ currentPassword: '', password: '', passwordConfirmation: '' });
      setPwStatus('Password updated successfully.');
    } catch (error) {
      setPwErrors(error.errors);
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
    <section className="section auth">
      <div className="section__head">
        <div>
          <div className="kicker">My account</div>
          <h1>Manage your profile</h1>
        </div>
        <div className="muted">Update your personal details, delivery contact, and account password.</div>
      </div>

      <div className="profile-shell">
        <div className="card profile-panel">
          <div className="auth__cardHead">
            <h2>Profile information</h2>
            <p className="muted">Keep your details up to date so checkout is quick and delivery goes smoothly.</p>
          </div>
          {profileStatus && <div className="chip chip--strong">{profileStatus}</div>}

          <form className="auth__form" onSubmit={saveProfile}>
            <div className="formgrid">
              <label className="field">
                <span className="field__label">Full name</span>
                <input className="input" type="text" value={profile.name} onChange={setP('name')} required />
                <FieldError errors={profileErrors} name="name" />
              </label>
              <label className="field">
                <span className="field__label">Email</span>
                <input className="input" type="email" value={profile.email} onChange={setP('email')} required />
                <FieldError errors={profileErrors} name="email" />
              </label>
              <label className="field">
                <span className="field__label">Phone number</span>
                <input className="input" type="text" value={profile.phone} onChange={setP('phone')} placeholder="+880 1XXX XXXXXX" />
                <FieldError errors={profileErrors} name="phone" />
              </label>
            </div>
            <label className="field">
              <span className="field__label">Address</span>
              <textarea className="input" rows="4" value={profile.address} onChange={setP('address')} placeholder="Your delivery address" />
            </label>
            <button className="btn" type="submit">Save profile</button>
          </form>
        </div>

        <div className="card profile-panel">
          <div className="auth__cardHead">
            <h2>Change password</h2>
            <p className="muted">Choose a strong password to keep your account secure.</p>
          </div>
          {pwStatus && <div className="chip chip--strong">{pwStatus}</div>}

          <form className="auth__form" onSubmit={savePassword}>
            <label className="field">
              <span className="field__label">Current password</span>
              <input className="input" type="password" value={pw.currentPassword} onChange={setW('currentPassword')} autoComplete="current-password" />
              <FieldError errors={pwErrors} name="currentPassword" />
            </label>
            <label className="field">
              <span className="field__label">New password</span>
              <input className="input" type="password" value={pw.password} onChange={setW('password')} autoComplete="new-password" />
              <FieldError errors={pwErrors} name="password" />
            </label>
            <label className="field">
              <span className="field__label">Confirm new password</span>
              <input className="input" type="password" value={pw.passwordConfirmation} onChange={setW('passwordConfirmation')} autoComplete="new-password" />
              <FieldError errors={pwErrors} name="passwordConfirmation" />
            </label>
            <button className="btn" type="submit">Update password</button>
          </form>
        </div>

        <div className="card profile-panel">
          <div className="auth__cardHead">
            <h2>Delete account</h2>
            <p className="muted">This permanently removes your account. Enter your password to confirm.</p>
          </div>
          <form className="auth__form" onSubmit={deleteAccount}>
            <label className="field">
              <span className="field__label">Password</span>
              <input className="input" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required autoComplete="current-password" />
              {deleteError && <span className="muted">{deleteError}</span>}
            </label>
            <button className="btn btn--danger" type="submit">Delete account</button>
          </form>
        </div>
      </div>
    </section>
  );
}
