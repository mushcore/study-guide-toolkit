using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;

namespace CommunityApp.Data;

public static class SeedData
{
    public static void Seed(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Province>().HasData(
            GetProvinces()
        );
        modelBuilder.Entity<City>().HasData(
            GetCities()
        );
    }

    public static List<Province> GetProvinces()
    {
        List<Province> provinces = new List<Province>() {
            new Province() {
                ProvinceCode = "BC",
                ProvinceName = "British Columbia",
            },
            new Province() {
                ProvinceCode = "AB",
                ProvinceName = "Alberta",
            },
            new Province() {
                ProvinceCode = "ON",
                ProvinceName = "Ontario",
            },
        };

        return provinces;
    }

    public static List<City> GetCities()
    {
        List<City> cities = new List<City>() {
            new City {
                CityId = 1,
                CityName = "Vancouver",
                Population = 675218,
                ProvinceCode = "BC"
            },
            new City {
                CityId = 2,
                CityName = "Surrey",
                Population = 590000,
                ProvinceCode = "BC"
            },
            new City {
                CityId = 3,
                CityName = "Victoria",
                Population = 394000,
                ProvinceCode = "BC"
            },
            new City {
                CityId = 4,
                CityName = "Calgary",
                Population = 1336000,
                ProvinceCode = "AB"
            },
            new City {
                CityId = 5,
                CityName = "Edmonton",
                Population = 1010000,
                ProvinceCode = "AB"
            },
            new City {
                CityId = 6,
                CityName = "Red Deer",
                Population = 100844,
                ProvinceCode = "AB"
            },
            new City {
                CityId = 7,
                CityName = "Toronto",
                Population = 2794356,
                ProvinceCode = "ON"
            },
            new City {
                CityId = 8,
                CityName = "Ottawa",
                Population = 1017449,
                ProvinceCode = "ON"
            },
            new City {
                CityId = 9,
                CityName = "Mississauga",
                Population = 717961,
                ProvinceCode = "ON"
            },
        };

        return cities;
    }
}
