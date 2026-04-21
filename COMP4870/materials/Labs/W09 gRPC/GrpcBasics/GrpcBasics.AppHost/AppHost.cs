var builder = DistributedApplication.CreateBuilder(args);

var grpc = builder.AddProject<Projects.GrpcStudentsServer>("backend");

builder.AddProject<Projects.BlazorGrpcClient>("frontend")
    .WithReference(grpc)
    .WaitFor(grpc);

builder.Build().Run();
