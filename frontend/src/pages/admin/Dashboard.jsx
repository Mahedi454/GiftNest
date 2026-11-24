import { api, money } from '../../api.js';
import { ErrorBox, Loading, useFetch } from '../../components/common.jsx';

export default function Dashboard() {
  const { data, error, loading } = useFetch(() => api.get('/admin/stats'));
  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { stats } = data;

  return (
    <>
      <section className="section">
        <div className="section__head">
          <div>
            <div className="kicker">Admin dashboard</div>
            <h1>Business overview</h1>
          </div>
          <div className="muted">Live totals are pulled from your MongoDB collections.</div>
        </div>

        <div className="grid grid--4">
          <article className="card kpi"><div className="kpi__label">Total users</div><div className="kpi__value">{stats.users}</div></article>
          <article className="card kpi"><div className="kpi__label">Total products</div><div className="kpi__value">{stats.products}</div></article>
          <article className="card kpi"><div className="kpi__label">Total orders</div><div className="kpi__value">{stats.orders}</div></article>
          <article className="card kpi"><div className="kpi__label">Total revenue</div><div className="kpi__value">{money(stats.revenue)}</div></article>
        </div>
      </section>

      <section className="section section--tight">
        <div className="grid grid--3">
          <article className="feature-panel card feature-panel--home">
            <div className="feature-panel__icon">P</div>
            <h3>Product control</h3>
            <p>Manage catalog items, stock, visibility, and images from a cleaner admin product workflow.</p>
          </article>
          <article className="feature-panel card feature-panel--home">
            <div className="feature-panel__icon">C</div>
            <h3>Category structure</h3>
            <p>Organize the storefront with dedicated categories so products stay easy to browse and maintain.</p>
          </article>
          <article className="feature-panel card feature-panel--home">
            <div className="feature-panel__icon">U</div>
            <h3>User roles</h3>
            <p>Separate customers from administrators and control role changes safely from the users panel.</p>
          </article>
        </div>
      </section>
    </>
  );
}
