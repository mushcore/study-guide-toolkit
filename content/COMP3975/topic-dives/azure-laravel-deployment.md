---
id: azure-laravel-deployment
title: "Azure Laravel deployment — startup script and environment reference"
pillar: tech
priority: low
tags: [azure, deployment, laravel, nginx, startup]
source: "resources/Steps to Azure Deployment.html; resources/Fixes 2026.html"
bloom_levels: [remember, understand]
related: [azure-functions, env-config]
---

## Concrete starting point

Imagine this scenario: your local `php artisan serve` works fine. You push to GitHub, link the repo to Azure App Service, and the site returns a 500 error. The container has no `.env`, no SQLite file, and Nginx is misconfigured. A shell script run at container startup fixes all three.

---

## What the startup script does — command by command

The file lives at the **project root** (`/home/site/wwwroot/startup.sh` on Azure). Azure runs it every time the container boots.

| Command | Purpose |
|---|---|
| `service nginx stop` | Stops the default Nginx so the custom config can be installed without a conflict. |
| `touch .../database.sqlite` + `chmod 666` | Creates the SQLite file if it does not already exist; sets read-write permissions for the web process. |
| `mkdir -p storage/framework/{views,cache,sessions}` | Ensures Laravel's required cache directories exist (they are not committed to git). |
| `chmod -R 775 storage` / `chown www-data` | Grants the Nginx/PHP-FPM process (`www-data`) write access to storage and bootstrap/cache. |
| `php artisan migrate --force` | Runs pending migrations without an interactive prompt; `--force` bypasses the "are you in production?" guard. |
| `php artisan db:seed --force` | Seeds the database; safe to run repeatedly because seeds use `firstOrCreate` or similar idempotent patterns. |
| `php artisan cache:clear` | Clears the application cache so stale data from a previous deploy does not persist. |
| `php artisan config:clear` | Removes the cached config file so the next `config:cache` starts clean. |
| `php artisan config:cache` | Compiles `config/*.php` + environment variables into a single PHP file. Laravel uses this file; the `.env` file is never read. |
| `php artisan route:clear` / `route:cache` | (implicit — clear is run; cache can be added) Removes the compiled route file and optionally rebuilds it. |
| `php artisan view:clear` / `view:cache` | Clears Blade-compiled views and pre-compiles them so first-request latency is lower. |
| `cp default /etc/nginx/sites-available/default` | Replaces the default Nginx virtual-host config with the project's custom one. |
| `service nginx start` | Restarts Nginx with the new config; the app is now reachable. |

> **Example:** What startup.sh does on a cold container start
>
> **Step 1 — Stop the default Nginx and create the SQLite database.**
> `service nginx stop` removes the pre-installed Nginx config. `touch database/database.sqlite && chmod 666 database/database.sqlite` creates the SQLite file if absent and makes it writable — containers do not persist files between deploys unless stored in `/home`.
>
> **Step 2 — Set storage permissions.**
> `mkdir -p storage/framework/{views,cache,sessions}` ensures Laravel's cache directories exist (they are not committed to git). `chmod -R 775 storage && chown -R www-data storage` grants the Nginx/PHP-FPM process write access.
>
> **Step 3 — Run migrations and seed the database.**
> `php artisan migrate --force` applies any pending schema changes without an interactive confirmation prompt. `--force` is required in production mode; without it, the command refuses to run.
>
> **Step 4 — Cache config and restart Nginx.**
> `php artisan config:cache` compiles all `config/*.php` + Azure Application Settings into one PHP file. After this, Laravel never reads `.env` — it reads the cached file. `cp default /etc/nginx/... && service nginx start` installs the project's custom Nginx config and starts serving traffic.

> **Pitfall:** Omitting `php artisan config:cache` is the most common cause of "config is null" errors on Azure. Without it, Laravel tries to read `.env`, which does not exist in the container. The cache step is not optional.

---

## Environment variables: Azure Configuration, not `.env`

On a local machine you set `APP_KEY`, `DB_CONNECTION`, and so on in `.env`. On Azure you set them in **Settings → Configuration → Application settings** in the portal. Laravel reads them identically at runtime.

The minimum required keys for an SQLite API app:

| Key | Example value | Why it is needed |
|---|---|---|
| `APP_KEY` | `base64:…` | Laravel encryption; app panics without it. |
| `APP_DEBUG` | `true` | Surface errors during initial setup; switch to `false` in production. |
| `APP_STORAGE` | `/home/site/wwwroot/storage` | Points storage operations to the persistent `/home` volume. |
| `DB_CONNECTION` | `sqlite` | Tells Eloquent which driver to use. |
| `DB_DATABASE` | `/home/site/wwwroot/database/database.sqlite` | Absolute path; relative paths fail because the working directory varies. |

> **Pitfall:** Do not commit `.env` to the repo. Do not create a `.env` file on the Azure server manually. Any value placed in `.env` is invisible after `php artisan config:cache` replaces the config with values from Application settings.

---

## Startup command wiring

In **Settings → Configuration → Stack settings**, set the **Startup Command** to:

```bash
bash /home/site/wwwroot/startup.sh
```

Azure executes this command each time the App Service container starts or restarts.

---

## Swagger add-ons in the startup script

For apps that expose Swagger UI, append these lines to the caching block:

```bash
php /home/site/wwwroot/artisan l5-swagger:publish
php /home/site/wwwroot/artisan l5-swagger:generate
```

Also force HTTPS in `AppServiceProvider::boot()` so Swagger UI links do not mix HTTP/HTTPS:

```php
if (config('app.env') === 'production') {
    URL::forceScheme('https');
}
```

---

## Deployment flow summary

```mermaid
graph LR
    A[git push to GitHub] --> B[GitHub Actions workflow triggered]
    B --> C[Azure pulls new code]
    C --> D[Container restarts]
    D --> E[startup.sh runs]
    E --> F[migrate, seed, config:cache, nginx start]
    F --> G[App is live]
```

> **Takeaway:** The startup script is the bridge between a stateless Azure container and a running Laravel app. Every key action — creating the database file, setting permissions, running migrations, and caching config — happens in that one script. Environment variables in the Azure portal replace `.env` entirely; `php artisan config:cache` makes that substitution permanent for the life of the container.
