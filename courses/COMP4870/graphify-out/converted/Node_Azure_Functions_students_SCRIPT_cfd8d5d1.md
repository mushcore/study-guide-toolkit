<!-- converted from Node_Azure_Functions_students_SCRIPT.docx -->

TypeScript Serverless Azure Functions API that connects to existing SQL Server DB
## Install Azure Functions on your computer
Install azure-function-core-tools on Windows using the below npm command:
npm i -g azure-functions-core-tools@4 --unsafe-perm true

In this tutorial I will demonstrate how to build a Node.js API application using Azure Functions. The application uses SQL Server.
You need to install the Azure Functions extension for Visual Studio Code before proceeding with this tutorial.
## Get Started
Create a folder in a working directory:
mkdir AzFunctionsTS
Open VS Code in the newly created directory:
cd AzFunctionsTS
code .
Choose the Azure icon in the Activity bar, then in the Workspace (local) area, select the + button, choose Create New Project in the dropdown. When prompted, choose Create new project.

Select the folder that you are in:


You will next be asked to select a programming language. Choose TypeScript.

When asked for a TypeScript programming model, choose Model V4.

You will be asked to choose a template for your project's first function. Note that you can have more than one function in your project. Choose HTTP Trigger.



Give your function the name getStudents.



Hit Enter after you give your function a name. 

Let us see what the app does. Hit CTRL F5 on the keyboard (or type func start in the terminal window). The built-in VS Code terminal window will eventually display a URL that uses port number 7071:

Copy and paste the URL into a browser or hit CTRL Click on the link. You will see the following output in your browser:

Add these packages.
npm install mssql@11.0.1
npm install sequelize@6.32.0

Let us make a few minor enhancements to our application.
## Create School DB in SQL Server
Start a SQL Server Docker container with:
docker run --cap-add SYS_PTRACE -e ACCEPT_EULA=1 -e MSSQL_SA_PASSWORD=SqlPassword! -p 1444:1433 --name sqldb -d mcr.microsoft.com/mssql/server:2022-latest

Add database named SchoolDB and table named Students with sample data using SQL code from this GitHub gist:
https://gist.github.com/medhatelmasry/182606844744bbe7270bb8e3a05b23dd
Add this database connection string to local.settings.json inside the Values block:
"SQL_SERVER_CONNECTION_STRING": "Server=tcp:localhost,1444;Database=SchoolDB;UID=sa;PWD=SqlPassword!;TrustServerCertificate=True;"
Create /src/shared folder and add to it three files: studentModel.ts, database.ts, and studentPayload.ts:
## studentModel.ts
import { DataTypes, Model, Optional } from "sequelize";

// Define the attributes for the Student model
export interface StudentAttributes {
StudentId: number;
FirstName: string;
LastName: string;
School: string;
}

// Define the optional attributes for creating a Student
export interface StudentCreationAttributes extends Optional<StudentAttributes, "StudentId"> {}

// Define the Student model class
export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
public StudentId!: number;
public FirstName!: string;
public LastName!: string;
public School!: string;
}

// Initialize the Student model
export const StudentModel = {
StudentId: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true
},
FirstName: {
type: DataTypes.STRING,
allowNull: false
},
LastName: {
type: DataTypes.STRING,
allowNull: false
},
School: {
type: DataTypes.STRING,
allowNull: false
}
};
## database.ts
import * as sql from "mssql";
import { Sequelize, DataTypes } from "sequelize";
import { Student, StudentModel } from "./studentModel";

// Parse the connection string from environment variables
const connectionString: string | undefined = process.env.SQL_SERVER_CONNECTION_STRING;

// Sequelize instance
let sequelizeInstance: Sequelize | null = null;

export async function connectToDatabase(): Promise<sql.ConnectionPool> {
try {
console.log('Attempting database connection...');

if (!connectionString) {
console.error('SQL_SERVER_CONNECTION_STRING environment variable is not set');
throw new Error('Database connection string is not configured');
}

const pool: sql.ConnectionPool = await sql.connect(connectionString);
console.log('Database connection established successfully');
return pool;
} catch (err: any) {
console.error('Database connection failed:', err.message);
console.error('Stack trace:', err.stack);
throw err;
}
}

export async function closeDatabaseConnection(pool: sql.ConnectionPool): Promise<void> {
try {
if (pool) {
await pool.close();
console.log('Database connection closed successfully');
}
} catch (err: any) {
console.error('Error closing database connection:', err.message);
console.error('Stack trace:', err.stack);
}
}

