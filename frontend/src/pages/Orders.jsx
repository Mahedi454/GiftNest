import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl, formatDate, money } from '../api.js';
import { ErrorBox, useFetch } from '../components/common.jsx';
import Icon from '../components/Icon.jsx';

const fmt = (value) => money(value, Number.isInteger(value) ? 0 : 2);

const steps = ['Order placed', 'Being prepared', 'Completed'];

function Tracker({ status }) {
  // pending -> "Being prepared" is the current step; completed -> everything is done
  const current = status === 'completed' ? 3 : 1;
  return (
    <ol className="track" aria-label="Order progress">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <li className={`track__step track__step--${state}`} key={label}>
            <span className="track__dot">{state === 'done' ? <Icon name="check" width={3} /> : i + 1}</span>
            <span className="track__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderCard({ order, index }) {
  const [open, setOpen] = useState(false);
  const done = order.status === 'completed';
  const shown = order.items.slice(0, 4);
  const extra = order.items.length - shown.length;
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="ocard" style={{ '--i': index }}>
      <header className="ocard__head">
        <div>
          <h2>Order #{order.orderNumber}</h2>
          <p>Placed on {formatDate(order.createdAt)} · {count} {count === 1 ? 'item' : 'items'}</p>
        </div>
        <span className={`pill2 pill2--${order.status}`}>{done ? 'Completed' : 'In progress'}</span>
      </header>

      <Tracker status={order.status} />

      <div className="ocard__body">
        <div className="ocard__thumbs">
          {shown.map((item) => (
            <span className="ocard__thumb" key={`${item.product}-${item.name}`} title={item.name}>
              {item.image ? <img src={assetUrl(item.image)} alt={item.name} /> : <Icon name="gift" />}
            </span>
          ))}
          {extra > 0 && <span className="ocard__thumb ocard__thumb--more">+{extra}</span>}
        </div>
        <p className="ocard__names">
          {order.items.slice(0, 2).map((i) => i.name).join(', ')}
          {order.items.length > 2 && ` and ${order.items.length - 2} more`}
        </p>
        <div className="ocard__total">
          <span>Total</span>
          <strong>{fmt(order.totalPrice)}</strong>
        </div>
      </div>

      <button className="ocard__toggle" type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? 'Hide details' : 'View details'}
        <Icon name="chevron" width={2.2} />
      </button>

      {open && (
        <div className="ocard__detail">
          <ul className="ocard__lines">
            {order.items.map((item) => (
              <li key={`${item.product}-${item.name}`}>
                <span className="ocard__thumb ocard__thumb--sm">
                  {item.image ? <img src={assetUrl(item.image)} alt="" /> : <Icon name="gift" />}
                </span>
                <span className="ocard__lineName">
                  <strong>{item.name}</strong>
                  <small>{item.quantity} × {fmt(item.price)}</small>
                </span>
                <span className="ocard__lineTotal">{fmt(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="ocard__cols">
            <div className="ocard__box">
              <h3>Delivery</h3>
              <p><Icon name="user" /> {order.customerName}</p>
              <p><Icon name="phone" /> {order.phone}</p>
              <p><Icon name="pin" /> {order.address}</p>
            </div>
            <div className="ocard__box">
              <h3>Payment summary</h3>
              <div className="ocard__sum"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
              <div className="ocard__sum"><span>Shipping</span><span>{fmt(order.shipping)}</span></div>
              <div className="ocard__sum ocard__sum--total"><span>Total</span><span>{fmt(order.totalPrice)}</span></div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function OrdersSkeleton() {
  return (
    <div className="orders-skel" aria-busy="true" aria-label="Loading orders">
      {[0, 1, 2].map((i) => <span key={i} className="skeleton" />)}
    </div>
  );
}

export default function Orders() {
  const { data, error, loading } = useFetch(() => api.get('/orders/mine'));
  const [filter, setFilter] = useState('all');

  if (error) return <ErrorBox error={error} />;

  const orders = data?.orders || [];
  const visible = filter === 'all' ? orders : orders.filter((o) => (filter === 'completed' ? o.status === 'completed' : o.status !== 'completed'));
  const counts = {
    all: orders.length,
    progress: orders.filter((o) => o.status !== 'completed').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <>
      <section className="shop-head">
        <div className="kicker">My account</div>
        <h1>My orders</h1>
        <p className="muted">Follow the status of every order you have placed.</p>
      </section>

      {loading ? (
        <OrdersSkeleton />
      ) : orders.length === 0 ? (
        <div className="shop-empty">
          <div className="shop-empty__icon" aria-hidden="true"><Icon name="receipt" /></div>
          <h2>No orders yet</h2>
          <p className="muted">When you place an order, it will show up here so you can follow it.</p>
          <Link className="btn" to="/shop">Start shopping</Link>
        </div>
      ) : (
        <>
          <div className="tabs orders-tabs" role="tablist">
            {[['all', 'All orders', counts.all], ['progress', 'In progress', counts.progress], ['completed', 'Completed', counts.completed]].map(([key, label, n]) => (
              <button key={key} type="button" role="tab" aria-selected={filter === key} className={`tabs__tab ${filter === key ? 'is-active' : ''}`} onClick={() => setFilter(key)}>
                {label} <span>{n}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="orders-none">No orders in this view.</p>
          ) : (
            <div className="olist">
              {visible.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
            </div>
          )}
        </>
      )}
    </>
  );
}
