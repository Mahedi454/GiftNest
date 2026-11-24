import { useState } from 'react';
import { api } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';
import Icon from '../../components/Icon.jsx';

function CategoryRow({ category, onChanged, onMessage }) {
  const [name, setName] = useState(category.name);
  const dirty = name.trim() !== category.name;

  const save = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/admin/categories/${category.id}`, { name });
      onMessage('Category updated.');
      onChanged();
    } catch (e) {
      onMessage(e.message);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    try {
      const res = await api.delete(`/admin/categories/${category.id}`);
      onMessage(res.message);
      onChanged();
    } catch (e) {
      onMessage(e.message);
    }
  };

  return (
    <tr>
      <td data-label="Category">
        <form className="inline-edit" onSubmit={save}>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label={`Name of ${category.name}`} />
          {dirty && <button className="btn btn--small" type="submit">Save</button>}
        </form>
      </td>
      <td data-label="Products" className="t-num">{category.productsCount}</td>
      <td data-label="Actions" className="t-actions">
        <div className="row-actions">
          <button className="icon-btn icon-btn--danger" type="button" onClick={remove} aria-label={`Delete ${category.name}`} title="Delete"><Icon name="trash" /></button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminCategories() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.get(`/admin/categories?page=${page}&limit=8`), [page]);

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/categories', { name });
      setName('');
      setMessage('Category added.');
      reload();
    } catch (e) {
      setMessage(e.message);
    }
  };

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  return (
    <div className="adm-page">
      <header className="pagehead">
        <div>
          <h1>Categories</h1>
          <p>Keep products organised so customers can find them easily.</p>
        </div>
        <div className="pagehead__stat">
          <span>Categories</span>
          <strong>{stats.total}</strong>
        </div>
      </header>

      {message && <div className="notice" role="status">{message}</div>}

      <div className="split">
        <form className="panel formcard" onSubmit={create}>
          <h2>Add a category</h2>
          <p>New categories are available right away when adding products.</p>
          <label className="afield">
            <span>Category name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anniversary gifts" required />
          </label>
          <button className="btn" type="submit"><Icon name="plus" width={2.4} /> Add category</button>
          <div className="formcard__stats">
            <span><strong>{stats.withProducts}</strong> in use</span>
            <span><strong>{stats.empty}</strong> empty</span>
          </div>
        </form>

        <div>
          <div className="tablecard">
            {items.length === 0 ? (
              <div className="tablecard__empty">
                <strong>No categories yet</strong>
                <span>Add your first category to start organising products.</span>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr><th>Category</th><th className="t-num">Products</th><th className="t-actions">Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((category) => (
                    <CategoryRow key={`${category.id}-${category.name}`} category={category} onChanged={reload} onMessage={setMessage} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
