<!-- converted from students_react_TS_SCRIPT.docx -->

Intro to React with Vite & Typescript
https://apipool.azurewebsites.net/api/students
# Getting Started
We will generate a Typescript React application using the Vite template generator:
npm create vite@latest students-react-ts -- --template react-ts
cd students-react-ts
npm install
npm run dev

Point your browser to the address displayed. This is what the page looks like:

Make these changes to tsconfig.app.json:
"verbatimModuleSyntax": false
"erasableSyntaxOnly": false
Install the following packages:
npm install react-router-dom@6.21.1
npm install bootstrap@5.3.3 -D
Open application in VS Code.
Create /src/pages folder.
In /src/pages folder, create HomePage.tsx with content:
import {ReactNode} from "react";

type HomePageProps = {
title?: string;
subtitle?: string;
children: ReactNode;
};

const HomePage = ({ title = "Title", subtitle = "Subtitle", children }: HomePageProps) => {
return (
<div>
<h1>{title}</h1>
<p>{subtitle}</p>
<p>{children}</p>
</div>
);
};

export default HomePage;
Replace src/App.tsx with:
import "bootstrap/dist/css/bootstrap.css";
import HomePage from "./pages/HomePage"

function App() {

return (
<>
<div className="container">
<HomePage title={"Hello, welcome to students-react with TypeScript!"}
subtitle={"You can view some of your favorite students here."}>
Surely, school is fun.
</HomePage>
</div>
</>
);
}

export default App;
http://localhost:#### / shows new content:

To align the text to the top-left, make the following changes:
index.css	>>	body	>>	comment out “display: flex;”
comment out “place-items: center;”
# Routing
You might ask, where is the App component being loaded? The answer is in main.tsx. We will replace the App component in main.tsx with a routing component.
Create a folder src/routes, then add to it a file named Routes.tsx with this code:
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import App from "../App";

/**
* The router configuration for the application.
*/
export const router = createBrowserRouter([
{
path: "/",
element: <App />,
children: [
{
path: "/",
element: (
<HomePage
title={"Hello, welcome to students-react with Typescript!"}
subtitle={"You can view some of your favorite students here."}
>
Surely, school is fun.
</HomePage>
),
},

],
},
]);
Note that the above routing component uses the App component for the / route. We will use this routing component in main.tsx.
Import the following into main.tsx:
import {router} from './routes/Routes'
import { RouterProvider } from 'react-router'
In the same main.tsx file, delete this import:
import App from './App.tsx'
Also, in main.tsx, replace <App /> with:
<RouterProvider router={router} />
Finally, in App.tsx, add the following import:
import { Outlet } from "react-router"
Replace the <HomePage> component with:
<Outlet />
Delete the HomePage import:
import HomePage from "./pages/HomePage";
Check the app in your browser, there is no change.

Let’s create three more pages. Create src/pages/AboutPage.tsx, src/pages/StudentListPage.tsx and src/pages/StudentDetailPage.tsx
Contents of AboutPage.tsx:
type AboutPageProps = {
message: string;
};

const AboutPage = ({message}: AboutPageProps) => {
return (
<section>
<h3>{message}</h3>
</section>
);
};

export default AboutPage;
Contents of StudentListPage.tsx:
const StudentListPage = () => {
return (
<section>
<h1>Student List Page</h1>
</section>
);
};
export default StudentListPage;
Contents of StudentDetailPage.tsx:
const StudentDetailPage = () => {
return (
<section>
<h1>Student Detail Page</h1>
</section>
);
};
export default StudentDetailPage;
Import all new pages into routes/Routes.tsx:
import AboutPage from '../pages/AboutPage';
import StudentListPage from '../pages/StudentListPage';
import StudentDetailPage from '../pages/StudentDetailPage';
Append the following routes in routes/Routes.tsx in the children[] array:
{
path: "/about",
element: <AboutPage message={"Application that uses student data."} />,
},
{
path: "/list",
element: <StudentListPage />,
},
{
path: "/detail",
element: <StudentDetailPage />,
},
In your browser, point to:
http://localhost:????/about
http://localhost:????/list
http://localhost:????/detail

# Navigation
We need to implement simple navigation into our web app.
Create folder src/components and add to it file NavBar.tsx with code:
import { Link } from "react-router-dom";
import reactLogo from "../assets/react.svg";

