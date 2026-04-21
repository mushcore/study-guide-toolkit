<!-- converted from DataCache_SCRIPT.docx -->

Data Caching
Source: https://github.com/medhatelmasry/DataCacheDemo
Caching refers to the process of storing frequently used data so it can be served much faster for any future requests. So, we take the most frequently used data and copy it into temporary storage so that it can be accessed much faster in future calls from the client.
There are two important terms used with cache, cache hit and cache miss. A cache hit occurs when data can be found in cache and a cache miss occurs when data can't be found in cache.
Consider the following API endpoint that returns some product data.
https://northwind.vercel.app/api/products
Structure of the returned JSON object looks like this:

This data rarely changes. It would be nice if we can preserve this data locally in cache to save on the latency penalty of making an online request for the data. This is easily achieved by doing some ASP.NET server-side data caching. Let’s see how this works.
We first create an ASP.NET Razor Pages with the following terminal window instructions:
Product.cs

In the above instructions, we create a razor pages web app in folder DataCacheDemo. We change directory to DataCacheDemo, create a Models folder, then open the project in VS Code.

In the Models folder, create a class named Product with the following code:
public partial class Product {
[JsonPropertyName("id")]
public int Id { get; set; }

[JsonPropertyName("quantityPerUnit")]
public string? QuantityPerUnit { get; set; }

[JsonPropertyName("unitPrice")]
public decimal? UnitPrice { get; set; }

[JsonPropertyName("name")]
public string Name { get; set; } = null!;
}

Open Pages/Index.cshtml.cs in the editor.
Add the following bindable property at the top of the IndexModel class definition:
[BindProperty]
public Product[]? Products { get; set; }
Add the following helper method that accesses endpoint https://northwind.vercel.app/api/products, reads the JSON object, hydrates an array of Product objects with data, then returns an array of Product objects.
private async Task<Product[]> GetProductsAsync() {
HttpClient client = new HttpClient();
var stream = client.GetStreamAsync("https://northwind.vercel.app/api/products");
var productList = await JsonSerializer.DeserializeAsync<Product[]>(await stream);

return productList!;
}

Replace the “public void OnGet()” method with the following “public async Task OnGet()” method:
public async Task OnGet() {
var T1 = DateTime.Now;
Products = await GetProductsAsync();
var T2 = DateTime.Now;

TimeSpan duration = T2 - T1;
Console.WriteLine($"Duration in milliseconds: {duration.TotalMilliseconds}");
}
In the above code, we obtain the time before we call the GetProductsAsync() method (T1) and the time after the method is called (T2) to determine how long the request to read the Products API data takes (T2-T1). The duration in milliseconds is then printed in the terminal window.

Replace Pages/Index.cshtml with the following markup code:
@page
@model IndexModel
@{
ViewData["Title"] = "Northwind Products List";
}

<h3>@ViewData["Title"]</h3>

<table class="table table-striped">
<tr>
<th>ID</th>
<th>Name</th>
<th>Quantity</th>
<td>Unit Price</td>
</tr>
@foreach(var item in Model.Products!) {
<tr>
<td>@item.Id</td>
<td>@item.Name</td>
<td>@item.QuantityPerUnit</td>
<td>@item.UnitPrice</td>
</tr>
}
</table>

Now, when you run the application, it should look like this:


Have a look at the output console window. It will reveal how long it took to get a response from the API service:
Duration in milliseconds: 393.65

Let us make use of caching such that data received from the API endpoint is cached for a certain period of time.
Add the following code to Program.cs, just before “var app = builder.Build();”:

builder.Services.AddMemoryCache();

Back in Pages/Index.cshtml.cs, add the following instance variable at the top of the IndexModel class definition:

private readonly IMemoryCache? _memoryCache;

Add a constructor that carries out dependency injection:

public IndexModel(IMemoryCache memoryCache) {
_memoryCache = memoryCache;
}

Replace the GetProductsAsync() helper method with the following code that uses ASP.NET server-side data caching:

private async Task<Product[]> GetProductsAsync() {
var cacheKey = "productList";
//checks if cache entries exists
if (!_memoryCache!.TryGetValue(cacheKey, out Product[]? productList)) {
//calling the server
HttpClient client = new HttpClient();
var stream = client.GetStreamAsync("https://northwind.vercel.app/api/products");
productList = await JsonSerializer.DeserializeAsync<Product[]>(await stream);

//setting up cache options
var cacheExpiryOptions = new MemoryCacheEntryOptions {
AbsoluteExpiration = DateTime.Now.AddSeconds(50),
Priority = CacheItemPriority.High,
SlidingExpiration = TimeSpan.FromSeconds(20)
};
//setting cache entries
_memoryCache!.Set(cacheKey, productList, cacheExpiryOptions);

Console.WriteLine("Data from API (cache miss)");
} else {
Console.WriteLine("Data from CACHE (cache hit)");
}

return productList!;
}
In the above code, products data is refreshed every 50 seconds, or 20 seconds if there is no access to the page. Otherwise, data is served from cache.
If data is served from the online API, then message "Data from API (cache miss)" will display in the output console window. Otherwise, if data is served from cache, then message " Data from CACHE (cache hit)" will display in the output console window.



Run the application and repeatedly hit your browser’s refresh button. You will quickly discover that there is a huge improvement in efficiency with caching:
Data from API (cache miss)
Duration in milliseconds: 265.364
Data from CACHE (cache hit)
Duration in milliseconds: 0.073
Data from CACHE (cache hit)
Duration in milliseconds: 0.024
Data from CACHE (cache hit)
Duration in milliseconds: 0.044
Data from CACHE (cache hit)
Duration in milliseconds: 0.025
| Priority | Priority defines the priority of keeping cache entry in the cache. The default value is set to Normal. The values for priority can be High, Normal, Low, and NeverRemove. |
| --- | --- |
| Sliding Expiration | A specific timespan within which the cache will expire if it is not used by anyone. As we set the sliding expiration to 20 seconds, it means that if there is no client request for 20 seconds the cache will be expired. |
| Absolute Expiration | It refers to the actual expiration of the cache entry without considering the sliding expiration. In our code, we set the absolute expiration to 50 seconds. It means the cache will expire every 50 seconds. |