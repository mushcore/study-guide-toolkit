using LibraryFIFA;

namespace BlazorFIFA;

public class ApiClient(HttpClient client)
{
    public async Task<Game[]> GetAllGamesAsync() =>
        await client.GetFromJsonAsync<Game[]>($"api/games") ?? [];

    public async Task<Game[]> GetWomenGamesAsync() =>
        await client.GetFromJsonAsync<Game[]>($"api/games/gender/women") ?? [];

    public async Task<Game[]> GetMenGamesAsync() =>
        await client.GetFromJsonAsync<Game[]>($"api/games/gender/men") ?? [];

    public async Task<ContinentCount[]> GetCountByContinentAsync() =>
        await client.GetFromJsonAsync<ContinentCount[]>($"api/games/count/continent") ?? [];

    
}
