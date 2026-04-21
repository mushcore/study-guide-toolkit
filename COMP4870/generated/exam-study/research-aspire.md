# ASP.NET Aspire — COMP4870 Exam Study Guide
**Worth: 5 marks on final exam**  
**Focus: Recognition-level knowledge for partial credit**

---

## 1. TOPIC SUMMARIES

### What is ASP.NET Aspire?
Aspire is a **cloud-native orchestration framework** for .NET that simplifies building distributed, containerized applications. It provides a structured way to:
- Define, configure, and orchestrate microservices locally during development
- Manage inter-service communication and dependencies
- Integrate observability (OpenTelemetry) automatically
- Handle service discovery, resilience, and health checks out of the box

**Key benefit:** Aspire lets you develop locally like you'd run in production, without manually orchestrating containers.

### The Three Core Project Types

#### 1. **AppHost Project** (the orchestrator)
- **Template:** `dotnet new aspire --force`
- **Entry point:** `Program.cs` creates a `DistributedApplication`
- **Responsibility:** Declares all services, databases, and inter-service references
- **Runtime:** When you run `dotnet watch` or `dotnet run --project AppHost`, Aspire spins up all defined resources
- **NOT a class** — it's a **project template** (a type of .NET project)

```csharp
// Minimal AppHost structure
var builder = DistributedApplication.CreateBuilder(args);
var backend = builder.AddProject<Projects.StudentsMinimalApi>("backend");
var frontend = builder.AddProject<Projects.BlazorApp>("frontend")
    .WithReference(backend);
builder.Build().Run();
```

#### 2. **ServiceDefaults Project** (the shared config)
- Provides common setup for all microservices
- Implements `AddServiceDefaults()` extension method
- Configures:
  - **Service Discovery:** How services find each other (`AddServiceDiscovery()`)
  - **OpenTelemetry:** Automatic tracing, metrics, logs
  - **Health Checks:** Liveness (`/alive`) and readiness (`/health`) endpoints
  - **Resilience:** Standard retry/timeout policies via `AddStandardResilienceHandler()`

```csharp
// Typical service setup (in any microservice)
builder.AddServiceDefaults();
```

#### 3. **Resource Projects** (the actual services)
- Any standard .NET project (ASP.NET Core, Minimal API, Blazor, etc.)
- Must reference `ServiceDefaults` and call `builder.AddServiceDefaults()`
- Connected to AppHost via `builder.AddProject<Projects.MyService>("name")`

### Aspire Dashboard
- **URL:** Typically `http://localhost:15888` (or shown in terminal)
- **Purpose:** Web UI for observability
- **Displays:**
  - All running services and their status
  - Real-time logs, traces, and metrics
  - Service dependencies and call graphs
  - Health check status

---

## 2. KEY CONCEPTS & API

### IDistributedApplicationBuilder
- The main builder object returned by `DistributedApplication.CreateBuilder(args)`
- Chains methods to add services, databases, and configure orchestration

### AddProject<T>(name)
```csharp
var api = builder.AddProject<Projects.WebApiFIFA>("backend");
```
- Registers a .NET project as a named service in the distributed app
- `T` is the project name from your namespace (auto-generated)
- `name` is the service name used for discovery (`http://backend/`)

### WithReference(resource)
```csharp
builder.AddProject<Projects.BlazorFIFA>("frontend")
    .WithReference(api);
```
- Makes one service aware of another
- Injects configuration so services can call each other by name
- Creates network dependency (gRPC or HTTP)

### WaitFor(resource)
```csharp
.WithReference(api)
.WaitFor(api)
```
- Ensures AppHost waits for a dependency to be healthy before starting the dependent service
- Prevents "service not found" errors during startup

### WithEnvironment(key, value)
```csharp
.WithEnvironment("ParentCompany", builder.Configuration["Company"])
```
- Passes environment variables from AppHost to a service
- Used for configuration not stored in appsettings.json

### AddServiceDiscovery()
- Enables services to resolve other services by name
- Uses URLs like `http://backend:80` (service name instead of IP/localhost)
- Automatically injected via `AddServiceDefaults()`

