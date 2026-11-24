import { useState } from 'react';
import { api, money } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';

function OrderCard({ order, onStatus, onChanged }) {
  const [status, setStatus] = useState(order.status);

  const save = async (event) => {
    event.preventDefault();
    try {
      await api.patch(`/admin/orders/${order.id}/status`, { status });
      onStatus('Order status updated successfully.');
      onChanged();
    } catch (e) {
      onStatus(e.message);
    }
  };

  return (
    <article className="card admin-order-card">
      <div className="admin-order-card__top">
        <div>
          <div className="kicker">Order #{order.orderNumber}</div>
          <h3>{order.customerName}</h3>
          <div className="muted small">{order.user?.email ?? 'Deleted account'}</div>
        </div>
        <span className={`status ${order.status === 'completed' ? 'status--delivered' : 'status--pending'}`}>
          {order.status[0].toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="admin-order-card__grid">
        <div>
          <div className="admin-order-card__label">Contact</div>
          <div>{order.phone}</div>
          <div className="muted small">{order.address}</div>
        </div>
        <div>
          <div className="admin-order-card__label">Items</div>
          {order.items.map((item) => (
            <div className="muted small" key={`${item.product}-${item.name}`}>{item.name} x {item.quantity}</div>
          ))}
        </div>
        <div>
          <div className="admin-order-card__label">Total</div>
          <div className="admin-order-card__amount">{money(order.totalPrice)}</div>
        </div>
        <div>
          <div className="admin-order-card__label">Update status</div>
          <form className="admin-order-card__form" onSubmit={save}>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn admin-inline-form__button" type="submit">Update status</button>
          </form>
        </div>
      </div>
    </article>
  );
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/orders?page=${page}`), [page]);

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  return (
    <>
      <section className="section">
        <div className="section__head">
          <div>
            <h1>Manage orders</h1>
            <div className="muted">Track customer purchases, delivery details, and order progress from one place.</div>
          </div>
        </div>

        {status && <div className="card admin-feedback">{status}</div>}

        <div className="grid grid--4">
          <article className="card kpi"><div className="kpi__label">Total orders</div><div className="kpi__value">{stats.total}</div></article>
          <article className="card kpi"><div className="kpi__label">Pending</div><div className="kpi__value">{stats.pending}</div></article>
          <article className="card kpi"><div className="kpi__label">Completed</div><div className="kpi__value">{stats.completed}</div></article>
          <article className="card kpi"><div className="kpi__label">Revenue</div><div className="kpi__value">{money(stats.revenue)}</div></article>
        </div>
      </section>

      <section className="section section--tight">
        <div className="admin-order-list">
          {items.length === 0 ? (
            <div className="card empty">
              <div className="empty__title">No orders yet</div>
              <div className="empty__subtitle">Placed orders will appear here for admin review.</div>
            </div>
          ) : (
            items.map((order) => (
              <OrderCard key={`${order.id}-${order.status}`} order={order} onStatus={setStatus} onChanged={reload} />
            ))
          )}
        </div>
        <Pagination page={data.page} pages={data.pages} onChange={setPage} />
      </section>
    </>
  );
}
