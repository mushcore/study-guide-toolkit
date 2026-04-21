---
id: 4911-topic-use-case-driven-development
title: Use-Case Driven Development
pillar: process
priority: high
chapter: ""
tags:
  - use-cases
  - process
---

Use cases are the **primary artifact** — they drive the entire process.

#### What UCs drive

-   **Requirements** — UCs capture functional requirements
-   **Analysis** — each UC decomposed into analysis classes (BCE)
-   **Design** — design model refines analysis; use-case realizations in sequence diagrams
-   **Implementation** — UCs → components; guides build order
-   **Test** — each UC → test cases (main flow + alternates)
-   **Iteration planning** — prioritized UCs picked per iteration

#### Use-case structure

-   **Actor** — external entity (user, system, hardware)
-   **Main flow** — happy path to goal
-   **Alternate flows** — exceptions, variations
-   **Preconditions / postconditions**
-   **Extension points** — for include/extend relationships

#### Use-case realization

How a UC is implemented by objects. In **Analysis**: class + collaboration diagrams of analysis classes. In **Design**: sequence diagrams of design classes. Each UC has one realization per model.