### AddSqlServer(name) / AddDatabase(name)
```csharp
var sqlServerDb = builder.AddSqlServer("sql")
    .AddDatabase("sqldata");
var api = builder.AddProject<Projects.Api>("api")
    .WithReference(sqlServerDb);
```
- Spins up a SQL Server container resource
- `.AddDatabase("name")` creates a named database
- Service gets connection string automatically via environment variable (`ConnectionStrings__sqldata`)

### AddRedis(name)
```csharp
var cache = builder.AddRedis("cache");
```
- Adds a Redis container resource for caching
- Service references it via `WithReference(cache)`

### AddPostgres(name)
- Similar to `AddSqlServer()` but for PostgreSQL containers

### OpenTelemetry Integration
- Automatically configured in `ServiceDefaults.Extensions`
- Exports traces, metrics, and logs to Aspire Dashboard
- No code changes needed in individual services (works transparently)

---

## 3. CODE PATTERNS (VERBATIM FROM COURSE MATERIALS)

### AppHost Program.cs Pattern
```csharp
var builder = DistributedApplication.CreateBuilder(args);
var cache = builder.AddRedis("cache");
var api = builder.AddProject<Projects.Api>("api").WithReference(cache);
builder.AddProject<Projects.Web>("web").WithReference(api);
builder.Build().Run();
```

### With SQL Server & Migrations
```csharp
// AppHost Program.cs
var sqlServerDb = builder.AddSqlServer("sql")
    .AddDatabase("sqldata");
var api = builder.AddProject<Projects.WebApiFIFA>("backend")
    .WithReference(sqlServerDb);

// In WebApiFIFA/Program.cs
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
// Connection string injected automatically
```

### Service References Pattern
```csharp
// In BlazorFIFA, instead of hardcoded "localhost:5000"
public const string ApiBaseUrl = "http://backend/";
// AppHost defined: .AddProject<Projects.WebApiFIFA>("backend")
// Service discovery resolves "http://backend" to actual address
```

### ServiceDefaults AddServiceDefaults() Extension
```csharp
public static TBuilder AddServiceDefaults<TBuilder>(this TBuilder builder) 
    where TBuilder : IHostApplicationBuilder
{
    builder.ConfigureOpenTelemetry();
    builder.AddDefaultHealthChecks();
    builder.Services.AddServiceDiscovery();
    builder.Services.ConfigureHttpClientDefaults(http =>
    {
        http.AddStandardResilienceHandler();
        http.AddServiceDiscovery();
    });
    return builder;
}
```

### Health Check Endpoints
```csharp
// Automatic in ServiceDefaults
// /health — readiness (all checks must pass)
// /alive — liveness (only "live" tagged checks)
```

---

## 4. SERVICE DISCOVERY IN DEPTH

### How It Works
1. **AppHost declares services with names:**
   ```csharp
   builder.AddProject<Projects.WebApi>("backend");
   ```

2. **Service references are established:**
   ```csharp
   builder.AddProject<Projects.Frontend>("frontend")
       .WithReference(backend);  // injects environment var
   ```

3. **ServiceDefaults injects configuration:**
   - `AddServiceDiscovery()` enables `https+http://` protocol handler
   - HttpClientFactory uses this protocol to resolve by name

4. **At runtime, URLs are resolved:**
   - `http://backend/api/users` → actual container IP + port
   - No hardcoded localhost or environment variables needed

### URL Scheme: "https+http://"
- When `AddServiceDiscovery()` is active, clients use this scheme
- Aspire intercepts and resolves service name to actual address
- Enables seamless local → cloud transitions

---

## 5. CONNECTION STRINGS VIA WithReference

### Dual Connection String Pattern
When a service references a SQL database:

```csharp
var sqlDb = builder.AddSqlServer("sql").AddDatabase("sqldata");
var api = builder.AddProject<Projects.Api>("api")
    .WithReference(sqlDb);
```

