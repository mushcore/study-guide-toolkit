using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NorthwindLibrary.Migrations
{
    /// <inheritdoc />
    public partial class StoredProcs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"CREATE PROCEDURE dbo.CategoryInsertMedhat
            (
                @CategoryName nvarchar(15),
                @Description ntext
            )
            AS
            INSERT INTO Categories (CategoryName, Description)
            VALUES (@CategoryName, @Description)
            SELECT SCOPE_IDENTITY() AS id;";

            migrationBuilder.Sql(sp);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
