# GiftNest Project Structure

GiftNest is kept as a Laravel 12 Blade application. The project is organized so local SQLite, Render/PostgreSQL, and Vercel demo preview can share the same codebase without converting the frontend to another framework.

## Main Folders

```text
app/
  Http/
    Controllers/
      Admin/          Admin dashboard, products, categories, orders, users
      Auth/           Laravel Breeze authentication controllers
    Middleware/       Custom HTTP middleware
    Requests/         Form request validation
  Models/             Eloquent models
  Providers/          Laravel service providers
  Services/           Application services, including Vercel demo data
  Support/            Small support objects used by services/controllers
  View/Components/    Blade component classes

api/
  index.php           Vercel serverless entrypoint

bootstrap/
  app.php             Laravel bootstrap and middleware aliases

config/
  view.php            Blade compiled view path config, Vercel-safe via /tmp

database/
  database.sqlite     Local SQLite database
  migrations/         Database schema
  seeders/            Seed data

public/
  css/                Plain CSS
  js/                 Vanilla JavaScript
  images/products/   Static product images for local, Render, and Vercel demo

resources/
  views/              Laravel Blade pages, layouts, components, and admin views

routes/
  web.php             Storefront, cart, checkout, profile, and admin routes

storage/
  framework/          Local Laravel runtime cache/session/view files
  logs/               Local logs

tests/
  Feature/            Feature tests
  Unit/               Unit tests
```

## Deployment Files

```text
Dockerfile            Render/Docker deployment
docker-entrypoint.sh  Docker startup script
render.yaml           Render service and PostgreSQL config
vercel.json           Vercel PHP runtime and routing config
.vercelignore         Files excluded from Vercel upload
api/index.php         Forwards Vercel requests to Laravel public/index.php
```

## Structure Rules

- Keep Blade views in `resources/views`.
- Keep static public assets in `public`.
- Keep product images in `public/images/products`.
- Keep persistent upload/database features for Render or local hosting.
- Keep Vercel as a demo/preview target using cookie sessions and static fallback data.
- Do not add React, Vue, Next.js, Inertia, or SPA folders.
