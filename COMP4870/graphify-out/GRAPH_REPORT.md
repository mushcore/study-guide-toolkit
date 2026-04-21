# Graph Report - .  (2026-04-09)

## Corpus Check
- 488 files · ~82,189 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3403 nodes · 3641 edges · 265 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 354 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `COMP 4870 Intranet Planning and Development` - 47 edges
2. `SalesService` - 44 edges
3. `ISalesService` - 41 edges
4. `FinancialService` - 40 edges
5. `IFinancialService` - 38 edges
6. `SalesController` - 35 edges
7. `AdministrationService` - 25 edges
8. `IAdministrationService` - 23 edges
9. `PurchasingService` - 22 edges
10. `FinancialsController` - 21 edges

## Surprising Connections (you probably didn't know these)
- `MVC Consuming APIs` --semantically_similar_to--> `ASP.NET Controller Backend`  [INFERRED] [semantically similar]
  graphify-out/converted/MVC_app_ConsumeAPIs_SCRIPT_636da784.md → materials/assignments/4870-assignment-1v2.pdf
- `AI Toolkit VS Code Extension` --semantically_similar_to--> `C# Dev Kit`  [INFERRED] [semantically similar]
  graphify-out/converted/SLM_7ec8acdf.md → materials/resources/vs_code_extensions.pdf
- `Admin/Writer Role-Based Authentication` --semantically_similar_to--> `ApplicationDbContext with Extended Identity`  [INFERRED] [semantically similar]
  graphify-out/converted/4870-assignment-2_v0_f2c45408.md → materials/graphify-out/converted/ExtendUsersAndRoles_simple_6eba586a.md
- `TypeScript Serverless Azure Functions API` --semantically_similar_to--> `Express.js Framework`  [INFERRED] [semantically similar]
  materials/graphify-out/converted/Node_Azure_Functions_students_SCRIPT_cfd8d5d1.md → graphify-out/converted/Node with TypeScript_a8c143d0.md
- `Aspire AppHost` --conceptually_related_to--> `Dev Containers VS Code Extension`  [INFERRED]
  graphify-out/converted/aspire_SCRIPT_07c6306c.md → materials/resources/vs_code_extensions.pdf

## Hyperedges (group relationships)
- **MCP Server Implementation Patterns (W05 stdio vs W06 Azure Functions)** — w05_beverages_mcp_server, w06_fifa_mcp_server, w05_mcp_server_tool, w06_mcp_tool_trigger [EXTRACTED 1.00]
- **Aspire Orchestrates gRPC Server + Blazor Client** — w09_aspire_apphost, w09_grpc_students_server, w09_blazor_grpc_client, w09_aspire_service_discovery [EXTRACTED 1.00]
- **EF Core + SQLite Patterns (scaffold, migrations, GroupBy)** — w01_employee_department_app, w03_codefirst_communityapp, ef_lab_instructions, w01_dbcontext_scaffold, w03_sqlite_migrations [INFERRED 0.85]
- **Azure Deployment Pipeline Participants** — deployazure_webstar, deployazure_appservice, deployazure_deploymentcenter, deployazure_githubactions [EXTRACTED 1.00]
- **GoodBooks Accounting Domain Entities** — goodbooks_chartofaccounts, goodbooks_debitcreditrules, goodbooks_taccount, goodbooks_financialsmodule, gooddeedbooks_controlaccount [EXTRACTED 1.00]
- **ML.NET Training Workflow** — mlnet_mlcontext, mlnet_training, mlnet_fasttreeregressor, mlnet_evaluation, mlnet_predictionengine [EXTRACTED 1.00]
- **Services registered in Program.cs via DI container** — redis_addstackexchangerediscache, signalr_addsignalr, localization_addlocalization, identity_addidentity, grpc_addgrpcclient_di, common_program_cs [EXTRACTED 1.00]
- **EF Core DbContext pattern across topics** — grpc_school_db_context, webapi_health_context, identity_dbcontext, common_ef_dbcontext, common_sqlite, common_ef_migrations [EXTRACTED 1.00]
- **ASP.NET Core caching strategies (in-memory vs distributed)** — taghelper_cache, taghelper_memorycache_limitations, redis_distributed_cache, redis_game_service, redis_cache_invalidation [EXTRACTED 1.00]
- **COMP 4870 Learning Outcomes** — course_lo_architecture, course_lo_describe_dotnet, course_lo_csharp_programs, course_lo_aspnet_mvc_webforms, course_lo_restful_webapi, course_lo_security_auth, course_lo_ef_linq, course_lo_spa, course_lo_deploy_iis_azure [EXTRACTED 1.00]
- **IMemoryCache Configuration Options** — datacache_imemorycache, datacache_absolute_expiration, datacache_sliding_expiration, datacache_cacheitempriority [EXTRACTED 1.00]
- **Microsoft Agent Framework Stack** — maf_ai_models, maf_aiagent, maf_asaiagent, maf_aifunctionfactory, maf_aitool, maf_planner, slm_microsoft_agents_ai [EXTRACTED 1.00]
- **Midterm Exam Topics** — midterm_topic_mvc, midterm_topic_razor_pages, midterm_topic_lit, midterm_topic_sql, midterm_topic_server_js, midterm_topic_blazor, midterm_topic_webapi, midterm_topic_identity, midterm_topic_jwt, midterm_topic_ef_core, midterm_topic_mcp, midterm_topic_azure_functions, midterm_topic_swa, midterm_topic_signalr, midterm_topic_docker [EXTRACTED 1.00]

## Communities

### Community 0 - "GoodBooks Domain Entities"
Cohesion: 0.01
Nodes (163): AccountClass, Core.Domain.Financials, Dto.Financial, Address, Core.Domain, Dto.Common, AuditableAttribute, Core.Domain.Auditing (+155 more)

### Community 1 - "RazorStar Pages"
Cohesion: 0.01
Nodes (61): AccessDeniedModel, BindProcessDetailPageModel, RazorStar.Pages, BindProcessPageModel, RazorStar.Pages, ChartPageModel, MyApp.Namespace, ConfirmEmailModel (+53 more)

### Community 2 - "EF Core Migrations"
Cohesion: 0.02
Nodes (53): BlazorGDB.Migrations, CreateIdentitySchema, MvcStar.Data.Migrations, RazorWebAppSQlServer.Data.Migrations, M1, SchoolAPI.Data.Migrations, M1, SchoolLibrary.Data.Migrations (+45 more)

### Community 3 - "Identity Account Controllers"
Cohesion: 0.02
Nodes (36): AccountController, AccountGoWeb.Controllers, Api.Controllers, AuditController, BaseController, AccountGoWeb.Controllers, Api.Controllers, BaseController (+28 more)

### Community 4 - "Admin & Tax Services"
Cohesion: 0.02
Nodes (13): AdministrationService, Services.Administration, DonationsService, Services.Donations, Core.Domain.Error, IAdministrationService, IAdministrationService, Services.Administration (+5 more)

### Community 5 - "PurchaseInvoice React Form"
Cohesion: 0.02
Nodes (17): CancelPurchaseInvoiceButton, Dto.Purchasing, PostButton, PurchaseInvoice, PurchaseInvoiceHeader, PurchaseInvoiceLine, ValidationErrors, Core.Domain.Purchases (+9 more)

