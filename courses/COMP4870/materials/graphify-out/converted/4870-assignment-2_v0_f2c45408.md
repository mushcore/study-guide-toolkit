<!-- converted from 4870-assignment-2_v0.docx -->

Mini-CMS
# Background
You will work on this assignment in the same teams of 2-3 students as in assignment 1. Let your instructor know if you cannot work in the same team.
You already developed an ASP.NET Controller backend with an SQLite database. You will change the frontend from React.js to Client-side Blazor WASM that consumes a custom JSON API.
The main objective of this assignment is to:
- Fix issues identified in the previous assignment
- Convert your previous React frontend into a client-side Blazor WASM frontend. Use the “dotnet new blazor” template. The Blazor web app only displays articles with the latest at the top of the list.
- add user groups admin & writer in the MVC application. Admin can see all articles. However, a writer can only see articles that he/she has authored.
- Enhance your solution so that it is orchestrated with Aspire and runs with the command “aspire run”.
- add AI to your application’s backend
- Change database from SQLite to SQL Server
# Submission
- Technical Stack:
- Backend: ASP.NET MVC and WebAPI Controllers
- Database: SQL Server running in a Docker container.
- Frontend: Client-side Blazor WASM with a professional looking UI
- Source Code: Submit a zipped file (.zip extension) containing your solution and upload it to the drop-box folder for Assignment 2 in D2L (Learning Hub). Do not include unnecessary files that are not needed in your submission.
- Setup: Use code-1st database development to generate the initial database schema and seed it with at least 6 items of meaningful data.
- Seed the database with these user accounts:
- Provide instructions on the quick and easy way to install and test your solution + describe where you implemented AI in your solution.
# Logical Data Flow
- Drafting: Author Authenticates into admin site  Author adds/edits/deletes text (articles) with Rich Text Editor  App sanitizes add/update data  App executes an INSERT/DELETE/UPDATE/SELECT into/from SQL Server.
- Viewing: Blazor frontend sends a GET request  ASP.NET Controller queries SQL Server  ASP.NET returns a JSON array of articles  Blazor frontend renders the data.
# Architecture

# Marking
## Not in Scope
- Deployment to Azure
| BRITISH COLUMBIA INSTITUTE OF TECHNOLOGY | Assignments #2 |
| --- | --- |
| School of Computing and Academic Studies | COMP4870 |
| Programs: CST | Assignment 2 due Sunday March 29 by 11:59 PM: |
| Username/Email | Password |  |
| --- | --- | --- |
| a@a.a | P@$$w0rd | admin |
| w@w.w | P@$$w0rd | writer |
| x@x.x | P@$$w0rd | writer |
| Criteria | Mark | Actual |
| --- | --- | --- |
| Fixed issues | 15 |  |
| Fixed issues identified in assignment 1 |  |  |
| Backend Functionality (ASP.NET WebAPI Controller) | 10 |  |
| REST API endpoints (GET, POST, PUT, DELETE) working correctly with proper routing and responses
Swagger interface |  |  |
| Database Integration | 10 |  |
| SQL Server running in a container
SQL Server database correctly structured 
DB seeded with 6 meaningful articles
DB seeded with one admin and two writer accounts |  |  |
| Admin Site Features | 15 |  |
| Rich Text Editor integrated.
Role-based authentication 
CRUD pages
An author sees articles that he/she authored |  |  |
| Frontend Functionality (Blazor WASM) | 15 |  |
| Blazor WASM SPA correctly fetches and displays articles via API.
Frontend has unique personality |  |  |
| AI | 10 |  |
| Implemented AI into your backend or frontend. |  |  |
| Aspire | 10 |  |
| Able to orchestrate solution so that it can be run with command “aspire run” |  |  |
| Code Quality & Structure | 10 |  |
| Clean, readable, modular code with comments and consistent formatting
Only one solution file
Only one database context class
No compiler warnings |  |  |
| Submission Requirements | 5 |  |
| Zipped project folder includes all required files, setup script, install & test instructions, and description of AI implementation
No bin or obj folders in submission |  |  |
| TOTAL | 100 |  |