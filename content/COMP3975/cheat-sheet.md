---
title: "COMP 3975 — exam-eve cheat sheet"
---

## Artisan key commands

- `php artisan serve --port=8888` — start dev server
- `php artisan make:model Name -m` — model + migration
- `php artisan make:controller Name --resource` — RESTful controller
- `php artisan make:migration create_table_name` — migration only
- `php artisan migrate` · `migrate:refresh --seed` · `migrate:rollback`
- `php artisan make:seeder NameSeeder` · `db:seed`
- `php artisan jwt:secret` — generate JWT signing key
- `php artisan l5-swagger:generate` — regenerate Swagger docs
- `php artisan breeze:install` — install session auth scaffold
- `php artisan route:clear` · `config:clear` · `cache:clear`
- `php artisan tinker` — interactive REPL
- `php artisan make:mcp-server Name` · `make:mcp-tool Name`

## MVC + Blade templating

- **MVC**: Model (data/DB), View (Blade templates), Controller (logic)
- **Layout**: `@extends('layouts.master')` + `@section('name')` / `@endsection`
- **Yield slot**: `@yield('name')` in layout file
- **Include partial**: `@include('partials.nav')`
- **Escaped output** (XSS-safe): `{{ $var }}`
- **Unescaped output** (XSS risk): `{!! $var !!}`
- **Control flow**: `@if($x)` / `@elseif` / `@else` / `@endif`; `@foreach($items as $item)` / `@endforeach`
- **Blade components**: `<x-component-name>`, `<x-slot name="content">`

## Eloquent ORM

- `Model::all()` — all records (not `::get()`, not `::all()->get()`)
- `Model::find($id)` — one record by PK (null if missing)
- `Model::findOrFail($id)` — one record or 404 exception
- `Model::where('col', $val)->get()`
- `Model::create($data)` — requires `$fillable` on model
- `$model->save()` · `$model->update($data)` · `$model->delete()`
- **Mass assignment**: add `protected $fillable = ['col1', 'col2']` to model
- **Relationships**: `hasMany(Related::class)` · `belongsTo(Related::class)`
- `whereBelongsTo($user)` shorthand for ownership filter
- **Auth facade**: `Auth::user()` · `Auth::id()`
- DB access hierarchy: **Eloquent** > Query Builder > Raw SQL

## Query Builder + Raw SQL

- `DB::table('name')->select('col')->where('col', $val)->get()`
- `DB::select('SELECT * FROM t WHERE id = ?', [$id])` — raw SQL
- Enable query log: `DB::enableQueryLog()` then `DB::getQueryLog()`

## Migrations + Seeders

- Migration `up()`: `Schema::create('table', fn($t) => ...)` with `$t->id()`, `$t->string()`, `$t->timestamps()`
- Migration `down()`: `Schema::dropIfExists('table')`
- Seeder `run()`: `Model::create([...])` or `DB::table()->insert([...])`

## REST API design

- `Route::resource('items', ItemController::class)` — 7 RESTful routes
- `Route::apiResource(...)` — 5 routes (no create/edit views)
- Validation: `$request->validate(['field' => 'required|string|max:255'])`
- JSON response: `return response()->json($data, 200)`
- `findOrFail()` auto-returns 404 on missing record
- CORS: enabled by default; `config/cors.php` for credentials

## JWT authentication

- Package: `composer require php-open-source-saver/jwt-auth`
- Generate key: `php artisan jwt:secret`
- Auth guard: `config/auth.php` — `'driver' => 'jwt'`
- User model must implement `JWTSubject`: add `getJWTIdentifier()` + `getJWTCustomClaims()`
- Token structure: `header.payload.signature` (all base64-encoded, dot-separated)
- **Reserved claims**: `iat` issued-at · `exp` expiration · `sub` subject · `iss` issuer · `aud` audience · `nbf` not-before · `jti` JWT-ID
- Request header: `Authorization: Bearer <token>`
- AuthController routes: login · register · logout · refresh · user

