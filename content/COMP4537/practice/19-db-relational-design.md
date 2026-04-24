---
n: 19
id: db-relational-design
title: "Design a relational schema: patient visits"
lang: sql
tags: [MySQL, primary-key, foreign-key, 1NF, 2NF, referential-integrity, 1:M]
source: "Slide 7, Quiz 10"
pedagogy: productive-failure
kind: code
---

## Prompt

A clinic tracks patients and their visit dates. The requirements are:

- Each patient has a unique ID and a name.
- Each visit records which patient attended and on which date.
- One patient can have many visits.
- A visit row must always belong to a valid patient.

Design two SQL tables that satisfy these requirements. Declare all primary keys and foreign keys explicitly.

The entity-relationship diagram below shows the target schema:

<svg xmlns="http://www.w3.org/2000/svg" width="520" height="180" font-family="monospace" font-size="13">
  <!-- Patient box -->
  <rect x="20" y="30" width="180" height="120" rx="4" fill="#f0f4ff" stroke="#3b5bdb" stroke-width="2"/>
  <rect x="20" y="30" width="180" height="28" rx="4" fill="#3b5bdb"/>
  <text x="110" y="49" text-anchor="middle" fill="white" font-weight="bold">Patient</text>
  <text x="34" y="77" fill="#222">patientid  INT  PK</text>
  <text x="34" y="98" fill="#222">name  VARCHAR(100)</text>

  <!-- Visit box -->
  <rect x="320" y="30" width="180" height="135" rx="4" fill="#f0f4ff" stroke="#3b5bdb" stroke-width="2"/>
  <rect x="320" y="30" width="180" height="28" rx="4" fill="#3b5bdb"/>
  <text x="410" y="49" text-anchor="middle" fill="white" font-weight="bold">Visit</text>
  <text x="334" y="77" fill="#222">visitid  INT  PK</text>
  <text x="334" y="98" fill="#222">patientid  INT  FK</text>
  <text x="334" y="119" fill="#222">visitDate  DATE</text>

  <!-- Arrow line -->
  <line x1="200" y1="90" x2="320" y2="90" stroke="#555" stroke-width="2" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker>
  </defs>

  <!-- 1:M label -->
  <text x="210" y="84" fill="#3b5bdb" font-weight="bold">1</text>
  <text x="297" y="84" fill="#3b5bdb" font-weight="bold">M</text>
</svg>

---

## Starter

Fill in the missing `PRIMARY KEY` and `FOREIGN KEY` constraints:

```sql
CREATE TABLE `patient` (
  `patientid` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
  -- TODO: declare the primary key
);

CREATE TABLE `visit` (
  `visitid` int(11) NOT NULL,
  `patientid` int(11) NOT NULL,
  `visitDate` date NOT NULL
  -- TODO: declare the primary key for visitid
  -- TODO: declare the foreign key referencing patient
);
```

---

## Solution

```sql
CREATE TABLE `patient` (
  `patientid` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY(patientid)
);

CREATE TABLE `visit` (
  `visitid` int(11) NOT NULL,
  `patientid` int(11) NOT NULL,
  `visitDate` date NOT NULL,
  PRIMARY KEY(visitid),
  CONSTRAINT fk_has_patient FOREIGN KEY(patientid)
           REFERENCES patient(patientid)
);

INSERT INTO patient VALUES (1,'Sara Brown'),(2,'John Smith'),(3,'Jack Ma');
INSERT INTO visit VALUES (1,1,'2002-01-01'),(2,2,'2018-08-08'),(3,2,'2019-09-09');
```

---

## Why

**The parent table must be created first.** The `visit` table's foreign key constraint references `patient(patientid)`. MySQL resolves that reference at table-creation time. Attempting to create `visit` before `patient` exists raises an error — the referenced table is not yet in the schema.

**AUTO_INCREMENT removes manual ID tracking.** Declaring `patientid int AUTO_INCREMENT` lets the database assign the next unique integer on every INSERT. Without it, every INSERT must supply a unique value manually. Collisions or gaps become the application's responsibility.

**One-table approach violates 2NF.** Storing `patientid, name, visitDate` all in one table repeats the patient name on every visit row. The `name` column depends on `patientid`, but `visitDate` depends on the visit event — not on the patient alone. That mixed dependency violates second normal form (2NF). Splitting into two tables gives each column exactly one entity to describe.

**Common wrong approach — single-table design:**

```sql
-- Wrong: mixes two entities; violates 2NF
CREATE TABLE patient_visit (
  patientid INT NOT NULL,
  name VARCHAR(100),
  visitDate DATE,
  PRIMARY KEY(patientid)  -- wrong: patientid is not unique per visit
);
```

This fails for two reasons: `patientid` cannot be the primary key because the same patient can appear on multiple visit rows, and `name` repeats redundantly on every row. Splitting into `patient` and `visit` tables, each with its own primary key, resolves both problems.
