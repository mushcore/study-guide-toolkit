<!-- converted from EF lab.docx -->

EF lab
## Prerequisites
You need to have the sqlite3 command-line executable installed and accessible from your terminal or command prompt.
- Create a SQL Script File
First, create a text file that contains the SQL commands to create your tables and insert data. Let's name this file database_setup.sql. Add this content to it:
CREATE TABLE departments (
department_id INTEGER PRIMARY KEY,
department_name TEXT NOT NULL
);

-- Insert department data
INSERT INTO departments (department_name) VALUES ('Sales');
INSERT INTO departments (department_name) VALUES ('Engineering');
INSERT INTO departments (department_name) VALUES ('Marketing');

-- Create the 'employees' table
CREATE TABLE employees (
employee_id INTEGER PRIMARY KEY,
first_name TEXT NOT NULL,
last_name TEXT NOT NULL,
department_id INTEGER,
FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Insert some sample data
INSERT INTO employees (first_name, last_name, department_id) VALUES ('John', 'Doe', 1);
INSERT INTO employees (first_name, last_name, department_id) VALUES ('Jane', 'Smith', 2);
INSERT INTO employees (first_name, last_name, department_id) VALUES ('Peter', 'Jones', 1);
INSERT INTO employees (first_name, last_name, department_id) VALUES ('Fred', 'Smith', 3);
INSERT INTO employees (first_name, last_name, department_id) VALUES ('Jane', 'French', 3);

- Load the Script into SQLite
You can execute this script to create a new database file (e.g., company.db) using the following command in your terminal or command prompt:
sqlite3 company.db < database_setup.sql
Explanation of the command:
sqlite3: This launches the SQLite command-line tool.
company.db: This specifies the name of the database file you want to create or use. If it doesn't exist, SQLite will create it.
< database_setup.sql: This is a shell redirection operator that pipes the contents of the database_setup.sql file as input to the sqlite3 command.
- Verify the Results
To confirm that your tables were created and the data was inserted correctly, you can open the database using the sqlite3 shell and run a query:
sqlite3 company.db
Once inside the SQLite prompt (sqlite>), run the following commands:
sqlite
sqlite> .tables
departments  employees
sqlite> SELECT * FROM employees;
1|John|Doe|Sales
2|Jane|Smith|Engineering
3|Peter|Jones|Sales
sqlite> .quit
The .tables command should list the departments and employees tables, and the SELECT query should display the data you inserted, confirming the script was executed successfully.
## What Next?
Create a console application that does the following:
- Reverse-engineer the database into a command-line application with the dotnet-ef tool.
- Request the user to enter data for a new department.
- Request the user to enter the data for an employee.
- Display the list of employees in each department
- Display a count of employees in each department using a GroupBy EF statement using the Method Syntax
- Display a count of employees in each department using a GroupBy EF statement using the Query Syntax
## Marking
When you are done, demonstrate to your instructor your solution.