### Community 6 - "Assignment 2 & Aspire"
Cohesion: 0.02
Nodes (101): Aspire React+TypeScript+Vite Template (aspire-react-dotnet), Aspire React+dotnet Blog Reference, .NET Aspire Orchestration, Aspire Orchestration (aspire run), ASP.NET MVC + WebAPI Controllers, Client-side Blazor WASM Frontend, Blazor WASM Frontend, Assignment 2 Mini-CMS (+93 more)

### Community 7 - "AuditableAttribute Service"
Cohesion: 0.03
Nodes (15): AuditableAttributeService, Services.Auditing, AuditableEntityService, Services.Auditing, BaseService, BaseService, Services, IAuditableAttributeService (+7 more)

### Community 8 - "EF Core Fundamentals Lab"
Cohesion: 0.03
Nodes (78): appsettings.json ConnectionStrings, Entity Framework DbContext pattern, EF migrations (add M1, database update), SQLite provider (UseSqlite), EF Console App with Departments and Employees, dotnet-ef Tool, Entity Framework GroupBy Query, EF Lab SQLite Database (+70 more)

### Community 9 - "Student React App (W04)"
Cohesion: 0.03
Nodes (13): App(), IGradable, IGradable, Home, Routes, loadActiveNavLink(), loadExpandedNavbar(), loadNavbarState() (+5 more)

### Community 10 - "AI Agents MAF/Semantic Kernel"
Cohesion: 0.03
Nodes (75): AIAgent (MAF), AIFunctionFactory, GitHub AI Models Inference Endpoint, GPT-4o-mini Model, MAF Native Plugins, MAF Planner with Plugins, Semantic Kernel Prompt Templates (skprompt.txt), WeatherService Plugin (+67 more)

### Community 11 - "GoodBooks React CommonStore"
Cohesion: 0.03
Nodes (12): CommonStore, CancelInvoiceButton, Dto.Sales, PostButton, PrintButton, SalesInvoice, SalesInvoiceHeader, SalesInvoiceLine (+4 more)

### Community 12 - "BCIT COMP4870 Course Outline"
Cohesion: 0.03
Nodes (73): Assignment 1 Posting (Week 3), COMP 4870 Intranet Planning and Development, Course Credits: 7, CRN 49852, End Date April 24 2026, Evaluation: 2 Assignments 20%, Evaluation: Final Exam 20%, Evaluation: Lab Work 20% (+65 more)

### Community 13 - "Assignment 1 Mini-CMS"
Cohesion: 0.04
Nodes (64): 3-Tier Architecture (Assignment 1), ASP.NET Controller Backend (Assignment 1), ASP.NET Controller Backend, Entity Framework (Assignment 1 DAL), Assignment 1: Full-Stack Mini-CMS, Assignment 1: Full-Stack Mini-CMS, React.js Frontend (Assignment 1), React.js SPA Frontend (Assignment 1) (+56 more)

### Community 14 - "JournalEntry React Form"
Cohesion: 0.04
Nodes (11): CancelJournalEntryButton, Dto.Financial, JournalEntry, JournalEntryHeader, JournalEntryLine, PostJournalEntryButton, ValidationErrors, Core.Domain.Financials (+3 more)

### Community 15 - "SalesOrder React Form"
Cohesion: 0.05
Nodes (9): CancelOrderButton, Dto.Sales, SalesOrder, SalesOrderHeader, SalesOrderLine, SaveOrderButton, Core.Domain.Sales, SalesOrderLine (+1 more)

### Community 16 - "Caching & Localization"
Cohesion: 0.05
Nodes (45): Cache Tag Helper (<cache>), MemoryCache (ASP.NET In-Process Cache), Rationale: MemoryCache Limitations in Load-Balanced Deployments, ASP.NET Core DI Container (builder.Services), AddGrpcClient DI factory, AddLocalization service with ResourcesPath, CookieRequestCultureProvider (programmatic switch), CookieRequestCultureProvider (+37 more)

### Community 17 - "Security Service Permissions"
Cohesion: 0.05
Nodes (4): ISecurityService, Services.Security, SecurityService, Services.Security

### Community 18 - "Azure & IIS Deployment"
Cohesion: 0.05
Nodes (44): Azure App Service (.NET 10), Azure Deployment Center, dotnet watch run, GitHub Actions Pipeline, Deploy Razor Pages to Azure, WebStar Razor App, App_Data Folder Permissions, IIS Application Pool (+36 more)

### Community 19 - "ASP.NET Aspire AppHost"
Cohesion: 0.06
Nodes (43): AddConnectionString, AddProject Builder Extension, AddSqlServer / AddDatabase, AddSqlServerDbContext, Aspire AppHost, BlazorFIFA Frontend, Aspire.NET, .NET Aspire (+35 more)

### Community 20 - "ApiDbContext EF Config"
Cohesion: 0.06
Nodes (14): Api.Data, ApiDbContext, ApplicationDbContext, WebApiFIFA.Data, Api.Data, ApplicationIdentityDbContext, CompanyContext, DbContext (+6 more)

### Community 21 - "Account Debit/Credit Domain"
Cohesion: 0.06
Nodes (11): Account, Core.Domain.Financials, Dto.Financial, Api.Controllers, BasicModuleLoaderTests, Module.Tests, Extensions, IdentityComponentsEndpointRouteBuilderExtensions (+3 more)

### Community 22 - "IPurchasingService Interface"
Cohesion: 0.06
Nodes (4): IPurchasingService, Services.Purchasing, PurchasingService, Services.Purchasing

### Community 23 - "IFinancialService Interface"
Cohesion: 0.05
Nodes (4): IFinancialService, Api.Service, IFinancialService, Services.Financial

### Community 24 - "FinancialService Implementation"
Cohesion: 0.06
Nodes (3): Api.Service, FinancialService, Services.Financial

### Community 25 - "EfRepository Pattern"
Cohesion: 0.06
Nodes (16): EfRepository, Api.Data, EfRepository, IPurchaseOrderRepository, Core.Data, IPurchaseOrderRepository, IRepository, Core.Data (+8 more)

### Community 26 - "SalesController"
Cohesion: 0.07
Nodes (3): AccountGoWeb.Controllers, Api.Controllers, SalesController

### Community 27 - "GoodBooks Architecture Overview"
Cohesion: 0.07
Nodes (34): Expanded Account Codes (10000-50000), AccountGo Accounting System, AccountGoWeb (Front-end), Accounts Payable Module, Accounts Receivable Module, AdminLTE Admin Template, AdminLTE Setup Guide, AccountGo Api (Back-end) (+26 more)

### Community 28 - "IInventoryService Interface"
Cohesion: 0.06
Nodes (4): IInventoryService, Services.Inventory, InventoryService, Services.Inventory

### Community 29 - "SalesQuotation DTO"
Cohesion: 0.09
Nodes (6): Dto.Sales, SalesQuotation, SalesQuotationLine, SalesQuotations, SalesQuotationLine, SalesQuotationStore

### Community 30 - "ITaxService Interface"
Cohesion: 0.07
Nodes (4): ITaxService, Services.TaxSystem, Services.TaxSystem, TaxService

### Community 31 - "AI Backend Integration"
Cohesion: 0.07
Nodes (30): AI Integration into Backend, Rationale: Session persists chat history across HTTP requests, Rationale: Azurite required for MCP queue-based SSE transport, IChatCompletionService, ChatHistory with System Prompt, W02 GitHub AI Model with Semantic Kernel, GitHub Models Inference Endpoint, GitHub Personal Access Token (+22 more)

