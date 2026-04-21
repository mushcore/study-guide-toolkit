---
id: artisan-composer
title: "Artisan CLI and Composer — reference"
pillar: tech
priority: mid
tags: [artisan, composer, cli, laravel]
source: "intro_to_laravel.pptx; laravel_with_sqlite_API_SCRIPT.docx"
bloom_levels: [remember, understand]
related: [laravel-mvc-blade, eloquent-orm]
---

## Command reference

| Command | What it does | When to use |
|---|---|---|
| `composer create-project laravel/laravel name` | Creates a new Laravel project in `name/` | Starting a project from scratch |
| `composer install` | Restores `vendor/` from `composer.json` | After cloning a repo without `vendor/` |
| `composer require vendor/package` | Adds a package to the project | Installing any third-party library |
| `php artisan serve --port=8888` | Starts the dev server at `localhost:8888` | Local development |
| `php artisan make:model Name -m` | Creates model + matching migration | New database entity |
| `php artisan make:controller Name --resource` | Scaffolds all 7 RESTful methods | New resource controller |
| `php artisan make:migration create_table` | Creates a migration file only | Schema change without a new model |
| `php artisan make:seeder NameSeeder` | Creates a seeder class | Adding sample/seed data |
| `php artisan migrate` | Runs pending migrations against the database | After creating or editing migrations |
| `php artisan migrate:refresh --seed` | Drops all tables, re-migrates, re-seeds | Full database reset during dev |
| `php artisan tinker` | Opens an interactive Laravel REPL | Testing Eloquent queries without a browser |
| `php artisan route:clear` | Clears the cached route list | After adding or editing routes |
| `php artisan config:clear` | Clears the cached config | After editing `.env` or `config/` files |
| `php artisan cache:clear` | Clears the application cache | General stale-cache debugging |
| `php artisan vendor:publish --provider="..."` | Copies package config/assets to your app | After installing packages that need config |
| `php artisan install:api` | Creates `routes/api.php` | Setting up an API-only route file |

## Typical project setup sequence

> **Example:** Starting a new SQLite-backed API project from scratch.
>
> ```bash
> # 1. Create project
> composer create-project laravel/laravel my-api
> cd my-api
>
> # 2. Create the API routes file
> php artisan install:api
>
> # 3. Scaffold model + migration together
> php artisan make:model Student -m
>
> # 4. Edit the migration, then apply it
> php artisan migrate
>
> # 5. Scaffold a resource controller
> php artisan make:controller api/StudentsController --resource
>
> # 6. Start the dev server
> php artisan serve --port=8888
> ```
>
> Steps 3–5 use `make:` commands with colon separators. You never write these files manually.

## Flags to know

| Flag | Used with | Effect |
|---|---|---|
| `-m` | `make:model` | Also generates a migration for the model |
| `--resource` | `make:controller` | Scaffolds all 7 RESTful methods |
| `--api` | `make:controller` | Scaffolds 5 API methods (no `create`/`edit` views) |
| `--port=8888` | `serve` | Binds to port 8888 instead of the default 8000 |
| `--seed` | `migrate:refresh` | Re-runs all seeders after the migration reset |
| `--force` | `migrate` (production) | Bypasses the "are you sure?" prompt in non-interactive environments |

> **Pitfall:** Every `make:` command uses a **colon** between the namespace and the subcommand — `make:migration`, `make:controller`, `make:model`. The hyphen form (`make-migration`) does not exist in Laravel. Final-practice.docx Q6 listed `php artisan make-migration user-table` as a distractor; test-takers who confused the separator chose the wrong answer.

> **Takeaway:** Artisan's `make:` family scaffolds every file type you need; `composer create-project` and `composer install` handle project creation and restoration. Memorize the colon separator and the `-m` / `--resource` flags — these appear directly on the exam.
