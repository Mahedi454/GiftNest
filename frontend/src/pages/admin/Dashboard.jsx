import { Link } from 'react-router-dom';
import { api, assetUrl, formatDate, initials, money, timeAgo } from '../../api.js';
import { ErrorBox, useFetch } from '../../components/common.jsx';
import Icon from '../../components/Icon.jsx';
import { Stars } from '../../components/Stars.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const TZ = 'Asia/Dhaka';

// The last 7 local days, oldest first, filled with zeros where there were no orders.
function lastSevenDays(daily) {
  const byDate = new Map(daily.map((d) => [d.date, d]));
  const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  const [y, m, d] = todayKey.split('-').map(Number);
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const when = new Date(Date.UTC(y, m - 1, d - i));
    const key = when.toISOString().slice(0, 10);
    days.push({
      key,
      label: when.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }),
      total: byDate.get(key)?.total || 0,
      count: byDate.get(key)?.count || 0,
    });
  }
  return days;
}

function niceMax(value) {
  if (value <= 0) return 1000;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value) * pow;
  return step;
}

function SalesChart({ days }) {
  const W = 620;
  const H = 240;
  const pad = { top: 16, right: 12, bottom: 34, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = niceMax(Math.max(...days.map((d) => d.total)));
  const slot = innerW / days.length;
  const barW = Math.min(46, slot * 0.58);
  const ticks = [0, 0.5, 1].map((t) => t * max);
  const short = (v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : String(v));

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Order value for the last 7 days">
      <defs>
        <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff3e9b" />
          <stop offset="1" stopColor="#ff9ccb" />
        </linearGradient>
      </defs>

      {ticks.map((t) => {
        const y = pad.top + innerH - (t / max) * innerH;
        return (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} className="chart__grid" />
            <text x={pad.left - 10} y={y + 4} textAnchor="end" className="chart__tick">{short(t)}</text>
          </g>
        );
      })}

      {days.map((d, i) => {
        const h = Math.max(d.total > 0 ? 6 : 0, (d.total / max) * innerH);
        const x = pad.left + i * slot + (slot - barW) / 2;
        const y = pad.top + innerH - h;
        return (
          <g key={d.key} className="chart__col" style={{ '--i': i }}>
            <title>{`${d.label}: ${money(d.total, 0)} from ${d.count} ${d.count === 1 ? 'order' : 'orders'}`}</title>
            <rect x={pad.left + i * slot} y={pad.top} width={slot} height={innerH} className="chart__hit" />
            {h > 0 && <rect x={x} y={y} width={barW} height={h} rx="10" className="chart__bar" />}
            <text x={x + barW / 2} y={H - 10} textAnchor="middle" className="chart__label">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function StatusRing({ pending, completed }) {
  const total = pending + completed;
  const R = 52;
  const C = 2 * Math.PI * R;
  const doneLen = total ? (completed / total) * C : 0;

  return (
    <div className="ring">
      <svg viewBox="0 0 140 140" role="img" aria-label={`${completed} completed and ${pending} pending orders`}>
        <circle cx="70" cy="70" r={R} className="ring__track" />
        {total > 0 && (
          <circle
            cx="70" cy="70" r={R}
            className="ring__done"
            strokeDasharray={`${doneLen} ${C - doneLen}`}
            transform="rotate(-90 70 70)"
          />
        )}
        <text x="70" y="68" textAnchor="middle" className="ring__num">{total}</text>
        <text x="70" y="88" textAnchor="middle" className="ring__cap">orders</text>
      </svg>
      <ul className="ring__legend">
        <li><i className="dot dot--done" /> Completed <strong>{completed}</strong></li>
        <li><i className="dot dot--pending" /> Pending <strong>{pending}</strong></li>
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, error, loading } = useFetch(() => api.get('/admin/stats'));

  if (error) return <ErrorBox error={error} />;
  if (loading || !data) {
    return (
      <div className="dash-skel" aria-busy="true" aria-label="Loading dashboard">
        {[0, 1, 2, 3].map((i) => <span key={i} className="skeleton" />)}
      </div>
    );
  }

  const { stats, daily, recentOrders, lowStock, reviews } = data;
  const days = lastSevenDays(daily);
  const weekTotal = days.reduce((sum, d) => sum + d.total, 0);
  const weekOrders = days.reduce((sum, d) => sum + d.count, 0);
  const firstName = (user?.name || 'there').split(' ')[0];
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });

  const cards = [
    { label: 'Revenue', value: money(stats.revenue, 0), note: 'From completed orders', icon: 'wallet', tone: 'pink' },
    { label: 'Orders', value: stats.orders, note: `${stats.pending} waiting to be completed`, icon: 'receipt', tone: 'teal' },
    { label: 'Products', value: stats.products, note: `${lowStock.length} running low`, icon: 'box', tone: 'violet' },
    { label: 'Customers', value: stats.customers, note: `${stats.users} accounts in total`, icon: 'users', tone: 'amber' },
  ];

  return (
    <div className="dash">
      <header className="pagehead">
        <div>
          <span className="pagehead__date">{today}</span>
          <h1>Welcome back, {firstName}</h1>
          <p>Here is how the store is doing today.</p>
        </div>
        <div className="pagehead__actions">
          <Link className="btn btn--ghost" to="/admin/orders">View orders</Link>
          <Link className="btn" to="/admin/products/new"><Icon name="plus" width={2.4} /> Add product</Link>
        </div>
      </header>

      <section className="kpis" aria-label="Key figures">
        {cards.map((card, i) => (
          <article className={`kpi2 kpi2--${card.tone}`} key={card.label} style={{ '--i': i }}>
            <span className="kpi2__icon"><Icon name={card.icon} /></span>
            <div className="kpi2__body">
              <span className="kpi2__label">{card.label}</span>
              <strong className="kpi2__value">{card.value}</strong>
              <span className="kpi2__note">{card.note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="dash__row dash__row--charts">
        <article className="panel panel--chart">
          <div className="panel__head">
            <div>
              <h2>Sales this week</h2>
              <p>{money(weekTotal, 0)} from {weekOrders} {weekOrders === 1 ? 'order' : 'orders'} in the last 7 days</p>
            </div>
          </div>
          <SalesChart days={days} />
        </article>

        <article className="panel">
          <div className="panel__head">
            <div>
              <h2>Order status</h2>
              <p>Where your orders stand</p>
            </div>
          </div>
          <StatusRing pending={stats.pending} completed={stats.completed} />
          <Link className="panel__link" to="/admin/orders">Manage orders →</Link>
        </article>
      </section>

      <section className="dash__row dash__row--lists">
        <article className="panel">
          <div className="panel__head">
            <div>
              <h2>Recent orders</h2>
              <p>The latest purchases from customers</p>
            </div>
            <Link className="panel__link" to="/admin/orders">View all</Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="panel__empty">No orders yet. They will show up here as customers check out.</p>
          ) : (
            <ul className="rlist">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <span className="rlist__avatar">{(order.customerName || '?')[0].toUpperCase()}</span>
                  <span className="rlist__main">
                    <strong>{order.customerName}</strong>
                    <small>#{order.orderNumber} · {formatDate(order.createdAt)}</small>
                  </span>
                  <span className={`pill2 pill2--${order.status}`}>{order.status === 'completed' ? 'Completed' : 'Pending'}</span>
                  <span className="rlist__amount">{money(order.totalPrice, 0)}</span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="panel__head">
            <div>
              <h2>Low stock</h2>
              <p>Products that need restocking soon</p>
            </div>
            <Link className="panel__link" to="/admin/products">Products</Link>
          </div>

          {lowStock.length === 0 ? (
            <p className="panel__empty">Everything is well stocked.</p>
          ) : (
            <ul className="rlist">
              {lowStock.map((product) => (
                <li key={product.id}>
                  <span className="rlist__thumb">
                    {product.image ? <img src={assetUrl(product.image)} alt="" /> : <Icon name="box" />}
                  </span>
                  <span className="rlist__main">
                    <strong>{product.name}</strong>
                    <small>{product.isActive ? 'Visible in store' : 'Hidden'}</small>
                  </span>
                  <span className={`pill2 ${product.stock === 0 ? 'pill2--out' : 'pill2--low'}`}>
                    {product.stock === 0 ? 'Sold out' : `${product.stock} left`}
                  </span>
                  <Link className="rlist__edit" to={`/admin/products/${product.id}/edit`}>Restock</Link>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="dash__row dash__row--single">
        <article className="panel">
          <div className="panel__head">
            <div>
              <h2>Customer reviews</h2>
              <p>
                {reviews.count === 0
                  ? 'Reviews from your customers will show up here.'
                  : `${reviews.count} ${reviews.count === 1 ? 'review' : 'reviews'} · ${reviews.average.toFixed(1)} average · ${reviews.unanswered} waiting for a reply`}
              </p>
            </div>
            <Link className="panel__link" to="/admin/reviews">Manage reviews</Link>
          </div>

          {reviews.latest.length === 0 ? (
            <p className="panel__empty">No reviews yet. They will appear here once customers start rating your products.</p>
          ) : (
            <ul className="rlist rlist--reviews">
              {reviews.latest.map((review) => (
                <li key={review.id}>
                  <span className="rlist__avatar">{initials(review.author)}</span>
                  <span className="rlist__main">
                    <strong>{review.author} <small>on {review.product?.name || 'a removed product'}</small></strong>
                    <span className="rlist__stars"><Stars value={review.rating} size={14} /> <small>{timeAgo(review.createdAt)}</small></span>
                    <span className="rlist__snippet">{review.comment}</span>
                  </span>
                  <span className={`pill2 ${review.hasTeamReply ? 'pill2--completed' : 'pill2--pending'}`}>{review.hasTeamReply ? 'Replied' : 'Needs reply'}</span>
                  <Link className="rlist__edit" to="/admin/reviews">{review.hasTeamReply ? 'View' : 'Reply'}</Link>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
