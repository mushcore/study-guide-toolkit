---
n: 6
id: artisan-composer
title: "Artisan CLI and Composer — your Laravel toolkit"
hook: "Two tools you run before writing a single line of application code."
tags: [artisan, composer, cli, laravel, project-setup]
module: "Laravel Foundations"
priority: mid
source: "intro_to_laravel.pptx; intro_to_laravel_SCRIPT.docx"
bloom_levels: [remember, understand]
related: [laravel-mvc-blade, laravel-routing-controllers, eloquent-orm]
pedagogy: concreteness-fading
---

## From zero to running app in two commands

Before you write a controller or a view, you run this:

```bash
composer create-project laravel/laravel my-app
cd my-app
php artisan serve --port=8888
```

Those three lines create a complete Laravel project and start the dev server at `http://localhost:8888`. Composer builds the project; Artisan runs it. Everything else you do in Laravel flows from these two tools.

## What Composer does

Composer is PHP's dependency manager. You use it to create a project and to add packages later.

```bash
# Create a new Laravel project
composer create-project laravel/laravel project-name

# Add a package to an existing project
composer require vendor/package-name
```

After `create-project`, Composer downloads Laravel and all its dependencies into the `vendor/` folder. That folder is git-ignored — anyone cloning your repo restores it with `composer install`.

> **Q:** A teammate cloned your repo. The `vendor/` folder is missing. What command restores it?
> **A:** `composer install` — it reads `composer.json` and downloads everything listed there.

## What Artisan does

Artisan is Laravel's built-in CLI. You run every Artisan command with the `php artisan` prefix.

```bash
php artisan serve --port=8888      # start dev server
php artisan tinker                 # open an interactive REPL
php artisan route:clear            # clear cached routes
php artisan config:clear           # clear cached config
php artisan cache:clear            # clear application cache
```

> **Pitfall:** Artisan commands use **colon** syntax — `make:migration`, `make:controller`, `make:model`. The hyphen form (`make-migration`) does not exist. This was tested directly in final-practice.docx Q6: option (c) `php artisan make-migration user-table` is wrong; option (b) `php artisan make:migration user-table` is correct.

## The `make:` family — scaffolding commands

The most-used Artisan commands are the `make:` generators. They create skeleton files so you never start from a blank page.

```bash
php artisan make:model Student -m          # model + migration in one step
php artisan make:controller StudentsController --resource
php artisan make:migration create_students_table
php artisan make:seeder StudentSeeder
```

The `-m` flag on `make:model` is a shortcut: it generates both the model file and its matching migration in a single command. Without `-m`, you would need two separate commands.

`--resource` on `make:controller` scaffolds all seven RESTful methods: `index`, `create`, `store`, `show`, `edit`, `update`, and `destroy`.

> **Q:** What is the single command that creates a model and its database migration at the same time?
> **A:** `php artisan make:model ModelName -m` — the `-m` flag generates the migration alongside the model.

## Cache-clearing commands

Laravel caches routes, config, and compiled views to speed up production. During development, stale caches cause confusing bugs. Clear them with:

```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

Run these any time a config change or route addition does not seem to take effect.

## Tinker — test your models interactively

`php artisan tinker` opens a REPL (Read-Eval-Print Loop) that boots Laravel fully. You can query your database, create records, and test Eloquent methods without writing a controller.

```bash
php artisan tinker
>>> \App\Models\Student::all()
>>> \App\Models\Student::find(1)
```

> **Takeaway:** Composer creates the project and manages packages. Artisan scaffolds files, runs the server, and manages the app lifecycle. Know the colon syntax for every `make:` command — the exam tests it directly — and reach for `tinker` whenever you need to verify Eloquent behavior without a browser.
