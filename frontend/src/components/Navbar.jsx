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
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
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
        onClick={() => setOpen((v) => !v)}
      >
        <span className="profilemenu__avatar">{initials(user.name)}</span>
        <span className="profilemenu__meta">
          <span className="profilemenu__name">{user.name}</span>
          <span className="profilemenu__role">{isAdmin ? 'Administrator' : 'Customer'}</span>
        </span>
      </button>
      {open && (
        <div className="profilemenu__dropdown" onClick={() => setOpen(false)}>
          <Link className="profilemenu__link" to="/profile">My profile</Link>
          {admin && <Link className="profilemenu__link" to="/">View storefront</Link>}
          {!admin && !isAdmin && <Link className="profilemenu__link" to="/orders">My orders</Link>}
          <button className="profilemenu__logout" type="button" onClick={signOut}>Logout</button>
        </div>
      )}
    </div>
  );
}

export function Hamburger({ open, onToggle, label, controls, className = '' }) {
  return (
    <button className={`hamburger ${className}`} type="button" aria-label={label} aria-expanded={open} aria-controls={controls} onClick={onToggle}>
      <img className="hamburger__icon" src="/line-3-svgrepo-com.svg" alt="" aria-hidden="true" />
    </button>
  );
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link className="brand" to="/">
          <img className="brand__logo" src="/gift-svgrepo-com.svg" alt="GiftNest logo" />
          <span className="brand__name">GiftNest</span>
        </Link>

        <nav className="navlinks" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="navactions">
          <Link className="iconbtn" to="/cart" aria-label="View cart">
            <svg className="iconbtn__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" />
              <circle cx="10" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>
            {count > 0 && <span className="badge badge--pop" key={count}>{count}</span>}
          </Link>

          {user ? (
            <>
              {isAdmin && <Link className="btn btn--ghost" to="/admin">Admin</Link>}
              <ProfileMenu />
            </>
          ) : (
            <>
              <Link className="btn btn--ghost" to="/login">Login</Link>
              <Link className="btn" to="/register">Sign up</Link>
            </>
          )}

          <Hamburger open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} label="Open menu" controls="site-mobile-menu" />
        </div>
      </div>

      {menuOpen && (
        <div className="mobilemenu" id="site-mobile-menu">
          <div className="container mobilemenu__inner">
            <div className="mobilemenu__eyebrow">Simple shopping, clean flow</div>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <div className="mobilemenu__row">
              {user ? (
                <>
                  {isAdmin ? (
                    <Link className="btn btn--ghost" to="/admin">Admin</Link>
                  ) : (
                    <Link className="btn btn--ghost" to="/orders">Orders</Link>
                  )}
                  <Link className="btn btn--ghost" to="/profile">Profile</Link>
                  <button className="btn btn--ghost" type="button" onClick={() => { logout(); navigate('/'); }}>Logout</button>
                </>
              ) : (
                <>
                  <Link className="btn btn--ghost" to="/login">Login</Link>
                  <Link className="btn" to="/register">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
