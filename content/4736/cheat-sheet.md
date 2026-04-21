---
title: "COMP 4736 — exam-eve cheat sheet"
---

## Core paging formulas

-   **offset\_bits** = log₂(page\_size)
-   **\# pages** = 2^(VA\_bits − offset\_bits)
-   **\# frames** = 2^(PA\_bits − offset\_bits)
-   **PT entries (1-level)** = # pages
-   **PA** = frame# × page\_size + offset
-   **PA** = VA + (frame\_base − page\_base)

## Optimal page size

-   Overhead(p) = se/p + p/2
-   **p\*** = √(2se)
-   Overhead at p\* = √(2se) = p\*
-   1 MB process, 8 B entry → p\* = 4 KB

## Fit algorithms

-   **First**: first hole ≥ req, from start
-   **Best**: smallest hole ≥ req
-   **Worst**: largest hole
-   **Next**: first fit, but from last-alloc cursor
-   **Quick**: per-size lists

## Past-exam Q2 answer key

```text
12  |  10  |  9
first fit:  20  |  10  | 18
best  fit:  12  |  10  |  9
worst fit:  20  |  18  | 15
next  fit:  20  |  18  |  9
```

## Buddy system rules

-   Blocks always powers of 2
-   On alloc: round req up to nearest power of 2
-   Split from largest → half, half until you reach needed size
-   On free: if buddy is entirely free, coalesce. Recurse up.
-   Buddy = same-size block with same parent

## Coffman conditions + attacks

<table><tbody><tr><td>Mutual exclusion</td><td>Spooling</td></tr><tr><td>Hold and wait</td><td>All-at-once OR release-before-req</td></tr><tr><td>No preemption</td><td>Allow preemption</td></tr><tr><td>Circular wait</td><td>Global resource ordering</td></tr></tbody></table>

## Deadlock matrices

-   **E**: total (existing) per resource type
-   **C**\[i\]\[j\]: held by process i
-   **R**\[i\]\[j\]: wanted by process i
-   **A** = E − Σi C\[i\]
-   Step: find i with R\[i\] ≤ A → A += C\[i\], mark i, repeat
-   Unmarked at end → deadlocked

## Semaphore core

-   **P(s)**: if s>0 dec; else block
-   **V(s)**: inc; wake one if blocked
-   Both atomic
-   Binary = lock (init 1). Counting = N resources.
-   Producer-consumer: empty=N, full=0, mutex=1
-   Producer: P(empty);P(mutex);…;V(mutex);V(full)
-   Consumer: P(full);P(mutex);…;V(mutex);V(empty)
-   Swapping P(empty)/P(mutex) → DEADLOCK

## Mutex solutions

-   **Peterson's**: 2 proc, busy wait, uses turn+interested\[\]
-   **TSL/XCHG**: atomic hw, busy wait
-   **Semaphore**: blocking, no lost wakeup
-   **Monitor**: language-level auto mutex + condvars
-   CV signal is LOST if no one waiting

## IPC choice (same host)

<table><tbody><tr><td>Fastest, large data</td><td>Shared memory / mmap</td></tr><tr><td>Byte stream, related</td><td>Pipe</td></tr><tr><td>Byte stream, unrelated</td><td>FIFO (mkfifo)</td></tr><tr><td>Typed messages</td><td>msgget/msgsnd/msgrcv</td></tr><tr><td>Notification</td><td>Signal</td></tr><tr><td>Bidirectional local</td><td>socketpair()</td></tr></tbody></table>

## Linux IPC calls

```c
pipe(fd)
mkfifo("p",0666)
shmget/shmat/shmdt/shmctl
msgget/msgsnd/msgrcv
sem_open/sem_wait/sem_post
socket/bind/listen/accept/connect
mmap(MAP_SHARED)
signal(SIGUSR1, h)/raise/kill
ipcs            // list IPC objects
```

## Page replacement

