using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Sports.Data.Migrations
{
    /// <inheritdoc />
    public partial class M1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    TeamName = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    City = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.TeamName);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    PlayerId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", nullable: true),
                    LastName = table.Column<string>(type: "TEXT", nullable: true),
                    Position = table.Column<string>(type: "TEXT", nullable: true),
                    TeamName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.PlayerId);
                    table.ForeignKey(
                        name: "FK_Players_Teams_TeamName",
                        column: x => x.TeamName,
                        principalTable: "Teams",
                        principalColumn: "TeamName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Teams",
                columns: new[] { "TeamName", "City" },
                values: new object[,]
                {
                    { "Blackhawks", "Chicago" },
                    { "Canucks", "Vancouver" },
                    { "Ducks", "Anaheim" },
                    { "Flames", "Calgary" },
                    { "Leafs", "Toronto" },
                    { "Lightening", "Tampa Bay" },
                    { "Oilers", "Edmonton" },
                    { "Sharks", "San Jose" }
                });

            migrationBuilder.InsertData(
                table: "Players",
                columns: new[] { "PlayerId", "FirstName", "LastName", "Position", "TeamName" },
                values: new object[,]
                {
                    { 1, "Sven", "Baertschi", "Forward", "Canucks" },
                    { 2, "Hendrik", "Sedin", "Left Wing", "Canucks" },
                    { 3, "John", "Rooster", "Right Wing", "Flames" },
                    { 4, "Bob", "Plumber", "Defense", "Oilers" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Players_TeamName",
                table: "Players",
                column: "TeamName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "Teams");
        }
    }
}
