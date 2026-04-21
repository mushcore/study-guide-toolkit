<!-- converted from file-based-apps-lab.docx -->

File Based C# Apps - LAB
Create a file‑based app that reads a JSON file and prints a summary based on filters.
mkdir FilteredStudents
cd FilteredStudents
echo $null > filterStudents.cs
echo $null > students.json
Copy JSON file from the following URL and paste it into JSON file named students.json:
https://gist.githubusercontent.com/medhatelmasry/2ae7a36d5392f862b0d1039b2a52b9b4/raw/45533eda6c43ce439dbc65c37a7fbdef01546c2d/students.json
Use package Spectre.Console — it is a popular package that makes console output visually impressive with minimal code. Student data could be displayed in plain text as a beautifully formatted table with colors and borders.
Add the following inline dependency at the top of filterStudents.cs:
#:package Spectre.Console@0.49.1
Write code that:
- Reads a file named students.json into a list of student objects
- Filter students by keyword (example: Medicine, Liz, Fox, 2002, etc…)
Run the app:
dotnet run filterStudents.cs -- medicine
dotnet run filterStudents.cs -- liz
dotnet run filterStudents.cs -- fox
dotnet run filterStudents.cs -- 2002
NOTE: The -- separates dotnet run arguments from your app's arguments.
### Expected Output:
dotnet run filterStudents.cs -- medicine
Students Matching 'medicine' (5)
╭────┬────────────┬───────────┬──────────┬────────┬────────────╮
│ ID │ First Name │ Last Name │ School   │ Gender │    DOB     │
├────┼────────────┼───────────┼──────────┼────────┼────────────┤
│ 8  │ Dan        │ Ash       │ Medicine │ Male   │ 1994-03-19 │
│ 16 │ Mia        │ Chu       │ Medicine │ Female │ 2001-07-15 │
│ 21 │ Mat        │ Tan       │ Medicine │ Male   │ 1997-12-10 │
│ 22 │ Deb        │ Roy       │ Medicine │ Female │ 1996-07-21 │
│ 35 │ Cat        │ Yao       │ Medicine │ Female │ 1994-06-28 │
╰────┴────────────┴───────────┴──────────┴────────┴────────────╯
dotnet run filterStudents.cs -- liz
Students Matching 'liz' (5)
╭────┬────────────┬───────────┬──────────┬────────┬────────────╮
│ ID │ First Name │ Last Name │ School   │ Gender │    DOB     │
├────┼────────────┼───────────┼──────────┼────────┼────────────┤
│ 20 │ Liz        │ Kit       │ Nursing  │ Female │ 2002-06-30 │
│ 32 │ Liz        │ Jin       │ Nursing  │ Female │ 1998-08-21 │
│ 53 │ Liz        │ Dag       │ Business │ Female │ 1998-11-13 │
│ 68 │ Liz        │ Kim       │ Nursing  │ Female │ 1997-11-16 │
│ 75 │ Liz        │ Car       │ Nursing  │ Female │ 2000-01-23 │
╰────┴────────────┴───────────┴──────────┴────────┴────────────╯
dotnet run filterStudents.cs -- fox
Students Matching 'fox' (2)
╭────┬────────────┬───────────┬───────────┬────────┬────────────╮
│ ID │ First Name │ Last Name │ School    │ Gender │    DOB     │
├────┼────────────┼───────────┼───────────┼────────┼────────────┤
│ 4  │ Sue        │ Fox       │ Computing │ Female │ 1997-12-05 │
│ 95 │ Lia        │ Fox       │ Mining    │ Female │ 1996-02-14 │
╰────┴────────────┴───────────┴───────────┴────────┴────────────╯
dotnet run filterStudents.cs -- 2002
Students Matching '2002' (6)
╭─────┬────────────┬───────────┬──────────┬────────┬────────────╮
│ ID  │ First Name │ Last Name │ School   │ Gender │    DOB     │
├─────┼────────────┼───────────┼──────────┼────────┼────────────┤
│  6  │ Zoe        │ Cox       │ Business │ Female │ 2002-02-15 │
│ 20  │ Liz        │ Kit       │ Nursing  │ Female │ 2002-06-30 │
│ 44  │ Roy        │ Kim       │ Mining   │ Male   │ 2002-05-09 │
│ 79  │ Avi        │ Gil       │ Business │ Male   │ 2002-04-02 │
│ 90  │ Ari        │ Sim       │ Mining   │ Male   │ 2002-07-20 │
│ 104 │ Kit        │ Doe       │ Business │ Male   │ 2002-01-09 │
╰─────┴────────────┴───────────┴──────────┴────────┴────────────╯
