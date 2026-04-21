using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Code1stUsersRoles.Data.Migrations
{
    /// <inheritdoc />
    public partial class M2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "bf84a70f-ecb4-4b71-8944-04eb102aa0cf", "6c906147-0425-4e59-951c-c5ddaa66c3e9" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "a8b9723a-3f3e-4d77-a3cb-564dc219dee3", "c9a335a7-50c4-40e4-8f15-0e979a1fbb63" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a8b9723a-3f3e-4d77-a3cb-564dc219dee3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bf84a70f-ecb4-4b71-8944-04eb102aa0cf");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "6c906147-0425-4e59-951c-c5ddaa66c3e9");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "c9a335a7-50c4-40e4-8f15-0e979a1fbb63");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                    { "a8b9723a-3f3e-4d77-a3cb-564dc219dee3", null, "Admin", "ADMIN" },
                    { "bf84a70f-ecb4-4b71-8944-04eb102aa0cf", null, "Member", "MEMBER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "6c906147-0425-4e59-951c-c5ddaa66c3e9", 0, "fae72551-e94b-484e-af35-df7aad0c90d6", "mm@mm.mm", true, false, null, "MM@MM.MM", "MM@MM.MM", "AQAAAAIAAYagAAAAEJA5+PIi9ySMx4ZaPtYKjBMT2IFDudtwqWKPJXktcNATAByTp2zwVFF4JzAhTzpyHw==", null, false, "4ffec1b5-f31f-4251-a3e6-1d465073158d", false, "mm@mm.mm" },
                    { "c9a335a7-50c4-40e4-8f15-0e979a1fbb63", 0, "e59fec76-6db5-469c-8ba3-f48bfc1d220d", "aa@aa.aa", true, false, null, "AA@AA.AA", "AA@AA.AA", "AQAAAAIAAYagAAAAEIc2SWyENA7visefS8QQqJBZNCyHkJucYe0mdzj5db/uGfrHwkf6zQl7IGlQLas+hA==", null, false, "f9daa2f0-6653-4c55-b26c-c51aed9c3b0d", false, "aa@aa.aa" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "bf84a70f-ecb4-4b71-8944-04eb102aa0cf", "6c906147-0425-4e59-951c-c5ddaa66c3e9" },
                    { "a8b9723a-3f3e-4d77-a3cb-564dc219dee3", "c9a335a7-50c4-40e4-8f15-0e979a1fbb63" }
                });
        }
    }
}
