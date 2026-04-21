---
"n": 3
id: 4736-lesson-mutual-exclusion-solutions-the-spectrum
title: Mutual exclusion solutions — the spectrum
hook: From disabling interrupts to monitors. Each fixes a problem the previous caused.
tags:
  - sync
module: IPC & Synchronization
---

The slides walk through a spectrum of mutual exclusion solutions, each fixing the last's flaw. Read the comparison first for the map, then the per-approach notes for the mechanism:

#### Comparison at a glance

| Solution | Works? | Busy-wait? | Multi-CPU safe? | Why it was replaced |
| --- | --- | --- | --- | --- |
| Disabling interrupts | Single CPU only | N/A | No | Unsafe for user code; useless on multi-core |
| Lock variable | No | Yes | No | Read + set not atomic → both enter CS |
| Strict alternation | Partial | Yes | Yes | Non-CS process can block CS-bound process (rule #3) |
| Peterson's | Yes (2 procs) | Yes | Yes (w/ memory barriers) | CPU-burn; hard to extend to N procs |
| TSL / XCHG | Yes | Yes | Yes | Hardware atomic, but still burns CPU |
| Sleep/wakeup | Partial | No | Yes | Lost-wakeup problem |
| Semaphores | Yes | No | Yes | Fixes lost wakeup via atomic counter |
| Monitors | Yes | No | Yes | Language-level; mutex automatic |

#### 1\. Disabling interrupts

Works on single-CPU but unsafe for user programs; useless on multi-core.

#### 2\. Lock variable

A shared `lock` variable. Doesn't work alone — checking + setting isn't atomic.

#### 3\. Strict alternation

Take turns via `turn` variable. Violates condition #3 (non-CS process can block CS-bound process).

#### 4\. Peterson's solution (2 processes)

```c
int turn;
int interested[2];          // both false initially

void enter_region(int p) {
  int other = 1 - p;
  interested[p] = TRUE;     // announce interest
  turn = p;                 // defer: set turn to YOURSELF
  while (interested[other] && turn == p) ;  // busy wait
}
void leave_region(int p) { interested[p] = FALSE; }
```

Works for exactly 2 processes. Uses **busy waiting**.

<svg viewBox="0 0 720 280" preserveAspectRatio="xMidYMid meet"><text x="20" y="22" class="label-accent">Both threads race in — the deference trick decides who waits</text><rect x="20" y="40" width="320" height="220" class="box" rx="6"></rect><text x="180" y="62" text-anchor="middle" class="label">Process 0 (p=0)</text><rect x="40" y="78" width="280" height="30" class="box-accent" rx="3"></rect><text x="180" y="98" text-anchor="middle" class="sub">interested[0] = TRUE</text><rect x="40" y="116" width="280" height="30" class="box-accent" rx="3"></rect><text x="180" y="136" text-anchor="middle" class="sub">turn = 0  (defer to self)</text><rect x="40" y="154" width="280" height="30" class="box-warn" rx="3"></rect><text x="180" y="174" text-anchor="middle" class="sub">while(interested[1] &amp;&amp; turn==1) spin</text><text x="180" y="200" text-anchor="middle" class="sub">turn==1 (P1 wrote later) → not 1? false → enters</text><rect x="40" y="215" width="280" height="30" class="box-ok" rx="3"></rect><text x="180" y="235" text-anchor="middle" class="sub">ENTERS CS</text><rect x="380" y="40" width="320" height="220" class="box" rx="6"></rect><text x="540" y="62" text-anchor="middle" class="label">Process 1 (p=1) — wrote turn LAST</text><rect x="400" y="78" width="280" height="30" class="box-accent" rx="3"></rect><text x="540" y="98" text-anchor="middle" class="sub">interested[1] = TRUE</text><rect x="400" y="116" width="280" height="30" class="box-accent" rx="3"></rect><text x="540" y="136" text-anchor="middle" class="sub">turn = 1  (overwrites 0)</text><rect x="400" y="154" width="280" height="30" class="box-bad" rx="3"></rect><text x="540" y="174" text-anchor="middle" class="sub">while(interested[0] &amp;&amp; turn==1) spin</text><text x="540" y="200" text-anchor="middle" class="sub">both true → keeps spinning</text><rect x="400" y="215" width="280" height="30" class="box-bad" rx="3"></rect><text x="540" y="235" text-anchor="middle" class="sub">WAITS</text></svg>

**The trick:** `turn = p` writes your OWN id. The later writer loses — sees `turn == p` true → spins. The other sees `turn != p` → enters CS.

#### 5\. TSL (Test-and-Set Lock)

Hardware instruction `TSL RX, LOCK` atomically reads LOCK into RX and sets LOCK to 1. Spin until you see old value 0. Intel calls it `XCHG` (with `lock` prefix).

#### 6\. Sleep/wakeup

Replace busy wait with `sleep()`; producer/consumer calls `wakeup()`. **Lost wakeup problem**: wakeup arrives before sleep, is ignored, process sleeps forever.

#### 7\. Semaphores

Fix lost wakeup by making counter atomic. (Lesson 2.)

#### 8\. Monitors

A language-level construct. Only one process can be active in the monitor at a time (automatic mutex). Uses **condition variables** with `wait()` and `signal()`.

> **Takeaway**
> Busy waiting burns CPU. Blocking (semaphores, monitors) doesn't. On exam, if asked "which costs CPU while waiting?" → TSL, Peterson's, lock variables, strict alternation.

> **Q:** Peterson's solution sets `turn = p` (its own id), not the other's. Why?
> **A:** Deference trick. If both enter simultaneously, the later write to `turn` wins — but "wins" means losing the contest, since `turn == p` keeps p waiting. This breaks ties.
