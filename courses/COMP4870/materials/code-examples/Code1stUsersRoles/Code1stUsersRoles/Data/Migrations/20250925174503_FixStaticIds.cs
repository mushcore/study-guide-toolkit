using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Code1stUsersRoles.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixStaticIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "02fd7994-831e-4fd3-905b-2ca334272e14", "2d90b7c0-eaa4-4495-9cfc-f1a8e1013c8c" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "609579af-49d2-4e12-a639-2d3a0da115ea", "98e87974-d5b4-45e1-8a5a-da3c4d59602c" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "02fd7994-831e-4fd3-905b-2ca334272e14");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "609579af-49d2-4e12-a639-2d3a0da115ea");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2d90b7c0-eaa4-4495-9cfc-f1a8e1013c8c");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "98e87974-d5b4-45e1-8a5a-da3c4d59602c");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1", "1", "Admin", "ADMIN" },
                    { "2", "2", "Member", "MEMBER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "admin-user-id", 0, "admin-concurrency-stamp", "aa@aa.aa", true, false, null, "AA@AA.AA", "AA@AA.AA", "AQAAAAIAAYagAAAAEI9TZgKflMc9GWzVfcIMuVAFN61Nx5vPZPz0tcrqTOQM+jlZSk4kDRTfB1JN3fxcEA==", null, false, "admin-security-stamp", false, "aa@aa.aa" },
                    { "member-user-id", 0, "member-concurrency-stamp", "mm@mm.mm", true, false, null, "MM@MM.MM", "MM@MM.MM", "AQAAAAIAAYagAAAAEE6wjORcwa9D9cfJe7hOVP4CGSdSlCvQFgaFGS8QI9T2FvyHqqGa1Cr21Yn3ZvJBRA==", null, false, "member-security-stamp", false, "mm@mm.mm" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "1", "admin-user-id" },
                    { "2", "member-user-id" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "1", "admin-user-id" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "2", "member-user-id" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "member-user-id");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "02fd7994-831e-4fd3-905b-2ca334272e14", null, "Member", "MEMBER" },
                    { "609579af-49d2-4e12-a639-2d3a0da115ea", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "2d90b7c0-eaa4-4495-9cfc-f1a8e1013c8c", 0, "e8f98e65-c1e7-4a6d-8ead-3b9c147c8771", "mm@mm.mm", true, false, null, "MM@MM.MM", "MM@MM.MM", "AQAAAAIAAYagAAAAEPslZfvyofAPjyeHpFAYkkyo2JXWwtH/pQpfCRWoI1FoJSz7poUyB4OeC10qmvGubA==", null, false, "1c7612ef-3d11-4329-a7c4-28f620463867", false, "mm@mm.mm" },
                    { "98e87974-d5b4-45e1-8a5a-da3c4d59602c", 0, "41bdb84f-29b5-4e47-a61a-e3fa42c8e808", "aa@aa.aa", true, false, null, "AA@AA.AA", "AA@AA.AA", "AQAAAAIAAYagAAAAEF/ITdR0Ne1SU6ikQLpanqbw2D5+nw/cUchPiDARSYKrC7HqdybYFz3Ton3i/tXdsQ==", null, false, "2cedfcb1-0602-43c1-8112-1f07c18b7b8c", false, "aa@aa.aa" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "02fd7994-831e-4fd3-905b-2ca334272e14", "2d90b7c0-eaa4-4495-9cfc-f1a8e1013c8c" },
                    { "609579af-49d2-4e12-a639-2d3a0da115ea", "98e87974-d5b4-45e1-8a5a-da3c4d59602c" }
                });
        }
    }
}