### Community 32 - "Midterm Exam Info"
Cohesion: 0.08
Nodes (30): February 27 2026, 60 Minutes Duration, Midterm Exam, Coding Question, Match Two Columns, Multiple Choice Questions, Hand-Written Exam, Material Covered First 6 Weeks (+22 more)

### Community 33 - "PatientsController Web API"
Cohesion: 0.08
Nodes (7): ControllerBase, PatientsController, ConsumeStudentsAPI.Controllers, SchoolAPI.Controllers, StudentsController, SchoolAPI.Controllers, WeatherForecastController

### Community 34 - "Security Repositories"
Cohesion: 0.08
Nodes (11): IGroupRepository, IRoleRepository, ISecurityRepository, Core.Data, IGroupRepository, IRoleRepository, ISecurityRepository, IUserRepository (+3 more)

### Community 35 - "DbContext Model Snapshots"
Cohesion: 0.08
Nodes (17): ApplicationDbContextModelSnapshot, Code1stUsersRoles.Data.Migrations, MvcStar.Data.Migrations, RazorWebAppSQlServer.Data.Migrations, Sports.Data.Migrations, WebApiFIFA.Data.Migrations, HealthAPI.Data.Migrations, HealthContextModelSnapshot (+9 more)

### Community 36 - "FinancialsController"
Cohesion: 0.1
Nodes (3): AccountGoWeb.Controllers, Api.Controllers, FinancialsController

### Community 37 - "W03 Code-First CommunityApp"
Cohesion: 0.09
Nodes (23): Code-First DB Development + Seed, Rationale: Follow Sports lecture pattern for familiarity, ApplicationDbContext, City Entity (int PK with FK), Code First Approach, W03 CommunityApp Code-First Lab, Province Entity (string PK), ASP.NET Core Razor Pages (+15 more)

### Community 38 - "PurchasingController"
Cohesion: 0.12
Nodes (3): AccountGoWeb.Controllers, Api.Controllers, PurchasingController

### Community 39 - "StudentService Blazor"
Cohesion: 0.11
Nodes (2): ServerSideBlazor.Services, StudentService

### Community 40 - "DB Initializer CSV Seed"
Cohesion: 0.2
Nodes (2): Api.Data, Initializer

### Community 41 - "JWT AuthenticationService"
Cohesion: 0.16
Nodes (4): Api.Service, AuthenticationService, Api.Service, IAuthenticationService

### Community 42 - "SignalR Sketchpad"
Cohesion: 0.17
Nodes (7): drawDot(), getMousePos(), sketchpad_mouseDown(), sketchpad_mouseMove(), Export2PDFModel, MyApp.Namespace, PdfReportModel

### Community 43 - "AdministrationController"
Cohesion: 0.12
Nodes (3): AccountGoWeb.Controllers, AdministrationController, Api.Controllers

### Community 44 - "FIFA MCP Tools"
Cohesion: 0.15
Nodes (3): BackgroundService, FifaTools, Worker

### Community 45 - "SelectListItemHelper"
Cohesion: 0.14
Nodes (1): SelectListItemHelper

### Community 46 - "TaxController"
Cohesion: 0.14
Nodes (3): AccountGoWeb.Controllers, Api.Controllers, TaxController

### Community 47 - "GeneralLedgerHeader Domain"
Cohesion: 0.27
Nodes (2): Core.Domain.Financials, GeneralLedgerHeader

### Community 48 - "EF Lab Queries GroupBy"
Cohesion: 0.21
Nodes (13): departments Table, employees Table, GroupBy Method Syntax, GroupBy Query Syntax, EF Lab Instructions, Reverse Engineer DB with dotnet-ef, SQLite Database Setup Script, CompanyContext (Scaffolded DbContext) (+5 more)

### Community 49 - "TDD xUnit Red-Green"
Cohesion: 0.17
Nodes (12): Red-Green TDD Principle (Fail First), Assert.Equal (xUnit), dotnet test Command, [Fact] Attribute (xUnit), Fail-First TDD Principle, FizzBuzz TDD Example (xUnit), GitHub Copilot Test Generation, MSTest Framework (+4 more)

### Community 50 - "Identity Auth State Provider"
Cohesion: 0.2
Nodes (3): IdentityRevalidatingAuthenticationStateProvider, PersistingRevalidatingAuthenticationStateProvider, RevalidatingServerAuthenticationStateProvider

### Community 51 - "Manage Nav Pages"
Cohesion: 0.33
Nodes (1): ManageNavPages

### Community 52 - "Beverage Web API Domain"
Cohesion: 0.18
Nodes (6): Beverage, BeverageContext, FifaWorldCup, FifaWorldCupContext, JsonSerializerContext, AppJsonSerializerContext

### Community 53 - "Mock Repository Fixtures"
Cohesion: 0.24
Nodes (1): MockRepositoryFixtures

### Community 54 - "NetStandard Sample"
Cohesion: 0.18
Nodes (4): Class1, SampleNetStandard20, Infrastructure, IStartup

### Community 55 - "BeverageService"
Cohesion: 0.36
Nodes (1): BeverageService

### Community 56 - "FifaService"
Cohesion: 0.36
Nodes (1): FifaService

### Community 57 - "File-Based C# Apps Spectre"
Cohesion: 0.27
Nodes (10): File-Based C# Apps (single .cs file), File Based C# Apps Lab Instructions, #:package Inline Package Directive, Spectre.Console Library, students.json Data Source, Rationale: Spectre.Console beautifies plain text output, filterStudents.cs Single File App, W11 FilteredStudents Lab Solution (+2 more)

### Community 58 - "ML.NET AutoML Pipeline"
Cohesion: 0.22
Nodes (10): ML.NET CLI (mlnet) AutoML, ConsumeModel.Predict in MVC HomeController, FastTreeRegression trainer (best model), FastTreeTweedieRegression (VS2022 pick), Features vs Label concept, .mbconfig model configuration file, mlnet regression scenario, ML Scenarios (Classification, Image, Regression, Forecasting, Recommendation) (+2 more)

### Community 59 - "GameService"
Cohesion: 0.22
Nodes (1): GameService

### Community 60 - "Distributed Cache Tag Helper"
Cohesion: 0.31
Nodes (9): Cache Tag Helper Script (ASP.NET Core), Cache Tag Helper (<cache>), Cache Tag Helper vary-by Attributes, DistributedCacheExtensions (GetOrSetAsync pattern), IDistributedCache Interface, IMemoryCache (In-Memory Cache), Redis Distributed Cache, StackExchange.Redis Package (+1 more)

### Community 61 - "BeverageTools MCP"
Cohesion: 0.22
Nodes (1): BeverageTools

### Community 62 - "Passkey WebAuthn JS"
Cohesion: 0.42
Nodes (7): connectedCallback(), createCredential(), fetchWithErrorHandling(), obtainAndSubmitCredential(), obtainCredential(), requestCredential(), tryAutofillPasskey()

### Community 63 - "BaseServiceTests"
Cohesion: 0.22
Nodes (1): BaseServiceTests

### Community 64 - "BaseDtoTests"
Cohesion: 0.22
Nodes (2): BaseDtoTests, TestDto

