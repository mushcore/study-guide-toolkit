# W03 - Code First DB Development Lab: CommunityApp

## How This Solution Completes the Lab

### Lab Requirements Checklist

| Requirement | Status | Details |
|---|---|---|
| ASP.NET Core Razor Pages app | Done | Created with `dotnet new razor` |
| Code First approach | Done | Models defined first, database generated from migrations |
| Province entity with ProvinceCode as PK | Done | `Models/Province.cs` - string key `[Key]` attribute |
| City entity with CityId as PK | Done | `Models/City.cs` - int auto-increment key |
| Foreign key from City to Province | Done | `City.Province` FK with `[ForeignKey]` attribute |
| Navigation property (Province has Cities) | Done | `Province.Cities` collection |
| Seed data: 3+ provinces | Done | BC, AB, ON seeded in `Data/SeedData.cs` |
| Seed data: 3+ cities per province | Done | 3 cities each (9 total) |
| CRUD screens for Province | Done | `Pages/ProvincePages/` (Index, Create, Edit, Details, Delete) |
| CRUD screens for City | Done | `Pages/CityPages/` (Index, Create, Edit, Details, Delete) |
| Dropdown for Province on City Create/Edit | Done | `SelectList` in Create and Edit page models |
| Primary keys shown on Index pages | Done | ProvinceCode and CityId columns displayed |
| Name on home page | Done | "CommunityApp by Kevin Lian" on `Pages/Index.cshtml` |
| Menu items for Province & City | Done | Nav links in `_Layout.cshtml` |

### Architecture (Following the Sports Lecture Pattern)

The solution directly follows the **Sports** lecture example with Province/City mapped to Team/Player:

- **Province** (like Team): String primary key (`ProvinceCode`), one-to-many with Cities
- **City** (like Player): Int primary key (`CityId`), FK to Province, dropdown select on Create/Edit
- **SeedData.cs**: Extension method on `ModelBuilder` (same pattern as `Sports.Data.SeedData`)
- **ApplicationDbContext.cs**: Calls `builder.Seed()` in `OnModelCreating`
- **Program.cs**: Configures SQLite, calls `context.Database.Migrate()` on startup

### Project Structure

```
CommunityApp/
  Models/
    Province.cs          # ProvinceCode (PK), ProvinceName, Cities collection
    City.cs              # CityId (PK), CityName, Population, Province (FK)
  Data/
    ApplicationDbContext.cs   # DbContext with Provinces and Cities DbSets
    SeedData.cs               # Extension method seeding 3 provinces + 9 cities
    Migrations/               # EF Core migration M1
  Pages/
    Index.cshtml              # Home page with name
    ProvincePages/            # Full CRUD (Index, Create, Edit, Details, Delete)
    CityPages/                # Full CRUD with Province dropdown
    Shared/_Layout.cshtml     # Nav bar with Province and City links
  Program.cs                  # SQLite config + auto-migration on startup
  appsettings.json            # Connection string: community.sqlite
```

## How to Run

### Prerequisites

- .NET 10 SDK installed
- `dotnet-ef` tool installed (`dotnet tool install --global dotnet-ef`)

### Steps

1. **Navigate to the project folder:**
   ```bash
   cd "Labs/W03 - Code 1'st DB dev/CommunityApp"
   ```

2. **Build the project:**
   ```bash
   dotnet build
   ```

3. **Run the application:**
   ```bash
   dotnet run
   ```

4. **Open in browser:**
   Navigate to the URL shown in the console (e.g., `http://localhost:5099`)

The database is created and seeded automatically on first run (via `context.Database.Migrate()` in `Program.cs`).

### Testing

- **Home page**: Verify "Kevin Lian" name appears
- **Provinces link**: Click "Provinces" in nav bar to see seeded BC, AB, ON with ProvinceCode shown
- **Cities link**: Click "Cities" in nav bar to see seeded cities with CityId shown
- **Create City**: Click "Create New" on Cities page - Province dropdown should appear
- **Edit City**: Click "Edit" on any city - Province dropdown should appear
- **CRUD operations**: Create, Edit, Details, Delete all work for both entities

### EF Core Commands Used

```bash
# Create migration (already done)
dotnet-ef migrations add M1 -o Data/Migrations

# Apply migration (also happens automatically on app start)
dotnet-ef database update
```

### Key Packages

- `Microsoft.EntityFrameworkCore` 10.0.2
- `Microsoft.EntityFrameworkCore.Sqlite` 10.0.2
- `Microsoft.EntityFrameworkCore.Design` 10.0.2
- `Microsoft.EntityFrameworkCore.Tools` 10.0.2
