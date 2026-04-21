using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Sports;
using Sports.Data;
using Sports.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

string? connStr = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlite(connStr)
);

// ********** Begin add support for localization
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] {
        new CultureInfo("en"),
        new CultureInfo("de"),
        new CultureInfo("fr"),
        new CultureInfo("zh"),
        new CultureInfo("en-US")
    };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

builder.Services.AddMvc()
.AddViewLocalization()
.AddDataAnnotationsLocalization(options =>
{
    options.DataAnnotationLocalizerProvider = (type, factory) =>
        factory.Create(typeof(SharedResource));
});
// ********** End add support for localization

builder.Services.AddSingleton<SharedResourceService>();

var app = builder.Build(); // ------

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var localizationOptions = services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
    app.UseRequestLocalization(localizationOptions);

    var context = services.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();
}

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
