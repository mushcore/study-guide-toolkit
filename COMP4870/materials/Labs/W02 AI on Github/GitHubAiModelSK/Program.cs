using Microsoft.SemanticKernel;
using OpenAI;
using System.ClientModel;

var builder = WebApplication.CreateBuilder(args);

// AI configuration from appsettings.json
var modelId = builder.Configuration["AI:Model"]!;
var uri = builder.Configuration["AI:Endpoint"]!;
var githubPAT = builder.Configuration["AI:PAT"]!;

var client = new OpenAIClient(
    new ApiKeyCredential(githubPAT),
    new OpenAIClientOptions { Endpoint = new Uri(uri) });

builder.Services.AddOpenAIChatCompletion(modelId, client);
builder.Services.AddKernel();

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseSession();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
