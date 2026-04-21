# Topic map — COMP3975

Date: 2026-04-20
Sources scanned: slides/7 PPTX · notes/16 files (PDF, DOCX, HTML) · past-exams/1 DOCX · syllabus/1 PDF · resources/8 files · labs/15 ZIP + 1 PHP

## Exam meta (from syllabus + Final Exam Outline)

- Code: COMP 3975
- Name: Server-Side Web Scripting
- Date: 2026-04-23T10:30:00-07:00
  - Note: Course outline lists Week 15 as Apr 20; Final Exam Outline PDF specifies Apr 23. Use Apr 23 (instructor doc is authoritative).
- Duration: 60 minutes (10:30–11:30 AM)
- Format: 60 MCQ (60 marks) + 10 match-two-columns (10 marks) + 1 coding question (10 marks) = 80 marks total
- Room: unknown — materials do not specify room number
- Allowed: One handwritten cheat sheet (8.5×11", both sides). No calculator mentioned.
- Instructor: Medhat Elmasry (Medhat_Elmasry@bcit.ca)
- Coverage: Weeks 7–13

## Exam question counts by topic (from Final Exam Outline PDF)

| Topic area | Q count | % of 80 marks |
|---|---|---|
| Laravel (core) | 16 | ~20% |
| Laravel database | 15 | ~19% |
| Token Auth & REST | 9 | ~11% |
| Localization | 6 | ~7.5% |
| Artisan/Composer | 5 | ~6% |
| Static Web Apps | 5 | ~6% |
| Swagger | 5 | ~6% |
| MCP | 5 | ~6% |
| Laravel Session Auth | 3 | ~4% |
| cURL | 1 | ~1% |
| Laravel Deployment | 1 | ~1% |
| Coding question | 1 | 10 marks |

---

## Modules (6)

### Module 1: Laravel Foundations — laravel-foundations

#### Topic: laravel-mvc-blade — laravel-mvc-blade
- Weight: ~12% of final (part of 16-Q Laravel core block)
- Difficulty: mid
- God-node status: yes — MVC is referenced by nearly every other topic
- Tags: [laravel, mvc, blade, views, templating, xss]
- Source coverage: intro_to_laravel.pptx (29 slides, heavy Blade focus); intro_to_laravel_SCRIPT.docx; TIDBITS-components_config_db_SCRIPT.docx; Week9 ToC
- Notes: MVC repeated across 4 slides (3,4,5,12). Blade dominates 18/29 slides. XSS: `{{ }}` vs `{!! !!}` gets dedicated demo. @-directives (@extends, @section, @yield, @include, @if, @foreach) are the core syntax pattern. Blade components (x-slot) introduced in Week 11 as replacement for @yield/@section.

#### Topic: artisan-composer — artisan-composer
- Weight: ~6% of final (5 Qs Artisan/Composer)
- Difficulty: low
- God-node status: no
- Tags: [artisan, composer, cli, project-setup]
- Source coverage: intro_to_laravel.pptx; notes scripts; all week TOCs
- Notes: Artisan commands appear in every week. Key command patterns: `php artisan make:model X -m`, `php artisan make:controller X --resource`, `php artisan migrate`, `php artisan serve --port=8888`. Composer: `composer create-project laravel/laravel`, `composer require`. Common wrong-answer trap: `migration` vs `make:migration` (colon syntax tested in past-exam Q6).

#### Topic: laravel-routing-controllers — laravel-routing-controllers
- Weight: ~4% of final (within Laravel core 16 Qs)
- Difficulty: mid
- God-node status: no
- Tags: [laravel, routing, controllers, resource-routes, middleware]
- Source coverage: laravel_with_sqlite_API_SCRIPT.docx; Week10 ToC; labs (Week10_laravel-sqlite-api zip)
- Notes: Resource routes via `Route::resource()`. API routes in routes/api.php vs web routes in routes/web.php. Middleware for auth protection. Route caching: `php artisan route:cache / route:clear`.

---

### Module 2: Laravel Database — laravel-database

#### Topic: eloquent-orm — eloquent-orm
- Weight: ~10% of final (major part of 15-Q database block)
- Difficulty: high
- God-node status: yes — used in every other database, API, and auth topic
- Tags: [eloquent, orm, models, crud, laravel, database]
- Source coverage: laravel_with_students_MySQL_SCRIPT.docx; laravel_with_sqlite_API_SCRIPT.docx; TIDBITS-components_config_db_SCRIPT.docx; intro_to_laravel_SCRIPT.docx; Week9/10 ToCs; mysql-laravel-students lab
- Notes: Preferred pattern per professor (vs Query Builder vs Raw SQL). Key methods: `Model::all()`, `Model::where()`, `Model::find()`, `Model::findOrFail()`, `Model::create()`. Mass assignment protection: `$fillable` array required. Auth facade: `Auth::user()`, `Auth::id()`. Past-exam Q9 tested `User::all()` — distractors included `User::get()`, `User::all()->get()`.

#### Topic: query-builder-and-raw-sql — query-builder-and-raw-sql
- Weight: ~4% of final (part of 15-Q database block)
- Difficulty: mid
- God-node status: no
- Tags: [laravel, query-builder, raw-sql, database]
- Source coverage: TIDBITS-components_config_db_SCRIPT.docx; Week11 ToC
- Notes: DB::table()->select()->where() for Query Builder. DB::select() for raw SQL. Professor explicitly ranks: Eloquent > Query Builder > Raw SQL (preferred order).

#### Topic: migrations-and-seeders — migrations-and-seeders
- Weight: ~5% of final (part of 15-Q database block)
- Difficulty: low-mid
- God-node status: no
- Tags: [laravel, migrations, seeders, database-schema]
- Source coverage: All Laravel SCRIPT.docx files; Week9-11 ToCs; labs (mysql-laravel-students)
- Notes: Commands: `php artisan make:migration`, `php artisan migrate`, `php artisan migrate:refresh --seed`. Seeders for sample data. `$table->...` schema builder in migration up() method.

#### Topic: model-relationships — model-relationships
- Weight: ~5% of final (part of 15-Q database block)
- Difficulty: high
- God-node status: no
- Tags: [eloquent, relationships, hasMany, belongsTo, laravel]
- Source coverage: auth-with-breeze_SQLite_SCRIPT.docx; laravel_with_students_MySQL_SCRIPT.docx; Week11 ToC
- Notes: hasMany() / belongsTo() for one-to-many. whereBelongsTo() shorthand. Auth::user()->orgs()->latest()->get() pattern. $org->user->is(Auth::user()) for ownership checks.

---

### Module 3: API and Authentication — api-and-auth

#### Topic: rest-api-design — rest-api-design
- Weight: ~6% of final (part of 9-Q Token Auth & REST block)
- Difficulty: mid
- God-node status: no
- Tags: [rest, api, json, http-methods, laravel, routes]
- Source coverage: laravel_with_sqlite_API_SCRIPT.docx; Week10 ToC; resources/API.http; labs (Week10_laravel-sqlite-api)
- Notes: Route::resource() for RESTful CRUD. Validation via request()->validate(). Error handling: findOrFail() returns 404. CORS: enabled by default in Laravel; config/cors.php for credential-based requests. JSON responses via return response()->json(). $fillable required for mass assignment.

#### Topic: jwt-authentication — jwt-authentication
- Weight: ~5% of final (part of 9-Q Token Auth & REST block)
- Difficulty: high
- God-node status: no
- Tags: [jwt, authentication, bearer-token, laravel, api]
- Source coverage: PHP_JWT.pptx (11 slides); laravel-jwt_SCRIPT.docx; Week10 ToC; lab (20260311_laravel-sqlite-api-jwt)
- Notes: Package: php-open-source-saver/jwt-auth. Setup: `php artisan jwt:secret`. Auth guard config in config/auth.php (driver: 'jwt'). User model must implement JWTSubject: getJWTIdentifier(), getJWTCustomClaims(). AuthController methods: login, register, logout, refresh, user. Bearer token in Authorization header. JWT structure: header.payload.signature (all base64). Reserved claims: iat, iss, nbf, exp, sub, aud, jti. Real-world 7-step workflow diagram in PHP_JWT.pptx slide 10 is examinable. Token tampering: signature validation prevents it.

#### Topic: session-auth-breeze — session-auth-breeze
- Weight: ~4% of final (3-Q Laravel Session Auth block)
- Difficulty: mid
- God-node status: no
- Tags: [authentication, session, breeze, laravel, tailwind]
- Source coverage: auth-with-breeze_SQLite_SCRIPT.docx; Week11 ToC; lab (breeze-session-auth-sqlite)
- Notes: Package: `composer require laravel/breeze --dev` → `php artisan breeze:install`. Built-in routes: register, login, logout, password reset. Uses Tailwind CSS. Auth middleware: 'auth', 'verified'. Sanctum as alternative token auth (createToken()).

---

### Module 4: Swagger and cURL — swagger-and-curl

#### Topic: swagger-openapi — swagger-openapi
- Weight: ~6% of final (5-Q Swagger block)
- Difficulty: high
- God-node status: no
- Tags: [swagger, openapi, l5-swagger, api-documentation, laravel]
- Source coverage: swagger-with-laravel.pptx (10 slides); Laravel_L5Swagger_SCRIPT_2026.docx; Week12 ToC; lab (20260402_laravel-sqlite-api-swagger)
- Notes: Distinction: OpenAPI = specification language; Swagger = toolset (must know this). Package: darkaonline/l5-swagger. Install: `composer require darkaonline/l5-swagger -W`. Publish: `php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"`. Generate: `php artisan l5-swagger:generate`. URL: /api/documentation. Annotations use PHPDoc with #[OA\...] or /** @OA\... */ format. Key annotations: @OA\Info, @OA\Get/Post/Put/Delete, @OA\Response, @OA\Schema, @OA\Parameter. Production: L5_SWAGGER_GENERATE_ALWAYS=true, URL::forceScheme('https') in AppServiceProvider.

#### Topic: curl-http-client — curl-http-client
- Weight: ~1% of final (1 Q cURL)
- Difficulty: low
- God-node status: no
- Tags: [curl, http, php, rest-client]
- Source coverage: cURL.pptx (6 slides); cnn.php; lab (cURL_REST_example)
- Notes: Four-step pattern: curl_init() → curl_setopt() → curl_exec() → curl_close(). Key options: CURLOPT_RETURNTRANSFER (store response), CURLOPT_URL, CURLOPT_HTTPHEADER. CURLOPT_SSL_VERIFYHOST=0 + CURLOPT_SSL_VERIFYPEER=0 for dev only. Error: `if ($response === false) { curl_error($handle) }`.

---

### Module 5: Localization — localization-module

#### Topic: laravel-localization — laravel-localization
- Weight: ~7.5% of final (6-Q Localization block)
- Difficulty: mid
- God-node status: no
- Tags: [localization, i18n, laravel, translation, middleware]
- Source coverage: localization.pptx (11 slides); laravel-localization.docx; Week13 ToC; lab (20260409_laravel-localized)
- Notes: Directory: resources/lang/{locale}/ (past-exam Q1 tested this — distractors: resources/views/lang, storage/lang, app/lang). Two file types: PHP arrays (domain text) vs JSON (UI strings, key=English phrase). Helper: `__('messages.welcome')` or `__('text')`. Pluralization: `trans_choice()` with pipe syntax `{0}...|{1}...|[2,*] :count`. Setting locale: App::setLocale() at runtime; default in config/app.php. Middleware pattern for SetLocale. Route prefix: Route::prefix('{locale}'). Session: Session::put('locale', $value). Past-exam Q2 tested `{{ __('text') }}` — distractors were translate(), lang(), i18n(), t().

---

### Module 6: Cloud Deployment — cloud-deployment

#### Topic: azure-static-web-apps — azure-static-web-apps
- Weight: ~6% of final (5-Q Static Web Apps block)
- Difficulty: mid
- God-node status: no
- Tags: [azure, serverless, typescript, static-web-apps, deployment]
- Source coverage: ts-function-apps.pptx (10 slides); static-web-apps-SCRIPT.docx; Week7 ToC; labs (az-func-app-ts, ts-static-web-app)
- Notes: Azure Static Web Apps = serverless hosting for SPAs + Functions backend. Supported frameworks: Vue, Svelte, React, Angular. Triggers: HTTP, Timer, Queue, Blob. Bindings: input (read from storage/DB), output (write to queues). TypeScript function signature: AzureFunction type, Context + HttpRequest params, return via context.res. Deployment: GitHub Actions auto-generated; output_location and app_build_command in .yml are common error points. Environment vars in Azure portal.

#### Topic: azure-laravel-deployment — azure-laravel-deployment
- Weight: ~1% of final (1 Q Laravel Deployment block)
- Difficulty: low
- God-node status: no
- Tags: [azure, deployment, laravel, github-actions, nginx]
- Source coverage: resources/Steps to Azure Deployment.html; resources/Fixes 2026.html; resources/deploy laravel backend & frontend apps.html; Week12 ToC
- Notes: startup.sh script for migrations + seeders (--force), Nginx config copy, Laravel config/route/view caching. Common fix: pull repo after Azure creates .yml, edit for build settings, push again. Monorepo pattern: laravel-backend/ + react-frontend/ with two separate Azure deployments.

---

### Module 7: MCP — mcp-module

#### Topic: mcp-protocol — mcp-protocol
- Weight: ~4% of final (part of 5-Q MCP block)
- Difficulty: mid
- God-node status: no
- Tags: [mcp, model-context-protocol, ai, tools, resources, prompts]
- Source coverage: laravel_mcp.pptx (12 slides); resources/mcp_client.php (zip)
- Notes: MCP = Model Context Protocol, open standard by Anthropic. Three components: Tools (executable actions), Resources (data sources), Prompts (reusable LLM templates). MCP client consumes server; MCP server exposes tools/resources/prompts. Composability: client can also be server (chaining). Past-exam Q3 tested Tools definition — distractors: UI components, DB tables, translation files, security tokens. Past-exam Q4 tested creator (Anthropic) — distractors: OpenAI, Meta, Google, Microsoft.

#### Topic: laravel-mcp-implementation — laravel-mcp-implementation
- Weight: ~2% of final (part of 5-Q MCP block)
- Difficulty: mid
- God-node status: no
- Tags: [mcp, laravel, artisan, ai-integration]
- Source coverage: laravel_mcp.pptx slides 11-12; Week10/13 ToCs
- Notes: Package: `composer require laravel/mcp`. Commands: `php artisan vendor:publish --tag=ai-routes`, `php artisan make:mcp-server TodoServer`, `php artisan make:mcp-tool AddTodoTool`, `php artisan mcp:inspector mcp/todo`. Config: mcp.json in VS Code with server URL (type: "http").

---

## Ranked priority list (hardest × most-tested at top)

1. **laravel-database/eloquent-orm** — weight ~10% × HIGH → rank 1
2. **laravel-foundations/laravel-mvc-blade** — weight ~12% × MID → rank 2
3. **api-and-auth/jwt-authentication** — weight ~5% × HIGH → rank 3
4. **laravel-database/model-relationships** — weight ~5% × HIGH → rank 4
5. **swagger-and-curl/swagger-openapi** — weight ~6% × HIGH → rank 5
6. **localization-module/laravel-localization** — weight ~7.5% × MID → rank 6
7. **api-and-auth/rest-api-design** — weight ~6% × MID → rank 7
8. **mcp-module/mcp-protocol** — weight ~4% × MID → rank 8
9. **cloud-deployment/azure-static-web-apps** — weight ~6% × MID → rank 9
10. **laravel-foundations/artisan-composer** — weight ~6% × LOW → rank 10
11. **laravel-database/migrations-and-seeders** — weight ~5% × LOW-MID → rank 11
12. **api-and-auth/session-auth-breeze** — weight ~4% × MID → rank 12
13. **laravel-foundations/laravel-routing-controllers** — weight ~4% × MID → rank 13
14. **laravel-mcp-implementation** — weight ~2% × MID → rank 14
15. **swagger-and-curl/curl-http-client** — weight ~1% × LOW → rank 15
16. **cloud-deployment/azure-laravel-deployment** — weight ~1% × LOW → rank 16
17. **laravel-database/query-builder-and-raw-sql** — weight ~4% × MID → rank 17

## Diagram inventory (required code-practice targets)

**NONE** — final-practice.docx contains 9 text-only MCQ questions with no embedded diagrams. No diagram-based code-practice required per STANDARDS §Per-course required artifacts.

However, code-practice files ARE required for procedural topics:
- JWT authentication workflow (4+ steps)
- cURL 4-step pattern
- Swagger annotation syntax
- Eloquent CRUD patterns
- Localization setup

## Terminology notes (professor-specific)

- **@-directives** = professor's term for Blade syntax (@extends, @section, @yield, @include)
- **Artisan** = always "php artisan" prefix; professor uses `--port=8888` consistently
- **$fillable array** = required for mass assignment (professor emphasizes this as a protection mechanism)
- **OpenAPI vs Swagger** = professor explicitly distinguishes (OpenAPI=spec, Swagger=tools)
- **JWT reserved claims** = professor's term for standardized JWT claim names (iat/iss/nbf/exp/sub/aud/jti)
- **Tinker** = professor uses this for interactive ORM testing
- **dd()** = "dump and die" for debugging
- Uses **`php-open-source-saver/jwt-auth`** (not tymon/jwt-auth) — different package, must know