### Community 65 - "CompanyDtoTests"
Cohesion: 0.22
Nodes (1): CompanyDtoTests

### Community 66 - "AuditLogHelper"
Cohesion: 0.36
Nodes (2): Api.Data, AuditLogHelper

### Community 67 - "Module Infrastructure"
Cohesion: 0.22
Nodes (5): AssemblyInfo, Infrastructure.Module, ModuleDescriptor, Infrastructure.Plugin, PluginDescriptor

### Community 68 - "FinancialHelper Utility"
Cohesion: 0.28
Nodes (2): FinancialHelper, Services.Financial

### Community 69 - "HttpWebApi Consumer"
Cohesion: 0.25
Nodes (1): HttpWebApi

### Community 70 - "SignalR ChatHub & DrawDotHub"
Cohesion: 0.25
Nodes (3): ChatHub, DrawDotHub, Hub

### Community 71 - "Blazor Chat Razor Component"
Cohesion: 0.39
Nodes (1): Chat

### Community 72 - "ServiceExtensions Cors/Identity"
Cohesion: 0.25
Nodes (2): Api.Extensions, ServiceExtensions

### Community 73 - "AutoMapper Profile"
Cohesion: 0.25
Nodes (6): IValueResolver, AccountGoWeb, Api, CustomSalesInvoiceResolver, MappingProfile, Profile

### Community 74 - "W04 React GitHub Pages Deploy"
Cohesion: 0.29
Nodes (8): Rationale: GitHub Pages serves at subpath not root, GitHub Actions deploy.yml Workflow, GitHub Pages Hosting, W04 React Vite GitHub Pages Deploy Lab, React Router basename, students-react-ts Vite React App, TypeScript + Vite Build (tsc -b && vite build), Vite Base Path Configuration

### Community 75 - "StudentsService Web API"
Cohesion: 0.29
Nodes (1): StudentsService

### Community 76 - "SeedData Extension"
Cohesion: 0.48
Nodes (1): SeedData

### Community 77 - "TaxiFare ML Model"
Cohesion: 0.29
Nodes (4): ModelInput, ModelOutput, TaxiFareModel, TaxiFareModel.ConsoleApp

### Community 78 - "Identity Redirect Manager"
Cohesion: 0.48
Nodes (1): IdentityRedirectManager

### Community 79 - "IAccountService Interface"
Cohesion: 0.29
Nodes (1): IAccountService

### Community 80 - "AAA Pattern & Moq"
Cohesion: 0.33
Nodes (7): AAA Pattern (Arrange-Act-Assert), BaseServiceTests, CompanyDtoTests, MockRepositoryFixtures, Moq Mocking Library, GoodBooks.ServicesTests Project, xUnit Framework

### Community 81 - "ML.NET Regression Trainer"
Cohesion: 0.29
Nodes (7): Regression Evaluation (RSquared/RMSE), FastTreeRegressor Learner, Label vs Features, Model.Save/Load (Model.zip), One-Hot Encoding Transform, CreatePredictionEngine, Training Pipeline (pipeline.Fit)

### Community 82 - "File-Based Minimal API"
Cohesion: 0.33
Nodes (6): File-Based Apps (dotnet run file.cs), File-Based Minimal Web API, Spectre.Console in File-Based App, FilteredStudents File-Based App Lab, Spectre.Console Package, students.json Data File

### Community 83 - "ApiClient Wrapper"
Cohesion: 0.33
Nodes (1): ApiClient

### Community 84 - "ApplicationUser IdentityUser"
Cohesion: 0.33
Nodes (4): Api.Data, ApplicationUser, IdentityUser, XUser

### Community 85 - "ChatService"
Cohesion: 0.53
Nodes (1): ChatService

### Community 86 - "ToonTag Custom TagHelper"
Cohesion: 0.33
Nodes (6): @addTagHelper Directive, HtmlTargetElement Attribute, ProcessAsync Method (TagHelper), TagHelper Base Class, ToonTag Custom TagHelper, TagHelper Consuming Web API

### Community 87 - "IdentityNoOpEmailSender"
Cohesion: 0.33
Nodes (2): IdentityNoOpEmailSender, IEmailSender

### Community 88 - "Financial Reports"
Cohesion: 0.33
Nodes (5): BalanceSheet, IncomeStatement, MasterGeneralLedger, Services.Financial, TrialBalance

### Community 89 - "ValidationFilterAttribute"
Cohesion: 0.33
Nodes (3): IActionFilter, Api.ActionFilters, ValidationFilterAttribute

### Community 90 - "Seed Chart of Accounts"
Cohesion: 0.4
Nodes (2): Api.Data.Seed, SeedData

### Community 91 - "CollectionHelper"
Cohesion: 0.33
Nodes (2): Api.Helpers, CollectionHelper

### Community 92 - "Custom AssemblyLoadContext"
Cohesion: 0.33
Nodes (3): AssemblyLoadContext, CustomAssemblyLoadContext, Infrastructure.AssemblyLoader

### Community 93 - "AIFunctionFactory Tools"
Cohesion: 0.33
Nodes (6): AIFunctionFactory.Create, AITool Native Function, [Description] Attribute, Function Calling, MAF Planner Pattern, OpenWeatherMap API

### Community 94 - "VS Solution Setup Diagram"
Cohesion: 0.5
Nodes (5): DbContext Class Library, MSSQLLocalDB SQL Server Instance, Web App Project, Visual Studio Solution Structure Diagram, SQL Server Connection Details UI Screenshot

### Community 95 - "SeedUsersRoles"
Cohesion: 0.4
Nodes (1): SeedUsersRoles

### Community 96 - "DistributedCacheExtensions"
Cohesion: 0.5
Nodes (1): DistributedCacheExtensions

### Community 97 - "Patients SampleData"
Cohesion: 0.4
Nodes (1): SampleData

### Community 98 - "Ollama Docker AI Samples"
Cohesion: 0.4
Nodes (0): 

### Community 99 - "CreateIdentitySchema"
Cohesion: 0.4
Nodes (3): CreateIdentitySchema, MvcStar.Data.Migrations, RazorWebAppSQlServer.Data.Migrations

### Community 100 - "API Consumer Startup"
Cohesion: 0.4
Nodes (2): ConsumeStudentsAPI, Startup

### Community 101 - "ToonTag TagHelper"
Cohesion: 0.5
Nodes (2): TagHelper, ToonTag

### Community 102 - "Ollama Chat Client Config"
Cohesion: 0.5
Nodes (2): AIChatImgApp.Extensions, ClientConfigurationExtensions

### Community 103 - "QuickGrid Blazor"
Cohesion: 0.4
Nodes (5): QuickGrid Component (Blazor), GridSort (QuickGrid Sorting), PaginationState (QuickGrid), PropertyColumn (QuickGrid), TemplateColumn (QuickGrid)

### Community 104 - "TaxiFare Training Pipeline"
Cohesion: 0.5
Nodes (2): TaxiFareModel, TaxiFareModel.ConsoleApp

### Community 105 - "Blazor Reconnect Modal"
Cohesion: 0.5
Nodes (2): retry(), retryWhenDocumentBecomesVisible()

### Community 106 - "JournalEntry Tests"
Cohesion: 0.4
Nodes (1): JournalEntryTests

### Community 107 - "Account Tests"
Cohesion: 0.4
Nodes (1): AccountTests

