---
id: 4736-topic-page-replacement-algorithms
title: Page replacement algorithms
pillar: tech
priority: low
chapter: Part 10
tags:
  - paging
  - memory
---

-   **Optimal** — evict furthest-future use. Benchmark only.
-   **FIFO** — evict oldest. Suffers Belady's anomaly.
-   **Second Chance** — FIFO skip if R=1 (clear R, move to back).
-   **Clock** — Second Chance on circular list.
-   **LRU** — least recently used.
-   **NFU** — not frequently used (counters).
-   **Aging** — NFU with bit-shift weighting.
-   **WS / WSClock** — working-set-based.

**Belady's anomaly:** FIFO can worsen with more frames. LRU + Optimal do not.
