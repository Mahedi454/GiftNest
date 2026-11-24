import { Link } from 'react-router-dom';
import { api, assetUrl } from '../api.js';
import { useFetch } from '../components/common.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const values = [
  { icon: 'layers', title: 'A curated catalog', text: 'A focused selection, organized by category so you can choose with confidence instead of scrolling through clutter.' },
  { icon: 'sliders', title: 'A clean ordering flow', text: 'From the first click to order confirmation, every step stays simple, clear, and reliable.' },
  { icon: 'receipt', title: 'Easy to manage', text: 'Admins update products, categories, orders, and roles from one tidy panel, so the store stays current.' },
];

const steps = [
  { icon: 'search', title: 'Browse', text: 'Explore gifts by category or search for exactly what you have in mind.' },
  { icon: 'bag', title: 'Add to cart', text: 'Collect your favorites and change quantities any time.' },
  { icon: 'truck', title: 'Check out', text: 'Enter your delivery details and place the order in a minute.' },
  { icon: 'receipt', title: 'Track it', text: 'Follow your order status from your account.' },
];

export default function About() {
  const { user } = useAuth();
  // Real product photos for the collage; the page still works if the request fails.
  const { data } = useFetch(() => api.get('/products/home'));
  const photos = data ? [...data.heroProducts, ...data.featuredProducts].filter((p) => p.image).slice(0, 3) : [];

  return (
    <>
      <section className="about-hero">
        <div className="about-hero__copy">
          <span className="pill-live"><i />About GiftNest</span>
          <h1>
            Thoughtful gifting, <span className="grad-text">made simple.</span>
          </h1>
          <p className="lead">
            GiftNest makes gift shopping lighter and faster, with a focused catalog, clear product pages,
            and a checkout that gets out of your way.
          </p>
          <div className="hero2__actions">
            <Link className="btn btn--lg" to="/shop">Shop gifts</Link>
            <Link className="btn btn--ghost btn--lg" to="/">Back to home</Link>
          </div>
        </div>

        <div className="about-hero__art" aria-hidden={photos.length === 0}>
          {photos.length > 0 ? (
            photos.map((p, i) => (
              <Link key={p.id} to={`/product/${p.id}`} className={`about-photo about-photo--${i + 1}`} tabIndex={-1}>
                <img src={assetUrl(p.image)} alt={p.name} />
              </Link>
            ))
          ) : (
            <div className="about-photo about-photo--fallback" />
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="head-center">
          <div className="kicker">What we value</div>
          <h2>Presentation, clarity, and consistency</h2>
        </div>
        <div className="grid grid--3">
          {values.map((v) => (
            <article className="why-card" key={v.title}>
              <span className="why-card__icon"><Icon name={v.icon} /></span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="head-center">
          <div className="kicker">How it works</div>
          <h2>From first look to your doorstep in four steps</h2>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step__num">{i + 1}</span>
              <span className="step__icon"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section">
        <div className="cta-banner">
          <div className="cta-banner__text">
            <h2>Make gifting easier and more elegant.</h2>
            <p>Find something thoughtful in a few clicks.</p>
          </div>
          <div className="cta-banner__actions">
            <Link className="btn btn--white" to="/shop">Start shopping</Link>
            {!user && <Link className="btn btn--outline-white" to="/register">Create account</Link>}
          </div>
        </div>
      </section>
    </>
  );
}
