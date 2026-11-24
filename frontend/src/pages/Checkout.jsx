import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api, assetUrl, money } from '../api.js';
import { TextAreaField, TextField } from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const fmt = (value) => money(value, Number.isInteger(value) ? 0 : 2);

export function Stepper({ current }) {
  const steps = ['Cart', 'Delivery', 'Confirmation'];
  return (
    <ol className="stepsbar" aria-label="Checkout progress">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <li key={label} className={`stepsbar__item stepsbar__item--${state}`}>
            <span className="stepsbar__dot">{state === 'done' ? <Icon name="check" width={3} /> : i + 1}</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, count, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    try {
      const { order } = await api.post('/orders', {
        ...form,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clear();
      navigate(`/checkout/success/${order.id}`, { replace: true });
    } catch (error) {
      setErrors(error.errors || {});
      if (!Object.keys(error.errors || {}).length) setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="shop-head">
        <div className="kicker">Checkout</div>
        <h1>Almost there</h1>
        <p className="muted">Tell us where to deliver your gifts.</p>
      </section>

      <Stepper current={1} />

      <form className="co" onSubmit={submit} noValidate>
        <div className="panel co__main">
          <div className="acc-panel__head">
            <span className="acc-panel__icon"><Icon name="pin" /></span>
            <div>
              <h2>Delivery details</h2>
              <p>We will use these details to deliver your order.</p>
            </div>
          </div>

          {message && <div className="acc-notice acc-notice--error" role="alert">{message}</div>}

          <div className="auth2__row">
            <TextField label="Full name" value={form.name} onChange={set('name')} autoComplete="name" required error={errors.name} />
            <TextField label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+880 1XXX XXXXXX" autoComplete="tel" required error={errors.phone} />
          </div>
          <TextAreaField label="Delivery address" rows="4" value={form.address} onChange={set('address')} placeholder="House, road, area and city" autoComplete="street-address" required error={errors.address} />

          <p className="co__hint">Details saved on your profile are filled in automatically. <Link className="link" to="/profile">Update profile</Link></p>
        </div>

        <aside className="panel co__side">
          <h2>Order summary</h2>
          <ul className="co__items">
            {items.map((item) => (
              <li key={item.id}>
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
            <div><span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span><span>{fmt(subtotal)}</span></div>
            <div><span>Shipping</span><span>{fmt(shipping)}</span></div>
            <div className="co__total"><span>Total</span><span>{fmt(total)}</span></div>
          </div>

          <button className="btn btn--lg co__submit" type="submit" disabled={busy}>
            {busy && <i className="spinner" aria-hidden="true" />}
            {busy ? 'Placing your order…' : 'Place order'}
          </button>
          <Link className="co__back" to="/cart">← Back to cart</Link>
        </aside>
      </form>
    </>
  );
}