### Community 108 - "Result Error Type"
Cohesion: 0.4
Nodes (2): Core.Domain.Error, Result

### Community 109 - "Allocation Domain"
Cohesion: 0.4
Nodes (2): Allocate, AllocationLine

### Community 110 - "Module Service Registration"
Cohesion: 0.5
Nodes (2): Infrastructure.Extensions, ServiceCollectionExtensions

### Community 111 - "SignalR Hubs Overview"
Cohesion: 0.67
Nodes (4): SignalR ChatHub, SignalR DrawDotHub (Sketchpad), SignalR Hub Base Class, SignalR JavaScript Client (chat.js / draw.js)

### Community 112 - "Small: 20250925174503_FixStaticIds.Designer.cs"
Cohesion: 0.5
Nodes (2): Code1stUsersRoles.Data.Migrations, FixStaticIds

### Community 113 - "Small: 20250925174050_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): Code1stUsersRoles.Data.Migrations, M1

### Community 114 - "Small: 20250925174250_M2.Designer.cs"
Cohesion: 0.5
Nodes (2): Code1stUsersRoles.Data.Migrations, M2

### Community 115 - "Small: 20240419180500_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, WebApiFIFA.Data.Migrations

### Community 116 - "Small: 20230225181242_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, SchoolAPI.Data.Migrations

### Community 117 - "Small: 20251009175111_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, WebApiFIFA.Data.Migrations

### Community 118 - "Small: 20260123181718_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): HealthAPI.Data.Migrations, M1

### Community 119 - "Temperature Conversion Sample"
Cohesion: 0.5
Nodes (1): TemperatureConversion

### Community 120 - "Small: 20260210183353_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): Code1stUsersRoles.Data.Migrations, M1

### Community 121 - "Small: 20250207195657_Validation.Designer.cs"
Cohesion: 0.5
Nodes (2): StudentsMinimalApi.Data.Migrations, Validation

### Community 122 - "Small: 20250128155758_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, StudentsMinimalApi.Data.Migrations

### Community 123 - "Small: 20231102204410_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, SchoolLibrary.Data.Migrations

### Community 124 - "Small: 20260123220341_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, StudentsMinimalApi.Data.Migrations

### Community 125 - "Small: 20240308194437_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, Reporting.Data.Migrations

### Community 126 - "Small: 20260109214550_StoredProcs.Designer.cs"
Cohesion: 0.5
Nodes (2): NorthwindLibrary.Migrations, StoredProcs

### Community 127 - "Small: Conversions.cs"
Cohesion: 0.5
Nodes (1): Conversions

### Community 128 - "Small: 20260303181047_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): GrpcStudentsServer.Data.Migrations, M1

### Community 129 - "Small: TemperatureHelper.cs"
Cohesion: 0.5
Nodes (1): TemperatureHelper

### Community 130 - "Small: 20260120180922_M1.Designer.cs"
Cohesion: 0.5
Nodes (2): M1, Sports.Data.Migrations

### Community 131 - "Small: TreeViewAccounts.cs"
Cohesion: 0.5
Nodes (3): Dto.Financial, Group, TreeViewAccounts

### Community 132 - "Small: MessageSource.cs"
Cohesion: 0.5
Nodes (2): Core, MessageSource

### Community 133 - "Small: AuthenticationStateProvider"
Cohesion: 0.5
Nodes (2): AuthenticationStateProvider, PersistentAuthenticationStateProvider

### Community 134 - "Small: AccountViewModel.cs"
Cohesion: 0.5
Nodes (3): AccountGoWeb.Models.Financial, AccountViewModel, LibraryGDB.Models.Financial

### Community 135 - "Small: DonationInvoiceViewModel.cs"
Cohesion: 0.5
Nodes (3): DonationInvoiceLineViewModel, DonationInvoiceViewModel, LibraryGDB.Models.Donations

### Community 136 - "Small: AmountToPayValidationAttribute.cs"
Cohesion: 0.5
Nodes (2): AmountToPayValidationAttribute, ValidationAttribute

### Community 137 - "Small: DatabaseSeeder.cs"
Cohesion: 0.5
Nodes (2): Api.Data.Seed, DatabaseSeeder

### Community 138 - "Small: AssemblyLoaderManager.cs"
Cohesion: 0.5
Nodes (2): AssemblyLoaderManager, Infrastructure.AssemblyLoader

### Community 139 - "Small: custom.js"
Cohesion: 0.5
Nodes (0): 

### Community 140 - "Small: Cartoon Characters Web API Endpoint"
Cohesion: 0.67
Nodes (3): Cartoon Characters Web API Endpoint, TagHelper Base Class, Custom Toon Tag Helper

### Community 141 - "Small: Docker AI Models"
Cohesion: 0.67
Nodes (3): Docker AI Models, Llama 3.2 Model, Ministral3 Model

### Community 142 - "Small: Game.cs"
Cohesion: 0.67
Nodes (2): Game, LibraryFIFA

### Community 143 - "Small: ContinentCount.cs"
Cohesion: 0.67
Nodes (2): ContinentCount, LibraryFIFA

### Community 144 - "Small: WeatherForecast.cs"
Cohesion: 0.67
Nodes (2): SchoolAPI, WeatherForecast

### Community 145 - "Small: Utils.cs"
Cohesion: 0.67
Nodes (1): Utils

### Community 146 - "Small: Constants.cs"
Cohesion: 0.67
Nodes (2): Constants, Infrastructure.AssemblyLoader

### Community 147 - "Small: ErrorViewModel.cs"
Cohesion: 0.67
Nodes (2): ConsumeStudentsAPI.Models, ErrorViewModel

### Community 148 - "Small: IdentityRole"
Cohesion: 0.67
Nodes (2): IdentityRole, XRole

### Community 149 - "Small: WeatherForecastService.cs"
Cohesion: 0.67
Nodes (1): WeatherForecastService

### Community 150 - "Small: StudentPartial.cs"
Cohesion: 0.67
Nodes (1): Student

### Community 151 - "Small: Toon.cs"
Cohesion: 0.67
Nodes (1): Toon

### Community 152 - "Small: ToonService.cs"
Cohesion: 0.67
Nodes (1): ToonService

### Community 153 - "Small: SharedResourceService.cs"
Cohesion: 0.67
Nodes (1): SharedResourceService

### Community 154 - "Small: GreeterService.cs"
Cohesion: 0.67
Nodes (1): GreeterService

### Community 155 - "Small: ImageContext.cs"
Cohesion: 0.67
Nodes (2): AIChatImgApp.Model, ImageContext

### Community 156 - "Small: JSON File Reading in C#"
Cohesion: 0.67
Nodes (3): JSON File Reading in C#, Spectre.Console Package, File-Based C# Apps Lab (Spectre.Console, JSON filtering)

### Community 157 - "Small: IIS (Internet Information Services)"
Cohesion: 0.67
Nodes (3): IIS (Internet Information Services), SQL Server LocalDB, Deploy ASP.NET App with LocalDB to IIS

### Community 158 - "Small: IHttpClientFactory (MVC API Consumer)"
Cohesion: 0.67
Nodes (3): IHttpClientFactory (MVC API Consumer), Newtonsoft.Json (JSON Serialization), StudentsController (Consume External API)

