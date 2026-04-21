<!-- converted from Node with TypeScript.docx -->

Node Express with TypeScript (TS)
Install TypeScript globally:
npm install typescript -g
Let us create a separate directory named tsprimer, simply to play around and understand how TypeScript works:
mkdir tsprimer
cd tsprimer
code .
Create a file named greeter.ts and add to it the following code:
function greeter(person) {
return "Hello, " + person;
}

let user = "Jane Bond";

console.log(greeter(user));
To trandspile the app, type:
tsc greeter.ts
This ‘transpiles’ the app to greeter.js, which gets created in the same directory. Run the application with:
node greeter.js
# Interfaces
Let us modify greeter.ts so that it uses strong type checking. Create a file named person.ts and add to it the following Person interface:
export interface Person {
firstName: string;
lastName: string;
}
Add a file named greeterPerson.ts that uses the Person interface with the following code:
export class Student {
constructor(private firstName: string, private middleInitial: string, private lastName: string) {

}

public getFullName = (): string => {
return `${this.firstName} ${this.middleInitial} ${this.lastName}`;
};
}
Transpile the app with tsc greeterPerson.ts and run it with:
node greeterPerson.js
# Classes
Create a file named student.ts to hold a Student class. The code is:
export class Student {
fullName: string;
constructor(public firstName: string, public middleInitial: string, public lastName: string) {
this.fullName = firstName + " " + middleInitial + " " + lastName;
}

public getFullName = () : string =>
{
return this.fullName;
};
}
Notice the instance variable fullName, constructor and method getFullName(). Create a greeter file named greeterStudent.ts that uses the Student class as shown below:
import {Student} from './student';

let student  = new Student("Jane","M.","Bond" );

console.log(student.getFullName());
Run the app with:
Transpile & run the application.
# TS with Node Express
Go to the parent directory with:
cd ..
create a new directory named tsexpress and go into that directory:
mkdir tsexpress
cd tsexpress
Let us initialize a node project in the current directory with:
npm init -y
Let’s now install the typescript package locally with:
npm install typescript --save-dev
Open the current directory in Visual Studio Code.
Inside our package.json, add a script called tsc:
"scripts": {
"tsc": "tsc"
},
This modification allows us to call TypeScript functions from the command line in the project’s folder.

Run the following command to initialize the typescript project by creating the tsconfig.json file.
npm run tsc -- --init
Edit tsconfig.json, uncomment outDir setting so that it looks like this:
"outDir": "./build",
Also, make sure you have these additional settings in tsconfig.json:


"sourceMap": true,
"rootDir": "./app",
"outDir": "./build"
"verbatimModuleSyntax": false,
Add this to the bottom of tsconfig.json:
"include": [
"app/**/*.ts"
],
"exclude": [
"node_modules"
]
## Installing express.js
Run the following command:
npm install express --save
Express and Typescript packages are independent. The consequence of this is that Typescript does not “know” types of Express classes. Run this specific npm package for the Typescript to recognize the Express class types.
npm install @types/express --save-dev
Let us add a very simple Hello World Node Express application file. Create a folder named app and inside the app directory create a file named app.ts with this content:
// app/app.ts
import express = require('express');

// Create a new express application instance
const app: express.Application = express();

app.get('/', function (req, res) {
res.send('Hello World!');
});

app.listen(3000, function () {
console.log('Example app listening on port 3000!');
});
To transpile your first TypeScript Node Express app, run the following command in the root directory of your application:

npm run tsc
This command automatically created the build folder and adds to it the transpiled app.js file.

To run the application in build/app.js, type:
node build/app.js
Point your browser to http://localhost:3000. You should see the following:


## Running TypeScript without transpiling
You can run TypeScript directly on node with the ts-node package.

This package is recommended for development purposes only. To make the final deployment to production, always use the JavaScript version of your project.

The ts-node is already included as a dependency on another package, ts-node-dev. After installing ts-node-dev we can run commands that restarts the server whenever a project file changes. Install ts-node-dev as follows:
npm install ts-node-dev --save-dev
Add the following two script lines into the package.json file:
"dev": "ts-node-dev --respawn --transpile-only ./app/app.ts",
"prod": "tsc && node ./build/app.js"
To start the development environment:
npm run dev
To run the server in production mode:
npm run prod
## Pure TypeScript Classes
So far in our Node/Express sample application, we are not really using proper TypeScript. Let us start making use of TypeScript.
Replace code in app/app.ts with following code:
// app/app.ts
import express from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes";

class App {
public app: express.Application;
public routePrv: Routes = new Routes();

constructor() {
this.app = express();
this.config();
this.routePrv.routes(this.app);
}

private config(): void{

this.app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
next();
});

// support application/json type post data
this.app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
this.app.use(bodyParser.urlencoded({ extended: false }));
}
}

export default new App().app;
Create a file named server.ts in the app folder and add to it the following code:
// app/server.ts
import app from "./app";
const PORT = 3000;

app.listen(PORT, () => {
console.log('Express server listening on port ' + PORT);
})
In package.json:
change app.js 		TO 		server.js
change app.ts		TO 		server.ts
Create a folder named routes under app and add to it the following index.ts file:
// /app/routes/index.ts
import {Request, Response} from "express";

