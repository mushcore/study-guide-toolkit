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