## Session auth — Breeze

- `composer require laravel/breeze --dev` → `php artisan breeze:install`
- Uses **Tailwind CSS** (not Bootstrap)
- Built-in routes: register, login, logout, password reset, email verify
- Protect routes: `->middleware(['auth'])` or `->middleware(['auth', 'verified'])`
- Sanctum alternative: `$user->createToken('name')->plainTextToken`

## Swagger / OpenAPI

- **OpenAPI** = specification language (JSON/YAML contract)
- **Swagger** = toolset (UI, Editor, Codegen) — not the same as OpenAPI
- Package: `composer require darkaonline/l5-swagger -W`
- Publish: `php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"`
- Generate: `php artisan l5-swagger:generate`
- Docs URL: `/api/documentation`
- Base annotation: `#[OA\Info(title:'API', version:'1.0')]` on a controller
- Endpoint: `#[OA\Get(path:'/api/items', ...)]` · `#[OA\Post(...)]`
- Response: `#[OA\Response(response:200, description:'OK')]`
- Schema: `#[OA\Schema(schema:'Item', required:['name'], ...)]`
- Auto-gen in dev: `L5_SWAGGER_GENERATE_ALWAYS=true` in `.env`

## cURL

- 4-step pattern: `curl_init($url)` → `curl_setopt($h, OPT, $val)` → `curl_exec($h)` → `curl_close($h)`
- `CURLOPT_RETURNTRANSFER` → store response in variable (not output directly)
- `CURLOPT_HTTPHEADER` → set headers array
- `CURLOPT_SSL_VERIFYHOST=0` + `CURLOPT_SSL_VERIFYPEER=0` → disable SSL (dev only)
- Error check: `if ($resp === false) { curl_error($h) }`

## Localization

- Directory: `resources/lang/{locale}/` (NOT views/lang, storage/lang, app/lang)
- PHP file: `resources/lang/fr/messages.php` → returns array (domain text)
- JSON file: `resources/lang/fr.json` → key=English phrase (UI strings)
- Helper: `__('messages.welcome')` or `__('text')` (NOT `translate()`, `t()`, `i18n()`)
- Plural: `trans_choice('messages.apples', $count)` with `{0}...|{1}...|[2,*] :count`
- Set at runtime: `App::setLocale('fr')` · default in `config/app.php`
- Middleware pattern: `SetLocale` middleware reads session/route param
- Route prefix: `Route::prefix('{locale}')->middleware('setLocale')->group(...)`

## MCP — Model Context Protocol

- Created by: **Anthropic** (not OpenAI, Meta, Google)
- Three components: **Tools** (executable actions) · **Resources** (data sources) · **Prompts** (reusable LLM templates)
- Architecture: MCP Client ↔ MCP Server (composable — a client can also be a server)
- Laravel: `composer require laravel/mcp`
- Commands: `make:mcp-server Name` · `make:mcp-tool Name` · `mcp:inspector path`
- Config: `mcp.json` in VS Code with server URL and type `"http"`

## Azure Static Web Apps + Functions

- SWA = serverless hosting for SPAs (Vue, React, Angular, Svelte) + Functions backend
- **Triggers**: HTTP · Timer · Queue · Blob · Event Hub
- **Bindings**: input (read from storage/DB) · output (write to queues/storage)
- TS function signature: `AzureFunction` type, `Context` + `HttpRequest` params, return via `context.res`
- Deploy: GitHub Actions auto-generated; set `output_location` + `app_build_command` in `.yml`
- Common error: wrong `output_location` in build config

## Azure Laravel deployment

- `startup.sh`: run migrations (`--force`), copy Nginx config, cache config/routes/views
- Environment vars: set `DATABASE_CONNECTION_STRING` in Azure portal
- Pull GitHub Actions `.yml` after Azure creates it; edit build settings; push
- Production Swagger: add `URL::forceScheme('https')` in `AppServiceProvider`
