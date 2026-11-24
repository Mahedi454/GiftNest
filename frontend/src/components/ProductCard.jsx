import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl, money } from '../api.js';

const limit = (text, n) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text);

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const url = `/product/${product.id}`;

  const addToCart = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="card product-card">
      <Link className="product-card__media" to={url}>
        <div className="product-card__frame">
          {product.image ? (
            <img src={assetUrl(product.image)} alt={product.name} loading="lazy" />
          ) : (
            <div className="product-card__placeholder" aria-hidden="true"><span>GiftNest</span></div>
          )}
        </div>
        <span className="pill">{product.category?.name || 'Gift Item'}</span>
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span>GiftNest</span>
          <span>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
        </div>
        <h3 className="product-card__title"><Link to={url}>{product.name}</Link></h3>
        <div className="product-card__note">{limit(product.description, 72)}</div>
        <div className="product-card__row">
          <div className="price">{money(product.price)}</div>
          <div className="product-card__actions">
            <button className={`btn btn--ghost btn--small ${added ? 'btn--added' : ''}`} type="button" onClick={addToCart}>
              {added ? 'Added ✓' : 'Add'}
            </button>
            <Link className="btn btn--small" to={url}>Details</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
