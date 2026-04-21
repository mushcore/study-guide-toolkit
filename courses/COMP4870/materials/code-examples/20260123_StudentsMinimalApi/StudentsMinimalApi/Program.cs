using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using StudentsMinimalApi.Data;
using StudentsMinimalApi.Models;
using StudentsMinimalApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connStr = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<SchoolDbContext>(option => option.UseSqlite(connStr));

// Add Cors
builder.Services.AddCors(o => o.AddPolicy("Policy", builder =>
{
    builder.AllowAnyOrigin()
      .AllowAnyMethod()
      .AllowAnyHeader();
}));

// Authorization
builder.Services.AddAuthorization();

// Activate identity APIs. By default, both cookies and proprietary tokens
// are activated. Cookies will be issued based on the 'useCookies' querystring
// parameter in the login endpoint
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<SchoolDbContext>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("Policy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // app.MapScalarApiReference(options =>
    // {
    //     options
    //         .WithTitle("Students WebAPI")
    //         .WithTheme(ScalarTheme.Moon)
    //         .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    // });

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Students WebAPI");
    });
}

var route = app.MapGroup("/api/students");

route.MapGet("/", StudentService.GetAllStudents)
.RequireAuthorization();

route.MapGet("/school/{school}", StudentService.GetStudentsBySchool);
route.MapGet("/{id}", StudentService.GetStudent);
route.MapPost("/", StudentService.CreateSttudent);
route.MapPut("/{id}", StudentService.UpdateStudent);
route.MapDelete("/{id}", StudentService.DeleteStudent);

// apply database migrations at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SchoolDbContext>();
    db.Database.Migrate();
}

app.MapIdentityApi<IdentityUser>();

app.Run();


