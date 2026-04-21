# Glossary — COMP3975

Read this before writing any content. Use the canonical form verbatim; never substitute a synonym.

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| Blade | Laravel templating engine, template engine | PHP templating engine built into Laravel; uses @-directives for control flow and layout inheritance. | intro_to_laravel.pptx slide 2 |
| @-directives | Blade directives, Blade tags | Blade syntax prefixed with `@` (@extends, @section, @yield, @include, @if, @foreach, @endsection). | intro_to_laravel.pptx slides 11–29 |
| MVC | Model-View-Controller | Architectural pattern separating data (Model), UI (View), and business logic (Controller). | intro_to_laravel.pptx slide 5 |
| Artisan | artisan CLI, Laravel CLI | Built-in command-line interface; all commands use the `php artisan` prefix with colon-separated namespaces. | intro_to_laravel.pptx slide 9 |
| Composer | NPM, Yarn, Pip, package manager | PHP dependency manager; installs Laravel and all third-party packages. | intro_to_laravel.pptx slide 7 |
| facade | Laravel facade, static interface | Static-like accessor to a Laravel service (Auth::, DB::, URL::, App::); bound to the service container. | intro_to_laravel.pptx slide 27 |
| partial view | view component, include file | Reusable Blade template fragment included with `@include('partials.name')`. | intro_to_laravel.pptx slide 20 |
| double-brace syntax | echo tags, output tags | `{{ $var }}` outputs escaped HTML (XSS-safe); `{!! $var !!}` outputs raw HTML (XSS risk). | intro_to_laravel.pptx slide 25 |
| XSS | cross-site scripting, injection | Attack where malicious scripts are injected into a page; Blade's `{{ }}` prevents it by escaping output. | intro_to_laravel.pptx slide 25 |
| Eloquent ORM | Eloquent, Laravel ORM, Active Record | Laravel's object-relational mapper; preferred data access pattern (Model::all(), findOrFail(), etc.). | laravel_with_students_MySQL_SCRIPT.docx |
| $fillable | mass assignment list, protected fields, whitelist | Array on an Eloquent model listing which attributes may be set via mass assignment. | laravel_with_sqlite_API_SCRIPT.docx |
| mass assignment | bulk insertion, batch fill | Setting multiple Eloquent attributes at once via `create()` or `fill()`; blocked without `$fillable`. | laravel_with_sqlite_API_SCRIPT.docx |
| Query Builder | query builder, DB builder, fluent builder | `DB::table()->...` fluent API; second-preference data access pattern after Eloquent. | TIDBITS-components_config_db_SCRIPT.docx |
| raw SQL | raw queries, direct SQL | `DB::select()` with SQL strings; least-preferred data access pattern. | TIDBITS-components_config_db_SCRIPT.docx |
| migration | schema migration, database migration | PHP class defining database schema changes in `up()` / `down()` methods. | All Laravel scripts |
| seeder | database seeder, fixture | Class that populates database tables with sample data via `php artisan db:seed`. | Week11 - Table of Contents.html |
| resource controller | RESTful controller | Controller scaffolded with index/create/store/show/edit/update/destroy methods via `--resource` flag. | laravel_with_sqlite_API_SCRIPT.docx |
| resource route | RESTful route | `Route::resource('name', Controller::class)` — maps HTTP verbs to controller methods automatically. | laravel_with_sqlite_API_SCRIPT.docx |
| findOrFail() | find-or-404, findOrDie | Eloquent method that returns the model or throws a 404 ModelNotFoundException. | laravel_with_sqlite_API_SCRIPT.docx |
| tinker | Laravel Tinker, REPL | Interactive Laravel REPL launched via `php artisan tinker`; used to test models and queries. | Week9 - Table of Contents.html |
| dd() | dump, var_dump, debug dump | "Dump and die" — Laravel debug helper that dumps a variable and halts execution. | Week11 - Table of Contents.html |
| .env | environment file, env config | Laravel's environment-specific configuration file; sets DB connection, app key, JWT secret, etc. | Week11 - Table of Contents.html |
| JWT | JSON Web Token | Stateless authentication token in three base64-encoded parts: `header.payload.signature`. | PHP_JWT.pptx slide 9 |
| reserved claims | standard claims, JWT claims, predefined claims | Standardized JWT payload fields: `iat`, `iss`, `nbf`, `exp`, `sub`, `aud`, `jti`. | PHP_JWT.pptx slide 8 |
| Bearer token | bearer, auth token, JWT header | JWT format sent in the Authorization header: `Authorization: Bearer <token>`. | laravel-jwt_SCRIPT.docx |
| JWTSubject | JWT interface, JWT contract | Laravel interface requiring `getJWTIdentifier()` and `getJWTCustomClaims()` on the User model. | laravel-jwt_SCRIPT.docx |
| php-open-source-saver/jwt-auth | tymon/jwt-auth, jwt-auth package | The JWT authentication Composer package used in this course (not the older tymon package). | laravel-jwt_SCRIPT.docx |
| Sanctum | Laravel Sanctum, API tokens | Laravel's simpler token authentication package; alternative to JWT for same-domain APIs. | Week11 - Table of Contents.html |
| Breeze | Laravel Breeze, auth scaffold, auth starter | Starter kit for session-based authentication with Blade views and Tailwind CSS. | auth-with-breeze_SQLite_SCRIPT.docx |
| middleware | Laravel middleware, HTTP middleware | HTTP layer that filters requests before they reach the controller; used for auth, locale, CORS. | laravel_with_sqlite_API_SCRIPT.docx |
| CORS | cross-origin resource sharing | Browser security policy controlling cross-origin requests; configured in `config/cors.php`. | laravel_with_sqlite_API_SCRIPT.docx |
| OpenAPI | OpenAPI Specification, OAS, Swagger Spec | The YAML/JSON specification language that defines REST API contracts. | swagger-with-laravel.pptx slide 2 |
| Swagger | OpenAPI tools, Swagger toolset | The toolset built around OpenAPI: Swagger UI, Swagger Editor, Swagger Codegen. | swagger-with-laravel.pptx slide 2 |
| l5-swagger | darkaonline/l5-swagger, Laravel Swagger | The Composer package `darkaonline/l5-swagger` that wraps Swagger tools for Laravel. | swagger-with-laravel.pptx slide 4 |
| @OA\ annotations | OA annotations, OpenAPI annotations, PHPDoc Swagger | PHPDoc comments using `#[OA\...]` attributes or `/** @OA\ */` syntax to document API endpoints. | swagger-with-laravel.pptx slide 6 |
| locale | language code, language identifier | String identifying a language/region combination used in localization (e.g., `'en'`, `'fr'`, `'de'`). | localization.pptx slide 3 |
| PHP translation file | PHP lang file, translation array | `resources/lang/{locale}/messages.php` returning an associative array; used for domain-specific text. | localization.pptx slide 4 |
| JSON translation file | JSON lang file, JSON translations | `resources/lang/{locale}.json` with key=English phrase pairs; used for simple UI strings. | localization.pptx slide 5 |
| __() | trans(), t(), i18n(), translate(), lang() | Laravel helper function for retrieving a translated string by key. | localization.pptx slide 6 |
| trans_choice() | pluralize(), ngettext(), choice() | Laravel helper for pluralized translations; uses pipe-delimited rules `{0}...|{1}...|[2,*]...`. | localization.pptx slide 7 |
| Model Context Protocol | MCP protocol, Anthropic protocol | Anthropic's open standard for connecting AI models to external tools, resources, and data sources. | laravel_mcp.pptx slide 2 |
| Tools (MCP) | MCP tools, tool functions, AI tools | In MCP: callable actions the AI can invoke (API calls, scripts, workflows). | laravel_mcp.pptx slide 4 |
| Resources (MCP) | MCP resources, data sources | In MCP: data sources exposed to the AI (files, database queries, documents). | laravel_mcp.pptx slide 4 |
| Prompts (MCP) | MCP prompts, prompt templates | In MCP: reusable LLM interaction templates. | laravel_mcp.pptx slide 4 |
| MCP composability | MCP chaining, client-server nesting | MCP property where a client can also act as a server, enabling nested/chained agent architectures. | laravel_mcp.pptx slide 10 |
| Azure Functions | Azure serverless, function app | Event-driven serverless compute service; runs TypeScript/JavaScript without managing servers. | ts-function-apps.pptx slide 2 |
| trigger (Azure) | Azure event, function event, function trigger | Event that starts an Azure Function: HTTP, Timer, Queue, Blob, or Event Hub. | ts-function-apps.pptx slide 4 |
| binding (Azure) | Azure connection, function binding, I/O binding | Declarative input/output integration for an Azure Function; no SDK boilerplate needed. | ts-function-apps.pptx slide 8 |
| function.json | functions config, Azure config | Configuration file declaring triggers and bindings for an Azure Function. | ts-function-apps.pptx slide 5 |
| startup.sh | deploy script, init script | Shell script executed at Azure App Service startup; runs migrations, sets Nginx config, caches Laravel. | resources/Fixes 2026.html |
| cURL handle | curl resource, curl object | PHP resource returned by `curl_init()`; passed to all subsequent `curl_*` functions. | cURL.pptx slide 4 |
| CURLOPT_RETURNTRANSFER | return transfer option | cURL option that stores the response in a variable rather than outputting it directly. | cURL.pptx slide 5 |
| hasMany() | has many, one-to-many | Eloquent relationship method defining that one model has multiple related models. | laravel_with_students_MySQL_SCRIPT.docx |
| belongsTo() | belongs to, inverse relationship | Eloquent relationship method defining the inverse of a hasMany — the "child" side. | laravel_with_students_MySQL_SCRIPT.docx |
| whereBelongsTo() | where belongs to, ownership filter | Eloquent shorthand to filter a query to records belonging to a given model instance. | auth-with-breeze_SQLite_SCRIPT.docx |
| Blade components | x-components, component syntax | Reusable Blade templates invoked with `<x-component-name>` syntax; `<x-slot>` for named slots. | Week11 - Table of Contents.html |
