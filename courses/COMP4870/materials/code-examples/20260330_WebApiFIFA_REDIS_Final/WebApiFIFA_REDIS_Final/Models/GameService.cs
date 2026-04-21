using System;
using Microsoft.Extensions.Caching.Distributed;
using WebApiFIFA.Data;
using Microsoft.EntityFrameworkCore;

namespace WebApiFIFA.Models;

public class GameService(ApplicationDbContext context, IDistributedCache cache, ILogger<GameService> logger)
{
    public async Task Add(Game game)
    {
        await context.Games.AddAsync(game);
        await context.SaveChangesAsync();

        // invalidate cache for games, as new game is added
        var cacheKey = "games";
        logger.LogInformation($"**** invalidating cache for key: {cacheKey} from cache.");
        cache.Remove(cacheKey);
    }

    public async Task<List<Game>> GetByCountry(string country)
    {
        var cacheKey = $"games:country:{country}";
        logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
        var cacheOptions = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                .SetSlidingExpiration(TimeSpan.FromMinutes(2));
        var games = await cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
                return await context.Games.Where(t => t.Country!.ToLower() == country.ToLower()).ToListAsync();
            },
            cacheOptions)!;
        return games!;
    }

    public async Task<List<Game>> GetByContinent(string continent)
    {
        var cacheKey = $"games:continent:{continent}";
        logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
        var cacheOptions = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                .SetSlidingExpiration(TimeSpan.FromMinutes(2));
        var games = await cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
                return await context.Games.Where(t => t.Continent!.ToLower() == continent.ToLower()).ToListAsync();
            },
            cacheOptions)!;
        return games!;
    }

    public async Task<List<Game>> GetByGender(string gender)
    {
        var cacheKey = $"games:gender:{gender}";
        logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
        var cacheOptions = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                .SetSlidingExpiration(TimeSpan.FromMinutes(2));
        var games = await cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
                return await context.Games.Where(t => t.Gender!.ToLower() == gender.ToLower()).ToListAsync();
            },
            cacheOptions)!;
        return games!;
    }

    public async Task<Game> Get(int id)
    {
        var cacheKey = $"game:{id}";
        logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
        var game = await cache.GetOrSetAsync(cacheKey,
            async () =>
            {
                logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
                return await context.Games.FindAsync(id)!;
            })!;
        return game!;
    }

    public async Task<List<Game>> GetAll()
    {
        var cacheKey = "games";
        logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.");
        var cacheOptions = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                .SetSlidingExpiration(TimeSpan.FromMinutes(2));
        var games = await cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                logger.LogInformation($"**** Cache miss. Fetching data for key: {cacheKey} from database.");
                return await context.Games.ToListAsync();
            },
            cacheOptions)!;
        return games!;
    }

    public async Task<List<ContinentCount>> GetGamesByContinent()
    {
        var cacheKey = "games:bycontinent";
        logger.LogInformation($"**** Fetching data for key: {cacheKey} from cache.", cacheKey);
        var cacheOptions = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                .SetSlidingExpiration(TimeSpan.FromMinutes(2));
        var report = await cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                logger.LogInformation("**** cache miss. fetching data for key: {CacheKey} from database.", cacheKey);
                List<ContinentCount> result = await context.Games.GroupBy(t => t.Continent)
                    .Select(g => new ContinentCount
                    {
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

