using System.Net.Http.Json;
using System.Text.Json;

public class BeverageService
{
    readonly HttpClient _httpClient = new();
    private List<Beverage>? _beveragesCache = null;
    private DateTime _cacheTime;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(10);

    private async Task<List<Beverage>> FetchBeveragesFromApi()
    {
        try
        {
            var response = await _httpClient.GetAsync(
                "https://gist.githubusercontent.com/medhatelmasry/fab36e3fac4ddafac0f837c920741eae/raw/734f416e93967c02ce36d404916b06da6de5fa77/beverages.json");
            if (response.IsSuccessStatusCode)
            {
                var beverages = await response.Content.ReadFromJsonAsync<List<Beverage>>();
                return beverages ?? [];
            }
        }
        catch (Exception ex)
        {
            await Console.Error.WriteLineAsync($"Error fetching beverages: {ex.Message}");
        }
        return [];
    }

    public async Task<List<Beverage>> GetBeverages()
    {
        if (_beveragesCache == null || DateTime.UtcNow - _cacheTime > _cacheDuration)
        {
            _beveragesCache = await FetchBeveragesFromApi();
            _cacheTime = DateTime.UtcNow;
        }
        return _beveragesCache;
    }

    public async Task<List<Beverage>> GetBeveragesContainingSugar()
    {
        var beverages = await GetBeverages();
        var filtered = beverages
            .Where(b => b.MainIngredient != null &&
                        b.MainIngredient.Contains("Sugar", StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<List<Beverage>> GetBeveragesWithMostCalories()
    {
        var beverages = await GetBeverages();
        var sorted = beverages.OrderByDescending(b => b.CaloriesPerServing).ToList();
        return sorted;
    }

    public async Task<List<Beverage>> GetBeveragesByOrigin(string origin)
    {
        var beverages = await GetBeverages();
        var filtered = beverages
            .Where(b => b.Origin != null &&
                        b.Origin.Contains(origin, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<List<Beverage>> GetBeveragesByCategory(string category)
    {
        var beverages = await GetBeverages();
        var filtered = beverages
            .Where(b => b.Type != null &&
                        b.Type.Contains(category, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return filtered;
    }

    public async Task<Beverage?> GetBeverageByName(string name)
    {
        var beverages = await GetBeverages();
        var beverage = beverages.FirstOrDefault(b =>
            b.Name != null &&
            b.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        return beverage;
    }

    public async Task<string> GetBeveragesJson()
    {
        var beverages = await GetBeverages();
        return JsonSerializer.Serialize(beverages);
    }
}
