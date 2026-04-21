namespace FifaWorldCup.Models;

public class Game
{
    public int GameId { get; set; }
    public int Year { get; set; }
    public string? Gender { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Continent { get; set; }
    public string? Winner { get; set; }

    public static IEnumerable<Game> GetGames()
    {
        List<Game> games = new List<Game>() {
            new Game() { GameId = 1,  Year = 1930, Gender = "Men",   City = "Montevideo",                                           Country = "Uruguay",                        Continent = "South America", Winner = "Uruguay" },
            new Game() { GameId = 2,  Year = 1934, Gender = "Men",   City = "Rome",                                                 Country = "Italy",                          Continent = "Europe",        Winner = "Italy" },
            new Game() { GameId = 3,  Year = 1938, Gender = "Men",   City = "Paris",                                                Country = "France",                         Continent = "Europe",        Winner = "Italy" },
            new Game() { GameId = 4,  Year = 1950, Gender = "Men",   City = "Rio de Janeiro",                                       Country = "Brazil",                         Continent = "South America", Winner = "Uruguay" },
            new Game() { GameId = 5,  Year = 1954, Gender = "Men",   City = "Bern",                                                 Country = "Switzerland",                    Continent = "Europe",        Winner = "West Germany" },
            new Game() { GameId = 6,  Year = 1958, Gender = "Men",   City = "Stockholm",                                            Country = "Sweden",                         Continent = "Europe",        Winner = "Brazil" },
            new Game() { GameId = 7,  Year = 1962, Gender = "Men",   City = "Santiago",                                             Country = "Chile",                          Continent = "South America", Winner = "Brazil" },
            new Game() { GameId = 8,  Year = 1966, Gender = "Men",   City = "London",                                               Country = "England",                        Continent = "Europe",        Winner = "England" },
            new Game() { GameId = 9,  Year = 1970, Gender = "Men",   City = "Mexico City",                                          Country = "Mexico",                         Continent = "North America", Winner = "Brazil" },
            new Game() { GameId = 10, Year = 1974, Gender = "Men",   City = "Munich",                                               Country = "West Germany",                   Continent = "Europe",        Winner = "West Germany" },
            new Game() { GameId = 11, Year = 1978, Gender = "Men",   City = "Buenos Aires",                                         Country = "Argentina",                      Continent = "South America", Winner = "Argentina" },
            new Game() { GameId = 12, Year = 1982, Gender = "Men",   City = "Madrid",                                               Country = "Spain",                          Continent = "Europe",        Winner = "Italy" },
            new Game() { GameId = 13, Year = 1986, Gender = "Men",   City = "Mexico City",                                          Country = "Mexico",                         Continent = "North America", Winner = "Argentina" },
            new Game() { GameId = 14, Year = 1990, Gender = "Men",   City = "Rome",                                                 Country = "Italy",                          Continent = "Europe",        Winner = "West Germany" },
            new Game() { GameId = 15, Year = 1991, Gender = "Women", City = "Montevideo",                                           Country = "Uruguay",                        Continent = "South America", Winner = "Uruguay" },
            new Game() { GameId = 16, Year = 1994, Gender = "Men",   City = "Los Angeles",                                          Country = "United States",                  Continent = "North America", Winner = "Brazil" },
            new Game() { GameId = 17, Year = 1995, Gender = "Women", City = "Rome",                                                 Country = "Italy",                          Continent = "Europe",        Winner = "Norway" },
            new Game() { GameId = 18, Year = 1998, Gender = "Men",   City = "Paris",                                                Country = "France",                         Continent = "Europe",        Winner = "France" },
            new Game() { GameId = 19, Year = 1999, Gender = "Women", City = "Pasadena/CA",                                          Country = "United States",                  Continent = "North America", Winner = "United States" },
            new Game() { GameId = 20, Year = 2002, Gender = "Men",   City = "Seoul and Tokyo",                                      Country = "South Korea and Japan",          Continent = "Asia",          Winner = "Brazil" },
            new Game() { GameId = 21, Year = 2003, Gender = "Women", City = "Carson/CA",                                            Country = "United States",                  Continent = "North America", Winner = "Germany" },
            new Game() { GameId = 22, Year = 2006, Gender = "Men",   City = "Berlin",                                               Country = "Germany",                        Continent = "Europe",        Winner = "Italy" },
            new Game() { GameId = 23, Year = 2007, Gender = "Women", City = "Shanghai",                                             Country = "China",                          Continent = "Asia",          Winner = "Germany" },
            new Game() { GameId = 24, Year = 2010, Gender = "Men",   City = "Johannesburg",                                         Country = "South Africa",                   Continent = "Africa",        Winner = "Spain" },
            new Game() { GameId = 25, Year = 2011, Gender = "Women", City = "Frankfurt",                                            Country = "Germany",                        Continent = "Europe",        Winner = "Japan" },
            new Game() { GameId = 26, Year = 2014, Gender = "Men",   City = "Rio de Janeiro",                                       Country = "Brazil",                         Continent = "South America", Winner = "Germany" },
            new Game() { GameId = 27, Year = 2015, Gender = "Women", City = "Vancouver",                                            Country = "Canada",                         Continent = "North America", Winner = "United States" },
            new Game() { GameId = 28, Year = 2018, Gender = "Men",   City = "Moscow",                                               Country = "Russia",                         Continent = "Europe",        Winner = "France" },
            new Game() { GameId = 29, Year = 2019, Gender = "Women", City = "Lyon",                                                 Country = "France",                         Continent = "Europe",        Winner = "United States" },
            new Game() { GameId = 30, Year = 2022, Gender = "Men",   City = "Doha",                                                 Country = "Qatar",                          Continent = "Asia",          Winner = "Argentina" },
            new Game() { GameId = 31, Year = 2023, Gender = "Women", City = "Sydney",                                               Country = "Australia",                      Continent = "Oceania",       Winner = "Spain" },
            new Game() { GameId = 32, Year = 2026, Gender = "Men",   City = "Mexico City/New York/New Jersey/Toronto/Vancouver",    Country = "Mexico,United States,Canada",    Continent = "North America", Winner = "TBD" },
            new Game() { GameId = 33, Year = 2027, Gender = "Women", City = "Rio de Janeiro",                                       Country = "Brazil",                         Continent = "South America", Winner = "TBD" },
        };
        return games;
    }
}
