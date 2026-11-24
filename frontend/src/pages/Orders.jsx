import { Link } from 'react-router-dom';
import { api, formatDate, money } from '../api.js';
import { ErrorBox, Loading, useFetch } from '../components/common.jsx';

export default function Orders() {
  const { data, error, loading } = useFetch(() => api.get('/orders/mine'));

  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;

  return (
    <section className="section">
      <div className="section__head">
        <h1>My orders</h1>
        <div className="muted">Follow the status of every order you have placed.</div>
      </div>

      <div className="card table">
        <div className="table__row table__head">
          <div>Order</div>
          <div>Status</div>
          <div>Total</div>
          <div>Date</div>
        </div>

        {data.orders.length === 0 ? (
          <div className="empty">
            <div className="empty__title">No orders yet</div>
            <div className="empty__subtitle">When you place an order, it will show up here.</div>
            <Link className="btn" to="/shop">Start shopping</Link>
          </div>
        ) : (
          data.orders.map((order) => (
            <div className="table__row" key={order.id}>
              <div>#{order.orderNumber}</div>
              <div>
                <span className={`status ${order.status === 'completed' ? 'status--delivered' : 'status--pending'}`}>
                  {order.status[0].toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div>{money(order.totalPrice)}</div>
              <div className="muted">{formatDate(order.createdAt)}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
