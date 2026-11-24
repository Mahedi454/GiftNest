import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl, money } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/products?page=${page}`), [page]);

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      const res = await api.delete(`/admin/products/${product.id}`);
      setStatus(res.message);
      reload();
    } catch (e) {
      setStatus(e.message);
    }
  };

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  return (
    <>
      <section className="section">
        <div className="section__head">
          <div>
            <h1>Manage products</h1>
            <div className="muted">Live catalog management for products, stock, categories, and storefront visibility.</div>
          </div>
          <Link className="btn" to="/admin/products/new">Add product</Link>
        </div>

        {status && <div className="card admin-feedback">{status}</div>}

        <div className="grid grid--4">
          <article className="card kpi"><div className="kpi__label">Products</div><div className="kpi__value">{stats.total}</div></article>
          <article className="card kpi"><div className="kpi__label">Active</div><div className="kpi__value">{stats.active}</div></article>
          <article className="card kpi"><div className="kpi__label">Categories</div><div className="kpi__value">{stats.categories}</div></article>
          <article className="card kpi"><div className="kpi__label">Low stock</div><div className="kpi__value">{stats.lowStock}</div></article>
        </div>
      </section>

      <section className="section section--tight">
        <div className="card table">
          <div className="table__row table__head table__row--products">
            <div>Product</div><div>Category</div><div>Stock</div><div>Price</div><div>Status</div><div>Actions</div>
          </div>

          {items.length === 0 ? (
            <div className="empty">
              <div className="empty__title">No products yet</div>
              <div className="empty__subtitle">Create your first product to start managing the catalog.</div>
            </div>
          ) : (
            items.map((product) => (
              <div className="table__row table__row--products" key={product.id}>
                <div>
                  <div className="admin-listing">
                    <div className="admin-listing__thumb">
                      {product.image ? (
                        <img src={assetUrl(product.image)} alt={product.name} />
                      ) : (
                        <div className="admin-listing__placeholder">{product.name[0].toUpperCase()}</div>
                      )}
                    </div>
                    <div className="admin-listing__content">
                      <strong>{product.name}</strong>
                      <div className="muted small">
                        {product.description.length > 56 ? `${product.description.slice(0, 55).trimEnd()}…` : product.description}
                      </div>
                    </div>
                  </div>
                </div>
                <div>{product.category?.name || 'No category'}</div>
                <div>{product.stock}</div>
                <div>{money(product.price)}</div>
                <div>
                  <span className={`status ${product.isActive ? 'status--delivered' : 'status--pending'}`}>
                    {product.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <div className="table__actions">
                  <Link className="btn btn--ghost btn--small" to={`/admin/products/${product.id}/edit`}>Edit</Link>
                  <button className="btn btn--danger btn--small" type="button" onClick={() => remove(product)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination page={data.page} pages={data.pages} onChange={setPage} />
      </section>
    </>
  );
}