### Community 159 - "Small: BaseModel.cs"
Cohesion: 0.67
Nodes (2): BaseDto, Dto

### Community 160 - "Small: TaxForUpdate.cs"
Cohesion: 0.67
Nodes (2): Dto.TaxSystem, TaxForUpdate

### Community 161 - "Small: TaxForCreation.cs"
Cohesion: 0.67
Nodes (2): Dto.TaxSystem, TaxForCreation

### Community 162 - "Small: SalesDelivery.cs"
Cohesion: 0.67
Nodes (2): Dto.Sales, SalesDelivery

### Community 163 - "Small: CreateCustomer.cs"
Cohesion: 0.67
Nodes (2): CreateCustomer, Dto.Sales

### Community 164 - "Small: MonthlySales.cs"
Cohesion: 0.67
Nodes (2): Dto.Sales, MonthlySales

### Community 165 - "Small: Status.cs"
Cohesion: 0.67
Nodes (2): Dto.Common, Status

### Community 166 - "Small: Hello.tsx"
Cohesion: 0.67
Nodes (1): Hello

### Community 167 - "Small: IdentityUserAccessor.cs"
Cohesion: 0.67
Nodes (1): IdentityUserAccessor

### Community 168 - "Small: ObjectExtensions.cs"
Cohesion: 0.67
Nodes (1): ObjectExtensions

### Community 169 - "Small: ModuleConfig.cs"
Cohesion: 0.67
Nodes (2): Infrastructure.Module, ModuleConfig

### Community 170 - "Small: ModuleManager.cs"
Cohesion: 0.67
Nodes (2): Infrastructure.Module, ModuleManager

### Community 171 - "Small: ModuleLoader.cs"
Cohesion: 0.67
Nodes (2): Infrastructure.Module, ModuleLoader

### Community 172 - "Small: EditTaxViewModel.cs"
Cohesion: 0.67
Nodes (2): AccountGoWeb.Models.TaxSystem, EditTaxViewModel

### Community 173 - "Small: MLContext (seed=0 deterministic)"
Cohesion: 1.0
Nodes (3): MLContext (seed=0 deterministic), TaxiFarePrediction ML.NET Project, TaxiTrip Data Model

### Community 174 - "Small: HomePage React Component Reference"
Cohesion: 0.67
Nodes (3): HomePage React Component Reference, HomePage.tsx Label Image, HomePage.tsx Text Label

### Community 175 - "Small: OrderDetail.cs"
Cohesion: 1.0
Nodes (1): OrderDetail

### Community 176 - "Small: OrderSubtotal.cs"
Cohesion: 1.0
Nodes (1): OrderSubtotal

### Community 177 - "Small: Region.cs"
Cohesion: 1.0
Nodes (1): Region

### Community 178 - "Small: ProductsByCategory.cs"
Cohesion: 1.0
Nodes (1): ProductsByCategory

### Community 179 - "Small: Territory.cs"
Cohesion: 1.0
Nodes (1): Territory

### Community 180 - "Small: Order.cs"
Cohesion: 1.0
Nodes (1): Order

### Community 181 - "Small: CustomerDemographic.cs"
Cohesion: 1.0
Nodes (1): CustomerDemographic

### Community 182 - "Small: SummaryOfSalesByYear.cs"
Cohesion: 1.0
Nodes (1): SummaryOfSalesByYear

### Community 183 - "Small: SummaryOfSalesByQuarter.cs"
Cohesion: 1.0
Nodes (1): SummaryOfSalesByQuarter

### Community 184 - "Small: ProductSalesFor1997.cs"
Cohesion: 1.0
Nodes (1): ProductSalesFor1997

### Community 185 - "Small: Shipper.cs"
Cohesion: 1.0
Nodes (1): Shipper

### Community 186 - "Small: QuarterlyOrder.cs"
Cohesion: 1.0
Nodes (1): QuarterlyOrder

### Community 187 - "Small: AspNetUserLogin.cs"
Cohesion: 1.0
Nodes (1): AspNetUserLogin

### Community 188 - "Small: Supplier.cs"
Cohesion: 1.0
Nodes (1): Supplier

### Community 189 - "Small: AspNetUser.cs"
Cohesion: 1.0
Nodes (1): AspNetUser

### Community 190 - "Small: Category.cs"
Cohesion: 1.0
Nodes (1): Category

### Community 191 - "Small: ProductsAboveAveragePrice.cs"
Cohesion: 1.0
Nodes (1): ProductsAboveAveragePrice

### Community 192 - "Small: Invoice.cs"
Cohesion: 1.0
Nodes (1): Invoice

### Community 193 - "Small: SalesByCategory.cs"
Cohesion: 1.0
Nodes (1): SalesByCategory

### Community 194 - "Small: OrderDetailsExtended.cs"
Cohesion: 1.0
Nodes (1): OrderDetailsExtended

### Community 195 - "Small: AspNetRole.cs"
Cohesion: 1.0
Nodes (1): AspNetRole

### Community 196 - "Small: AspNetUserClaim.cs"
Cohesion: 1.0
Nodes (1): AspNetUserClaim

### Community 197 - "Small: AspNetRoleClaim.cs"
Cohesion: 1.0
Nodes (1): AspNetRoleClaim

### Community 198 - "Small: CategorySalesFor1997.cs"
Cohesion: 1.0
Nodes (1): CategorySalesFor1997

### Community 199 - "Small: AlphabeticalListOfProduct.cs"
Cohesion: 1.0
Nodes (1): AlphabeticalListOfProduct

### Community 200 - "Small: CurrentProductList.cs"
Cohesion: 1.0
Nodes (1): CurrentProductList

### Community 201 - "Small: SalesTotalsByAmount.cs"
Cohesion: 1.0
Nodes (1): SalesTotalsByAmount

### Community 202 - "Small: CustomerAndSuppliersByCity.cs"
Cohesion: 1.0
Nodes (1): CustomerAndSuppliersByCity

### Community 203 - "Small: Employee.cs"
Cohesion: 1.0
Nodes (1): Employee

### Community 204 - "Small: OrdersQry.cs"
Cohesion: 1.0
Nodes (1): OrdersQry

### Community 205 - "Small: Product.cs"
Cohesion: 1.0
Nodes (1): Product

### Community 206 - "Small: Patient.cs"
Cohesion: 1.0
Nodes (1): Patient

### Community 207 - "Small: Medication.cs"
Cohesion: 1.0
Nodes (1): Medication

### Community 208 - "Small: Ailment.cs"
Cohesion: 1.0
Nodes (1): Ailment

### Community 209 - "Small: SchoolCount.cs"
Cohesion: 1.0
Nodes (1): SchoolCount

### Community 210 - "Small: SharedResource.cs"
Cohesion: 1.0
Nodes (1): SharedResource

### Community 211 - "Small: ApiResponse.cs"
Cohesion: 1.0
Nodes (1): ApiResponse

### Community 212 - "Small: focusTrap.js"
Cohesion: 1.0
Nodes (0): 

### Community 213 - "Small: ChatModel.cs"
Cohesion: 1.0
Nodes (1): Message

### Community 214 - "Small: Team.cs"
Cohesion: 1.0
Nodes (1): Team

### Community 215 - "Small: Player.cs"
Cohesion: 1.0
Nodes (1): Player

### Community 216 - "Small: .NET Class Library"
Cohesion: 1.0
Nodes (2): .NET Class Library, LibraryFIFA Class Library Project

