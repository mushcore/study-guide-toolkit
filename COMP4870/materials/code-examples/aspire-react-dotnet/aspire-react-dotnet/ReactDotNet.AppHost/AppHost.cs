using Microsoft.AspNetCore.Builder;

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.StudentsMinimalApi>("backend");

var frontend = builder.AddViteApp(name: "students-frontend", workingDirectory: "../students-react-ts")
    .WithReference(backend)
    .WaitFor(backend)
    .WithNpmPackageInstallation()
    .WithEnvironment("VITE_API_URL", backend.GetEndpoint("https"));


builder.Build().Run();
