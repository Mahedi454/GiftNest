import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { ErrorBox, Pagination, useFetch } from '../components/common.jsx';
import ProductCard from '../components/ProductCard.jsx';

function SkeletonGrid() {
  return (
    <div className="shop-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 8 }, (_, i) => <span key={i} className="skeleton pcard-skeleton" />)}
    </div>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const page = Number(params.get('page')) || 1;

  const [text, setText] = useState(search);
  useEffect(() => {
    setText(search);
  }, [search]);

  // Changing a filter always goes back to page 1, unless a page is passed explicitly.
  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  };

  // Search as you type, after a short pause.
  useEffect(() => {
    if (text.trim() === search) return undefined;
    const id = setTimeout(() => update({ search: text.trim() }), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const categories = useFetch(() => api.get('/categories'));
  const products = useFetch(() => {
    const query = new URLSearchParams({ page });
    if (search) query.set('search', search);
    if (category) query.set('category', category);
    return api.get(`/products?${query}`);
  }, [search, category, page]);

  const hasFilters = Boolean(search || category);
  const total = products.data?.total;

  const goToPage = (n) => {
    update({ page: n > 1 ? String(n) : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section className="shop-head">
        <div>
          <div className="kicker">Shop</div>
          <h1>Find a gift they will love</h1>
          <p className="muted">Browse the full collection, or narrow it down by category.</p>
        </div>
      </section>

      <section className="shop-tools">
        <form className="searchbox" role="search" onSubmit={(e) => { e.preventDefault(); update({ search: text.trim() }); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />
          </svg>
          <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search gifts, e.g. birthday, frame, mug" aria-label="Search gifts" />
        </form>

        <div className="chips" role="tablist" aria-label="Categories">
          <button type="button" className={`chip-btn ${!category ? 'is-active' : ''}`} onClick={() => update({ category: '' })}>All</button>
          {categories.data?.categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip-btn ${category === c.name ? 'is-active' : ''}`}
              onClick={() => update({ category: category === c.name ? '' : c.name })}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="shop-meta">
          <span>
            {products.loading && total === undefined ? 'Loading…' : `${total ?? 0} ${total === 1 ? 'gift' : 'gifts'}`}
            {search && <> for “{search}”</>}
          </span>
          {hasFilters && (
            <button type="button" className="shop-meta__clear" onClick={() => { setText(''); setParams({}); }}>Clear filters</button>
          )}
        </div>
      </section>

      {products.loading ? (
        <SkeletonGrid />
      ) : products.error ? (
        <ErrorBox error={products.error} />
      ) : products.data.items.length === 0 ? (
        <div className="shop-empty">
          <div className="shop-empty__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />
            </svg>
          </div>
          <h2>No gifts found</h2>
          <p className="muted">Try a different word or category, or clear the filters.</p>
          <button type="button" className="btn" onClick={() => { setText(''); setParams({}); }}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="shop-grid">
            {products.data.items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <Pagination page={products.data.page} pages={products.data.pages} onChange={goToPage} />
        </>
      )}

      <div className="shop-foot">
        <Link className="link" to="/">← Back to home</Link>
      </div>
    </>
  );
}
