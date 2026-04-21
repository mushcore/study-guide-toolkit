---
"n": 5
id: 4870-code-aspire-apphost-stack
title: Aspire AppHost stack
lang: cs
variant: starter-solution
tags:
  - aspire
---

## Prompt

Write AppHost Program.cs that orchestrates: a Redis cache, a SQL Server with a database named <code>app</code>, an API project that references both, and a Web project that references the API and waits for it.

## Starter

```cs
var builder = DistributedApplication.CreateBuilder(args);

// TODO: Redis
// TODO: SQL + database
// TODO: API project referencing cache + db
// TODO: Web referencing API + waits

builder.Build().Run();
```

## Solution

```cs
var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");
var sql   = builder.AddSqlServer("sql");
var db    = sql.AddDatabase("app");

var api = builder.AddProject<Projects.Api>("api")
    .WithReference(cache)
    .WithReference(db);

builder.AddProject<Projects.Web>("web")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

## Why

<strong>Marking checklist (10 marks):</strong><ul><li>DistributedApplication.CreateBuilder(args) (1)</li><li>AddRedis("cache") (1)</li><li>AddSqlServer + AddDatabase (2)</li><li>AddProject&lt;Projects.Api&gt; (1)</li><li>WithReference(cache) + WithReference(db) on api (2)</li><li>Web WithReference(api) (1)</li><li>WaitFor(api) (1)</li><li>builder.Build().Run() (1)</li></ul>
