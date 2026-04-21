using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using NorthwindBlazor.Models;

namespace DataCacheDemo.Pages;

public class IndexModel : PageModel
{
    [BindProperty]
    public Product[]? Products { get; set; }

    private readonly IMemoryCache _memoryCache;

    public IndexModel(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;
    }

    public async Task OnGet()
    {
        var T1 = DateTime.Now;
        Products = await GetProductsAsync();
        var T2 = DateTime.Now;

        TimeSpan duration = T2 - T1;
        Console.WriteLine($"Duration in milliseconds: {duration.TotalMilliseconds}");
    }

    // private async Task<Product[]> GetProductsAsync()
    // {
    //     HttpClient client = new HttpClient();
    //     var stream = client.GetStreamAsync("https://northwind.vercel.app/api/products");
    //     var productList = await JsonSerializer.DeserializeAsync<Product[]>(await stream);

    //     return productList!;
    // }

    private async Task<Product[]> GetProductsAsync()
    {
        var cacheKey = "productList";
        //checks if cache entries exists
        if (!_memoryCache.TryGetValue(cacheKey, out Product[]? productList))
        {
            //calling the server
            HttpClient client = new HttpClient();
            var stream = client.GetStreamAsync("https://northwind.vercel.app/api/products");
            productList = await JsonSerializer.DeserializeAsync<Product[]>(await stream);

            //setting up cache options
            var cacheExpiryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpiration = DateTime.Now.AddSeconds(50),
                Priority = CacheItemPriority.High,
                SlidingExpiration = TimeSpan.FromSeconds(20)
            };
            //setting cache entries
            _memoryCache.Set(cacheKey, productList, cacheExpiryOptions);

            Console.WriteLine("Data from API (cache miss)");
        }
        else
        {
            Console.WriteLine("Data from CACHE (cache hit)");
        }

        return productList!;
    }

}
