---
n: 3
id: migrations-and-seeders-create
title: "Create a migration and seeder"
lang: php
tags: [laravel, migrations, seeders, database-schema]
source: "laravel_with_students_MySQL_SCRIPT.docx"
pedagogy: worked-example-first
kind: code
---

## Prompt

You are building a `books` table. The table needs three string columns — `title`, `author`, and `genre` — plus the standard `id` and timestamps.

1. Complete the migration's `up()` method to create the `books` table with those columns.
2. Complete the seeder's `run()` method to insert one sample book row.

## Starter

```php
<?php
// --- Migration: database/migrations/xxxx_create_books_table.php ---

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            // TODO: add title, author, genre columns
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};

// --- Seeder: database/seeders/BookSeeder.php ---

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        // TODO: insert one Book row with title, author, genre
    }
}
```

## Solution

```php
<?php
// --- Migration: database/migrations/xxxx_create_books_table.php ---

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('genre');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};

// --- Seeder: database/seeders/BookSeeder.php ---

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $b1 = new \App\Models\Book([
            'title'  => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
            'genre'  => 'Fiction'
        ]);
        $b1->save();
    }
}
```

## Why

`$table->string('title')` creates a `VARCHAR(255)` column named `title`. You add one call per column you need. The `$table->id()` and `$table->timestamps()` lines are always present in the scaffold — you only add your domain columns between them.

The seeder passes the column values as an associative array to `new \App\Models\Book([...])`, then calls `save()` to persist the row. The `Book` model must have a `$fillable` array listing `title`, `author`, and `genre`, or the mass assignment will throw an exception.

A common wrong approach is calling `Schema::table('books', ...)` instead of `Schema::create('books', ...)`. Use `create` when the table does not exist yet; use `table` only when altering an existing table.

To apply the migration and seed in one step:

```bash
php artisan migrate:refresh --seed
```

Register `BookSeeder` in `DatabaseSeeder::run()` first, or the seeder never fires.