const NavBar = () => {
return (
<nav className="navbar navbar-expand-sm bg-primary navbar-dark">
<a className="navbar-brand" href="#">
<img src={reactLogo} width="30" height="30" alt="" />
school
</a>
<div className="collapse navbar-collapse" id="navbarSupportedContent">
<ul className="navbar-nav mr-auto">
<li className="nav-item active">
<Link className="nav-link" to="/">
Home
</Link>
</li>
<li className="nav-item">
<Link className="nav-link" to="/about">
About
</Link>
</li>
<li className="nav-item">
<Link className="nav-link" to="/list">
Student List
</Link>
</li>
</ul>
</div>
<a className="navbar-brand" href="/">
TypeScript version
</a>
</nav>
);
};

export default NavBar;
Import our new navigation into src/App.tsx:
import NavBar from './components/NavBar';
Add the <NavBar /> component just above <Outlet />.
You will see top navigation in the app:

# Page not found
Let’s add a NotFoundPage.tsx component to src/components folder with the following code:
export default function NotFoundPage()  {
return <h1>404: Page Not Found</h1>;
}
Let’s add a catch-all route in routes/Routes.tsx. Add this import to the file:
import NotFoundPage from "../components/NotFoundPage";
Add this at the bottom of the routes list inside the children[] array:
{
path: "*",
element: <NotFoundPage />,
},
The user will get error code 404 if he/she tries to access an incorrect route like http://localhost:####/bad:

# REST
We will access a REST endpoint at:
https://apipool.azurewebsites.net/api/students
Create a src/config folder, then add to it a file named index.ts with the following code that points to the base URL of our REST endpoint:
const Config = {
API_BASE_URL: `https://apipool.azurewebsites.net/api/`,
};

export default Config;
Create a src/models folder and add to it a Student class in a file named Student.ts. Add the following code to Student.ts:
export class Student {
constructor(public studentId: number, public firstName: string,
public lastName: string, public school: string) {

}
}
### Listing students on StudentListPage
Add a file src/components/StudentList.tsx with the following code:
import { useState, useEffect } from "react";
import { Student } from "../models/Student";
import Config from "../config";

type Props = {
exceptId?: number;
};

const StudentList = ({ exceptId = undefined }: Props) => {

const [studentInfo, setStudentInfo] = useState([]);

const getData = async () => {
const response = await fetch(`${Config.API_BASE_URL}students/`, {
method: "GET",
headers: {
"Content-Type": "application/json",
Accept: "application/json",
},
});

const jsonData = await response.json();
setStudentInfo(jsonData);
};

useEffect(() => {
getData();
}, []);

let filteredStudents = studentInfo;

if (exceptId !== undefined) {
filteredStudents = studentInfo.filter(
(p: Student) => p.studentId !== +exceptId
);
}

return (
<div>
{filteredStudents.map((student: Student, index) => (
<h6 className="text-muted" key={index}>
{student.studentId} {student.firstName} {student.lastName}
</h6>
))}
</div>
);
};

export default StudentList;

Let us add the StudentList component to the StudentListPage so that we can display the list of students. Add the following import statement to pages/StudentListPage.tsx:
import StudentList from "../components/StudentList";
Add the <StudentList /> component to pages/StudentListPage.tsx  right after <h1> . . . </h1>. The list of students should display:

### Displaying Student Details
We will enhance the StudentDetailPage.tsx page with URL parameters. In src/routes/Routes.tsx change /detail route path to:
path: "/detail/:id"
Change code in StudentDetailPage.js to:
import { useParams } from "react-router-dom";
import StudentList from "../components/StudentList";
import NotFoundPage from "../components/NotFoundPage";
import { useState, useEffect } from "react";
import Config from "../config/";
import { Student } from "../models/Student";

const StudentDetailPage = () => {
const { id } = useParams();
const [studentInfo, setStudentInfo] = useState<Student>({
studentId: 0,
firstName: "",
lastName: "",
school: "",
});

useEffect(() => {
const fetchData = async () => {
const result = await fetch(`${Config.API_BASE_URL}students/${id}`);
const body = await result.json();
//console.log(body);
setStudentInfo(body);
};
fetchData();
}, [id]);

if (studentInfo.studentId === 0) return <NotFoundPage />;

return (
<section>
<div style={{ width: "20%", float: "right" }}>
<h3>Others:</h3>
<StudentList exceptId={studentInfo.studentId} />
</div>

<h4 className="text-muted">Student ID={studentInfo.studentId}</h4>
<div>
<b>Name: </b>
{studentInfo.firstName} {studentInfo.lastName}
</div>
<div>
<b>school: </b>
{studentInfo.school}
</div>
</section>
);
};

