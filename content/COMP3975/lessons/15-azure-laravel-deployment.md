---
n: 15
id: azure-laravel-deployment
title: "Deploying Laravel to Azure App Service"
hook: "Your local Laravel app works perfectly. Getting it running on Azure requires one extra file and a handful of portal steps — here is exactly how."
tags: [azure, deployment, laravel, nginx]
module: "cloud-deployment"
priority: low
source: "resources/Steps to Azure Deployment.html; resources/Fixes 2026.html"
bloom_levels: [remember, understand, apply]
pedagogy: worked-example-first
related: [azure-functions, env-config]
---

## The problem: why local ≠ cloud

Your local machine has a `.env` file, a running PHP server, and pre-built storage directories. Azure App Service has none of those by default. The container that Azure spins up runs Nginx, not PHP's built-in server. It has no `.env` file on disk, no SQLite file, and no `storage/framework/` hierarchy.

Push raw Laravel code to Azure and you get a blank page or a 500 error. The fix is two things: a shell script that runs at container startup, and environment variables set in the Azure portal.

> **Q:** Before reading on — what would happen if Azure tried to serve a Laravel app without running `php artisan config:cache` first?
> **A:** Laravel reads config from `config/*.php`, which itself reads from `.env`. With no `.env` on Azure, config values are missing or null, and the app crashes. Caching bakes the current environment values into a PHP file so Laravel never touches `.env` again.

---

## Step 1 — Add `startup.sh` and `default` to your repo root

Two files go in the **root of your Laravel project** (alongside `artisan`, `composer.json`, etc.):

**`startup.sh`** — the shell script Azure runs at container startup:

```bash
#!/bin/bash

# Stop Nginx before reconfiguring
service nginx stop

# Create the SQLite file if it does not exist yet
if [ ! -f /home/site/wwwroot/database/database.sqlite ]; then
    touch /home/site/wwwroot/database/database.sqlite
    chmod 666 /home/site/wwwroot/database/database.sqlite
fi

# Ensure Laravel's storage directory tree exists
mkdir -p /home/site/wwwroot/storage/framework/views
mkdir -p /home/site/wwwroot/storage/framework/cache
mkdir -p /home/site/wwwroot/storage/framework/sessions
mkdir -p /home/site/wwwroot/storage/logs

# Set permissions for the web server user
chmod -R 775 /home/site/wwwroot/storage
chmod -R 775 /home/site/wwwroot/bootstrap/cache
chown -R www-data:www-data /home/site/wwwroot/storage
chown -R www-data:www-data /home/site/wwwroot/bootstrap/cache

# Run migrations and seeders
php /home/site/wwwroot/artisan migrate --force
php /home/site/wwwroot/artisan db:seed --force

# Clear stale caches, then rebuild them
php /home/site/wwwroot/artisan cache:clear
php /home/site/wwwroot/artisan config:clear
php /home/site/wwwroot/artisan config:cache
php /home/site/wwwroot/artisan route:clear
php /home/site/wwwroot/artisan view:clear
php /home/site/wwwroot/artisan view:cache

# Install the custom Nginx config and start Nginx
cp /home/site/wwwroot/default /etc/nginx/sites-available/default
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
service nginx start
```

**`default`** — Nginx virtual-host config (listens on port 8080, routes PHP through FastCGI):

```text
server {
    listen 8080;
    listen [::]:8080;

    root /home/site/wwwroot/public;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}
```

Commit both files and push to GitHub.

> **Pitfall:** Do not put `startup.sh` inside `public/` or `storage/`. Azure will not find it there. It must sit alongside `artisan` in the project root. Azure later references it as `/home/site/wwwroot/startup.sh`.

---

## Step 2 — Create the Azure App Service

In the Azure portal:

1. Create a new **App Service → Web App**.
2. Set **Runtime stack** to **PHP** (the version your app targets).
3. Set **Operating System** to **Linux** — the startup script is a bash script; it does not run on Windows.
4. Finish creating the resource.

---

## Step 3 — Set environment variables in Azure Configuration

Azure replaces `.env`. You set key-value pairs in **Settings → Configuration → Application settings**. Laravel reads them at runtime exactly as it would read `.env`.

The minimum set for an SQLite API app:

| Key | Value |
|---|---|
| `APP_DEBUG` | `true` |
| `APP_STORAGE` | `/home/site/wwwroot/storage` |
| `APP_KEY` | `base64:…` (your generated key) |
| `DB_CONNECTION` | `sqlite` |
| `DB_DATABASE` | `/home/site/wwwroot/database/database.sqlite` |

> **Pitfall:** Never upload a `.env` file to Azure or commit it to GitHub. Environment variables belong in **Configuration → Application settings** only. Committing `.env` exposes your `APP_KEY` and database credentials to anyone who can read the repo.

---

## Step 4 — Wire the startup command

Still in the Azure portal, go to **Settings → Configuration → Stack settings**. In the **Startup Command** field enter:

```bash
bash /home/site/wwwroot/startup.sh
```

This tells the App Service container to run your script every time the container boots.

---

## Step 5 — Link to GitHub and deploy

1. Go to **Deployment Center** on your App Service.
2. Choose **GitHub** as the source.
3. Authorize and select your repo and branch.
4. Azure creates a GitHub Actions workflow file (`.github/workflows/main_*.yml`). Pull it locally with `git pull` so your repo stays in sync.
5. Every future push to the linked branch automatically triggers a new deployment.

> **Q:** Why does `migrate --force` appear in `startup.sh` instead of running once during CI?
> **A:** Azure's Linux container can be recycled at any time. The `--force` flag bypasses the "are you sure?" prompt that migration shows in non-local environments. Running migrate at startup guarantees the schema is always current even after a container restart.

---

## Optional — Swagger UI on Azure

If your app uses Swagger, add these two lines to the "Clear and cache" block in `startup.sh`:

```bash
php /home/site/wwwroot/artisan l5-swagger:publish
php /home/site/wwwroot/artisan l5-swagger:generate
```

Also add both the local and the Azure URL as `OA\Server` entries in `Controller.php`, and force HTTPS in `AppServiceProvider::boot()`:

```php
if (config('app.env') === 'production') {
    URL::forceScheme('https');
}
```

---

## Mono-repo: backend + frontend in one GitHub repo

Azure supports deploying a Laravel backend and a static frontend from the same repo. Use two separate Azure deployments:

- **App Service → Web App** for the Laravel backend (uses the same `startup.sh` flow above).
- **Static Web Apps** for the React/HTML frontend.

Each deployment has its own GitHub Actions workflow file. Edit the backend workflow to point at the correct subfolder (e.g., `laravel-backend/`).

> **Pitfall:** Omitting `php artisan config:cache` from `startup.sh` is the most common cause of 500 errors on Azure. Without it, Laravel attempts to read `.env`, which does not exist in the container. The cache step is not optional.

> **Takeaway:** Deploying Laravel to Azure requires exactly one extra file (`startup.sh`) placed in the project root, a startup command set in the Azure portal, and environment variables entered in Configuration — not in a `.env` file. Every container restart re-runs the script, so migrations and caches are always fresh.
