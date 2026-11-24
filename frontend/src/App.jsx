import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout, SiteLayout } from './components/Layouts.jsx';
import { GuestOnly, NotFound, RequireAuth } from './components/common.jsx';
import About from './pages/About.jsx';
import { Login, Register } from './pages/Auth.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import CheckoutSuccess from './pages/CheckoutSuccess.jsx';
import Home from './pages/Home.jsx';
import Orders from './pages/Orders.jsx';
import Product from './pages/Product.jsx';
import Profile from './pages/Profile.jsx';
import Shop from './pages/Shop.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import ProductForm from './pages/admin/ProductForm.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminUsers from './pages/admin/Users.jsx';

const TITLES = { '/': 'GiftNest - Thoughtful Gifts for Every Occasion', '/shop': 'GiftNest - Shop', '/about': 'GiftNest - About', '/cart': 'GiftNest - Cart' };

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] || (pathname.startsWith('/admin') ? 'Admin - GiftNest' : 'GiftNest');
  }, [pathname]);

  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="about" element={<About />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route path="checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="checkout/success/:id" element={<RequireAuth><CheckoutSuccess /></RequireAuth>} />
        <Route path="orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
