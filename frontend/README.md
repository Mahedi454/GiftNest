# GiftNest Frontend

React 18, React Router 6 and Vite. It talks to the backend only through HTTP.

## Run locally

```bash
npm install
npm run dev     # http://localhost:5173
```

In development Vite proxies `/api` (and `/uploads`) to the backend on `http://localhost:5000`, so no `.env` is needed.
Start the backend first. To point at a different API: `VITE_PROXY=http://localhost:5055 npm run dev`.

## Deploy to Vercel

The frontend is its own Vercel project (the backend is a second one, see `backend/README.md`). Deploy the backend first so you have its address.

1. In Vercel choose **Add New > Project** and import the repository.
2. Set **Root Directory** to `frontend`. Vercel detects **Vite** automatically (Build Command `npm run build`, Output Directory `dist`).
3. Add this **Environment Variable**:

   | Name | Value |
   | ---- | ----- |
   | `VITE_API_URL` | your backend's address, e.g. `https://giftnest-api.vercel.app` (no trailing slash) |

4. Click **Deploy**.
5. In the backend project, set `CLIENT_URL` to this frontend's address (for example `https://giftnest.vercel.app`) and redeploy the backend. Without this the browser blocks the requests.

Shortcut: `vercel.json` already forwards `/api/...` requests to `https://giftnest-api.vercel.app` (edit that address if your
backend project has a different one). With that in place the site works even if `VITE_API_URL` is not set, and no CORS
setting is needed. Setting `VITE_API_URL` makes the browser call the backend directly instead.

Notes:

- `VITE_API_URL` is baked in when the site is built, so after changing it you must redeploy the frontend.
- `vercel.json` makes direct links such as `/shop` or `/product/123` work, and sets caching for photos and scripts.
- Sample product photos live in `public/product-images` and are served by the frontend itself.
- Photos uploaded from the admin panel are stored on Cloudinary and loaded from there.

## Structure

```text
public/css/             Stylesheets
public/product-images/  Sample product photos
public/                 Logo and favicon
src/api.js              fetch wrapper (uses VITE_API_URL) and helpers
src/context/            AuthContext (JWT), CartContext (localStorage)
src/components/         Navbar, Footer, layouts, product card, reviews, form fields
src/pages/              Storefront, account and order pages
src/pages/admin/        Admin dashboard, products, categories, orders, reviews, users
vercel.json             Routing and caching for Vercel
```
