using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HealthAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class M1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 40, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient", x => x.PatientId);
                });

            migrationBuilder.CreateTable(
                name: "Ailment",
                columns: table => new
                {
                    Name = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ailment", x => x.Name);
                    table.ForeignKey(
                        name: "FK_Ailment_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Medication",
                columns: table => new
                {
                    Name = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    Doses = table.Column<string>(type: "TEXT", nullable: true),
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medication", x => x.Name);
                    table.ForeignKey(
                        name: "FK_Medication_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Patient",
                columns: new[] { "PatientId", "Name" },
                values: new object[,]
                {
                    { 1, "Jim Jones" },
                    { 2, "Ann Smith" },
                    { 3, "Tom Myers" }
                });

            migrationBuilder.InsertData(
                table: "Ailment",
                columns: new[] { "Name", "PatientId" },
                values: new object[,]
                {
                    { "Bone fracture", 3 },
                    { "Covid", 2 },
                    { "Flu", 2 },
                    { "Headache", 1 },
                    { "Tummy pain", 1 }
                });

            migrationBuilder.InsertData(
                table: "Medication",
                columns: new[] { "Name", "Doses", "PatientId" },
                values: new object[,]
                {
                    { "Advil", "1 tablet per day", 2 },
                    { "Aspirin", "3 tablets per day", 1 },
                    { "Robaxin", "2 teaspoons per day", 3 },
                    { "Tylenol", "2 tablets per day", 1 },
                    { "Voltarin", "apply cream twice per day", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ailment_PatientId",
                table: "Ailment",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Medication_PatientId",
                table: "Medication",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ailment");

            migrationBuilder.DropTable(
                name: "Medication");

            migrationBuilder.DropTable(
                name: "Patient");
        }
    }
}
