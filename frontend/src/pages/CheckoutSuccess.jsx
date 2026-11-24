import { Link, useParams } from 'react-router-dom';
import { api, money } from '../api.js';
import { ErrorBox, Loading, useFetch } from '../components/common.jsx';

export default function CheckoutSuccess() {
  const { id } = useParams();
  const { data, error, loading } = useFetch(() => api.get(`/orders/${id}`), [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { order } = data;

  return (
    <section className="section">
      <div className="card empty">
        <div className="kicker">Thank you</div>
        <h1>Your order is confirmed</h1>
        <div className="empty__subtitle">Order #{order.orderNumber} is confirmed. We will start preparing it right away.</div>

        <div className="product__highlights">
          <span className="chip">{order.customerName}</span>
          <span className="chip">{order.phone}</span>
          <span className="chip">{money(order.totalPrice)}</span>
        </div>

        <div className="divider" />

        <div className="stack">
          {order.items.map((item) => (
            <div className="cart__summaryRow" key={item.product || item.name}>
              <span className="muted">{item.name} x{item.quantity}</span>
              <span>{money(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="hero__cta">
          <Link className="btn" to="/orders">View orders</Link>
          <Link className="btn btn--ghost" to="/shop">Continue shopping</Link>
        </div>
      </div>
    </section>
  );
}
