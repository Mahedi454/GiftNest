import { Link, useNavigate } from 'react-router-dom';
import { assetUrl, money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, subtotal, shipping, total, setQuantity, remove } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <section className="section section--tight">
        <div className="section__head">
          <div>
            <h1>Cart</h1>
            <div className="muted">Review your selected products before moving to checkout.</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cart">
          <div className="card cart__items">
            {items.length === 0 ? (
              <div className="empty">
                <div className="empty__title">Your cart is empty</div>
                <div className="empty__subtitle">Add something from the shop to get started.</div>
                <Link className="btn" to="/shop">Browse products</Link>
              </div>
            ) : (
              items.map((item) => (
                <div className="cartrow" key={item.id}>
                  <div className="cartrow__media">
                    {item.image ? (
                      <img src={assetUrl(item.image)} alt={item.name} className="cartrow__image" />
                    ) : (
                      <div className="cartrow__placeholder">GiftNest</div>
                    )}
                  </div>

                  <div className="cartrow__main">
                    <div className="cartrow__title">{item.name}</div>
                    <div className="muted small">{money(item.price)} each</div>
                  </div>

                  <div className="cartrow__form">
                    <label className="field">
                      <span className="field__label">Qty</span>
                      <input
                        className="input"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                      />
                    </label>
                  </div>

                  <div className="cartrow__price">{money(item.price * item.quantity)}</div>
                  <button className="btn btn--danger btn--small" type="button" onClick={() => remove(item.id)}>Remove</button>
                </div>
              ))
            )}
          </div>

          <aside className="card cart__summary">
            <div className="cart__summaryTitle">Order summary</div>
            <div className="cart__summaryRow"><span className="muted">Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="cart__summaryRow"><span className="muted">Shipping</span><span>{money(shipping)}</span></div>
            <div className="divider" />
            <div className="cart__summaryRow cart__summaryRow--total"><span>Total</span><span>{money(total)}</span></div>
            <button className="btn btn--full" type="button" disabled={!items.length} onClick={() => navigate('/checkout')}>
              Checkout
            </button>
          </aside>
        </div>
      </section>
    </>
  );
}
