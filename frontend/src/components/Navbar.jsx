import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { initials } from '../api.js';

export function ProfileMenu({ admin = false }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profilemenu" ref={ref}>
      <button
        className="profilemenu__trigger"
        type="button"
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="profilemenu__avatar">{initials(user.name)}</span>
        <span className="profilemenu__meta">
          <span className="profilemenu__name">{user.name}</span>
          <span className="profilemenu__role">{isAdmin ? 'Administrator' : 'Customer'}</span>
        </span>
        <svg className="profilemenu__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="profilemenu__dropdown" role="menu" onClick={() => setOpen(false)}>
          <div className="profilemenu__head">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <Link className="profilemenu__link" role="menuitem" to="/profile">My profile</Link>
          {admin && <Link className="profilemenu__link" role="menuitem" to="/">View storefront</Link>}
          {!admin && !isAdmin && <Link className="profilemenu__link" role="menuitem" to="/orders">My orders</Link>}
          <button className="profilemenu__logout" role="menuitem" type="button" onClick={signOut}>Log out</button>
        </div>
      )}
    </div>
  );
}

export function Hamburger({ open, onToggle, label, controls, className = '' }) {
  return (
    <button
      className={`hamburger ${open ? 'is-open' : ''} ${className}`}
      type="button"
      aria-label={label}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
    >
      <span className="hamburger__bars" aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menuOpen ? 'nav--open' : ''}`}>
      <div className="nav__bar">
        <Link className="brand" to="/" aria-label="GiftNest home">
          <img className="brand__logo" src="/gift-svgrepo-com.svg" alt="" />
          <span className="brand__name">GiftNest</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="nav__actions">
          <Link className="nav__cart" to="/cart" aria-label={`Cart, ${count} items`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" />
              <circle cx="10" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>
            {count > 0 && <span className="nav__badge" key={count}>{count}</span>}
          </Link>

          {user ? (
            <>
              {isAdmin && <Link className="nav__text nav__text--desktop" to="/admin">Admin</Link>}
              <span className="nav__desktop"><ProfileMenu /></span>
            </>
          ) : (
            <>
              <Link className="nav__text nav__text--desktop" to="/login">Login</Link>
              <Link className="btn btn--small nav__signup" to="/register">Sign up</Link>
            </>
          )}

          <Hamburger open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} label={menuOpen ? 'Close menu' : 'Open menu'} controls="site-mobile-menu" />
        </div>
      </div>

      <div className="nav__panel" id="site-mobile-menu" aria-hidden={!menuOpen}>
        <div className="nav__panelInner">
          <NavLink to="/" end tabIndex={menuOpen ? 0 : -1}>Home</NavLink>
          <NavLink to="/shop" tabIndex={menuOpen ? 0 : -1}>Shop</NavLink>
          <NavLink to="/about" tabIndex={menuOpen ? 0 : -1}>About</NavLink>
          <NavLink to="/cart" tabIndex={menuOpen ? 0 : -1}>Cart{count > 0 ? ` (${count})` : ''}</NavLink>
          <div className="nav__panelRow">
            {user ? (
              <>
                {isAdmin ? (
                  <Link className="btn btn--ghost" to="/admin" tabIndex={menuOpen ? 0 : -1}>Admin</Link>
                ) : (
                  <Link className="btn btn--ghost" to="/orders" tabIndex={menuOpen ? 0 : -1}>Orders</Link>
                )}
                <Link className="btn btn--ghost" to="/profile" tabIndex={menuOpen ? 0 : -1}>Profile</Link>
                <button className="btn" type="button" onClick={signOut} tabIndex={menuOpen ? 0 : -1}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn--ghost" to="/login" tabIndex={menuOpen ? 0 : -1}>Login</Link>
                <Link className="btn" to="/register" tabIndex={menuOpen ? 0 : -1}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
