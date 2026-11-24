import { useState } from 'react';
import { api, formatDate } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';

function UserRow({ user, onStatus, onChanged }) {
  const [role, setRole] = useState(user.role);

  const save = async (event) => {
    event.preventDefault();
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role });
      onStatus('User role updated successfully.');
      onChanged();
    } catch (e) {
      setRole(user.role);
      onStatus(e.message);
    }
  };

  return (
    <div className="table__row table__row--users">
      <div><strong>{user.name}</strong></div>
      <div>{user.email}</div>
      <div>
        <span className={`status ${user.role === 'admin' ? 'status--delivered' : 'status--shipped'}`}>
          {user.role === 'admin' ? 'Administrator' : 'Customer'}
        </span>
      </div>
      <div>{formatDate(user.createdAt)}</div>
      <div className="table__actions table__actions--users">
        <form className="admin-inline-form admin-inline-form--role" onSubmit={save}>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn admin-inline-form__button" type="submit">Update role</button>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/users?page=${page}`), [page]);

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  return (
    <>
      <section className="section">
        <div className="section__head">
          <div>
            <h1>Manage users</h1>
            <div className="muted">Separate admins from customers and control permissions from one secure screen.</div>
          </div>
        </div>

        {status && <div className="card admin-feedback">{status}</div>}

        <div className="grid grid--3">
          <article className="card kpi"><div className="kpi__label">Total users</div><div className="kpi__value">{stats.total}</div></article>
          <article className="card kpi"><div className="kpi__label">Administrators</div><div className="kpi__value">{stats.admins}</div></article>
          <article className="card kpi"><div className="kpi__label">Customers</div><div className="kpi__value">{stats.customers}</div></article>
        </div>
      </section>

      <section className="section section--tight">
        <div className="card table">
          <div className="table__row table__head table__row--users">
            <div>User</div><div>Email</div><div>Role</div><div>Joined</div><div>Actions</div>
          </div>
          {items.length === 0 ? (
            <div className="empty">
              <div className="empty__title">No users yet</div>
              <div className="empty__subtitle">Registered accounts will appear here for admin role management.</div>
            </div>
          ) : (
            items.map((user) => (
              <UserRow key={`${user.id}-${user.role}`} user={user} onStatus={setStatus} onChanged={reload} />
            ))
          )}
        </div>
        <Pagination page={data.page} pages={data.pages} onChange={setPage} />
      </section>
    </>
  );
}
