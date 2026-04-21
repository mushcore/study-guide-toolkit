#!/usr/bin/env dotnet

#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

var settingsFile = $"{builder.Environment.ApplicationName}.appsettings.json";
builder.Configuration.AddJsonFile(settingsFile, optional: true, reloadOnChange: true);

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapGet("/", () => new HelloResponse { Message = "Hello, World!" })
.WithName("HelloWorld");

app.Run();

// Add the JSON serializer context
[JsonSerializable(typeof(HelloResponse))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{
}

// Add the response model
public record HelloResponse
{
    public string Message { get; init; } = string.Empty;
}