export function getSequelize(): Sequelize {
if (!sequelizeInstance) {
if (!connectionString) {
throw new Error("SQL_SERVER_CONNECTION_STRING environment variable is not set");
}

// Parse the connection string to extract needed parameters
const connectionParts = connectionString.split(';');
const serverPart = connectionParts.find(part => part.toLowerCase().startsWith('server='));
const databasePart = connectionParts.find(part => part.toLowerCase().startsWith('database='));
const userPart = connectionParts.find(part => part.toLowerCase().startsWith('uid='));
const passwordPart = connectionParts.find(part => part.toLowerCase().startsWith('pwd='));

if (!serverPart || !databasePart || !userPart || !passwordPart) {
throw new Error("Connection string is missing required parts");
}

// Extract server and port from the server part
const serverValue = serverPart.split('=')[1];
let host: string;
let port: number;

// Handle "Server=tcp:127.0.0.1,1444" or "Server=myserver.database.windows.net" formats
if (serverValue.includes(',')) {
// Format: server,port (e.g., "tcp:127.0.0.1,1444")
const serverParts = serverValue.replace('tcp:', '').split(',');
host = serverParts[0];
port = parseInt(serverParts[1], 10);
} else if (serverValue.includes(':')) {
// Format: protocol:server (e.g., "tcp:myserver.database.windows.net")
host = serverValue.split(':')[1];
port = 1433; // Default SQL Server port in Azure
} else {
// Just a server name
host = serverValue;
port = 1433; // Default SQL Server port
}

// Replace IP with 'localhost' if needed to avoid RFC 6066 warnings
if (host === '127.0.0.1') {
host = 'localhost';
}

// Extract other values
const database = databasePart.split('=')[1];
const username = userPart.split('=')[1];
const password = passwordPart.split('=')[1];

console.log(`Connecting to ${host}:${port} as ${username}`);

// Create a new Sequelize instance with the parsed parameters
sequelizeInstance = new Sequelize({
dialect: "mssql",
host: host,
port: port,
database: database,
username: username,
password: password,
logging: false,
dialectOptions: {
options: {
trustServerCertificate: true,
encrypt: true  // Required for Azure SQL
}
}
});

// Initialize the Student model
Student.init(StudentModel, {
sequelize: sequelizeInstance,
modelName: "Student",
tableName: "Students",
timestamps: false
});
}

return sequelizeInstance;
}

// Ensure database connection and model synchronization
export async function initializeDatabase(): Promise<void> {
try {
const sequelize = getSequelize();
await sequelize.authenticate();
console.log("Sequelize database connection established successfully");
await sequelize.sync();
console.log("Database models synchronized");
} catch (err) {
console.error("Unable to connect to the database or synchronize models:", err);
throw err;
}
}
## studentPayload.ts
export interface StudentPayload {
FirstName: string;
LastName: string;
School: string;
}
Replace content of src/functions/getStudents.ts with:
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connectToDatabase, closeDatabaseConnection } from "../shared/database";
import * as sql from "mssql";

export async function getStudents(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
context.log(`Http function processed request for url "${request.url}"`);

let pool: sql.ConnectionPool | undefined;

try {
// Connect to the database using the shared utility
pool = await connectToDatabase();

// Execute a query
const result = await pool.request().query("SELECT * FROM Students");

// Return the query result as JSON
return { body: JSON.stringify(result.recordset), headers: { "Content-Type": "application/json" } };
} catch (err) {
context.log(`Error: ${err}`);
return { status: 500, body: "An error occurred while fetching students." };
} finally {
// Close the database connection using the shared utility
if (pool) {
await closeDatabaseConnection(pool);
}
}
}

app.http('getStudents', {
methods: ['GET'],
authLevel: 'anonymous',
route: 'students',
handler: getStudents
});
Run the application in an emulator by entering the following in a terminal window at the root of the application:
npm install
npm run build
func start


Copy the students URL (I.E. http://localhost:7071/api/students) and paste it into a browser. The result will look like this:

# Add remaining CRUD operations
In the /src/functions folder, add four more files for the remaining CRUD operations: createStudent.ts, deleteStudentById.ts, getStudentById.ts, and updateStudent.ts:
## createStudent.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Student } from "../shared/studentModel";
import { StudentPayload } from "../shared/studentPayload";
import { initializeDatabase } from "../shared/database";

export async function createStudent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
try {
// Initialize the database and models before using them
await initializeDatabase();

// Parse and validate the request body
const body = await request.json() as StudentPayload;

context.log("Received payload:", body);

if (!body.FirstName || !body.LastName || !body.School) {
return { status: 400, body: "FirstName, LastName, and School are required." };
}

// Create a new student using the Student model
const newStudent = await Student.create(body);

return {
status: 201,
body: JSON.stringify(newStudent.toJSON()),
headers: { "Content-Type": "application/json" }
};
} catch (err) {
context.log(`Error: ${err}`);
context.log(`Error Details: ${JSON.stringify(err, null, 2)}`);
return { status: 500, body: "An error occurred while creating the student." };
}
}

app.http('createStudent', {
methods: ['POST'],
authLevel: 'anonymous',
route: 'students',
handler: createStudent
});
## deleteStudentById.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connectToDatabase, closeDatabaseConnection } from "../shared/database";
import { initializeDatabase } from "../shared/database";

export async function deleteStudentById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
// Initialize the database and models
await initializeDatabase();

// Retrieve the StudentId from the route parameters
const studentId = request.params.StudentId;