**In the Api service, two connection strings are available:**
1. Via environment variable: `ConnectionStrings__sqldata`
2. Via configuration: `Configuration.GetConnectionString("sqldata")`

**When Aspire handles it:**
```csharp
// Api/Program.cs
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
// Aspire reads ConnectionStrings__sqldata and wires it automatically
```

**Without Aspire (fallback):**
```csharp
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__blogdb");
if (connectionString == null) {
    // Fallback to appsettings.json for non-Aspire environments
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}
```

---

## 6. ASPIRE CLI & COMMANDS

### Template Installation
```bash
dotnet new install Aspire.ProjectTemplates --force
```

### Create Aspire Project Structure
```bash
dotnet new aspire --force
# Creates AppHost and ServiceDefaults projects
```

### Add Existing Projects to Aspire
```bash
cd SoccerFIFA
dotnet sln add ./BlazorFIFA/BlazorFIFA.csproj
dotnet sln add ./WebApiFIFA/WebApiFIFA.csproj
```

### Create Project References
```bash
# AppHost must reference the service projects
dotnet add ./SoccerFIFA.AppHost/SoccerFIFA.AppHost.csproj reference ./BlazorFIFA/BlazorFIFA.csproj
dotnet add ./BlazorFIFA/BlazorFIFA.csproj reference ./SoccerFIFA.ServiceDefaults/SoccerFIFA.ServiceDefaults.csproj
```

### Run the Application
```bash
# From AppHost directory
dotnet watch
# or
dotnet run --project AppHost
```

### Add NuGet Packages
```bash
# For SQL Server integration
dotnet add package Aspire.Microsoft.EntityFrameworkCore.SqlServer

# For hosting SQL Server
dotnet add package Aspire.Hosting.SqlServer
```

### Dashboard Access
- URL shown in terminal output (e.g., `http://localhost:15888`)
- Contains live logs, metrics, traces

---

## 7. FLASHCARDS (SuperMemo-style, 12 cards)

### Card 1
**Q:** What does `DistributedApplication.CreateBuilder(args)` return?  
**A:** An `IDistributedApplicationBuilder` that you use to register services, databases, and orchestration rules.

### Card 2
**Q:** What is the ServiceDefaults project for?  
**A:** A shared project that every microservice references to get common configuration: service discovery, OpenTelemetry, health checks, and resilience.

### Card 3
**Q:** Name the two health check endpoints ServiceDefaults provides.  
**A:** `/health` (readiness—all checks must pass) and `/alive` (liveness—only "live" tagged checks).

### Card 4
**Q:** What does `.WithReference(serviceOrDb)` do?  
**A:** Makes one service aware of another service or database, injects configuration so it can call or connect to the referenced resource.

### Card 5
**Q:** How do services discover each other by name in Aspire?  
**A:** Via `AddServiceDiscovery()` in ServiceDefaults; services use URLs like `http://backend/api/path` and Aspire resolves the name to the actual address.

### Card 6
**Q:** AppHost is a (class / project template / interface)?  
**A:** Project template. It's created by `dotnet new aspire --force` and orchestrates all services.

### Card 7
**Q:** What does `builder.AddSqlServer("sql").AddDatabase("sqldata")` do?  
**A:** Spins up a SQL Server container and creates a database named "sqldata"; services reference it via `.WithReference()` and get a connection string automatically.

