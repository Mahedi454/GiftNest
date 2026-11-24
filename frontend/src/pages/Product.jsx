import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, assetUrl, money } from '../api.js';
import { ErrorBox, NotFound, useFetch } from '../components/common.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reviews from '../components/Reviews.jsx';
import { Stars } from '../components/Stars.jsx';
import { useCart } from '../context/CartContext.jsx';

const perks = [
  { text: 'Ships within 24 hours', path: 'M3 6h11v10H3V6ZM14 10h4l3 3v3h-7M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' },
  { text: 'Secure checkout', path: 'M6 11h12v9H6v-9ZM8.5 11V8a3.5 3.5 0 0 1 7 0v3' },
  { text: 'Track it in My orders', path: 'M5 4h14v16H5V4ZM9 9h6M9 13h6' },
];

function DetailSkeleton() {
  return (
    <div className="pd" aria-busy="true" aria-label="Loading product">
      <span className="skeleton pd__skeleton-media" />
      <div className="pd__skeleton-info">
        <span className="skeleton skeleton--chip" />
        <span className="skeleton skeleton--title" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--short" />
        <span className="skeleton skeleton--btn" />
      </div>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [summary, setSummary] = useState(null);
  const { data, error, loading } = useFetch(() => api.get(`/products/${id}`), [id]);

  if (loading) return <DetailSkeleton />;
  if (error?.status === 404) return <NotFound />;
  if (error) return <ErrorBox error={error} />;

  const { product, relatedProducts } = data;
  const soldOut = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);

  const addToCart = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/shop">Shop</Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category.name)}`}>{product.category.name}</Link>
          </>
        )}
      </nav>

      <section className="pd">
        <div className="pd__media">
          {product.image ? (
            <img src={assetUrl(product.image)} alt={product.name} />
          ) : (
            <div className="pd__placeholder">GiftNest</div>
          )}
        </div>

        <div className="pd__info">
          <div className="pd__meta">
            {product.category && <span className="pd__chip">{product.category.name}</span>}
            <span className={`pd__stock ${soldOut ? 'is-out' : ''}`}>
              <i />{soldOut ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
            </span>
          </div>

          <h1>{product.name}</h1>

          {(() => {
            const avg = summary ? summary.average : product.ratingAvg || 0;
            const count = summary ? summary.count : product.ratingCount || 0;
            return (
              <a className="pd__rating" href="#reviews">
                <Stars value={avg} size={20} />
                {count > 0 ? <span><strong>{avg.toFixed(1)}</strong> · {count} {count === 1 ? 'review' : 'reviews'}</span> : <span>Be the first to review</span>}
              </a>
            );
          })()}

          <p className="pd__desc">{product.description}</p>

          <div className="pd__price">{money(product.price, Number.isInteger(product.price) ? 0 : 2)}</div>

          <div className="pd__buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>−</button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Increase quantity" disabled={soldOut || qty >= maxQty}>+</button>
            </div>
            <button className={`btn btn--lg pd__add ${added ? 'btn--added' : ''}`} type="button" onClick={addToCart} disabled={soldOut}>
              {added ? 'Added to cart ✓' : soldOut ? 'Sold out' : 'Add to cart'}
            </button>
          </div>

          <ul className="pd__perks">
            {perks.map((perk) => (
              <li key={perk.text}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={perk.path} /></svg>
                {perk.text}
              </li>
            ))}
          </ul>

          <Link className="link" to="/shop">← Back to shop</Link>
        </div>
      </section>

      <Reviews productId={product.id} onSummary={setSummary} />

      {relatedProducts.length > 0 && (
        <section className="home-section">
          <div className="head-center">
            <div className="kicker">More products</div>
            <h2>You may also like</h2>
          </div>
          <div className="shop-grid">
            {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
}
