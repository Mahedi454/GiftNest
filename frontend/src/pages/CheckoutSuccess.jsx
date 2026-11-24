import { Link, useParams } from 'react-router-dom';
import { api, assetUrl, formatDate, money } from '../api.js';
import { ErrorBox, Loading, useFetch } from '../components/common.jsx';
import Icon from '../components/Icon.jsx';
import { Stepper } from './Checkout.jsx';

const fmt = (value) => money(value, Number.isInteger(value) ? 0 : 2);

const next = [
  { icon: 'gift', title: 'We prepare your gifts', text: 'Each item is checked and packed with care.' },
  { icon: 'truck', title: 'Dispatch within 24 hours', text: 'Your order leaves us quickly and heads to your address.' },
  { icon: 'receipt', title: 'Follow it any time', text: 'Check the status whenever you like in My orders.' },
];

export default function CheckoutSuccess() {
  const { id } = useParams();
  const { data, error, loading } = useFetch(() => api.get(`/orders/${id}`), [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { order } = data;

  return (
    <>
      <Stepper current={3} />

      <section className="done">
        <span className="done__badge" aria-hidden="true">
          <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="26" cy="26" r="23" className="done__ring" />
            <path d="M15 27l8 8 14-16" className="done__tick" />
          </svg>
        </span>
        <div className="kicker">Thank you</div>
        <h1>Your order is confirmed</h1>
        <p className="done__lead">
          Thank you, {order.customerName.split(' ')[0]}. Order <strong>#{order.orderNumber}</strong> was placed on {formatDate(order.createdAt)}.
          We will start preparing it right away.
        </p>

        <div className="done__grid">
          <article className="panel done__card">
            <h2>Order summary</h2>
            <ul className="co__items">
              {order.items.map((item) => (
                <li key={`${item.product}-${item.name}`}>
                  <span className="co__thumb">
                    {item.image ? <img src={assetUrl(item.image)} alt="" /> : <Icon name="gift" />}
                    <em>{item.quantity}</em>
                  </span>
                  <span className="co__name">{item.name}</span>
                  <span className="co__price">{fmt(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="co__rows">
              <div><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
              <div><span>Shipping</span><span>{fmt(order.shipping)}</span></div>
              <div className="co__total"><span>Total</span><span>{fmt(order.totalPrice)}</span></div>
            </div>
          </article>

          <article className="panel done__card">
            <h2>Delivering to</h2>
            <ul className="done__details">
              <li><Icon name="user" /><span>{order.customerName}</span></li>
              <li><Icon name="phone" /><span>{order.phone}</span></li>
              <li><Icon name="pin" /><span>{order.address}</span></li>
            </ul>

            <h2 className="done__sub">What happens next</h2>
            <ol className="done__next">
              {next.map((step) => (
                <li key={step.title}>
                  <span><Icon name={step.icon} /></span>
                  <div><strong>{step.title}</strong><small>{step.text}</small></div>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="done__actions">
          <Link className="btn btn--lg" to="/orders">View my orders</Link>
          <Link className="btn btn--ghost btn--lg" to="/shop">Continue shopping</Link>
        </div>
      </section>
    </>
  );
}
