---
id: 4736-topic-mutual-exclusion-spectrum
title: Mutual exclusion spectrum
pillar: tech
priority: high
chapter: Part 6/7
tags:
  - sync
---

| Solution | Works? | Notes |
| --- | --- | --- |
| Disabling interrupts | Single CPU only | Unsafe for user programs |
| Lock variable | No | Read + set not atomic |
| Strict alternation | Partial | Violates rule 3 |
| Peterson's | Yes (2 processes) | Busy wait |
| TSL / XCHG | Yes | Hardware atomic; busy wait |
| Sleep/wakeup | Partial | Lost wakeup problem |
| Semaphores | Yes | Fixes lost wakeup |
| Monitors | Yes | Language-level |
