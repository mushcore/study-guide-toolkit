<!-- converted from deploy-razor-pages-to-azure.docx -->

# Create & Deploy ASP.NET Core Web App to Azure
In a working directory on your computer, enter the following .NET commands:
mkdir WebStar
cd WebStar
dotnet new razor
dotnet restore
dotnet build
dotnet watch run --urls http://localhost:5000

You can access the web app by pointing your browser to:
http://localhost:5000

To deploy your web app to Azure through GitHub Actions:
- Create a repo on GitHub
- Inside a terminal window in your local WebStart folder, create a .gitignore file with:
dotnet new gitignore
- Create a local git repo in in your local WebStart folder in a terminal window with:
git init
git add .
git commit -m "Initial Commit"
- Copy the commands from the new GitHub repo under “…or push an existing repository from the command line” and paste it in local your local WebStart terminal window in the terminal window. This pushes your source code to GitHub.
- Log into Azure by visiting: https://portal.azure.com.
- Create an App Service by choosing .NET 10
- Visit Deployment Center and choose GitHub as the source of your code. Then select your new repo in GitHub.
- This automatically connects your app service to your GitHub repo and triggers GitHub Actions script in GitHub that deploys your web app.

