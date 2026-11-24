import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api, initials } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from './Icon.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

export function SiteLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site-shell">
      <div className="site-glow site-glow--one" aria-hidden="true" />
      <div className="site-glow site-glow--two" aria-hidden="true" />
      <div className="site-grid" aria-hidden="true" />
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/categories', label: 'Categories', icon: 'tag' },
  { to: '/admin/orders', label: 'Orders', icon: 'receipt' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'chat', badge: true },
  { to: '/admin/users', label: 'Customers & users', icon: 'users' },
];

const sectionTitle = (pathname) => {
  if (pathname.startsWith('/admin/products')) return 'Products';
  if (pathname.startsWith('/admin/categories')) return 'Categories';
  if (pathname.startsWith('/admin/orders')) return 'Orders';
  if (pathname.startsWith('/admin/reviews')) return 'Reviews';
  if (pathname.startsWith('/admin/users')) return 'Customers & users';
  return 'Dashboard';
};

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [needReply, setNeedReply] = useState(0);

  // The existing stylesheet scopes admin styles to body.admin.
  useEffect(() => {
    document.body.classList.add('admin');
    return () => document.body.classList.remove('admin');
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // Count of reviews still waiting for a team reply, shown next to "Reviews".
  useEffect(() => {
    const refresh = () => {
      api.get('/admin/reviews?limit=1')
        .then((data) => setNeedReply(data.stats.unanswered))
        .catch(() => {});
    };
    refresh();
    // The reviews page announces when a reply or deletion changes the count.
    window.addEventListener('reviews-changed', refresh);
    return () => window.removeEventListener('reviews-changed', refresh);
  }, [pathname]);

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="adm">
      <aside className={`adm__side ${menuOpen ? 'is-open' : ''}`} aria-label="Admin navigation">
        <Link className="adm__brand" to="/admin">
          <img src="/gift-svgrepo-com.svg" alt="" />
          <span>GiftNest</span>
          <em>Admin</em>
        </Link>

        <nav className="adm__nav">
          <span className="adm__navLabel">Manage</span>
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <Icon name={link.icon} />
              {link.label}
              {link.badge && needReply > 0 && <span className="adm__badge" title={`${needReply} waiting for a reply`}>{needReply}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="adm__foot">
          <Link className="adm__store" to="/">
            <Icon name="external" />
            View store
          </Link>
          <div className="adm__user">
            <span className="adm__avatar">{initials(user.name)}</span>
            <span className="adm__userText">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
            <button type="button" onClick={signOut} aria-label="Log out" title="Log out">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      {menuOpen && <button className="adm__scrim" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <div className="adm__main">
        <header className="adm__top">
          <button className="adm__burger" type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            <Icon name={menuOpen ? 'close' : 'menu'} width={2} />
          </button>
          <div className="adm__crumb">
            <span>Admin</span>
            <i aria-hidden="true">/</i>
            <strong>{sectionTitle(pathname)}</strong>
          </div>
          <Link className="btn btn--ghost btn--small adm__visit" to="/">
            View store <Icon name="external" />
          </Link>
        </header>

        <main className="adm__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
