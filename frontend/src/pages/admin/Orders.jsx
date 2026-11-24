import { useState } from 'react';
import { api, formatDate, money } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';

function OrderRow({ order, onMessage, onChanged }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const change = async (event) => {
    const next = event.target.value;
    const previous = status;
    setStatus(next);
    setSaving(true);
    try {
      await api.patch(`/admin/orders/${order.id}/status`, { status: next });
      onMessage(`Order #${order.orderNumber} marked as ${next}.`);
      onChanged();
    } catch (error) {
      setStatus(previous);
      onMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const firstItem = order.items[0];
  const more = order.items.length - 1;

  return (
    <tr>
      <td data-label="Order">
        <div className="tcell">
        <strong className="t-strong">#{order.orderNumber}</strong>
        <small className="t-sub">{formatDate(order.createdAt)}</small>
        </div>
      </td>
      <td data-label="Customer">
        <div className="tcell">
        <strong className="t-strong">{order.customerName}</strong>
        <small className="t-sub">{order.user?.email ?? 'Account removed'}</small>
        </div>
      </td>
      <td data-label="Items">
        <div className="tcell">
        <span className="t-clip">{firstItem?.name}{firstItem && firstItem.quantity > 1 ? ` × ${firstItem.quantity}` : ''}</span>
        {more > 0 && <small className="t-sub">+ {more} more {more === 1 ? 'item' : 'items'}</small>}
        </div>
      </td>
      <td data-label="Delivery">
        <div className="tcell">
        <span className="t-clip">{order.phone}</span>
        <small className="t-sub t-clip" title={order.address}>{order.address}</small>
        </div>
      </td>
      <td data-label="Total" className="t-num">{money(order.totalPrice, 0)}</td>
      <td data-label="Status">
        <select
          className={`status-select status-select--${status}`}
          value={status}
          onChange={change}
          disabled={saving}
          aria-label={`Status of order ${order.orderNumber}`}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </td>
    </tr>
  );
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const { data, error, loading, reload } = useFetch(
    () => api.get(`/admin/orders?page=${page}${filter !== 'all' ? `&status=${filter}` : ''}`),
    [page, filter],
  );

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  const tabs = [
    { key: 'all', label: 'All orders', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="adm-page">
      <header className="pagehead">
        <div>
          <h1>Orders</h1>
          <p>Review customer orders and update their progress.</p>
        </div>
        <div className="pagehead__stat">
          <span>Revenue</span>
          <strong>{money(stats.revenue, 0)}</strong>
        </div>
      </header>

      {message && <div className="notice" role="status">{message}</div>}

      <div className="tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            className={`tabs__tab ${filter === tab.key ? 'is-active' : ''}`}
            onClick={() => { setFilter(tab.key); setPage(1); }}
          >
            {tab.label} <span>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="tablecard">
        {items.length === 0 ? (
          <div className="tablecard__empty">
            <strong>No orders here</strong>
            <span>{filter === 'all' ? 'New orders will appear here as customers check out.' : 'There are no orders with this status.'}</span>
          </div>
        ) : (
          <table className="dtable">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Delivery</th><th className="t-num">Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <OrderRow key={order.id} order={order} onMessage={setMessage} onChanged={reload} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
