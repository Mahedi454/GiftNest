import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl, money } from '../api.js';
import { ErrorBox, useFetch } from '../components/common.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const heroTags = ['Best Seller', 'Elegant', 'Romantic'];

const icons = {
  search: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />,
  bag: <path d="M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2" />,
  truck: <path d="M3 6h11v10H3V6ZM14 10h4l3 3v3h-7M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
  cake: <path d="M4 20h16M5 20v-6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6M12 13V9M12 6.5c.8-.9.8-1.6 0-2.5-.8.9-.8 1.6 0 2.5Z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  cap: <path d="M2 9l10-5 10 5-10 5L2 9ZM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  gift: <path d="M3 8h18v4H3V8ZM12 8v13M5 12v8h14v-8M7.5 8a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 1 1 0 5" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

function Icon({ name, width = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const occasions = [
  { title: 'Birthdays', note: 'Boxes, lamps and mugs', search: 'birthday', icon: 'cake', tint: '#ffe3f0' },
  { title: 'Love & romance', note: 'Candles, roses, notes', search: 'love', icon: 'heart', tint: '#ffe9ec' },
  { title: 'Graduation', note: 'Celebrate the milestone', search: 'graduation', icon: 'cap', tint: '#e2f6f2' },
  { title: 'Family & home', note: 'Frames and wall art', search: 'family', icon: 'home', tint: '#fff0dc' },
  { title: 'Couples', note: 'Made for two', search: 'couple', icon: 'star', tint: '#efe6ff' },
  { title: 'Little ones', note: 'Baby and kids gifts', search: 'baby', icon: 'gift', tint: '#e1f1fb' },
];

const whyCards = [
  { icon: 'search', title: 'Browse curated picks', text: 'A focused collection of gifts for birthdays, campus moments, and everyday surprises, without the clutter.' },
  { icon: 'bag', title: 'Add to cart in seconds', text: 'Collect your favorites in a simple cart and adjust quantities quickly before checkout.' },
  { icon: 'truck', title: 'Place a smooth order', text: 'Complete checkout with basic delivery details and follow your order from your account.' },
];

function SectionHead({ kicker, title, children }) {
  return (
    <div className="head-center">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function HeroVisual({ products }) {
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const current = products[active];

  const addToCart = () => {
    add(current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="hv">
      <div className="hv__frame">
        {products.map((product, i) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className={`hv__img ${i === active ? 'is-active' : ''}`}
            tabIndex={i === active ? 0 : -1}
            aria-hidden={i !== active}
          >
            {product.image ? <img src={assetUrl(product.image)} alt={product.name} /> : null}
          </Link>
        ))}
        <span className="hv__tag">{heroTags[active] || 'Gift Pick'}</span>

        <div className="hv__card">
          <div className="hv__cardText">
            <strong>{current.name}</strong>
            <span>{money(current.price, 0)}</span>
          </div>
          <button className={`hv__add ${added ? 'is-added' : ''}`} type="button" onClick={addToCart} aria-label={`Add ${current.name} to cart`}>
            <Icon name={added ? 'check' : 'plus'} width={2.4} />
          </button>
        </div>
      </div>

      {products.length > 1 && (
        <div className="hv__thumbs">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              className={`hv__thumb ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Show ${product.name}`}
              aria-current={i === active}
            >
              {product.image ? <img src={assetUrl(product.image)} alt="" /> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="home-skeleton" aria-busy="true" aria-label="Loading">
      <div className="home-skeleton__hero">
        <div className="home-skeleton__col">
          <span className="skeleton skeleton--chip" />
          <span className="skeleton skeleton--title" />
          <span className="skeleton skeleton--title skeleton--short" />
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line skeleton--short" />
          <span className="skeleton skeleton--btn" />
        </div>
        <div className="home-skeleton__panel skeleton" />
      </div>
      <div className="home-skeleton__row">
        {[0, 1, 2, 3].map((i) => <span key={i} className="skeleton skeleton--card" />)}
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { data, error, loading } = useFetch(() => api.get('/products/home'));

  if (loading) return <HomeSkeleton />;
  if (error) return <ErrorBox error={error} />;

  const { heroProducts, featuredProducts, categoryCount } = data;

  return (
    <>
      <section className="hero2">
        <div className="hero2__copy">
          <span className="pill-live"><i />Modern gifting for Bangladesh</span>

          <h1>
            Find the <span className="grad-text">right gift</span> with ease.
          </h1>

          <p className="lead">
            Discover curated picks for birthdays, campus surprises, and everyday celebrations, with a smoother
            shopping experience from first click to checkout.
          </p>

          <div className="hero2__actions">
            <Link className="btn btn--lg" to="/shop">Shop now</Link>
            <Link className="btn btn--ghost btn--lg" to="/about">Learn more</Link>
          </div>

          <dl className="hstats">
            <div><dt>{heroProducts.length + featuredProducts.length}+</dt><dd>Featured gifts</dd></div>
            <div><dt>{categoryCount}</dt><dd>Gift categories</dd></div>
            <div><dt>24h</dt><dd>Local dispatch</dd></div>
          </dl>
        </div>

        {heroProducts.length ? (
          <HeroVisual products={heroProducts} />
        ) : (
          <div className="card empty">
            <div className="empty__title">No picks yet</div>
            <div className="empty__subtitle">Add a few products to the catalog to populate this section.</div>
          </div>
        )}
      </section>

      <section className="home-section">
        <SectionHead kicker="Why GiftNest" title="A simple gifting flow made for quick decisions" />
        <div className="grid grid--3">
          {whyCards.map((card) => (
            <article className="why-card" key={card.title}>
              <span className="why-card__icon"><Icon name={card.icon} /></span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHead kicker="Shop by occasion" title="Whatever you are celebrating, start here" />
        <div className="occasions">
          {occasions.map((o) => (
            <Link className="occasion" key={o.title} to={`/shop?search=${o.search}`} style={{ '--tint': o.tint }}>
              <span className="occasion__icon"><Icon name={o.icon} /></span>
              <span className="occasion__text">
                <strong>{o.title}</strong>
                <small>{o.note}</small>
              </span>
              <span className="occasion__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHead kicker="Featured collection" title="Thoughtful picks that look good and ship beautifully" />
        <div className="grid grid--4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="home-section__more">
          <Link className="btn btn--ghost" to="/shop">View all products</Link>
        </div>
      </section>

      <section className="home-section">
        <div className="cta-banner">
          <div className="cta-banner__text">
            <h2>Make someone's day a little brighter.</h2>
            <p>Pick a gift, add a few details at checkout, and we take it from there.</p>
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
