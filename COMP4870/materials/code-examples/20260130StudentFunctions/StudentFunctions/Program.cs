using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StudentFunctions.Models.School;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

// Add Entity Framework DbContext
builder.Services.AddDbContext<SchoolContext>(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
    options.UseSqlServer(connectionString);
});

// Add HttpClient as singleton
builder.Services.AddSingleton<HttpClient>();


builder.Build().Run();
