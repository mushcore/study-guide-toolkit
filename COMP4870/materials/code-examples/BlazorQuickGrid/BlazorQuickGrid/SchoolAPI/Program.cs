using Microsoft.EntityFrameworkCore;
using SchoolAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SchoolDbContext>(options =>
    options.UseSqlite(connectionString));

// Add Cors
builder.Services.AddCors(o => o.AddPolicy("Policy", builder =>
{
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

app.UseAuthorization();

app.UseCors("Policy");

app.MapControllers();

app.Run();
