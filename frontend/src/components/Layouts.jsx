import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from './Footer.jsx';
import Navbar, { Hamburger, ProfileMenu } from './Navbar.jsx';

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
  ['/admin', 'Dashboard', true],
  ['/admin/products', 'Products'],
  ['/admin/categories', 'Categories'],
  ['/admin/orders', 'Orders'],
  ['/admin/users', 'Users'],
];

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // The existing stylesheet scopes admin styles to body.admin.
  useEffect(() => {
    document.body.classList.add('admin');
    return () => document.body.classList.remove('admin');
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <header className="admin-topbar">
        <div className="container admin-topbar__inner">
          <Link className="brand" to="/admin">
            <img className="brand__logo" src="/gift-svgrepo-com.svg" alt="GiftNest logo" />
            <span className="brand__name">GiftNest</span>
            <span className="brand__sub">Admin</span>
          </Link>

          <nav className="admin-nav" aria-label="Admin navigation">
            {adminLinks.map(([to, label, end]) => (
              <NavLink key={to} to={to} end={end}>{label}</NavLink>
            ))}
          </nav>

          <div className="admin-topbar__actions">
            <Link className="btn btn--ghost" to="/">View site</Link>
            <ProfileMenu admin />
            <Hamburger
              className="admin-hamburger"
              open={menuOpen}
              onToggle={() => setMenuOpen((v) => !v)}
              label="Open admin menu"
              controls="admin-mobile-menu"
            />
          </div>
        </div>

        {menuOpen && (
          <div className="admin-mobilemenu" id="admin-mobile-menu">
            <div className="container mobilemenu__inner">
              <div className="mobilemenu__eyebrow">Manage the store from any screen</div>
              {adminLinks.map(([to, label]) => (
                <Link key={to} to={to}>{label}</Link>
              ))}
              <div className="mobilemenu__row">
                <Link className="btn btn--ghost" to="/profile">Profile</Link>
                <Link className="btn btn--ghost" to="/">View site</Link>
                <button className="btn" type="button" onClick={() => { logout(); navigate('/'); }}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}
