import { Link, useNavigate } from 'react-router-dom';
import { assetUrl, money } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Stepper } from './Checkout.jsx';

const fmt = (value) => money(value, Number.isInteger(value) ? 0 : 2);

export default function Cart() {
  const { items, count, subtotal, shipping, total, setQuantity, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="shop-empty">
        <div className="shop-empty__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" />
            <circle cx="10" cy="19" r="1.5" />
            <circle cx="17" cy="19" r="1.5" />
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p className="muted">Add something from the shop to get started.</p>
        <Link className="btn" to="/shop">Browse gifts</Link>
      </section>
    );
  }

  return (
    <>
      <section className="shop-head">
        <div className="kicker">Your cart</div>
        <h1>Shopping cart</h1>
        <p className="muted">{count} {count === 1 ? 'item' : 'items'} ready for checkout.</p>
      </section>

      <Stepper current={0} />

      <div className="cart2">
        <div className="cart2__list">
          {items.map((item, i) => (
            <div className="crow" key={item.id} style={{ '--i': i }}>
              <Link className="crow__img" to={`/product/${item.id}`}>
                {item.image ? <img src={assetUrl(item.image)} alt={item.name} /> : <span>GiftNest</span>}
              </Link>

              <div className="crow__main">
                <Link className="crow__name" to={`/product/${item.id}`}>{item.name}</Link>
                <span className="crow__each">{fmt(item.price)} each</span>
              </div>

              <div className="qty qty--sm" role="group" aria-label={`Quantity of ${item.name}`}>
                <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">−</button>
                <span aria-live="polite">{item.quantity}</span>
                <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
              </div>

              <div className="crow__total">{fmt(item.price * item.quantity)}</div>

              <button className="crow__remove" type="button" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          ))}
          <Link className="link" to="/shop">← Continue shopping</Link>
        </div>

        <aside className="cart2__summary">
          <h2>Order summary</h2>
          <div className="cart2__row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="cart2__row"><span>Shipping</span><span>{fmt(shipping)}</span></div>
          <div className="cart2__row cart2__row--total"><span>Total</span><span>{fmt(total)}</span></div>
          <button className="btn btn--lg cart2__checkout" type="button" onClick={() => navigate('/checkout')}>
            Checkout →
          </button>
          {!user && <p className="cart2__note">You will be asked to log in before placing the order.</p>}
        </aside>
      </div>
    </>
  );
}
