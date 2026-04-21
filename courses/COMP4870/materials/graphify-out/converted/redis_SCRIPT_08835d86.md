<!-- converted from redis_SCRIPT.docx -->

Distributed cache with Redis
Start a Redis docker container with this command:
docker run --name redis -d -p 6379:6379 redis
Get into the CLI conversation with Redis running in the docker container:
docker exec -it redis sh
redis-cli
set name "Micky Mouse"
get name
"Micky Mouse"
del name
(integer) 1
get name
(nil)
### Setting a key with expiration time (in seconds)
setex destination 10 "Tokyo"
ttl destination
(integer) 3					<< time left
To exit the redis-cli and return to the host operating system:
CTRL-C followed by exit.
# Redis Insight
Redis Insight is a valuable tool for developers and administrators looking to gain deeper insights into their Redis instances and optimize their Redis deployments for maximum efficiency. It is a FREE tool. Install it from https://redis.io/insight/
# Caching in ASP.NET Core with Redis
Start with API app WebApiFIFA_REDIS.zip.
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
Add this service to Program.cs:
builder.Services.AddStackExchangeRedisCache(options => {
options.Configuration = "localhost";
options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions()
{
AbortOnConnectFail = true,
EndPoints = { options.Configuration }
};
});

Let’s add an extension method to make the cache operations more seamless. Add a class named DistributedCacheExtensions to the Models folder with this code:
public static class DistributedCacheExtensions {
private static JsonSerializerOptions serializerOptions = new JsonSerializerOptions {
PropertyNamingPolicy = null,
WriteIndented = true,
AllowTrailingCommas = true,
DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
};
public static Task SetAsync<T>(this IDistributedCache cache, string key, T value) {
return SetAsync(cache, key, value, new DistributedCacheEntryOptions()
.SetSlidingExpiration(TimeSpan.FromMinutes(30))
.SetAbsoluteExpiration(TimeSpan.FromHours(1)));
}

public static Task SetAsync<T>(this IDistributedCache cache, string key, T value, DistributedCacheEntryOptions options) {
var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(value, serializerOptions));
return cache.SetAsync(key, bytes, options);
}

public static bool TryGetValue<T>(this IDistributedCache cache, string key, out T? value) {
var val = cache.Get(key);
value = default;
if (val == null) return false;
value = JsonSerializer.Deserialize<T>(val, serializerOptions);
return true;
}

