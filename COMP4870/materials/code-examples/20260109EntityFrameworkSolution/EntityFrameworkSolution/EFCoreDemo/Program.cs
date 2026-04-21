using NorthwindLibrary.NW;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

NorthwindContext context = new();

// InsertCategory("Pastry", "Chocolate Cake");
// UpdateCategory(9, "Pop", "Pepsi");
// DeleteCategory(9);

InsertCategorySP("XXXXX", "YYYYY");
GetAllCategories();

// GetCategoryById(2);
// GetCalegoriesStartingWith("C");
// GetAllCategoriesQuerySyntax();
// GetAllProducts();
// GetProductCountByCategory();

void GetAllCategories()
{
    var qry = context.Categories
        .OrderByDescending(c => c.CategoryName)
        .Select(c => new 
        {
            ID = c.CategoryId,
            Name = c.CategoryName,
            Desc = c.Description
        });

    Console.WriteLine(qry.ToQueryString());

    foreach (var c in qry)
    {
        Console.WriteLine($"{c.ID}\t{c.Name}\t{c.Desc}");
    }
    Console.WriteLine("==============================");
}

void GetAllCategoriesQuerySyntax()
{
    var categories = from c in context.Categories
                     orderby c.CategoryName descending
                     select c;

    foreach (var c in categories)
    {
        Console.WriteLine($"{c.CategoryId}\t{c.CategoryName}\t{c.Description}");
    }
    Console.WriteLine("==============================");
}

void GetCategoryById(int id)
{
    var category = context.Categories.Find(id);
    if (category != null)
    {
        Console.WriteLine($"{category.CategoryId}\t{category.CategoryName}\t{category.Description}");
    }
    Console.WriteLine("==============================");
}

void GetCalegoriesStartingWith(string start)
{
    // This is LINQ (Language Integrated Query)
    // it has two syntaxes: Query Syntax and Method Syntax
    // Here we use Method Syntax
    var categories = context.Categories
        .Where(c => c.CategoryName.StartsWith(start));  

    Console.WriteLine(categories.ToQueryString());

    foreach (var c in categories)
    {
        Console.WriteLine($"{c.CategoryId}\t{c.CategoryName}\t{c.Description}");
    }
    Console.WriteLine("==============================");
}

void GetAllProducts()
{
    var qry = context.Products.Include(p => p.Category).Include(p => p.Supplier);
    Console.WriteLine(qry.ToQueryString());
    foreach (var p in qry)
    {
        Console.WriteLine($"{p.ProductId}\t{p.ProductName}\t{p.Category!.CategoryName}\t{p.Supplier!.CompanyName}");
    }
    Console.WriteLine("==============================");
}

void GetProductCountByCategory()
{
    var qry = context.Products
       .Include(c => c.Category)
       .GroupBy(p => p.Category.CategoryName)
       .Select(g => new
       {
           Name = g.Key,
           Count = g.Count()
       })
       .OrderByDescending(cp => cp.Count);

    Console.WriteLine(qry.ToQueryString());
    Console.WriteLine("==========================");

    foreach (var item in qry)
    {
        Console.WriteLine($"{item.Name}\t{item.Count}");
    }
}

void InsertCategory(string name, string description)
{
    Category newCategory = new()
    {
        CategoryName = name,
        Description = description
    };

    context.Categories.Add(newCategory);
    int affected = context.SaveChanges();
    Console.WriteLine($"Rows affected: {affected}");
    Console.WriteLine($"New Category ID: {newCategory.CategoryId}");
}

void UpdateCategory(int id, string name, string description)
{
    var category = context.Categories.Find(id);
    if (category != null)
    {
        category.CategoryName = name;
        category.Description = description;

        int affected = context.SaveChanges();
        Console.WriteLine($"Rows affected: {affected}");
    } else
    {
        Console.WriteLine($"Category with ID = {id} not found!");
    }
}

void DeleteCategory(int id)
{
    var category = context.Categories.Find(id);
    if (category != null)
    {
        context.Categories.Remove(category);
        int affected = context.SaveChanges();
        Console.WriteLine($"Rows affected: {affected}");
    }
    else
    {
        Console.WriteLine($"Category with ID = {id} not found!");
    }
}

void InsertCategorySP(string name, string desc)
{
    var pName = new SqlParameter("@CategoryName", name);
    var pDesc = new SqlParameter("@Description", desc);

    var result = context.Database.ExecuteSqlRaw("dbo.CategoryInsertMedhat @CategoryName, @Description", pName, pDesc);
}