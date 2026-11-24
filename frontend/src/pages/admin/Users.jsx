import { useState } from 'react';
import { api, formatDate, initials } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';

function UserRow({ user, onMessage, onChanged }) {
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const change = async (event) => {
    const next = event.target.value;
    const previous = role;
    setRole(next);
    setSaving(true);
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: next });
      onMessage(`${user.name} is now ${next === 'admin' ? 'an administrator' : 'a customer'}.`);
      onChanged();
    } catch (e) {
      setRole(previous);
      onMessage(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td data-label="Name">
        <div className="pcell">
          <span className="rlist__avatar">{initials(user.name)}</span>
          <span className="pcell__text">
            <strong className="t-strong">{user.name}</strong>
            <small className="t-sub">{user.email}</small>
          </span>
        </div>
      </td>
      <td data-label="Phone">{user.phone || <span className="t-sub">Not provided</span>}</td>
      <td data-label="Joined">{formatDate(user.createdAt)}</td>
      <td data-label="Role">
        <select className={`status-select status-select--${role === 'admin' ? 'completed' : 'muted'}`} value={role} onChange={change} disabled={saving} aria-label={`Role of ${user.name}`}>
          <option value="user">Customer</option>
          <option value="admin">Administrator</option>
        </select>
      </td>
    </tr>
  );
}

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/users?page=${page}`), [page]);

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  return (
    <div className="adm-page">
      <header className="pagehead">
        <div>
          <h1>Customers &amp; users</h1>
          <p>View customer accounts and manage administrator access.</p>
        </div>
        <div className="pagehead__stat">
          <span>{stats.admins} {stats.admins === 1 ? 'administrator' : 'administrators'}</span>
          <strong>{stats.customers} customers</strong>
        </div>
      </header>

      {message && <div className="notice" role="status">{message}</div>}

      <div className="tablecard">
        {items.length === 0 ? (
          <div className="tablecard__empty">
            <strong>No users yet</strong>
            <span>New accounts will appear here as customers sign up.</span>
          </div>
        ) : (
          <table className="dtable">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Joined</th><th>Role</th></tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <UserRow key={user.id} user={user} onMessage={setMessage} onChanged={reload} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
