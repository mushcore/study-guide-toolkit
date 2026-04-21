---
id: 4911-topic-six-software-best-practices
title: Six Software Best Practices
pillar: process
priority: high
chapter: ""
tags:
  - process
---

1.  **Develop Iteratively** — mitigates risk via continuous feedback; avoids late surprises
2.  **Manage Requirements** — dynamic + traceable; every requirement → design → test
3.  **Use Component-Based Architectures** — addresses brittle architecture, enables reuse
4.  **Model Visually (UML)** — use-case, class, sequence, deployment diagrams; reduces ambiguity
5.  **Verify Quality** — continuous testing; unit/integration/system/acceptance
6.  **Control Changes** — CM + version control; prevent chaos from ad-hoc edits

#### Root-cause mapping

| Root Cause | Addressed By |
| --- | --- |
| Insufficient requirements | Manage Requirements |
| Ambiguous communication | Model Visually; Manage Requirements |
| Brittle architectures | Component-Based Architectures |
| Overwhelming complexity | Component-Based; Model Visually |
| Undetected inconsistencies | Model Visually; Verify Quality |
| Poor testing | Verify Quality |
| Waterfall delays | Develop Iteratively |
| Uncontrolled change | Control Changes |

#### Waterfall vs Iterative risk curve

Waterfall: high risk sustained until late → problems surface near end → expensive fix. Iterative: risk reduced continuously → problems surface early → course-correct cheaply.