### Community 217 - "Small: TaxiTripFarePrediction.cs"
Cohesion: 1.0
Nodes (1): TaxiTripFarePrediction

### Community 218 - "Small: TaxiTrip.cs"
Cohesion: 1.0
Nodes (1): TaxiTrip

### Community 219 - "Small: City.cs"
Cohesion: 1.0
Nodes (1): City

### Community 220 - "Small: Province.cs"
Cohesion: 1.0
Nodes (1): Province

### Community 221 - "Small: PasskeyInputModel.cs"
Cohesion: 1.0
Nodes (1): PasskeyInputModel

### Community 222 - "Small: Department.cs"
Cohesion: 1.0
Nodes (1): Department

### Community 223 - "Small: EnumTypes.cs"
Cohesion: 1.0
Nodes (1): Core.Domain

### Community 224 - "Small: Section.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 225 - "Small: Counter.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 226 - "Small: Heading.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 227 - "Small: SelectQuotationStatus.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 228 - "Small: UserInfo.cs"
Cohesion: 1.0
Nodes (1): UserInfo

### Community 229 - "Small: TaxSystemViewModel.cs"
Cohesion: 1.0
Nodes (1): TaxSystemViewModel

### Community 230 - "Small: AddSalesReceipt.cs"
Cohesion: 1.0
Nodes (1): AddReceipt

### Community 231 - "Small: Payment.cs"
Cohesion: 1.0
Nodes (1): Payment

### Community 232 - "Small: RegisterViewModel.cs"
Cohesion: 1.0
Nodes (1): RegisterViewModel

### Community 233 - "Small: LoginViewModel.cs"
Cohesion: 1.0
Nodes (1): LoginViewModel

### Community 234 - "Small: Resource.Designer.cs"
Cohesion: 1.0
Nodes (1): Resource

### Community 235 - "Small: charts.js"
Cohesion: 1.0
Nodes (0): 

### Community 236 - "Small: widgets.js"
Cohesion: 1.0
Nodes (0): 

### Community 237 - "Small: classlib Project"
Cohesion: 1.0
Nodes (2): classlib Project, xunit Project Template

### Community 238 - "Small: AI Tokenization"
Cohesion: 1.0
Nodes (1): AI Tokenization

### Community 239 - "Small: C# Extensions"
Cohesion: 1.0
Nodes (1): C# Extensions

### Community 240 - "Small: Dev Containers"
Cohesion: 1.0
Nodes (1): Dev Containers

### Community 241 - "Small: Prettier Code Formatter"
Cohesion: 1.0
Nodes (1): Prettier Code Formatter

### Community 242 - "Small: eslint.config.js"
Cohesion: 1.0
Nodes (0): 

### Community 243 - "Small: vite.config.ts"
Cohesion: 1.0
Nodes (0): 

### Community 244 - "Small: site.js"
Cohesion: 1.0
Nodes (0): 

### Community 245 - "Small: AppHost.cs"
Cohesion: 1.0
Nodes (0): 

### Community 246 - "Small: types.ts"
Cohesion: 1.0
Nodes (0): 

### Community 247 - "Small: vite-env.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 248 - "Small: GlobalUsing.cs"
Cohesion: 1.0
Nodes (0): 

### Community 249 - "Small: GlobalUsings.cs"
Cohesion: 1.0
Nodes (0): 

### Community 250 - "Small: HelloDevs.cs"
Cohesion: 1.0
Nodes (0): 

### Community 251 - "Small: Where.cs"
Cohesion: 1.0
Nodes (0): 

### Community 252 - "Small: Locations.cs"
Cohesion: 1.0
Nodes (0): 

### Community 253 - "Small: HelloScript.cs"
Cohesion: 1.0
Nodes (0): 

### Community 254 - "Small: React Developer Tools (Chrome Extension)"
Cohesion: 1.0
Nodes (1): React Developer Tools (Chrome Extension)

### Community 255 - "Small: Prettier Code Formatter VS Code Exten..."
Cohesion: 1.0
Nodes (1): Prettier Code Formatter VS Code Extension

### Community 256 - "Small: filterStudents.cs"
Cohesion: 1.0
Nodes (0): 

### Community 257 - "Small: PasskeyOperation.cs"
Cohesion: 1.0
Nodes (0): 

### Community 258 - "Small: webpack.config.js"
Cohesion: 1.0
Nodes (0): 

### Community 259 - "Small: confirm-dialog.js"
Cohesion: 1.0
Nodes (0): 

### Community 260 - "Small: popovers.js"
Cohesion: 1.0
Nodes (0): 

### Community 261 - "Small: quotations.js"
Cohesion: 1.0
Nodes (0): 

### Community 262 - "Small: tooltips.js"
Cohesion: 1.0
Nodes (0): 

### Community 263 - "Small: colors.js"
Cohesion: 1.0
Nodes (0): 

### Community 264 - "Small: Program.cs (Minimal hosting model)"
Cohesion: 1.0
Nodes (1): Program.cs (Minimal hosting model)

## Ambiguous Edges - Review These
- `Saturn Infrared False-Color Image` → `Azure Static Web App Architecture Diagram`  [AMBIGUOUS]
   · relation: conceptually_related_to
- `Azure Static Web Apps` → `VS Code PATH Configuration`  [AMBIGUOUS]
   · relation: conceptually_related_to
- `Semantic Kernel` → `Role-Based Authentication (admin/writer roles)`  [AMBIGUOUS]
  materials/graphify-out/converted/4870-assignment-2_v0_f2c45408.md · relation: conceptually_related_to
- `Midterm Exam` → `Total Marks`  [AMBIGUOUS]
  midterm exam info.png · relation: references
- `Multiple Choice Questions` → `MCQ Marks`  [AMBIGUOUS]
  midterm exam info.png · relation: references
- `Match Two Columns` → `Match Columns Marks`  [AMBIGUOUS]
  midterm exam info.png · relation: references
- `Coding Question` → `Coding Question Marks`  [AMBIGUOUS]
  midterm exam info.png · relation: references