export class Routes {

public routes(app: any): void {
app.route('/')
.get((req: Request, res: Response) => {
res.status(200).send('Hello World!');
});
}
}
Test the application in dev mode by running:
npm run dev
Then point your browser to http://localhost:3000. You should see Hello World in the browser.
Test same as above in prod mode by running:
npm run prod
## Using mongoose
Mongoose is a Node. JavaScript-based Object Data Modeling (ODM) library for MongoDB. It is akin to an Object Relational Mapper (ORM) for traditional SQL databases. The problem that Mongoose aims to solve is allowing developers to enforce a specific schema at the application layer.
Start MongoDB in a Docker container with this terminal window command:
docker run -p 27777:27017 --name mng -d mongo:4.1.6
Install these mongoose packages:
npm install mongoose --save
npm install @types/mongoose --save-dev
Create a folder named models under app and add to it a file named student.ts with the following code:
//   /app/models/student.ts
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create a schema
export const StudentSchema = new Schema({
FirstName: {
type: String,
required: true
},
LastName: {
type: String,
required: true
},
School: {
type: String,
required: true
},
StartDate: {
type: Date,
required: true
}
});

Create a folder called controllers under app and add to it a file named studentController.ts with this code:
//   /app/controllers/studentController.ts
import * as mongoose from 'mongoose';
import { StudentSchema } from '../models/student';
import { Request, Response } from 'express';

const StudentMongooseModel = mongoose.model('Student', StudentSchema);

export class StudentController {

public addNewStudent (req: Request, res: Response) {
let newStudent = new StudentMongooseModel(req.body);

newStudent.save()
.then((data: mongoose.Document) => res.json(data))
.catch((err: mongoose.CallbackError) => res.status(500).send(err));
}

public async getStudents (req: Request, res: Response) {
try {
const data = await StudentMongooseModel.find({});
res.json(data);
} catch (err) {
res.status(500).send(err);
}
}

public async getStudentById (req: Request, res: Response) {
try {
const data = await StudentMongooseModel.findById(req.params.studentId);
if (!data) {
return res.status(404).send({ message: 'Student not found' });
}
res.json(data);
} catch (err) {
res.status(500).send(err);
}
}

public updateStudent (req: Request, res: Response) {
StudentMongooseModel.findOneAndUpdate({ _id: req.params.studentId }, req.body, { new: true })
.then((data: any) => res.json(data))
.catch((err: any) => res.status(500).send(err));
}

public async deleteStudent (req: Request, res: Response) {
try {
const data = await StudentMongooseModel.findByIdAndDelete(req.params.studentId);
if (!data) {
return res.status(404).send({ message: 'Student not found' });
}
res.json({ message: 'Successfully deleted student!' });
} catch (err) {
res.status(500).send(err);
}
}

public async generateDummyData (req: Request, res: Response) {
const data = [
{
"FirstName":"Sally",
"LastName":"Baker",
"School":"Mining",
"StartDate": new Date("2012-02-20T08:30:00")
},{
"FirstName":"Jason",
"LastName":"Plumber",
"School":"Engineering",
"StartDate": new Date("2018-03-17T17:32:00")
},{
"FirstName":"Sue",
"LastName":"Gardner",
"School":"Political Science",
"StartDate": new Date("2014-06-20T08:30:00")
},{
"FirstName":"Linda",
"LastName":"Farmer",
"School":"Agriculture",
"StartDate": new Date("2014-06-20T08:30:00")
},{
"FirstName":"Fred",
"LastName":"Fisher",
"School":"Environmental Sciences",
"StartDate": new Date("2017-10-16T17:32:00")
}
];

try {
const count = await StudentMongooseModel.countDocuments();
if (count === 0) {
await StudentMongooseModel.insertMany(data);
res.json({ message: 'Successfully inserted student data!' });
} else {
res.json({ message: 'Collection is not empty, no data inserted.' });
}
} catch (error) {
res.status(500).send(error);
}

}
}
Add this instance variable to the Routes class in routes/index.ts and resolve the class:
studentController: StudentController = new StudentController();
Add these routes to routes/index.ts:
// Get all students
app.route('/api/students')
.get(this.studentController.getStudents);

// Create a new student
app.route('/api/students')
.post(this.studentController.addNewStudent);

// get a specific student
app.route('/api/students/:studentId')
.get(this.studentController.getStudentById);

// update a specific student
app.route('/api/students/:studentId')
.put(this.studentController.updateStudent);

// delete a specific student
app.route('/api/students/:studentId')
.delete(this.studentController.deleteStudent);

// generate dummy data
app.route('/api/dummy')
.get(this.studentController.generateDummyData);
Notice that the last route, /api/dummy ,is for generating dummy data.
Back in /app/app.ts, import mongoose with:
import mongoose from "mongoose";
Add this method to /app/app.ts:
private mongoSetup(): void{
mongoose.connect('mongodb://localhost:27777/school', {})
.then(() => console.log('connection successful'))
.catch((err) => console.error(err));
}
In the constructor of /app/app.ts, call the above method with:
this.mongoSetup();
Start the server with:
npm run dev
In your browser, point to http://localhost:3000. You should see Hello World.
Next, point your browser to http://localhost:3000/api/dummy. This should create sample data.
Use URL http://localhost:3000/api/students to see the sample data that was just created.