export default StudentDetailPage;
Navigate to http://localhost:####/detail/9. This will display student with ID=9:

Note that whenever details of a student are displayed on the left-side, it is dropped from the list on the right-side. This is because of exceptId in <StudentList exceptId={studentInfo.studentId} />.
### Making items in the list clickable
Add the following import statement to src/components/StudentList.tsx:
import { Link } from "react-router-dom";
In components/StudentList.tsx, surround the <h6> tag with:
<Link to={`/detail/${student.studentId}`}>
. . . .
</Link>
Now, whenever you click on an item in the list, details about that item are displayed.
# Creating a specialized List component
Let us create a List component that specializes in the display of any list. We will use generics to develop the component and show off the power of Typescript.
Create file components/List.tsx with the following code:
import { ReactNode } from "react";

interface ListProps<T> {
items: T[];
render: (item: T) => ReactNode;
}

const List = <T,>({ items, render }: ListProps<T>) => {
return (
<>
{items.map((item, index) => (
<span key={index}>{render(item)}</span>
))}
</>
);
};

export default List;
This component takes a generic array of items and requires implementation of the render method. Let’s use in in src/components/StudentList.tsx. Add the following import to components/StudentList.tsx:
import List from "./List";
Replace <div> … </div> in components/StudentList.tsx with:
<div>
<List
items={filteredStudents}
render={(student: Student) => (
<Link to={`/detail/${student.studentId}`}>
<h6 className="text-muted">
{student.studentId} {student.firstName} {student.lastName}
</h6>
</Link>
)}
/>
</div>
The application behaves as expected.
Note that our List component is very flexible and can be used with any arrray containing any types of objects.
### Creating a form for adding students
In src/components folder, add AddStudentForm.tsx with following code:
import { useState} from "react";
import Config from "../config/";
import { useNavigate } from 'react-router-dom';
import { Student } from "../models/Student";

const AddStudentForm = () => {
const [studentInfo, setStudentInfo] = useState<Student>({
studentId: 0,
firstName: "",
lastName: "",
school: "",
});

const navigate = useNavigate();

const addStudent =()=>{
const result = fetch(`${Config.API_BASE_URL}students/`,{
method:'post',
body:JSON.stringify({
firstName: studentInfo.firstName,
lastName: studentInfo.lastName,
school: studentInfo.school,
}),
headers:{'Content-Type':'application/json'}
});
result
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

navigate('/list',{state:{refresh:true}});
}
return(
<div className="panel panel-default">
<form>
<h3>Add Student</h3>
<div className="form-group">
<label>First Name:</label>
<input className="form-control" type="text" placeholder="First Name"
value={studentInfo.firstName}
onChange={(event) => setStudentInfo({...studentInfo, firstName: event.target.value})}  />
</div>
<div className="form-group">
<label>Last Name:</label>
<input className="form-control" type="text" placeholder="Last Name"
value={studentInfo.lastName}
onChange={(event) => setStudentInfo({...studentInfo, lastName: event.target.value})}  />
</div>
<div className="form-group">
<label>School:</label>
<input className="form-control" type="text" placeholder="school"
value={studentInfo.school} onChange={(event) => setStudentInfo({...studentInfo, school: event.target.value})} />
</div>

<input type="submit"
onClick={() => addStudent()} className="btn btn-success" value="Add" />
</form>
</div>
);

}
export default AddStudentForm;
Import AddStudentForm into StudentDetailPage.js
import AddStudentForm from '../components/AddStudentForm';
Add AddStudentForm component to StudentDetailPage.js just before the closing </section> tag.
<div style={{ width: "50%", float: "left" }}>
<hr />
<AddStudentForm />
</div>
In browser, view a student and try the add form. Add data. You should see the new student appear in the list.



# Azure Static Web App


| Name | Value |
| --- | --- |
| DATABASE_CONNECTION_STRING | Server=tcp:static-web-apps-db-server.database.windows.net,1433;Initial Catalog=static-web-apps-lesson;Persist Security Info=False;User ID=static-web-apps;Password=DB0admin-user;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30; |