import { useState } from 'react';
import { api } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';

function CategoryRow({ category, onChanged, onStatus }) {
  const [name, setName] = useState(category.name);

  const update = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/admin/categories/${category.id}`, { name });
      onStatus('Category updated successfully.');
      onChanged();
    } catch (e) {
      onStatus(e.message);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    try {
      const res = await api.delete(`/admin/categories/${category.id}`);
      onStatus(res.message);
      onChanged();
    } catch (e) {
      onStatus(e.message);
    }
  };

  return (
    <div className="table__row table__row--categories">
      <div><strong>{category.name}</strong></div>
      <div>{category.productsCount}</div>
      <div className="table__actions table__actions--category">
        <form className="admin-inline-form" onSubmit={update}>
          <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn btn--ghost admin-inline-form__button" type="submit">Update</button>
        </form>
        <button className="btn btn--danger btn--small" type="button" onClick={remove}>Delete</button>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/categories?page=${page}&limit=8`), [page]);

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/categories', { name });
      setName('');
      setStatus('Category created successfully.');
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
            <h1>Manage categories</h1>
            <div className="muted">Keep product groups organized so the storefront stays clean and easy to browse.</div>
          </div>
        </div>

        {status && <div className="card admin-feedback">{status}</div>}

        <div className="grid grid--3">
          <article className="card kpi"><div className="kpi__label">Total categories</div><div className="kpi__value">{stats.total}</div></article>
          <article className="card kpi"><div className="kpi__label">Active groups</div><div className="kpi__value">{stats.withProducts}</div></article>
          <article className="card kpi"><div className="kpi__label">Empty groups</div><div className="kpi__value">{stats.empty}</div></article>
        </div>
      </section>

      <section className="section section--tight">
        <div className="admin-categories-layout">
          <div className="card admin-category-card">
            <h2>Add category</h2>
            <p className="muted">Create a category and use it immediately in product forms.</p>
            <form className="admin-category-form" onSubmit={create}>
              <label className="field">
                <span className="field__label">Category name</span>
                <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <button className="btn" type="submit">Create category</button>
            </form>
          </div>

          <div className="card table">
            <div className="table__row table__head table__row--categories">
              <div>Name</div><div>Products</div><div>Actions</div>
            </div>
            {items.length === 0 ? (
              <div className="empty">
                <div className="empty__title">No categories yet</div>
                <div className="empty__subtitle">Create your first category to organize the catalog.</div>
              </div>
            ) : (
              items.map((category) => (
                // Keyed by name too, so the inline input resets after a rename reload.
                <CategoryRow key={`${category.id}-${category.name}`} category={category} onChanged={reload} onStatus={setStatus} />
              ))
            )}
          </div>
        </div>

        <Pagination page={data.page} pages={data.pages} onChange={setPage} />
      </section>
    </>
  );
}
