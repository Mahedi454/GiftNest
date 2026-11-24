import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../components/common.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const page = Number(params.get('page')) || 1;

  const [form, setForm] = useState({ search, category });
  useEffect(() => {
    setForm({ search, category });
  }, [search, category]);

  const categories = useFetch(() => api.get('/categories'));
  const products = useFetch(() => {
    const query = new URLSearchParams({ page });
    if (search) query.set('search', search);
    if (category) query.set('category', category);
    return api.get(`/products?${query}`);
  }, [search, category, page]);

  const apply = (next) => {
    const query = {};
    Object.entries(next).forEach(([key, value]) => value && (query[key] = value));
    setParams(query);
  };

  const submit = (event) => {
    event.preventDefault();
    apply({ search: form.search.trim(), category: form.category });
  };

  return (
    <>
      <section className="section section--tight">
        <div className="section__head">
          <div>
            <div className="kicker">Product Listing</div>
            <h1>Shop all products</h1>
          </div>
          <div className="muted">A clean product grid built with React and a reusable product card component.</div>
        </div>
      </section>

      <section className="section">
        <form className="card" onSubmit={submit}>
          <div className="grid grid--2">
            <label className="field">
              <span className="field__label">Search</span>
              <input
                className="input"
                type="search"
                value={form.search}
                onChange={(e) => setForm({ ...form, search: e.target.value })}
                placeholder="Search gifts"
              />
            </label>

            <label className="field">
              <span className="field__label">Category</span>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">All categories</option>
                {categories.data?.categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-product-form__actions">
            <button className="btn" type="submit">Filter</button>
            <button className="btn btn--ghost" type="button" onClick={() => apply({})}>Reset</button>
          </div>
        </form>

        {products.loading ? (
          <Loading />
        ) : products.error ? (
          <ErrorBox error={products.error} />
        ) : (
          <>
            <div className="grid grid--4">
              {products.data.items.length ? (
                products.data.items.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="card empty shop-empty">
                  <div className="empty__title">No products found</div>
                  <div className="empty__subtitle">Create products from the admin panel and they will appear here.</div>
                </div>
              )}
            </div>
            <Pagination
              page={products.data.page}
              pages={products.data.pages}
              onChange={(n) => setParams({ ...Object.fromEntries(params), page: n })}
            />
          </>
        )}
      </section>
    </>
  );
}