public static async Task<T?> GetOrSetAsync<T>(this IDistributedCache cache, string key, Func<Task<T>> task, DistributedCacheEntryOptions? options = null) {
if (options == null) {
options = new DistributedCacheEntryOptions()
.SetSlidingExpiration(TimeSpan.FromMinutes(30))
.SetAbsoluteExpiration(TimeSpan.FromHours(1));
}
if (cache.TryGetValue(key, out T? value) && value is not null) {
return value;
}
value = await task();
if (value is not null) {
await cache.SetAsync<T>(key, value, options);
}
return value;
}
}
### Core Methods
# Game Service
The GameService class will consume the extension methods we designed in the previous step. Add this class to the Models folder.
public class GameService(ApplicationDbContext context, IDistributedCache cache, ILogger<GameService> logger) {
public async Task Add(Game game) {
await context.Games.AddAsync(game);
await context.SaveChangesAsync();

// invalidate cache for games, as new game is added
var cacheKey = "games";
logger.LogInformation($"**** invalidating cache for key: {cacheKey} from cache.");
cache.Remove(cacheKey);
}

public async Task<List<Game>> GetByCountry(string country) {
var cacheKey = $"games:country:{country}";
logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
var cacheOptions = new DistributedCacheEntryOptions()
.SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
.SetSlidingExpiration(TimeSpan.FromMinutes(2));
var games = await cache.GetOrSetAsync(
cacheKey,
async () => {
logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
return await context.Games.Where(t => t.Country!.ToLower() == country.ToLower()).ToListAsync();
},
cacheOptions)!;
return games!;
}

public async Task<List<Game>> GetByContinent(string continent) {
var cacheKey = $"games:continent:{continent}";
logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
var cacheOptions = new DistributedCacheEntryOptions()
.SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
.SetSlidingExpiration(TimeSpan.FromMinutes(2));
var games = await cache.GetOrSetAsync(
cacheKey,
async () => {
logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
return await context.Games.Where(t => t.Continent!.ToLower() == continent.ToLower()).ToListAsync();
},
cacheOptions)!;
return games!;
}

public async Task<List<Game>> GetByGender(string gender) {
var cacheKey = $"games:gender:{gender}";
logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
var cacheOptions = new DistributedCacheEntryOptions()
.SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
.SetSlidingExpiration(TimeSpan.FromMinutes(2));
var games = await cache.GetOrSetAsync(
cacheKey,
async () => {
logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
return await context.Games.Where(t => t.Gender!.ToLower() == gender.ToLower()).ToListAsync();
},
cacheOptions)!;
return games!;
}

public async Task<Game> Get(int id) {
var cacheKey = $"game:{id}";
logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
var game = await cache.GetOrSetAsync(cacheKey,
async () => {
logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
return await context.Games.FindAsync(id)!;
})!;
return game!;
}

public async Task<List<Game>> GetAll() {
var cacheKey = "games";
logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
var cacheOptions = new DistributedCacheEntryOptions()
.SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
.SetSlidingExpiration(TimeSpan.FromMinutes(2));
var games = await cache.GetOrSetAsync(
cacheKey,
async () => {
logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
return await context.Games.ToListAsync();
},
cacheOptions)!;
return games!;
}

public async Task<List<ContinentCount>> GetGamesByContinent() {
var cacheKey = "games:bycontinent";
logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.", cacheKey);
var cacheOptions = new DistributedCacheEntryOptions()
.SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
.SetSlidingExpiration(TimeSpan.FromMinutes(2));
var report = await cache.GetOrSetAsync(
cacheKey,
async () => {
logger.LogInformation("**** cache miss. fetching data for key: {CacheKey} from database.", cacheKey);
List<ContinentCount> result = await context.Games.GroupBy(t => t.Continent)
.Select(g => new ContinentCount {
Continent = g.Key,
Count = g.Count()
})
.OrderByDescending(t => t.Count)
.ToListAsync();
return result;
},
cacheOptions)!;
return report!;
}
}
Register the GameService class by adding this line of code to Program.cs:
builder.Services.AddScoped<GameService>();
Update all the API mappings in Program.cs with this code that uses the service with smart caching:
// Read all games (GET)
app.MapGet("/api/games", async (GameService _gs) =>
await _gs.GetAll());

// Read games by country (GET)
app.MapGet("/api/games/country/{country}", async (string country, GameService _gs) =>
await _gs.GetByCountry(country));

// Read games by continent (GET)
app.MapGet("/api/games/continent/{continent}", async (string continent, GameService _gs) =>
await _gs.GetByContinent(continent));

// Read games by gender (GET)
app.MapGet("/api/games/gender/{gender}", async (string gender, GameService _gs) =>
await _gs.GetByGender(gender));

// Read count of games sorted by continent (GET)
app.MapGet("/api/games/count/continent", async (GameService _gs) =>
//get the number of games by continent sorted by count
await _gs.GetGamesByContinent());

// Read a game by id (GET)
app.MapGet("/api/games/{id}", async (int id, GameService _gs) =>
await _gs.Get(id));
Run the application and notice the messages in the terminal log that show where the data came from:
Examples:
**** cache miss. fetching data for key: games:bycontinent from database.
**** fetching data for key: games:bycontinent from cache.
### Reference
https://codewithmukesh.com/blog/distributed-caching-in-aspnet-core-with-redis/
| SetAsync() | Serialize incoming value of type T, and then form the byte array |
| --- | --- |
| TryGetValue() | Fetches data from cache based on the passed cache key. If found, it deserializes the data into type T and sets the value and passes back a true. If the key is not found in the Redis cache memory, it returns false. |
| GetOrSetAsync() | This is a wrapper around both above extensions. Basically, in this single method, it handles both the Get and Set operations flawlessly. If the Cache Key is found in Redis, it returns the data. And if it’s not found, it executes the task (lambda function) and sets the returned value to the cache memory. |