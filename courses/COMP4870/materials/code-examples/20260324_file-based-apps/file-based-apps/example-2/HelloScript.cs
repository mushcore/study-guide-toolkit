#!/usr/bin/env dotnet
#:property TargetFramework=net9.0
var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
