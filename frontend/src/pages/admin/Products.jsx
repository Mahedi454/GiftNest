import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl, money } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';
import Icon from '../../components/Icon.jsx';

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/products?page=${page}`), [page]);

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/admin/products/${product.id}`);
      setMessage(res.message);
      reload();
    } catch (e) {
      setMessage(e.message);
    }
  };

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  const cards = [
    { label: 'Products', value: stats.total, icon: 'box', tone: 'violet' },
    { label: 'Visible in store', value: stats.active, icon: 'check', tone: 'teal' },
    { label: 'Categories', value: stats.categories, icon: 'tag', tone: 'pink' },
    { label: 'Low stock', value: stats.lowStock, icon: 'alert', tone: 'amber' },
  ];

  return (
    <div className="adm-page">
      <header className="pagehead">
        <div>
          <h1>Products</h1>
          <p>Add, edit and organise your products, stock levels and visibility.</p>
        </div>
        <div className="pagehead__actions">
          <Link className="btn" to="/admin/products/new"><Icon name="plus" width={2.4} /> Add product</Link>
        </div>
      </header>

      {message && <div className="notice" role="status">{message}</div>}

      <section className="kpis kpis--compact" aria-label="Product figures">
        {cards.map((card, i) => (
          <article className={`kpi2 kpi2--${card.tone}`} key={card.label} style={{ '--i': i }}>
            <span className="kpi2__icon"><Icon name={card.icon} /></span>
            <div className="kpi2__body">
              <span className="kpi2__label">{card.label}</span>
              <strong className="kpi2__value">{card.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <div className="tablecard">
        {items.length === 0 ? (
          <div className="tablecard__empty">
            <strong>No products yet</strong>
            <span>Add your first product to get the store started.</span>
          </div>
        ) : (
          <table className="dtable">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Stock</th><th className="t-num">Price</th><th>Status</th><th className="t-actions">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((product) => (
                <tr key={product.id}>
                  <td data-label="Product">
                    <div className="pcell">
                      <span className="pcell__thumb">
                        {product.image ? <img src={assetUrl(product.image)} alt="" /> : <Icon name="box" />}
                      </span>
                      <span className="pcell__text">
                        <strong className="t-strong">{product.name}</strong>
                        <small className="t-sub t-clip">{product.description}</small>
                      </span>
                    </div>
                  </td>
                  <td data-label="Category">{product.category?.name || 'Uncategorised'}</td>
                  <td data-label="Stock">
                    <span className={`pill2 ${product.stock === 0 ? 'pill2--out' : product.stock <= 5 ? 'pill2--low' : 'pill2--ok'}`}>
                      {product.stock === 0 ? 'Sold out' : product.stock <= 5 ? `${product.stock} left` : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td data-label="Price" className="t-num">{money(product.price, Number.isInteger(product.price) ? 0 : 2)}</td>
                  <td data-label="Status">
                    <span className={`pill2 ${product.isActive ? 'pill2--completed' : 'pill2--muted'}`}>{product.isActive ? 'Visible' : 'Hidden'}</span>
                  </td>
                  <td data-label="Actions" className="t-actions">
                    <div className="row-actions">
                      <Link className="icon-btn" to={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`} title="Edit"><Icon name="edit" /></Link>
                      <button className="icon-btn icon-btn--danger" type="button" onClick={() => remove(product)} aria-label={`Delete ${product.name}`} title="Delete"><Icon name="trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
