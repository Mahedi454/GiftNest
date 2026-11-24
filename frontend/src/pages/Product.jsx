import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, assetUrl, money } from '../api.js';
import { ErrorBox, Loading, NotFound, useFetch } from '../components/common.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const { data, error, loading } = useFetch(() => api.get(`/products/${id}`), [id]);

  if (loading) return <Loading />;
  if (error?.status === 404) return <NotFound />;
  if (error) return <ErrorBox error={error} />;

  const { product, relatedProducts } = data;

  const addToCart = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <section className="product">
        <div className="product__grid">
          <div className="card product__media">
            <div className="product__mediaFrame">
              {product.image ? (
                <img src={assetUrl(product.image)} alt={product.name} className="product__mediaImage" />
              ) : (
                <div className="product__mediaPlaceholder">
                  <div className="product__mediaBadge">GiftNest</div>
                  <span>{product.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="product__info">
            <div className="kicker">Product Details</div>
            <h1>{product.name}</h1>
            <p className="lead">{product.description}</p>

            <div className="product__highlights">
              {product.category && <span className="chip">{product.category.name}</span>}
              <span className="chip">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
              <span className="chip">Responsive Design</span>
            </div>

            <div className="product__buy card">
              <div className="product__buyRow">
                <div>
                  <div className="muted">Price</div>
                  <div className="price price--xl">{money(product.price)}</div>
                </div>
              </div>

              <div className="product__actions">
                <button className="btn" type="button" onClick={addToCart}>{added ? 'Added ✓' : 'Add to cart'}</button>
                <Link className="btn btn--ghost" to="/shop">Back to shop</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section">
          <div className="section__head">
            <div>
              <div className="kicker">More Products</div>
              <h2>You may also like</h2>
            </div>
          </div>
          <div className="grid grid--4">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
