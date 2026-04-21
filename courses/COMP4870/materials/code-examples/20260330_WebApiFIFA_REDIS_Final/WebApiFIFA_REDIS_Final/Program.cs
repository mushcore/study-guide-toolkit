using Microsoft.EntityFrameworkCore;
using WebApiFIFA.Data;
using WebApiFIFA.Models;

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

builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = "localhost";
    options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions()
    {
        AbortOnConnectFail = true,
        EndPoints = { options.Configuration }
    };
});

builder.Services.AddScoped<GameService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Policy");

// Read all games (GET)
app.MapGet("/api/games", async (GameService _gs) =>
    await _gs.GetAll());

// Read games by country (GET)
app.MapGet("/api/games/country/{country}", async (string country, GameService _gs) =>
    await _gs.GetByCountry(country));

// Read games by continent (GET)
app.MapGet("/api/games/continent/{continent}", async (string continent, GameService _gs) =>
    await _gs.GetByContinent(continent));

// Read games by gender (GET)
app.MapGet("/api/games/gender/{gender}", async (string gender, GameService _gs) =>
    await _gs.GetByGender(gender));

// Read count of games sorted by continent (GET)
app.MapGet("/api/games/count/continent", async (GameService _gs) =>
    //get the number of games by continent sorted by count
    await _gs.GetGamesByContinent());

// Read a game by id (GET)
app.MapGet("/api/games/{id}", async (int id, GameService _gs) =>
    await _gs.Get(id));


using (var scope = app.Services.CreateScope()) {
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<ApplicationDbContext>();    
    context.Database.Migrate();
}

app.Run();

