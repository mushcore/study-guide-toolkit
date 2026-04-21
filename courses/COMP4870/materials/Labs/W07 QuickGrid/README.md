# W07 QuickGrid Lab - Solution

## What Was Done

The lab required adding three features to the `/students` page of the BlazorStudents application. All changes were made in `Components/Pages/StudentPages/Index.razor`.

### 1. Pagination (15 rows at a time)

Changed `ItemsPerPage` from `10` to `15` in the `PaginationState`:

```csharp
private PaginationState pagination = new PaginationState { ItemsPerPage = 15 };
```

The `<Paginator State="@pagination" />` component was already present below the grid.

### 2. Filtering (search by keywords)

Added filter variables for each text column:

```csharp
string firstNameFilter = string.Empty;
string lastNameFilter = string.Empty;
string schoolFilter = string.Empty;
string genderFilter = string.Empty;
```

Created a computed `IQueryable<Student>` property that chains `.Where()` clauses to filter rows based on the filter values:

```csharp
IQueryable<Student>? filteredStudents =>
    context.Students
        .Where(s => s.FirstName!.Contains(firstNameFilter))
        .Where(s => s.LastName!.Contains(lastNameFilter))
        .Where(s => s.School!.Contains(schoolFilter))
        .Where(s => s.Gender!.Contains(genderFilter));
```

The QuickGrid now binds to `filteredStudents` instead of `context.Students` directly.

Each filterable column uses `<ColumnOptions>` to render a search input that binds to the corresponding filter variable with `@bind:event="oninput"` for real-time filtering:

```html
<PropertyColumn Property="student => student.FirstName" Sortable="true">
    <ColumnOptions>
        <div class="search-box">
            <input type="search" autofocus @bind="firstNameFilter" @bind:event="oninput"
                placeholder="Search first name..." />
        </div>
    </ColumnOptions>
</PropertyColumn>
```

Users can search by keywords like "male", "female", "Tom", "Doe", "Mining", etc. by clicking the column header filter icon and typing into the search box.

### 3. Sorting (click column titles)

Added `Sortable="true"` to all `PropertyColumn` components (FirstName, LastName, School, Gender, DateOfBirth). This allows users to click any column header to sort ascending/descending.

## How to Run

1. Open a terminal in the `BlazorStudents` folder:
   ```
   cd "Labs/W07 QuickGrid/BlazorStudents"
   ```

2. Build the project:
   ```
   dotnet build
   ```

3. Run the application:
   ```
   dotnet run
   ```

4. Open a browser and navigate to `https://localhost:5001/students` (or the URL shown in the terminal output).

## How to Test

- **Pagination**: The students table displays 15 rows per page. Use the paginator buttons below the grid to navigate between pages.
- **Filtering**: Click the filter icon on any column header (FirstName, LastName, School, Gender). A search box appears. Type a keyword (e.g., "Mining", "Female", "Tom") and the grid filters in real time.
- **Sorting**: Click any column header text to sort by that column. Click again to reverse the sort order. An arrow indicator shows the current sort direction.
