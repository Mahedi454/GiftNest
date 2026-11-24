import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const shopLinks = [
  ['All gifts', '/shop'],
  ['Birthdays', '/shop?search=birthday'],
  ['Love & romance', '/shop?search=love'],
  ['Graduation', '/shop?search=graduation'],
  ['Family & home', '/shop?search=family'],
];

export default function Footer() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <footer className="foot">
      <div className="container foot__inner">
        <div className="foot__brand">
          <Link className="foot__logo" to="/">
            <img src="/gift-svgrepo-com.svg" alt="" />
            <span>GiftNest</span>
          </Link>
          <p>Thoughtful gifts for every occasion, picked with care and made easy to send.</p>
          <Link className="foot__cta" to="/shop">Start shopping <span aria-hidden="true">→</span></Link>
        </div>

        <nav className="foot__col" aria-label="Shop">
          <h4>Shop</h4>
          {shopLinks.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}
        </nav>

        <nav className="foot__col" aria-label="Company">
          <h4>GiftNest</h4>
          <Link to="/about">About us</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </nav>

        <nav className="foot__col" aria-label="Account">
          <h4>Account</h4>
          {user ? (
            <>
              <Link to="/profile">My profile</Link>
              <Link to="/orders">My orders</Link>
              {isAdmin && <Link to="/admin">Admin panel</Link>}
              <button type="button" onClick={() => { logout(); navigate('/'); }}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Create account</Link>
            </>
          )}
        </nav>
      </div>

      <div className="container foot__bottom">
        <span>&copy; {new Date().getFullYear()} GiftNest. All rights reserved.</span>
        <span>Built with MongoDB, Express, React and Node.js</span>
      </div>
    </footer>
  );
}
