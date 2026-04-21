using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.EnableMcpToolMetadata();

builder.ConfigureMcpTool("get_games_by_country")
    .WithProperty("country", "string", "The country to filter games by", false);

builder.ConfigureMcpTool("get_games_by_city")
    .WithProperty("city", "string", "The city to filter games by", false);

builder.ConfigureMcpTool("get_wins_by_team")
    .WithProperty("team", "string", "The team or country name to look up wins for", false);

builder.ConfigureMcpTool("get_games_by_gender")
    .WithProperty("gender", "string", "The gender category to filter by (Men or Women)", false);

builder.Build().Run();