### Card 8
**Q:** What method enables a service to use OpenTelemetry and service discovery automatically?  
**A:** `builder.AddServiceDefaults()` (called in the service's Program.cs).

### Card 9
**Q:** In AppHost, what does `.WaitFor(service)` do?  
**A:** Makes Aspire wait for a dependency to be healthy before starting the dependent service.

### Card 10
**Q:** How do you pass an environment variable from AppHost to a service?  
**A:** Use `.WithEnvironment("VarName", value)` on the project reference.

### Card 11
**Q:** What is the Aspire Dashboard?  
**A:** A web UI (usually `localhost:15888`) showing running services, logs, traces, metrics, and health status in real-time.

### Card 12
**Q:** When you see `https+http://` in an Aspire URL, what does it mean?  
**A:** It's a protocol handled by service discovery; Aspire resolves the service name to the actual container address at runtime.

---

## 8. EXAM TRAPS & CLARIFICATIONS

### TRAP 1: AppHost is NOT a Class
**Wrong:** "The AppHost class orchestrates services."  
**Correct:** AppHost is a **project template** (type of .csproj). Inside, Program.cs creates a `DistributedApplication` object.

### TRAP 2: ServiceDefaults ≠ AppHost
**Wrong:** "ServiceDefaults is where you add services."  
**Correct:** 
- **ServiceDefaults** = shared configuration library (AddServiceDefaults() method)
- **AppHost** = orchestration (AddProject, AddSqlServer, WithReference, etc.)

### TRAP 3: AddServiceDefaults() is Called in SERVICES, Not AppHost
**Wrong:** Putting `builder.AddServiceDefaults()` in AppHost Program.cs.  
**Correct:** Call it in each service's Program.cs (e.g., Api/Program.cs, Frontend/Program.cs).

### TRAP 4: Connection Strings Are Injected Automatically
**Wrong:** Hardcoding connection strings in appsettings.json when using Aspire.  
**Correct:** When you do `builder.AddSqlServerDbContext<DbContext>("sqldata")`, Aspire injects the connection string from the referenced database resource.

### TRAP 5: Aspire vs. Orleans vs. Dapr
| Feature | Aspire | Orleans | Dapr |
|---------|--------|---------|------|
| **Purpose** | Local orchestration + observability | Distributed actor framework | Runtime abstraction layer |
| **Use Case** | Dev-to-prod parity | Stateful microservices | Platform-agnostic microservices |
| **Orchestration** | Via AppHost | Built-in | External runtime |

---

## 9. PRACTICE MCQ (Answer key at bottom)

### Q1: Multiple Choice
You have an Aspire AppHost. You add:
```csharp
var db = builder.AddSqlServer("sql").AddDatabase("mydb");
var api = builder.AddProject<Projects.StudentApi>("api")
    .WithReference(db);
```
In StudentApi/Program.cs, how should the API connect to the database?

**A)** `var conn = builder.Configuration.GetConnectionString("mydb");`  
**B)** `builder.AddSqlServerDbContext<SchoolContext>("mydb");`  
**C)** Both A and B work (Aspire provides the connection string automatically)  
**D)** Neither; you must manually wire the connection string

**Correct: B** (or C if Aspire is handling injection—B is the explicit Aspire pattern)

---

### Q2: True/False
"AppHost.cs runs inside every microservice to discover services."

**Answer: FALSE**  
AppHost is ONE project that **orchestrates all services**. Each service just needs to call `builder.AddServiceDefaults()` and can use service discovery.

---

### Q3: Multiple Choice
What is the purpose of `.WaitFor(backend)` in this code?
```csharp
builder.AddProject<Projects.Frontend>("frontend")
    .WithReference(backend)
    .WaitFor(backend);
```

**A)** Blocks the frontend from calling the backend for 5 seconds  
**B)** Ensures the backend is healthy before starting the frontend  
**C)** Prevents the backend from crashing  
**D)** Enables automatic retry logic for all frontend calls

**Correct: B**

---

### Q4: Multiple Choice
ServiceDefaults configures `AddServiceDiscovery()`. What does this enable?

**A)** Services can find each other by name (e.g., `http://backend/api/users`)  
**B)** Automatic OpenTelemetry export to the dashboard  
**C)** Connection string injection from databases  
**D)** Health check endpoints

**Correct: A** (B, C, D are also configured by ServiceDefaults but NOT by AddServiceDiscovery specifically)

---

### Q5: Short Answer
Name the two health check endpoints and what each checks for.

**Answer:**
- `/health` — Readiness check; all registered health checks must pass
- `/alive` — Liveness check; only checks tagged with "live" must pass

---

## 10. COMMAND REFERENCE (Quick lookup)

