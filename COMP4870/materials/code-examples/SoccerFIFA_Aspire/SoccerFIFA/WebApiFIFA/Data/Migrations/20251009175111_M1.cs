using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApiFIFA.Data.Migrations
{
    /// <inheritdoc />
    public partial class M1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    GameId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Continent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Winner = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.GameId);
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "GameId", "City", "Continent", "Country", "Gender", "Winner", "Year" },
                values: new object[,]
                {
                    { 1, "Montevideo", "South America", "Uruguay", "Men", "Uruguay", 1930 },
                    { 2, "Rome", "Europe", "Italy", "Men", "Italy", 1934 },
                    { 3, "Paris", "Europe", "France", "Men", "Italy", 1938 },
                    { 4, "Rio de Janeiro", "South America", "Brazil", "Men", "Uruguay", 1950 },
                    { 5, "Bern", "Europe", "Switzerland", "Men", "West Germany", 1954 },
                    { 6, "Stockholm", "Europe", "Sweden", "Men", "Brazil", 1958 },
                    { 7, "Santiago", "South America", "Chile", "Men", "Brazil", 1962 },
                    { 8, "London", "Europe", "England", "Men", "England", 1966 },
                    { 9, "Mexico City", "North America", "Mexico", "Men", "Brazil", 1970 },
                    { 10, "Munich", "Europe", "West Germany", "Men", "West Germany", 1974 },
                    { 11, "Buenos Aires", "South America", "Argentina", "Men", "Argentina", 1978 },
                    { 12, "Madrid", "Europe", "Spain", "Men", "Italy", 1982 },
                    { 13, "Mexico City", "North America", "Mexico", "Men", "Argentina", 1986 },
                    { 14, "Rome", "Europe", "Italy", "Men", "West Germany", 1990 },
                    { 15, "Montevideo", "South America", "Uruguay", "Women", "Uruguay", 1991 },
                    { 16, "Los Angeles", "North America", "United States", "Men", "Brazil", 1994 },
                    { 17, "Rome", "Europe", "Italy", "Women", "Norway", 1995 },
                    { 18, "Paris", "Europe", "France", "Men", "France", 1998 },
                    { 19, "Pasadena/CA", "North America", "United States", "Women", "United States", 1999 },
                    { 20, "Seoul and Tokyo", "Asia", "South Korea and Japan", "Men", "Brazil", 2002 },
                    { 21, "Carson/CA", "North America", "United States", "Women", "Germany", 2003 },
                    { 22, "Berlin", "Europe", "Germany", "Men", "Italy", 2006 },
                    { 23, "Shanghai", "Asia", "China", "Women", "Germany", 2007 },
                    { 24, "Johannesburg", "Africa", "South Africa", "Men", "Spain", 2010 },
                    { 25, "Frankfurt", "Europe", "Germany", "Women", "Japan", 2011 },
                    { 26, "Rio de Janeiro", "South America", "Brazil", "Men", "Germany", 2014 },
                    { 27, "Vancouver", "North America", "Canada", "Women", "United States", 2015 },
                    { 28, "Moscow", "Europe", "Russia", "Men", "France", 2018 },
                    { 29, "Lyon", "Europe", "France", "Women", "United States", 2019 },
                    { 30, "Doha", "Asia", "Qatar", "Men", "Argentina", 2022 },
                    { 31, "Sydney", "Oceania", "Australia", "Women", "Spain", 2023 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}