## Knowledge Gaps
- **792 isolated node(s):** `students.json Data File`, `EF Lab SQLite Database`, `Entity Framework GroupBy Query`, `SQL Server in Docker Container`, `.NET Aspire Orchestration` (+787 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Small: OrderDetail.cs`** (2 nodes): `OrderDetail.cs`, `OrderDetail`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: OrderSubtotal.cs`** (2 nodes): `OrderSubtotal.cs`, `OrderSubtotal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Region.cs`** (2 nodes): `Region.cs`, `Region`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: ProductsByCategory.cs`** (2 nodes): `ProductsByCategory.cs`, `ProductsByCategory`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Territory.cs`** (2 nodes): `Territory.cs`, `Territory`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Order.cs`** (2 nodes): `Order.cs`, `Order`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: CustomerDemographic.cs`** (2 nodes): `CustomerDemographic.cs`, `CustomerDemographic`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SummaryOfSalesByYear.cs`** (2 nodes): `SummaryOfSalesByYear.cs`, `SummaryOfSalesByYear`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SummaryOfSalesByQuarter.cs`** (2 nodes): `SummaryOfSalesByQuarter.cs`, `SummaryOfSalesByQuarter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: ProductSalesFor1997.cs`** (2 nodes): `ProductSalesFor1997.cs`, `ProductSalesFor1997`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Shipper.cs`** (2 nodes): `Shipper.cs`, `Shipper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: QuarterlyOrder.cs`** (2 nodes): `QuarterlyOrder.cs`, `QuarterlyOrder`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AspNetUserLogin.cs`** (2 nodes): `AspNetUserLogin.cs`, `AspNetUserLogin`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Supplier.cs`** (2 nodes): `Supplier.cs`, `Supplier`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AspNetUser.cs`** (2 nodes): `AspNetUser.cs`, `AspNetUser`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Category.cs`** (2 nodes): `Category.cs`, `Category`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: ProductsAboveAveragePrice.cs`** (2 nodes): `ProductsAboveAveragePrice.cs`, `ProductsAboveAveragePrice`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Invoice.cs`** (2 nodes): `Invoice.cs`, `Invoice`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SalesByCategory.cs`** (2 nodes): `SalesByCategory.cs`, `SalesByCategory`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: OrderDetailsExtended.cs`** (2 nodes): `OrderDetailsExtended.cs`, `OrderDetailsExtended`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AspNetRole.cs`** (2 nodes): `AspNetRole.cs`, `AspNetRole`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AspNetUserClaim.cs`** (2 nodes): `AspNetUserClaim.cs`, `AspNetUserClaim`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AspNetRoleClaim.cs`** (2 nodes): `AspNetRoleClaim.cs`, `AspNetRoleClaim`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: CategorySalesFor1997.cs`** (2 nodes): `CategorySalesFor1997.cs`, `CategorySalesFor1997`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AlphabeticalListOfProduct.cs`** (2 nodes): `AlphabeticalListOfProduct.cs`, `AlphabeticalListOfProduct`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: CurrentProductList.cs`** (2 nodes): `CurrentProductList.cs`, `CurrentProductList`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SalesTotalsByAmount.cs`** (2 nodes): `SalesTotalsByAmount.cs`, `SalesTotalsByAmount`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: CustomerAndSuppliersByCity.cs`** (2 nodes): `CustomerAndSuppliersByCity.cs`, `CustomerAndSuppliersByCity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Employee.cs`** (2 nodes): `Employee.cs`, `Employee`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: OrdersQry.cs`** (2 nodes): `OrdersQry.cs`, `OrdersQry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Product.cs`** (2 nodes): `Product.cs`, `Product`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Patient.cs`** (2 nodes): `Patient.cs`, `Patient`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Medication.cs`** (2 nodes): `Medication.cs`, `Medication`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Ailment.cs`** (2 nodes): `Ailment.cs`, `Ailment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SchoolCount.cs`** (2 nodes): `SchoolCount.cs`, `SchoolCount`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SharedResource.cs`** (2 nodes): `SharedResource.cs`, `SharedResource`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: ApiResponse.cs`** (2 nodes): `ApiResponse.cs`, `ApiResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: focusTrap.js`** (2 nodes): `focusTrap.js`, `err()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: ChatModel.cs`** (2 nodes): `ChatModel.cs`, `Message`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Team.cs`** (2 nodes): `Team.cs`, `Team`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Player.cs`** (2 nodes): `Player.cs`, `Player`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: .NET Class Library`** (2 nodes): `.NET Class Library`, `LibraryFIFA Class Library Project`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: TaxiTripFarePrediction.cs`** (2 nodes): `TaxiTripFarePrediction.cs`, `TaxiTripFarePrediction`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: TaxiTrip.cs`** (2 nodes): `TaxiTrip.cs`, `TaxiTrip`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: City.cs`** (2 nodes): `City.cs`, `City`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Province.cs`** (2 nodes): `Province.cs`, `Province`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: PasskeyInputModel.cs`** (2 nodes): `PasskeyInputModel.cs`, `PasskeyInputModel`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Department.cs`** (2 nodes): `Department.cs`, `Department`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: EnumTypes.cs`** (2 nodes): `EnumTypes.cs`, `Core.Domain`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Section.tsx`** (2 nodes): `Section.tsx`, `Section()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Counter.tsx`** (2 nodes): `Counter.tsx`, `Counter()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Heading.tsx`** (2 nodes): `Heading.tsx`, `Heading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: SelectQuotationStatus.tsx`** (2 nodes): `SelectQuotationStatus.tsx`, `onChangeQuoteStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: UserInfo.cs`** (2 nodes): `UserInfo.cs`, `UserInfo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: TaxSystemViewModel.cs`** (2 nodes): `TaxSystemViewModel.cs`, `TaxSystemViewModel`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AddSalesReceipt.cs`** (2 nodes): `AddSalesReceipt.cs`, `AddReceipt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Payment.cs`** (2 nodes): `Payment.cs`, `Payment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: RegisterViewModel.cs`** (2 nodes): `RegisterViewModel.cs`, `RegisterViewModel`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: LoginViewModel.cs`** (2 nodes): `LoginViewModel.cs`, `LoginViewModel`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Resource.Designer.cs`** (2 nodes): `Resource.Designer.cs`, `Resource`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: charts.js`** (2 nodes): `charts.js`, `random()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: widgets.js`** (2 nodes): `widgets.js`, `random()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: classlib Project`** (2 nodes): `classlib Project`, `xunit Project Template`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AI Tokenization`** (1 nodes): `AI Tokenization`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: C# Extensions`** (1 nodes): `C# Extensions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Dev Containers`** (1 nodes): `Dev Containers`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Prettier Code Formatter`** (1 nodes): `Prettier Code Formatter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: eslint.config.js`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: vite.config.ts`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: site.js`** (1 nodes): `site.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: AppHost.cs`** (1 nodes): `AppHost.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: types.ts`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: vite-env.d.ts`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: GlobalUsing.cs`** (1 nodes): `GlobalUsing.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: GlobalUsings.cs`** (1 nodes): `GlobalUsings.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: HelloDevs.cs`** (1 nodes): `HelloDevs.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Where.cs`** (1 nodes): `Where.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Locations.cs`** (1 nodes): `Locations.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: HelloScript.cs`** (1 nodes): `HelloScript.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: React Developer Tools (Chrome Extension)`** (1 nodes): `React Developer Tools (Chrome Extension)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Prettier Code Formatter VS Code Exten...`** (1 nodes): `Prettier Code Formatter VS Code Extension`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: filterStudents.cs`** (1 nodes): `filterStudents.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: PasskeyOperation.cs`** (1 nodes): `PasskeyOperation.cs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: webpack.config.js`** (1 nodes): `webpack.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: confirm-dialog.js`** (1 nodes): `confirm-dialog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: popovers.js`** (1 nodes): `popovers.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: quotations.js`** (1 nodes): `quotations.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: tooltips.js`** (1 nodes): `tooltips.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: colors.js`** (1 nodes): `colors.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Small: Program.cs (Minimal hosting model)`** (1 nodes): `Program.cs (Minimal hosting model)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Saturn Infrared False-Color Image` and `Azure Static Web App Architecture Diagram`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Azure Static Web Apps` and `VS Code PATH Configuration`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Semantic Kernel` and `Role-Based Authentication (admin/writer roles)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Midterm Exam` and `Total Marks`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Multiple Choice Questions` and `MCQ Marks`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Match Two Columns` and `Match Columns Marks`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Coding Question` and `Coding Question Marks`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._