using Microsoft.EntityFrameworkCore;
using WebApiFIFA.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Cors
builder.Services.AddCors(o => o.AddPolicy("Policy", builder => {
  builder.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Policy");

//To read all games (GET)
app.MapGet("/api/games", async (ApplicationDbContext db) =>
    await db.Games.ToListAsync());

//To read all games by country (GET)
app.MapGet("/api/games/country/{country}", async (string country, ApplicationDbContext db) =>
    await db.Games.Where(t => t.Country!.ToLower() == country.ToLower()).ToListAsync());

//To read all games by continent (GET)
app.MapGet("/api/games/continent/{continent}", async (string continent, ApplicationDbContext db) =>
    await db.Games.Where(t => t.Continent!.ToLower() == continent.ToLower()).ToListAsync());

//To read all games by gender (GET)
app.MapGet("/api/games/gender/{gender}", async (string gender, ApplicationDbContext db) =>
    await db.Games.Where(t => t.Gender!.ToLower() == gender.ToLower()).ToListAsync());

//To read the count of games sorted by continent (GET)
app.MapGet("/api/games/count/continent", async (ApplicationDbContext db) =>
    //get the number of games by continent sorted by count
    await db.Games.GroupBy(t => t.Continent)
        .Select(g => new { Continent = g.Key, Count = g.Count() })
        .OrderByDescending(t => t.Count)
        .ToListAsync());

//To read a game by id (GET)
app.MapGet("/api/games/{id}", async (int id, ApplicationDbContext db) =>
    await db.Games.FindAsync(id));

using (var scope = app.Services.CreateScope()) {
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<ApplicationDbContext>();    
    context.Database.Migrate();
}

app.Run();

