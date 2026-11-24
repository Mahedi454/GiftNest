import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, assetUrl, money } from '../../api.js';
import { ErrorBox, Loading, useFetch } from '../../components/common.jsx';

const empty = { name: '', category: '', price: '', stock: 0, description: '', isActive: true };

function Field({ label, error, children }) {
  return (
    <label className={`afield ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      {children}
      {error && <em className="afield__error">{error}</em>}
    </label>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const categories = useFetch(() => api.get('/categories'));
  const existing = useFetch(() => (editing ? api.get(`/admin/products/${id}`) : Promise.resolve(null)), [id]);

  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const product = existing.data?.product;
  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name,
      category: product.category?.id || '',
      price: product.price,
      stock: product.stock,
      description: product.description,
      isActive: product.isActive,
    });
  }, [product]);

  // Local preview of a freshly chosen file; revoked when replaced.
  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => filePreview && URL.revokeObjectURL(filePreview), [filePreview]);

  if (categories.loading || existing.loading) return <Loading />;
  if (categories.error || existing.error) return <ErrorBox error={categories.error || existing.error} />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const currentImage = removeImage ? '' : assetUrl(product?.image);
  const previewImage = filePreview || currentImage;
  const categoryName = categories.data.categories.find((c) => c.id === form.category)?.name;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (file) body.append('image', file);
    if (removeImage) body.append('removeImage', 'true');

    try {
      if (editing) await api.put(`/admin/products/${id}`, body);
      else await api.post('/admin/products', body);
      navigate('/admin/products');
    } catch (error) {
      setErrors(error.errors);
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-page">
      <header className="pagehead">
        <div>
          <Link className="backlink" to="/admin/products">← All products</Link>
          <h1>{editing ? 'Edit product' : 'Add a product'}</h1>
          <p>{editing ? 'Update the details customers see in the store.' : 'Fill in the details below. You can change them any time.'}</p>
        </div>
      </header>

      {message && <div className="notice notice--error" role="alert">{message}</div>}

      <form className="pform" onSubmit={submit}>
        <div className="panel pform__main">
          <div className="pform__grid">
            <Field label="Product name" error={errors.name}>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Personalised photo frame" required />
            </Field>
            <Field label="Category" error={errors.category}>
              <select value={form.category} onChange={set('category')} required>
                <option value="">Choose a category</option>
                {categories.data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Price (Tk)" error={errors.price}>
              <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
            </Field>
            <Field label="Stock quantity" error={errors.stock}>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} required />
            </Field>
          </div>

          <Field label="Description" error={errors.description}>
            <textarea rows="5" value={form.description} onChange={set('description')} placeholder="Tell customers what makes this gift special." required />
          </Field>

          <Field label="Product image">
            <input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files[0] || null); setRemoveImage(false); }} />
          </Field>
          {editing && product?.image && !file && (
            <label className="check">
              <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} />
              <span>Remove the current image</span>
            </label>
          )}

          <label className="check">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <span>Visible in the store</span>
          </label>

          <div className="pform__actions">
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create product'}</button>
            <Link className="btn btn--ghost" to="/admin/products">Cancel</Link>
          </div>
        </div>

        <aside className="panel pform__preview">
          <span className="pform__previewLabel">Preview</span>
          <div className="ppreview">
            <div className="ppreview__img">
              {previewImage ? <img src={previewImage} alt={form.name || 'Product preview'} /> : <span>{form.name || 'Your product'}</span>}
              <em>{categoryName || 'Category'}</em>
            </div>
            <div className="ppreview__body">
              <h3>{form.name.trim() || 'Product name'}</h3>
              <p>{form.description.trim() || 'Your product description will appear here.'}</p>
              <div className="ppreview__row">
                <strong>{money(form.price, Number.isInteger(Number(form.price)) ? 0 : 2)}</strong>
                <span className={`pill2 ${form.isActive ? 'pill2--completed' : 'pill2--muted'}`}>{form.isActive ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
