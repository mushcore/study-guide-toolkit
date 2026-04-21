using System.Net.Http.Json;
using System.Text.Json;

public class FifaService
{
    readonly HttpClient _httpClient = new();
    private List<FifaWorldCup>? _cache = null;
    private DateTime _cacheTime;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(10);

    private async Task<List<FifaWorldCup>> FetchFromApi()
    {
        try
        {
            var response = await _httpClient.GetAsync(
                "https://gist.githubusercontent.com/medhatelmasry/bc40ebfa5ed41b7512e36e6bfbcd18bd/raw/f24b734bb012061e97fead5980c34ffa0d73587e/fifa-world-cup.json");
            if (response.IsSuccessStatusCode)
            {
                var games = await response.Content.ReadFromJsonAsync<List<FifaWorldCup>>();
                return games ?? [];
            }
        }
        catch (Exception ex)
        {
            await Console.Error.WriteLineAsync($"Error fetching FIFA data: {ex.Message}");
        }
        return [];
    }

    public async Task<List<FifaWorldCup>> GetGames()
    {
        if (_cache == null || DateTime.UtcNow - _cacheTime > _cacheDuration)
        {
            _cache = await FetchFromApi();
            _cacheTime = DateTime.UtcNow;
        }
        return _cache;
    }

    public async Task<List<FifaWorldCup>> GetGamesByCountry(string country)
    {
        var games = await GetGames();
        var filtered = games
            .Where(g => g.Country != null &&
                        g.Country.Contains(country, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<List<FifaWorldCup>> GetGamesByCity(string city)
    {
        var games = await GetGames();
        var filtered = games
            .Where(g => g.City != null &&
                        g.City.Contains(city, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<List<FifaWorldCup>> GetGamesByGender(string gender)
    {
        var games = await GetGames();
        var filtered = games
            .Where(g => g.Gender != null &&
                        g.Gender.Equals(gender, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<List<FifaWorldCup>> GetWinsByTeam(string team)
    {
        var games = await GetGames();
        var filtered = games
            .Where(g => g.Winner != null &&
                        g.Winner.Equals(team, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<List<FifaWorldCup>> GetUpcomingGames()
    {
        var games = await GetGames();
        var filtered = games
            .Where(g => g.Winner != null &&
                        g.Winner.Equals("TBD", StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<string> GetGamesJson()
    {
        var games = await GetGames();
        return JsonSerializer.Serialize(games);
    }
}