if (!studentId) {
return { status: 400, body: "Student ID is required." };
}

let pool;

try {
pool = await connectToDatabase();
const result = await pool.request()
.input("StudentId", studentId)
.query("DELETE FROM Students WHERE StudentId = @StudentId");

if (result.rowsAffected[0] === 0) {
return { status: 404, body: "Student not found." };
}

return { status: 200, body: "Student deleted successfully." };
} catch (err) {
context.log(`Error: ${err}`);
return { status: 500, body: "An error occurred while deleting the student." };
} finally {
if (pool) {
await closeDatabaseConnection(pool);
}
}
}

app.http('deleteStudentById', {
methods: ['DELETE'],
authLevel: 'anonymous',
route: 'students/{StudentId}',
handler: deleteStudentById
});
## getStudentById.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Student } from "../shared/studentModel";
import { initializeDatabase } from "../shared/database";

export async function getStudentById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
try {
// Initialize the database and models
await initializeDatabase();

// Retrieve the StudentId from the route parameters
const studentId = request.params.StudentId;

if (!studentId) {
return { status: 400, body: "Student ID is required." };
}

// Find the student by primary key
const student = await Student.findByPk(studentId);

if (!student) {
return { status: 404, body: "Student not found." };
}

// Return the student as JSON
return {
body: JSON.stringify(student.toJSON()),
headers: { "Content-Type": "application/json" }
};
} catch (err) {
context.log(`Error: ${err}`);
return { status: 500, body: "An error occurred while fetching the student." };
}
}

app.http('getStudentById', {
methods: ['GET'],
authLevel: 'anonymous',
route: 'students/{StudentId}',
handler: getStudentById
});
## updateStudent.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Student } from "../shared/studentModel";
import { StudentPayload } from "../shared/studentPayload";
import { initializeDatabase } from "../shared/database";

export async function updateStudent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
// Initialize the database and models
await initializeDatabase();

// Retrieve the StudentId from the route parameters
const studentId = request.params.StudentId;

if (!studentId) {
return { status: 400, body: "Student ID is required." };
}

// Explicitly type the body as Partial<StudentPayload>
const body = await request.json() as Partial<StudentPayload>;

// Validate and typecast the payload
const updates: Partial<StudentPayload> = {
FirstName: body.FirstName,
LastName: body.LastName,
School: body.School,
};

if (!updates.FirstName && !updates.LastName && !updates.School) {
return { status: 400, body: "At least one field (FirstName, LastName, School) is required to update." };
}

try {
// Fetch the student by ID
const student = await Student.findByPk(studentId);

if (!student) {
return { status: 404, body: "Student not found." };
}

// Update the student record
await student.update(updates);

return { body: JSON.stringify(student), headers: { "Content-Type": "application/json" } };
} catch (err) {
context.log(`Error: ${err}`);
return { status: 500, body: "An error occurred while updating the student." };
}
}

app.http('updateStudent', {
methods: ['PUT', 'PATCH'],
authLevel: 'anonymous',
route: 'students/{StudentId}',
handler: updateStudent
});
Restart the application in an emulator by entering the following in a terminal window at the root of the application:
npm install
npm start


Go ahead and test out all the endpoints in Postman.
CORS
Add the following to local.settings.json so that we do not have a CORS problem with this API:
"Host": {
"CORS": "*"
}

## Publish to Azure through GitHub Actions
Push your code to GitHub.
Thereafter, create a Functions app on Azure.


Click on the Deployment tab.




Publish to Azure through VS Code
Click on “Create Function App in Azure”.

Next, enter a name for the app. This must be a unique host-name for azurewebsites.net:

Choose the type of .NET Functions:

Select a data center closer to your location.

The publish process gets underway.

You should see the new endpoints in the console:

Once it is completed, go to the Azure portal (https://portal.azure.com/).
Find your Azure Functions App

You can see the deployed functions:

### Database Connection String
In the “Settings >> Environment variables” section, you will need to add a database connection string for a database that already exists on Azure, then save as shown below:


Also, enable CORS on the server:

In the top search filter, enter func then select “Function App”:

On the next page, click on your function:

Click on a function you created:



Paste the URL into the address line of your browser. You should see the output of your API:

## Conclusion
It is easy to create Azure Functions with VS Code. Also, creating an API with Azure Functions is cheaper than doing it with an ASP.NET Core Web application because you pay a fraction of a cent for every request and the app does not need to be constantly running.
| Name | Value |
| --- | --- |
| DATABASE_CONNECTION_STRING | Server=tcp:static-web-apps-db-server.database.windows.net,1433;Initial Catalog=static-web-apps-lesson;Persist Security Info=False;User ID=static-web-apps;Password=DB0admin-user;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30; |
| Name | Value |
| --- | --- |
| DATABASE_CONNECTION_STRING | Server=tcp:static-web-apps-db-server.database.windows.net,1433;Initial Catalog=static-web-apps-lesson;Persist Security Info=False;User ID=static-web-apps;Password=DB0admin-user;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30; |