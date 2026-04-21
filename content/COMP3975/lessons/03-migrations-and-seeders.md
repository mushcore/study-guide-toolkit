---
n: 3
id: migrations-and-seeders
title: "Migrations and seeders — versioning your schema"
hook: "One command wipes your database and repopulates it with clean sample data."
tags: [laravel, migrations, seeders, database-schema]
module: "Laravel Database"
priority: mid
source: "laravel_with_students_MySQL_SCRIPT.docx; laravel_with_sqlite_API_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [eloquent-orm, model-relationships]
pedagogy: concreteness-fading
---

## A migration in 60 seconds

Run this command and you immediately get two files at once:

```bash
php artisan make:model Student -m
```

The `-m` flag tells Artisan to create a migration alongside the model. You find the new migration in `database/migrations/`, named with a timestamp like `2022_03_19_180928_create_students_table.php`.

Open that file and you see two methods: `up()` and `down()`. The `up()` method defines what to build; `down()` defines how to undo it.

```php
public function up()
{
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('FirstName');
        $table->string('LastName');
        $table->string('School');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('students');
}
```

To apply every pending migration:

```bash
php artisan migrate
```

Laravel runs each un-applied migration file in timestamp order and creates the table in your database.

> **Q:** What does the `-m` flag do when you run `php artisan make:model Student -m`?
> **A:** It creates a migration file in `database/migrations/` at the same time as the model file — you get both with one command.

---

## What a migration file actually does

A migration is a PHP class with `up()` and `down()` methods. The `up()` method calls `Schema::create()` or `Schema::table()` to build or alter a table. The `down()` method reverses it — usually with `Schema::dropIfExists()`.

The `$table->` builder methods map directly to SQL column types:

| Method | Column type |
|---|---|
| `$table->id()` | Auto-increment bigint primary key |
| `$table->string('name')` | VARCHAR(255) |
| `$table->timestamps()` | `created_at` and `updated_at` columns |

Laravel stamps every migration filename with a date-time prefix. This timestamp controls the run order. You never need to sort them manually.

> **Pitfall:** Running `php artisan migrate:refresh --seed` drops every table and re-runs all migrations from scratch. Any production data is permanently deleted. Use this command only in development, never against a live database.

---

## Seeding: populating tables with sample data

A seeder is a separate class whose `run()` method inserts rows. Create one with:

```bash
php artisan make:seeder StudentSeeder
```

This creates `database/seeders/StudentSeeder.php`. Add your insert logic inside `run()`:

```php
public function run(): void
{
    $s1 = new \App\Models\Student([
        'FirstName' => 'Tom',
        'LastName'  => 'Max',
        'School'    => 'Nursing'
    ]);
    $s1->save();
}
```

Then register your seeder in `database/seeders/DatabaseSeeder.php`:

```php
public function run(): void
{
    $this->call(StudentSeeder::class);
}
```

Finally, refresh and seed in one step:

```bash
php artisan migrate:refresh --seed
```

The output shows each migration rolling back, then re-running, then your seeder firing.

> **Q:** Where do you register a custom seeder so that `php artisan migrate:refresh --seed` runs it?
> **A:** Add `$this->call(StudentSeeder::class);` inside the `run()` method of `database/seeders/DatabaseSeeder.php`.

---

## Factory seeders: generating random data

When you need many rows quickly, use a factory instead of hand-writing each record. Create one with:

```bash
php artisan make:factory StudentFactory
```

Update its `definition()` method to use Faker:

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

In `DatabaseSeeder.php`, call the factory to generate 20 rows:

```php
\App\Models\Student::factory(20)->create();
```

For this to work, your model must use the `HasFactory` trait:

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
    protected $fillable = ['FirstName', 'LastName', 'School'];
}
```

> **Pitfall:** Factories rely on `$fillable`. If you forget the `$fillable` array on your model, `create()` throws a mass assignment exception and no rows are inserted.

---

> **Takeaway:** Migrations give you version control for your database schema — every change is a tracked, reversible PHP class. Seeders pair with `migrate:refresh --seed` to rebuild a clean, populated database in one command. The `-m` flag creates both the model and its migration together, which is the fastest way to start a new table.
