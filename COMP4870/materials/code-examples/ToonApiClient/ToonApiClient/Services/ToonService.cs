using System.Text.Json;

namespace ToonApiClient;

public class ToonService
{
    public static async Task<Toon[]> GetToonsAsync()
    {
        HttpClient client = new HttpClient();
        var stream = client.GetStreamAsync("https://apipool.azurewebsites.net/api/toons");
        var toons = await JsonSerializer.DeserializeAsync<Toon[]>(await stream);
        return toons!;
    }

}