| Task | Command |
|------|---------|
| Install Aspire templates | `dotnet new install Aspire.ProjectTemplates --force` |
| Create new Aspire project | `dotnet new aspire --force` |
| Add service reference (AppHost → Service) | `dotnet add ./AppHost.csproj reference ./Service.csproj` |
| Add ServiceDefaults reference | `dotnet add ./Service.csproj reference ./ServiceDefaults.csproj` |
| Run AppHost | `dotnet watch` (from AppHost dir) or `dotnet run --project AppHost` |
| Add SQL Server hosting | `dotnet add package Aspire.Hosting.SqlServer` |
| Add EF + SQL Server Aspire support | `dotnet add package Aspire.Microsoft.EntityFrameworkCore.SqlServer` |
| Add Redis | `builder.AddRedis("name")` |
| Add PostgreSQL | `builder.AddPostgres("name")` |

---

## 11. EXAM-READY CHEAT SHEET

**Remember for 5 marks:**

1. **Aspire = Orchestration Framework** for local microservice development with built-in observability
2. **Three Project Types:**
   - AppHost (orchestrator)
   - ServiceDefaults (shared config)
   - Resource Projects (actual services)
3. **Key Methods:**
   - `AddProject<T>(name)` → Register service
   - `WithReference()` → Create dependency
   - `AddServiceDefaults()` → Enable discovery + telemetry
   - `AddSqlServer().AddDatabase()` → Add DB container
4. **Service Discovery:** Services call each other via `http://serviceName`
5. **Dashboard:** `http://localhost:15888` (or shown in terminal)
6. **Common Traps:** AppHost is not a class; AddServiceDefaults() goes in services, not AppHost

---

## 12. FULL WORKED EXAMPLE: SoccerFIFA from Course

### Setup Steps (in order)
```bash
# 1. Create template
dotnet new aspire --force

# 2. Add existing projects
dotnet sln add ./BlazorFIFA/BlazorFIFA.csproj
dotnet sln add ./WebApiFIFA/WebApiFIFA.csproj

# 3. Create references
dotnet add ./SoccerFIFA.AppHost/SoccerFIFA.AppHost.csproj reference ./BlazorFIFA/BlazorFIFA.csproj
dotnet add ./SoccerFIFA.AppHost/SoccerFIFA.AppHost.csproj reference ./WebApiFIFA/WebApiFIFA.csproj

# 4. Add ServiceDefaults to services
dotnet add ./BlazorFIFA/BlazorFIFA.csproj reference ./SoccerFIFA.ServiceDefaults/SoccerFIFA.ServiceDefaults.csproj
dotnet add ./WebApiFIFA/WebApiFIFA.csproj reference ./SoccerFIFA.ServiceDefaults/SoccerFIFA.ServiceDefaults.csproj
```

### AppHost/Program.cs
```csharp
var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.WebApiFIFA>("backend");
builder.AddProject<Projects.BlazorFIFA>("frontend")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

### Each Service's Program.cs
```csharp
builder.AddServiceDefaults();
// ... other configuration
```

### Use Discovery
```csharp
// In BlazorFIFA/Constants.cs
public const string ApiBaseUrl = "http://backend/";
// Service discovery resolves "backend" to actual WebApiFIFA address
```

### Add SQL Server (Optional)
```csharp
// In AppHost
var sqlServerDb = builder.AddSqlServer("sql").AddDatabase("sqldata");
var api = builder.AddProject<Projects.WebApiFIFA>("backend")
    .WithReference(sqlServerDb);

// In WebApiFIFA/Program.cs
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
```

### Run
```bash
cd SoccerFIFA.AppHost
dotnet watch
# Dashboard opens at http://localhost:15888
```

---

## ANSWER KEY

**Q1:** B (or C)  
**Q2:** FALSE  
**Q3:** B  
**Q4:** A  
**Q5:** `/health` (readiness, all checks), `/alive` (liveness, "live" tagged only)

---

**Last Updated:** 2026-04-18  
**Source:** Course materials (aspire_SCRIPT.md, code examples, gRPC lab)
