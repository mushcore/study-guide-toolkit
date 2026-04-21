<!-- converted from static-web-apps-SCRIPT.docx -->

Azure Static Web Apps

Azure Static Web Apps enables developers to build and deploy full stack web applications automatically to Azure through a code repository. Azure Static Web Apps support numerous languages, frameworks, and libraries like Vue, Svelte, React, and Angular.
When using Azure Static Web Apps, the APIs that serve single-page-application (SPAs) are based on Azure Server-less Functions.
In this tutorial, we will develop an Azure Static Web Apps solution where the SPA is React.js.

# The DB
Start a SQL Server Docker container with:
docker run --cap-add SYS_PTRACE -e ACCEPT_EULA=1 -e MSSQL_SA_PASSWORD=SqlPassword! -p 1444:1433 --name sqldb -d mcr.microsoft.com/mssql/server:2022-latest
Add database named SchoolDB and table named Students with sample data using SQL code from this GitHub gist:
https://gist.github.com/medhatelmasry/182606844744bbe7270bb8e3a05b23dd
# Getting Started
Create a folder named ts-static-web-app. Inside that folder, extract these two files:
AzFunctionsTS.zip
student-management-ts.zip
Rename folder AzFunctionsTS to backend.
Rename folder student-management-ts to frontend.

The directory structure will now look like this:
ts-static-web-app
|
|------------- backend
|------------- frontend

In the backend folder, run the following command:
npm install
npm run build
func start
In the frontend folder, run the following command:
npm install
npm run dev
Note this code in frontend/src/services/api.ts:
// Determine which API URL to use based on the current hostname
const isLocalhost = window.location.hostname === 'localhost' ||
window.location.hostname === '127.0.0.1';

const BASE_URL = isLocalhost
? import.meta.env.VITE_LOCAL_API_URL
: (import.meta.env.VITE_AZURE_API_URL || '/api');
Test that both the backend and frontend app can work together.
Delete the .git folder in the backend app if it exists. While in the ts-static-web-app folder, push the entire solution to GitHub.
Azure Static Web Apps will put the Azure Functions App and React.js SPA in the same website.
# Azure Static Web Apps
Login into your Azure portal at https://portal.azure.com. Click on “Create a resource”.

In the filter field, enter the phrase static, then choose “Static Web App”.

Click on Create.

- Choose a subscription
- Create a new Resource Group
- Enter a unique name for the application
- Choose “Free: For hobby or personal projects” for Plan Type
- Choose “West US 2” data center close to you
- For deployment details, choose GitHub and “Sign in with GitHub”

After your login into GitHub, make sure you choose the following settings:

Click on “Review + create”.

The provisioning process does not take long. Once it is complete, click on “Go to resource” to go to the main app blade.
Click on “Settings >> Environment variables” on the left-side.


Add this database connection string environment variable:
If you visit your GitHub repo, you should find that the app was deployed to Azure.

The build process may fail with this error:

If that happens, make a pull of your source code. This gets the GitHub Actions .yml file and puts it into the .github/workflows folder. Edit the .yml file and add this right after:  output_location: "dist"
skip_app_build: false
skip_api_build: false
# Add the following configuration to skip unnecessary files
app_build_command: "npm run build:ci"
Push your code to GitHub. This time the build and deployment should be successful.
Back in Azure, click on the site URL.



| Name | Value |
| --- | --- |
| DATABASE_CONNECTION_STRING | Server=tcp:static-web-apps-db-server.database.windows.net,1433;Initial Catalog=static-web-apps-lesson;Persist Security Info=False;uid=static-web-apps;pwd=DB0admin-user;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30; |