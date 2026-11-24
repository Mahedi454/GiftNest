import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Footer() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <div className="footer__brand">
            <img className="brand__logo" src="/gift-svgrepo-com.svg" alt="GiftNest logo" />
            <div>
              <div className="footer__title">GiftNest</div>
              <div className="footer__subtitle">A simple and modern MERN gift shop for your university showcase project.</div>
            </div>
          </div>
          <p className="footer__copy">
            Built with MongoDB, Express, React and Node.js, a clean layout system, and a beginner-friendly storefront structure.
          </p>
          <div className="footer__meta">
            <span className="chip">MERN Stack</span>
            <span className="chip">Persistent Cart</span>
            <span className="chip">Responsive UI</span>
          </div>
        </div>

        <div className="footer__right">
          <div className="footer__col">
            <div className="footer__heading">Store</div>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Account</div>
            {user ? (
              <>
                <Link to="/orders">Orders</Link>
                {isAdmin && <Link to="/admin">Admin Panel</Link>}
                <button className="footer__button" type="button" onClick={() => { logout(); navigate('/'); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>&copy; {new Date().getFullYear()} GiftNest. All rights reserved.</span>
        <span className="footer__small">Built with MongoDB, Express, React, and Node.js.</span>
      </div>
    </footer>
  );
}
