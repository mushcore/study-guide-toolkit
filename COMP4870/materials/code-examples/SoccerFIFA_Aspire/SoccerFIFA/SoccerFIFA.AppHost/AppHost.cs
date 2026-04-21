var builder = DistributedApplication.CreateBuilder(args);

var sqlServerDb = builder.AddSqlServer("theserver")
                 .AddDatabase("sqldata");

var api = builder.AddProject<Projects.WebApiFIFA>("backend")
.WithReference(sqlServerDb)
.WaitFor(sqlServerDb)
.WithEnvironment("ParentCompany", builder.Configuration["Company"]);

builder.AddProject<Projects.BlazorFIFA>("frontend")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
