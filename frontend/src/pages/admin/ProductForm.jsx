import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, assetUrl, money } from '../../api.js';
import { ErrorBox, FieldError, Loading, useFetch } from '../../components/common.jsx';

const empty = { name: '', category: '', price: '', stock: 0, description: '', isActive: true };

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
    <section className="section">
      <div className="section__head">
        <div>
          <div className="kicker">{editing ? 'Edit product' : 'New product'}</div>
          <h1>{editing ? 'Edit Product' : 'Add Product'}</h1>
        </div>
      </div>

      <form className="card admin-product-form admin-product-editor" onSubmit={submit}>
        {message && <div className="admin-form-error" role="alert">{message}</div>}

        <div className="admin-product-editor__grid">
          <div className="admin-product-editor__fields">
            <div className="grid grid--2">
              <label className="field">
                <span className="field__label">Product name</span>
                <input className="input" type="text" value={form.name} onChange={set('name')} required />
                <FieldError errors={errors} name="name" />
              </label>
              <label className="field">
                <span className="field__label">Category</span>
                <select className="input" value={form.category} onChange={set('category')} required>
                  <option value="">Select category</option>
                  {categories.data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <FieldError errors={errors} name="category" />
              </label>
              <label className="field">
                <span className="field__label">Price</span>
                <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
                <FieldError errors={errors} name="price" />
              </label>
              <label className="field">
                <span className="field__label">Stock</span>
                <input className="input" type="number" min="0" value={form.stock} onChange={set('stock')} required />
                <FieldError errors={errors} name="stock" />
              </label>
              <label className="field">
                <span className="field__label">Upload image</span>
                <input className="input" type="file" accept="image/*" onChange={(e) => { setFile(e.target.files[0] || null); setRemoveImage(false); }} />
              </label>
            </div>

            {editing && product?.image && !file && (
              <label className="field field--inline admin-product-form__toggle">
                <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} />
                <span className="field__label">Remove current image from product</span>
              </label>
            )}

            <label className="field admin-product-form__full">
              <span className="field__label">Description</span>
              <textarea className="input" rows="5" value={form.description} onChange={set('description')} required />
              <FieldError errors={errors} name="description" />
            </label>

            <label className="field field--inline admin-product-form__toggle">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <span className="field__label">Visible on storefront</span>
            </label>

            <div className="admin-product-form__actions">
              <button className="btn admin-product-form__submit" type="submit" disabled={busy}>
                {busy ? 'Saving...' : editing ? 'Save changes' : 'Create product'}
              </button>
              <Link className="btn btn--ghost" to="/admin/products">Cancel</Link>
            </div>
          </div>

          <aside className="card admin-preview">
            <div className="admin-preview__label">Live preview</div>
            <div className="admin-preview__media">
              {previewImage ? (
                <img src={previewImage} alt={form.name || 'Product preview'} />
              ) : (
                <div className="admin-preview__placeholder">{form.name || 'Product'}</div>
              )}
            </div>
            <div className="admin-preview__body">
              <div className="admin-preview__meta">
                <span>{categoryName || 'Choose category'}</span>
                <span>{form.isActive ? 'Visible' : 'Hidden'}</span>
              </div>
              <h3>{form.name.trim() || 'Product name'}</h3>
              <div className="admin-preview__price">{money(form.price)}</div>
              <p>{form.description.trim() || 'The product description will appear here as you update the form.'}</p>
            </div>
          </aside>
        </div>
      </form>
    </section>
  );
}
