using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Mcp;
using System.Text.Json;

public class FifaTools
{
    private static readonly FifaService _fifaService = new();

    [Function(nameof(GetAllGames))]
    public string GetAllGames(
        [McpToolTrigger("get_all_games", "Get a list of all FIFA World Cup games and return as JSON array")]
        ToolInvocationContext context)
    {
        var task = _fifaService.GetGamesJson();
        return task.GetAwaiter().GetResult();
    }

    [Function(nameof(GetGamesByCountry))]
    public string GetGamesByCountry(
        [McpToolTrigger("get_games_by_country", "Get FIFA World Cup games played in a specific country and return as JSON")]
        ToolInvocationContext context)
    {
        var country = context.Arguments?.GetValueOrDefault("country")?.ToString() ?? "";
        var games = _fifaService.GetGamesByCountry(country).GetAwaiter().GetResult();
        return JsonSerializer.Serialize(games, FifaWorldCupContext.Default.ListFifaWorldCup);
    }

    [Function(nameof(GetGamesByCity))]
    public string GetGamesByCity(
        [McpToolTrigger("get_games_by_city", "Get FIFA World Cup games played in a specific city and return as JSON")]
        ToolInvocationContext context)
    {
        var city = context.Arguments?.GetValueOrDefault("city")?.ToString() ?? "";
        var games = _fifaService.GetGamesByCity(city).GetAwaiter().GetResult();
        return JsonSerializer.Serialize(games, FifaWorldCupContext.Default.ListFifaWorldCup);
    }

    [Function(nameof(GetWinsByTeam))]
    public string GetWinsByTeam(
        [McpToolTrigger("get_wins_by_team", "Get FIFA World Cup wins by a specific team/country and return as JSON")]
        ToolInvocationContext context)
    {
        var team = context.Arguments?.GetValueOrDefault("team")?.ToString() ?? "";
        var games = _fifaService.GetWinsByTeam(team).GetAwaiter().GetResult();
        return JsonSerializer.Serialize(games, FifaWorldCupContext.Default.ListFifaWorldCup);
    }

    [Function(nameof(GetUpcomingGames))]
    public string GetUpcomingGames(
        [McpToolTrigger("get_upcoming_games", "Get upcoming FIFA World Cup games that have not yet been played (winner is TBD)")]
        ToolInvocationContext context)
    {
        var games = _fifaService.GetUpcomingGames().GetAwaiter().GetResult();
        return JsonSerializer.Serialize(games, FifaWorldCupContext.Default.ListFifaWorldCup);
    }

    [Function(nameof(GetGamesByGender))]
    public string GetGamesByGender(
        [McpToolTrigger("get_games_by_gender", "Get FIFA World Cup games filtered by gender (Men or Women) and return as JSON")]
        ToolInvocationContext context)
    {
        var gender = context.Arguments?.GetValueOrDefault("gender")?.ToString() ?? "";
        var games = _fifaService.GetGamesByGender(gender).GetAwaiter().GetResult();
        return JsonSerializer.Serialize(games, FifaWorldCupContext.Default.ListFifaWorldCup);
    }

    [Function(nameof(GetGameCount))]
    public string GetGameCount(
        [McpToolTrigger("get_game_count", "Get the total count of FIFA World Cup games")]
        ToolInvocationContext context)
    {
        var games = _fifaService.GetGames().GetAwaiter().GetResult();
        return games.Count.ToString();
    }
}
