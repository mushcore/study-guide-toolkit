# W09 gRPC Lab Solution

## How This Solution Completes the Lab

The lab requires creating a **Server-Side Blazor application** that consumes the existing gRPC `StudentRemote` service, with full CRUD operations (List, Add, Update, Delete), running as a **.NET Aspire orchestration**.

### What Was Created

#### 1. BlazorGrpcClient (Server-Side Blazor Frontend)

- **`Program.cs`** - Registers Razor components with interactive server mode. Uses `AddGrpcClient<StudentRemote.StudentRemoteClient>()` with `Grpc.Net.ClientFactory` for dependency injection. The gRPC address is `http://backend` which uses Aspire service discovery to locate the gRPC server.
- **`Protos/students.proto`** - Copy of the server's proto file with `csharp_namespace` set to `BlazorGrpcClient` and `GrpcServices="Client"` in the csproj.
- **`Components/Pages/Students.razor`** - The main page with `@rendermode InteractiveServer` and `@inject StudentRemote.StudentRemoteClient _grpcClient`. Implements all four CRUD operations:
  - **List**: Calls `RetrieveAllStudentsAsync()` and displays students in a table.
  - **Add**: Form fields for FirstName, LastName, School. Calls `InsertStudentAsync()`.
  - **Update**: Inline editing in the table row. Calls `UpdateStudentAsync()`.
  - **Delete**: Delete button per row. Calls `DeleteStudentAsync()`.
- Status messages are displayed after each operation showing success/failure from the gRPC reply.

#### 2. GrpcBasics.ServiceDefaults (Aspire Shared Project)

- Standard Aspire service defaults providing OpenTelemetry, service discovery, health checks, and HTTP resilience.
- Referenced by both the gRPC server and the Blazor client.

#### 3. GrpcBasics.AppHost (Aspire Orchestrator)

- **`AppHost.cs`** - Registers the gRPC server as `"backend"` and the Blazor client as `"frontend"`. The frontend references the backend and waits for it to start.

#### 4. GrpcStudentsServer (Updated)

- Added `builder.AddServiceDefaults()` to `Program.cs`.
- Added project reference to `GrpcBasics.ServiceDefaults`.

### Architecture

```
GrpcBasics.AppHost (Aspire Orchestrator)
    |
    ├── GrpcStudentsServer ("backend")
    |       - gRPC service with EF Core + SQLite
    |       - Serves StudentRemote service on HTTP/2
    |
    └── BlazorGrpcClient ("frontend")
            - Server-Side Blazor app
            - Consumes gRPC service via DI + service discovery
            - Full CRUD UI for students
```

### Key Patterns Used (from W09 Lectures)

| Concept | Implementation |
|---------|---------------|
| gRPC Client DI | `builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(...)` |
| Aspire Service Discovery | `options.Address = new Uri("http://backend")` |
| Blazor Render Mode | `@rendermode InteractiveServer` |
| Client Injection | `@inject StudentRemote.StudentRemoteClient _grpcClient` |
| Aspire AppHost | `builder.AddProject<Projects.GrpcStudentsServer>("backend")` |
| ServiceDefaults | `builder.AddServiceDefaults()` in both server and client |

---

## How to Run / Test

### Prerequisites

- .NET 10 SDK
- .NET Aspire workload installed (`dotnet workload install aspire`)

### Running with Aspire (Recommended)

1. Open a terminal in the `GrpcBasics` folder:

   ```bash
   cd "Labs/W09 gRPC/GrpcBasics"
   ```

2. Run the Aspire AppHost:

   ```bash
   dotnet run --project GrpcBasics.AppHost
   ```

3. The Aspire dashboard will open in your browser (typically `http://localhost:15888`). From there you can see both the **backend** (gRPC server) and **frontend** (Blazor client) running.

4. Click the **frontend** endpoint link in the Aspire dashboard to open the Blazor app.

5. Navigate to the **Students** page using the sidebar.

### Testing CRUD Operations

1. **List**: The Students page automatically loads and displays all students from the database (4 seeded students: Jane Smith, John Fisher, Pamela Baker, Peter Taylor).

2. **Add**: Fill in First Name, Last Name, and School fields at the top, then click "Add Student". The new student appears in the table.

3. **Update**: Click the "Edit" button on any student row. Modify the fields inline, then click "Save". The changes are persisted.

4. **Delete**: Click the "Delete" button on any student row. The student is removed from the database and the table refreshes.

5. **Refresh**: Click the "Refresh List" button to reload the student list from the server at any time.

### Building Only

```bash
cd "Labs/W09 gRPC/GrpcBasics"
dotnet build
```

### Solution Structure

```
GrpcBasics/
├── GrpcBasics.slnx                    # Solution file
├── GrpcBasics.AppHost/                # Aspire orchestrator
│   ├── AppHost.cs
│   └── GrpcBasics.AppHost.csproj
├── GrpcBasics.ServiceDefaults/        # Shared Aspire config
│   ├── Extensions.cs
│   └── GrpcBasics.ServiceDefaults.csproj
├── GrpcStudentsServer/                # gRPC backend (existing + Aspire)
│   ├── Program.cs
│   ├── Services/StudentsService.cs
│   ├── Protos/students.proto
│   └── ...
├── BlazorGrpcClient/                  # Blazor Server frontend (new)
│   ├── Program.cs
│   ├── Protos/students.proto
│   ├── Components/
│   │   ├── Pages/Students.razor       # CRUD page
│   │   ├── Pages/Home.razor
│   │   ├── Layout/MainLayout.razor
│   │   └── Layout/NavMenu.razor
│   └── BlazorGrpcClient.csproj
└── GrpcStudentsClient/                # Console client (original)
```
