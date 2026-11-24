import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl, money } from '../api.js';
import { Stars } from './Stars.jsx';

// Whole prices read cleaner without ".00".
const price = (value) => money(value, Number.isInteger(value) ? 0 : 2);

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const url = `/product/${product.id}`;
  const soldOut = product.stock <= 0;

  const addToCart = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="pcard" style={{ '--i': index }}>
      <Link className="pcard__media" to={url} aria-label={product.name}>
        {product.image ? (
          <img src={assetUrl(product.image)} alt={product.name} loading="lazy" />
        ) : (
          <span className="pcard__placeholder">GiftNest</span>
        )}
        {product.category?.name && <span className="pcard__cat">{product.category.name}</span>}
        {soldOut && <span className="pcard__sold">Sold out</span>}
      </Link>

      <div className="pcard__body">
        <h3 className="pcard__title"><Link to={url}>{product.name}</Link></h3>
        {product.ratingCount > 0 && (
          <Link className="pcard__rating" to={`${url}#reviews`} aria-label={`${product.ratingAvg} out of 5 from ${product.ratingCount} reviews`}>
            <Stars value={product.ratingAvg} size={14} />
            <span>{product.ratingAvg.toFixed(1)}</span>
            <small>({product.ratingCount})</small>
          </Link>
        )}
        <p className="pcard__desc">{product.description}</p>

        <div className="pcard__foot">
          <span className="pcard__price">{price(product.price)}</span>
          <button
            className={`pcard__add ${added ? 'is-added' : ''}`}
            type="button"
            onClick={addToCart}
            disabled={soldOut}
            aria-label={`Add ${product.name} to cart`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {added ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M12 5v14M5 12h14" />}
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
