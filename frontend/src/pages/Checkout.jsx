import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, money } from '../api.js';
import { FieldError } from '../components/common.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setStatus('');
    try {
      const { order } = await api.post('/orders', {
        ...form,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clear();
      navigate(`/checkout/success/${order.id}`, { replace: true });
    } catch (error) {
      setErrors(error.errors);
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="section section--tight">
        <div className="section__head">
          <div>
            <h1>Checkout</h1>
            <div className="muted">Tell us where to deliver your gifts.</div>
          </div>
          {status && <div className="chip chip--strong">{status}</div>}
        </div>
      </section>

      <section className="section">
        <div className="checkout">
          <form className="card checkout__form" onSubmit={submit}>
            <div className="formgrid">
              <label className="field">
                <span className="field__label">Full name</span>
                <input className="input" type="text" value={form.name} onChange={set('name')} required />
                <FieldError errors={errors} name="name" />
              </label>
              <label className="field">
                <span className="field__label">Phone number</span>
                <input className="input" type="text" value={form.phone} onChange={set('phone')} required />
                <FieldError errors={errors} name="phone" />
              </label>
              <label className="field field--full">
                <span className="field__label">Delivery address</span>
                <textarea className="input" rows="5" value={form.address} onChange={set('address')} required />
                <FieldError errors={errors} name="address" />
              </label>
            </div>
            <button className="btn btn--full" type="submit" disabled={busy}>{busy ? 'Placing your order…' : 'Place order'}</button>
          </form>

          <aside className="card checkout__summary">
            <div className="cart__summaryTitle">Order summary</div>
            {items.map((item) => (
              <div className="cart__summaryRow" key={item.id}>
                <span className="muted">{item.name} x{item.quantity}</span>
                <span>{money(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="cart__summaryRow"><span className="muted">Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="cart__summaryRow"><span className="muted">Shipping</span><span>{money(shipping)}</span></div>
            <div className="divider" />
            <div className="cart__summaryRow cart__summaryRow--total"><span>Total</span><span>{money(total)}</span></div>
          </aside>
        </div>
      </section>
    </>
  );
}
