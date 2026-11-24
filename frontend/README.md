# GiftNest Frontend

React 18, React Router 6 and Vite. It talks to the backend only through HTTP.

## Run

```bash
npm install
npm run dev     # http://localhost:5173
```

In development Vite proxies `/api`, `/images` and `/uploads` to the backend on `http://localhost:5000`,
so no `.env` is needed. Start the backend first.

## Deploy (Vercel / Netlify)

- Build command: `npm run build`, output directory: `dist`
- Environment variable `VITE_API_URL`: your deployed backend URL, without a trailing slash
- `vercel.json` and `public/_redirects` handle client-side routing

## Structure

```text
public/css/         Stylesheets, logo and favicon
src/api.js          fetch wrapper (uses VITE_API_URL) and helpers
src/context/        AuthContext (JWT), CartContext (localStorage)
src/components/     Navbar, Footer, layouts, ProductCard, route guards
src/pages/          Storefront pages
src/pages/admin/    Admin dashboard, products, categories, orders, users
```
