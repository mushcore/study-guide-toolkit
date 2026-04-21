---
id: migrations-and-seeders
title: "Migrations and seeders — reference"
pillar: tech
priority: mid
tags: [laravel, migrations, seeders, database-schema]
source: "laravel_with_students_MySQL_SCRIPT.docx; laravel_with_sqlite_API_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [eloquent-orm, model-relationships]
---

## Commands at a glance

| Task | Command |
|---|---|
| Create model + migration together | `php artisan make:model Student -m` |
| Create a standalone migration | `php artisan make:migration create_students_table` |
| Run all pending migrations | `php artisan migrate` |
| Drop all tables and re-run every migration | `php artisan migrate:refresh` |
| Drop, re-run, then seed | `php artisan migrate:refresh --seed` |
| Create a seeder class | `php artisan make:seeder StudentSeeder` |
| Run seeders without refreshing | `php artisan db:seed` |
| Create a factory | `php artisan make:factory StudentFactory` |

---

## Migration file structure

Every migration file lives in `database/migrations/` with a timestamp prefix that controls run order. The class extends `Migration` and implements two methods.

> **Example**
>
> Full migration for the `students` table:
>
> ```php
> <?php
>
> use Illuminate\Database\Migrations\Migration;
> use Illuminate\Database\Schema\Blueprint;
> use Illuminate\Support\Facades\Schema;
>
> return new class extends Migration
> {
>     public function up()
>     {
>         Schema::create('students', function (Blueprint $table) {
>             $table->id();
>             $table->string('FirstName');
>             $table->string('LastName');
>             $table->string('School');
>             $table->timestamps();
>         });
>     }
>
>     public function down()
>     {
>         Schema::dropIfExists('students');
>     }
> };
> ```
>
> `$table->id()` creates an auto-increment bigint primary key.
> `$table->timestamps()` adds `created_at` and `updated_at` columns automatically.

---

## Common schema builder column types

| Builder method | SQL result |
|---|---|
| `$table->id()` | `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` |
| `$table->string('col')` | `VARCHAR(255)` |
| `$table->integer('col')` | `INT` |
| `$table->timestamps()` | Two `TIMESTAMP` columns: `created_at`, `updated_at` |

---

## Seeder file structure

Seeders live in `database/seeders/`. The `DatabaseSeeder` is the entry point; it calls other seeders via `$this->call()`.

> **Example**
>
> `StudentSeeder.php` inserting fixed rows:
>
> ```php
> <?php
>
> namespace Database\Seeders;
>
> use Illuminate\Database\Seeder;
>
> class StudentSeeder extends Seeder
> {
>     public function run(): void
>     {
>         $s1 = new \App\Models\Student([
>             'FirstName' => 'Tom',
>             'LastName'  => 'Max',
>             'School'    => 'Nursing'
>         ]);
>         $s1->save();
>     }
> }
> ```
>
> Register it in `DatabaseSeeder.php`:
>
> ```php
> public function run(): void
> {
>     $this->call(StudentSeeder::class);
> }
> ```

---

## Factory seeders

Factories generate rows using Faker data. The factory's `definition()` method returns an array of column-to-faker-method mappings.

```php
public function definition(): array
{
    return [
        'FirstName' => $this->faker->firstName(),
        'LastName'  => $this->faker->lastName(),
        'School'    => $this->faker->company(),
    ];
}
```

Call the factory from `DatabaseSeeder.php`:

```php
\App\Models\Student::factory(20)->create();
```

The model must use the `HasFactory` trait for this to work.

---

> **Pitfall:** `php artisan migrate:refresh --seed` destroys all existing data. It rolls back every migration before re-running them. Use it freely in development; never run it against a production database. The `--seed` flag only fires after the refresh completes successfully.

---

> **Q:** What is the difference between `php artisan migrate` and `php artisan migrate:refresh --seed`?
> **A:** `migrate` runs only the pending (not yet applied) migrations. `migrate:refresh --seed` drops every table, re-runs all migrations from scratch, then runs seeders — wiping all data in the process.

---

> **Takeaway:** Every schema change in Laravel is a versioned migration file. You apply changes with `migrate`, undo them with `down()`, and reset to a clean seeded state with `migrate:refresh --seed`. The `-m` flag when creating a model keeps the model and its migration in sync from the start.
