# GiftNest Backend

REST API for GiftNest: Node.js, Express 4, Mongoose (MongoDB Atlas), JWT auth (bcrypt), Multer uploads.

## MongoDB Atlas setup

1. Create a free cluster at https://cloud.mongodb.com.
2. **Database Access**: add a database user (username + password).
3. **Network Access**: add your IP (use `0.0.0.0/0` for hosted servers such as Render).
4. **Database > Connect > Drivers**: copy the connection string into `.env` as `MONGODB_URI`, with your
   username, password and a database name:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/giftnest?retryWrites=true&w=majority`
   (URL-encode special characters in the password, e.g. `@` becomes `%40`.)

## Run

```bash
npm install
cp .env.example .env     # set MONGODB_URI, JWT_SECRET, CLIENT_URL
npm run seed             # sample categories, products and users
npm run dev              # http://localhost:5000
```

Seeded accounts (password `password`): `admin@giftnest.com` (admin), `customer@example.com` (customer).

## Environment variables

| Name           | Purpose                                                          |
| -------------- | ---------------------------------------------------------------- |
| `MONGODB_URI`  | MongoDB Atlas connection string                                  |
| `JWT_SECRET`   | Secret used to sign login tokens                                 |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)                                  |
| `CLIENT_URL`   | Allowed frontend origin(s), comma-separated (CORS)               |
| `PORT`         | Port to listen on (default `5000`)                               |

## Deploy

`render.yaml` is included for Render (root directory `backend`). Set the variables above, and run `npm run seed` once.
Render's free disk is ephemeral, so images uploaded from the admin panel are lost on redeploy.

## Structure

```text
src/index.js        App entry
src/models/         User, Category, Product, Order
src/routes/         auth, catalog, orders, profile, admin
src/middleware/     auth/roles, image upload, error handling
src/seed.js         Sample data
public/images/      Seeded product images
uploads/            Images uploaded from the admin panel
```

## Endpoints

| Area     | Endpoints                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------- |
| Auth     | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`                           |
| Catalog  | `GET /api/products` (`search`, `category`, `page`), `/api/products/home`, `/api/products/:id`, `/api/categories` |
| Orders   | `POST /api/orders`, `GET /api/orders/mine`, `GET /api/orders/:id`                               |
| Profile  | `PUT /api/profile`, `PUT /api/profile/password`, `DELETE /api/profile`                          |
| Admin    | `/api/admin/stats`, `/products`, `/categories`, `/orders`, `/users` (admin role required)       |
