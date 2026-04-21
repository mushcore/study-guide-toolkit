using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BlazorStudents.Data.Migrations
{
    /// <inheritdoc />
    public partial class Stu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    School = table.Column<string>(type: "TEXT", nullable: false),
                    Gender = table.Column<string>(type: "TEXT", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserPasskeys",
                columns: table => new
                {
                    CredentialId = table.Column<byte[]>(type: "BLOB", maxLength: 1024, nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    Data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserPasskeys", x => x.CredentialId);
                    table.ForeignKey(
                        name: "FK_AspNetUserPasskeys_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "StudentId", "DateOfBirth", "FirstName", "Gender", "LastName", "School" },
                values: new object[,]
                {
                    { 1, new DateTime(1998, 6, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tom", "Male", "Max", "Nursing" },
                    { 2, new DateTime(2001, 9, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ann", "Female", "Fay", "Mining" },
                    { 3, new DateTime(1995, 4, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Joe", "Male", "Sun", "Nursing" },
                    { 4, new DateTime(1997, 12, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sue", "Female", "Fox", "Computing" },
                    { 5, new DateTime(1999, 7, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ben", "Male", "Ray", "Mining" },
                    { 6, new DateTime(2002, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Zoe", "Female", "Cox", "Business" },
                    { 7, new DateTime(2000, 10, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sam", "Male", "Ray", "Mining" },
                    { 8, new DateTime(1994, 3, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dan", "Male", "Ash", "Medicine" },
                    { 9, new DateTime(1996, 8, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pat", "Female", "Lee", "Computing" },
                    { 10, new DateTime(1993, 11, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kim", "Female", "Day", "Nursing" },
                    { 11, new DateTime(1999, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tim", "Male", "Rex", "Computing" },
                    { 12, new DateTime(2000, 5, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rob", "Male", "Ram", "Nursing" },
                    { 13, new DateTime(1995, 8, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jan", "Female", "Fry", "Mining" },
                    { 14, new DateTime(1998, 11, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jim", "Male", "Tex", "Nursing" },
                    { 15, new DateTime(1997, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ben", "Male", "Kid", "Business" },
                    { 16, new DateTime(2001, 7, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mia", "Female", "Chu", "Medicine" },
                    { 17, new DateTime(1996, 3, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ted", "Male", "Tao", "Computing" },
                    { 18, new DateTime(1994, 9, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Amy", "Female", "Day", "Nursing" },
                    { 19, new DateTime(1995, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ian", "Male", "Roy", "Nursing" },
                    { 20, new DateTime(2002, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liz", "Female", "Kit", "Nursing" },
                    { 21, new DateTime(1997, 12, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mat", "Male", "Tan", "Medicine" },
                    { 22, new DateTime(1996, 7, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Deb", "Female", "Roy", "Medicine" },
                    { 23, new DateTime(1998, 1, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ana", "Female", "Ray", "Mining" },
                    { 24, new DateTime(1995, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lyn", "Female", "Poe", "Computing" },
                    { 25, new DateTime(2000, 9, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Amy", "Female", "Raj", "Nursing" },
                    { 26, new DateTime(1999, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kim", "Female", "Ash", "Mining" },
                    { 27, new DateTime(2001, 11, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bec", "Female", "Kid", "Nursing" },
                    { 28, new DateTime(1997, 3, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eva", "Female", "Fry", "Computing" },
                    { 29, new DateTime(1996, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eli", "Male", "Lap", "Business" },
                    { 30, new DateTime(2001, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sam", "Male", "Yim", "Nursing" },
                    { 31, new DateTime(1997, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Joe", "Male", "Hui", "Mining" },
                    { 32, new DateTime(1998, 8, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liz", "Female", "Jin", "Nursing" },
                    { 33, new DateTime(1996, 12, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ric", "Male", "Kuo", "Business" },
                    { 34, new DateTime(1999, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pam", "Female", "Mak", "Computing" },
                    { 35, new DateTime(1994, 6, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cat", "Female", "Yao", "Medicine" },
                    { 36, new DateTime(1995, 9, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lou", "Male", "Zhu", "Mining" },
                    { 37, new DateTime(2000, 11, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tom", "Male", "Dag", "Business" },
                    { 38, new DateTime(1996, 2, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Stu", "Male", "Day", "Business" },
                    { 39, new DateTime(1998, 3, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tom", "Male", "Gad", "Mining" },
                    { 40, new DateTime(1997, 10, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bob", "Male", "Bee", "Business" },
                    { 41, new DateTime(1995, 12, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jim", "Male", "Ots", "Business" },
                    { 42, new DateTime(2001, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tom", "Male", "Mag", "Business" },
                    { 43, new DateTime(1999, 6, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hal", "Male", "Doe", "Mining" },
                    { 44, new DateTime(2002, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Roy", "Male", "Kim", "Mining" },
                    { 45, new DateTime(1993, 8, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Vis", "Male", "Cox", "Nursing" },
                    { 46, new DateTime(1994, 9, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kay", "Female", "Aga", "Nursing" },
                    { 47, new DateTime(1995, 7, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reo", "Male", "Hui", "Nursing" },
                    { 48, new DateTime(2001, 12, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bob", "Male", "Roe", "Mining" },
                    { 49, new DateTime(1996, 11, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jay", "Male", "Eff", "Computing" },
                    { 50, new DateTime(1997, 5, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eva", "Female", "Chu", "Business" },
                    { 51, new DateTime(1997, 4, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lex", "Male", "Rae", "Nursing" },
                    { 52, new DateTime(1995, 9, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lin", "Female", "Dex", "Mining" },
                    { 53, new DateTime(1998, 11, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liz", "Female", "Dag", "Business" },
                    { 54, new DateTime(1999, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ben", "Male", "Shy", "Computing" },
                    { 55, new DateTime(2000, 8, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rob", "Male", "Bos", "Nursing" },
                    { 56, new DateTime(1996, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ali", "Female", "Mac", "Business" },
                    { 57, new DateTime(1994, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Edi", "Male", "Gee", "Computing" },
                    { 58, new DateTime(1997, 12, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eva", "Female", "Cao", "Mining" },
                    { 59, new DateTime(1995, 2, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jun", "Male", "Lam", "Computing" },
                    { 60, new DateTime(2001, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eli", "Male", "Tao", "Computing" },
                    { 61, new DateTime(1998, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ana", "Female", "Bay", "Computing" },
                    { 62, new DateTime(1996, 11, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gil", "Male", "Tal", "Mining" },
                    { 63, new DateTime(1999, 7, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Wes", "Male", "Dey", "Nursing" },
                    { 64, new DateTime(2000, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nea", "Female", "Tan", "Computing" },
                    { 65, new DateTime(1994, 10, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ava", "Female", "Day", "Nursing" },
                    { 66, new DateTime(1998, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rie", "Female", "Ray", "Business" },
                    { 67, new DateTime(1995, 6, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ken", "Male", "Sim", "Nursing" },
                    { 68, new DateTime(1997, 11, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liz", "Female", "Kim", "Nursing" },
                    { 69, new DateTime(1996, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Max", "Male", "Fur", "Mining" },
                    { 70, new DateTime(2001, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Edi", "Male", "Kai", "Mining" },
                    { 71, new DateTime(1999, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Joe", "Male", "Sha", "Business" },
                    { 72, new DateTime(1997, 9, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gem", "Female", "Lin", "Nursing" },
                    { 73, new DateTime(1995, 12, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ama", "Female", "Kam", "Nursing" },
                    { 74, new DateTime(1998, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Zac", "Male", "Der", "Business" },
                    { 75, new DateTime(2000, 1, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liz", "Female", "Car", "Nursing" },
                    { 76, new DateTime(1996, 5, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kit", "Male", "Ngo", "Nursing" },
                    { 77, new DateTime(1997, 3, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tom", "Male", "Ren", "Computing" },
                    { 78, new DateTime(1994, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kal", "Male", "Hon", "Nursing" },
                    { 79, new DateTime(2002, 4, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Avi", "Male", "Gil", "Business" },
                    { 80, new DateTime(1995, 11, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ada", "Female", "Dao", "Business" },
                    { 81, new DateTime(1999, 12, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eva", "Female", "Kim", "Mining" },
                    { 82, new DateTime(1997, 7, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Amy", "Female", "Kam", "Computing" },
                    { 83, new DateTime(1996, 3, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Noa", "Male", "Sim", "Business" },
                    { 84, new DateTime(1998, 5, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ben", "Male", "Kai", "Computing" },
                    { 85, new DateTime(2000, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mae", "Female", "Car", "Business" },
                    { 86, new DateTime(1994, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mae", "Female", "Der", "Mining" },
                    { 87, new DateTime(2001, 2, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lee", "Male", "Hon", "Business" },
                    { 88, new DateTime(1997, 9, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gus", "Male", "Lin", "Business" },
                    { 89, new DateTime(1995, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ava", "Female", "Bay", "Nursing" },
                    { 90, new DateTime(2002, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ari", "Male", "Sim", "Mining" },
                    { 91, new DateTime(1996, 10, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kai", "Male", "Lee", "Business" },
                    { 92, new DateTime(1999, 5, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ali", "Female", "Doe", "Business" },
                    { 93, new DateTime(1994, 12, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ivy", "Female", "Kim", "Computing" },
                    { 94, new DateTime(1998, 3, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mia", "Female", "Sun", "Nursing" },
                    { 95, new DateTime(1996, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lia", "Female", "Fox", "Mining" },
                    { 96, new DateTime(1997, 6, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ian", "Male", "Day", "Business" },
                    { 97, new DateTime(1999, 8, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bra", "Male", "Tan", "Computing" },
                    { 98, new DateTime(2001, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Eli", "Male", "Chu", "Business" },
                    { 99, new DateTime(1995, 11, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Max", "Male", "Cox", "Nursing" },
                    { 100, new DateTime(1994, 9, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ann", "Female", "Kuo", "Business" },
                    { 101, new DateTime(1996, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liv", "Female", "Kim", "Computing" },
                    { 102, new DateTime(1998, 12, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jay", "Male", "Tan", "Mining" },
                    { 103, new DateTime(1999, 7, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ace", "Male", "Sun", "Nursing" },
                    { 104, new DateTime(2002, 1, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kit", "Male", "Doe", "Business" },
                    { 105, new DateTime(1995, 4, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kim", "Female", "Kay", "Nursing" },
                    { 106, new DateTime(1997, 6, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lyn", "Female", "Bar", "Business" },
                    { 107, new DateTime(1996, 8, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tae", "Male", "Sae", "Computing" },
                    { 108, new DateTime(1998, 12, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pri", "Female", "Day", "Nursing" },
                    { 109, new DateTime(1989, 4, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Naz", "Female", "Rai", "Nursing" },
                    { 110, new DateTime(1999, 6, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jan", "Female", "Ojo", "Business" },
                    { 111, new DateTime(2002, 7, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mac", "Male", "Mah", "Computing" },
                    { 112, new DateTime(2004, 9, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tim", "Male", "Maw", "Nursing" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserPasskeys_UserId",
                table: "AspNetUserPasskeys",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserPasskeys");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