-   **Optimal**: furthest future (benchmark)
-   **FIFO**: oldest — Belady's anomaly risk
-   **Second Chance**: FIFO + referenced bit
-   **Clock**: 2nd-chance on circular list
-   **LRU**: least recently used
-   **NFU**, **Aging**, **WS/WSClock**

## TLB

-   Small cache in MMU (8-256 entries)
-   **Hit**: translation found
-   **Soft miss**: in memory, not TLB → refill
-   **Hard miss**: not in memory → page fault → disk

## PT entry fields

-   Present/absent bit
-   Page frame number
-   Protection (R/W/X)
-   Modified (dirty) bit
-   Referenced bit
-   Caching-disabled bit

## Bit splitting for 2-level PT

```text
6-bit VA, 2/2/2 split:
addr = TTSSOO
  T = top-level index (bits 5-4)
  S = second-level index (bits 3-2)
  O = offset within page (bits 1-0)

Ex: 37 = 100101
  top=10=2, second=01=1, offset=01=1
  PA = 2nd_table[top][second] × page_size + offset
```

## Constants

-   1 KB = 2^10, 1 MB = 2^20, 1 GB = 2^30
-   4 KB = 2^12 (typical page)
-   8 KB = 2^13
-   64 bit systems use multi-level PTs
-   Working set = pages ref'd in last Δ time

## Quick facts

-   SIGKILL, SIGSTOP uncatchable
-   Pipes unidirectional, related-only
-   MAP\_SHARED vs MAP\_PRIVATE (COW)
-   Thrashing: reduce multiprogramming
-   Internal frag = wasted INSIDE block
-   External frag = wasted BETWEEN blocks

## Deadlock recovery

-   **Preemption**: take a resource back
-   **Rollback**: checkpoint + restore
-   **Kill**: one or more processes in cycle
-   **Ostrich**: ignore (UNIX/Windows default)

## Memory formulas — quick reference

**Bit splits.** Given page size `P = 2^k`, virtual address `V` bits, physical address `Phys` bits:
- `offset_bits = k`
- `vpage_bits = V − k`
- `frame_bits = Phys − k`
- `#pages = 2^(V − k)`
- `#frames = 2^(Phys − k)`
- Linear PT entries = `2^(V − k)` (one per virtual page)

**Address translation.** Given `VP → frame`:
- `offset = VA mod P`
- `PA = frame × P + offset`
- Formula form: `Y = x + (a − A)` where `x = VA`, `A = page base`, `a = frame base`

**EAT (effective access time) with TLB.** Given TLB lookup `t_T`, memory access `t_M`, PT walk = one extra `t_M`:
- `EAT = hit × (t_T + t_M) + (1 − hit) × (t_T + 2·t_M)`

**Overhead / optimal page size.** Given process size `s`, PT entry size `e`, page size `p`:
- `Overhead(p) = s·e/p + p/2`
- Minimize: `p* = √(2se)` → `Overhead(p*) = √(2se) = p*`
- Classic: `s = 1 MB, e = 8 B → p* = 4 KB`

**Buddy system.**
- Allocated block size = next power of 2 ≥ `max(request, min_block)`
- Internal fragmentation = block − request (worst case ≈ 50% at `request = 2^k + 1`)
- Coalesce: merge two buddies only when both are wholly free (no busy descendants)

**Banker's algorithm.**
- `Need = Max − Has`
- `Available = Total − Σ Has`
- Safe if some ordering of processes satisfies `Need[i] ≤ Available` at every step (releasing `Has[i]` after each)

**Deadlock detection (matrix).**
- `A[j] = E[j] − Σ_i C[i][j]` (available = existing − allocated)
- Process `i` is satisfiable iff `R[i] ≤ A` (component-wise)
- On mark: `A ← A + C[i]` (its held resources return)
- Terminates: all marked → safe; none satisfiable → remaining processes deadlocked
