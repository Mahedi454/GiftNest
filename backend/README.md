# GiftNest Backend

REST API for GiftNest: Node.js, Express 4, Mongoose (MongoDB Atlas), JWT auth (bcrypt), image uploads to Cloudinary.
It runs as a normal server on your computer and as a serverless function on Vercel.

## MongoDB Atlas setup

1. Create a free cluster at https://cloud.mongodb.com.
2. **Database Access**: add a database user (username + password).
3. **Network Access**: allow `0.0.0.0/0`. Vercel does not have fixed IP addresses, so a single address cannot be allowed.
4. **Database > Connect > Drivers**: copy the connection string and use it as `MONGODB_URI`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/giftnest?retryWrites=true&w=majority`
   (URL-encode special characters in the password, e.g. `@` becomes `%40`.)

## Run locally

```bash
npm install
cp .env.example .env     # set MONGODB_URI, JWT_SECRET, CLIENT_URL, ADMIN_PASSWORD
npm run seed             # sample categories and products
npm run admin            # creates giftnest@admin.com with your ADMIN_PASSWORD
npm run dev              # http://localhost:5000
```

Locally, product photos uploaded in the admin panel are saved to `uploads/` (no Cloudinary account needed).

## Administrator account

The store administrator is `giftnest@admin.com`. You choose the password:

1. Set `ADMIN_PASSWORD=` in `backend/.env` (8+ characters).
2. Run `npm run admin`. It creates the account, or resets the password if it already exists.
3. Sign in on the site with that email and password. Customers create their own accounts from the Sign up page.

`npm run admin -- --remove-demo` also deletes the old sample accounts (`admin@giftnest.com`, `customer@example.com`) if an earlier seed created them.

Run `seed` and `admin` from your own computer with the production `MONGODB_URI` in `.env`; they only need to run once.

## Deploy to Vercel

The backend is its own Vercel project (the frontend is a second one, see `frontend/README.md`).

1. Push the repository to GitHub and, in Vercel, choose **Add New > Project** and import it.
2. Set **Root Directory** to `backend`. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
3. Add these **Environment Variables**:

   | Name | Value |
   | ---- | ----- |
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (for example `openssl rand -hex 32`) |
   | `CLIENT_URL` | your frontend's address, e.g. `https://giftnest.vercel.app` (comma-separate more than one) |
   | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | from your Cloudinary dashboard (needed for admin photo uploads) |

4. Click **Deploy**, then open `https://YOUR-BACKEND.vercel.app/api/health`. It should show `"ok": true` and which settings are present. This is the quickest way to see what is missing.
5. Copy the backend's address into the frontend project as `VITE_API_URL`, deploy the frontend, then come back and make sure `CLIENT_URL` matches the frontend's final address (changing environment variables needs a redeploy).

How it works: `api/index.js` exports the Express app from `src/app.js`, and `vercel.json` sends every path to it. Database connections are cached between requests.

Why Cloudinary: Vercel's disk is read-only and temporary, so uploaded photos cannot be stored on the server. Without Cloudinary, creating a product with a photo shows "Image uploads are not set up yet" (products without a photo still work).

## Environment variables

| Name | Purpose |
| ---- | ------- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign login tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated (CORS). `*` allows any |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Photo storage for admin uploads (or a single `CLOUDINARY_URL`) |
| `CLOUDINARY_FOLDER` | Optional folder name (default `giftnest/products`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by `npm run admin` (default email `giftnest@admin.com`) |
| `PORT` | Port for the local server (default `5000`) |

## Structure

```text
api/index.js            Vercel serverless entry point
vercel.json             Sends every request to the function
src/app.js              Builds the Express app (shared by local and Vercel)
src/index.js            Local server (npm run dev / npm start)
src/models/             User, Category, Product, Order, Review
src/routes/             auth, catalog, orders, reviews, profile, admin
src/middleware/         auth/roles, image upload, error handling
src/utils/              helpers, image storage (Cloudinary), review shaping
src/seed.js             Sample categories and products
src/createAdmin.js      Creates the administrator account
uploads/                Local-only photo uploads
```

## Endpoints

| Area     | Endpoints |
| -------- | --------- |
| Health   | `GET /api/health` |
| Auth     | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Catalog  | `GET /api/products` (`search`, `category`, `page`), `/api/products/home`, `/api/products/:id`, `/api/categories` |
| Orders   | `POST /api/orders`, `GET /api/orders/mine`, `GET /api/orders/:id` |
| Reviews  | `GET/POST /api/products/:id/reviews`, `PUT/DELETE /api/reviews/:id`, `POST /api/reviews/:id/replies`, `DELETE /api/reviews/:id/replies/:replyId` |
| Profile  | `PUT /api/profile`, `PUT /api/profile/password`, `DELETE /api/profile` |
| Admin    | `/api/admin/stats`, `/products`, `/categories`, `/orders`, `/reviews`, `/users` (admin role required) |
