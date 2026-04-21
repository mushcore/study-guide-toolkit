<!-- converted from Deploy ASP.NET app with LocalDB to IIS.docx -->

# Disable IE Enhanced Security Configuration
- In Server Manager, click on “Local Server” on the left-hand-side
- Beside “IE Enhanced Security Configuration”, click “On”
- Turn “Off” for admins & users:

# Show File Extensions
- Go to the control panel
- Find “folder options”
- Click on the View tab
- Uncheck “Hide extensions for known file types”
# Enable IIS role in Windows Server 2012 R2
- In the “Windows Server 2012” Server Manager, click on Manage >> Add Roles and Features

- Click Next on the “Before you begin” dialog
- Choose the default “Role-based or feature-based installation” option on the “Select Installation type” dialog then click Next
- Click Next on the “Select destination server” dialog
- On the “Select server roles” window, enable the “Application Server” & “Web Server (IIS)” checkboxes then click on Next. When the “Add Roles and Features Wizard” window pops up, click on “Add Features”

- Click Next on the “Select server roles” dialog
- Enable “.NET Framework 3.5 Features”
- Under “NET Framework 4.5 Features”, enable “ASP.NET 4.5” on the “Select features” dialog.

- Click Next on the “Select features” dialog
- Click Next on the “Application Server” dialog

- Enable the “Web Server (IIS) Support” checkbox on the “Select role services” dialog. When the “Add Roles and Features Wizard” window pops up, click on “Add Features”

- Click Next on the “Select role services” dialog
- Click Next on the “Web Server Role (IIS)” dialog
- On the “Select role services” dialog, enable “.NET Extensibility 3.5” and “ASP.NET 3.5” under “Application Development”.

- Click Next on the “Select role services” dialog.
- Click Install on the “Confirm installation selections” dialog.

While the above is installing, you may wish to download and install Chrome & Notepad++.
# Test that ASP.NET works on the IIS web server
- Under c:\inetpub\iisroot create a directory named scratch
- Inside of the scratch directory, create a text file named now.aspx and add the following code to it.
<script language="c#" runat="server">
public void Page_Load() {
Response.Write(DateTime.Now.ToString());
}
</script>
- Point IE browser to http://localhost/scratch/now.aspx. You should see the current date in the browser.
# Download & Install SQL Server Express 2014
- Download SQL Server Express 2014 from http://www.microsoft.com/en-us/download/details.aspx?id=42299
- Choose the version that includes SQL Server Management Studio: ExpressAndTools 64BIT\SQLEXPRWT_x64_ENU.exe




Enter P@$$w0rd for the sa account. You can, of course, enter any other password. Make sure, though, that you remember this password
- Finally:

# Shortcuts needed on the taskbar
It is recommended that you pin the following applications to the taskbar:
- SQL Server Management Studio
- Internet Information Services (IIS) Manager
# Deploy ASP.NET application with LocalDB to Full IIS

- Create a directory at C:\inetpub\wwwroot\MyWebApp
- In IIS, create a new web site named MyWebApp and set the physical IIS site to that directory
- To start with, use a port number like 8055 and no host header.
- The name of the web site (in this case MyWebApp) is very important as it determines the name of the application pool
- Configure Application Pool
- In IIS, identify the application pool account by clicking on the “Application pools” node
- Right click on the application pool account and select “Advanced Settings”

- Set “Load User Profile” to True
- Click on OK
- Publish site from Visual Studio
- In VS.NET, open the solution. Right click the web project, select Publish…

- Click on the dropdown and select <New Profile …>. Name the profile

- Give the profile a name:

- Click on OK
- On the connection tab, select “File System” for “Publish Method”
- Set the “Target location” to the physical location of the web site on the file system

- Accept default values and click Next

- Click Publish:

- Ensure that data files are published: Inspect the C:\inetpub\wwwroot\MyWebApp directory. If the App_Data directory does not contain any files, do the following:
- Return to Visual Studio and make sure that the database files in the App_Data directory are included in the project
- In Visual Studio, select the App_Data folder. Right click and select “Publish App_Data”. This will copy over the database files to C:\inetpub\wwwroot\MyWebApp
- Give C:\inetpub\wwwroot\MyWebApp\App_Data the appropriate access privileges:
- In File Explorer, navigate to C:\inetpub\wwwroot\MyWebApp.
- Right-click App_Data.
- Select Properties >> Security tab
- Click Edit
- Click Add  on the “Permissions for App_Data” dialog
- In the “Enter the object names to select” field, enter “iis apppool\MyWebApp”. Note that MyWebApp is the name of the application pool in question. This represents the “ApplicationPoolIdentity” assigned to our application pool.
- Click on Check Names to verify that the account exists

- Click OK
- Select all permissions except “Full Control”
- Click OK twice
- If using LocalDB, ensure that signature for the data source is “(LocalDb)\MSSQLLocalDB”

- Testing that the site works
- Return to IIS
- Select MyWebApp website
- On the right-hand side click on Browse *:8055
- When the website opens in a browser, carry out a function that involves database access. If all goes well and there are no errors then we know that all is well. Otherwise, any errors will display since we are using localhost
- Enabling external access to the website
- In IIS, click on the website
- Click on Bindings on the right-hand side
- Click on the Add button
- Enter asp.acme.com for host name

- Click OK

- Click Close