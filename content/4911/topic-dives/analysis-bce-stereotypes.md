---
id: 4911-topic-analysis-bce-stereotypes
title: Analysis — BCE Stereotypes
pillar: process
priority: high
chapter: ""
tags:
  - analysis
  - process
---

Analysis model = technology-independent (what), Design model = technology-dependent (how).

| Stereotype | Role | Rule |
| --- | --- | --- |
| **Boundary** | UI, external interfaces (web page, API client) | One per *actor-usecase* pair |
| **Control** | Orchestrates workflow for a use case | Typically one per use case |
| **Entity** | Persistent domain object, important state | Derived from domain model |

-   Diagrams used: class diagram (structure), **collaboration diagram** (interactions — Quiz 4 Q17)
-   **System Analyst** owns integrity of the analysis model as a whole (Quiz 4 Q18)
-   **Architect** defines architecture-significant classes
-   **Use-case engineer** owns individual UC realizations
